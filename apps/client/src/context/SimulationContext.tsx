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
  createWorldInstance,
  ensureWorldV2,
  parseWorldSeed,
  type TimeScale,
  type WorldInstance,
} from '@fenix/domain';
import {
  createSaveBlobV1,
  formatGameDate,
  parseSaveBlobV1,
  runCatchUpTicks,
  estimateCatchUpDays,
  serializeSaveBlobV1,
} from '@fenix/simulation-engine';
import { ApiError, downloadSaveBlob, uploadSaveBlob } from '@/lib/api';
import { isAutosaveEnabled } from '@/lib/player-settings';
import { useSave } from '@/context/SaveContext';
import type { SimulationWorkerRequest, SimulationWorkerResponse } from '@/simulation-bridge/types';

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
  advanceDay: () => Promise<void>;
  setPaused: (paused: boolean) => Promise<void>;
  setTimeScale: (timeScale: TimeScale) => Promise<void>;
  persistNow: () => Promise<void>;
  transferFunds: (input: {
    fromAccountId: string;
    toAccountId: string;
    amountCents: number;
  }) => Promise<void>;
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

export function SimulationProvider({ children }: { children: ReactNode }) {
  const { activeSave } = useSave();
  const workerRef = useRef<Worker | null>(null);
  const worldRef = useRef<WorldInstance | null>(null);
  const lastSavedTickRef = useRef(-1);
  const advancingRef = useRef(false);

  const [world, setWorld] = useState<WorldInstance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const persistWorld = useCallback(async (nextWorld: WorldInstance) => {
    if (!activeSave) return;
    setIsSaving(true);
    try {
      const blob = serializeSaveBlobV1(createSaveBlobV1(nextWorld));
      await uploadSaveBlob(activeSave.id, blob);
      lastSavedTickRef.current = nextWorld.clock.tickCount;
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
    if (!worker || advancingRef.current) return;

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
    if (!worker) return;

    const response = await postAndWait(worker, { type: 'SET_PAUSED', paused });
    if (response.type !== 'STATE') return;

    worldRef.current = response.world;
    setWorld(response.world);
    await persistWorld(response.world);
  }, [persistWorld]);

  const setTimeScale = useCallback(async (timeScale: TimeScale) => {
    const worker = workerRef.current;
    if (!worker) return;

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
      return;
    }

    setIsLoading(true);
    try {
      let initialWorld: WorldInstance;

      try {
        const rawBlob = await downloadSaveBlob(activeSave.id);
        const parsed = parseSaveBlobV1(rawBlob);
        let migrated = ensureWorldV2(parsed.world, activeSave.name);
        const catchUpDays = estimateCatchUpDays(parsed.savedAt);
        if (catchUpDays > 0) {
          migrated = runCatchUpTicks(migrated, catchUpDays);
        }
        initialWorld = migrated;
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          const { background, origin } = parseWorldSeed(activeSave.worldSeed);
          initialWorld = createWorldInstance({
            saveId: createSaveId(activeSave.id),
            currentDate: '2000-01-01',
            playerName: activeSave.name,
            background,
            origin,
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
      if (!worker) return;

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
      advanceDay,
      setPaused,
      setTimeScale,
      persistNow: async () => {
        if (worldRef.current) {
          await persistWorld(worldRef.current);
        }
      },
      transferFunds,
    }),
    [world, isLoading, isSaving, advanceDay, setPaused, setTimeScale, persistWorld, transferFunds],
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
