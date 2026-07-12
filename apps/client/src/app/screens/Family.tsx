import { useState } from "react";
import { Button } from "../components/ui/button";
import { Calendar, Gift, Heart } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { useSimulationGate } from "@/hooks/useSimulationGate";
import { averageFamilyHappiness, familyDisplayName, formatMoney } from "@fenix/domain";
import { DecisionPanel, EmptyState, LifeShell } from "../components/shell";

export default function Family() {
  const { world, applyAction, formattedDate } = useSimulation();
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  async function handleFamilyAction(
    kind: "FAMILY_PLAN_EVENT" | "FAMILY_SEND_GIFT" | "FAMILY_SCHEDULE_VISIT",
    memberId?: string,
  ) {
    setActionError(null);
    setBusyKey(memberId ? `${kind}:${memberId}` : kind);
    try {
      if (kind === "FAMILY_PLAN_EVENT") {
        await applyAction({ kind });
      } else if (memberId) {
        await applyAction({ kind, memberId });
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Action failed.");
    } finally {
      setBusyKey(null);
    }
  }

  const simulationGate = useSimulationGate("Loading family data…");
  if (simulationGate) return simulationGate;
  if (!world) return null;

  const currency = world.origin.currency;
  const family = world.family;
  const happiness = averageFamilyHappiness(family);

  return (
    <LifeShell
      playerName={world.player.displayName}
      ageYears={world.player.ageYears}
      dateLabel={formattedDate ?? undefined}
      statusLine={familyDisplayName(world.player.displayName)}
    >
      <header className="mb-6">
        <p className="text-sm text-muted-foreground">Relationships</p>
        <h1 className="font-display text-3xl tracking-tight text-foreground">Family</h1>
        <p className="mt-1 text-sm text-muted-foreground">Care builds resilience across generations.</p>
      </header>
      {actionError ? (
        <p className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {actionError}
        </p>
      ) : null}
      <dl className="mb-6 flex flex-wrap gap-x-8 gap-y-3 border-b border-border pb-5">
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Members</dt>
          <dd className="font-display text-xl text-foreground">{family.members.length}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Family happiness</dt>
          <dd className="font-display text-xl text-foreground">{happiness}%</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Household expenses</dt>
          <dd className="font-display text-xl text-foreground">
            {formatMoney(family.householdExpensesCents, currency)}/mo
          </dd>
        </div>
      </dl>
      {family.members.length === 0 ? (
        <EmptyState
          title="No family members recorded"
          description="Relationships will appear as your life unfolds."
        />
      ) : (
        <ul className="surface-panel mb-6 overflow-hidden">
          {family.members.map((member) => (
            <li key={member.id} className="surface-row !flex-col !items-stretch sm:!flex-row sm:!items-center">
              <div className="flex w-full items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-surface-2 font-display text-sm text-foreground">
                  {member.name
                    .split(/\s+/)
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold text-foreground">{member.name}</p>
                  <p className="text-[11.5px] capitalize text-muted-foreground">
                    {member.relationship} · Age {member.ageYears}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[11.5px] tabular-nums text-muted-foreground">
                  {member.happiness}%
                </span>
              </div>
              <div className="mt-3 w-full sm:mt-0 sm:w-auto sm:shrink-0">
                <div className="mb-2 h-2 overflow-hidden rounded-full bg-surface-2 sm:hidden" role="presentation">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${member.happiness}%`,
                      backgroundColor: "var(--capital-social)",
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busyKey !== null}
                    onClick={() => handleFamilyAction("FAMILY_SEND_GIFT", member.id)}
                  >
                    <Gift className="mr-1 h-4 w-4" aria-hidden />
                    Gift
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busyKey !== null}
                    onClick={() => handleFamilyAction("FAMILY_SCHEDULE_VISIT", member.id)}
                  >
                    <Calendar className="mr-1 h-4 w-4" aria-hidden />
                    Visit
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <DecisionPanel
        title="Make time together"
        description="A planned event costs $200 and affects the household."
      >
        <Button
          variant="outline"
          className="h-14"
          disabled={busyKey !== null}
          onClick={() => handleFamilyAction("FAMILY_PLAN_EVENT")}
        >
          <Heart className="mr-2 h-4 w-4" aria-hidden />
          Plan family event
        </Button>
      </DecisionPanel>
    </LifeShell>
  );
}
