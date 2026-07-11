import type { WorldInstance } from '@fenix/domain';
import { runDailyTick } from './tick-orchestrator.js';

const DEFAULT_MAX_CATCH_UP_DAYS = 7;

/** Advance simulation for offline elapsed days — Doc 17 catch-up stub. */
export function runCatchUpTicks(
  world: WorldInstance,
  days: number,
  maxDays = DEFAULT_MAX_CATCH_UP_DAYS,
): WorldInstance {
  const boundedDays = Math.max(0, Math.min(days, maxDays));
  let nextWorld = world;

  for (let index = 0; index < boundedDays; index += 1) {
    nextWorld = runDailyTick(nextWorld);
  }

  return nextWorld;
}

export function estimateCatchUpDays(lastSavedAtIso: string, nowMs = Date.now()): number {
  const lastSavedMs = Date.parse(lastSavedAtIso);
  if (Number.isNaN(lastSavedMs)) {
    return 0;
  }

  const elapsedMs = Math.max(0, nowMs - lastSavedMs);
  const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  return Math.min(elapsedDays, DEFAULT_MAX_CATCH_UP_DAYS);
}
