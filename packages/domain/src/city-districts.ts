import { formatOriginLocation } from './location-helpers.js';
import type { WorldInstance } from './world-instance.js';
import type { JobApplicationRecord } from './job-applications.js';
import { createJobApplication, JOB_APPLICATION_RESOLVE_DAYS } from './job-applications.js';
import { getJobListingById } from './job-market.js';
import { addDaysToDate } from './date-utils.js';
import { clampEmployeeStat } from './employees.js';
import { debitFromBestAccount } from './banking-actions.js';

export const DISTRICT_VISIT_COOLDOWN_TICKS = 7;

export type DistrictOpportunityKind =
  | 'job_lead'
  | 'side_hustle'
  | 'romance'
  | 'mugging'
  | 'flavor';

export interface DistrictOpportunity {
  readonly kind: DistrictOpportunityKind;
  readonly summary: string;
}

export interface DistrictVisitOutcome {
  /** Short description of what happens when you visit. */
  readonly summary: string;
  readonly happinessDelta: number;
  readonly energyDelta: number;
  readonly healthDelta: number;
  readonly opennessDelta: number;
  readonly stressDelta: number;
  /** Optional spend in cents (0 = free). */
  readonly costCents: number;
  readonly crimeRisk: number;
  readonly stressRisk: number;
  readonly rentBandLowCents: number;
  readonly rentBandHighCents: number;
  readonly jobPoolIds: readonly string[];
  readonly opportunityDeck: readonly DistrictOpportunityKind[];
}

export interface CityDistrict {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly activityLevel: number;
  readonly route?: string;
  readonly visitOutcome: DistrictVisitOutcome;
}

export interface DistrictVisitEntry {
  readonly lastVisitTick: number;
  readonly visitCount: number;
}

export type DistrictVisitHistory = Record<string, DistrictVisitEntry>;

export function createEmptyDistrictVisits(): DistrictVisitHistory {
  return {};
}

export function normalizeDistrictVisits(
  visits: DistrictVisitHistory | null | undefined,
): DistrictVisitHistory {
  return visits ?? {};
}

function seededRoll(seed: number): number {
  return ((seed * 2_654_435_761) >>> 0) / 4_294_967_296;
}

