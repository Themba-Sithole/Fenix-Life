import { createDefaultBanking } from './banking.js';
import { createDefaultCitizen } from './citizen.js';
import { createCitizenId } from './citizen-id.js';
import { createDefaultCompany, type CompanyState } from './company.js';
import { createDefaultCareer, type CareerState } from './career.js';
import { createDefaultEconomy } from './economy.js';
import { createDefaultOrigin, type CharacterOrigin } from './locations.js';
import { createDefaultPortfolio, type PortfolioState } from './portfolio.js';
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
}): WorldInstance {
  const citizenId = createCitizenId(String(params.saveId));
  const playerName = params.playerName ?? 'Citizen';
  const origin = createDefaultOrigin(params.origin);
  const company = createDefaultCompany(playerName, params.background);
  const career = createDefaultCareer(playerName, params.background, company.name);
  const portfolio = createDefaultPortfolio({ companyStage: company.stage });
  const banking = {
    ...createDefaultBanking(),
    monthlySalaryCents: career.monthlySalaryCents,
  };

  return {
    saveId: params.saveId,
    schemaVersion: params.schemaVersion ?? 5,
    currentDate: params.currentDate ?? '2000-01-01',
    clock: {
      timeScale: 1,
      paused: false,
      tickCount: 0,
    },
    player: createDefaultCitizen(citizenId, playerName),
    banking,
    economy: createDefaultEconomy(),
    company,
    career,
    portfolio,
    events: [],
    origin,
  };
}
