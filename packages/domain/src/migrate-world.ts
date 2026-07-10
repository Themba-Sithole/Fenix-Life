import { createCitizenId } from './citizen-id.js';
import { createDefaultBanking } from './banking.js';
import { createDefaultCitizen } from './citizen.js';
import { createDefaultEconomy } from './economy.js';
import type { WorldInstance } from './world-instance.js';

const MAX_EVENTS = 50;

/** Upgrade legacy v1 world blobs to schema v2 playable state. */
export function ensureWorldV2(world: WorldInstance, playerName = 'Citizen'): WorldInstance {
  const player =
    world.player ??
    createDefaultCitizen(createCitizenId(String(world.saveId)), playerName);

  const banking = world.banking ?? createDefaultBanking();
  const economy = world.economy ?? createDefaultEconomy();
  const events = world.events ?? [];
  const origin = world.origin ?? {
    countryCode: 'US',
    cityId: 'us-washington-d-c',
    currency: 'USD',
  };

  return {
    ...world,
    schemaVersion: Math.max(world.schemaVersion ?? 1, 2),
    player,
    banking,
    economy,
    events: events.slice(0, MAX_EVENTS),
    origin,
  };
}
