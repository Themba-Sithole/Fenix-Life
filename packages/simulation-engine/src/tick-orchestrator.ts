import type { BankingState, BankTransaction, SimEvent, WorldInstance } from '@fenix/domain';
import {
  ageYearsFromBirthday,
  appendCashFlowHistory,
  appendCompanyRevenueHistory,
  appendNetWorthHistory,
  applyDailyCreditScoreDrift,
  applyMonthlyLoanPayment,
  applyWorldImpact,
  canAdvanceTime,
  advanceBlockedReason,
  companyMonthlyProfitCents,
  decayWorldImpacts,
  formatOriginLocation,
  globalDomainEventBus,
  isBirthdayOnDate,
  lifeStageForAge,
  pickNewsImpact,
} from '@fenix/domain';
import { pickNewsHeadline, STARTER_INDUSTRIES } from '@fenix/content';
import {
  applyDailyFamilyTick,
  applyDailyHousingTick,
  applyDailyTransportationTick,
  applyMonthlyHousingSettlement,
  applyMonthlyTransportCosts,
  familyHeadline,
  housingHeadline,
} from './lifestyle-engine.js';
import { addDays, parseGameDate } from './time-engine.js';
import { applyDailyEconomyTick, inflationHeadline } from './economy-engine.js';
import { applyDailyCompanyTick, companyPerformanceHeadline } from './company-engine.js';
import { applyDailyCareerTick, careerHeadline } from './career-engine.js';
import { applyDailyInvestmentTick, portfolioPerformanceHeadline } from './investment-engine.js';
import { applyDailyEducationTick } from './education-engine.js';
import { applyDailyCivicTick } from './civic-engine.js';
import { applyMonthlyBillsSettlement } from './lifestyle-engine.js';
import { applyInflationToMonthlyExpenses } from './economy-engine.js';

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
  globalDomainEventBus.publish(event);
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
  const birthday = world.player.birthday;
  const isBirthday = birthday
    ? isBirthdayOnDate(birthday, world.currentDate)
    : (() => {
        const { month, day } = parseGameDate(world.currentDate);
        return month === 1 && day === 1;
      })();

  if (!isBirthday) {
    return world;
  }

  const nextAge = birthday
    ? ageYearsFromBirthday(birthday, world.currentDate)
    : world.player.ageYears + 1;

  if (nextAge <= world.player.ageYears) {
    return world;
  }

  const events = appendEvent(world.events, {
    id: `evt-birthday-${world.clock.tickCount}`,
    tickCount: world.clock.tickCount,
    date: world.currentDate,
    category: 'life',
    headline: `${world.player.displayName} turned ${nextAge}`,
    tone: 'info',
  });

  return {
    ...world,
    player: { ...world.player, ageYears: nextAge },
    lifeStage: lifeStageForAge(nextAge),
    events,
  };
}

