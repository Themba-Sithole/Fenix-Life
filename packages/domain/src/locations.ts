/** Shared location types for character origin (Doc 02, Doc 34). */
export interface City {
  readonly id: string;
  readonly name: string;
  readonly countryCode: string;
  readonly isCapital?: boolean;
}

export interface CharacterOrigin {
  readonly countryCode: string;
  readonly cityId: string;
  readonly currency: string;
}
