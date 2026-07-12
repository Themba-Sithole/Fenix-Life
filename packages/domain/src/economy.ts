import type { WorldImpactTag } from './world-impact.js';

/** Economy Engine v0 — Doc 18 simplified macro state. */
export type EconomyCyclePhase = 'expansion' | 'peak' | 'contraction' | 'trough';

export interface ActiveWorldImpact {
  readonly tag: WorldImpactTag;
  readonly expiresTick: number;
}

export interface EconomyState {
  inflationRateAnnual: number;
  techSectorIndex: number;
  cyclePhase: EconomyCyclePhase;
  /** Multiplier applied conceptually to living costs from news impacts. */
  expenseMultiplier?: number;
  /** Added to hire/application difficulty (0–0.5). */
  hiringDifficultyBonus?: number;
  /** Added to district crime risk (0–0.4). */
  crimeRiskBias?: number;
  /** Active news impacts with expiry. */
  activeImpacts?: readonly ActiveWorldImpact[];
}

export const DEFAULT_INFLATION_RATE_ANNUAL = 0.03;
export const DEFAULT_TECH_SECTOR_INDEX = 100;

export function deriveCyclePhase(techSectorIndex: number): EconomyCyclePhase {
  if (techSectorIndex >= 115) {
    return 'peak';
  }
  if (techSectorIndex >= 105) {
    return 'expansion';
  }
  if (techSectorIndex >= 95) {
    return 'contraction';
  }
  return 'trough';
}

export function cyclePhaseLabel(phase: EconomyCyclePhase): string {
  switch (phase) {
    case 'expansion':
      return 'Expansion';
    case 'peak':
      return 'Peak';
    case 'contraction':
      return 'Contraction';
    case 'trough':
      return 'Trough';
    default: {
      const _exhaustive: never = phase;
      return _exhaustive;
    }
  }
}

export function createDefaultEconomy(): EconomyState {
  const techSectorIndex = DEFAULT_TECH_SECTOR_INDEX;
  return {
    inflationRateAnnual: DEFAULT_INFLATION_RATE_ANNUAL,
    techSectorIndex,
    cyclePhase: deriveCyclePhase(techSectorIndex),
    expenseMultiplier: 1,
    hiringDifficultyBonus: 0,
    crimeRiskBias: 0,
    activeImpacts: [],
  };
}

export function normalizeEconomyState(economy: EconomyState): EconomyState {
  return {
    ...economy,
    cyclePhase: economy.cyclePhase ?? deriveCyclePhase(economy.techSectorIndex),
    expenseMultiplier: economy.expenseMultiplier ?? 1,
    hiringDifficultyBonus: economy.hiringDifficultyBonus ?? 0,
    crimeRiskBias: economy.crimeRiskBias ?? 0,
    activeImpacts: economy.activeImpacts ?? [],
  };
}
