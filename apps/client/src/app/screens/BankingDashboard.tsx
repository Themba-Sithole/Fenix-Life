import { useState } from "react";
import { CreditCard, DollarSign, PiggyBank, TrendingUp, Briefcase } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useSimulation } from "@/context/SimulationContext";
import { useSimulationGate } from "@/hooks/useSimulationGate";
import { creditScoreLabel, formatMoney, totalNetWorthCents, type BankAccountType } from "@fenix/domain";
import {
  DecisionPanel,
  EmptyState,
  HistoryChart,
  ToolShell,
} from "../components/shell";

const ACCOUNT_ICONS: Record<BankAccountType, typeof DollarSign> = {
  checking: DollarSign,
  savings: PiggyBank,
  business: Briefcase,
  investment: TrendingUp,
};

export default function BankingDashboard() {
  const { world, transferFunds, applyAction, formattedDate } = useSimulation();
  const [fromAccountId, setFromAccountId] = useState("checking");
  const [toAccountId, setToAccountId] = useState("savings");
  const [transferAmount, setTransferAmount] = useState("100");
  const [transferError, setTransferError] = useState<string | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [loanAmount, setLoanAmount] = useState("5000");
  const [loanError, setLoanError] = useState<string | null>(null);
  const [isApplyingLoan, setIsApplyingLoan] = useState(false);
  const [isPayingLoan, setIsPayingLoan] = useState(false);

  const simulationGate = useSimulationGate("Loading banking data…");
  if (simulationGate) return simulationGate;

  if (!world) return null;

  const { banking } = world;
  const currency = world.origin.currency;
  const netWorth = totalNetWorthCents(banking);

  const balanceHistory = [...(banking.netWorthHistory ?? [])].reverse().map((point) => ({
    label: point.date,
    value: point.netWorthCents,
  }));

  const cashFlowData = [...(banking.cashFlowHistory ?? [])].reverse().map((point) => ({
    label: point.date,
    value: point.incomeCents / 100,
    value2: point.expensesCents / 100,
  }));

  const transactions = banking.transactions.map((tx) => ({
    date: tx.date,
    description: tx.description,
    amount: tx.amountCents / 100,
    type: tx.amountCents >= 0 ? ("credit" as const) : ("debit" as const),
  }));

  async function handleTransfer() {
    setTransferError(null);
    const amountCents = Math.round(Number.parseFloat(transferAmount) * 100);
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      setTransferError("Enter a valid transfer amount.");
      return;
    }
    setIsTransferring(true);
    try {
      await transferFunds({ fromAccountId, toAccountId, amountCents });
    } catch (error) {
      setTransferError(error instanceof Error ? error.message : "Transfer failed.");
    } finally {
      setIsTransferring(false);
    }
  }

  async function handleApplyLoan() {
    setLoanError(null);
    const amountCents = Math.round(Number.parseFloat(loanAmount) * 100);
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      setLoanError("Enter a valid loan amount.");
      return;
    }
    setIsApplyingLoan(true);
    try {
      await applyAction({ kind: "APPLY_LOAN", amountCents });
    } catch (error) {
      setLoanError(error instanceof Error ? error.message : "Loan application failed.");
    } finally {
      setIsApplyingLoan(false);
    }
  }

  async function handlePayOffLoan() {
    setLoanError(null);
    setIsPayingLoan(true);
    try {
      await applyAction({ kind: "PAY_LOAN" });
    } catch (error) {
      setLoanError(error instanceof Error ? error.message : "Loan payoff failed.");
    } finally {
      setIsPayingLoan(false);
    }
  }

  return (
    <ToolShell
      institution="Fenix National Bank"
      subtitle={`${world.player.displayName} · Personal portal`}
      lastUpdated={formattedDate ?? undefined}
      metrics={[
        { label: "Net worth", value: formatMoney(netWorth, currency) },
        {
          label: "Credit",
          value: String(banking.creditScore),
          hint: creditScoreLabel(banking.creditScore),
        },
        {
          label: "Monthly burn",
          value: formatMoney(banking.monthlyExpensesCents, currency),
        },
      ]}
    >
      <section className="mb-8" aria-label="Accounts">
        <h2 className="font-display text-lg text-foreground mb-3">Accounts</h2>
        <ul className="surface-panel divide-y-0 overflow-hidden">
          {banking.accounts.map((account) => {
            const Icon = ACCOUNT_ICONS[account.type];
            return (
              <li key={account.id} className="surface-row justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] bg-surface-2 text-secondary">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-semibold text-foreground">{account.name}</p>
                    <p className="text-[11.5px] capitalize text-muted-foreground">{account.type}</p>
                  </div>
                </div>
                <p className="shrink-0 font-mono text-sm font-medium tabular-nums text-foreground">
                  {formatMoney(account.balanceCents, currency)}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <HistoryChart
          title="Net worth history"
          description="Recorded from simulation ticks"
          data={balanceHistory}
          emptyTitle="No history yet"
          emptyDescription="Advance time to record net worth snapshots."
          valueFormatter={(v) => formatMoney(v, currency)}
          seriesLabels={{ primary: "Net worth" }}
        />

        <HistoryChart
          title="Income vs expenses"
          description="Monthly cash flow from settlements"
          data={cashFlowData}
          variant="bar"
          emptyTitle="No cash-flow history"
          emptyDescription="Advance to a month settlement to record income and expenses."
          valueFormatter={(v) =>
            formatMoney(Math.round(v * 100), currency)
          }
          seriesLabels={{ primary: "Income", secondary: "Expenses" }}
        />

        <DecisionPanel
          title="Transfer funds"
          description="Move money between your accounts."
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="from-account">
                From
              </label>
              <Select value={fromAccountId} onValueChange={setFromAccountId}>
                <SelectTrigger id="from-account">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {banking.accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="to-account">
                To
              </label>
              <Select value={toAccountId} onValueChange={setToAccountId}>
                <SelectTrigger id="to-account">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {banking.accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <label className="text-sm text-muted-foreground" htmlFor="transfer-amount">
              Amount
            </label>
            <Input
              id="transfer-amount"
              type="number"
              min="1"
              step="0.01"
              value={transferAmount}
              onChange={(event) => setTransferAmount(event.target.value)}
            />
          </div>
          {transferError ? <p className="mt-2 text-sm text-destructive">{transferError}</p> : null}
          <Button
            type="button"
            className="mt-4 w-full bg-secondary text-secondary-foreground hover:opacity-90"
            onClick={handleTransfer}
            disabled={isTransferring}
          >
            {isTransferring ? "Transferring…" : "Transfer"}
          </Button>
        </DecisionPanel>

        <DecisionPanel
          title="Personal loan"
          description={
            banking.activeLoan
              ? "Pay down or clear your active loan."
              : `Credit ${banking.creditScore} (${creditScoreLabel(banking.creditScore)}). One loan at a time.`
          }
        >
          {banking.activeLoan ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Remaining</span>
                <span className="tabular-nums">
                  {formatMoney(banking.activeLoan.remainingCents, currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly payment</span>
                <span className="tabular-nums">
                  {formatMoney(banking.activeLoan.monthlyPaymentCents, currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">APR</span>
                <span>{(banking.activeLoan.apr * 100).toFixed(1)}%</span>
              </div>
              {loanError ? <p className="text-sm text-destructive">{loanError}</p> : null}
              <Button
                type="button"
                className="w-full bg-secondary text-secondary-foreground hover:opacity-90"
                onClick={handlePayOffLoan}
                disabled={isPayingLoan}
              >
                Pay off ({formatMoney(banking.activeLoan.remainingCents, currency)})
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground" htmlFor="loan-amount">
                  Loan amount
                </label>
                <Input
                  id="loan-amount"
                  type="number"
                  min="100"
                  step="100"
                  value={loanAmount}
                  onChange={(event) => setLoanAmount(event.target.value)}
                />
              </div>
              {loanError ? <p className="mt-2 text-sm text-destructive">{loanError}</p> : null}
              <Button
                type="button"
                className="mt-4 w-full bg-accent text-accent-foreground hover:opacity-90"
                onClick={handleApplyLoan}
                disabled={isApplyingLoan || banking.creditScore < 580}
              >
                Apply for loan
              </Button>
            </>
          )}
        </DecisionPanel>
      </div>

      <section className="mt-8" aria-label="Recent transactions">
        <h2 className="font-display text-lg text-foreground mb-3">Recent transactions</h2>
        {transactions.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            description="Advance time to see activity on your accounts."
            className="rounded-lg border border-border bg-surface-1"
          />
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border bg-surface-1">
            {transactions.map((transaction) => (
              <li
                key={`${transaction.date}-${transaction.description}`}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
                <p
                  className={
                    transaction.type === "credit"
                      ? "text-secondary tabular-nums shrink-0"
                      : "text-foreground tabular-nums shrink-0"
                  }
                >
                  {transaction.type === "credit" ? "+" : "−"}
                  {formatMoney(Math.round(Math.abs(transaction.amount) * 100), currency)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground border-t border-border pt-4">
        <span className="inline-flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5" aria-hidden />
          Tech index {world.economy.techSectorIndex.toFixed(1)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CreditCard className="h-3.5 w-3.5" aria-hidden />
          Salary {formatMoney(banking.monthlySalaryCents, currency)}/mo
        </span>
      </aside>
    </ToolShell>
  );
}
