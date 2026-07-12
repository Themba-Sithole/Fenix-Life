import type { CompanyState } from './company.js';
import type { LifePath, LifeStage } from './life-path.js';
import type { BankingState } from './banking.js';
import type { Citizen } from './citizen.js';
import type { EconomyState } from './economy.js';
import type { SimEvent } from './sim-event.js';
import type { SaveId } from './save-id.js';
import type { CareerState } from './career.js';
import type { PortfolioState } from './portfolio.js';
import type { HousingState } from './housing.js';
import type { TransportationState } from './transportation.js';
import type { FamilyState } from './family.js';
import type { EducationState } from './education.js';
import type { EmployeeRecord } from './employees.js';
import type { CharacterOrigin } from './locations.js';
import type { OnboardingState } from './onboarding.js';
import { createFreshStartWorld } from './fresh-start.js';

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
  /** Null until the player incorporates a company (fresh-start onboarding). */
  company: CompanyState | null;
  career: CareerState;
  portfolio: PortfolioState;
  housing: HousingState;
  transportation: TransportationState;
  family: FamilyState;
  education: EducationState;
  employees: EmployeeRecord[];
  events: SimEvent[];
  origin: CharacterOrigin;
  lifePath: LifePath;
  lifeStage: LifeStage;
  onboarding: OnboardingState;
}

/** @deprecated Use createFreshStartWorld for new saves. Kept as alias for compatibility. */
export function createWorldInstance(params: {
  saveId: SaveId;
  schemaVersion?: number;
  currentDate?: string;
  playerName?: string;
  background?: string;
  lifePath?: LifePath;
  origin?: Partial<CharacterOrigin>;
  avatarId?: string;
  gender?: string;
  birthday?: string;
  skinTone?: string;
  hairstyle?: string;
}): WorldInstance {
  return createFreshStartWorld(params);
}
