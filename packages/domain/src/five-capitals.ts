import { companyMonthlyProfitCents, type CompanyState } from './company.js';
import { totalNetWorthCents, type BankingState } from './banking.js';
import type { CareerState } from './career.js';
import type { Citizen } from './citizen.js';

export interface FiveCapitalsSnapshot {
  readonly financial: number;
  readonly human: number;
  readonly social: number;
  readonly business: number;
  readonly legacy: number;
  readonly financialLabel: string;
  readonly humanLabel: string;
  readonly socialLabel: string;
  readonly businessLabel: string;
  readonly legacyLabel: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function computeFiveCapitals(input: {
  player: Citizen;
  banking: BankingState;
  company: CompanyState | null;
  career: CareerState;
  tickCount: number;
  currency: string;
}): FiveCapitalsSnapshot {
  const netWorth = totalNetWorthCents(input.banking);
  const monthlyFlow = input.banking.monthlySalaryCents - input.banking.monthlyExpensesCents;
  const financialScore = clamp(
    Math.round(Math.log10(Math.max(netWorth / 100, 1)) * 18 + (monthlyFlow > 0 ? 10 : -5)),
    0,
    100,
  );

  const traits = input.player.traits;
  const humanScore = clamp(
    Math.round((traits.health + traits.happiness + traits.energy) / 3),
    0,
    100,
  );

  const socialScore = clamp(
    Math.round((traits.openness + (100 - traits.stress)) / 2),
    0,
    100,
  );

  const profit = input.company ? companyMonthlyProfitCents(input.company) : 0;
  const businessScore = clamp(
    Math.round(
      (input.company?.marketSharePct ?? 0) * 6 +
        (profit > 0 ? 15 : 0) +
        input.career.performanceScore * 0.2,
    ),
    0,
    100,
  );

  const legacyScore = clamp(
    Math.round(
      input.player.ageYears * 1.5 +
        input.tickCount / 40 +
        (input.company?.valuationCents ?? 0) / 500_000_00,
    ),
    0,
    100,
  );

  return {
    financial: financialScore,
    human: humanScore,
    social: socialScore,
    business: businessScore,
    legacy: legacyScore,
    financialLabel: formatMoneyLabel(netWorth, input.currency),
    humanLabel: `Health ${traits.health}% · Energy ${traits.energy}%`,
    socialLabel: `Openness ${traits.openness}% · Stress ${traits.stress}%`,
    businessLabel:
      input.career.status === 'founder' && input.company
        ? `${input.company.name} · ${input.company.marketSharePct.toFixed(1)}% share`
        : `${input.career.jobTitle} · ${input.career.performanceScore}% perf`,
    legacyLabel: `Age ${input.player.ageYears} · Day ${input.tickCount + 1}`,
  };
}

function formatMoneyLabel(cents: number, currency: string): string {
  const formatted = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);

  return `Net worth ${formatted}`;
}

export const FIVE_CAPITALS = [
  { key: 'financial', label: 'Financial', color: '#2EC4B6' },
  { key: 'human', label: 'Human', color: '#F4B400' },
  { key: 'social', label: 'Social', color: '#1C2541' },
  { key: 'business', label: 'Business', color: '#2EC4B6' },
  { key: 'legacy', label: 'Legacy', color: '#F4B400' },
] as const;
