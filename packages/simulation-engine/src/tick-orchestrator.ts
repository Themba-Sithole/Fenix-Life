import type { WorldInstance } from '@fenix/domain';
import { addDays } from './time-engine.js';

/** Daily tick orchestrator skeleton — Doc 17 §7, Phase C daily phase only. */
export function runDailyTick(world: WorldInstance): WorldInstance {
  if (world.clock.paused) {
    return world;
  }

  return {
    ...world,
    currentDate: addDays(world.currentDate, 1),
    clock: {
      ...world.clock,
      tickCount: world.clock.tickCount + 1,
    },
  };
}
