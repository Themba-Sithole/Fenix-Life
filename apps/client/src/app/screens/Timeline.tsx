import { useMemo } from "react";
import { Badge } from "../components/ui/badge";
import { Award, Building2, DollarSign, GraduationCap, Heart, TrendingUp, Users } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { useSimulationGate } from "@/hooks/useSimulationGate";
import { buildLifeTimeline, computeLegacySnapshot, formatMoney, type TimelineCategory } from "@fenix/domain";
import { EmptyState, LifeShell } from "../components/shell";

const CATEGORY_ICONS: Record<TimelineCategory, typeof Users> = {
  life: Users,
  finance: DollarSign,
  career: Building2,
  family: Heart,
  news: TrendingUp,
};

const CATEGORY_COLORS: Record<TimelineCategory, string> = {
  life: "bg-primary",
  finance: "bg-fenix-gold",
  career: "bg-accent",
  family: "bg-destructive",
  news: "bg-secondary",
};

export default function Timeline() {
  const { world, formattedDate } = useSimulation();

  const { timeline, legacy } = useMemo(() => {
    if (!world) {
      return { timeline: [], legacy: null };
    }
    return {
      timeline: buildLifeTimeline(world),
      legacy: computeLegacySnapshot(world),
    };
  }, [world]);

  const simulationGate = useSimulationGate("Loading life timeline…");
  if (simulationGate) return simulationGate;
  if (!world || !legacy) return null;

  const currency = world.origin.currency;

  return (
    <LifeShell playerName={world.player.displayName} ageYears={world.player.ageYears} dateLabel={formattedDate ?? undefined} statusLine="Life record">
      <header className="mb-6">
        <p className="text-sm text-muted-foreground">Legacy</p>
        <h1 className="font-display text-3xl tracking-tight text-foreground">Life Timeline</h1>
        <p className="mt-1 text-sm text-muted-foreground">{world.player.displayName}&apos;s journey, recorded as it happens.</p>
      </header>
        <section className="mb-8 border-y border-border py-6 text-center">
            <div className="text-sm text-muted-foreground">Legacy score</div>
            <div className="font-display my-2 text-5xl text-foreground">{legacy.score}</div>
            <Badge variant="outline">{legacy.label}</Badge>
            <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-5">
              <div>
                <dd className="font-display text-xl text-foreground">{legacy.achievementCount}</dd>
                <dt className="text-sm text-muted-foreground">Recorded events</dt>
              </div>
              <div>
                <dd className="font-display text-xl text-foreground">{formatMoney(legacy.netWorthCents, currency)}</dd>
                <dt className="text-sm text-muted-foreground">Net worth</dt>
              </div>
              <div>
                <dd className="font-display text-xl text-foreground">{legacy.ageYears}</dd>
                <dt className="text-sm text-muted-foreground">Years old</dt>
              </div>
            </dl>
        </section>
        <section>
            <h2 className="font-display flex items-center gap-2 text-xl text-foreground">
              <Award className="w-5 h-5 text-fenix-gold" />
              Life Events
            </h2>
          <div className="mt-4">
            {timeline.length === 0 ? (
              <EmptyState title="Your story is still beginning" description="Your timeline will fill in as you advance time and make life decisions." />
            ) : (
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent to-secondary" />
              <div className="space-y-8">
                {timeline.map((event) => {
                  const Icon = CATEGORY_ICONS[event.category] ?? GraduationCap;
                  return (
                    <div key={event.id} className="relative flex items-start gap-6">
                      <div
                        className={`${CATEGORY_COLORS[event.category]} w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg z-10 flex-shrink-0`}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="flex-1 border-b border-border pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-foreground">{event.title}</h3>
                            <Badge variant="outline">{event.calendarYear}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            Age {event.ageYears} · {event.gameDate}
                          </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            )}
          </div>
        </section>
    </LifeShell>
  );
}
