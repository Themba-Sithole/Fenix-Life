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
  avatarId?: string;
  gender?: string;
  skinTone?: string;
  hairstyle?: string;
  birthday?: string;
}

export function ageYearsFromBirthday(birthday: string, asOfDate: string): number {
  const birth = new Date(`${birthday}T12:00:00`);
  const asOf = new Date(`${asOfDate}T12:00:00`);
  if (Number.isNaN(birth.getTime()) || Number.isNaN(asOf.getTime())) {
    return 22;
  }

  let age = asOf.getFullYear() - birth.getFullYear();
  const monthDelta = asOf.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && asOf.getDate() < birth.getDate())) {
    age -= 1;
  }

  return Math.max(18, Math.min(80, age));
}

export function createDefaultCitizen(
  id: CitizenId,
  displayName: string,
  options?: {
    birthday?: string;
    asOfDate?: string;
    avatarId?: string;
    gender?: string;
    skinTone?: string;
    hairstyle?: string;
  },
): Citizen {
  const asOfDate = options?.asOfDate ?? '2000-01-01';
  const ageYears = options?.birthday
    ? ageYearsFromBirthday(options.birthday, asOfDate)
    : 22;

  return {
    id,
    displayName,
    ageYears,
    traits: {
      conscientiousness: 60,
      openness: 55,
      happiness: 75,
      health: 85,
      energy: 70,
      stress: 25,
    },
    avatarId: options?.avatarId,
    gender: options?.gender,
    skinTone: options?.skinTone,
    hairstyle: options?.hairstyle,
    birthday: options?.birthday,
  };
}
