import { useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Briefcase,
  Building2,
  Calendar,
  Car,
  GraduationCap,
  Heart,
  Home as HomeIcon,
  Map,
  Newspaper,
  Settings,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useSimulation, formatGameDate } from "@/context/SimulationContext";
import { formatMoney, totalNetWorthCents } from "@fenix/domain";
import { useSimulationGate } from "@/hooks/useSimulationGate";
import { LifeShell } from "../components/shell";
import { cn } from "../components/ui/utils";

const APP_TONES = [
  "bg-primary text-primary-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-accent text-accent-foreground",
  "bg-fenix-blue text-white",
  "bg-fenix-navy text-white",
  "bg-fenix-gold text-fenix-navy",
] as const;

export default function Smartphone() {
  const navigate = useNavigate();
  const { world, formattedDate, tickCount } = useSimulation();
  const simulationGate = useSimulationGate("Loading phone…");

  const stats = useMemo(() => {
    if (!world) return null;
    return {
      netWorth: totalNetWorthCents(world.banking),
      currency: world.origin.currency,
      unreadNews: world.events.filter((event) => event.category === "news").length,
      company: world.company?.name ?? "No company",
      familyCount: world.family.members.length,
    };
  }, [world]);

  if (simulationGate) return simulationGate;
  if (!world || !stats) return null;

  const apps = [
    { id: "news", name: "News", icon: Newspaper, path: "/news", badge: stats.unreadNews > 0 ? String(stats.unreadNews) : undefined },
    { id: "banking", name: "Bank", icon: Building2, path: "/banking", badge: formatMoney(stats.netWorth, stats.currency) },
    { id: "timeline", name: "Story", icon: Calendar, path: "/timeline" },
    { id: "family", name: "Family", icon: Heart, path: "/family", badge: String(stats.familyCount) },
    { id: "maps", name: "City", icon: Map, path: "/city" },
    { id: "company", name: "Biz", icon: Building2, path: "/company" },
    { id: "education", name: "School", icon: GraduationCap, path: "/education" },
    { id: "career", name: "Jobs", icon: Briefcase, path: "/career" },
    { id: "properties", name: "Home", icon: HomeIcon, path: "/real-estate" },
    { id: "vehicles", name: "Cars", icon: Car, path: "/vehicles" },
    { id: "stocks", name: "Broker", icon: TrendingUp, path: "/stocks" },
    { id: "legacy", name: "Legacy", icon: Trophy, path: "/timeline" },
    { id: "settings", name: "Settings", icon: Settings, path: "/settings" },
  ] as const;

  return (
    <LifeShell
      playerName={world.player.displayName}
      ageYears={world.player.ageYears}
      dateLabel={formattedDate ?? undefined}
      statusLine="Phone"
    >
      <div className="flex justify-center">
        <div className="w-full max-w-[380px] rounded-[2rem] border border-border bg-fenix-navy p-2 shadow-lg">
          <div className="overflow-hidden rounded-[1.6rem] bg-surface-1 min-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between bg-primary px-4 py-2.5 text-primary-foreground text-sm">
              <span>{formattedDate ?? formatGameDate(world.currentDate)}</span>
              <span className="opacity-80">Day {tickCount + 1}</span>
            </div>

            <div className="flex items-center justify-between px-4 pt-3">
              <div>
                <p className="font-display text-lg text-foreground">{world.player.displayName}</p>
                <p className="text-xs text-muted-foreground">{world.career.jobTitle}</p>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Close phone"
                onClick={() => navigate("/home")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-3 p-4 pb-8 flex-1 content-start">
              {apps.map((app, index) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => navigate(app.path)}
                  className="relative flex flex-col items-center gap-1.5 rounded-lg p-1.5 transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl",
                      APP_TONES[index % APP_TONES.length],
                    )}
                  >
                    <app.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="text-[10px] text-foreground text-center leading-tight">{app.name}</span>
                  {"badge" in app && app.badge ? (
                    <span className="absolute -top-0.5 right-0 max-w-[3.5rem] truncate rounded bg-secondary px-1 text-[9px] text-secondary-foreground">
                      {app.badge}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>

            <div className="mx-auto mb-3 h-1 w-24 rounded-full bg-muted" aria-hidden />
          </div>
        </div>
      </div>
    </LifeShell>
  );
}
