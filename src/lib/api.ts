/**
 * API base URL — set VITE_API_URL in .env (local) or Vercel env vars (production).
 */
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/v1';

export function getAuthToken(): string | null {
  return localStorage.getItem('fenix_auth_token');
}

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem('fenix_auth_token', token);
  } else {
    localStorage.removeItem('fenix_auth_token');
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
    throw new Error(body.error ?? `Request failed: ${response.status}`);
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
