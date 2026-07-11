import type { BankingState, BankTransaction } from './banking.js';

const MIN_CREDIT_SCORE = 300;
const MAX_CREDIT_SCORE = 850;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function creditScoreLabel(score: number): string {
  if (score >= 800) return 'Excellent';
  if (score >= 740) return 'Very Good';
  if (score >= 670) return 'Good';
  if (score >= 580) return 'Fair';
  return 'Poor';
}

export function transferBetweenAccounts(
  banking: BankingState,
  input: {
    fromAccountId: string;
    toAccountId: string;
    amountCents: number;
    date: string;
    description?: string;
  },
): BankingState {
  if (input.amountCents <= 0) {
    throw new Error('Transfer amount must be positive');
  }

  if (input.fromAccountId === input.toAccountId) {
    throw new Error('Cannot transfer to the same account');
  }

  const fromAccount = banking.accounts.find((account) => account.id === input.fromAccountId);
  const toAccount = banking.accounts.find((account) => account.id === input.toAccountId);

  if (!fromAccount || !toAccount) {
    throw new Error('Account not found');
  }

  if (fromAccount.balanceCents < input.amountCents) {
    throw new Error('Insufficient funds');
  }

  const accounts = banking.accounts.map((account) => {
    if (account.id === input.fromAccountId) {
      return { ...account, balanceCents: account.balanceCents - input.amountCents };
    }
    if (account.id === input.toAccountId) {
      return { ...account, balanceCents: account.balanceCents + input.amountCents };
    }
    return account;
  });

  const transaction: BankTransaction = {
    id: `tx-transfer-${input.date}-${banking.transactions.length}`,
    date: input.date,
    description:
      input.description ??
      `Transfer ${fromAccount.name} → ${toAccount.name}`,
    amountCents: -input.amountCents,
    accountId: input.fromAccountId,
  };

  const creditDelta = input.amountCents > 50_000_00 ? 1 : 0;

  return {
    ...banking,
    accounts,
    creditScore: clamp(banking.creditScore + creditDelta, MIN_CREDIT_SCORE, MAX_CREDIT_SCORE),
    transactions: [transaction, ...banking.transactions].slice(0, 30),
  };
}

export function applyDailyCreditScoreDrift(banking: BankingState): BankingState {
  const cashFlow = banking.monthlySalaryCents - banking.monthlyExpensesCents;
  const delta = cashFlow >= 0 ? 1 : -1;

  return {
    ...banking,
    creditScore: clamp(banking.creditScore + delta, MIN_CREDIT_SCORE, MAX_CREDIT_SCORE),
  };
}
