import { createSaveId, type WorldInstance } from '@fenix/domain';
import { SAVE_BLOB_FORMAT_VERSION, SAVE_SCHEMA_VERSION } from './constants.js';

export interface SaveBlobV1 {
  formatVersion: typeof SAVE_BLOB_FORMAT_VERSION;
  schemaVersion: number;
  savedAt: string;
  world: WorldInstance;
}

export function createSaveBlobV1(world: WorldInstance): SaveBlobV1 {
  return {
    formatVersion: SAVE_BLOB_FORMAT_VERSION,
    schemaVersion: world.schemaVersion ?? SAVE_SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    world,
  };
}

export function serializeSaveBlobV1(blob: SaveBlobV1): string {
  return JSON.stringify(blob);
}

export function parseSaveBlobV1(raw: string): SaveBlobV1 {
  const parsed = JSON.parse(raw) as SaveBlobV1;

  if (parsed.formatVersion !== SAVE_BLOB_FORMAT_VERSION) {
    throw new Error(`Unsupported save format version: ${parsed.formatVersion}`);
  }

  if (!parsed.world?.saveId || !parsed.world.currentDate) {
    throw new Error('Invalid save blob: missing world state');
  }

  parsed.world.saveId = createSaveId(String(parsed.world.saveId));
  return parsed;
}
