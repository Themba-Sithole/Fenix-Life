import type { EconomyState } from './economy.js';
import { createDefaultEconomy, cyclePhaseLabel, DEFAULT_TECH_SECTOR_INDEX } from './economy.js';
import type { SimEvent } from './sim-event.js';
import { impactChangesLabel } from './world-impact.js';

export interface MarketTickerItem {
  readonly text: string;
  readonly change: string;
}

function formatSignedPctStr(value: number): string {
  const rounded = value.toFixed(1);
  return value >= 0 ? `+${rounded}%` : `${rounded}%`;
}

/** Build headline items for the main menu market ticker. */
export function buildMarketTickerItems(
  economy: EconomyState = createDefaultEconomy(),
  recentEvents: readonly SimEvent[] = [],
): MarketTickerItem[] {
  const inflationPct = economy.inflationRateAnnual * 100;
  const techDelta = economy.techSectorIndex - DEFAULT_TECH_SECTOR_INDEX;
  const hiring = economy.hiringDifficultyBonus ?? 0;

  const macroItems: MarketTickerItem[] = [
    {
      text: `Global inflation tracking at ${inflationPct.toFixed(1)}% annually`,
      change: `${inflationPct.toFixed(1)}%`,
    },
    {
      text: `Tech sector index at ${economy.techSectorIndex.toFixed(1)} · ${cyclePhaseLabel(economy.cyclePhase)}`,
      change: formatSignedPctStr(techDelta),
    },
    {
      text:
        hiring > 0.1
          ? 'Hiring freeze pressure weighs on the labor market'
          : economy.cyclePhase === 'expansion' || economy.cyclePhase === 'peak'
            ? 'Central banks hold rates steady amid growth outlook'
            : 'Markets brace for softer demand and tighter credit',
      change: hiring > 0.1 ? 'FREEZE' : 'STABLE',
    },
  ];

  const eventItems = recentEvents.slice(0, 4).map((event) => ({
    text: event.impact
      ? `${event.headline} — ${impactChangesLabel(event.impact)}`
      : event.headline,
    change:
      event.tone === 'success' ? '+ LIVE' : event.tone === 'warning' ? 'ALERT' : 'NEWS',
  }));

  return [...eventItems, ...macroItems];
}
