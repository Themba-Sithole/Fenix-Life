/** Branded identifier for a simulated citizen (player or AI). */
export type CitizenId = string & { readonly __brand: 'CitizenId' };

export function createCitizenId(value: string): CitizenId {
  if (!value) {
    throw new Error('CitizenId cannot be empty');
  }
  return value as CitizenId;
}