export function buildCityDistricts(world: WorldInstance): CityDistrict[] {
  const cityLabel = formatOriginLocation(world.origin);
  const economyBoost = Math.round((world.economy.techSectorIndex - 100) / 2);
  const isRush = world.economy.cyclePhase === 'expansion' || world.economy.cyclePhase === 'peak';
  const crimeBias = world.economy.crimeRiskBias ?? 0;

  return [
    {
      id: 'downtown',
      name: 'Downtown',
      description: `${cityLabel} central business district — ${isRush ? 'buzzing with deal-making' : 'steady foot traffic'}`,
      activityLevel: clamp(55 + economyBoost, 20, 99),
      visitOutcome: {
        summary: 'You network with business contacts and absorb the city pulse.',
        happinessDelta: 2,
        energyDelta: -2,
        healthDelta: 0,
        opennessDelta: 1,
        stressDelta: 1,
        costCents: 1_500,
        crimeRisk: 0.08 + crimeBias,
        stressRisk: 0.1,
        rentBandLowCents: 180_000,
        rentBandHighCents: 420_000,
        jobPoolIds: ['job-junior-analyst', 'job-product-specialist', 'job-customer-success'],
        opportunityDeck: ['job_lead', 'side_hustle', 'flavor', 'mugging'],
      },
    },
    {
      id: 'university',
      name: 'University',
      description: 'Education and research campus — lectures, labs and career fairs',
      activityLevel: clamp(45 + world.player.traits.openness / 3, 20, 99),
      route: '/education',
      visitOutcome: {
        summary: 'You audit a lecture and meet ambitious students.',
        happinessDelta: 1,
        energyDelta: -1,
        healthDelta: 0,
        opennessDelta: 3,
        stressDelta: 0,
        costCents: 0,
        crimeRisk: 0.03 + crimeBias * 0.5,
        stressRisk: 0.05,
        rentBandLowCents: 90_000,
        rentBandHighCents: 200_000,
        jobPoolIds: ['job-graduate-trainee', 'job-retail-associate'],
        opportunityDeck: ['job_lead', 'romance', 'flavor'],
      },
    },
    {
      id: 'hospital',
      name: 'Hospital',
      description: 'Healthcare and wellness services — check-ups, pharmacy, gym',
      activityLevel: clamp(40 + world.player.traits.health / 4, 20, 99),
      visitOutcome: {
        summary: 'A quick check-up leaves you feeling healthier and reassured.',
        happinessDelta: 1,
        energyDelta: -2,
        healthDelta: 3,
        opennessDelta: 0,
        stressDelta: -2,
        costCents: 5_000,
        crimeRisk: 0.02,
        stressRisk: 0.08,
        rentBandLowCents: 120_000,
        rentBandHighCents: 280_000,
        jobPoolIds: [],
        opportunityDeck: ['flavor', 'side_hustle'],
      },
    },
    {
      id: 'mall',
      name: 'Shopping Mall',
      description: 'Retail and lifestyle hub — brands, food court, entertainment',
      activityLevel: clamp(50 + world.player.traits.happiness / 4, 20, 99),
      visitOutcome: {
        summary: 'Retail therapy boosts your mood, though your wallet feels lighter.',
        happinessDelta: 4,
        energyDelta: -3,
        healthDelta: 0,
        opennessDelta: 0,
        stressDelta: -1,
        costCents: 8_000,
        crimeRisk: 0.12 + crimeBias,
        stressRisk: 0.06,
        rentBandLowCents: 100_000,
        rentBandHighCents: 250_000,
        jobPoolIds: ['job-retail-associate', 'job-warehouse'],
        opportunityDeck: ['side_hustle', 'mugging', 'romance', 'flavor'],
      },
    },
    {
      id: 'airport',
      name: 'Airport',
      description: 'Regional travel gateway — domestic and international connections',
      activityLevel: clamp(35 + economyBoost / 2, 20, 99),
      visitOutcome: {
        summary: 'People-watching at the terminal sparks wanderlust and broadens your perspective.',
        happinessDelta: 2,
        energyDelta: -4,
        healthDelta: 0,
        opennessDelta: 2,
        stressDelta: 2,
        costCents: 0,
        crimeRisk: 0.05 + crimeBias * 0.5,
        stressRisk: 0.15,
        rentBandLowCents: 0,
        rentBandHighCents: 0,
        jobPoolIds: ['job-warehouse'],
        opportunityDeck: ['job_lead', 'flavor', 'mugging'],
      },
    },
    {
      id: 'cafe',
      name: 'Café District',
      description: 'Social and networking quarter — artisan coffee, co-working, meet-ups',
      activityLevel: clamp(48 + world.player.traits.openness / 2, 20, 99),
      visitOutcome: {
        summary: 'You have a great conversation over coffee and feel recharged.',
        happinessDelta: 3,
        energyDelta: -1,
        healthDelta: 0,
        opennessDelta: 2,
        stressDelta: -1,
        costCents: 2_000,
        crimeRisk: 0.04,
        stressRisk: 0.04,
        rentBandLowCents: 140_000,
        rentBandHighCents: 320_000,
        jobPoolIds: ['job-customer-success', 'job-junior-analyst'],
        opportunityDeck: ['romance', 'job_lead', 'side_hustle', 'flavor'],
      },
    },
    {
      id: 'tech',
      name: 'Tech District',
      description: world.company
        ? `${world.company.name} sector — investor demos, pitch nights and co-working`
        : 'Startup and tech sector — pitch nights, demos and accelerator events',
      activityLevel: clamp(60 + economyBoost, 20, 99),
      route: '/company',
      visitOutcome: {
        summary: 'A pitch night inspires new ideas and surfaces potential partners.',
        happinessDelta: 2,
        energyDelta: -2,
        healthDelta: 0,
        opennessDelta: 2,
        stressDelta: 1,
        costCents: 0,
        crimeRisk: 0.06 + crimeBias * 0.5,
        stressRisk: 0.12,
        rentBandLowCents: 200_000,
        rentBandHighCents: 480_000,
        jobPoolIds: ['job-product-specialist', 'job-customer-success', 'job-junior-analyst'],
        opportunityDeck: ['job_lead', 'side_hustle', 'flavor'],
      },
    },
    {
      id: 'residential',
      name: 'Residential',
      description: 'Housing and neighborhood living — parks, schools, community events',
      activityLevel: clamp(42 + world.family.members.length * 5, 20, 99),
      route: '/real-estate',
      visitOutcome: {
        summary: 'A quiet walk through the neighborhood clears your head.',
        happinessDelta: 2,
        energyDelta: 1,
        healthDelta: 1,
        opennessDelta: 0,
        stressDelta: -2,
        costCents: 0,
        crimeRisk: 0.07 + crimeBias,
        stressRisk: 0.03,
        rentBandLowCents: 80_000,
        rentBandHighCents: 220_000,
        jobPoolIds: ['job-retail-associate'],
        opportunityDeck: ['romance', 'flavor', 'mugging'],
      },
    },
  ];
}

