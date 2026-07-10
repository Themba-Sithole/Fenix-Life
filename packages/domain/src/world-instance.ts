import type { SaveId } from './save-id.js';

/** Game clock speed multiplier (Doc 17). */
export type TimeScale = 0 | 1 | 2 | 5;

/** Root aggregate for authoritative simulation state (Doc 26 save blob v1). */
export interface WorldInstance {
  saveId: SaveId;
  schemaVersion: number;
  currentDate: string;
  clock: {
    timeScale: TimeScale;
    paused: boolean;
    tickCount: number;
  };
}

export function createWorldInstance(params: {
  saveId: SaveId;
  schemaVersion?: number;
  currentDate?: string;
}): WorldInstance {
  return {
    saveId: params.saveId,
    schemaVersion: params.schemaVersion ?? 1,
    currentDate: params.currentDate ?? '2000-01-01',
    clock: {
      timeScale: 1,
      paused: false,
      tickCount: 0,
    },
  };
}
