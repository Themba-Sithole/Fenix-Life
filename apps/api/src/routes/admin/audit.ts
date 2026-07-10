import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';

export const adminAuditRouter = Router();

adminAuditRouter.get('/', requireAdmin('SUPPORT'), async (req, res) => {
  const q = String(req.query.q ?? '').trim();
  const action = String(req.query.action ?? '').trim();
  const limit = Math.min(Number(req.query.limit ?? 50), 200);
  const offset = Math.max(Number(req.query.offset ?? 0), 0);

  const entries = await prisma.adminAuditLog.findMany({
    where: {
      ...(action ? { action: { contains: action, mode: 'insensitive' } } : {}),
      ...(q
        ? {
            OR: [
              { action: { contains: q, mode: 'insensitive' } },
              { resourceType: { contains: q, mode: 'insensitive' } },
              { resourceId: { contains: q, mode: 'insensitive' } },
              { actorId: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
    include: {
      actor: { select: { id: true, email: true, displayName: true, role: true } },
    },
  });

  res.json({ entries, limit, offset });
});
