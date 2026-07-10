import type { EconomyState } from './economy.js';
import { createDefaultEconomy, DEFAULT_TECH_SECTOR_INDEX } from './economy.js';
import type { SimEvent } from './sim-event.js';

export interface MarketTickerItem {
  readonly text: string;
  readonly change: string;
}

function formatSignedPct(value: number): string {
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

  const macroItems: MarketTickerItem[] = [
    {
      text: `Global inflation tracking at ${inflationPct.toFixed(1)}% annually`,
      change: `${inflationPct.toFixed(1)}%`,
    },
    {
      text: `Tech sector index at ${economy.techSectorIndex.toFixed(1)}`,
      change: formatSignedPct(techDelta),
    },
    {
      text: 'Central banks hold rates steady amid steady growth outlook',
      change: 'STABLE',
    },
  ];

  const eventItems = recentEvents.slice(0, 4).map((event) => ({
    text: event.headline,
    change:
      event.tone === 'success' ? '+ LIVE' : event.tone === 'warning' ? 'ALERT' : 'NEWS',
  }));

  return [...eventItems, ...macroItems];
}
