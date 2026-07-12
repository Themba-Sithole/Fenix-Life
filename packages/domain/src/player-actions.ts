import { debitFromBestAccount } from './banking-actions.js';
import type { BankingState, BankTransaction } from './banking.js';
import { createFoundedCompany, INCORPORATION_FEE_CENTS, suggestedCompanyName, type CompanyState } from './company.js';
import type { CareerState } from './career.js';
import { applyAdolescenceChoice, skipAdolescencePlay } from './adolescence-play.js';
import {
  getAvailableJobListings,
  getJobListingById,
  JOB_APPLICATION_FEE_CENTS,
  jobListingMatchScore,
} from './job-market.js';
import {
  appendJobApplication,
  createJobApplication,
  JOB_APPLICATION_RESOLVE_DAYS,
} from './job-applications.js';
import {
  enrollEducation,
  setEducationEffort,
  studySession,
  dropOutEducation,
  payTuition,
} from './education-actions.js';
import {
  RAISE_COOLDOWN_TICKS,
  RAISE_MIN_MONTHS,
  RAISE_MIN_PERFORMANCE,
  PROMOTION_COOLDOWN_TICKS,
  PROMOTION_MIN_MONTHS,
  PROMOTION_MIN_PERFORMANCE,
  UPSKILL_COOLDOWN_TICKS,
  NETWORK_COOLDOWN_TICKS,
} from './career.js';
import { applyDistrictVisit } from './city-districts.js';
import { completeChildhoodOnboarding, dismissLifePathHints, dismissHomeTour } from './onboarding.js';
import type { PortfolioState } from './portfolio.js';
import type { WorldInstance } from './world-instance.js';
import {
  clampEmployeeStat,
  createHiredEmployee,
  type EmployeeRecord,
} from './employees.js';
import type { FamilyMemberRecord } from './family.js';
import { appendPortfolioHistory, portfolioValueCents } from './portfolio.js';
import {
  createLoan,
  applyLoanProceeds,
  payOffActiveLoan,
  restructureActiveLoan,
  settleActiveLoan,
} from './loans.js';
import { createDefaultCivic, type CivicState } from './civic.js';
import { applyDeathAndSelectHeir } from './succession.js';
import { addDaysToDate } from './date-utils.js';

function creditChecking(
  banking: BankingState,
  amountCents: number,
  date: string,
  description: string,
): BankingState {
  const accounts = banking.accounts.map((account) =>
    account.id === 'checking'
      ? { ...account, balanceCents: account.balanceCents + amountCents }
      : account,
  );

  const transaction: BankTransaction = {
    id: `tx-${description.slice(0, 12)}-${date}-${banking.transactions.length}`,
    date,
    description,
    amountCents,
    accountId: 'checking',
  };

  return {
    ...banking,
    accounts,
    transactions: [transaction, ...banking.transactions].slice(0, 30),
  };
}

export type PlayerAction =
  | { kind: 'BUY_STOCK'; symbol: string; shares: number }
  | { kind: 'SELL_STOCK'; symbol: string; shares: number }
  | { kind: 'PURCHASE_PROPERTY'; propertyId: string }
  | { kind: 'SELL_PROPERTY'; propertyId: string }
  | { kind: 'PURCHASE_VEHICLE'; vehicleId: string }
  | { kind: 'SELL_VEHICLE'; vehicleId: string }
  | { kind: 'APPLY_LOAN'; amountCents: number }
  | { kind: 'COMPANY_HIRE' }
  | { kind: 'COMPANY_LAUNCH_PRODUCT' }
  | { kind: 'EMPLOYEE_PROMOTE'; employeeId: string }
  | { kind: 'EMPLOYEE_RAISE'; employeeId: string }
  | { kind: 'EMPLOYEE_TRAIN'; employeeId: string }
  | { kind: 'FAMILY_PLAN_EVENT' }
  | { kind: 'FAMILY_SEND_GIFT'; memberId: string }
  | { kind: 'FAMILY_SCHEDULE_VISIT'; memberId: string }
  | { kind: 'CAREER_REQUEST_RAISE' }
  | { kind: 'CAREER_REQUEST_PROMOTION' }
  | { kind: 'CAREER_UPSKILL' }
  | { kind: 'CAREER_NETWORK' }
  | { kind: 'CAREER_QUIT' }
  | { kind: 'PAY_LOAN' }
  | { kind: 'RESTRUCTURE_LOAN' }
  | { kind: 'SETTLE_LOAN' }
  | { kind: 'CAREER_APPLY_JOB'; listingId: string }
  | { kind: 'EDUCATION_ENROLL'; programId: string }
  | { kind: 'EDUCATION_SET_EFFORT'; effortLevel: 'slacking' | 'normal' | 'grind' }
  | { kind: 'EDUCATION_STUDY_SESSION' }
  | { kind: 'EDUCATION_DROP_OUT' }
  | { kind: 'EDUCATION_PAY_TUITION'; amountCents: number }
  | { kind: 'APPLY_ADOLESCENCE_CHOICE'; stepId: string; choiceId: string }
  | { kind: 'SKIP_ADOLESCENCE_PLAY' }
  | { kind: 'DISMISS_HOME_TOUR' }
  | { kind: 'VISIT_DISTRICT'; districtId: string }
  | { kind: 'FOUND_COMPANY'; name: string }
  | { kind: 'COMPLETE_CHILDHOOD_ONBOARDING'; simulateFirstYear?: boolean }
  | { kind: 'DISMISS_LIFE_PATH_HINTS' }
  | { kind: 'ACCEPT_HEIR'; heirMemberId: string; keepCompany?: boolean }
  | { kind: 'FILE_TAXES' }
  | { kind: 'PAY_TAX_BALANCE' }
  | { kind: 'TREAT_ILLNESS' }
  | { kind: 'IGNORE_ILLNESS' }
  | { kind: 'ENROLL_INSURANCE' };

