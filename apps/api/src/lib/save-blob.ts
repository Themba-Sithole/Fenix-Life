import { createHash } from 'node:crypto';
import { gzipSync, gunzipSync } from 'node:zlib';

export function compressSavePayload(json: string): Buffer {
  return gzipSync(Buffer.from(json, 'utf8'));
}

export function decompressSavePayload(data: Buffer): string {
  return gunzipSync(data).toString('utf8');
}

export function checksumBuffer(data: Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}
