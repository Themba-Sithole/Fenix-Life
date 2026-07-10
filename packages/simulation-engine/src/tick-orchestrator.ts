import type { BankingState, BankTransaction, SimEvent, WorldInstance } from '@fenix/domain';
import { companyMonthlyProfitCents, formatOriginLocation } from '@fenix/domain';
import { addDays, parseGameDate } from './time-engine.js';
import { applyDailyEconomyTick, inflationHeadline } from './economy-engine.js';
import { applyDailyCompanyTick, companyPerformanceHeadline } from './company-engine.js';
import { applyDailyCareerTick, careerHeadline } from './career-engine.js';

const MAX_EVENTS = 50;
const MAX_TRANSACTIONS = 30;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function updateAccountBalance(
  banking: BankingState,
  accountId: string,
  deltaCents: number,
): BankingState {
  return {
    ...banking,
    accounts: banking.accounts.map((account) =>
      account.id === accountId
        ? { ...account, balanceCents: account.balanceCents + deltaCents }
        : account,
    ),
  };
}

function appendTransaction(
  banking: BankingState,
  transaction: Omit<BankTransaction, 'id'>,
): BankingState {
  const entry: BankTransaction = {
    ...transaction,
    id: `tx-${transaction.date}-${banking.transactions.length}`,
  };

  return {
    ...banking,
    transactions: [entry, ...banking.transactions].slice(0, MAX_TRANSACTIONS),
  };
}

function appendEvent(events: SimEvent[], event: SimEvent): SimEvent[] {
  return [event, ...events].slice(0, MAX_EVENTS);
}

function applyDailyLivingCosts(world: WorldInstance): WorldInstance {
  const dailyExpense = Math.round(world.banking.monthlyExpensesCents / 30);
  if (dailyExpense <= 0) {
    return world;
  }

  let banking = updateAccountBalance(world.banking, 'checking', -dailyExpense);
  banking = appendTransaction(banking, {
    date: world.currentDate,
    description: 'Daily living expenses',
    amountCents: -dailyExpense,
    accountId: 'checking',
  });

  return { ...world, banking };
}

function applyMonthlySalary(world: WorldInstance): WorldInstance {
  const { day } = parseGameDate(world.currentDate);
  if (day !== 1 || world.banking.monthlySalaryCents <= 0) {
    return world;
  }

  let banking = updateAccountBalance(
    world.banking,
    'checking',
    world.banking.monthlySalaryCents,
  );
  banking = appendTransaction(banking, {
    date: world.currentDate,
    description: 'Salary deposit',
    amountCents: world.banking.monthlySalaryCents,
    accountId: 'checking',
  });

  const events = appendEvent(world.events, {
    id: `evt-salary-${world.clock.tickCount}`,
    tickCount: world.clock.tickCount,
    date: world.currentDate,
    category: 'finance',
    headline: `Salary deposited: ${(world.banking.monthlySalaryCents / 100).toLocaleString(undefined, { style: 'currency', currency: world.origin.currency, maximumFractionDigits: 0 })}`,
    tone: 'success',
  });

  return { ...world, banking, events };
}

function applyTraitDrift(world: WorldInstance): WorldInstance {
  const traits = world.player.traits;
  const stressDelta = world.banking.monthlyExpensesCents > world.banking.monthlySalaryCents ? 1 : -1;

  return {
    ...world,
    player: {
      ...world.player,
      traits: {
        ...traits,
        happiness: clamp(traits.happiness + (Math.random() > 0.55 ? 1 : -1), 0, 100),
        energy: clamp(traits.energy + (Math.random() > 0.5 ? -1 : 1), 0, 100),
        stress: clamp(traits.stress + stressDelta, 0, 100),
        health: clamp(traits.health + (Math.random() > 0.7 ? -1 : 0), 0, 100),
      },
    },
  };
}

