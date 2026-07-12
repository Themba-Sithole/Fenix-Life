import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  createSaveId,
  createFreshStartWorld,
  deriveYoungAdultStartDate,
  ensureWorldV2,
  ONBOARDING_FIRST_YEAR_DAYS,
  parseWorldSeed,
  type TimeScale,
  type WorldInstance,
  type PlayerAction,
} from '@fenix/domain';
import {
  createSaveBlobV1,
  formatGameDate,
  parseSaveBlobV1,
  buildWhileYouWereAwaySummary,
  serializeSaveBlobV1,
  type WhileAwaySummary,
} from '@fenix/simulation-engine';
import { ApiError, downloadSaveBlob, uploadSaveBlob } from '@/lib/api';
import { clearOfflineSave, readOfflineSave, writeOfflineSave } from '@/lib/offline-save';
import { isAutosaveEnabled } from '@/lib/player-settings';
import { useSave } from '@/context/SaveContext';
import type { SimulationWorkerRequest, SimulationWorkerResponse } from '@/simulation-bridge/types';
import type { SaveBlobV1 } from '@fenix/simulation-engine';

const BASE_TICK_MS = 4000;

function autosaveEveryTicks(): number {
  return isAutosaveEnabled() ? 1 : Number.POSITIVE_INFINITY;
}

interface SimulationContextValue {
  world: WorldInstance | null;
  currentDate: string | null;
  formattedDate: string | null;
  isPaused: boolean;
  timeScale: TimeScale;
  tickCount: number;
  isLoading: boolean;
  isSaving: boolean;
  isPlayingOffline: boolean;
  loadError: string | null;
  advanceDay: () => Promise<void>;
  setPaused: (paused: boolean) => Promise<void>;
  setTimeScale: (timeScale: TimeScale) => Promise<void>;
  persistNow: () => Promise<void>;
  reloadSimulation: () => Promise<void>;
  transferFunds: (input: {
    fromAccountId: string;
    toAccountId: string;
    amountCents: number;
  }) => Promise<void>;
  applyAction: (action: PlayerAction) => Promise<void>;
  completeChildhoodOnboarding: (simulateFirstYear: boolean) => Promise<void>;
  dismissLifePathHints: () => Promise<void>;
  dismissHomeTour: () => Promise<void>;
  applyCatchUp: (days: number) => Promise<WhileAwaySummary | null>;
  /** Retry uploading offline blob; clears offline banner only after API success. */
  syncNow: () => Promise<boolean>;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

function postAndWait(
  worker: Worker,
  message: SimulationWorkerRequest,
): Promise<SimulationWorkerResponse> {
  return new Promise((resolve, reject) => {
    const onMessage = (event: MessageEvent<SimulationWorkerResponse>) => {
      worker.removeEventListener('message', onMessage);
      if (event.data.type === 'ERROR') {
        reject(new Error(event.data.message));
        return;
      }
      resolve(event.data);
    };
    worker.addEventListener('message', onMessage);
    worker.postMessage(message);
  });
}

function tickIntervalMs(timeScale: TimeScale): number | null {
  switch (timeScale) {
    case 0:
      return null;
    case 1:
      return BASE_TICK_MS;
    case 2:
      return BASE_TICK_MS / 2;
    case 5:
      return BASE_TICK_MS / 5;
    default: {
      const _exhaustive: never = timeScale;
      return _exhaustive;
    }
  }
}

function readOfflineBlob(saveId: string): SaveBlobV1 | null {
  const raw = readOfflineSave(saveId);
  if (!raw) return null;
  try {
    return parseSaveBlobV1(raw);
  } catch {
    clearOfflineSave(saveId);
    return null;
  }
}

function migrateLoadedWorld(
  blob: SaveBlobV1,
  saveName: string,
  worldSeed: string | null,
): WorldInstance {
  const seed = parseWorldSeed(worldSeed);
  return ensureWorldV2(blob.world, saveName, seed.background, seed.lifePath);
}

export function SimulationProvider({ children }: { children: ReactNode }) {
  const { activeSave } = useSave();
  const workerRef = useRef<Worker | null>(null);
  const worldRef = useRef<WorldInstance | null>(null);
  const lastSavedTickRef = useRef(-1);
  const advancingRef = useRef(false);

  const [world, setWorld] = useState<WorldInstance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPlayingOffline, setIsPlayingOffline] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const persistWorld = useCallback(async (nextWorld: WorldInstance) => {
    if (!activeSave) return;
    const blob = serializeSaveBlobV1(createSaveBlobV1(nextWorld));
    setIsSaving(true);
    try {
      await uploadSaveBlob(activeSave.id, blob);
      lastSavedTickRef.current = nextWorld.clock.tickCount;
      clearOfflineSave(activeSave.id);
      setIsPlayingOffline(false);
    } catch (error) {
      writeOfflineSave(activeSave.id, blob);
      setIsPlayingOffline(true);
      console.error('Save upload failed; stored offline copy', error);
    } finally {
      setIsSaving(false);
    }
  }, [activeSave]);

