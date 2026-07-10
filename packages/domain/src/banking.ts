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
}

export function createDefaultBanking(): BankingState {
  return {
    accounts: [
      { id: 'checking', name: 'Checking Account', type: 'checking', balanceCents: 12_500_00 },
      { id: 'savings', name: 'Savings Account', type: 'savings', balanceCents: 48_500_00 },
      { id: 'business', name: 'Business Account', type: 'business', balanceCents: 24_000_00 },
      { id: 'investment', name: 'Investment Account', type: 'investment', balanceCents: 48_500_00 },
    ],
    transactions: [],
    monthlySalaryCents: 8_500_00,
    monthlyExpensesCents: 3_500_00,
  };
}

export function totalNetWorthCents(banking: BankingState): number {
  return banking.accounts.reduce((sum, account) => sum + account.balanceCents, 0);
}

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}
