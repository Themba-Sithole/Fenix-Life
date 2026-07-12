import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, TrendingUp, TrendingDown, Users, DollarSign, Package, BarChart3, Rocket } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useSimulation } from "@/context/SimulationContext";
import { useSimulationGate } from "@/hooks/useSimulationGate";
import {
  companyMonthlyProfitCents,
  companyStageLabel,
  formatMoney,
  INCORPORATION_FEE_CENTS,
  suggestedCompanyName,
} from "@fenix/domain";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { world, isLoading, applyAction } = useSimulation();
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");

  async function handleFoundCompany() {
    setActionError(null);
    setBusyAction("FOUND_COMPANY");
    try {
      await applyAction({ kind: "FOUND_COMPANY", name: companyName });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not incorporate.");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleCompanyAction(kind: "COMPANY_HIRE" | "COMPANY_LAUNCH_PRODUCT") {
    setActionError(null);
    setBusyAction(kind);
    try {
      await applyAction({ kind });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Action failed.");
    } finally {
      setBusyAction(null);
    }
  }

  const simulationGate = useSimulationGate("Loading company data…");
  if (simulationGate) return simulationGate;
  if (!world) return null;

  if (!world.company) {
    const currency = world.origin.currency;
    const defaultName = suggestedCompanyName(world.player.displayName);
    const checking = world.banking.accounts.find((a) => a.id === "checking")?.balanceCents ?? 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA] p-6">
        <div className="max-w-3xl mx-auto">
          <Button variant="outline" onClick={() => navigate("/home")} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Card className="border-[#2EC4B6]/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-[#1C2541] flex items-center gap-2">
                <Rocket className="w-6 h-6 text-[#2EC4B6]" />
                Found a Company
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-gray-600">
              <p>
                Incorporate a new venture at the idea stage — zero employees, zero revenue. Same rules as AI founders.
              </p>
              <p className="text-sm text-gray-500">
                Suggested path: {world.lifePath.replace(/-/g, " ")} — hints only, never a lock.
              </p>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company name</Label>
                <Input
                  id="companyName"
                  placeholder={defaultName}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="border-[#2EC4B6]/30"
                />
              </div>

              <div className="rounded-lg bg-gray-50 p-4 text-sm space-y-1">
                <p>
                  Incorporation fee:{" "}
                  <span className="font-medium text-[#1C2541]">
                    {formatMoney(INCORPORATION_FEE_CENTS, currency)}
                  </span>
                </p>
                <p>
                  Checking balance:{" "}
                  <span className={checking >= INCORPORATION_FEE_CENTS ? "text-[#2EC4B6]" : "text-orange-600"}>
                    {formatMoney(checking, currency)}
                  </span>
                </p>
              </div>

              {actionError ? (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{actionError}</p>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleFoundCompany}
                  disabled={busyAction === "FOUND_COMPANY" || checking < INCORPORATION_FEE_CENTS}
                  className="bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white"
                >
                  {busyAction === "FOUND_COMPANY" ? "Incorporating…" : "Incorporate Company"}
                </Button>
                <Button variant="outline" onClick={() => navigate("/banking")}>
                  Review Finances
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { company } = world;
  const currency = world.origin.currency;
  const profit = companyMonthlyProfitCents(company);
  const revenueData = [...(company.revenueHistory ?? [])]
    .reverse()
    .map((point) => ({
      month: point.date,
      revenue: point.revenueCents / 100,
      profit: point.profitCents / 100,
    }));

  const departmentCounts = world.employees.reduce<Record<string, number>>((acc, employee) => {
    acc[employee.department] = (acc[employee.department] ?? 0) + 1;
    return acc;
  }, {});
  const departmentColors: Record<string, string> = {
    Engineering: "#2EC4B6",
    Sales: "#F4B400",
    Marketing: "#1C2541",
    Operations: "#0B132B",
  };
  const departmentData = Object.entries(departmentCounts).map(([name, value]) => ({
    name,
    value,
    color: departmentColors[name] ?? "#6b7280",
  }));

  const priorRevenue = revenueData.length >= 2 ? revenueData[revenueData.length - 2]?.revenue : null;
  const latestRevenue = revenueData.length >= 1 ? revenueData[revenueData.length - 1]?.revenue : null;
  const revenueTrendLabel =
    priorRevenue != null && latestRevenue != null
      ? latestRevenue >= priorRevenue
        ? `+${(((latestRevenue - priorRevenue) / Math.max(priorRevenue, 1)) * 100).toFixed(0)}% vs prior`
        : `${(((latestRevenue - priorRevenue) / Math.max(priorRevenue, 1)) * 100).toFixed(0)}% vs prior`
      : `${company.marketSharePct.toFixed(1)}% share`;

  const metrics = [
    {
      label: "Revenue",
      value: formatMoney(company.monthlyRevenueCents, currency),
      change: revenueTrendLabel,
      trend: profit >= 0 ? "up" : "down",
      icon: DollarSign,
    },
    {
      label: "Profit",
      value: formatMoney(profit, currency),
      change: `${company.marketSharePct.toFixed(1)}% share`,
      trend: profit >= 0 ? "up" : "down",
      icon: TrendingUp,
    },
    {
      label: "Employees",
      value: String(company.employeeCount),
      change: `${company.productCount} products`,
      trend: "up",
      icon: Users,
    },
    {
      label: "Valuation",
      value: formatMoney(company.valuationCents, currency),
      change: companyStageLabel(company.stage),
      trend: "up",
      icon: Package,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA]">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1707077865701-2854996afc4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZyUyMGNpdHlzY2FwZXxlbnwxfHx8fDE3ODM3MDY3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Modern office building"
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
                <h1 className="text-4xl text-white mb-2">{company.name}</h1>
                <p className="text-gray-300">Live simulation · {companyStageLabel(company.stage)}</p>
              </div>
              <Badge className="bg-[#2EC4B6] text-white px-4 py-2 text-sm">
                Tech index {world.economy.techSectorIndex.toFixed(1)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          {metrics.map((metric) => (
            <Card key={metric.label} className="border-[#2EC4B6]/20 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className="w-5 h-5 text-[#2EC4B6]" />
                  <Badge
                    variant="outline"
                    className={`${
                      metric.trend === "up"
                        ? "bg-[#2EC4B6]/10 text-[#2EC4B6] border-[#2EC4B6]/30"
                        : "bg-orange-50 text-orange-600 border-orange-200"
                    }`}
                  >
                    {metric.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {metric.change}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
                <div className="text-2xl text-[#1C2541]">{metric.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-[#2EC4B6]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#2EC4B6]" />
                Revenue & Profit Trend
              </CardTitle>
              <p className="text-xs text-gray-500">Recorded monthly revenue and profit from simulation</p>
            </CardHeader>
            <CardContent>
              {revenueData.length === 0 ? (
                <p className="text-sm text-gray-500 py-16 text-center">
                  No revenue history yet — advance time or launch products to build a trend.
                </p>
              ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#2EC4B6" radius={[8, 8, 0, 0]} name="Revenue" />
                  <Bar dataKey="profit" fill="#F4B400" radius={[8, 8, 0, 0]} name="Profit" />
                </BarChart>
              </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#F4B400]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541]">Team by Department</CardTitle>
              <p className="text-xs text-gray-500">From live employee roster</p>
            </CardHeader>
            <CardContent>
              {departmentData.length === 0 ? (
                <p className="text-sm text-gray-500 py-16 text-center">
                  No employees on roster yet — hire to see department mix.
                </p>
              ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {departmentData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {actionError ? (
          <p className="mt-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{actionError}</p>
        ) : null}

        <Card className="mt-6 border-[#2EC4B6]/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#1C2541]">Company Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/employees")}
            >
              Manage Employees
            </Button>
            <Button
              className="bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white"
              disabled={busyAction !== null}
              onClick={() => handleCompanyAction("COMPANY_HIRE")}
            >
              Hire Employee ($5,000)
            </Button>
            <Button
              className="bg-[#F4B400] hover:bg-[#d69f00] text-white"
              disabled={busyAction !== null}
              onClick={() => handleCompanyAction("COMPANY_LAUNCH_PRODUCT")}
            >
              Launch Product ($12,000)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
