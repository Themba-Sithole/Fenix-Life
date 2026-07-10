import type { WorldInstance } from '@fenix/domain';
import { runDailyTick } from '@fenix/simulation-engine';
import type { SimulationWorkerRequest, SimulationWorkerResponse } from './types';

let world: WorldInstance | null = null;

function reply(message: SimulationWorkerResponse): void {
  self.postMessage(message);
}

self.onmessage = (event: MessageEvent<SimulationWorkerRequest>) => {
  try {
    switch (event.data.type) {
      case 'INIT':
        world = event.data.world;
        reply({ type: 'READY', world });
        break;
      case 'ADVANCE_DAY':
        if (!world) {
          throw new Error('Simulation not initialized');
        }
        world = runDailyTick(world);
        reply({ type: 'STATE', world });
        break;
      case 'SET_PAUSED':
        if (!world) {
          throw new Error('Simulation not initialized');
        }
        world = {
          ...world,
          clock: { ...world.clock, paused: event.data.paused },
        };
        reply({ type: 'STATE', world });
        break;
      case 'SET_TIME_SCALE':
        if (!world) {
          throw new Error('Simulation not initialized');
        }
        world = {
          ...world,
          clock: { ...world.clock, timeScale: event.data.timeScale },
        };
        reply({ type: 'STATE', world });
        break;
      case 'GET_STATE':
        if (!world) {
          throw new Error('Simulation not initialized');
        }
        reply({ type: 'STATE', world });
        break;
      default: {
        const _exhaustive: never = event.data;
        throw new Error(`Unknown worker message: ${JSON.stringify(_exhaustive)}`);
      }
    }
  } catch (error) {
    reply({
      type: 'ERROR',
      message: error instanceof Error ? error.message : 'Simulation worker error',
    });
  }
};

export {};
