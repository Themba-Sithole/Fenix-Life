import type { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { verifyToken, type AuthenticatedRequest } from '../lib/auth.js';
import { hasMinRole, isStaffRole, type UserRole } from '../lib/roles.js';

export interface AdminRequest extends AuthenticatedRequest {
  adminUser?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export function requireAdmin(minimumRole: UserRole = 'SUPPORT') {
  return async (req: AdminRequest, res: Response, next: NextFunction): Promise<void> => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization header' });
      return;
    }

    try {
      const payload = verifyToken(header.slice(7));
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, role: true, suspended: true },
      });

      if (!user) {
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
      }

      if (user.suspended) {
        res.status(403).json({ error: 'Account suspended' });
        return;
      }

      if (!isStaffRole(user.role) || !hasMinRole(user.role, minimumRole)) {
        res.status(403).json({ error: 'Insufficient admin permissions' });
        return;
      }

      req.user = payload;
      req.adminUser = { id: user.id, email: user.email, role: user.role };
      next();
    } catch {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}
