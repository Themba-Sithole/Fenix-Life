import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, CreditCard, TrendingUp, DollarSign, PiggyBank, Home, Briefcase } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useSimulation } from "@/context/SimulationContext";
import { formatMoney, totalNetWorthCents, type BankAccountType } from "@fenix/domain";

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

function buildBalanceHistory(netWorthCents: number, tickCount: number) {
  const labels = ["M-5", "M-4", "M-3", "M-2", "M-1", "Now"];
  const drift = Math.min(tickCount * 50_00, netWorthCents * 0.15);
  const start = Math.max(0, netWorthCents - drift);

  return labels.map((month, index) => ({
    month,
    balance: Math.round(start + ((netWorthCents - start) * (index + 1)) / labels.length),
  }));
}

export default function BankingDashboard() {
  const navigate = useNavigate();
  const { world, isLoading } = useSimulation();

  if (isLoading || !world) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] text-[#1C2541]">
        Loading banking data…
      </div>
    );
  }

  const { banking } = world;
  const currency = world.origin.currency;
  const netWorth = totalNetWorthCents(banking);
  const balanceHistory = buildBalanceHistory(netWorth, world.clock.tickCount);
  const monthlyIncome = banking.monthlySalaryCents / 100;
  const monthlyExpenses = banking.monthlyExpensesCents / 100;

  const cashFlowData = [
    { month: "M-2", income: monthlyIncome * 0.95, expenses: monthlyExpenses * 0.95 },
    { month: "M-1", income: monthlyIncome * 0.98, expenses: monthlyExpenses * 0.98 },
    { month: "Now", income: monthlyIncome, expenses: monthlyExpenses },
  ];

  const transactions = banking.transactions.map((tx) => ({
    date: tx.date,
    description: tx.description,
    amount: tx.amountCents / 100,
    type: tx.amountCents >= 0 ? "credit" as const : "debit" as const,
  }));

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
              <Card key={account.id} className="border-[#2EC4B6]/20 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
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
            </CardHeader>
            <CardContent>
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
            </CardHeader>
            <CardContent>
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
