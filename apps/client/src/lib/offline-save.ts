const OFFLINE_SAVE_PREFIX = 'fenix-offline-save-';

export function offlineSaveKey(saveId: string): string {
  return `${OFFLINE_SAVE_PREFIX}${saveId}`;
}

export function writeOfflineSave(saveId: string, blob: string): void {
  window.localStorage.setItem(offlineSaveKey(saveId), blob);
}

export function readOfflineSave(saveId: string): string | null {
  return window.localStorage.getItem(offlineSaveKey(saveId));
}

export function clearOfflineSave(saveId: string): void {
  window.localStorage.removeItem(offlineSaveKey(saveId));
}
