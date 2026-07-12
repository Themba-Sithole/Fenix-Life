import type { SimEvent, WorldInstance } from '@fenix/domain';
import { deriveBlockingGates, formatMoney, hasHardBlockingGate } from '@fenix/domain';
import { runDailyTick } from './tick-orchestrator.js';

const DEFAULT_MAX_CATCH_UP_DAYS = 90;
const FULL_RATE_DAYS = 30;

/** Advance simulation for offline elapsed days — Doc 17 catch-up. */
export function runCatchUpTicks(
  world: WorldInstance,
  days: number,
  maxDays = DEFAULT_MAX_CATCH_UP_DAYS,
): WorldInstance {
  const boundedDays = Math.max(0, Math.min(days, maxDays));
  let nextWorld = world;

  for (let index = 0; index < boundedDays; index += 1) {
    if (hasHardBlockingGate(nextWorld)) {
      break;
    }
    // Diminishing returns after 30 days: every other day is skipped in effect
    if (index >= FULL_RATE_DAYS && index % 2 === 1) {
      continue;
    }
    try {
      nextWorld = runDailyTick(nextWorld);
    } catch {
      break;
    }
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

export interface WhileAwayBeat {
  readonly headline: string;
  readonly tone: SimEvent['tone'];
}

export interface WhileAwaySummary {
  /** Actual game days simulated. */
  readonly daysSimulated: number;
  /** Net change in checking balance (cents). */
  readonly netBankingDeltaCents: number;
  /** New events that occurred during catch-up. */
  readonly newEvents: readonly SimEvent[];
  /** High-level narrative beats for display. */
  readonly beats: readonly WhileAwayBeat[];
  /** Closing net worth in cents. */
  readonly finalNetWorthCents: number;
  /** Unresolved hard gates after catch-up. */
  readonly unresolvedGates: readonly string[];
}

/**
 * Runs catch-up ticks and produces a human-readable "while you were away" summary.
 * Processes blocking gates first: if a hard gate exists at start, zero days simulate.
 */
export function buildWhileYouWereAwaySummary(
  world: WorldInstance,
  priorEvents: readonly SimEvent[],
  days: number,
): { world: WorldInstance; summary: WhileAwaySummary } {
  const gatesAtStart = deriveBlockingGates(world).filter((gate) => gate.severity === 'hard');
  if (gatesAtStart.length > 0) {
    return {
      world,
      summary: {
        daysSimulated: 0,
        netBankingDeltaCents: 0,
        newEvents: [],
        beats: gatesAtStart.map((gate) => ({
          headline: gate.message,
          tone: 'warning' as const,
        })),
        finalNetWorthCents: world.banking.accounts.reduce((sum, a) => sum + a.balanceCents, 0),
        unresolvedGates: gatesAtStart.map((gate) => gate.message),
      },
    };
  }

  const boundedDays = Math.max(0, Math.min(days, DEFAULT_MAX_CATCH_UP_DAYS));
  const priorCheckingBalance =
    world.banking.accounts.find((a) => a.id === 'checking')?.balanceCents ?? 0;
  const priorEventIds = new Set(priorEvents.map((e) => e.id));
  const priorTick = world.clock.tickCount;

  const afterWorld = runCatchUpTicks(world, boundedDays);
  const daysSimulated = afterWorld.clock.tickCount - priorTick;

  const finalCheckingBalance =
    afterWorld.banking.accounts.find((a) => a.id === 'checking')?.balanceCents ?? 0;
  const netBankingDeltaCents = finalCheckingBalance - priorCheckingBalance;

  const newEvents = afterWorld.events.filter((e) => !priorEventIds.has(e.id));
  const capitalEvents = newEvents.filter(
    (event) =>
      event.category === 'finance' ||
      event.tone === 'warning' ||
      event.impact != null,
  );

  const unresolved = deriveBlockingGates(afterWorld);
  const beats: WhileAwayBeat[] = [];

  if (daysSimulated > 0) {
    beats.push({
      headline: `${daysSimulated} day${daysSimulated === 1 ? '' : 's'} passed while you were away`,
      tone: 'info',
    });
  }

  if (Math.abs(netBankingDeltaCents) > 0) {
    const sign = netBankingDeltaCents >= 0 ? '+' : '';
    beats.push({
      headline: `Checking account ${sign}${formatMoney(netBankingDeltaCents, afterWorld.origin.currency)}`,
      tone: netBankingDeltaCents >= 0 ? 'success' : 'warning',
    });
  }

  for (const event of capitalEvents.slice(0, 6)) {
    beats.push({ headline: event.headline, tone: event.tone });
  }

  for (const gate of unresolved) {
    beats.push({ headline: `Unresolved: ${gate.message}`, tone: 'warning' });
  }

  const checkingBalance =
    afterWorld.banking.accounts.find((a) => a.id === 'checking')?.balanceCents ?? 0;
  if (checkingBalance < 0) {
    beats.push({
      headline: 'Account overdrawn — review your expenses',
      tone: 'warning',
    });
  }

  const finalNetWorthCents = afterWorld.banking.accounts.reduce(
    (sum, a) => sum + a.balanceCents,
    0,
  );

  return {
    world: afterWorld,
    summary: {
      daysSimulated,
      netBankingDeltaCents,
      newEvents,
      beats,
      finalNetWorthCents,
      unresolvedGates: unresolved.map((gate) => gate.message),
    },
  };
}
