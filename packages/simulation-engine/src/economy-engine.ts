import { deriveCyclePhase, type EconomyState } from '@fenix/domain';

const INFLATION_FLOOR = 0.01;
const INFLATION_CEIL = 0.12;
const DAILY_INFLATION_DRIFT = 0.00004;

/**
 * Daily tech sector drift with mild mean reversion.
 * Also nudges the annual inflation rate slightly each day.
 */
export function applyDailyEconomyTick(economy: EconomyState): EconomyState {
  const dailyDrift = (Math.random() - 0.48) * 0.4;
  const reversion = (100 - economy.techSectorIndex) * 0.002;
  const nextIndex = Math.max(
    80,
    Math.min(130, economy.techSectorIndex + dailyDrift + reversion),
  );

  const inflationNudge = (Math.random() - 0.5) * DAILY_INFLATION_DRIFT;
  const nextInflation = Math.max(
    INFLATION_FLOOR,
    Math.min(INFLATION_CEIL, economy.inflationRateAnnual + inflationNudge),
  );

  return {
    ...economy,
    techSectorIndex: Number(nextIndex.toFixed(2)),
    cyclePhase: deriveCyclePhase(nextIndex),
    inflationRateAnnual: Number(nextInflation.toFixed(4)),
  };
}

/**
 * Applies the cumulative annual inflation rate to a monthly expense figure.
 * Called monthly from the tick-orchestrator.
 * @param monthlyExpensesCents Current monthly expenses
 * @param inflationRateAnnual Annual inflation rate (e.g. 0.035 = 3.5%)
 * @returns Adjusted monthly expenses (integer cents)
 */
export function applyInflationToMonthlyExpenses(
  monthlyExpensesCents: number,
  inflationRateAnnual: number,
): number {
  if (monthlyExpensesCents <= 0) return monthlyExpensesCents;
  const monthlyRate = inflationRateAnnual / 12;
  return Math.round(monthlyExpensesCents * (1 + monthlyRate));
}

export function inflationHeadline(economy: EconomyState): string {
  const pct = (economy.inflationRateAnnual * 100).toFixed(1);
  return `Central bank holds inflation target at ${pct}% as tech sector index hits ${economy.techSectorIndex.toFixed(1)}`;
}

export function economyCycleHeadline(economy: EconomyState): string {
  switch (economy.cyclePhase) {
    case 'expansion':
      return `Economy enters expansion phase — tech index at ${economy.techSectorIndex.toFixed(1)}`;
    case 'peak':
      return `Market at peak — analysts warn of overheating with index at ${economy.techSectorIndex.toFixed(1)}`;
    case 'contraction':
      return `Contraction signals emerge as tech sector index slides to ${economy.techSectorIndex.toFixed(1)}`;
    case 'trough':
      return `Economy bottoms out — recovery investors eye index low of ${economy.techSectorIndex.toFixed(1)}`;
    default: {
      const _exhaustive: never = economy.cyclePhase;
      return _exhaustive;
    }
  }
}
