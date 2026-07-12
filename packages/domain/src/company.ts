export type CompanyStage = 'idea' | 'startup' | 'growth' | 'established';

export interface CompanyState {
  readonly id: string;
  readonly name: string;
  readonly stage: CompanyStage;
  readonly monthlyRevenueCents: number;
  readonly monthlyExpensesCents: number;
  readonly employeeCount: number;
  readonly productCount: number;
  readonly valuationCents: number;
  readonly marketSharePct: number;
  readonly revenueHistory: readonly CompanyRevenuePoint[];
}

export interface CompanyRevenuePoint {
  readonly date: string;
  readonly revenueCents: number;
  readonly profitCents: number;
}

const MAX_COMPANY_HISTORY = 36;

export function appendCompanyRevenueHistory(
  company: CompanyState,
  date: string,
): CompanyState {
  const profitCents = companyMonthlyProfitCents(company);
  const point: CompanyRevenuePoint = {
    date,
    revenueCents: company.monthlyRevenueCents,
    profitCents,
  };
  const history = company.revenueHistory ?? [];
  const next =
    history[0]?.date === date
      ? [point, ...history.slice(1)]
      : [point, ...history];
  return {
    ...company,
    revenueHistory: next.slice(0, MAX_COMPANY_HISTORY),
  };
}

export function normalizeCompanyState(company: CompanyState): CompanyState {
  return {
    ...company,
    revenueHistory: company.revenueHistory ?? [],
  };
}

/** State filing fee to incorporate (EA baseline). */
export const INCORPORATION_FEE_CENTS = 750_00;

export function suggestedCompanyName(playerName: string): string {
  const firstName = playerName.trim().split(/\s+/)[0] || 'Fenix';
  return `${firstName} Ventures`;
}

/** Player-founded company at idea stage — zero revenue, zero employees. */
export function createFoundedCompany(companyName: string, playerName: string): CompanyState {
  const name = companyName.trim() || suggestedCompanyName(playerName);

  return {
    id: 'company-1',
    name,
    stage: 'idea',
    monthlyRevenueCents: 0,
    monthlyExpensesCents: 0,
    employeeCount: 0,
    productCount: 0,
    valuationCents: 0,
    marketSharePct: 0.01,
    revenueHistory: [],
  };
}

export function createDefaultCompany(playerName: string, background = 'middle-class'): CompanyState {
  const firstName = playerName.trim().split(/\s+/)[0] || 'Fenix';
  const baseName = `${firstName} Ventures`;

  const base: CompanyState = {
    id: 'company-1',
    name: baseName,
    stage: 'startup',
    monthlyRevenueCents: 45_000_00,
    monthlyExpensesCents: 32_000_00,
    employeeCount: 8,
    productCount: 2,
    valuationCents: 1_200_000_00,
    marketSharePct: 1.4,
    revenueHistory: [],
  };

  switch (background) {
    case 'wealthy':
      return {
        ...base,
        name: `${firstName} Holdings`,
        stage: 'established',
        monthlyRevenueCents: 145_000_00,
        monthlyExpensesCents: 98_000_00,
        employeeCount: 42,
        productCount: 8,
        valuationCents: 12_000_000_00,
        marketSharePct: 8.3,
      };
    case 'entrepreneur-family':
      return {
        ...base,
        stage: 'growth',
        monthlyRevenueCents: 98_000_00,
        monthlyExpensesCents: 68_000_00,
        employeeCount: 24,
        productCount: 5,
        valuationCents: 5_200_000_00,
        marketSharePct: 4.2,
      };
    case 'working-class':
    case 'orphan':
      return {
        ...base,
        name: `${firstName} Side Projects`,
        stage: 'idea',
        monthlyRevenueCents: 2_500_00,
        monthlyExpensesCents: 800_00,
        employeeCount: 1,
        productCount: 1,
        valuationCents: 50_000_00,
        marketSharePct: 0.1,
      };
    case 'immigrant':
      return {
        ...base,
        stage: 'startup',
        monthlyRevenueCents: 28_000_00,
        monthlyExpensesCents: 22_000_00,
        employeeCount: 5,
        productCount: 1,
        valuationCents: 750_000_00,
        marketSharePct: 0.8,
      };
    default:
      return base;
  }
}

export function companyMonthlyProfitCents(company: CompanyState): number {
  return company.monthlyRevenueCents - company.monthlyExpensesCents;
}

export function companyStageLabel(stage: CompanyStage): string {
  switch (stage) {
    case 'idea':
      return 'Pre-launch';
    case 'startup':
      return 'Startup';
    case 'growth':
      return 'Growth';
    case 'established':
      return 'Established';
    default: {
      const _exhaustive: never = stage;
      return _exhaustive;
    }
  }
}