function maybeBirthday(world: WorldInstance): WorldInstance {
  const { month, day } = parseGameDate(world.currentDate);
  if (month !== 1 || day !== 1) {
    return world;
  }

  const events = appendEvent(world.events, {
    id: `evt-birthday-${world.clock.tickCount}`,
    tickCount: world.clock.tickCount,
    date: world.currentDate,
    category: 'life',
    headline: `${world.player.displayName} turned ${world.player.ageYears + 1}`,
    tone: 'info',
  });

  return {
    ...world,
    player: { ...world.player, ageYears: world.player.ageYears + 1 },
    events,
  };
}

function maybeCompanyNews(world: WorldInstance): WorldInstance {
  if (world.clock.tickCount % 14 !== 0) {
    return world;
  }

  const events = appendEvent(world.events, {
    id: `evt-company-${world.clock.tickCount}`,
    tickCount: world.clock.tickCount,
    date: world.currentDate,
    category: 'career',
    headline: companyPerformanceHeadline(world.company),
    tone: companyMonthlyProfitCents(world.company) >= 0 ? 'success' : 'warning',
  });

  return { ...world, events };
}

function applyMonthlyCompanySettlement(world: WorldInstance): WorldInstance {
  const { day } = parseGameDate(world.currentDate);
  if (day !== 1) {
    return world;
  }

  const profit = companyMonthlyProfitCents(world.company);
  if (profit === 0) {
    return world;
  }

  let banking = updateAccountBalance(world.banking, 'business', profit);
  banking = appendTransaction(banking, {
    date: world.currentDate,
    description: `${world.company.name} monthly settlement`,
    amountCents: profit,
    accountId: 'business',
  });

  return { ...world, banking };
}

function maybeCareerNews(world: WorldInstance): WorldInstance {
  if (world.clock.tickCount % 21 !== 0) {
    return world;
  }

  const events = appendEvent(world.events, {
    id: `evt-career-${world.clock.tickCount}`,
    tickCount: world.clock.tickCount,
    date: world.currentDate,
    category: 'career',
    headline: careerHeadline(world.career),
    tone: world.career.performanceScore >= 70 ? 'success' : 'info',
  });

  return { ...world, events };
}

function maybeEconomyNews(world: WorldInstance): WorldInstance {
  if (world.clock.tickCount % 7 !== 0) {
    return world;
  }

  const events = appendEvent(world.events, {
    id: `evt-news-${world.clock.tickCount}`,
    tickCount: world.clock.tickCount,
    date: world.currentDate,
    category: 'news',
    headline: inflationHeadline(world.economy),
    tone: 'info',
  });

  return { ...world, events };
}

/** Daily tick orchestrator — Doc 17 §7, Phase F career loop v0. */
export function runDailyTick(world: WorldInstance): WorldInstance {
  if (world.clock.paused) {
    return world;
  }

  const nextDate = addDays(world.currentDate, 1);
  let nextWorld: WorldInstance = {
    ...world,
    currentDate: nextDate,
    clock: {
      ...world.clock,
      tickCount: world.clock.tickCount + 1,
    },
    economy: applyDailyEconomyTick(world.economy),
  };

  nextWorld = applyDailyCompanyTick(nextWorld);
  nextWorld = applyDailyCareerTick(nextWorld);
  nextWorld = applyDailyLivingCosts(nextWorld);
  nextWorld = applyMonthlySalary(nextWorld);
  nextWorld = applyMonthlyCompanySettlement(nextWorld);
  nextWorld = applyTraitDrift(nextWorld);
  nextWorld = maybeBirthday(nextWorld);
  nextWorld = maybeEconomyNews(nextWorld);
  nextWorld = maybeCompanyNews(nextWorld);
  nextWorld = maybeCareerNews(nextWorld);

  if (nextWorld.events.length === 0) {
    nextWorld = {
      ...nextWorld,
      events: appendEvent(nextWorld.events, {
        id: `evt-welcome-${nextWorld.clock.tickCount}`,
        tickCount: nextWorld.clock.tickCount,
        date: nextWorld.currentDate,
        category: 'life',
        headline: `${nextWorld.player.displayName} begins a new chapter in ${formatOriginLocation(nextWorld.origin)}`,
        tone: 'info',
      }),
    };
  }

  return nextWorld;
}
