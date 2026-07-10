import { describe, expect, it } from 'vitest';
import {
  createDefaultEconomy,
  createDefaultPortfolio,
  portfolioDayChangeCents,
  portfolioValueCents,
} from '@fenix/domain';
import { applyDailyInvestmentTick } from './investment-engine.js';

describe('portfolio', () => {
  it('values holdings from live quotes', () => {
    const portfolio = createDefaultPortfolio({ companyStage: 'startup' });
    const value = portfolioValueCents(portfolio.holdings, portfolio.quotes);

    expect(value).toBeGreaterThan(0);
    expect(portfolio.holdings.length).toBeGreaterThan(0);
  });

  it('updates quotes on daily investment tick', () => {
    const portfolio = createDefaultPortfolio({ companyStage: 'growth' });
    const economy = createDefaultEconomy();
    const next = applyDailyInvestmentTick(portfolio, economy, 1, '2000-01-02');

    expect(next.quotes.length).toBe(portfolio.quotes.length);
    expect(next.history.length).toBeGreaterThanOrEqual(1);
    expect(portfolioDayChangeCents(next.holdings, next.quotes)).toBeTypeOf('number');
  });
});
