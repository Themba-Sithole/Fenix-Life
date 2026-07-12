import type { BankingState, BankTransaction } from './banking.js';
import type { CareerState } from './career.js';
import type { WorldInstance } from './world-instance.js';

// ---------------------------------------------------------------------------
// Tax withholding
// ---------------------------------------------------------------------------

export interface TaxWithholdingResult {
  /** Annual taxable income in cents. */
  readonly taxableIncomeCents: number;
  /** Monthly PAYE withholding in cents. */
  readonly monthlyWithholdingCents: number;
  /** Effective annual tax rate (0–1). */
  readonly effectiveRate: number;
}

/** Simplified progressive PAYE schedule (US-style brackets approximation). */
const TAX_BRACKETS: ReadonlyArray<{ readonly upTo: number; readonly rate: number }> = [
  { upTo: 11_000_00, rate: 0.10 },
  { upTo: 44_725_00, rate: 0.12 },
  { upTo: 95_375_00, rate: 0.22 },
  { upTo: 201_050_00, rate: 0.24 },
  { upTo: 503_750_00, rate: 0.32 },
  { upTo: Number.MAX_SAFE_INTEGER, rate: 0.37 },
];

export function computeTaxWithholding(annualIncomeCents: number): TaxWithholdingResult {
  if (annualIncomeCents <= 0) {
    return { taxableIncomeCents: 0, monthlyWithholdingCents: 0, effectiveRate: 0 };
  }

  let taxCents = 0;
  let prev = 0;
  for (const bracket of TAX_BRACKETS) {
    const slice = Math.min(annualIncomeCents, bracket.upTo) - prev;
    if (slice <= 0) break;
    taxCents += Math.round(slice * bracket.rate);
    prev = bracket.upTo;
    if (annualIncomeCents <= bracket.upTo) break;
  }

  const effectiveRate = annualIncomeCents > 0 ? taxCents / annualIncomeCents : 0;
  return {
    taxableIncomeCents: annualIncomeCents,
    monthlyWithholdingCents: Math.round(taxCents / 12),
    effectiveRate,
  };
}

/**
 * Deducts PAYE withholding from banking on the 1st of each game month.
 * Only deducts if the player has active employment income.
 */
export function applyMonthlyTaxWithholding(
  world: WorldInstance,
  currentDay: number,
): WorldInstance {
  if (currentDay !== 1) return world;
  if (world.banking.monthlySalaryCents <= 0) return world;

  const annualIncome = world.banking.monthlySalaryCents * 12;
  const { monthlyWithholdingCents } = computeTaxWithholding(annualIncome);
  if (monthlyWithholdingCents <= 0) return world;

  const tx: BankTransaction = {
    id: `tx-tax-${world.currentDate}-${world.clock.tickCount}`,
    date: world.currentDate,
    description: 'PAYE tax withholding',
    amountCents: -monthlyWithholdingCents,
    accountId: 'checking',
  };

  const banking: BankingState = {
    ...world.banking,
    accounts: world.banking.accounts.map((a) =>
      a.id === 'checking'
        ? { ...a, balanceCents: a.balanceCents - monthlyWithholdingCents }
        : a,
    ),
    transactions: [tx, ...world.banking.transactions].slice(0, 30),
  };

  return { ...world, banking };
}

// ---------------------------------------------------------------------------
// Healthcare illness roll
// ---------------------------------------------------------------------------

export interface IllnessRollResult {
  readonly becameIll: boolean;
  /** Health points lost if ill (0 if not ill). */
  readonly healthPenalty: number;
  /** Description of the illness event if triggered. */
  readonly description: string | null;
}

const ILLNESS_DESCRIPTIONS: readonly string[] = [
  'A seasonal flu keeps you bed-ridden for several days',
  'Food poisoning strikes after a dodgy takeaway',
  'A persistent cold drains your energy for the week',
  'An unexpected migraine derails your schedule',
  'A minor sports injury requires rest and recovery',
];

/**
 * Rolls for a random illness event.
 * Base chance is 0.5% per day, reduced by health score, raised by stress.
 */
