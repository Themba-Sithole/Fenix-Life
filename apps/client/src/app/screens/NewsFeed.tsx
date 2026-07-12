import { useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { useSimulationGate } from "@/hooks/useSimulationGate";
import {
  cyclePhaseLabel,
  impactChangesLabel,
  type SimEventCategory,
  type WorldImpactTag,
} from "@fenix/domain";
import { EmptyState, LifeShell } from "../components/shell";

function toneToImpact(tone: string): "positive" | "negative" | "neutral" {
  switch (tone) {
    case "success":
      return "positive";
    case "warning":
      return "negative";
    default:
      return "neutral";
  }
}

const CATEGORIES: Array<SimEventCategory | "all"> = ["all", "news", "finance", "career", "life"];

export default function NewsFeed() {
  const { world, formattedDate } = useSimulation();
  const [category, setCategory] = useState<SimEventCategory | "all">("all");
  const [impactOnly, setImpactOnly] = useState(false);

  const news = useMemo(() => {
    if (!world) return [];
    return world.events
      .filter((event) => (category === "all" ? true : event.category === category))
      .filter((event) => (impactOnly ? Boolean(event.impact && event.impact !== "none") : true))
      .map((event) => ({
        headline: event.headline,
        category: event.category,
        impact: toneToImpact(event.tone),
        worldImpact: event.impact as WorldImpactTag | undefined,
        time: event.date,
        summary:
          event.impact && event.impact !== "none"
            ? `This changes: ${impactChangesLabel(event.impact)}`
            : event.category === "news"
              ? `Market and economy update during ${cyclePhaseLabel(world.economy.cyclePhase).toLowerCase()} phase.`
              : `${event.headline} — recorded on day ${event.tickCount + 1}.`,
      }));
  }, [world, category, impactOnly]);

  const simulationGate = useSimulationGate("Loading news feed…");
  if (simulationGate) return simulationGate;
  if (!world) return null;

  return (
    <LifeShell
      playerName={world.player.displayName}
      ageYears={world.player.ageYears}
      dateLabel={formattedDate ?? undefined}
      statusLine="News desk"
    >
      <header className="mb-6">
          <p className="text-sm text-muted-foreground">World report</p>
          <h1 className="font-display text-3xl tracking-tight text-foreground">News Feed</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Economy in {cyclePhaseLabel(world.economy.cyclePhase)} phase · inflation{" "}
            {(world.economy.inflationRateAnnual * 100).toFixed(1)}%
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={category === item ? "default" : "outline"}
                className={
                  category === item
                    ? "bg-secondary text-secondary-foreground"
                    : ""
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </Button>
            ))}
            <Button
              size="sm"
              variant={impactOnly ? "default" : "outline"}
              className={
                impactOnly
                  ? "bg-accent text-accent-foreground"
                  : ""
              }
              onClick={() => setImpactOnly((value) => !value)}
            >
              World-changing only
            </Button>
          </div>
      </header>
      <section className="space-y-4">
        {news.length === 0 ? (
          <EmptyState title="No reports yet" description="Advance time to generate news about your finances, company, and the economy." />
        ) : (
          <ul className="divide-y divide-border">
          {news.map((item) => (
            <li key={`${item.time}-${item.headline}`} className="py-5">
                <div className="flex items-start gap-4">
                  {item.impact === "positive" ? <TrendingUp className="h-5 w-5 shrink-0 text-secondary" aria-hidden /> : item.impact === "negative" ? <TrendingDown className="h-5 w-5 shrink-0 text-destructive" aria-hidden /> : <AlertCircle className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg text-secondary">{item.headline}</h3>
                      <Badge
                        variant="outline"
                        className={
                          item.impact === "positive"
                            ? "border-secondary/30 bg-secondary/10 text-secondary"
                            : item.impact === "negative"
                              ? "border-destructive/30 bg-destructive/10 text-destructive"
                              : ""
                        }
                      >
                        {item.category}
                      </Badge>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">{item.summary}</p>
                    {item.worldImpact && item.worldImpact !== "none" ? (
                      <p className="text-xs text-secondary mb-2 font-medium">
                        This changes {impactChangesLabel(item.worldImpact)}
                      </p>
                    ) : null}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{item.time}</span>
                      {item.impact === "positive" && (
                        <span className="flex items-center gap-1 text-accent">
                          <TrendingUp className="w-3 h-3" /> Positive
                        </span>
                      )}
                      {item.impact === "negative" && (
                        <span className="flex items-center gap-1 text-orange-600">
                          <TrendingDown className="w-3 h-3" /> Negative
                        </span>
                      )}
                      {item.impact === "neutral" && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <AlertCircle className="w-3 h-3" /> Neutral
                        </span>
                      )}
                    </div>
                  </div>
                </div>
            </li>
          ))}
          </ul>
        )}
      </section>
    </LifeShell>
  );
}
