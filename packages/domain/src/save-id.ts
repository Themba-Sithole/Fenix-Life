/** Branded identifier for a player save slot. */
export type SaveId = string & { readonly __brand: 'SaveId' };

export function createSaveId(value: string): SaveId {
  if (!value) {
    throw new Error('SaveId cannot be empty');
  }
  return value as SaveId;
}