export function rollIllness(world: WorldInstance, tickSeed: number): IllnessRollResult {
  const { health, stress } = world.player.traits;
  const baseChance = 0.005;
  const healthMod = (100 - health) / 2000;
  const stressMod = stress / 2000;
  const chance = baseChance + healthMod + stressMod;

  const roll = ((tickSeed * 2654435761) >>> 0) / 4294967296;
  if (roll > chance) {
    return { becameIll: false, healthPenalty: 0, description: null };
  }

  const idx = tickSeed % ILLNESS_DESCRIPTIONS.length;
  const description = ILLNESS_DESCRIPTIONS[idx] ?? ILLNESS_DESCRIPTIONS[0]!;
  const healthPenalty = Math.round(3 + ((tickSeed % 5)));

  return { becameIll: true, healthPenalty, description };
}

// ---------------------------------------------------------------------------
// Unemployment benefits eligibility
// ---------------------------------------------------------------------------

export interface UnemploymentBenefitResult {
  /** Whether the player qualifies for unemployment benefits this month. */
  readonly eligible: boolean;
  /** Monthly benefit amount in cents (0 if ineligible). */
  readonly monthlyBenefitCents: number;
  /** Reason text for eligibility or ineligibility. */
  readonly reason: string;
}

const BENEFIT_RATE = 0.40;
const MAX_WEEKS_ELIGIBLE = 26;
const MIN_PRIOR_SALARY_CENTS = 2_000_00;

/**
 * Determines unemployment benefit eligibility based on career history.
 * Benefits equal 40% of last salary, capped at 26 weeks.
 */
export function evaluateUnemploymentBenefits(career: CareerState): UnemploymentBenefitResult {
  if (career.status !== 'unemployed') {
    return { eligible: false, monthlyBenefitCents: 0, reason: 'Currently employed' };
  }

  if (!career.unemployedSinceDate) {
    return { eligible: false, monthlyBenefitCents: 0, reason: 'No unemployment start date recorded' };
  }

  if (career.yearsExperience < 1) {
    return {
      eligible: false,
      monthlyBenefitCents: 0,
      reason: 'Insufficient work history (minimum 1 year required)',
    };
  }

  const weeksUnemployed = career.applications.length > 0
    ? Math.max(0, Math.round(career.applications.length * 1.5))
    : 0;

  if (weeksUnemployed > MAX_WEEKS_ELIGIBLE) {
    return {
      eligible: false,
      monthlyBenefitCents: 0,
      reason: `Benefit period exhausted after ${MAX_WEEKS_ELIGIBLE} weeks`,
    };
  }

  const priorSalary = career.monthlySalaryCents > 0
    ? career.monthlySalaryCents
    : MIN_PRIOR_SALARY_CENTS;

  const monthlyBenefitCents = Math.round(priorSalary * BENEFIT_RATE);

  return {
    eligible: true,
    monthlyBenefitCents,
    reason: `Receiving ${(BENEFIT_RATE * 100).toFixed(0)}% of prior salary for up to ${MAX_WEEKS_ELIGIBLE} weeks`,
  };
}

/**
 * Credits unemployment benefits to the player's checking account on the 1st of the month.
 */
export function applyMonthlyUnemploymentBenefits(
  world: WorldInstance,
  currentDay: number,
): WorldInstance {
  if (currentDay !== 1) return world;

  const result = evaluateUnemploymentBenefits(world.career);
  if (!result.eligible || result.monthlyBenefitCents <= 0) return world;

  const tx: BankTransaction = {
    id: `tx-unemp-${world.currentDate}-${world.clock.tickCount}`,
    date: world.currentDate,
    description: 'Unemployment benefit payment',
    amountCents: result.monthlyBenefitCents,
    accountId: 'checking',
  };

  const banking: BankingState = {
    ...world.banking,
    accounts: world.banking.accounts.map((a) =>
      a.id === 'checking'
        ? { ...a, balanceCents: a.balanceCents + result.monthlyBenefitCents }
        : a,
    ),
    transactions: [tx, ...world.banking.transactions].slice(0, 30),
  };

  return { ...world, banking };
}
