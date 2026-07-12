import type { BankingState, BankTransaction } from './banking.js';

export type LoanStatus = 'current' | 'delinquent' | 'defaulted';

export interface LoanRecord {
  readonly id: string;
  readonly principalCents: number;
  readonly remainingCents: number;
  readonly monthlyPaymentCents: number;
  readonly apr: number;
  readonly missedPayments: number;
  readonly status: LoanStatus;
  /** Collections fee accrued on default (cents). */
  readonly collectionsFeeCents: number;
}

/** Missed payments before hard default. */
export const LOAN_DEFAULT_AFTER_MISSES = 3;
export const LOAN_COLLECTIONS_FEE_RATE = 0.08;
export const LOAN_DEFAULT_CREDIT_HIT = 80;

export function createLoan(amountCents: number, creditScore: number): LoanRecord {
  const apr = creditScore >= 740 ? 0.06 : creditScore >= 670 ? 0.09 : 0.12;
  const monthlyPaymentCents = Math.round(amountCents * (apr / 12) + amountCents / 36);

  return {
    id: `loan-${Date.now()}`,
    principalCents: amountCents,
    remainingCents: amountCents,
    monthlyPaymentCents,
    apr,
    missedPayments: 0,
    status: 'current',
    collectionsFeeCents: 0,
  };
}

export function normalizeLoanRecord(loan: LoanRecord | null | undefined): LoanRecord | null {
  if (!loan) {
    return null;
  }
  return {
    ...loan,
    missedPayments: loan.missedPayments ?? 0,
    status: loan.status ?? 'current',
    collectionsFeeCents: loan.collectionsFeeCents ?? 0,
  };
}

export function applyLoanProceeds(
  banking: BankingState,
  loan: LoanRecord,
  date: string,
): BankingState {
  const checking = banking.accounts.find((account) => account.id === 'checking');
  if (!checking) {
    throw new Error('Checking account not found');
  }

  const accounts = banking.accounts.map((account) =>
    account.id === 'checking'
      ? { ...account, balanceCents: account.balanceCents + loan.principalCents }
      : account,
  );

  const transaction: BankTransaction = {
    id: `tx-loan-${date}-${banking.transactions.length}`,
    date,
    description: `Loan disbursement (${(loan.apr * 100).toFixed(1)}% APR)`,
    amountCents: loan.principalCents,
    accountId: 'checking',
  };

  return {
    ...banking,
    accounts,
    activeLoan: loan,
    creditScore: Math.max(300, banking.creditScore - 5),
    transactions: [transaction, ...banking.transactions].slice(0, 30),
  };
}

export interface MonthlyLoanPaymentResult {
  readonly banking: BankingState;
  readonly defaulted: boolean;
  readonly missed: boolean;
}

/**
 * Monthly loan tick. Missed payments accumulate; after N misses → default
 * with large credit hit + collections fee (not just −3 credit).
 */
export function applyMonthlyLoanPayment(banking: BankingState, date: string): MonthlyLoanPaymentResult {
  if (!banking.activeLoan || banking.activeLoan.remainingCents <= 0) {
    return { banking, defaulted: false, missed: false };
  }

  const loan = normalizeLoanRecord(banking.activeLoan)!;
  if (loan.status === 'defaulted') {
    return { banking: { ...banking, activeLoan: loan }, defaulted: true, missed: false };
  }

  const payment = Math.min(loan.monthlyPaymentCents, loan.remainingCents);
  const checking = banking.accounts.find((account) => account.id === 'checking');
  if (!checking || checking.balanceCents < payment) {
    const missedPayments = loan.missedPayments + 1;
    const defaulted = missedPayments >= LOAN_DEFAULT_AFTER_MISSES;
    const collectionsFeeCents = defaulted
      ? Math.round(loan.remainingCents * LOAN_COLLECTIONS_FEE_RATE)
      : loan.collectionsFeeCents;
    const creditHit = defaulted ? LOAN_DEFAULT_CREDIT_HIT : 12 + missedPayments * 5;

    return {
      banking: {
        ...banking,
        creditScore: Math.max(300, banking.creditScore - creditHit),
        activeLoan: {
          ...loan,
          missedPayments,
          status: defaulted ? 'defaulted' : 'delinquent',
          collectionsFeeCents,
          remainingCents: loan.remainingCents + collectionsFeeCents - loan.collectionsFeeCents,
        },
      },
      defaulted,
      missed: true,
    };
  }

  const remainingCents = loan.remainingCents - payment;
  const accounts = banking.accounts.map((account) =>
    account.id === 'checking' ? { ...account, balanceCents: account.balanceCents - payment } : account,
  );

  const transaction: BankTransaction = {
    id: `tx-loan-pay-${date}-${banking.transactions.length}`,
    date,
    description: 'Loan payment',
    amountCents: -payment,
    accountId: 'checking',
  };

  const creditBump = loan.missedPayments > 0 ? 4 : 1;

  return {
    banking: {
      ...banking,
      accounts,
      creditScore: Math.min(850, banking.creditScore + creditBump),
      activeLoan:
        remainingCents <= 0
          ? null
          : {
              ...loan,
              remainingCents,
              missedPayments: 0,
              status: 'current',
              collectionsFeeCents: 0,
            },
      transactions: [transaction, ...banking.transactions].slice(0, 30),
    },
    defaulted: false,
    missed: false,
  };
}

