import type { CompanyStage } from './company.js';

export interface StockQuote {
  readonly symbol: string;
  readonly name: string;
  readonly priceCents: number;
  readonly previousCloseCents: number;
  readonly logo: string;
}

export interface StockHolding {
  readonly symbol: string;
  readonly shares: number;
  readonly avgCostCents: number;
}

export interface PortfolioHistoryPoint {
  readonly tickCount: number;
  readonly valueCents: number;
}

export interface PortfolioState {
  readonly holdings: StockHolding[];
  readonly quotes: StockQuote[];
  readonly dividendsYtdCents: number;
  readonly costBasisCents: number;
  readonly history: PortfolioHistoryPoint[];
}

export const MARKET_STOCKS: readonly Omit<StockQuote, 'previousCloseCents'>[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', priceCents: 18_245, logo: '🍎' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', priceCents: 13_892, logo: '🔍' },
  { symbol: 'TSLA', name: 'Tesla Inc.', priceCents: 26_578, logo: '⚡' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', priceCents: 37_825, logo: '💻' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', priceCents: 14_589, logo: '📦' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', priceCents: 49_832, logo: '🎮' },
  { symbol: 'META', name: 'Meta Platforms', priceCents: 48_120, logo: '👤' },
  { symbol: 'NFLX', name: 'Netflix', priceCents: 62_450, logo: '🎬' },
  { symbol: 'AMD', name: 'AMD', priceCents: 16_780, logo: '💾' },
] as const;

const DEFAULT_HOLDINGS: Record<CompanyStage | 'default', readonly { symbol: string; shares: number }[]> = {
  idea: [{ symbol: 'AAPL', shares: 5 }],
  startup: [
    { symbol: 'AAPL', shares: 25 },
    { symbol: 'MSFT', shares: 15 },
  ],
  growth: [
    { symbol: 'AAPL', shares: 80 },
    { symbol: 'GOOGL', shares: 60 },
    { symbol: 'NVDA', shares: 40 },
    { symbol: 'MSFT', shares: 50 },
  ],
  established: [
    { symbol: 'AAPL', shares: 250 },
    { symbol: 'GOOGL', shares: 180 },
    { symbol: 'TSLA', shares: 150 },
    { symbol: 'MSFT', shares: 200 },
    { symbol: 'AMZN', shares: 300 },
    { symbol: 'NVDA', shares: 100 },
  ],
  default: [
    { symbol: 'AAPL', shares: 40 },
    { symbol: 'MSFT', shares: 30 },
    { symbol: 'GOOGL', shares: 20 },
  ],
};

function quoteMap(quotes: StockQuote[]): Map<string, StockQuote> {
  return new Map(quotes.map((quote) => [quote.symbol, quote]));
}

export function createDefaultQuotes(): StockQuote[] {
  return MARKET_STOCKS.map((stock) => ({
    ...stock,
    previousCloseCents: stock.priceCents,
  }));
}

export function createEmptyPortfolio(): PortfolioState {
  const quotes = createDefaultQuotes();
  return {
    holdings: [],
    quotes,
    dividendsYtdCents: 0,
    costBasisCents: 0,
    history: [{ tickCount: 0, valueCents: 0 }],
  };
}

export function createDefaultPortfolio(input?: {
  companyStage?: CompanyStage;
}): PortfolioState {
  const quotes = createDefaultQuotes();
  const quotesBySymbol = quoteMap(quotes);
  const stage = input?.companyStage ?? 'startup';
  const template = DEFAULT_HOLDINGS[stage] ?? DEFAULT_HOLDINGS.default;

  const holdings: StockHolding[] = template.map((item) => {
    const quote = quotesBySymbol.get(item.symbol);
    const avgCostCents = quote ? Math.round(quote.priceCents * 0.92) : 10_000;
    return {
      symbol: item.symbol,
      shares: item.shares,
      avgCostCents,
    };
  });

  const costBasisCents = holdings.reduce(
    (sum, holding) => sum + holding.shares * holding.avgCostCents,
    0,
  );
  const valueCents = portfolioValueCents(holdings, quotes);

  return {
    holdings,
    quotes,
    dividendsYtdCents: Math.round(valueCents * 0.008),
    costBasisCents,
    history: [{ tickCount: 0, valueCents }],
  };
}

export function portfolioValueCents(
  holdings: readonly StockHolding[],
  quotes: readonly StockQuote[],
): number {
  const quotesBySymbol = quoteMap([...quotes]);
  return holdings.reduce((sum, holding) => {
    const quote = quotesBySymbol.get(holding.symbol);
    if (!quote) {
      return sum;
    }
    return sum + holding.shares * quote.priceCents;
  }, 0);
}

export function stockDayChangeCents(quote: StockQuote): number {
  return quote.priceCents - quote.previousCloseCents;
}

export function stockDayChangePercent(quote: StockQuote): number {
  if (quote.previousCloseCents <= 0) {
    return 0;
  }
  return Number(((stockDayChangeCents(quote) / quote.previousCloseCents) * 100).toFixed(2));
}

export function portfolioDayChangeCents(
  holdings: readonly StockHolding[],
  quotes: readonly StockQuote[],
): number {
  const quotesBySymbol = quoteMap([...quotes]);
  return holdings.reduce((sum, holding) => {
    const quote = quotesBySymbol.get(holding.symbol);
    if (!quote) {
      return sum;
    }
    return sum + holding.shares * stockDayChangeCents(quote);
  }, 0);
}

export function portfolioGainCents(portfolio: PortfolioState): number {
  return portfolioValueCents(portfolio.holdings, portfolio.quotes) - portfolio.costBasisCents;
}

export function portfolioGainPercent(portfolio: PortfolioState): number {
  if (portfolio.costBasisCents <= 0) {
    return 0;
  }
  return Number(((portfolioGainCents(portfolio) / portfolio.costBasisCents) * 100).toFixed(1));
}

export function getTrendingQuotes(quotes: readonly StockQuote[], limit = 3): StockQuote[] {
  return [...quotes]
    .sort((left, right) => stockDayChangePercent(right) - stockDayChangePercent(left))
    .slice(0, limit);
}

export function appendPortfolioHistory(
  portfolio: PortfolioState,
  tickCount: number,
  maxPoints = 7,
): PortfolioHistoryPoint[] {
  const valueCents = portfolioValueCents(portfolio.holdings, portfolio.quotes);
  const nextPoint = { tickCount, valueCents };
  const withoutDuplicate = portfolio.history.filter((point) => point.tickCount !== tickCount);
  return [...withoutDuplicate, nextPoint].slice(-maxPoints);
}
