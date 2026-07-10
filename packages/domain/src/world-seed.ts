import type { CharacterOrigin } from './locations.js';

/** Parse character-creation world seed: background:avatar:country:cityId:currency */
export function parseWorldSeed(worldSeed: string | null | undefined): {
  background: string;
  avatar: string;
  origin: CharacterOrigin;
} {
  const parts = worldSeed?.split(':') ?? [];
  const [background = 'middle-class', avatar = 'professional', countryCode = 'US', cityId = 'us-washington-d-c', currency = 'USD'] = parts;

  return {
    background,
    avatar,
    origin: { countryCode, cityId, currency },
  };
}
