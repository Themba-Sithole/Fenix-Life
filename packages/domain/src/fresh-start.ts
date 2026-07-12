import { createBankingForBackground } from './banking.js';
import { createDefaultCitizen, type CitizenTraits } from './citizen.js';
import { createCitizenId } from './citizen-id.js';
import { createFreshStartCareer } from './career.js';
import { createDefaultEconomy } from './economy.js';
import { createFreshStartEducation } from './education.js';
import { createDefaultFamily } from './family.js';
import { createDefaultOrigin, type CharacterOrigin } from './locations.js';
import { formatOriginLocation } from './location-helpers.js';
import { createEmptyPortfolio } from './portfolio.js';
import { createFreshStartHousing } from './housing.js';
import { createFreshStartTransportation } from './transportation.js';
import {
  lifeStageForAge,
  type LifePath,
} from './life-path.js';
import { createDefaultOnboarding } from './onboarding.js';
import { createDefaultCivic } from './civic.js';
import { createEmptyDistrictVisits } from './city-districts.js';
import type { SaveId } from './save-id.js';
import type { TimeScale, WorldInstance } from './world-instance.js';

export type { LifePath, LifeStage } from './life-path.js';
export { isLifePath, lifePathLabel } from './life-path.js';

export const FRESH_START_SCHEMA_VERSION = 13;

const BACKGROUND_TRAIT_MODIFIERS: Record<string, Partial<CitizenTraits>> = {
  wealthy: { openness: 5, stress: 8 },
  'middle-class': { conscientiousness: 3, happiness: 2 },
  'working-class': { conscientiousness: 8, energy: 5 },
  orphan: { conscientiousness: 10, stress: 10, happiness: -5 },
  immigrant: { openness: 10, conscientiousness: 5 },
  'entrepreneur-family': { openness: 5, conscientiousness: 5, stress: 5 },
};

const BACKGROUND_MONTHLY_EXPENSES_CENTS: Record<string, number> = {
  wealthy: 2_500_00,
  'middle-class': 1_800_00,
  'working-class': 1_200_00,
  orphan: 800_00,
  immigrant: 1_400_00,
  'entrepreneur-family': 2_000_00,
};

/** Family credit line for wealthy backgrounds — not liquid cash (GDD §8.2). */
const WEALTHY_FAMILY_CREDIT_LINE_CENTS = 50_000_00;

/** Young-adult entry date: 18th birthday (GDD §4.4). */
export function deriveYoungAdultStartDate(birthday: string): string {
  const birth = new Date(`${birthday}T12:00:00`);
  if (Number.isNaN(birth.getTime())) {
    return '2000-01-01';
  }

  const start = new Date(birth);
  start.setFullYear(start.getFullYear() + 18);
  const year = start.getFullYear();
  const month = String(start.getMonth() + 1).padStart(2, '0');
  const day = String(start.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function applyBackgroundTraits(
  base: CitizenTraits,
  background: string,
): CitizenTraits {
  const modifier = BACKGROUND_TRAIT_MODIFIERS[background] ?? {};
  return {
    conscientiousness: clampTrait(base.conscientiousness + (modifier.conscientiousness ?? 0)),
    openness: clampTrait(base.openness + (modifier.openness ?? 0)),
    happiness: clampTrait(base.happiness + (modifier.happiness ?? 0)),
    health: base.health,
    energy: clampTrait(base.energy + (modifier.energy ?? 0)),
    stress: clampTrait(base.stress + (modifier.stress ?? 0)),
  };
}

function clampTrait(value: number): number {
  return Math.max(0, Math.min(100, value));
}

/**
 * Creates a sovereign world at Young Adult entry — unemployed, no company,
 * empty portfolio, no owned assets. Background supplies tradeoffs, not power (GDD §8).
 */
export function createFreshStartWorld(params: {
  saveId: SaveId;
  playerName?: string;
  background?: string;
  lifePath?: LifePath;
  origin?: Partial<CharacterOrigin>;
  avatarId?: string;
  gender?: string;
  birthday?: string;
  skinTone?: string;
  hairstyle?: string;
  schemaVersion?: number;
  currentDate?: string;
}): WorldInstance {
  const citizenId = createCitizenId(String(params.saveId));
  const playerName = params.playerName ?? 'Citizen';
  const background = params.background ?? 'middle-class';
  const lifePath = params.lifePath ?? 'undecided';
  const birthday = params.birthday ?? '1982-06-15';
  const currentDate = params.currentDate ?? deriveYoungAdultStartDate(birthday);
  const origin = createDefaultOrigin(params.origin);

  const playerBase = createDefaultCitizen(citizenId, playerName, {
    asOfDate: currentDate,
    birthday,
    avatarId: params.avatarId,
    gender: params.gender,
    skinTone: params.skinTone,
    hairstyle: params.hairstyle,
  });

  const player = {
    ...playerBase,
    traits: applyBackgroundTraits(playerBase.traits, background),
  };

  const career = createFreshStartCareer(background, lifePath, currentDate);
  const education = createFreshStartEducation(background, lifePath);
  const cityLabel = formatOriginLocation(origin);
  const housing = createFreshStartHousing(cityLabel);
  const transportation = createFreshStartTransportation();
  const portfolio = createEmptyPortfolio();
  const family = createDefaultFamily(playerName, background);

  const monthlyExpensesCents =
    BACKGROUND_MONTHLY_EXPENSES_CENTS[background] ??
    BACKGROUND_MONTHLY_EXPENSES_CENTS['middle-class']!;

  const bankingBase = createBankingForBackground(background);
  const banking = {
    ...bankingBase,
    monthlySalaryCents: career.monthlySalaryCents,
    monthlyExpensesCents,
    familyCreditLineLimitCents:
      background === 'wealthy' ? WEALTHY_FAMILY_CREDIT_LINE_CENTS : null,
  };

  return {
    saveId: params.saveId,
    schemaVersion: params.schemaVersion ?? FRESH_START_SCHEMA_VERSION,
    currentDate,
    clock: {
      timeScale: 1 as TimeScale,
      paused: false,
      tickCount: 0,
    },
    player,
    banking,
    economy: createDefaultEconomy(),
    company: null,
    career,
    portfolio,
    housing,
    transportation,
    family,
    education,
    employees: [],
    events: [],
    origin,
    lifePath,
    lifeStage: lifeStageForAge(player.ageYears),
    onboarding: createDefaultOnboarding(false),
    deathPending: null,
    civic: createDefaultCivic(),
    districtVisits: createEmptyDistrictVisits(),
  };
}
