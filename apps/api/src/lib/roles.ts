export const USER_ROLES = ['PLAYER', 'SUPPORT', 'MODERATOR', 'LIVEOPS', 'ADMIN'] as const;
export type UserRole = (typeof USER_ROLES)[number];

const ROLE_RANK: Record<UserRole, number> = {
  PLAYER: 0,
  SUPPORT: 1,
  MODERATOR: 2,
  LIVEOPS: 3,
  ADMIN: 4,
};

export function isStaffRole(role: string): role is Exclude<UserRole, 'PLAYER'> {
  return ROLE_RANK[role as UserRole] >= ROLE_RANK.SUPPORT;
}

export function hasMinRole(role: string, minimum: UserRole): boolean {
  return ROLE_RANK[role as UserRole] >= ROLE_RANK[minimum];
}

export const STAFF_ROLES: Array<Exclude<UserRole, 'PLAYER'>> = ['SUPPORT', 'MODERATOR', 'LIVEOPS', 'ADMIN'];
