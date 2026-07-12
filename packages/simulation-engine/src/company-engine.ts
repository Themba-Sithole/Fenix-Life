import type { CompanyState, SimEvent, WorldInstance } from '@fenix/domain';
import { companyMonthlyProfitCents, globalDomainEventBus } from '@fenix/domain';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function appendSimEvent(events: SimEvent[], event: SimEvent): SimEvent[] {
  globalDomainEventBus.publish(event);
  return [event, ...events].slice(0, 50);
}

/**
 * Computes how many months of runway remain at current burn rate.
 * Returns Infinity if the company is profitable.
 */
export function companyRunwayMonths(world: WorldInstance): number {
  if (!world.company) return Infinity;
  const profit = companyMonthlyProfitCents(world.company);
  if (profit >= 0) return Infinity;
  const businessBalance = world.banking.accounts.find((a) => a.id === 'business')?.balanceCents ?? 0;
  const burn = Math.abs(profit);
  return burn > 0 ? businessBalance / burn : Infinity;
}

/**
 * Company Engine v1 — daily revenue drift with sector sensitivity, inflation-driven
 * expense creep, and runway risk SimEvents.
 */
export function applyDailyCompanyTick(world: WorldInstance): WorldInstance {
  if (!world.company) {
    return world;
  }

  const sectorBoost = (world.economy.techSectorIndex - 100) / 500;
  const revenueDelta = Math.round(world.company.monthlyRevenueCents * 0.002 * (1 + sectorBoost));
  const inflationCreep = world.economy.inflationRateAnnual / 365;
  const expenseDelta = Math.round(
    world.company.monthlyExpensesCents * (0.0015 + inflationCreep),
  );

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

  let nextWorld = { ...world, company };

  const runway = companyRunwayMonths(nextWorld);
  if (
    runway !== Infinity &&
    runway <= 3 &&
    world.clock.tickCount % 7 === 0
  ) {
    const tone = runway <= 1 ? 'warning' : 'info';
    const events = appendSimEvent(nextWorld.events, {
      id: `evt-runway-${world.clock.tickCount}`,
      tickCount: world.clock.tickCount,
      date: world.currentDate,
      category: 'career',
      headline: `${company.name} runway critical — ${Math.max(0, Math.floor(runway))} month${runway < 2 ? '' : 's'} of cash remaining at current burn`,
      tone,
    });
    nextWorld = { ...nextWorld, events };
  }

  return nextWorld;
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

export function companyRunwayHeadline(world: WorldInstance): string | null {
  const runway = companyRunwayMonths(world);
  if (runway === Infinity || !world.company) return null;
  return `${world.company.name} has ${Math.floor(runway)} months of runway at current burn rate`;
}
