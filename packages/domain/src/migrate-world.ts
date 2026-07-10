import { createCitizenId } from './citizen-id.js';
import { createDefaultBanking } from './banking.js';
import { createDefaultCitizen } from './citizen.js';
import { createDefaultCompany } from './company.js';
import { createDefaultEconomy } from './economy.js';
import { createDefaultOrigin } from './locations.js';
import type { WorldInstance } from './world-instance.js';

const MAX_EVENTS = 50;

/** Upgrade legacy save blobs to current playable state. */
export function ensureWorldV2(world: WorldInstance, playerName = 'Citizen'): WorldInstance {
  const player =
    world.player ??
    createDefaultCitizen(createCitizenId(String(world.saveId)), playerName);

  const banking = world.banking ?? createDefaultBanking();
  const economy = world.economy ?? createDefaultEconomy();
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

  return {
    ...world,
    schemaVersion: Math.max(world.schemaVersion ?? 1, 3),
    player,
    banking,
    economy,
    company,
    events: events.slice(0, MAX_EVENTS),
    origin,
  };
}
