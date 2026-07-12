import type { BankingState } from './banking.js';
import type { PortfolioState } from './portfolio.js';
import { portfolioValueCents } from './portfolio.js';
import type { HousingState } from './housing.js';
import { housingTotalValueCents } from './housing.js';
import type { CompanyState } from './company.js';
import { companyMonthlyProfitCents } from './company.js';
import type { WorldInstance } from './world-instance.js';
import { createDefaultCivic } from './civic.js';
import { createEmptyDistrictVisits } from './city-districts.js';
import { computeLegacySnapshot } from './life-timeline.js';

// ---------------------------------------------------------------------------
// Mortality risk
// ---------------------------------------------------------------------------

export interface DeathPendingState {
  readonly deceasedName: string;
  readonly date: string;
  readonly riskLabel: MortalityRisk['label'];
  /** Optional terminal diagnosis stage before death roll. */
  readonly diagnosis?: string;
}

export interface MortalityRisk {
  /** Daily probability of death (0–1). */
  readonly dailyChance: number;
  /** Human-readable risk label. */
  readonly label: 'low' | 'moderate' | 'elevated' | 'critical';
}

const RISK_LABELS: ReadonlyArray<{ readonly threshold: number; readonly label: MortalityRisk['label'] }> = [
  { threshold: 0.0005, label: 'low' },
  { threshold: 0.001, label: 'moderate' },
  { threshold: 0.003, label: 'elevated' },
  { threshold: 1, label: 'critical' },
];

/**
 * Evaluates daily mortality risk based on age, health and stress.
 * Under 60 the base rate is very low; risk escalates with age and poor health.
 */
export function evaluateMortalityRisk(world: WorldInstance): MortalityRisk {
  const { ageYears } = world.player;
  const { health, stress } = world.player.traits;

  const ageFactor = Math.max(0, ageYears - 40) * 0.00005;
  const healthFactor = (100 - health) * 0.000015;
  const stressFactor = stress * 0.000005;

  const dailyChance = Math.min(0.02, ageFactor + healthFactor + stressFactor);

  const found = RISK_LABELS.find((r) => dailyChance <= r.threshold);
  const label = found?.label ?? 'critical';

  return { dailyChance, label };
}

export type HealthEscalationStage = 'stable' | 'declining' | 'critical' | 'terminal';

export function evaluateHealthEscalation(world: WorldInstance): HealthEscalationStage {
  const { health } = world.player.traits;
  const { ageYears } = world.player;
  if (health <= 15 && ageYears >= 55) return 'terminal';
  if (health <= 30) return 'critical';
  if (health <= 50) return 'declining';
  return 'stable';
}

// ---------------------------------------------------------------------------
// Heir selection
// ---------------------------------------------------------------------------

export interface HeirRecord {
  readonly id: string;
  readonly name: string;
  readonly relationship: string;
}

function heirPriority(relationship: string): number {
  const rel = relationship.toLowerCase();
  if (rel === 'spouse' || rel === 'partner') {
    return 0;
  }
  if (rel === 'child') {
    return 1;
  }
  if (rel === 'sibling') {
    return 2;
  }
  if (rel === 'parent' || rel === 'mother' || rel === 'father') {
    return 3;
  }
  return 99;
}

/**
 * Selects the best heir from family members.
 * Priority: spouse/partner > children (oldest first) > siblings > parents.
 */
export function selectHeir(world: WorldInstance): HeirRecord | null {
  const candidate = [...world.family.members]
    .filter((member) => heirPriority(member.relationship) < 99)
    .sort(
      (left, right) =>
        heirPriority(left.relationship) - heirPriority(right.relationship) ||
        right.happiness - left.happiness,
    )[0];

  if (!candidate) {
    return null;
  }

  return {
    id: candidate.id,
    name: candidate.name,
    relationship: candidate.relationship,
  };
}

// ---------------------------------------------------------------------------
// Estate transfer
// ---------------------------------------------------------------------------

const INHERITANCE_TAX_RATE = 0.15;

export interface EstateTransferResult {
  /** Net estate transferred in cents (after tax). */
  readonly transferredCents: number;
  /** Tax paid in cents. */
  readonly taxCents: number;
  /** Gross estate value in cents. */
  readonly grossEstateCents: number;
  readonly liquidCents: number;
  readonly portfolioCents: number;
  readonly housingCents: number;
  readonly companyCents: number;
}

/**
 * Computes the post-tax estate that transfers to an heir.
 * Banking + portfolio + housing equity + optional company forced-sale proceeds.
 */
export function computeEstateTransfer(
  banking: BankingState,
  portfolio?: PortfolioState,
  housing?: HousingState,
  company?: CompanyState | null,
  keepCompany = false,
): EstateTransferResult {
  const liquidCents = banking.accounts.reduce((sum, a) => sum + Math.max(0, a.balanceCents), 0);
  const portfolioCents = portfolio
    ? Math.max(0, portfolioValueCents(portfolio.holdings, portfolio.quotes))
    : 0;
  const housingCents = housing ? Math.max(0, housingTotalValueCents(housing)) : 0;
  const companyCents =
    company && !keepCompany
      ? Math.max(0, company.valuationCents + companyMonthlyProfitCents(company) * 3)
      : 0;

  const grossEstateCents = liquidCents + portfolioCents + housingCents + companyCents;
  const taxCents = Math.round(grossEstateCents * INHERITANCE_TAX_RATE);
  const transferredCents = grossEstateCents - taxCents;
  return {
    grossEstateCents,
    taxCents,
    transferredCents,
    liquidCents,
    portfolioCents,
    housingCents,
    companyCents,
  };
}

