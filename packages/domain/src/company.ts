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
