import type { TimeScale, WorldInstance } from '@fenix/domain';

export type SimulationWorkerRequest =
  | { type: 'INIT'; world: WorldInstance }
  | { type: 'ADVANCE_DAY' }
  | { type: 'SET_PAUSED'; paused: boolean }
  | { type: 'SET_TIME_SCALE'; timeScale: TimeScale }
  | { type: 'GET_STATE' };

export type SimulationWorkerResponse =
  | { type: 'READY'; world: WorldInstance }
  | { type: 'STATE'; world: WorldInstance }
  | { type: 'ERROR'; message: string };
