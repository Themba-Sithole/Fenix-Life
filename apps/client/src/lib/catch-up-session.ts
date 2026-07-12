const CATCH_UP_SESSION_PREFIX = 'fenix-catchup-applied-';

export function catchUpSessionKey(saveId: string): string {
  return `${CATCH_UP_SESSION_PREFIX}${saveId}`;
}

export function markCatchUpApplied(saveId: string): void {
  sessionStorage.setItem(catchUpSessionKey(saveId), String(Date.now()));
}

export function isCatchUpApplied(saveId: string): boolean {
  return sessionStorage.getItem(catchUpSessionKey(saveId)) != null;
}

export function clearCatchUpApplied(saveId: string): void {
  sessionStorage.removeItem(catchUpSessionKey(saveId));
}
