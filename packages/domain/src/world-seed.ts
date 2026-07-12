import type { CharacterOrigin } from './locations.js';
import { createDefaultOrigin } from './locations.js';
import { isLifePath, type LifePath } from './life-path.js';

export interface ParsedWorldSeed {
  background: string;
  avatar: string;
  origin: CharacterOrigin;
  gender?: string;
  birthday?: string;
  skinTone?: string;
  hairstyle?: string;
  lifePath: LifePath;
}

export function encodeWorldSeed(input: {
  background: string;
  avatar: string;
  nationalityCode: string;
  countryCode: string;
  cityId: string;
  currency: string;
  gender?: string;
  birthday?: string;
  skinTone?: string;
  hairstyle?: string;
  lifePath?: LifePath;
}): string {
  return [
    input.background,
    input.avatar,
    input.nationalityCode,
    input.countryCode,
    input.cityId,
    input.currency,
    input.gender ?? '',
    input.birthday ?? '',
    input.skinTone ?? '',
    input.hairstyle ?? '',
    input.lifePath ?? 'undecided',
  ].join(':');
}

/** Parse character-creation world seed. */
export function parseWorldSeed(worldSeed: string | null | undefined): ParsedWorldSeed {
  const parts = worldSeed?.split(':') ?? [];

  if (parts.length >= 6) {
    const [
      background = 'middle-class',
      avatar = 'professional',
      nationalityCode = 'US',
      countryCode = 'US',
      cityId = 'us-washington-d-c',
      currency = 'USD',
      gender,
      birthday,
      skinTone,
      hairstyle,
      lifePathRaw,
    ] = parts;

    const lifePath = lifePathRaw && isLifePath(lifePathRaw) ? lifePathRaw : 'undecided';

    return {
      background,
      avatar,
      origin: createDefaultOrigin({ nationalityCode, countryCode, cityId, currency }),
      gender: gender || undefined,
      birthday: birthday || undefined,
      skinTone: skinTone || undefined,
      hairstyle: hairstyle || undefined,
      lifePath,
    };
  }

  const [background = 'middle-class', avatar = 'professional', countryCode = 'US', cityId = 'us-washington-d-c', currency = 'USD'] = parts;

  return {
    background,
    avatar,
    origin: createDefaultOrigin({
      nationalityCode: countryCode,
      countryCode,
      cityId,
      currency,
    }),
    lifePath: 'undecided',
  };
}
