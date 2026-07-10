import { formatOriginLocation } from './location-helpers.js';
import type { WorldInstance } from './world-instance.js';

export interface CityDistrict {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly activityLevel: number;
  readonly route?: string;
}

export function buildCityDistricts(world: WorldInstance): CityDistrict[] {
  const cityLabel = formatOriginLocation(world.origin);
  const economyBoost = Math.round((world.economy.techSectorIndex - 100) / 2);

  return [
    {
      id: 'downtown',
      name: 'Downtown',
      description: `${cityLabel} central business district`,
      activityLevel: clamp(55 + economyBoost, 20, 99),
    },
    {
      id: 'university',
      name: 'University',
      description: 'Education and research campus',
      activityLevel: clamp(45 + world.player.traits.openness / 3, 20, 99),
      route: '/education',
    },
    {
      id: 'hospital',
      name: 'Hospital',
      description: 'Healthcare and wellness services',
      activityLevel: clamp(40 + world.player.traits.health / 4, 20, 99),
    },
    {
      id: 'mall',
      name: 'Shopping Mall',
      description: 'Retail and lifestyle hub',
      activityLevel: clamp(50 + world.player.traits.happiness / 4, 20, 99),
    },
    {
      id: 'airport',
      name: 'Airport',
      description: 'Regional travel gateway',
      activityLevel: clamp(35 + economyBoost / 2, 20, 99),
    },
    {
      id: 'cafe',
      name: 'Café District',
      description: 'Social and networking quarter',
      activityLevel: clamp(48 + world.player.traits.openness / 2, 20, 99),
    },
    {
      id: 'tech',
      name: 'Tech District',
      description: `${world.company.name} sector activity`,
      activityLevel: clamp(60 + economyBoost, 20, 99),
      route: '/company',
    },
    {
      id: 'residential',
      name: 'Residential',
      description: 'Housing and neighborhood living',
      activityLevel: clamp(42 + world.family.members.length * 5, 20, 99),
      route: '/real-estate',
    },
  ];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
