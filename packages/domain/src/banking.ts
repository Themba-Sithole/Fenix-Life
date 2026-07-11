import type { LoanRecord } from './loans.js';

export type BankAccountType = 'checking' | 'savings' | 'business' | 'investment';

export interface BankAccount {
  id: string;
  name: string;
  type: BankAccountType;
  balanceCents: number;
}

export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amountCents: number;
  accountId: string;
}

export interface BankingState {
  accounts: BankAccount[];
  transactions: BankTransaction[];
  monthlySalaryCents: number;
  monthlyExpensesCents: number;
  creditScore: number;
  activeLoan: LoanRecord | null;
}

const BACKGROUND_STARTING_CASH_CENTS: Record<string, number> = {
  wealthy: 500_000_00,
  'middle-class': 25_000_00,
  'working-class': 5_000_00,
  orphan: 500_00,
  immigrant: 2_000_00,
  'entrepreneur-family': 100_000_00,
};

const BACKGROUND_CREDIT_SCORE: Record<string, number> = {
  wealthy: 780,
  'middle-class': 720,
  'working-class': 680,
  orphan: 610,
  immigrant: 650,
  'entrepreneur-family': 740,
};

function splitStartingCash(totalCents: number): {
  checking: number;
  savings: number;
  business: number;
  investment: number;
} {
  if (totalCents >= 200_000_00) {
    return {
      checking: Math.round(totalCents * 0.4),
      savings: Math.round(totalCents * 0.35),
      business: Math.round(totalCents * 0.15),
      investment: totalCents - Math.round(totalCents * 0.4) - Math.round(totalCents * 0.35) - Math.round(totalCents * 0.15),
    };
  }

  if (totalCents >= 50_000_00) {
    return {
      checking: Math.round(totalCents * 0.55),
      savings: Math.round(totalCents * 0.3),
      business: Math.round(totalCents * 0.15),
      investment: 0,
    };
  }

  if (totalCents >= 10_000_00) {
    return {
      checking: Math.round(totalCents * 0.7),
      savings: totalCents - Math.round(totalCents * 0.7),
      business: 0,
      investment: 0,
    };
  }

  return {
    checking: totalCents,
    savings: 0,
    business: 0,
    investment: 0,
  };
}

export function createBankingForBackground(background = 'middle-class'): BankingState {
  const totalCents = BACKGROUND_STARTING_CASH_CENTS[background] ?? BACKGROUND_STARTING_CASH_CENTS['middle-class']!;
  const split = splitStartingCash(totalCents);
  const creditScore = BACKGROUND_CREDIT_SCORE[background] ?? 720;

  return {
    accounts: [
      { id: 'checking', name: 'Checking Account', type: 'checking', balanceCents: split.checking },
      { id: 'savings', name: 'Savings Account', type: 'savings', balanceCents: split.savings },
      { id: 'business', name: 'Business Account', type: 'business', balanceCents: split.business },
      { id: 'investment', name: 'Investment Account', type: 'investment', balanceCents: split.investment },
    ],
    transactions: [],
    monthlySalaryCents: 8_500_00,
    monthlyExpensesCents: 3_500_00,
    creditScore,
    activeLoan: null,
  };
}

export function createDefaultBanking(): BankingState {
  return createBankingForBackground('middle-class');
}

export function totalNetWorthCents(banking: BankingState): number {
  return banking.accounts.reduce((sum, account) => sum + account.balanceCents, 0);
}

export function formatUsd(cents: number): string {
  return formatMoney(cents, 'USD');
}

export function formatMoney(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
