import { debitFromBestAccount } from './banking-actions.js';
import type { BankingState, BankTransaction } from './banking.js';
import { createFoundedCompany, INCORPORATION_FEE_CENTS, suggestedCompanyName, type CompanyState } from './company.js';
import type { CareerState } from './career.js';
import { applyAdolescenceChoice, skipAdolescencePlay } from './adolescence-play.js';
import {
  appendJobApplication,
  createJobApplication,
} from './job-applications.js';
import {
  getAvailableJobListings,
  getJobListingById,
  JOB_APPLICATION_FEE_CENTS,
  jobListingMatchScore,
} from './job-market.js';
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
import { createLoan, applyLoanProceeds, payOffActiveLoan } from './loans.js';

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
  | { kind: 'CAREER_UPSKILL' }
  | { kind: 'CAREER_NETWORK' }
  | { kind: 'PAY_LOAN' }
  | { kind: 'CAREER_APPLY_JOB'; listingId: string }
  | { kind: 'APPLY_ADOLESCENCE_CHOICE'; stepId: string; choiceId: string }
  | { kind: 'SKIP_ADOLESCENCE_PLAY' }
  | { kind: 'DISMISS_HOME_TOUR' }
  | { kind: 'VISIT_DISTRICT'; districtId: string }
  | { kind: 'FOUND_COMPANY'; name: string }
  | { kind: 'COMPLETE_CHILDHOOD_ONBOARDING'; simulateFirstYear?: boolean }
  | { kind: 'DISMISS_LIFE_PATH_HINTS' };

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
    case 'CAREER_UPSKILL':
      return upskillCareer(world);
    case 'CAREER_NETWORK':
      return networkCareer(world);
    case 'PAY_LOAN':
      return payLoan(world);
    case 'CAREER_APPLY_JOB':
      return applyForJob(world, action.listingId);
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
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
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

  const nextCompany: CompanyState = {
    ...company,
    productCount: company.productCount + 1,
    monthlyRevenueCents: company.monthlyRevenueCents + 8_000_00,
    valuationCents: company.valuationCents + 150_000_00,
    marketSharePct: Math.min(25, company.marketSharePct + 0.2),
  };

  return { ...world, banking, company: nextCompany };
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
  if (world.career.performanceScore < 65) {
    throw new Error('Performance must be at least 65% to request a raise');
  }

  const salaryDelta = Math.round(world.career.monthlySalaryCents * 0.06);
  const career: CareerState = {
    ...world.career,
    monthlySalaryCents: world.career.monthlySalaryCents + salaryDelta,
    performanceScore: clampEmployeeStat(world.career.performanceScore + 2),
  };

  return syncCareerSalary(world, career);
}

function upskillCareer(world: WorldInstance): WorldInstance {
  const costCents = 300_00;
  const banking = debitFromBestAccount(
    world.banking,
    costCents,
    world.currentDate,
    'Professional upskilling',
  );

  const career: CareerState = {
    ...world.career,
    performanceScore: clampEmployeeStat(world.career.performanceScore + 5),
  };

  return syncCareerSalary({ ...world, banking }, career);
}

function networkCareer(world: WorldInstance): WorldInstance {
  const costCents = 150_00;
  const banking = debitFromBestAccount(
    world.banking,
    costCents,
    world.currentDate,
    'Professional networking',
  );

  const career: CareerState = {
    ...world.career,
    performanceScore: clampEmployeeStat(world.career.performanceScore + 3),
  };

  return {
    ...syncCareerSalary({ ...world, banking }, career),
    player: {
      ...world.player,
      traits: {
        ...world.player.traits,
        openness: clampEmployeeStat(world.player.traits.openness + 2),
      },
    },
  };
}

