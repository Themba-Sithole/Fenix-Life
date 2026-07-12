import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ArrowLeft, CreditCard, TrendingUp, DollarSign, PiggyBank, Home, Briefcase } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useSimulation } from "@/context/SimulationContext";
import { useSimulationGate } from "@/hooks/useSimulationGate";
import { creditScoreLabel, formatMoney, totalNetWorthCents, type BankAccountType } from "@fenix/domain";

const ACCOUNT_ICONS: Record<BankAccountType, typeof DollarSign> = {
  checking: DollarSign,
  savings: PiggyBank,
  business: Briefcase,
  investment: TrendingUp,
};

const ACCOUNT_COLORS: Record<BankAccountType, string> = {
  checking: "text-[#2EC4B6]",
  savings: "text-[#F4B400]",
  business: "text-[#1C2541]",
  investment: "text-[#2EC4B6]",
};

export default function BankingDashboard() {
  const navigate = useNavigate();
  const { world, transferFunds, applyAction } = useSimulation();
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
  const balanceHistory = [...(banking.netWorthHistory ?? [])]
    .reverse()
    .map((point) => ({
      month: point.date,
      balance: point.netWorthCents,
    }));

  const cashFlowData = [...(banking.cashFlowHistory ?? [])]
    .reverse()
    .map((point) => ({
      month: point.date,
      income: point.incomeCents / 100,
      expenses: point.expensesCents / 100,
    }));

  const transactions = banking.transactions.map((tx) => ({
    date: tx.date,
    description: tx.description,
    amount: tx.amountCents / 100,
    type: tx.amountCents >= 0 ? "credit" as const : "debit" as const,
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
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA]">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1645226880663-81561dcab0ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5raW5nJTIwZmluYW5jZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzgzNzA2NzgyfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Banking and finance"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B132B]/80 to-[#1C2541]/60" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/home")}
              className="text-white hover:bg-white/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-4xl text-white mb-2">Banking Dashboard</h1>
                <p className="text-gray-300">{world.player.displayName} · Live simulation data</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">Total Net Worth</p>
                <p className="text-3xl text-[#2EC4B6]">{formatMoney(netWorth, currency)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          {banking.accounts.map((account) => {
            const Icon = ACCOUNT_ICONS[account.type];
            return (
              <Card key={account.id} className="border-[#2EC4B6]/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-5 h-5 ${ACCOUNT_COLORS[account.type]}`} />
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{account.name}</div>
                  <div className="text-2xl text-[#1C2541]">
                    {formatMoney(account.balanceCents, currency)}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-[#2EC4B6]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541]">Balance History</CardTitle>
              <p className="text-xs text-gray-500">Recorded net worth from simulation ticks</p>
            </CardHeader>
            <CardContent>
              {balanceHistory.length === 0 ? (
                <p className="text-sm text-gray-500 py-16 text-center">
                  No history yet — advance time to record net worth snapshots.
                </p>
              ) : (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={balanceHistory}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2EC4B6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2EC4B6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" tickFormatter={(v) => `$${(v / 100).toLocaleString()}`} />
                  <Tooltip formatter={(v: number) => formatMoney(v, currency)} />
                  <Area type="monotone" dataKey="balance" stroke="#2EC4B6" fillOpacity={1} fill="url(#colorBalance)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#F4B400]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541]">Economy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-[#2EC4B6]" />
                  <span className="text-sm">Tech Sector Index</span>
                </div>
                <div className="text-xl text-[#1C2541]">{world.economy.techSectorIndex.toFixed(1)}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Inflation {(world.economy.inflationRateAnnual * 100).toFixed(1)}% annual
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-[#F4B400]" />
                  <span className="text-sm">Credit Score</span>
                </div>
                <div className="text-xl text-[#1C2541]">{banking.creditScore}</div>
                <div className="text-xs text-gray-500 mt-1">{creditScoreLabel(banking.creditScore)}</div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-[#F4B400]" />
                  <span className="text-sm">Monthly Salary</span>
                </div>
                <div className="text-xl text-[#1C2541]">{formatMoney(banking.monthlySalaryCents, currency)}</div>
              </div>
              <div className="p-4 rounded-lg bg-[#2EC4B6]/10">
                <div className="text-sm text-gray-600 mb-1">Monthly Expenses</div>
                <div className="text-2xl text-[#2EC4B6]">{formatMoney(banking.monthlyExpensesCents, currency)}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-[#2EC4B6]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541]">Income vs Expenses</CardTitle>
              <p className="text-xs text-gray-500">
                Recorded monthly cash flow from settlements
                {cashFlowData.length === 0
                  ? ` · current run-rate ${formatMoney(banking.monthlySalaryCents, currency)} in / ${formatMoney(banking.monthlyExpensesCents, currency)} out`
                  : ''}
              </p>
            </CardHeader>
            <CardContent>
              {cashFlowData.length === 0 ? (
                <p className="text-sm text-gray-500 py-16 text-center">
                  No cash-flow history yet — advance to a month settlement to record income and expenses.
                </p>
              ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="income" fill="#2EC4B6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expenses" fill="#F4B400" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#2EC4B6]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541]">Transfer Funds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">From</label>
                  <Select value={fromAccountId} onValueChange={setFromAccountId}>
                    <SelectTrigger>
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
                  <label className="text-sm text-gray-600">To</label>
                  <Select value={toAccountId} onValueChange={setToAccountId}>
                    <SelectTrigger>
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
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Amount</label>
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  value={transferAmount}
                  onChange={(event) => setTransferAmount(event.target.value)}
                />
              </div>
              {transferError ? <p className="text-sm text-red-600">{transferError}</p> : null}
              <Button
                className="w-full bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white"
                onClick={handleTransfer}
                disabled={isTransferring}
              >
                Transfer
              </Button>
            </CardContent>
          </Card>

          <Card className="border-[#F4B400]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541]">Personal Loan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {banking.activeLoan ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining balance</span>
                    <span className="text-[#1C2541]">{formatMoney(banking.activeLoan.remainingCents, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly payment</span>
                    <span>{formatMoney(banking.activeLoan.monthlyPaymentCents, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">APR</span>
                    <span>{(banking.activeLoan.apr * 100).toFixed(1)}%</span>
                  </div>
                  {loanError ? <p className="text-sm text-red-600">{loanError}</p> : null}
                  <Button
                    className="w-full bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white"
                    onClick={handlePayOffLoan}
                    disabled={isPayingLoan}
                  >
                    Pay Off Loan ({formatMoney(banking.activeLoan.remainingCents, currency)})
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Loan amount</label>
                    <Input
                      type="number"
                      min="100"
                      step="100"
                      value={loanAmount}
                      onChange={(event) => setLoanAmount(event.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Credit score {banking.creditScore} ({creditScoreLabel(banking.creditScore)}). One active loan at a time.
                  </p>
                  {loanError ? <p className="text-sm text-red-600">{loanError}</p> : null}
                  <Button
                    className="w-full bg-[#F4B400] hover:bg-[#d69f00] text-white"
                    onClick={handleApplyLoan}
                    disabled={isApplyingLoan || banking.creditScore < 580}
                  >
                    Apply for Loan
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#2EC4B6]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541]">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <p className="text-sm text-gray-500">Advance time to see transactions.</p>
                ) : (
                  transactions.map((transaction) => (
                    <div
                      key={`${transaction.date}-${transaction.description}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="text-sm text-[#1C2541]">{transaction.description}</div>
                        <div className="text-xs text-gray-500">{transaction.date}</div>
                      </div>
                      <div
                        className={`font-medium ${
                          transaction.type === "credit" ? "text-[#2EC4B6]" : "text-gray-700"
                        }`}
                      >
                        {transaction.type === "credit" ? "+" : ""}
                        ${Math.abs(transaction.amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
