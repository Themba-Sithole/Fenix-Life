import { Progress } from "./ui/progress";
import { computeFiveCapitals, FIVE_CAPITALS, type WorldInstance } from "@fenix/domain";

interface FiveCapitalsStripProps {
  world: WorldInstance;
}

const SCORE_COLORS: Record<(typeof FIVE_CAPITALS)[number]["key"], string> = {
  financial: "bg-secondary",
  human: "bg-accent",
  social: "bg-fenix-gold",
  business: "bg-secondary",
  legacy: "bg-accent",
};

export function FiveCapitalsStrip({ world }: FiveCapitalsStripProps) {
  const capitals = computeFiveCapitals({
    player: world.player,
    banking: world.banking,
    company: world.company,
    career: world.career,
    tickCount: world.clock.tickCount,
    currency: world.origin.currency,
  });

  const labels: Record<(typeof FIVE_CAPITALS)[number]["key"], string> = {
    financial: capitals.financialLabel,
    human: capitals.humanLabel,
    social: capitals.socialLabel,
    business: capitals.businessLabel,
    legacy: capitals.legacyLabel,
  };

  const scores: Record<(typeof FIVE_CAPITALS)[number]["key"], number> = {
    financial: capitals.financial,
    human: capitals.human,
    social: capitals.social,
    business: capitals.business,
    legacy: capitals.legacy,
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {FIVE_CAPITALS.map((capital) => (
          <div key={capital.key} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">{capital.label}</span>
              <span className="text-xs text-muted-foreground tabular-nums">{scores[capital.key]}%</span>
            </div>
            <Progress value={scores[capital.key]} className={`h-1.5 ${SCORE_COLORS[capital.key]}`} />
            <p className="text-[11px] leading-snug text-muted-foreground">{labels[capital.key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
