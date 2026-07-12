import { createCitizenId } from './citizen-id.js';
import { createBankingForBackground } from './banking.js';
import { createDefaultCitizen } from './citizen.js';
import { createDefaultCareer, careerJobSearchDefaults } from './career.js';
import { createDefaultCompany } from './company.js';
import { createDefaultEconomy, deriveCyclePhase } from './economy.js';
import { createDefaultOrigin } from './locations.js';
import { createDefaultPortfolio } from './portfolio.js';
import { createDefaultHousing } from './housing.js';
import { createDefaultTransportation } from './transportation.js';
import { createDefaultFamily } from './family.js';
import { createDefaultEducation } from './education.js';
import { ensureCompanyEmployees } from './employees.js';
import { formatOriginLocation } from './location-helpers.js';
import { FRESH_START_SCHEMA_VERSION } from './fresh-start.js';
import { createDefaultOnboarding } from './onboarding.js';
import { isLifePath, lifeStageForAge, type LifePath } from './life-path.js';
import type { WorldInstance } from './world-instance.js';

const MAX_EVENTS = 50;

/** Upgrade legacy save blobs to current playable state. */
export function ensureWorldV2(
  world: WorldInstance,
  playerName = 'Citizen',
  background = 'middle-class',
  lifePath: LifePath = 'undecided',
): WorldInstance {
  const player =
    world.player ??
    createDefaultCitizen(createCitizenId(String(world.saveId)), playerName);

  const economy = world.economy ?? createDefaultEconomy();
  const normalizedEconomy = {
    ...economy,
    cyclePhase: economy.cyclePhase ?? deriveCyclePhase(economy.techSectorIndex),
  };
  const events = world.events ?? [];
  const legacyOrigin = world.origin as Partial<{
    nationalityCode: string;
    countryCode: string;
    cityId: string;
    currency: string;
  }> | undefined;

  const origin = createDefaultOrigin({
    nationalityCode: legacyOrigin?.nationalityCode ?? legacyOrigin?.countryCode,
    countryCode: legacyOrigin?.countryCode,
    cityId: legacyOrigin?.cityId,
    currency: legacyOrigin?.currency,
  });

  const resolvedLifePath =
    world.lifePath && isLifePath(world.lifePath) ? world.lifePath : lifePath;
  const resolvedLifeStage = world.lifeStage ?? lifeStageForAge(player.ageYears);
  const isLegacySave = (world.schemaVersion ?? 1) < FRESH_START_SCHEMA_VERSION;
  const onboardingDefaults = createDefaultOnboarding(isLegacySave);
  const onboarding = world.onboarding
    ? {
        ...onboardingDefaults,
        ...world.onboarding,
        adolescencePlayCompleted:
          world.onboarding.adolescencePlayCompleted ?? onboardingDefaults.adolescencePlayCompleted,
        adolescenceChoices: world.onboarding.adolescenceChoices ?? onboardingDefaults.adolescenceChoices,
        homeTourCompleted: world.onboarding.homeTourCompleted ?? onboardingDefaults.homeTourCompleted,
      }
    : onboardingDefaults;

  const company =
    world.company === undefined
      ? createDefaultCompany(player.displayName, background)
      : world.company;

  const currentDate = world.currentDate ?? '2000-01-01';
  const careerBase = world.career ?? createDefaultCareer(player.displayName, background, company?.name);
  const career = {
    ...careerBase,
    ...careerJobSearchDefaults(careerBase, currentDate),
  };
  const portfolio =
    world.portfolio ??
    createDefaultPortfolio({ companyStage: company?.stage ?? 'startup' });
  const cityLabel = formatOriginLocation(origin);
  const housing =
    world.housing ??
    createDefaultHousing(cityLabel, background, company?.stage ?? 'startup');
  const transportation = world.transportation ?? createDefaultTransportation(background);
  const family = world.family ?? createDefaultFamily(player.displayName, background);
  const defaultBanking = createBankingForBackground(background);
  const banking = {
    ...(world.banking ?? defaultBanking),
    monthlySalaryCents: (world.career ?? career).monthlySalaryCents,
    creditScore: world.banking?.creditScore ?? defaultBanking.creditScore,
    activeLoan: world.banking?.activeLoan ?? null,
    familyCreditLineLimitCents: world.banking?.familyCreditLineLimitCents ?? null,
  };
  const education = world.education ?? createDefaultEducation(background);
  const employees =
    company === null
      ? world.employees ?? []
      : ensureCompanyEmployees(company, String(world.saveId), world.employees);

  return {
    ...world,
    schemaVersion: Math.max(world.schemaVersion ?? 1, FRESH_START_SCHEMA_VERSION),
    player,
    banking,
    economy: normalizedEconomy,
    company,
    career,
    portfolio,
    housing,
    transportation,
    family,
    education,
    employees,
    events: events.slice(0, MAX_EVENTS),
    origin,
    lifePath: resolvedLifePath,
    lifeStage: resolvedLifeStage,
    onboarding,
  };
}
