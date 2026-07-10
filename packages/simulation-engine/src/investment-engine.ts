import type { EconomyState, PortfolioState } from '@fenix/domain';
import {
  appendPortfolioHistory,
  portfolioValueCents,
  stockDayChangePercent,
} from '@fenix/domain';
import { parseGameDate } from './time-engine.js';

/** Investment Engine v0 — daily quote drift tied to macro tech index. */
export function applyDailyInvestmentTick(
  portfolio: PortfolioState,
  economy: EconomyState,
  tickCount: number,
  currentDate: string,
): PortfolioState {
  const sectorMultiplier = 1 + (economy.techSectorIndex - 100) / 500;

  const quotes = portfolio.quotes.map((quote) => {
    const dailyDrift = (Math.random() - 0.48) * 0.025 * sectorMultiplier;
    const nextPriceCents = Math.max(
      100,
      Math.round(quote.priceCents * (1 + dailyDrift)),
    );

    return {
      ...quote,
      previousCloseCents: quote.priceCents,
      priceCents: nextPriceCents,
    };
  });

  let dividendsYtdCents = portfolio.dividendsYtdCents;
  const { day } = parseGameDate(currentDate);
  if (day === 1) {
    dividendsYtdCents += Math.round(portfolioValueCents(portfolio.holdings, quotes) * 0.0015);
  }

  return {
    ...portfolio,
    quotes,
    dividendsYtdCents,
    history: appendPortfolioHistory({ ...portfolio, quotes }, tickCount),
  };
}

export function portfolioPerformanceHeadline(portfolio: PortfolioState): string {
  const movers = [...portfolio.quotes]
    .sort((left, right) => stockDayChangePercent(right) - stockDayChangePercent(left))
    .slice(0, 2);

  const leader = movers[0];
  if (!leader) {
    return 'Markets open steady as investors watch sector rotation';
  }

  const change = stockDayChangePercent(leader);
  const direction = change >= 0 ? 'surges' : 'pulls back';
  return `${leader.symbol} ${direction} ${Math.abs(change).toFixed(1)}% in active trading session`;
}