/** Pay remaining balance + collections fee to clear default/delinquency. */
export function payOffActiveLoan(
  banking: BankingState,
  date: string,
  debit: (banking: BankingState, amountCents: number, date: string, description: string) => BankingState,
): BankingState {
  if (!banking.activeLoan || banking.activeLoan.remainingCents <= 0) {
    throw new Error('No active loan to pay off');
  }

  const loan = normalizeLoanRecord(banking.activeLoan)!;
  const amountCents = loan.remainingCents;
  const nextBanking = debit(banking, amountCents, date, 'Loan payoff');
  const creditRestore = loan.status === 'defaulted' ? 15 : 8;

  return {
    ...nextBanking,
    activeLoan: null,
    creditScore: Math.min(850, nextBanking.creditScore + creditRestore),
  };
}

/** Restructure a defaulted loan: fee + reset schedule at higher APR. */
export function restructureActiveLoan(banking: BankingState, date: string): BankingState {
  const loan = normalizeLoanRecord(banking.activeLoan);
  if (!loan || loan.status !== 'defaulted') {
    throw new Error('Only a defaulted loan can be restructured');
  }

  const feeCents = Math.max(250_00, Math.round(loan.remainingCents * 0.05));
  const checking = banking.accounts.find((account) => account.id === 'checking');
  if (!checking || checking.balanceCents < feeCents) {
    throw new Error('Insufficient funds for restructure fee');
  }

  const accounts = banking.accounts.map((account) =>
    account.id === 'checking' ? { ...account, balanceCents: account.balanceCents - feeCents } : account,
  );

  const newApr = Math.min(0.24, loan.apr + 0.04);
  const remainingCents = loan.remainingCents;
  const monthlyPaymentCents = Math.round(remainingCents * (newApr / 12) + remainingCents / 48);

  const transaction: BankTransaction = {
    id: `tx-loan-restructure-${date}-${banking.transactions.length}`,
    date,
    description: 'Loan restructure fee',
    amountCents: -feeCents,
    accountId: 'checking',
  };

  return {
    ...banking,
    accounts,
    creditScore: Math.min(850, banking.creditScore + 10),
    activeLoan: {
      ...loan,
      apr: newApr,
      monthlyPaymentCents,
      missedPayments: 0,
      status: 'current',
      collectionsFeeCents: 0,
      remainingCents,
    },
    transactions: [transaction, ...banking.transactions].slice(0, 30),
  };
}

/** Settle default for a haircut of remaining balance (still credit-damaging). */
export function settleActiveLoan(
  banking: BankingState,
  date: string,
  debit: (banking: BankingState, amountCents: number, date: string, description: string) => BankingState,
): BankingState {
  const loan = normalizeLoanRecord(banking.activeLoan);
  if (!loan || loan.status !== 'defaulted') {
    throw new Error('Only a defaulted loan can be settled');
  }

  const settleCents = Math.round(loan.remainingCents * 0.55);
  const nextBanking = debit(banking, settleCents, date, 'Loan settlement');

  return {
    ...nextBanking,
    activeLoan: null,
    creditScore: Math.max(300, Math.min(850, nextBanking.creditScore + 5)),
  };
}