function maybeCompanyNews(world: WorldInstance): WorldInstance {
  if (!world.company || world.clock.tickCount % 14 !== 0) {
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
  if (day !== 1 || !world.company) {
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

  const tone: SimEvent['tone'] =
    world.economy.cyclePhase === 'contraction' || world.economy.cyclePhase === 'trough'
      ? 'warning'
      : world.economy.cyclePhase === 'peak'
        ? 'success'
        : 'info';
  const impact = pickNewsImpact(world.clock.tickCount + 41, tone);
  const headline =
    world.clock.tickCount % 14 === 0
      ? pickNewsHeadline(`news-${world.clock.tickCount}`, {
          city: formatOriginLocation(world.origin).split(',')[0],
          index: world.economy.techSectorIndex,
          inflation: world.economy.inflationRateAnnual * 100,
          industry: STARTER_INDUSTRIES[0]?.name ?? 'Technology',
        })
      : inflationHeadline(world.economy);

  let nextWorld = applyWorldImpact(world, impact, world.clock.tickCount);
  const events = appendEvent(nextWorld.events, {
    id: `evt-news-${world.clock.tickCount}`,
    tickCount: world.clock.tickCount,
    date: world.currentDate,
    category: 'news',
    headline,
    tone,
    impact,
  });

  return { ...nextWorld, events };
}

function maybeFamilyNews(world: WorldInstance): WorldInstance {
  if (world.clock.tickCount % 18 !== 0) {
    return world;
  }

  const events = appendEvent(world.events, {
    id: `evt-family-${world.clock.tickCount}`,
    tickCount: world.clock.tickCount,
    date: world.currentDate,
    category: 'life',
    headline: familyHeadline(world.family),
    tone: 'info',
  });

  return { ...world, events };
}

function maybeHousingNews(world: WorldInstance): WorldInstance {
  if (world.clock.tickCount % 16 !== 0) {
    return world;
  }

  const events = appendEvent(world.events, {
    id: `evt-housing-${world.clock.tickCount}`,
    tickCount: world.clock.tickCount,
    date: world.currentDate,
    category: 'finance',
    headline: housingHeadline(world.housing),
    tone: 'info',
  });

  return { ...world, events };
}

function maybeMarketNews(world: WorldInstance): WorldInstance {
  if (world.clock.tickCount % 10 !== 0) {
    return world;
  }

  const events = appendEvent(world.events, {
    id: `evt-market-${world.clock.tickCount}`,
    tickCount: world.clock.tickCount,
    date: world.currentDate,
    category: 'finance',
    headline: portfolioPerformanceHeadline(world.portfolio),
    tone: 'info',
  });

  return { ...world, events };
}

function applyMonthlyLoan(world: WorldInstance): WorldInstance {
  const { day } = parseGameDate(world.currentDate);
  if (day !== 1 || !world.banking.activeLoan) {
    return world;
  }

  const result = applyMonthlyLoanPayment(world.banking, world.currentDate);
  let nextWorld: WorldInstance = { ...world, banking: result.banking };

  if (result.defaulted) {
    nextWorld = {
      ...nextWorld,
      events: appendEvent(nextWorld.events, {
        id: `evt-loan-default-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'finance',
        headline: 'Loan defaulted — collections fee applied, credit crushed. Resolve before advancing.',
        tone: 'warning',
        impact: 'expense_spike',
      }),
    };
    nextWorld = applyWorldImpact(nextWorld, 'expense_spike', world.clock.tickCount);
  } else if (result.missed) {
    nextWorld = {
      ...nextWorld,
      events: appendEvent(nextWorld.events, {
        id: `evt-loan-miss-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'finance',
        headline: `Missed loan payment (${result.banking.activeLoan?.missedPayments ?? 1}×) — delinquency rising`,
        tone: 'warning',
      }),
    };
  }

  return nextWorld;
}

export function runDailyTick(world: WorldInstance): WorldInstance {
  if (world.clock.paused) {
    return world;
  }

  if (!canAdvanceTime(world)) {
    throw new Error(advanceBlockedReason(world) ?? 'A life crisis blocks time advance');
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

  nextWorld = decayWorldImpacts(nextWorld);
  nextWorld = applyDailyCompanyTick(nextWorld);
  nextWorld = applyDailyCareerTick(nextWorld);
  nextWorld = applyDailyEducationTick(nextWorld);
  nextWorld = {
    ...nextWorld,
    portfolio: applyDailyInvestmentTick(
      nextWorld.portfolio,
      nextWorld.economy,
      nextWorld.clock.tickCount,
      nextWorld.currentDate,
    ),
    housing: applyDailyHousingTick(nextWorld.housing, nextWorld.economy),
    transportation: applyDailyTransportationTick(nextWorld.transportation),
    family: applyDailyFamilyTick(nextWorld.family, nextWorld.player.traits.happiness),
  };
  nextWorld = applyDailyLivingCosts(nextWorld);
  nextWorld = applyMonthlySalary(nextWorld);
  nextWorld = applyMonthlyCompanySettlement(nextWorld);
  nextWorld = applyMonthlyLoan(nextWorld);
  nextWorld = applyMonthlyHousingSettlement(nextWorld);
  nextWorld = applyMonthlyTransportCosts(nextWorld);
  nextWorld = applyMonthlyBillsSettlement(nextWorld);
  nextWorld = applyDailyCivicTick(nextWorld);
  nextWorld = {
    ...nextWorld,
    banking: applyDailyCreditScoreDrift(nextWorld.banking),
  };

  // Apply monthly inflation creep to expenses on the 1st
  const { day: tickDay } = parseGameDate(nextWorld.currentDate);
  if (tickDay === 1 && nextWorld.banking.monthlyExpensesCents > 0) {
    nextWorld = {
      ...nextWorld,
      banking: {
        ...nextWorld.banking,
        monthlyExpensesCents: applyInflationToMonthlyExpenses(
          nextWorld.banking.monthlyExpensesCents,
          nextWorld.economy.inflationRateAnnual,
        ),
      },
    };
    nextWorld = {
      ...nextWorld,
      banking: appendCashFlowHistory(
        appendNetWorthHistory(nextWorld.banking, nextWorld.currentDate),
        nextWorld.currentDate,
        nextWorld.banking.monthlySalaryCents,
        nextWorld.banking.monthlyExpensesCents,
      ),
      company: nextWorld.company
        ? appendCompanyRevenueHistory(nextWorld.company, nextWorld.currentDate)
        : null,
    };
  }
  nextWorld = applyTraitDrift(nextWorld);
  nextWorld = maybeBirthday(nextWorld);
  nextWorld = maybeEconomyNews(nextWorld);
  nextWorld = maybeCompanyNews(nextWorld);
  nextWorld = maybeCareerNews(nextWorld);
  nextWorld = maybeMarketNews(nextWorld);
  nextWorld = maybeHousingNews(nextWorld);
  nextWorld = maybeFamilyNews(nextWorld);

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
