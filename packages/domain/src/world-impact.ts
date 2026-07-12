import type { EconomyState } from './economy.js';
import type { SimEvent } from './sim-event.js';
import type { WorldInstance } from './world-instance.js';

/** Tags that mutate the world when news fires — BitLife “the economy tanked”. */
export type WorldImpactTag =
  | 'expense_spike'
  | 'hiring_freeze'
  | 'sector_boost'
  | 'crime_wave'
  | 'inflation_uptick'
  | 'none';

export const WORLD_IMPACT_LABELS: Record<WorldImpactTag, string> = {
  expense_spike: 'Living expenses rise',
  hiring_freeze: 'Hiring gets harder',
  sector_boost: 'Tech sector lifts',
  crime_wave: 'District crime risk up',
  inflation_uptick: 'Inflation ticks up',
  none: 'No direct world change',
};

export function impactChangesLabel(tag: WorldImpactTag | undefined): string {
  if (!tag || tag === 'none') {
    return 'No direct world change';
  }
  return WORLD_IMPACT_LABELS[tag];
}

/** Apply a news impact mutation to economy + banking expenses. */
export function applyWorldImpact(
  world: WorldInstance,
  impact: WorldImpactTag | undefined,
  tickCount: number,
): WorldInstance {
  if (!impact || impact === 'none') {
    return world;
  }

  let economy: EconomyState = { ...world.economy };
  let monthlyExpensesCents = world.banking.monthlyExpensesCents;
  const activeImpacts = [...(economy.activeImpacts ?? [])];

  switch (impact) {
    case 'expense_spike':
      monthlyExpensesCents = Math.round(monthlyExpensesCents * 1.08);
      economy = {
        ...economy,
        expenseMultiplier: Math.min(1.5, (economy.expenseMultiplier ?? 1) * 1.08),
      };
      activeImpacts.push({ tag: impact, expiresTick: tickCount + 30 });
      break;
    case 'hiring_freeze':
      economy = {
        ...economy,
        hiringDifficultyBonus: Math.min(0.5, (economy.hiringDifficultyBonus ?? 0) + 0.15),
      };
      activeImpacts.push({ tag: impact, expiresTick: tickCount + 45 });
      break;
    case 'sector_boost':
      economy = {
        ...economy,
        techSectorIndex: Number((economy.techSectorIndex * 1.02).toFixed(2)),
        hiringDifficultyBonus: Math.max(0, (economy.hiringDifficultyBonus ?? 0) - 0.05),
      };
      activeImpacts.push({ tag: impact, expiresTick: tickCount + 30 });
      break;
    case 'crime_wave':
      economy = {
        ...economy,
        crimeRiskBias: Math.min(0.4, (economy.crimeRiskBias ?? 0) + 0.1),
      };
      activeImpacts.push({ tag: impact, expiresTick: tickCount + 21 });
      break;
    case 'inflation_uptick':
      economy = {
        ...economy,
        inflationRateAnnual: Math.min(0.12, economy.inflationRateAnnual + 0.005),
      };
      monthlyExpensesCents = Math.round(monthlyExpensesCents * 1.02);
      activeImpacts.push({ tag: impact, expiresTick: tickCount + 60 });
      break;
    default: {
      const _exhaustive: never = impact;
      return _exhaustive;
    }
  }

  return {
    ...world,
    economy: { ...economy, activeImpacts: activeImpacts.slice(-8) },
    banking: {
      ...world.banking,
      monthlyExpensesCents,
    },
  };
}

/** Decay expired impact modifiers each tick. */
export function decayWorldImpacts(world: WorldInstance): WorldInstance {
  const impacts = world.economy.activeImpacts ?? [];
  if (impacts.length === 0) {
    return world;
  }

  const tick = world.clock.tickCount;
  const remaining = impacts.filter((entry) => entry.expiresTick > tick);
  if (remaining.length === impacts.length) {
    return world;
  }

  // Recalculate bonuses from remaining impacts only
  let hiringDifficultyBonus = 0;
  let crimeRiskBias = 0;
  let expenseMultiplier = 1;
  for (const entry of remaining) {
    switch (entry.tag) {
      case 'hiring_freeze':
        hiringDifficultyBonus += 0.15;
        break;
      case 'crime_wave':
        crimeRiskBias += 0.1;
        break;
      case 'expense_spike':
        expenseMultiplier *= 1.08;
        break;
      case 'sector_boost':
        hiringDifficultyBonus -= 0.05;
        break;
      case 'inflation_uptick':
      case 'none':
        break;
      default: {
        const _exhaustive: never = entry.tag;
        return _exhaustive;
      }
    }
  }

  return {
    ...world,
    economy: {
      ...world.economy,
      activeImpacts: remaining,
      hiringDifficultyBonus: Math.max(0, Math.min(0.5, hiringDifficultyBonus)),
      crimeRiskBias: Math.max(0, Math.min(0.4, crimeRiskBias)),
      expenseMultiplier: Math.max(1, Math.min(1.5, expenseMultiplier)),
    },
  };
}

/** Pick a consequential impact for economy news (seeded). */
export function pickNewsImpact(seed: number, tone: SimEvent['tone']): WorldImpactTag {
  const roll = ((seed * 2_654_435_761) >>> 0) % 100;
  if (tone === 'warning' || roll < 25) {
    if (roll < 8) return 'crime_wave';
    if (roll < 16) return 'hiring_freeze';
    if (roll < 22) return 'expense_spike';
    return 'inflation_uptick';
  }
  if (tone === 'success' || roll > 85) {
    return 'sector_boost';
  }
  if (roll < 40) return 'expense_spike';
  if (roll < 55) return 'hiring_freeze';
  return 'none';
}
