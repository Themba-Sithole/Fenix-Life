import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, CreditCard, TrendingUp, TrendingDown, DollarSign, PiggyBank, Home, Briefcase } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function BankingDashboard() {
  const navigate = useNavigate();

  const balanceHistory = [
    { month: "Jan", balance: 720000 },
    { month: "Feb", balance: 750000 },
    { month: "Mar", balance: 785000 },
    { month: "Apr", balance: 810000 },
    { month: "May", balance: 835000 },
    { month: "Jun", balance: 850000 },
  ];

  const cashFlowData = [
    { month: "Jan", income: 85000, expenses: 35000 },
    { month: "Feb", income: 92000, expenses: 37000 },
    { month: "Mar", income: 98000, expenses: 38000 },
    { month: "Apr", income: 105000, expenses: 39000 },
    { month: "May", income: 112000, expenses: 41000 },
    { month: "Jun", income: 118000, expenses: 42500 },
  ];

  const transactions = [
    { date: "Jul 10", description: "Salary - TechVentures", amount: 8500, type: "credit" },
    { date: "Jul 9", description: "Mortgage Payment", amount: -3200, type: "debit" },
    { date: "Jul 8", description: "Stock Dividend - AAPL", amount: 450, type: "credit" },
    { date: "Jul 7", description: "Amazon Purchase", amount: -129, type: "debit" },
    { date: "Jul 6", description: "Car Insurance", amount: -280, type: "debit" },
    { date: "Jul 5", description: "Rental Income", amount: 2800, type: "credit" },
  ];

  const accounts = [
    { name: "Checking Account", balance: 125000, type: "checking", icon: DollarSign, color: "text-[#2EC4B6]" },
    { name: "Savings Account", balance: 485000, type: "savings", icon: PiggyBank, color: "text-[#F4B400]" },
    { name: "Business Account", balance: 240000, type: "business", icon: Briefcase, color: "text-[#1C2541]" },
    { name: "Investment Account", balance: 485000, type: "investment", icon: TrendingUp, color: "text-[#2EC4B6]" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA]">
      {/* Hero Header with Image */}
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
                <p className="text-gray-300">Financial Overview</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">Total Net Worth</p>
                <p className="text-3xl text-[#2EC4B6]">$1,335,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Accounts Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          {accounts.map((account) => (
            <Card key={account.name} className="border-[#2EC4B6]/20 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <account.icon className={`w-5 h-5 ${account.color}`} />
                  <Badge variant="outline" className="text-xs">Active</Badge>
                </div>
                <div className="text-sm text-gray-600 mb-1">{account.name}</div>
                <div className="text-2xl text-[#1C2541]">
                  ${account.balance.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Balance History Chart */}
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
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Area type="monotone" dataKey="balance" stroke="#2EC4B6" fillOpacity={1} fill="url(#colorBalance)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Loans & Credit */}
          <Card className="border-[#F4B400]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541]">Loans & Credit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-4 h-4 text-[#2EC4B6]" />
                  <span className="text-sm">Mortgage</span>
                </div>
                <div className="text-xl text-[#1C2541]">$285,000</div>
                <div className="text-xs text-gray-500 mt-1">3.2% APR • 22 years left</div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-[#F4B400]" />
                  <span className="text-sm">Credit Card</span>
                </div>
                <div className="text-xl text-[#1C2541]">$2,450</div>
                <div className="text-xs text-gray-500 mt-1">$50,000 limit • 4.9% used</div>
              </div>
              <div className="p-4 rounded-lg bg-[#2EC4B6]/10">
                <div className="text-sm text-gray-600 mb-1">Available Credit</div>
                <div className="text-2xl text-[#2EC4B6]">$47,550</div>
              </div>
            </CardContent>
          </Card>

          {/* Cash Flow */}
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
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#2EC4B6] rounded"></div>
                  <span className="text-sm text-gray-600">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#F4B400] rounded"></div>
                  <span className="text-sm text-gray-600">Expenses</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="border-[#2EC4B6]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541]">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction, index) => (
                  <div
                    key={index}
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
                      {transaction.type === "credit" ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}