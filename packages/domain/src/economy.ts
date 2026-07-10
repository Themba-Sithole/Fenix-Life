/** Economy Engine v0 — Doc 18 simplified macro state. */
export interface EconomyState {
  inflationRateAnnual: number;
  techSectorIndex: number;
}

export const DEFAULT_INFLATION_RATE_ANNUAL = 0.03;
export const DEFAULT_TECH_SECTOR_INDEX = 100;

export function createDefaultEconomy(): EconomyState {
  return {
    inflationRateAnnual: DEFAULT_INFLATION_RATE_ANNUAL,
    techSectorIndex: DEFAULT_TECH_SECTOR_INDEX,
  };
}