// ---------------------------------------------------------------------------
// Death and heir resolution
// ---------------------------------------------------------------------------

/**
 * Marks the player as deceased and pauses the simulation until an heir is chosen.
 */
export function triggerDeathPending(world: WorldInstance): WorldInstance {
  if (world.deathPending) {
    return world;
  }

  const risk = evaluateMortalityRisk(world);
  const stage = evaluateHealthEscalation(world);
  const diagnosis =
    stage === 'terminal'
      ? 'Terminal diagnosis confirmed before the end'
      : stage === 'critical'
        ? 'Critical health collapse'
        : undefined;

  const events = [
    ...(diagnosis
      ? [
          {
            id: `evt-diagnosis-${world.clock.tickCount}`,
            tickCount: world.clock.tickCount,
            date: world.currentDate,
            category: 'life' as const,
            headline: diagnosis,
            tone: 'warning' as const,
          },
        ]
      : []),
    {
      id: `evt-death-pending-${world.clock.tickCount}`,
      tickCount: world.clock.tickCount,
      date: world.currentDate,
      category: 'life' as const,
      headline: `${world.player.displayName} has passed away — choose an heir to continue`,
      tone: 'warning' as const,
    },
    ...world.events,
  ].slice(0, 50);

  return {
    ...world,
    deathPending: {
      deceasedName: world.player.displayName,
      date: world.currentDate,
      riskLabel: risk.label,
      diagnosis,
    },
    clock: { ...world.clock, paused: true },
    events,
  };
}

/**
 * Applies death: selects heir, applies inheritance tax haircut across assets,
 * and continues the world as the heir citizen.
 */
export function applyDeathAndSelectHeir(
  world: WorldInstance,
  preferredHeirId?: string,
  keepCompany = false,
): WorldInstance {
  const preferred = preferredHeirId
    ? world.family.members.find((member) => member.id === preferredHeirId)
    : null;
  const heir =
    preferred != null
      ? { id: preferred.id, name: preferred.name, relationship: preferred.relationship }
      : selectHeir(world);

  if (!heir) {
    throw new Error('No surviving heirs — create family bonds before the end');
  }

  const estate = computeEstateTransfer(
    world.banking,
    world.portfolio,
    world.housing,
    world.company,
    keepCompany,
  );
  const liquid = Math.max(0, estate.transferredCents);
  const checkingShare = Math.round(liquid * 0.7);
  const savingsShare = liquid - checkingShare;

  const accounts = world.banking.accounts.map((account) => {
    if (account.id === 'checking') {
      return { ...account, balanceCents: checkingShare };
    }
    if (account.id === 'savings') {
      return { ...account, balanceCents: savingsShare };
    }
    return { ...account, balanceCents: 0 };
  });

  const legacy = computeLegacySnapshot(world);
  const companyKept = keepCompany ? world.company : null;

  return {
    ...world,
    deathPending: null,
    clock: { ...world.clock, paused: false },
    player: {
      ...world.player,
      displayName: heir.name,
      ageYears: Math.max(18, preferred?.ageYears ?? 22),
      traits: {
        ...world.player.traits,
        happiness: Math.max(40, world.player.traits.happiness - 15),
        stress: Math.min(100, world.player.traits.stress + 10),
        health: 75,
        energy: 70,
      },
    },
    banking: {
      ...world.banking,
      accounts,
      monthlySalaryCents: 0,
      activeLoan: null,
      netWorthHistory: [
        { date: world.currentDate, netWorthCents: liquid },
        ...(world.banking.netWorthHistory ?? []),
      ].slice(0, 36),
      cashFlowHistory: world.banking.cashFlowHistory ?? [],
    },
    portfolio: {
      ...world.portfolio,
      holdings: [],
      history: [
        { tickCount: world.clock.tickCount, valueCents: 0 },
        ...(world.portfolio.history ?? []),
      ].slice(0, 36),
    },
    housing: {
      ...world.housing,
      properties: world.housing.properties.map((property) =>
        property.owned ? { ...property, owned: false } : property,
      ),
    },
    career: {
      ...world.career,
      status: companyKept ? 'founder' : 'unemployed',
      jobTitle: companyKept ? 'Heir — CEO' : 'Heir — seeking work',
      employerName: companyKept?.name ?? '—',
      monthlySalaryCents: 0,
      unemployedSinceDate: companyKept ? null : world.currentDate,
      monthsInRole: 0,
      applications: [],
      pipActive: false,
      pipDaysRemaining: 0,
    },
    company: companyKept,
    employees: companyKept ? world.employees : [],
    civic: createDefaultCivic(),
    districtVisits: createEmptyDistrictVisits(),
    events: [
      {
        id: `evt-legacy-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'life' as const,
        headline: `Legacy score ${legacy.score} (${legacy.label}) — net worth snapshot recorded`,
        tone: 'info' as const,
      },
      {
        id: `evt-death-${world.clock.tickCount}`,
        tickCount: world.clock.tickCount,
        date: world.currentDate,
        category: 'life' as const,
        headline: `${world.player.displayName} passed away. ${heir.name} inherits ${Math.round(estate.transferredCents / 100)} after tax${keepCompany && world.company ? `; kept ${world.company.name}` : world.company ? `; company sold for estate` : ''}.`,
        tone: 'warning' as const,
      },
      ...world.events,
    ].slice(0, 50),
  };
}
