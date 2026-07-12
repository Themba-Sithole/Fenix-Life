export type StaffRole = 'SUPPORT' | 'MODERATOR' | 'LIVEOPS' | 'ADMIN';

export interface AdminUser {
  id: string;
  email: string;
  displayName: string | null;
  role: StaffRole | 'PLAYER';
  createdAt: string;
}

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/v1';

const TOKEN_KEY = 'fenix_admin_token';
const USER_KEY = 'fenix_admin_user';

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminSession(user: AdminUser | null, token: string | null): void {
  if (user && token) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export function getStoredAdminUser(): AdminUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function isStaffUser(user: AdminUser | null): user is AdminUser & { role: StaffRole } {
  return user !== null && user.role !== 'PLAYER';
}

export class AdminApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'AdminApiError';
  }
}

export async function adminFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: response.statusText }));
    throw new AdminApiError(body.error ?? `Request failed: ${response.status}`, response.status);
  }

  return response.json() as Promise<T>;
}

export async function adminLogin(email: string, password: string): Promise<{ user: AdminUser; token: string }> {
  const data = await adminFetch<{ user: AdminUser; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (!isStaffUser(data.user)) {
    throw new AdminApiError('Staff access required', 403);
  }

  return data as { user: AdminUser & { role: StaffRole }; token: string };
}

export interface DashboardMetrics {
  apiStatus: string;
  userCount: number;
  pendingModeration: number;
  saveErrors24h: number;
  activePlayers24h: number;
}

export interface AccountSummary {
  id: string;
  email: string;
  displayName: string | null;
  role: string;
  suspended: boolean;
  createdAt: string;
  updatedAt: string;
  saveCount: number;
}

export interface AuditEntry {
  id: string;
  actorId: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
  actor: {
    id: string;
    email: string;
    displayName: string | null;
    role: string;
  };
}

export async function fetchMetrics(): Promise<DashboardMetrics> {
  return adminFetch('/admin/metrics');
}

export async function fetchHealth(): Promise<{ database: string; redis: string }> {
  return adminFetch('/admin/metrics/health');
}

export async function searchAccounts(q: string): Promise<AccountSummary[]> {
  const params = q ? `?q=${encodeURIComponent(q)}` : '';
  const data = await adminFetch<{ accounts: AccountSummary[] }>(`/admin/accounts${params}`);
  return data.accounts;
}

export async function fetchAccount(id: string) {
  return adminFetch<{ account: AccountSummary & { saves: SaveInspectSummary[] } }>(`/admin/accounts/${id}`);
}

export async function suspendAccount(id: string, suspended: boolean) {
  return adminFetch<{ account: AccountSummary }>(`/admin/accounts/${id}/suspend`, {
    method: 'POST',
    body: JSON.stringify({ suspended }),
  });
}

export interface SaveInspectSummary {
  id: string;
  name: string;
  schemaVersion: number;
  worldSeed: string | null;
  blobSizeBytes: number | null;
  blobChecksum: string | null;
  lastPlayedAt: string;
  createdAt: string;
  updatedAt?: string;
}

export async function inspectSave(saveId: string) {
  return adminFetch<{
    save: SaveInspectSummary & {
      userId: string;
      hasBlob: boolean;
      blobUpdatedAt: string | null;
      owner: { id: string; email: string; displayName: string | null; suspended: boolean };
    };
  }>(`/admin/saves/${saveId}/inspect`);
}

export async function fetchAuditLog(params: { q?: string; action?: string; limit?: number }) {
  const search = new URLSearchParams();
  if (params.q) search.set('q', params.q);
  if (params.action) search.set('action', params.action);
  if (params.limit) search.set('limit', String(params.limit));
  const qs = search.toString();
  return adminFetch<{ entries: AuditEntry[]; limit: number; offset: number }>(
    `/admin/audit-log${qs ? `?${qs}` : ''}`,
  );
}

export type ModerationItemStatus = 'pending' | 'resolved' | 'escalated';
export type ModerationItemType = 'display_name' | 'company_name' | 'chat_message' | 'save_content';

export interface ModerationItem {
  id: string;
  type: ModerationItemType;
  status: ModerationItemStatus;
  reportedContent: string;
  reportedByUserId: string | null;
  targetUserId: string;
  reason: string;
  createdAt: string;
  resolvedAt: string | null;
  resolvedByAdminId: string | null;
}

export async function fetchModerationQueue(status?: ModerationItemStatus): Promise<ModerationItem[]> {
  const qs = status ? `?status=${status}` : '';
  const data = await adminFetch<{ queue: ModerationItem[]; count: number }>(
    `/admin/moderation/queue${qs}`,
  );
  return data.queue;
}

export async function resolveModerationItem(itemId: string): Promise<ModerationItem> {
  const data = await adminFetch<{ item: ModerationItem }>(
    `/admin/moderation/queue/${itemId}/resolve`,
    { method: 'POST' },
  );
  return data.item;
}

export async function escalateModerationItem(itemId: string): Promise<ModerationItem> {
  const data = await adminFetch<{ item: ModerationItem }>(
    `/admin/moderation/queue/${itemId}/escalate`,
    { method: 'POST' },
  );
  return data.item;
}

export interface FeatureFlag {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  enabledForPercent: number;
  updatedAt: string;
  updatedBy: string | null;
}

export async function fetchFeatureFlags(): Promise<FeatureFlag[]> {
  const data = await adminFetch<{ flags: FeatureFlag[]; count: number }>('/admin/feature-flags');
  return data.flags;
}

export async function updateFeatureFlag(
  key: string,
  patch: Partial<Pick<FeatureFlag, 'enabled' | 'enabledForPercent'>>,
): Promise<FeatureFlag> {
  const data = await adminFetch<{ flag: FeatureFlag }>(`/admin/feature-flags/${key}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  return data.flag;
}
