import { computeFiveCapitals, FIVE_CAPITALS, type WorldInstance } from "@fenix/domain";

interface FiveCapitalsStripProps {
  world: WorldInstance;
}

const FILL_VAR: Record<(typeof FIVE_CAPITALS)[number]["key"], string> = {
  human: "var(--capital-human)",
  social: "var(--capital-social)",
  financial: "var(--capital-financial)",
  business: "var(--capital-business)",
  legacy: "var(--capital-legacy)",
};

/** Detailed capital strip with labels — prefer CapitalStatGrid on Home. */
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {FIVE_CAPITALS.map((capital) => (
          <div key={capital.key} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">{capital.label}</span>
              <span className="text-xs tabular-nums text-muted-foreground">{scores[capital.key]}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-2" role="presentation">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${scores[capital.key]}%`,
                  backgroundColor: FILL_VAR[capital.key],
                }}
              />
            </div>
            <p className="text-[11px] leading-snug text-muted-foreground">{labels[capital.key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
