import type { BankingState, BankTransaction } from './banking.js';

export interface LoanRecord {
  readonly id: string;
  readonly principalCents: number;
  readonly remainingCents: number;
  readonly monthlyPaymentCents: number;
  readonly apr: number;
}

export function createLoan(amountCents: number, creditScore: number): LoanRecord {
  const apr = creditScore >= 740 ? 0.06 : creditScore >= 670 ? 0.09 : 0.12;
  const monthlyPaymentCents = Math.round((amountCents * (apr / 12)) + amountCents / 36);

  return {
    id: `loan-${Date.now()}`,
    principalCents: amountCents,
    remainingCents: amountCents,
    monthlyPaymentCents,
    apr,
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

export function applyMonthlyLoanPayment(banking: BankingState, date: string): BankingState {
  if (!banking.activeLoan || banking.activeLoan.remainingCents <= 0) {
    return banking;
  }

  const payment = Math.min(
    banking.activeLoan.monthlyPaymentCents,
    banking.activeLoan.remainingCents,
  );
  const checking = banking.accounts.find((account) => account.id === 'checking');
  if (!checking || checking.balanceCents < payment) {
    return {
      ...banking,
      creditScore: Math.max(300, banking.creditScore - 3),
    };
  }

  const remainingCents = banking.activeLoan.remainingCents - payment;
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

  return {
    ...banking,
    accounts,
    activeLoan:
      remainingCents <= 0
        ? null
        : { ...banking.activeLoan, remainingCents },
    transactions: [transaction, ...banking.transactions].slice(0, 30),
  };
}

export function payOffActiveLoan(
  banking: BankingState,
  date: string,
  debit: (banking: BankingState, amountCents: number, date: string, description: string) => BankingState,
): BankingState {
  if (!banking.activeLoan || banking.activeLoan.remainingCents <= 0) {
    throw new Error('No active loan to pay off');
  }

  const amountCents = banking.activeLoan.remainingCents;
  const nextBanking = debit(banking, amountCents, date, 'Loan payoff');

  return {
    ...nextBanking,
    activeLoan: null,
    creditScore: Math.min(850, nextBanking.creditScore + 8),
  };
}