export function applyPlayerAction(world: WorldInstance, action: PlayerAction): WorldInstance {
  switch (action.kind) {
    case 'BUY_STOCK':
      return buyStock(world, action.symbol, action.shares);
    case 'SELL_STOCK':
      return sellStock(world, action.symbol, action.shares);
    case 'PURCHASE_PROPERTY':
      return purchaseProperty(world, action.propertyId);
    case 'SELL_PROPERTY':
      return sellProperty(world, action.propertyId);
    case 'PURCHASE_VEHICLE':
      return purchaseVehicle(world, action.vehicleId);
    case 'SELL_VEHICLE':
      return sellVehicle(world, action.vehicleId);
    case 'APPLY_LOAN':
      return applyLoan(world, action.amountCents);
    case 'COMPANY_HIRE':
      return hireEmployee(world);
    case 'COMPANY_LAUNCH_PRODUCT':
      return launchProduct(world);
    case 'EMPLOYEE_PROMOTE':
      return promoteEmployee(world, action.employeeId);
    case 'EMPLOYEE_RAISE':
      return raiseEmployee(world, action.employeeId);
    case 'EMPLOYEE_TRAIN':
      return trainEmployee(world, action.employeeId);
    case 'FAMILY_PLAN_EVENT':
      return planFamilyEvent(world);
    case 'FAMILY_SEND_GIFT':
      return sendFamilyGift(world, action.memberId);
    case 'FAMILY_SCHEDULE_VISIT':
      return scheduleFamilyVisit(world, action.memberId);
    case 'CAREER_REQUEST_RAISE':
      return requestCareerRaise(world);
    case 'CAREER_REQUEST_PROMOTION':
      return requestCareerPromotion(world);
    case 'CAREER_UPSKILL':
      return upskillCareer(world);
    case 'CAREER_NETWORK':
      return networkCareer(world);
    case 'CAREER_QUIT':
      return quitCareer(world);
    case 'PAY_LOAN':
      return payLoan(world);
    case 'RESTRUCTURE_LOAN':
      return restructureLoan(world);
    case 'SETTLE_LOAN':
      return settleLoan(world);
    case 'CAREER_APPLY_JOB':
      return applyForJob(world, action.listingId);
    case 'EDUCATION_ENROLL':
      return enrollEducation(world, action.programId);
    case 'EDUCATION_SET_EFFORT':
      return setEducationEffort(world, action.effortLevel);
    case 'EDUCATION_STUDY_SESSION':
      return studySession(world);
    case 'EDUCATION_DROP_OUT':
      return dropOutEducation(world);
    case 'EDUCATION_PAY_TUITION':
      return payTuition(world, action.amountCents);
    case 'APPLY_ADOLESCENCE_CHOICE':
      return applyAdolescenceChoice(world, action.stepId, action.choiceId);
    case 'SKIP_ADOLESCENCE_PLAY':
      return skipAdolescencePlay(world);
    case 'DISMISS_HOME_TOUR':
      return dismissHomeTour(world);
    case 'VISIT_DISTRICT':
      return visitDistrict(world, action.districtId);
    case 'FOUND_COMPANY':
      return foundCompany(world, action.name);
    case 'COMPLETE_CHILDHOOD_ONBOARDING':
      return completeChildhoodOnboarding(world, {
        simulateFirstYear: action.simulateFirstYear,
      });
    case 'DISMISS_LIFE_PATH_HINTS':
      return dismissLifePathHints(world);
    case 'ACCEPT_HEIR':
      return applyDeathAndSelectHeir(world, action.heirMemberId, action.keepCompany ?? false);
    case 'FILE_TAXES':
      return fileTaxes(world);
    case 'PAY_TAX_BALANCE':
      return payTaxBalance(world);
    case 'TREAT_ILLNESS':
      return treatIllness(world);
    case 'IGNORE_ILLNESS':
      return ignoreIllness(world);
    case 'ENROLL_INSURANCE':
      return enrollInsurance(world);
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

function seededUnit(seed: number): number {
  return ((seed * 2_654_435_761) >>> 0) / 4_294_967_296;
}

function civicOf(world: WorldInstance): CivicState {
  return world.civic ?? createDefaultCivic();
}

function findEmployee(world: WorldInstance, employeeId: string): EmployeeRecord {
  const employee = world.employees.find((item) => item.id === employeeId);
  if (!employee) {
    throw new Error('Employee not found');
  }
  return employee;
}

function findFamilyMember(world: WorldInstance, memberId: string): FamilyMemberRecord {
  const member = world.family.members.find((item) => item.id === memberId);
  if (!member) {
    throw new Error('Family member not found');
  }
  return member;
}

function buyStock(world: WorldInstance, symbol: string, shares: number): WorldInstance {
  if (shares <= 0) {
    throw new Error('Share count must be positive');
  }

  const quote = world.portfolio.quotes.find((item) => item.symbol === symbol);
  if (!quote) {
    throw new Error('Unknown symbol');
  }

  const costCents = quote.priceCents * shares;
  const banking = debitFromBestAccount(
    world.banking,
    costCents,
    world.currentDate,
    `Buy ${shares} ${symbol}`,
  );

  const existing = world.portfolio.holdings.find((holding) => holding.symbol === symbol);
  const holdings = existing
    ? world.portfolio.holdings.map((holding) =>
        holding.symbol === symbol
          ? {
              ...holding,
              shares: holding.shares + shares,
              avgCostCents: Math.round(
                (holding.avgCostCents * holding.shares + costCents) / (holding.shares + shares),
              ),
            }
          : holding,
      )
    : [
        ...world.portfolio.holdings,
        { symbol, shares, avgCostCents: quote.priceCents },
      ];

  const portfolio: PortfolioState = {
    ...world.portfolio,
    holdings,
    costBasisCents: world.portfolio.costBasisCents + costCents,
    history: appendPortfolioHistory(
      { ...world.portfolio, holdings },
      world.clock.tickCount,
    ),
  };

  return { ...world, banking, portfolio };
}

function sellStock(world: WorldInstance, symbol: string, shares: number): WorldInstance {
  if (shares <= 0) {
    throw new Error('Share count must be positive');
  }

  const holding = world.portfolio.holdings.find((item) => item.symbol === symbol);
  const quote = world.portfolio.quotes.find((item) => item.symbol === symbol);
  if (!holding || !quote || holding.shares < shares) {
    throw new Error('Insufficient shares');
  }

  const proceeds = quote.priceCents * shares;
  const remainingShares = holding.shares - shares;
  const holdings =
    remainingShares === 0
      ? world.portfolio.holdings.filter((item) => item.symbol !== symbol)
      : world.portfolio.holdings.map((item) =>
          item.symbol === symbol ? { ...item, shares: remainingShares } : item,
        );

  const portfolio: PortfolioState = {
    ...world.portfolio,
    holdings,
    history: appendPortfolioHistory({ ...world.portfolio, holdings }, world.clock.tickCount),
  };

  return {
    ...world,
    portfolio,
    banking: creditChecking(
      world.banking,
      proceeds,
      world.currentDate,
      `Sell ${shares} ${symbol}`,
    ),
  };
}

function purchaseProperty(world: WorldInstance, propertyId: string): WorldInstance {
  const property = world.housing.properties.find((item) => item.id === propertyId);
  if (!property || property.owned) {
    throw new Error('Property unavailable');
  }

  const banking = debitFromBestAccount(
    world.banking,
    property.priceCents,
    world.currentDate,
    `Purchase ${property.type}`,
  );

  const properties = world.housing.properties.map((item) =>
    item.id === propertyId
      ? { ...item, owned: true, valueCents: property.priceCents }
      : item,
  );

  return {
    ...world,
    banking,
    housing: { ...world.housing, properties },
  };
}

function sellProperty(world: WorldInstance, propertyId: string): WorldInstance {
  const property = world.housing.properties.find((item) => item.id === propertyId);
  if (!property || !property.owned) {
    throw new Error('Property not owned');
  }

  const proceeds = Math.round(property.valueCents * 0.85);
  const banking = creditChecking(
    world.banking,
    proceeds,
    world.currentDate,
    `Sold ${property.type}`,
  );

  const properties = world.housing.properties.map((item) =>
    item.id === propertyId
      ? { ...item, owned: false, valueCents: 0 }
      : item,
  );

  return {
    ...world,
    banking,
    housing: { ...world.housing, properties },
  };
}

function purchaseVehicle(world: WorldInstance, vehicleId: string): WorldInstance {
  const vehicle = world.transportation.vehicles.find((item) => item.id === vehicleId);
  if (!vehicle || vehicle.owned) {
    throw new Error('Vehicle unavailable');
  }

  const banking = debitFromBestAccount(
    world.banking,
    vehicle.priceCents,
    world.currentDate,
    `Purchase ${vehicle.name}`,
  );

  const vehicles = world.transportation.vehicles.map((item) =>
    item.id === vehicleId
      ? { ...item, owned: true, valueCents: vehicle.priceCents }
      : item,
  );

  return {
    ...world,
    banking,
    transportation: { ...world.transportation, vehicles },
  };
}

function sellVehicle(world: WorldInstance, vehicleId: string): WorldInstance {
  const vehicle = world.transportation.vehicles.find((item) => item.id === vehicleId);
  if (!vehicle || !vehicle.owned) {
    throw new Error('Vehicle not owned');
  }

  const proceeds = Math.round(vehicle.valueCents * 0.8);
  const banking = creditChecking(
    world.banking,
    proceeds,
    world.currentDate,
    `Sold ${vehicle.name}`,
  );

  const vehicles = world.transportation.vehicles.map((item) =>
    item.id === vehicleId
      ? { ...item, owned: false, valueCents: 0 }
      : item,
  );

  return {
    ...world,
    banking,
    transportation: { ...world.transportation, vehicles },
  };
}

function applyLoan(world: WorldInstance, amountCents: number): WorldInstance {
  if (amountCents <= 0) {
    throw new Error('Loan amount must be positive');
  }
  if (world.banking.activeLoan) {
    throw new Error('An active loan already exists');
  }
  if (world.banking.creditScore < 580) {
    throw new Error('Credit score too low for a loan');
  }

  const loan = createLoan(amountCents, world.banking.creditScore);
  return {
    ...world,
    banking: applyLoanProceeds(world.banking, loan, world.currentDate),
  };
}

function requireCompany(world: WorldInstance): CompanyState {
  if (!world.company) {
    throw new Error('You have not founded a company yet');
  }
  return world.company;
}

function foundCompany(world: WorldInstance, name: string): WorldInstance {
  if (world.company) {
    throw new Error('You already have an incorporated company');
  }

  const trimmed = name.trim() || suggestedCompanyName(world.player.displayName);
  if (trimmed.length < 2) {
    throw new Error('Company name must be at least 2 characters');
  }

  const banking = debitFromBestAccount(
    world.banking,
    INCORPORATION_FEE_CENTS,
    world.currentDate,
    `Incorporation — ${trimmed}`,
  );

  const company = createFoundedCompany(trimmed, world.player.displayName);
  const career: CareerState = {
    ...world.career,
    status: 'founder',
    jobTitle: 'Founder',
    employerName: company.name,
    monthlySalaryCents: 0,
    performanceScore: Math.max(world.career.performanceScore, 60),
  };

  const events = [
    {
      id: `evt-founded-${world.clock.tickCount}`,
      tickCount: world.clock.tickCount,
      date: world.currentDate,
      category: 'career' as const,
      headline: `${world.player.displayName} incorporated ${company.name}`,
      tone: 'success' as const,
    },
    ...world.events,
  ].slice(0, 50);

  return {
    ...world,
    banking: { ...banking, monthlySalaryCents: 0 },
    company,
    career,
    employees: [],
    events,
  };
}

function hireEmployee(world: WorldInstance): WorldInstance {
  const company = requireCompany(world);
  const hireCostCents = 5_000_00;
  const hiringBonus = world.economy.hiringDifficultyBonus ?? 0;
  const cyclePenalty =
    world.economy.cyclePhase === 'contraction' || world.economy.cyclePhase === 'trough' ? 0.2 : 0;
  const failChance = Math.min(0.55, hiringBonus + cyclePenalty);
  const roll = seededUnit(world.clock.tickCount * 53 + company.employeeCount * 7);
  if (roll < failChance) {
    const banking = debitFromBestAccount(
      world.banking,
      Math.round(hireCostCents * 0.25),
      world.currentDate,
      `Failed hire attempt — ${company.name}`,
    );
    return {
      ...world,
      banking,
      events: [
        {
          id: `evt-hire-fail-${world.clock.tickCount}`,
          tickCount: world.clock.tickCount,
          date: world.currentDate,
          category: 'career' as const,
          headline: `Hiring failed — labor market too tight (${world.economy.cyclePhase})`,
          tone: 'warning' as const,
        },
        ...world.events,
      ].slice(0, 50),
    };
  }

  const banking = debitFromBestAccount(
    world.banking,
    hireCostCents,
    world.currentDate,
    `Hiring budget — ${company.name}`,
  );

  const nextCompany: CompanyState = {
    ...company,
    employeeCount: company.employeeCount + 1,
    monthlyExpensesCents: company.monthlyExpensesCents + 4_500_00,
  };

  const employees =
    world.employees.length < 8
      ? [
          ...world.employees,
          createHiredEmployee(nextCompany, String(world.saveId), world.employees.length),
        ]
      : world.employees;

  return { ...world, banking, company: nextCompany, employees };
}

function launchProduct(world: WorldInstance): WorldInstance {
  const company = requireCompany(world);
  const launchCostCents = 12_000_00;
  const banking = debitFromBestAccount(
    world.banking,
    launchCostCents,
    world.currentDate,
    `Product launch — ${company.name}`,
  );

  const failRoll = seededUnit(world.clock.tickCount * 71 + company.productCount * 11);
  const failChance =
    world.economy.cyclePhase === 'contraction' || world.economy.cyclePhase === 'trough' ? 0.45 : 0.22;
  if (failRoll < failChance) {
    return {
      ...world,
      banking,
      events: [
        {
          id: `evt-launch-fail-${world.clock.tickCount}`,
          tickCount: world.clock.tickCount,
          date: world.currentDate,
          category: 'career' as const,
          headline: `Product launch flopped at ${company.name} — sunk cost, no revenue lift`,
          tone: 'warning' as const,
        },
        ...world.events,
      ].slice(0, 50),
    };
  }

  const nextCompany: CompanyState = {
    ...company,
    productCount: company.productCount + 1,
    monthlyRevenueCents: company.monthlyRevenueCents + 8_000_00,
    valuationCents: company.valuationCents + 150_000_00,
    marketSharePct: Math.min(25, company.marketSharePct + 0.2),
  };

  return {
    ...world,
    banking,
    company: nextCompany,
    events: [
      {
        id: `evt-launch-ok-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'career' as const,
        headline: `${company.name} launched a product successfully`,
        tone: 'success' as const,
      },
      ...world.events,
    ].slice(0, 50),
  };
}

function promoteEmployee(world: WorldInstance, employeeId: string): WorldInstance {
  const company = requireCompany(world);
  const employee = findEmployee(world, employeeId);
  const costCents = 2_500_00;
  const banking = debitFromBestAccount(
    world.banking,
    costCents,
    world.currentDate,
    `Promotion — ${employee.name}`,
  );

  const salaryDelta = Math.round(employee.salaryCents * 0.1);
  const employees = world.employees.map((item) =>
    item.id === employeeId
      ? {
          ...item,
          position: item.position.startsWith('Senior') ? item.position : `Senior ${item.position}`,
          salaryCents: item.salaryCents + salaryDelta,
          leadership: clampEmployeeStat(item.leadership + 8),
          productivity: clampEmployeeStat(item.productivity + 5),
        }
      : item,
  );

  return {
    ...world,
    banking,
    employees,
    company: {
      ...company,
      monthlyExpensesCents: company.monthlyExpensesCents + salaryDelta,
    },
  };
}

function raiseEmployee(world: WorldInstance, employeeId: string): WorldInstance {
  const company = requireCompany(world);
  const employee = findEmployee(world, employeeId);
  const costCents = 1_500_00;
  const banking = debitFromBestAccount(
    world.banking,
    costCents,
    world.currentDate,
    `Raise — ${employee.name}`,
  );

  const salaryDelta = Math.round(employee.salaryCents * 0.08);
  const employees = world.employees.map((item) =>
    item.id === employeeId
      ? {
          ...item,
          salaryCents: item.salaryCents + salaryDelta,
          loyalty: clampEmployeeStat(item.loyalty + 6),
        }
      : item,
  );

  return {
    ...world,
    banking,
    employees,
    company: {
      ...company,
      monthlyExpensesCents: company.monthlyExpensesCents + salaryDelta,
    },
  };
}

function trainEmployee(world: WorldInstance, employeeId: string): WorldInstance {
  const employee = findEmployee(world, employeeId);
  const costCents = 500_00;
  const banking = debitFromBestAccount(
    world.banking,
    costCents,
    world.currentDate,
    `Training — ${employee.name}`,
  );

  const employees = world.employees.map((item) =>
    item.id === employeeId
      ? {
          ...item,
          creativity: clampEmployeeStat(item.creativity + 8),
          productivity: clampEmployeeStat(item.productivity + 5),
        }
      : item,
  );

  return { ...world, banking, employees };
}

function planFamilyEvent(world: WorldInstance): WorldInstance {
  const costCents = 200_00;
  const banking = debitFromBestAccount(
    world.banking,
    costCents,
    world.currentDate,
    'Family event',
  );

  const members = world.family.members.map((member) => ({
    ...member,
    happiness: Math.min(100, member.happiness + 5),
  }));

  return {
    ...world,
    banking,
    family: { ...world.family, members },
    player: {
      ...world.player,
      traits: {
        ...world.player.traits,
        happiness: Math.min(100, world.player.traits.happiness + 3),
      },
    },
  };
}

function sendFamilyGift(world: WorldInstance, memberId: string): WorldInstance {
  findFamilyMember(world, memberId);
  const costCents = 100_00;
  const banking = debitFromBestAccount(
    world.banking,
    costCents,
    world.currentDate,
    'Family gift',
  );

  const members = world.family.members.map((member) =>
    member.id === memberId
      ? { ...member, happiness: Math.min(100, member.happiness + 8) }
      : member,
  );

  return {
    ...world,
    banking,
    family: { ...world.family, members },
  };
}

function scheduleFamilyVisit(world: WorldInstance, memberId: string): WorldInstance {
  findFamilyMember(world, memberId);

  const members = world.family.members.map((member) =>
    member.id === memberId
      ? { ...member, happiness: Math.min(100, member.happiness + 4) }
      : member,
  );

  return {
    ...world,
    family: { ...world.family, members },
    player: {
      ...world.player,
      traits: {
        ...world.player.traits,
        energy: Math.max(0, world.player.traits.energy - 5),
        happiness: Math.min(100, world.player.traits.happiness + 2),
      },
    },
  };
}

function syncCareerSalary(world: WorldInstance, career: CareerState): WorldInstance {
  if (career.status === 'unemployed') {
    return {
      ...world,
      career,
      banking: { ...world.banking, monthlySalaryCents: 0 },
    };
  }

  return {
    ...world,
    career,
    banking: { ...world.banking, monthlySalaryCents: career.monthlySalaryCents },
  };
}

function requestCareerRaise(world: WorldInstance): WorldInstance {
  if (world.career.status === 'unemployed') {
    throw new Error('Cannot request a raise while unemployed');
  }
  if (world.career.pipActive) {
    throw new Error('Cannot request a raise while on a PIP');
  }
  if (world.career.performanceScore < RAISE_MIN_PERFORMANCE) {
    throw new Error(`Performance must be at least ${RAISE_MIN_PERFORMANCE}% to request a raise`);
  }
  if (world.career.monthsInRole < RAISE_MIN_MONTHS) {
    throw new Error(`Need ${RAISE_MIN_MONTHS} months in role before requesting a raise`);
  }
  if (world.clock.tickCount - world.career.lastRaiseTick < RAISE_COOLDOWN_TICKS) {
    throw new Error('Raise cooldown active — wait before asking again');
  }

  const roll = Math.floor(seededUnit(world.clock.tickCount * 97 + world.career.performanceScore * 13) * 100);
  const successChance = Math.min(55, 20 + (world.career.performanceScore - RAISE_MIN_PERFORMANCE));
  if (roll >= successChance) {
    return {
      ...world,
      career: {
        ...world.career,
        lastRaiseTick: world.clock.tickCount,
        warnings: world.career.warnings + (roll > 90 ? 1 : 0),
        performanceScore: clampEmployeeStat(world.career.performanceScore - 2),
      },
      player: {
        ...world.player,
        traits: {
          ...world.player.traits,
          stress: clampEmployeeStat(world.player.traits.stress + 6),
        },
      },
      events: [
        {
          id: `evt-raise-deny-${world.clock.tickCount}`,
          tickCount: world.clock.tickCount,
          date: world.currentDate,
          category: 'career' as const,
          headline: `Raise denied at ${world.career.employerName}`,
          tone: 'warning' as const,
        },
        ...world.events,
      ].slice(0, 50),
    };
  }

  const salaryDelta = Math.round(world.career.monthlySalaryCents * 0.04);
  const career: CareerState = {
    ...world.career,
    monthlySalaryCents: world.career.monthlySalaryCents + salaryDelta,
    lastRaiseTick: world.clock.tickCount,
    performanceScore: clampEmployeeStat(world.career.performanceScore + 1),
  };

  return syncCareerSalary(world, career);
}

function requestCareerPromotion(world: WorldInstance): WorldInstance {
  if (world.career.status !== 'employed') {
    throw new Error('Only employed roles can request promotion');
  }
  if (world.career.pipActive) {
    throw new Error('Cannot request promotion while on a PIP');
  }
  if (world.career.performanceScore < PROMOTION_MIN_PERFORMANCE) {
    throw new Error(`Performance must be at least ${PROMOTION_MIN_PERFORMANCE}%`);
  }
  if (world.career.monthsInRole < PROMOTION_MIN_MONTHS) {
    throw new Error(`Need ${PROMOTION_MIN_MONTHS} months in role for promotion`);
  }
  if (world.clock.tickCount - world.career.lastPromotionTick < PROMOTION_COOLDOWN_TICKS) {
    throw new Error('Promotion cooldown active — typically a full year between promotions');
  }

  const roll = Math.floor(seededUnit(world.clock.tickCount * 131 + world.career.monthsInRole * 17) * 100);
  if (roll >= 28) {
    return {
      ...world,
      career: {
        ...world.career,
        lastPromotionTick: world.clock.tickCount,
        performanceScore: clampEmployeeStat(world.career.performanceScore - 3),
      },
      player: {
        ...world.player,
        traits: {
          ...world.player.traits,
          stress: clampEmployeeStat(world.player.traits.stress + 8),
        },
      },
      events: [
        {
          id: `evt-promo-deny-${world.clock.tickCount}`,
          tickCount: world.clock.tickCount,
          date: world.currentDate,
          category: 'career' as const,
          headline: `Promotion denied — keep delivering for another review cycle`,
          tone: 'warning' as const,
        },
        ...world.events,
      ].slice(0, 50),
    };
  }

  const career: CareerState = {
    ...world.career,
    jobTitle: `Senior ${world.career.jobTitle.replace(/^Senior\s+/i, '')}`,
    monthlySalaryCents: Math.round(world.career.monthlySalaryCents * 1.12),
    monthsInRole: 0,
    lastPromotionTick: world.clock.tickCount,
    performanceScore: clampEmployeeStat(world.career.performanceScore - 5),
  };

  return {
    ...syncCareerSalary(world, career),
    events: [
      {
        id: `evt-promo-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'career' as const,
        headline: `Promoted to ${career.jobTitle}`,
        tone: 'success' as const,
      },
      ...world.events,
    ].slice(0, 50),
  };
}

function upskillCareer(world: WorldInstance): WorldInstance {
  if (world.clock.tickCount - world.career.lastUpskillTick < UPSKILL_COOLDOWN_TICKS) {
    throw new Error('Upskill cooldown — wait before another course');
  }
  const costCents = 300_00;
  const banking = debitFromBestAccount(
    world.banking,
    costCents,
    world.currentDate,
    'Professional upskilling',
  );

  const gain = world.career.performanceScore >= 85 ? 2 : 4;
  const career: CareerState = {
    ...world.career,
    performanceScore: clampEmployeeStat(world.career.performanceScore + gain),
    lastUpskillTick: world.clock.tickCount,
  };

  return syncCareerSalary({ ...world, banking }, career);
}

function networkCareer(world: WorldInstance): WorldInstance {
  if (world.clock.tickCount - world.career.lastNetworkTick < NETWORK_COOLDOWN_TICKS) {
    throw new Error('Networking cooldown — relationships take time');
  }
  const costCents = 150_00;
  const banking = debitFromBestAccount(
    world.banking,
    costCents,
    world.currentDate,
    'Professional networking',
  );

  const gain = world.career.performanceScore >= 80 ? 1 : 3;
  const career: CareerState = {
    ...world.career,
    performanceScore: clampEmployeeStat(world.career.performanceScore + gain),
    lastNetworkTick: world.clock.tickCount,
  };

  return {
    ...syncCareerSalary({ ...world, banking }, career),
    player: {
      ...world.player,
      traits: {
        ...world.player.traits,
        openness: clampEmployeeStat(world.player.traits.openness + 2),
        energy: clampEmployeeStat(world.player.traits.energy - 4),
      },
    },
  };
}

function quitCareer(world: WorldInstance): WorldInstance {
  if (world.career.status === 'unemployed') {
    throw new Error('Already unemployed');
  }
  if (world.career.status === 'founder') {
    throw new Error('Founders resign via company shutdown — not implemented as a quick quit');
  }

  return {
    ...world,
    career: {
      ...world.career,
      status: 'unemployed',
      jobTitle: 'Seeking work',
      employerName: '—',
      monthlySalaryCents: 0,
      unemployedSinceDate: world.currentDate,
      monthsInRole: 0,
      pipActive: false,
      pipDaysRemaining: 0,
      performanceScore: clampEmployeeStat(world.career.performanceScore - 5),
    },
    banking: { ...world.banking, monthlySalaryCents: 0 },
    events: [
      {
        id: `evt-quit-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'career' as const,
        headline: `Resigned from ${world.career.employerName}`,
        tone: 'info' as const,
      },
      ...world.events,
    ].slice(0, 50),
  };
}

function payLoan(world: WorldInstance): WorldInstance {
  return {
    ...world,
    banking: payOffActiveLoan(world.banking, world.currentDate, debitFromBestAccount),
  };
}

function restructureLoan(world: WorldInstance): WorldInstance {
  return {
    ...world,
    banking: restructureActiveLoan(world.banking, world.currentDate),
    events: [
      {
        id: `evt-loan-restructure-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'finance' as const,
        headline: 'Loan restructured — payments resume under a higher APR',
        tone: 'info' as const,
      },
      ...world.events,
    ].slice(0, 50),
  };
}

function settleLoan(world: WorldInstance): WorldInstance {
  return {
    ...world,
    banking: settleActiveLoan(world.banking, world.currentDate, debitFromBestAccount),
    events: [
      {
        id: `evt-loan-settle-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'finance' as const,
        headline: 'Loan settled with collectors — credit scar remains',
        tone: 'warning' as const,
      },
      ...world.events,
    ].slice(0, 50),
  };
}

function applyForJob(world: WorldInstance, listingId: string): WorldInstance {
  if (world.career.status !== 'unemployed') {
    throw new Error('You are already employed');
  }

  const listing = getJobListingById(listingId);
  if (!listing) {
    throw new Error('Job listing not found');
  }

  const available = getAvailableJobListings({
    career: world.career,
    education: world.education,
  });
  if (!available.some((item) => item.id === listingId)) {
    throw new Error('You do not meet the requirements for this job');
  }

  let nextWorld: WorldInstance = {
    ...world,
    banking: debitFromBestAccount(
      world.banking,
      JOB_APPLICATION_FEE_CENTS,
      world.currentDate,
      `Application — ${listing.title}`,
    ),
  };

  const matchScore = jobListingMatchScore(listing, world.career.performanceScore, world.education);
  const resolveOnDate = addDaysToDate(world.currentDate, JOB_APPLICATION_RESOLVE_DAYS);
  const pendingApplication = createJobApplication({
    listing,
    appliedDate: world.currentDate,
    matchScore,
    status: 'pending',
    idSuffix: world.clock.tickCount,
    resolveOnDate,
  });

  return {
    ...nextWorld,
    career: {
      ...world.career,
      applications: appendJobApplication(world.career.applications ?? [], pendingApplication),
    },
    events: [
      {
        id: `evt-job-apply-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'career' as const,
        headline: `Applied to ${listing.title} at ${listing.employerName} — decision in ~${JOB_APPLICATION_RESOLVE_DAYS} days`,
        tone: 'info' as const,
      },
      ...nextWorld.events,
    ].slice(0, 50),
  };
}

function visitDistrict(world: WorldInstance, districtId: string): WorldInstance {
  return applyDistrictVisit(world, districtId).world;
}

function fileTaxes(world: WorldInstance): WorldInstance {
  const civic = civicOf(world);
  const balance = civic.taxBalanceCents;
  let nextWorld = {
    ...world,
    civic: {
      ...civic,
      taxFilingOverdue: false,
      lastTaxYearFiled: world.clock.tickCount,
      taxBalanceCents: 0,
    },
  };

  if (balance > 0) {
    nextWorld = {
      ...nextWorld,
      banking: creditChecking(nextWorld.banking, balance, nextWorld.currentDate, 'Tax refund'),
    };
  } else if (balance < 0) {
    nextWorld = {
      ...nextWorld,
      banking: debitFromBestAccount(
        nextWorld.banking,
        Math.abs(balance),
        nextWorld.currentDate,
        'Tax balance due',
      ),
    };
  }

  return {
    ...nextWorld,
    events: [
      {
        id: `evt-tax-file-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'finance' as const,
        headline:
          balance > 0
            ? `Tax return filed — refund ${(balance / 100).toLocaleString()}`
            : balance < 0
              ? `Tax return filed — paid ${(Math.abs(balance) / 100).toLocaleString()}`
              : 'Tax return filed — even balance',
        tone: balance < 0 ? ('warning' as const) : ('success' as const),
      },
      ...nextWorld.events,
    ].slice(0, 50),
  };
}

function payTaxBalance(world: WorldInstance): WorldInstance {
  const civic = civicOf(world);
  if (civic.taxBalanceCents >= 0) {
    throw new Error('No tax balance due');
  }
  return fileTaxes(world);
}

function treatIllness(world: WorldInstance): WorldInstance {
  const civic = civicOf(world);
  const illness = civic.pendingIllness;
  if (!illness) {
    throw new Error('No pending illness');
  }

  const insured = civic.hasInsurance;
  const cost = insured ? Math.round(illness.treatCostCents * 0.35) : illness.treatCostCents;
  let nextWorld = {
    ...world,
    banking: debitFromBestAccount(world.banking, cost, world.currentDate, 'Medical treatment'),
    civic: { ...civic, pendingIllness: null },
    player: {
      ...world.player,
      traits: {
        ...world.player.traits,
        health: clampEmployeeStat(world.player.traits.health + Math.round(illness.healthPenalty * 0.6)),
        stress: clampEmployeeStat(world.player.traits.stress - 4),
      },
    },
  };

  return {
    ...nextWorld,
    events: [
      {
        id: `evt-treat-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'life' as const,
        headline: `Treated illness${insured ? ' (insured)' : ''} — recovering`,
        tone: 'success' as const,
      },
      ...nextWorld.events,
    ].slice(0, 50),
  };
}

function ignoreIllness(world: WorldInstance): WorldInstance {
  const civic = civicOf(world);
  const illness = civic.pendingIllness;
  if (!illness) {
    throw new Error('No pending illness');
  }

  return {
    ...world,
    civic: { ...civic, pendingIllness: null },
    player: {
      ...world.player,
      traits: {
        ...world.player.traits,
        health: clampEmployeeStat(world.player.traits.health - illness.ignorePenalty),
        stress: clampEmployeeStat(world.player.traits.stress + 8),
        energy: clampEmployeeStat(world.player.traits.energy - 10),
      },
    },
    events: [
      {
        id: `evt-ignore-illness-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'life' as const,
        headline: 'Ignored illness — condition worsened',
        tone: 'warning' as const,
      },
      ...world.events,
    ].slice(0, 50),
  };
}

function enrollInsurance(world: WorldInstance): WorldInstance {
  const civic = civicOf(world);
  if (civic.hasInsurance) {
    throw new Error('Already enrolled in health insurance');
  }
  const premium = 350_00;
  return {
    ...world,
    civic: {
      ...civic,
      hasInsurance: true,
      insurancePremiumCents: premium,
    },
    banking: {
      ...world.banking,
      monthlyExpensesCents: world.banking.monthlyExpensesCents + premium,
    },
    events: [
      {
        id: `evt-insure-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'life' as const,
        headline: 'Enrolled in health insurance — lower treatment costs, monthly premium',
        tone: 'info' as const,
      },
      ...world.events,
    ].slice(0, 50),
  };
}

export function portfolioSnapshotValue(portfolio: PortfolioState): number {
  return portfolioValueCents(portfolio.holdings, portfolio.quotes);
}