function payLoan(world: WorldInstance): WorldInstance {
  return {
    ...world,
    banking: payOffActiveLoan(world.banking, world.currentDate, debitFromBestAccount),
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

  const matchScore = jobListingMatchScore(listing, world.career.performanceScore);
  const success =
    matchScore >= 55 ||
    (world.clock.tickCount + listingId.length) % 3 !== 0;

  const applications = world.career.applications ?? [];

  if (!success) {
    const rejectedApplication = createJobApplication({
      listing,
      appliedDate: world.currentDate,
      matchScore,
      status: 'rejected',
      rejectionReason:
        matchScore < 55
          ? 'Match score below the hiring threshold'
          : 'Employer chose stronger candidates this cycle',
      idSuffix: world.clock.tickCount,
    });

    return {
      ...nextWorld,
      career: {
        ...world.career,
        applications: appendJobApplication(applications, rejectedApplication),
      },
      player: {
        ...nextWorld.player,
        traits: {
          ...nextWorld.player.traits,
          stress: clampEmployeeStat(nextWorld.player.traits.stress + 3),
        },
      },
      events: [
        {
          id: `evt-job-reject-${world.clock.tickCount}`,
          tickCount: world.clock.tickCount,
          date: world.currentDate,
          category: 'career' as const,
          headline: `Application declined — ${listing.title} at ${listing.employerName}`,
          tone: 'warning' as const,
        },
        ...nextWorld.events,
      ].slice(0, 50),
    };
  }

  const acceptedApplication = createJobApplication({
    listing,
    appliedDate: world.currentDate,
    matchScore,
    status: 'accepted',
    idSuffix: world.clock.tickCount,
  });

  const career: CareerState = {
    ...world.career,
    status: 'employed',
    jobTitle: listing.title,
    employerName: listing.employerName,
    monthlySalaryCents: listing.monthlySalaryCents,
    performanceScore: clampEmployeeStat(world.career.performanceScore + 5),
    yearsExperience: world.career.yearsExperience,
    unemployedSinceDate: null,
    applications: appendJobApplication(applications, acceptedApplication),
  };

  return {
    ...syncCareerSalary(nextWorld, career),
    events: [
      {
        id: `evt-job-offer-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'career' as const,
        headline: `Hired as ${listing.title} at ${listing.employerName}`,
        tone: 'success' as const,
      },
      ...nextWorld.events,
    ].slice(0, 50),
  };
}

function visitDistrict(world: WorldInstance, districtId: string): WorldInstance {
  const validDistricts = new Set([
    'downtown',
    'university',
    'hospital',
    'mall',
    'airport',
    'cafe',
    'tech',
    'residential',
  ]);

  if (!validDistricts.has(districtId)) {
    throw new Error('Unknown district');
  }

  const traitDelta: Partial<Record<string, { happiness?: number; energy?: number; health?: number; openness?: number }>> = {
    downtown: { happiness: 2, energy: -2 },
    university: { openness: 3, energy: -1 },
    hospital: { health: 3, energy: -2 },
    mall: { happiness: 4, energy: -3 },
    airport: { happiness: 2, openness: 2, energy: -4 },
    cafe: { happiness: 3, openness: 2, energy: -1 },
    tech: { openness: 2, energy: -2 },
    residential: { happiness: 2, health: 1 },
  };

  const delta = traitDelta[districtId] ?? { happiness: 1 };
  const traits = world.player.traits;

  return {
    ...world,
    player: {
      ...world.player,
      traits: {
        ...traits,
        happiness: clampEmployeeStat(traits.happiness + (delta.happiness ?? 0)),
        energy: clampEmployeeStat(traits.energy + (delta.energy ?? 0)),
        health: clampEmployeeStat(traits.health + (delta.health ?? 0)),
        openness: clampEmployeeStat(traits.openness + (delta.openness ?? 0)),
      },
    },
    events: [
      {
        id: `evt-visit-${districtId}-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'life' as const,
        headline: `Visited ${districtId.replace(/^\w/, (char) => char.toUpperCase())} district`,
        tone: 'info' as const,
      },
      ...world.events,
    ].slice(0, 50),
  };
}

export function portfolioSnapshotValue(portfolio: PortfolioState): number {
  return portfolioValueCents(portfolio.holdings, portfolio.quotes);
}