  const maybeAutosave = useCallback(async (nextWorld: WorldInstance) => {
    const ticksSinceSave = nextWorld.clock.tickCount - lastSavedTickRef.current;
    if (ticksSinceSave >= autosaveEveryTicks()) {
      await persistWorld(nextWorld);
    }
  }, [persistWorld]);

  const initWorker = useCallback(async (initialWorld: WorldInstance) => {
    workerRef.current?.terminate();
    const worker = new Worker(
      new URL('../simulation-bridge/simulation.worker.ts', import.meta.url),
      { type: 'module' },
    );
    workerRef.current = worker;

    const response = await postAndWait(worker, { type: 'INIT', world: initialWorld });
    if (response.type !== 'READY') {
      throw new Error('Failed to initialize simulation worker');
    }

    worldRef.current = response.world;
    setWorld(response.world);
    lastSavedTickRef.current = response.world.clock.tickCount;
  }, []);

  const applyWorkerState = useCallback(async (response: SimulationWorkerResponse) => {
    if (response.type !== 'STATE') return;
    worldRef.current = response.world;
    setWorld(response.world);
    await maybeAutosave(response.world);
  }, [maybeAutosave]);

  const advanceDay = useCallback(async () => {
    const worker = workerRef.current;
    if (!worker) {
      throw new Error('Simulation is not ready yet');
    }
    if (advancingRef.current) return;

    advancingRef.current = true;
    try {
      const response = await postAndWait(worker, { type: 'ADVANCE_DAY' });
      await applyWorkerState(response);
    } finally {
      advancingRef.current = false;
    }
  }, [applyWorkerState]);

  const setPaused = useCallback(async (paused: boolean) => {
    const worker = workerRef.current;
    if (!worker) {
      throw new Error('Simulation is not ready yet');
    }

    const response = await postAndWait(worker, { type: 'SET_PAUSED', paused });
    if (response.type !== 'STATE') return;

    worldRef.current = response.world;
    setWorld(response.world);
    await persistWorld(response.world);
  }, [persistWorld]);

  const setTimeScale = useCallback(async (timeScale: TimeScale) => {
    const worker = workerRef.current;
    if (!worker) {
      throw new Error('Simulation is not ready yet');
    }

    const response = await postAndWait(worker, { type: 'SET_TIME_SCALE', timeScale });
    if (response.type !== 'STATE') return;

    worldRef.current = response.world;
    setWorld(response.world);
    await persistWorld(response.world);
  }, [persistWorld]);

