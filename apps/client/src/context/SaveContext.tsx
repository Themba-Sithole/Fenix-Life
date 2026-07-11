import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  createSave,
  deleteSave,
  renameSave,
  getActiveSaveId,
  getSave,
  listSaves,
  setActiveSaveId,
  touchSave,
  type SaveSummary,
} from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface SaveContextValue {
  activeSave: SaveSummary | null;
  saves: SaveSummary[];
  isLoading: boolean;
  refreshSaves: () => Promise<SaveSummary[]>;
  selectSave: (saveId: string) => Promise<SaveSummary>;
  createNewSave: (input: { name?: string; worldSeed?: string }) => Promise<SaveSummary>;
  deleteSaveById: (saveId: string) => Promise<void>;
  renameSaveById: (saveId: string, name: string) => Promise<SaveSummary>;
  clearActiveSave: () => void;
}

const SaveContext = createContext<SaveContextValue | null>(null);

export function SaveProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const [activeSave, setActiveSave] = useState<SaveSummary | null>(null);
  const [saves, setSaves] = useState<SaveSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshSaves = useCallback(async () => {
    const next = await listSaves();
    setSaves(next);
    return next;
  }, []);

  const loadActiveSave = useCallback(async () => {
    const saveId = getActiveSaveId();
    if (!saveId) {
      setActiveSave(null);
      return;
    }
    try {
      const save = await getSave(saveId);
      setActiveSave(save);
    } catch {
      setActiveSaveId(null);
      setActiveSave(null);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setActiveSave(null);
      setSaves([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    Promise.all([refreshSaves(), loadActiveSave()])
      .catch(() => {
        if (!cancelled) {
          logout();
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, refreshSaves, loadActiveSave, logout]);

  const selectSave = useCallback(async (saveId: string) => {
    const save = await touchSave(saveId);
    setActiveSaveId(save.id);
    setActiveSave(save);
    await refreshSaves();
    return save;
  }, [refreshSaves]);

  const createNewSave = useCallback(async (input: { name?: string; worldSeed?: string }) => {
    const save = await createSave(input);
    setActiveSaveId(save.id);
    setActiveSave(save);
    await refreshSaves();
    return save;
  }, [refreshSaves]);

  const deleteSaveById = useCallback(async (saveId: string) => {
    await deleteSave(saveId);
    if (getActiveSaveId() === saveId) {
      setActiveSaveId(null);
      setActiveSave(null);
    }
    await refreshSaves();
  }, [refreshSaves]);

  const renameSaveById = useCallback(async (saveId: string, name: string) => {
    const save = await renameSave(saveId, name);
    if (getActiveSaveId() === saveId) {
      setActiveSave(save);
    }
    await refreshSaves();
    return save;
  }, [refreshSaves]);

  const clearActiveSave = useCallback(() => {
    setActiveSaveId(null);
    setActiveSave(null);
  }, []);

  const value = useMemo<SaveContextValue>(
    () => ({
      activeSave,
      saves,
      isLoading,
      refreshSaves,
      selectSave,
      createNewSave,
      deleteSaveById,
      renameSaveById,
      clearActiveSave,
    }),
    [activeSave, saves, isLoading, refreshSaves, selectSave, createNewSave, deleteSaveById, renameSaveById, clearActiveSave],
  );

  return <SaveContext.Provider value={value}>{children}</SaveContext.Provider>;
}

export function useSave(): SaveContextValue {
  const ctx = useContext(SaveContext);
  if (!ctx) {
    throw new Error('useSave must be used within SaveProvider');
  }
  return ctx;
}

export function formatSaveDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
