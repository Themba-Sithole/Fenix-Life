import { FIVE_CAPITALS, type WorldInstance, computeFiveCapitals } from "@fenix/domain";
import { cn } from "../ui/utils";

type CapitalKey = (typeof FIVE_CAPITALS)[number]["key"];

const FILL_VAR: Record<CapitalKey, string> = {
  human: "var(--capital-human)",
  social: "var(--capital-social)",
  financial: "var(--capital-financial)",
  business: "var(--capital-business)",
  legacy: "var(--capital-legacy)",
};

interface CapitalStatBarProps {
  readonly capitalKey: CapitalKey;
  readonly label: string;
  readonly value: number;
  readonly className?: string;
}

export function CapitalStatBar({ capitalKey, label, value, className }: CapitalStatBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div
      className={cn(
        "rounded-[var(--radius-home)] border border-border bg-surface-1 px-3.5 py-3 shadow-[var(--home-shadow)]",
        className,
      )}
      data-testid={`capital-stat-${capitalKey}`}
    >
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-[11.5px] text-muted-foreground">{label}</span>
        <span className="font-mono text-[12.5px] font-semibold tabular-nums text-foreground">
          {clamped}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2" role="presentation">
        <div
          className="h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500"
          style={{
            width: `${clamped}%`,
            backgroundColor: FILL_VAR[capitalKey],
          }}
        />
      </div>
    </div>
  );
}

interface CapitalStatGridProps {
  readonly world: WorldInstance;
  readonly className?: string;
}

export function CapitalStatGrid({ world, className }: CapitalStatGridProps) {
  const capitals = computeFiveCapitals({
    player: world.player,
    banking: world.banking,
    company: world.company,
    career: world.career,
    tickCount: world.clock.tickCount,
    currency: world.origin.currency,
  });

  const scores: Record<CapitalKey, number> = {
    financial: capitals.financial,
    human: capitals.human,
    social: capitals.social,
    business: capitals.business,
    legacy: capitals.legacy,
  };

  const order: CapitalKey[] = ["human", "social", "financial", "business", "legacy"];
  const labels = Object.fromEntries(FIVE_CAPITALS.map((c) => [c.key, c.label])) as Record<
    CapitalKey,
    string
  >;

  return (
    <div
      className={cn(
        "mb-3.5 grid grid-cols-3 gap-2.5 sm:grid-cols-5",
        className,
      )}
      aria-label="Five Capitals"
      data-testid="home-capital-stats"
    >
      {order.map((key, index) => (
        <CapitalStatBar
          key={key}
          capitalKey={key}
          label={labels[key]}
          value={scores[key]}
          className={index >= 3 ? "hidden sm:block" : undefined}
        />
      ))}
    </div>
  );
}
