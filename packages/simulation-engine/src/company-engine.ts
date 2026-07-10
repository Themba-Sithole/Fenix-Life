import type { CompanyState, WorldInstance } from '@fenix/domain';
import { companyMonthlyProfitCents } from '@fenix/domain';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Company Engine v0 — Doc 19 simplified daily revenue drift. */
export function applyDailyCompanyTick(world: WorldInstance): WorldInstance {
  const sectorBoost = (world.economy.techSectorIndex - 100) / 500;
  const revenueDelta = Math.round(world.company.monthlyRevenueCents * 0.002 * (1 + sectorBoost));
  const expenseDelta = Math.round(world.company.monthlyExpensesCents * 0.0015);

  const monthlyRevenueCents = Math.max(0, world.company.monthlyRevenueCents + revenueDelta);
  const monthlyExpensesCents = Math.max(0, world.company.monthlyExpensesCents + expenseDelta);
  const profit = monthlyRevenueCents - monthlyExpensesCents;
  const valuationDelta = Math.round(profit * 0.05);

  const company: CompanyState = {
    ...world.company,
    monthlyRevenueCents,
    monthlyExpensesCents,
    valuationCents: Math.max(0, world.company.valuationCents + valuationDelta),
    marketSharePct: clamp(
      world.company.marketSharePct + (Math.random() > 0.6 ? 0.05 : -0.02),
      0.1,
      25,
    ),
  };

  return { ...world, company };
}

export function companyPerformanceHeadline(company: CompanyState): string {
  const profit = companyMonthlyProfitCents(company);
  const profitLabel = (profit / 100).toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  if (profit >= 0) {
    return `${company.name} posts monthly profit of ${profitLabel}`;
  }

  return `${company.name} faces a ${profitLabel.replace('-', '')} monthly loss amid sector pressure`;
}
