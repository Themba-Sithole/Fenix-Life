/** Civic / government / health pending state attached to WorldInstance. */
export interface PendingIllness {
  readonly description: string;
  readonly healthPenalty: number;
  readonly ignorePenalty: number;
  readonly treatCostCents: number;
  readonly sinceTick: number;
}

export interface CivicState {
  /** Annual tax refund owed to player (positive) or balance due (negative), cents. */
  readonly taxBalanceCents: number;
  /** True when annual filing event was ignored past grace. */
  readonly taxFilingOverdue: boolean;
  /** Tick when last annual filing was due (Jan 1). */
  readonly lastTaxYearFiled: number | null;
  /** Pending illness choice (treat vs ignore). */
  readonly pendingIllness: PendingIllness | null;
  /** Health insurance enrollment. */
  readonly hasInsurance: boolean;
  /** Monthly insurance premium cents. */
  readonly insurancePremiumCents: number;
}

export function createDefaultCivic(): CivicState {
  return {
    taxBalanceCents: 0,
    taxFilingOverdue: false,
    lastTaxYearFiled: null,
    pendingIllness: null,
    hasInsurance: false,
    insurancePremiumCents: 0,
  };
}

export function normalizeCivicState(civic: Partial<CivicState> | null | undefined): CivicState {
  const defaults = createDefaultCivic();
  if (!civic) {
    return defaults;
  }
  return {
    taxBalanceCents: civic.taxBalanceCents ?? defaults.taxBalanceCents,
    taxFilingOverdue: civic.taxFilingOverdue ?? defaults.taxFilingOverdue,
    lastTaxYearFiled: civic.lastTaxYearFiled ?? defaults.lastTaxYearFiled,
    pendingIllness: civic.pendingIllness ?? defaults.pendingIllness,
    hasInsurance: civic.hasInsurance ?? defaults.hasInsurance,
    insurancePremiumCents: civic.insurancePremiumCents ?? defaults.insurancePremiumCents,
  };
}
