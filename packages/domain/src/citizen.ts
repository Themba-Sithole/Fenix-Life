import type { CitizenId } from './citizen-id.js';

/** CDPS trait stub — Doc 16 Character Dynamic Personality System. */
export interface CitizenTraits {
  conscientiousness: number;
  openness: number;
  happiness: number;
  health: number;
  energy: number;
  stress: number;
}

export interface Citizen {
  id: CitizenId;
  displayName: string;
  ageYears: number;
  traits: CitizenTraits;
}

export function createDefaultCitizen(id: CitizenId, displayName: string): Citizen {
  return {
    id,
    displayName,
    ageYears: 22,
    traits: {
      conscientiousness: 60,
      openness: 55,
      happiness: 75,
      health: 85,
      energy: 70,
      stress: 25,
    },
  };
}
