/**
 * API client — Doc 25. View models only; no simulation logic in UI.
 */
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/v1';

const AUTH_TOKEN_KEY = 'fenix_auth_token';
const USER_KEY = 'fenix_user';
const ACTIVE_SAVE_KEY = 'fenix_active_save_id';

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  createdAt: string;
}

export interface SaveSummary {
  id: string;
  name: string;
  schemaVersion: number;
  worldSeed: string | null;
  lastPlayedAt: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User | null): void {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function getActiveSaveId(): string | null {
  return localStorage.getItem(ACTIVE_SAVE_KEY);
}

export function setActiveSaveId(saveId: string | null): void {
  if (saveId) {
    localStorage.setItem(ACTIVE_SAVE_KEY, saveId);
  } else {
    localStorage.removeItem(ACTIVE_SAVE_KEY);
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: response.statusText }));
    throw new ApiError(body.error ?? `Request failed: ${response.status}`, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL.replace(/\/v1$/, '')}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function registerUser(input: {
  email: string;
  password: string;
  displayName?: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function listSaves(): Promise<SaveSummary[]> {
  const data = await apiFetch<{ saves: SaveSummary[] }>('/saves');
  return data.saves;
}

export async function createSave(input: {
  name?: string;
  worldSeed?: string;
}): Promise<SaveSummary> {
  const data = await apiFetch<{ save: SaveSummary }>('/saves', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return data.save;
}

export async function getSave(saveId: string): Promise<SaveSummary> {
  const data = await apiFetch<{ save: SaveSummary }>(`/saves/${saveId}`);
  return data.save;
}

export async function touchSave(saveId: string): Promise<SaveSummary> {
  const data = await apiFetch<{ save: SaveSummary }>(`/saves/${saveId}/play`, {
    method: 'POST',
  });
  return data.save;
}

export async function renameSave(saveId: string, name: string): Promise<SaveSummary> {
  const data = await apiFetch<{ save: SaveSummary }>(`/saves/${saveId}`, {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });
  return data.save;
}

export async function uploadSaveBlob(saveId: string, blob: string): Promise<void> {
  await apiFetch(`/saves/${saveId}/blob`, {
    method: 'PUT',
    body: JSON.stringify({ blob }),
  });
}

export async function downloadSaveBlob(saveId: string): Promise<string> {
  const data = await apiFetch<{ blob: string }>(`/saves/${saveId}/blob`);
  return data.blob;
}

export async function deleteSave(saveId: string): Promise<void> {
  await apiFetch(`/saves/${saveId}`, { method: 'DELETE' });
}

export async function updateProfile(displayName: string): Promise<User> {
  const data = await apiFetch<{ user: User }>('/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify({ displayName }),
  });
  setStoredUser(data.user);
  return data.user;
}

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await apiFetch('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function deleteAccount(password: string): Promise<void> {
  await apiFetch('/auth/account', {
    method: 'DELETE',
    body: JSON.stringify({ password }),
  });
  clearSession();
}

export function clearSession(): void {
  setAuthToken(null);
  setStoredUser(null);
  setActiveSaveId(null);
}
