import type { SimEvent, WorldInstance } from '@fenix/domain';
import {
  applyMonthlyTaxWithholding,
  applyMonthlyUnemploymentBenefits,
  createDefaultCivic,
  evaluateUnemploymentBenefits,
  globalDomainEventBus,
  rollIllness,
  triggerDeathPending,
  evaluateMortalityRisk,
} from '@fenix/domain';
import { parseGameDate } from './time-engine.js';

export interface CivicStatus {
  /** Monthly PAYE withholding cents (0 if not employed). */
  readonly monthlyTaxWithholdingCents: number;
  /** Monthly unemployment benefit cents (0 if employed). */
  readonly monthlyUnemploymentBenefitCents: number;
  /** Whether the player is currently eligible for unemployment benefits. */
  readonly unemploymentEligible: boolean;
}

function appendSimEvent(events: SimEvent[], event: SimEvent): SimEvent[] {
  globalDomainEventBus.publish(event);
  return [event, ...events].slice(0, 50);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function civicOf(world: WorldInstance) {
  return world.civic ?? createDefaultCivic();
}

/**
 * Applies all civic-system ticks (tax, unemployment benefits, illness roll).
 * Called once per day from the tick-orchestrator.
 */
export function applyDailyCivicTick(world: WorldInstance): WorldInstance {
  const { day, month } = parseGameDate(world.currentDate);

  let nextWorld = world;
  const civic = civicOf(nextWorld);

  // Monthly settlement (day 1 only)
  nextWorld = applyMonthlyTaxWithholding(nextWorld, day);
  nextWorld = applyMonthlyUnemploymentBenefits(nextWorld, day);

  // Annual tax filing event — Jan 1 (BitLife Finance)
  if (day === 1 && month === 1) {
    const annualIncome = nextWorld.banking.monthlySalaryCents * 12;
    const withheldEstimate = Math.round(annualIncome * 0.15);
    const actualTax = Math.round(annualIncome * (annualIncome > 80_000_00 ? 0.18 : 0.12));
    const taxBalanceCents = withheldEstimate - actualTax;
    const alreadyFiled = civic.lastTaxYearFiled != null &&
      nextWorld.clock.tickCount - civic.lastTaxYearFiled < 300;

    if (!alreadyFiled) {
      nextWorld = {
        ...nextWorld,
        civic: {
          ...civicOf(nextWorld),
          taxBalanceCents,
          taxFilingOverdue: false,
        },
        events: appendSimEvent(nextWorld.events, {
          id: `evt-tax-annual-${nextWorld.clock.tickCount}`,
          tickCount: nextWorld.clock.tickCount,
          date: nextWorld.currentDate,
          category: 'finance',
          headline:
            taxBalanceCents >= 0
              ? `Annual tax filing due — estimated refund ${(taxBalanceCents / 100).toLocaleString()}`
              : `Annual tax filing due — balance owed ${(Math.abs(taxBalanceCents) / 100).toLocaleString()}`,
          tone: taxBalanceCents < 0 ? 'warning' : 'info',
        }),
      };
    }
  }

  // If tax filing ignored for 45+ days after Jan notice, gate
  if (
    civic.taxBalanceCents !== 0 &&
    civic.lastTaxYearFiled == null &&
    month >= 2 &&
    day === 15
  ) {
    nextWorld = {
      ...nextWorld,
      civic: { ...civicOf(nextWorld), taxFilingOverdue: true },
      events: appendSimEvent(nextWorld.events, {
        id: `evt-tax-overdue-${nextWorld.clock.tickCount}`,
        tickCount: nextWorld.clock.tickCount,
        date: nextWorld.currentDate,
        category: 'finance',
        headline: 'Tax filing overdue — resolve before time advances',
        tone: 'warning',
      }),
    };
  }

  // Emit unemployment benefit notification on day 1
  if (day === 1) {
    const benefitResult = evaluateUnemploymentBenefits(nextWorld.career);
    if (benefitResult.eligible && benefitResult.monthlyBenefitCents > 0) {
      const events = appendSimEvent(nextWorld.events, {
        id: `evt-unemp-benefit-${nextWorld.clock.tickCount}`,
        tickCount: nextWorld.clock.tickCount,
        date: nextWorld.currentDate,
        category: 'finance',
        headline: `Unemployment benefit credited — ${(benefitResult.monthlyBenefitCents / 100).toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}/month`,
        tone: 'info',
      });
      nextWorld = { ...nextWorld, events };
    }

    if (nextWorld.banking.monthlySalaryCents > 0) {
      const annualIncome = nextWorld.banking.monthlySalaryCents * 12;
      const effectiveRate = Math.round(
        ((annualIncome > 95_375_00 ? 0.22 : annualIncome > 44_725_00 ? 0.12 : 0.10) * 100),
      );
      if (effectiveRate > 0 && nextWorld.clock.tickCount % 30 < 2) {
        const events = appendSimEvent(nextWorld.events, {
          id: `evt-tax-${nextWorld.clock.tickCount}`,
          tickCount: nextWorld.clock.tickCount,
          date: nextWorld.currentDate,
          category: 'finance',
          headline: `PAYE withholding deducted — effective rate ~${effectiveRate}%`,
          tone: 'info',
        });
        nextWorld = { ...nextWorld, events };
      }
    }

    // Gov fines for unpaid tuition / defaulted loans
    let fineCents = 0;
    if ((nextWorld.education.tuitionOverdueDays ?? 0) > 14 && nextWorld.education.tuitionDueCents > 0) {
      fineCents += 250_00;
    }
    if (nextWorld.banking.activeLoan?.status === 'defaulted') {
      fineCents += 500_00;
    }
    if (fineCents > 0) {
      const accounts = nextWorld.banking.accounts.map((account) =>
        account.id === 'checking'
          ? { ...account, balanceCents: account.balanceCents - fineCents }
          : account,
      );
      nextWorld = {
        ...nextWorld,
        banking: {
          ...nextWorld.banking,
          accounts,
          transactions: [
            {
              id: `tx-fine-${nextWorld.currentDate}-${nextWorld.clock.tickCount}`,
              date: nextWorld.currentDate,
              description: 'Government collections fine',
              amountCents: -fineCents,
              accountId: 'checking',
            },
            ...nextWorld.banking.transactions,
          ].slice(0, 30),
        },
        events: appendSimEvent(nextWorld.events, {
          id: `evt-gov-fine-${nextWorld.clock.tickCount}`,
          tickCount: nextWorld.clock.tickCount,
          date: nextWorld.currentDate,
          category: 'finance',
          headline: `Government fine levied — ${(fineCents / 100).toLocaleString()}`,
          tone: 'warning',
        }),
      };
    }
  }

  // Daily illness roll — surfaces as pending choice (treat vs ignore)
  if (!civicOf(nextWorld).pendingIllness && nextWorld.clock.tickCount % 3 === 0) {
    const illnessResult = rollIllness(nextWorld, nextWorld.clock.tickCount);
    if (illnessResult.becameIll && illnessResult.description) {
      nextWorld = {
        ...nextWorld,
        civic: {
          ...civicOf(nextWorld),
          pendingIllness: {
            description: illnessResult.description,
            healthPenalty: illnessResult.healthPenalty,
            ignorePenalty: illnessResult.healthPenalty + 5,
            treatCostCents: 8_000_00 + illnessResult.healthPenalty * 50_00,
            sinceTick: nextWorld.clock.tickCount,
          },
        },
        player: {
          ...nextWorld.player,
          traits: {
            ...nextWorld.player.traits,
            health: clamp(
              nextWorld.player.traits.health - Math.round(illnessResult.healthPenalty / 2),
              0,
              100,
            ),
          },
        },
        events: appendSimEvent(nextWorld.events, {
          id: `evt-illness-${nextWorld.clock.tickCount}`,
          tickCount: nextWorld.clock.tickCount,
          date: nextWorld.currentDate,
          category: 'life',
          headline: `${illnessResult.description} — treat or ignore?`,
          tone: 'warning',
        }),
      };
    }
  }

  // Daily mortality roll — skips when death is already pending
  if (!nextWorld.deathPending) {
    const mortality = evaluateMortalityRisk(nextWorld);
    if (mortality.dailyChance > 0) {
      const roll =
        ((nextWorld.clock.tickCount * 2_654_435_761 + nextWorld.player.ageYears * 97) >>> 0) /
        4_294_967_296;
      if (roll < mortality.dailyChance) {
        nextWorld = triggerDeathPending(nextWorld);
      }
    }
  }

  return nextWorld;
}

/**
 * Returns a snapshot of the player's current civic status for display purposes.
 */
export function computeCivicStatus(world: WorldInstance): CivicStatus {
  const annualIncome = world.banking.monthlySalaryCents * 12;
  let monthlyTaxWithholdingCents = 0;
  if (annualIncome > 0) {
    const brackets = [
      { upTo: 11_000_00, rate: 0.10 },
      { upTo: 44_725_00, rate: 0.12 },
      { upTo: 95_375_00, rate: 0.22 },
      { upTo: 201_050_00, rate: 0.24 },
      { upTo: 503_750_00, rate: 0.32 },
      { upTo: Number.MAX_SAFE_INTEGER, rate: 0.37 },
    ];
    let tax = 0;
    let prev = 0;
    for (const bracket of brackets) {
      const slice = Math.min(annualIncome, bracket.upTo) - prev;
      if (slice <= 0) break;
      tax += Math.round(slice * bracket.rate);
      prev = bracket.upTo;
      if (annualIncome <= bracket.upTo) break;
    }
    monthlyTaxWithholdingCents = Math.round(tax / 12);
  }

  const benefitResult = evaluateUnemploymentBenefits(world.career);

  return {
    monthlyTaxWithholdingCents,
    monthlyUnemploymentBenefitCents: benefitResult.monthlyBenefitCents,
    unemploymentEligible: benefitResult.eligible,
  };
}
