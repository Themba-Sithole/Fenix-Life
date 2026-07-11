import type { CharacterOrigin } from './locations.js';
import { createDefaultOrigin } from './locations.js';

export interface ParsedWorldSeed {
  background: string;
  avatar: string;
  origin: CharacterOrigin;
  gender?: string;
  birthday?: string;
  skinTone?: string;
  hairstyle?: string;
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
    ] = parts;

    return {
      background,
      avatar,
      origin: createDefaultOrigin({ nationalityCode, countryCode, cityId, currency }),
      gender,
      birthday,
      skinTone,
      hairstyle,
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
  };
}
