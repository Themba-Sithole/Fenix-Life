import type { CharacterOrigin } from './locations.js';
import { createDefaultOrigin } from './locations.js';

/** Parse character-creation world seed. */
export function parseWorldSeed(worldSeed: string | null | undefined): {
  background: string;
  avatar: string;
  origin: CharacterOrigin;
} {
  const parts = worldSeed?.split(':') ?? [];

  if (parts.length >= 6) {
    const [background = 'middle-class', avatar = 'professional', nationalityCode = 'US', countryCode = 'US', cityId = 'us-washington-d-c', currency = 'USD'] = parts;
    return {
      background,
      avatar,
      origin: createDefaultOrigin({ nationalityCode, countryCode, cityId, currency }),
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
