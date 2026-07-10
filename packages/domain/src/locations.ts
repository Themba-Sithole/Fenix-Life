/** Shared location types for character origin (Doc 02, Doc 34). */
export interface City {
  readonly id: string;
  readonly name: string;
  readonly countryCode: string;
  readonly isCapital?: boolean;
}

/** Where the player starts and holds citizenship. */
export interface CharacterOrigin {
  /** Passport / citizenship country (ISO 3166-1 alpha-2). */
  readonly nationalityCode: string;
  /** Country the player lives in at game start. */
  readonly countryCode: string;
  readonly cityId: string;
  readonly currency: string;
}

export function createDefaultOrigin(overrides?: Partial<CharacterOrigin>): CharacterOrigin {
  return {
    nationalityCode: overrides?.nationalityCode ?? 'US',
    countryCode: overrides?.countryCode ?? 'US',
    cityId: overrides?.cityId ?? 'us-washington-d-c',
    currency: overrides?.currency ?? 'USD',
  };
}