export function getDistrictById(world: WorldInstance, districtId: string): CityDistrict | undefined {
  return buildCityDistricts(world).find((district) => district.id === districtId);
}

export function districtCooldownRemaining(
  world: WorldInstance,
  districtId: string,
): number {
  const entry = world.districtVisits?.[districtId];
  if (!entry) {
    return 0;
  }
  const elapsed = world.clock.tickCount - entry.lastVisitTick;
  return Math.max(0, DISTRICT_VISIT_COOLDOWN_TICKS - elapsed);
}

function pickOpportunity(
  deck: readonly DistrictOpportunityKind[],
  seed: number,
): DistrictOpportunityKind {
  if (deck.length === 0) {
    return 'flavor';
  }
  const index = Math.floor(seededRoll(seed) * deck.length) % deck.length;
  return deck[index] ?? 'flavor';
}

export interface ApplyDistrictVisitResult {
  readonly world: WorldInstance;
  readonly opportunity: DistrictOpportunity;
}

/**
 * Visit a district with cooldown + one opportunity card that can change money/career/traits.
 */
export function applyDistrictVisit(
  world: WorldInstance,
  districtId: string,
): ApplyDistrictVisitResult {
  const district = getDistrictById(world, districtId);
  if (!district) {
    throw new Error('Unknown district');
  }

  const cooldown = districtCooldownRemaining(world, districtId);
  if (cooldown > 0) {
    throw new Error(`Too soon to revisit ${district.name} — ready in ${cooldown} day(s)`);
  }

  const { visitOutcome } = district;
  let nextWorld = world;

  if (visitOutcome.costCents > 0) {
    nextWorld = {
      ...nextWorld,
      banking: debitFromBestAccount(
        nextWorld.banking,
        visitOutcome.costCents,
        nextWorld.currentDate,
        `Visit — ${district.name}`,
      ),
    };
  }

  const seed = world.clock.tickCount * 31 + districtId.length * 97;
  const kind = pickOpportunity(visitOutcome.opportunityDeck, seed);
  let opportunity: DistrictOpportunity = { kind, summary: visitOutcome.summary };
  const traits = { ...nextWorld.player.traits };
  traits.happiness = clampEmployeeStat(traits.happiness + visitOutcome.happinessDelta);
  traits.energy = clampEmployeeStat(traits.energy + visitOutcome.energyDelta);
  traits.health = clampEmployeeStat(traits.health + visitOutcome.healthDelta);
  traits.openness = clampEmployeeStat(traits.openness + visitOutcome.opennessDelta);
  traits.stress = clampEmployeeStat(traits.stress + visitOutcome.stressDelta);

  const crimeRoll = seededRoll(seed + 11);
  if (crimeRoll < visitOutcome.crimeRisk || kind === 'mugging') {
    const loss = Math.round(2_500 + seededRoll(seed + 3) * 7_500);
    try {
      nextWorld = {
        ...nextWorld,
        banking: debitFromBestAccount(
          nextWorld.banking,
          loss,
          nextWorld.currentDate,
          `Mugging — ${district.name}`,
        ),
      };
    } catch {
      // Broke — stress only
    }
    traits.stress = clampEmployeeStat(traits.stress + 12);
    traits.happiness = clampEmployeeStat(traits.happiness - 8);
    opportunity = {
      kind: 'mugging',
      summary: `You were mugged near ${district.name} — cash and nerves hit.`,
    };
  } else if (kind === 'job_lead' && visitOutcome.jobPoolIds.length > 0) {
    const listingId =
      visitOutcome.jobPoolIds[Math.floor(seededRoll(seed + 5) * visitOutcome.jobPoolIds.length)] ??
      visitOutcome.jobPoolIds[0]!;
    const listing = getJobListingById(listingId);
    if (listing && nextWorld.career.status === 'unemployed') {
      const resolveOnDate = addDaysToDate(nextWorld.currentDate, JOB_APPLICATION_RESOLVE_DAYS);
      const app = createJobApplication({
        listing,
        appliedDate: nextWorld.currentDate,
        matchScore: 55 + Math.floor(seededRoll(seed + 7) * 30),
        status: 'pending',
        idSuffix: nextWorld.clock.tickCount,
        resolveOnDate,
      });
      nextWorld = {
        ...nextWorld,
        career: {
          ...nextWorld.career,
          applications: [...(nextWorld.career.applications ?? []), app].slice(0, 8) as JobApplicationRecord[],
        },
      };
      opportunity = {
        kind: 'job_lead',
        summary: `A contact at ${district.name} put in a word — applied to ${listing.title}.`,
      };
    } else {
      opportunity = {
        kind: 'job_lead',
        summary: `You overheard a hiring tip at ${district.name}, but nothing stuck.`,
      };
    }
  } else if (kind === 'side_hustle') {
    const earn = Math.round(1_500 + seededRoll(seed + 9) * 6_000);
    const accounts = nextWorld.banking.accounts.map((account) =>
      account.id === 'checking'
        ? { ...account, balanceCents: account.balanceCents + earn }
        : account,
    );
    nextWorld = {
      ...nextWorld,
      banking: {
        ...nextWorld.banking,
        accounts,
        transactions: [
          {
            id: `tx-side-${nextWorld.currentDate}-${nextWorld.clock.tickCount}`,
            date: nextWorld.currentDate,
            description: `Side hustle — ${district.name}`,
            amountCents: earn,
            accountId: 'checking',
          },
          ...nextWorld.banking.transactions,
        ].slice(0, 30),
      },
    };
    traits.energy = clampEmployeeStat(traits.energy - 5);
    opportunity = {
      kind: 'side_hustle',
      summary: `A quick gig near ${district.name} paid ${(earn / 100).toLocaleString()}.`,
    };
  } else if (kind === 'romance' && nextWorld.family.members.length > 0) {
    const memberIndex = Math.floor(seededRoll(seed + 13) * nextWorld.family.members.length);
    const members = nextWorld.family.members.map((member, index) =>
      index === memberIndex
        ? { ...member, happiness: clampEmployeeStat(member.happiness + 5) }
        : member,
    );
    nextWorld = { ...nextWorld, family: { ...nextWorld.family, members } };
    traits.happiness = clampEmployeeStat(traits.happiness + 3);
    opportunity = {
      kind: 'romance',
      summary: `A warm moment with ${members[memberIndex]?.name ?? 'family'} after visiting ${district.name}.`,
    };
  }

  const prior = nextWorld.districtVisits?.[districtId];
  const districtVisits: DistrictVisitHistory = {
    ...nextWorld.districtVisits,
    [districtId]: {
      lastVisitTick: nextWorld.clock.tickCount,
      visitCount: (prior?.visitCount ?? 0) + 1,
    },
  };

  nextWorld = {
    ...nextWorld,
    districtVisits,
    player: { ...nextWorld.player, traits },
    events: [
      {
        id: `evt-visit-${districtId}-${nextWorld.clock.tickCount}`,
        tickCount: nextWorld.clock.tickCount,
        date: nextWorld.currentDate,
        category: 'life' as const,
        headline: `Visited ${district.name} — ${opportunity.summary}`,
        tone: opportunity.kind === 'mugging' ? ('warning' as const) : ('info' as const),
      },
      ...nextWorld.events,
    ].slice(0, 50),
  };

  return { world: nextWorld, opportunity };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
