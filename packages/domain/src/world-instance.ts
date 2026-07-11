import { createBankingForBackground } from './banking.js';
import { createDefaultCitizen } from './citizen.js';
import { createCitizenId } from './citizen-id.js';
import { createDefaultCompany, type CompanyState } from './company.js';
import { createDefaultCareer, type CareerState } from './career.js';
import { createDefaultEconomy } from './economy.js';
import { createDefaultOrigin, type CharacterOrigin } from './locations.js';
import { createDefaultPortfolio, type PortfolioState } from './portfolio.js';
import { createDefaultHousing, type HousingState } from './housing.js';
import { createDefaultTransportation, type TransportationState } from './transportation.js';
import { createDefaultFamily, type FamilyState } from './family.js';
import { createDefaultEducation, type EducationState } from './education.js';
import {
  ensureCompanyEmployees,
  generateCompanyEmployees,
  type EmployeeRecord,
} from './employees.js';
import { formatOriginLocation } from './location-helpers.js';
import type { BankingState } from './banking.js';
import type { Citizen } from './citizen.js';
import type { EconomyState } from './economy.js';
import type { SimEvent } from './sim-event.js';
import type { SaveId } from './save-id.js';

/** Game clock speed multiplier (Doc 17). */
export type TimeScale = 0 | 1 | 2 | 5;

/** Root aggregate for authoritative simulation state (Doc 26 save blob v1). */
export interface WorldInstance {
  saveId: SaveId;
  schemaVersion: number;
  currentDate: string;
  clock: {
    timeScale: TimeScale;
    paused: boolean;
    tickCount: number;
  };
  player: Citizen;
  banking: BankingState;
  economy: EconomyState;
  company: CompanyState;
  career: CareerState;
  portfolio: PortfolioState;
  housing: HousingState;
  transportation: TransportationState;
  family: FamilyState;
  education: EducationState;
  employees: EmployeeRecord[];
  events: SimEvent[];
  origin: CharacterOrigin;
}

export function createWorldInstance(params: {
  saveId: SaveId;
  schemaVersion?: number;
  currentDate?: string;
  playerName?: string;
  background?: string;
  origin?: Partial<CharacterOrigin>;
  avatarId?: string;
  gender?: string;
  birthday?: string;
  skinTone?: string;
  hairstyle?: string;
}): WorldInstance {
  const citizenId = createCitizenId(String(params.saveId));
  const playerName = params.playerName ?? 'Citizen';
  const currentDate = params.currentDate ?? '2000-01-01';
  const origin = createDefaultOrigin(params.origin);
  const company = createDefaultCompany(playerName, params.background);
  const career = createDefaultCareer(playerName, params.background, company.name);
  const portfolio = createDefaultPortfolio({ companyStage: company.stage });
  const cityLabel = formatOriginLocation(origin);
  const housing = createDefaultHousing(cityLabel, params.background, company.stage);
  const transportation = createDefaultTransportation(params.background);
  const family = createDefaultFamily(playerName, params.background);
  const education = createDefaultEducation(params.background);
  const employees = generateCompanyEmployees(company, String(params.saveId), 8);
  const banking = {
    ...createBankingForBackground(params.background),
    monthlySalaryCents: career.monthlySalaryCents,
  };

  return {
    saveId: params.saveId,
    schemaVersion: params.schemaVersion ?? 9,
    currentDate,
    clock: {
      timeScale: 1,
      paused: false,
      tickCount: 0,
    },
    player: createDefaultCitizen(citizenId, playerName, {
      asOfDate: currentDate,
      birthday: params.birthday,
      avatarId: params.avatarId,
      gender: params.gender,
      skinTone: params.skinTone,
      hairstyle: params.hairstyle,
    }),
    banking,
    economy: createDefaultEconomy(),
    company,
    career,
    portfolio,
    housing,
    transportation,
    family,
    education,
    employees,
    events: [],
    origin,
  };
}
