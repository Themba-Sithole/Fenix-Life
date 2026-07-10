import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { recordAdminAudit } from '../../middleware/audit.js';
import { requireAdmin, type AdminRequest } from '../../middleware/requireAdmin.js';

export const adminAccountsRouter = Router();

adminAccountsRouter.get('/', requireAdmin('SUPPORT'), async (req, res) => {
  const q = String(req.query.q ?? '').trim();

  const rows = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { email: { contains: q, mode: 'insensitive' } },
            { displayName: { contains: q, mode: 'insensitive' } },
            { id: { contains: q, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      suspended: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { saves: true } },
    },
  });

  const accounts = rows.map((row) => ({
    id: row.id,
    email: row.email,
    displayName: row.displayName,
    role: row.role,
    suspended: row.suspended,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    saveCount: row._count.saves,
  }));

  res.json({ accounts });
});

adminAccountsRouter.get('/:id', requireAdmin('SUPPORT'), async (req, res) => {
  const id = String(req.params.id);
  const account = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      suspended: true,
      createdAt: true,
      updatedAt: true,
      saves: {
        orderBy: { lastPlayedAt: 'desc' },
        select: {
          id: true,
          name: true,
          schemaVersion: true,
          blobSizeBytes: true,
          blobChecksum: true,
          lastPlayedAt: true,
          createdAt: true,
        },
      },
    },
  });

  if (!account) {
    res.status(404).json({ error: 'Account not found' });
    return;
  }

  res.json({ account });
});

const suspendSchema = z.object({
  suspended: z.boolean(),
});

adminAccountsRouter.post('/:id/suspend', requireAdmin('MODERATOR'), async (req: AdminRequest, res) => {
  const id = String(req.params.id);
  const parsed = suspendSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: 'Account not found' });
    return;
  }

  if (existing.suspended === parsed.data.suspended) {
    res.status(409).json({
      error: parsed.data.suspended ? 'Account already suspended' : 'Account is not suspended',
    });
    return;
  }

  const account = await prisma.user.update({
    where: { id },
    data: { suspended: parsed.data.suspended },
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      suspended: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  await recordAdminAudit(req, {
    action: parsed.data.suspended ? 'account.suspend' : 'account.unsuspend',
    resourceType: 'account',
    resourceId: id,
    metadata: { email: account.email },
  });

  res.json({ account });
});

adminAccountsRouter.get('/:id/saves', requireAdmin('SUPPORT'), async (req, res) => {
  const id = String(req.params.id);
  const account = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!account) {
    res.status(404).json({ error: 'Account not found' });
    return;
  }

  const saves = await prisma.save.findMany({
    where: { userId: id },
    orderBy: { lastPlayedAt: 'desc' },
    select: {
      id: true,
      name: true,
      schemaVersion: true,
      worldSeed: true,
      blobSizeBytes: true,
      blobChecksum: true,
      lastPlayedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.json({ saves });
});
