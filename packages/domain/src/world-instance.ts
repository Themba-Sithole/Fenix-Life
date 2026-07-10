import { createDefaultBanking } from './banking.js';
import { createDefaultCitizen } from './citizen.js';
import { createCitizenId } from './citizen-id.js';
import { createDefaultEconomy } from './economy.js';
import type { CharacterOrigin } from './locations.js';
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
  events: SimEvent[];
  origin: CharacterOrigin;
}

export function createWorldInstance(params: {
  saveId: SaveId;
  schemaVersion?: number;
  currentDate?: string;
  playerName?: string;
  origin?: Partial<CharacterOrigin>;
}): WorldInstance {
  const citizenId = createCitizenId(String(params.saveId));
  const origin: CharacterOrigin = {
    countryCode: params.origin?.countryCode ?? 'US',
    cityId: params.origin?.cityId ?? 'us-washington-d-c',
    currency: params.origin?.currency ?? 'USD',
  };

  return {
    saveId: params.saveId,
    schemaVersion: params.schemaVersion ?? 2,
    currentDate: params.currentDate ?? '2000-01-01',
    clock: {
      timeScale: 1,
      paused: false,
      tickCount: 0,
    },
    player: createDefaultCitizen(citizenId, params.playerName ?? 'Citizen'),
    banking: createDefaultBanking(),
    economy: createDefaultEconomy(),
    events: [],
    origin,
  };
}
