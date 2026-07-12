import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { ArrowLeft, TrendingUp, Award, DollarSign } from "lucide-react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { useSimulation } from "@/context/SimulationContext";
import { useSimulationGate } from "@/hooks/useSimulationGate";
import {
  employeeExperienceLabel,
  employeeInitials,
  formatMoney,
} from "@fenix/domain";
import { EmptyState, ToolShell } from "../components/shell";

export default function EmployeeManagement() {
  const navigate = useNavigate();
  const { world, applyAction, formattedDate } = useSimulation();
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const employees = useMemo(() => world?.employees ?? [], [world]);

  async function handleAction(
    employeeId: string,
    kind: "EMPLOYEE_PROMOTE" | "EMPLOYEE_RAISE" | "EMPLOYEE_TRAIN",
  ) {
    setActionError(null);
    setBusyKey(`${kind}:${employeeId}`);
    try {
      await applyAction({ kind, employeeId });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Action failed.");
    } finally {
      setBusyKey(null);
    }
  }

  const simulationGate = useSimulationGate("Loading employee roster…");
  if (simulationGate) return simulationGate;
  if (!world) return null;

  if (!world.company) {
    return (
      <ToolShell institution="Company HQ" subtitle={`${world.player.displayName} · Team`} lastUpdated={formattedDate ?? undefined} metrics={[]}>
          <EmptyState title="No company yet" description="Found a company first to manage employees." action={
              <Button onClick={() => navigate("/company")} className="bg-accent hover:bg-accent/80 text-white">
                Go to Company Dashboard
              </Button>
          } />
      </ToolShell>
    );
  }

  const currency = world.origin.currency;

  return (
    <ToolShell institution="Company HQ" subtitle={`${world.company.name} · Employee management`} lastUpdated={formattedDate ?? undefined} metrics={[{ label: "Employees", value: String(world.company.employeeCount) }]}>
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/company")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Company
          </Button>
          <div>
            <h1 className="text-3xl text-secondary">Employee Management</h1>
            <p className="text-gray-600">
              {world.company.employeeCount} total employees at {world.company.name}
            </p>
          </div>
        </div>

        {actionError ? (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{actionError}</p>
        ) : null}

        {employees.length === 0 ? (
          <section className="rounded-lg border border-border bg-surface-1 p-8 text-center space-y-4">
              <p className="text-gray-600">No employees on the roster yet.</p>
              <p className="text-sm text-gray-500">Hire staff from the Company Dashboard to build your team.</p>
              <Button onClick={() => navigate("/company")} className="bg-accent hover:bg-accent/80 text-white">
                Go to Company Dashboard
              </Button>
          </section>
        ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {employees.map((employee) => (
            <section key={employee.id} className="rounded-lg border border-border bg-surface-1 p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-16 h-16 border-2 border-accent">
                    <AvatarFallback className="bg-gradient-to-br from-accent to-secondary text-white">
                      {employeeInitials(employee)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl text-secondary">{employee.name}</h3>
                    <p className="text-gray-600">{employee.position}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-accent/20 text-accent border-accent/30">
                        {employee.department}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {employeeExperienceLabel(employee.yearsExperience)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Salary</div>
                    <div className="text-xl text-accent">
                      {formatMoney(employee.salaryCents, currency)}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Productivity</span>
                      <span className="text-sm text-secondary">{employee.productivity}%</span>
                    </div>
                    <Progress value={employee.productivity} className="h-2 bg-accent" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Creativity</span>
                      <span className="text-sm text-secondary">{employee.creativity}%</span>
                    </div>
                    <Progress value={employee.creativity} className="h-2 bg-fenix-gold" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Leadership</span>
                      <span className="text-sm text-secondary">{employee.leadership}%</span>
                    </div>
                    <Progress value={employee.leadership} className="h-2 bg-secondary" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Loyalty</span>
                      <span className="text-sm text-secondary">{employee.loyalty}%</span>
                    </div>
                    <Progress value={employee.loyalty} className="h-2 bg-accent" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-accent hover:bg-accent/80 text-white"
                    disabled={busyKey !== null}
                    onClick={() => handleAction(employee.id, "EMPLOYEE_PROMOTE")}
                  >
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Promote
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    disabled={busyKey !== null}
                    onClick={() => handleAction(employee.id, "EMPLOYEE_RAISE")}
                  >
                    <DollarSign className="w-4 h-4 mr-1" />
                    Raise
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    disabled={busyKey !== null}
                    onClick={() => handleAction(employee.id, "EMPLOYEE_TRAIN")}
                  >
                    <Award className="w-4 h-4 mr-1" />
                    Train
                  </Button>
                </div>
            </section>
          ))}
        </div>
        )}
      </div>
    </ToolShell>
  );
}
