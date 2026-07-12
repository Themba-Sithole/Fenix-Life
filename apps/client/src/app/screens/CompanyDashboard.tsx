import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useSimulation } from "@/context/SimulationContext";
import { useSimulationGate } from "@/hooks/useSimulationGate";
import {
  companyMonthlyProfitCents,
  companyStageLabel,
  formatMoney,
  INCORPORATION_FEE_CENTS,
  suggestedCompanyName,
} from "@fenix/domain";
import { DecisionPanel, HistoryChart, ToolShell } from "../components/shell";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { world, applyAction, formattedDate } = useSimulation();
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

  const simulationGate = useSimulationGate("Loading company dataâ€¦");
  if (simulationGate) return simulationGate;
  if (!world) return null;

  if (!world.company) {
    const currency = world.origin.currency;
    const defaultName = suggestedCompanyName(world.player.displayName);
    const checking = world.banking.accounts.find((a) => a.id === "checking")?.balanceCents ?? 0;

    return (
      <ToolShell institution="Company HQ" subtitle={`${world.player.displayName} Â· New venture`} lastUpdated={formattedDate ?? undefined} metrics={[{ label: "Checking", value: formatMoney(checking, currency) }]}>
        <DecisionPanel title="Found a company" description="Incorporate a new venture at the idea stage â€” zero employees, zero revenue.">
            <div className="space-y-5 text-muted-foreground">
              <p>
                Incorporate a new venture at the idea stage â€” zero employees, zero revenue. Same rules as AI founders.
              </p>
              <p className="text-sm text-muted-foreground">
                Suggested path: {world.lifePath.replace(/-/g, " ")} â€” hints only, never a lock.
              </p>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company name</Label>
                <Input
                  id="companyName"
                  placeholder={defaultName}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="border-accent/30"
                />
              </div>

              <div className="rounded-lg bg-gray-50 p-4 text-sm space-y-1">
                <p>
                  Incorporation fee:{" "}
                  <span className="font-medium text-secondary">
                    {formatMoney(INCORPORATION_FEE_CENTS, currency)}
                  </span>
                </p>
                <p>
                  Checking balance:{" "}
                  <span className={checking >= INCORPORATION_FEE_CENTS ? "text-accent" : "text-destructive"}>
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
                  className="bg-accent hover:bg-accent/80 text-white"
                >
                  {busyAction === "FOUND_COMPANY" ? "Incorporatingâ€¦" : "Incorporate Company"}
                </Button>
                <Button variant="outline" onClick={() => navigate("/banking")}>
                  Review Finances
                </Button>
              </div>
            </div>
        </DecisionPanel>
      </ToolShell>
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
  const departmentData = Object.entries(departmentCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const priorRevenue = revenueData.length >= 2 ? revenueData[revenueData.length - 2]?.revenue : null;
  const latestRevenue = revenueData.length >= 1 ? revenueData[revenueData.length - 1]?.revenue : null;
  const revenueTrendLabel =
    priorRevenue != null && latestRevenue != null
      ? latestRevenue >= priorRevenue
        ? `+${(((latestRevenue - priorRevenue) / Math.max(priorRevenue, 1)) * 100).toFixed(0)}% vs prior`
        : `${(((latestRevenue - priorRevenue) / Math.max(priorRevenue, 1)) * 100).toFixed(0)}% vs prior`
      : `${company.marketSharePct.toFixed(1)}% share`;

  return (
    <ToolShell
      institution="Company HQ"
      subtitle={`${company.name} Â· ${companyStageLabel(company.stage)}`}
      lastUpdated={formattedDate ?? undefined}
      metrics={[
        { label: "Revenue", value: formatMoney(company.monthlyRevenueCents, currency) },
        { label: "Profit", value: formatMoney(profit, currency) },
        { label: "Employees", value: String(company.employeeCount) },
      ]}
    >
      <div>
        <section className="mb-6 flex flex-wrap gap-x-8 gap-y-3 border-y border-border py-4 text-sm">
          <div><span className="text-muted-foreground">Revenue: </span>{formatMoney(company.monthlyRevenueCents, currency)} <span className="text-muted-foreground">({revenueTrendLabel})</span></div>
          <div><span className="text-muted-foreground">Profit: </span>{formatMoney(profit, currency)}</div>
          <div><span className="text-muted-foreground">Products: </span>{company.productCount}</div>
          <div><span className="text-muted-foreground">Valuation: </span>{formatMoney(company.valuationCents, currency)}</div>
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          <HistoryChart
            title="Revenue and profit"
            description="Recorded monthly results from the simulation."
            data={revenueData.map((point) => ({ label: point.month, value: point.revenue, value2: point.profit }))}
            variant="bar"
            emptyTitle="No revenue history"
            emptyDescription="Advance time or launch products to build a trend."
            valueFormatter={(value) => formatMoney(Math.round(value * 100), currency)}
            seriesLabels={{ primary: "Revenue", secondary: "Profit" }}
          />
          <DecisionPanel title="Team by department" description="Live employee roster.">
            {departmentData.length === 0 ? <p className="text-sm text-muted-foreground">No employees on roster yet.</p> : (
              <ul className="divide-y divide-border">{departmentData.map((department) => <li key={department.name} className="flex justify-between py-2 text-sm"><span>{department.name}</span><span className="tabular-nums">{department.value}</span></li>)}</ul>
            )}
          </DecisionPanel>
        </div>

        {actionError ? (
          <p className="mt-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{actionError}</p>
        ) : null}

        <section className="mt-6 rounded-lg border border-border bg-surface-1 p-5">
          <h2 className="mb-4 font-semibold text-secondary">Company Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/employees")}
            >
              Manage Employees
            </Button>
            <Button
              className="bg-accent hover:bg-accent/80 text-white"
              disabled={busyAction !== null}
              onClick={() => handleCompanyAction("COMPANY_HIRE")}
            >
              Hire Employee ($5,000)
            </Button>
            <Button
              className="bg-fenix-gold hover:bg-fenix-gold/80 text-white"
              disabled={busyAction !== null}
              onClick={() => handleCompanyAction("COMPANY_LAUNCH_PRODUCT")}
            >
              Launch Product ($12,000)
            </Button>
          </div>
        </section>
      </div>
    </ToolShell>
  );
}
