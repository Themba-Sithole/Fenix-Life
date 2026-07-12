import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  Coffee,
  Factory,
  GraduationCap,
  Home,
  Hospital,
  Plane,
  ShoppingBag,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { useSimulation } from "@/context/SimulationContext";
import { useSimulationGate } from "@/hooks/useSimulationGate";
import {
  buildCityDistricts,
  cyclePhaseLabel,
  districtCooldownRemaining,
  formatOriginLocation,
} from "@fenix/domain";
import { LifeShell } from "../components/shell";
import { cn } from "../components/ui/utils";

const DISTRICT_ICONS = {
  downtown: Building2,
  university: GraduationCap,
  hospital: Hospital,
  mall: ShoppingBag,
  airport: Plane,
  cafe: Coffee,
  tech: Factory,
  residential: Home,
} as const;

const DISTRICT_TONES: Record<string, string> = {
  downtown: "bg-primary text-primary-foreground",
  university: "bg-secondary text-secondary-foreground",
  hospital: "bg-destructive text-destructive-foreground",
  mall: "bg-accent text-accent-foreground",
  airport: "bg-fenix-blue text-white",
  cafe: "bg-fenix-gold text-fenix-navy",
  tech: "bg-secondary text-secondary-foreground",
  residential: "bg-primary text-primary-foreground",
};

export default function CityMap() {
  const navigate = useNavigate();
  const { world, applyAction, formattedDate } = useSimulation();
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyDistrict, setBusyDistrict] = useState<string | null>(null);

  const districts = useMemo(() => (world ? buildCityDistricts(world) : []), [world]);

  async function handleVisit(districtId: string) {
    setActionError(null);
    setBusyDistrict(districtId);
    try {
      await applyAction({ kind: "VISIT_DISTRICT", districtId });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Visit failed.");
    } finally {
      setBusyDistrict(null);
    }
  }

  const simulationGate = useSimulationGate("Loading city map…");
  if (simulationGate) return simulationGate;
  if (!world) return null;

  return (
    <LifeShell
      playerName={world.player.displayName}
      ageYears={world.player.ageYears}
      dateLabel={formattedDate ?? undefined}
      statusLine={`${formatOriginLocation(world.origin)} · ${cyclePhaseLabel(world.economy.cyclePhase)}`}
    >
      <header className="mb-6">
        <p className="text-sm text-muted-foreground">Explore</p>
        <h1 className="font-display text-3xl text-foreground tracking-tight">Fenix City</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a place. Risk and opportunity change with the cycle.
        </p>
      </header>

      {actionError ? (
        <p className="mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          {actionError}
        </p>
      ) : null}

      <ul className="grid gap-3 sm:grid-cols-2">
        {districts.map((district) => {
          const Icon = DISTRICT_ICONS[district.id as keyof typeof DISTRICT_ICONS] ?? Building2;
          const tone = DISTRICT_TONES[district.id] ?? "bg-primary text-primary-foreground";
          const cooldownRemaining = districtCooldownRemaining(world, district.id);
          const onCooldown = cooldownRemaining > 0;

          return (
            <li key={district.id} className="overflow-hidden rounded-lg border border-border bg-surface-1">
              <div className={cn("flex items-center gap-3 px-4 py-3", tone)}>
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <div className="min-w-0">
                  <p className="font-display text-lg leading-tight">{district.name}</p>
                  <p className="text-xs opacity-80 truncate">{district.description}</p>
                </div>
              </div>
              <div className="px-4 py-3 space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Activity</span>
                    <span>{district.activityLevel}% · Risk {Math.round(district.visitOutcome.crimeRisk * 100)}%</span>
                  </div>
                  <Progress value={district.activityLevel} className="h-1.5" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {district.route ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(district.route!)}
                    >
                      Enter
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    size="sm"
                    className="bg-secondary text-secondary-foreground hover:opacity-90"
                    disabled={busyDistrict !== null || onCooldown}
                    onClick={() => handleVisit(district.id)}
                  >
                    {busyDistrict === district.id
                      ? "Visiting…"
                      : onCooldown
                        ? `Cooldown ${cooldownRemaining}d`
                        : "Visit"}
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </LifeShell>
  );
}
