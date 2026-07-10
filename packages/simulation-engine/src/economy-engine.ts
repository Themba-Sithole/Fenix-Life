import type { EconomyState } from '@fenix/domain';

/** Daily tech sector drift with mild mean reversion — Economy Engine v0. */
export function applyDailyEconomyTick(economy: EconomyState): EconomyState {
  const dailyDrift = (Math.random() - 0.48) * 0.4;
  const reversion = (100 - economy.techSectorIndex) * 0.002;
  const nextIndex = Math.max(
    80,
    Math.min(130, economy.techSectorIndex + dailyDrift + reversion),
  );

  return {
    ...economy,
    techSectorIndex: Number(nextIndex.toFixed(2)),
  };
}

export function inflationHeadline(economy: EconomyState): string {
  const pct = (economy.inflationRateAnnual * 100).toFixed(1);
  return `Central bank holds inflation target at ${pct}% as tech sector index hits ${economy.techSectorIndex.toFixed(1)}`;
}
