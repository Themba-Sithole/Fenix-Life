import { createCitizenId } from './citizen-id.js';
import { createBankingForBackground } from './banking.js';
import { createDefaultCitizen } from './citizen.js';
import { createDefaultCareer } from './career.js';
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
import type { WorldInstance } from './world-instance.js';

const MAX_EVENTS = 50;

/** Upgrade legacy save blobs to current playable state. */
export function ensureWorldV2(
  world: WorldInstance,
  playerName = 'Citizen',
  background = 'middle-class',
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

  const company = world.company ?? createDefaultCompany(player.displayName);
  const career = world.career ?? createDefaultCareer(player.displayName, undefined, company.name);
  const portfolio = world.portfolio ?? createDefaultPortfolio({ companyStage: company.stage });
  const cityLabel = formatOriginLocation(origin);
  const housing =
    world.housing ??
    createDefaultHousing(cityLabel, undefined, company.stage);
  const transportation = world.transportation ?? createDefaultTransportation();
  const family = world.family ?? createDefaultFamily(player.displayName);
  const defaultBanking = createBankingForBackground(background);
  const banking = {
    ...(world.banking ?? defaultBanking),
    monthlySalaryCents: (world.career ?? career).monthlySalaryCents,
    creditScore: world.banking?.creditScore ?? defaultBanking.creditScore,
    activeLoan: world.banking?.activeLoan ?? null,
  };
  const education = world.education ?? createDefaultEducation();
  const employees = ensureCompanyEmployees(company, String(world.saveId), world.employees);

  return {
    ...world,
    schemaVersion: Math.max(world.schemaVersion ?? 1, 9),
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
  };
}