  const loadSimulation = useCallback(async () => {
    if (!activeSave) {
      workerRef.current?.terminate();
      workerRef.current = null;
      worldRef.current = null;
      setWorld(null);
      setLoadError(null);
      return;
    }

    setIsLoading(true);
    setLoadError(null);
    setIsPlayingOffline(false);
    try {
      let initialWorld: WorldInstance;
      const offlineBlob = readOfflineBlob(activeSave.id);

      try {
        const rawBlob = await downloadSaveBlob(activeSave.id);
        const parsed = parseSaveBlobV1(rawBlob);
        const useOffline =
          offlineBlob != null &&
          new Date(offlineBlob.savedAt).getTime() > new Date(parsed.savedAt).getTime();

        if (useOffline && offlineBlob) {
          initialWorld = migrateLoadedWorld(offlineBlob, activeSave.name, activeSave.worldSeed);
          setIsPlayingOffline(true);
        } else {
          initialWorld = migrateLoadedWorld(parsed, activeSave.name, activeSave.worldSeed);
          if (offlineBlob != null) {
            clearOfflineSave(activeSave.id);
          }
        }
      } catch (error) {
        if (offlineBlob) {
          initialWorld = migrateLoadedWorld(offlineBlob, activeSave.name, activeSave.worldSeed);
          setIsPlayingOffline(true);
        } else if (error instanceof ApiError && error.status === 404) {
          const seed = parseWorldSeed(activeSave.worldSeed);
          const birthday = seed.birthday ?? '1982-06-15';
          initialWorld = createFreshStartWorld({
            saveId: createSaveId(activeSave.id),
            currentDate: deriveYoungAdultStartDate(birthday),
            playerName: activeSave.name,
            background: seed.background,
            lifePath: seed.lifePath,
            origin: seed.origin,
            avatarId: seed.avatar,
            gender: seed.gender,
            birthday,
            skinTone: seed.skinTone,
            hairstyle: seed.hairstyle,
          });
          await uploadSaveBlob(
            activeSave.id,
            serializeSaveBlobV1(createSaveBlobV1(initialWorld)),
          );
        } else {
          throw error;
        }
      }

      await initWorker(initialWorld);
    } catch (error) {
      workerRef.current?.terminate();
      workerRef.current = null;
      worldRef.current = null;
      setWorld(null);
      setLoadError(error instanceof Error ? error.message : 'Failed to load simulation');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [activeSave, initWorker]);

  useEffect(() => {
    loadSimulation().catch(console.error);
    return () => {
      workerRef.current?.terminate();
    };
  }, [loadSimulation]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && worldRef.current) {
        persistWorld(worldRef.current).catch(console.error);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [persistWorld]);

  useEffect(() => {
    if (!world || world.clock.paused || world.clock.timeScale === 0) {
      return;
    }

    const intervalMs = tickIntervalMs(world.clock.timeScale);
    if (intervalMs === null) {
      return;
    }

    const timer = window.setInterval(() => {
      advanceDay().catch(console.error);
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [world?.clock.paused, world?.clock.timeScale, advanceDay, world]);

  const transferFunds = useCallback(
    async (input: { fromAccountId: string; toAccountId: string; amountCents: number }) => {
      const worker = workerRef.current;
      if (!worker) {
        throw new Error('Simulation is not ready yet');
      }

      const response = await postAndWait(worker, { type: 'TRANSFER', ...input });
      if (response.type === 'ERROR') {
        throw new Error(response.message);
      }
      if (response.type !== 'STATE') return;

      worldRef.current = response.world;
      setWorld(response.world);
      await persistWorld(response.world);
    },
    [persistWorld],
  );

  const applyAction = useCallback(
    async (action: PlayerAction) => {
      const worker = workerRef.current;
      if (!worker) {
        throw new Error('Simulation is not ready yet');
      }

      const response = await postAndWait(worker, { type: 'APPLY_ACTION', action });
      if (response.type === 'ERROR') {
        throw new Error(response.message);
      }
      if (response.type !== 'STATE') return;

      worldRef.current = response.world;
      setWorld(response.world);
      await persistWorld(response.world);
    },
    [persistWorld],
  );

  const catchUpDays = useCallback(
    async (days: number) => {
      const worker = workerRef.current;
      if (!worker) {
        throw new Error('Simulation is not ready yet');
      }

      const response = await postAndWait(worker, { type: 'CATCH_UP', days });
      if (response.type === 'ERROR') {
        throw new Error(response.message);
      }
      if (response.type !== 'STATE') return;

      worldRef.current = response.world;
      setWorld(response.world);
      await persistWorld(response.world);
    },
    [persistWorld],
  );

  const completeChildhoodOnboarding = useCallback(
    async (simulateFirstYear: boolean) => {
      if (simulateFirstYear) {
        await catchUpDays(ONBOARDING_FIRST_YEAR_DAYS);
      }
      await applyAction({
        kind: 'COMPLETE_CHILDHOOD_ONBOARDING',
        simulateFirstYear,
      });
    },
    [applyAction, catchUpDays],
  );

  const dismissLifePathHints = useCallback(async () => {
    await applyAction({ kind: 'DISMISS_LIFE_PATH_HINTS' });
  }, [applyAction]);

  const dismissHomeTour = useCallback(async () => {
    await applyAction({ kind: 'DISMISS_HOME_TOUR' });
  }, [applyAction]);

  const applyCatchUp = useCallback(
    async (days: number): Promise<WhileAwaySummary | null> => {
      const current = worldRef.current;
      if (!current || days <= 0) {
        return null;
      }

      const priorEvents = current.events;
      const { world: nextWorld, summary } = buildWhileYouWereAwaySummary(
        current,
        priorEvents,
        days,
      );
      await initWorker(nextWorld);
      await persistWorld(nextWorld);
      return summary;
    },
    [initWorker, persistWorld],
  );

  const reloadSimulation = useCallback(async () => {
    await loadSimulation();
  }, [loadSimulation]);

  const syncNow = useCallback(async (): Promise<boolean> => {
    if (!activeSave || !worldRef.current) {
      return false;
    }
    const blob = serializeSaveBlobV1(createSaveBlobV1(worldRef.current));
    setIsSaving(true);
    try {
      await uploadSaveBlob(activeSave.id, blob);
      lastSavedTickRef.current = worldRef.current.clock.tickCount;
      clearOfflineSave(activeSave.id);
      setIsPlayingOffline(false);
      return true;
    } catch (error) {
      writeOfflineSave(activeSave.id, blob);
      setIsPlayingOffline(true);
      console.error('Sync now failed', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [activeSave]);

  useEffect(() => {
    function onOnline() {
      if (isPlayingOffline) {
        syncNow().catch(console.error);
      }
    }
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [isPlayingOffline, syncNow]);

  const value = useMemo<SimulationContextValue>(
    () => ({
      world,
      currentDate: world?.currentDate ?? null,
      formattedDate: world ? formatGameDate(world.currentDate) : null,
      isPaused: world?.clock.paused ?? true,
      timeScale: world?.clock.timeScale ?? 0,
      tickCount: world?.clock.tickCount ?? 0,
      isLoading,
      isSaving,
      isPlayingOffline,
      loadError,
      advanceDay,
      setPaused,
      setTimeScale,
      persistNow: async () => {
        if (worldRef.current) {
          await persistWorld(worldRef.current);
        }
      },
      reloadSimulation,
      transferFunds,
      applyAction,
      completeChildhoodOnboarding,
      dismissLifePathHints,
      dismissHomeTour,
      applyCatchUp,
      syncNow,
    }),
    [world, isLoading, isSaving, isPlayingOffline, loadError, advanceDay, setPaused, setTimeScale, persistWorld, reloadSimulation, transferFunds, applyAction, completeChildhoodOnboarding, dismissLifePathHints, dismissHomeTour, applyCatchUp, syncNow],
  );

  return (
    <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>
  );
}

export function useSimulation(): SimulationContextValue {
  const ctx = useContext(SimulationContext);
  if (!ctx) {
    throw new Error('useSimulation must be used within SimulationProvider');
  }
  return ctx;
}

export { formatGameDate };
