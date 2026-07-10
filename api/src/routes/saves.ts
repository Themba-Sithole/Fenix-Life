import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthenticatedRequest } from '../lib/auth.js';

export const savesRouter = Router();

savesRouter.use(requireAuth);

savesRouter.get('/', async (req: AuthenticatedRequest, res) => {
  const saves = await prisma.save.findMany({
    where: { userId: req.user!.userId },
    orderBy: { lastPlayedAt: 'desc' },
    select: {
      id: true,
      name: true,
      schemaVersion: true,
      worldSeed: true,
      lastPlayedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  res.json({ saves });
});

const createSaveSchema = z.object({
  name: z.string().min(1).max(128).optional(),
  worldSeed: z.string().optional(),
});

savesRouter.post('/', async (req: AuthenticatedRequest, res) => {
  const parsed = createSaveSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }

  const save = await prisma.save.create({
    data: {
      userId: req.user!.userId,
      name: parsed.data.name ?? 'My Life',
      worldSeed: parsed.data.worldSeed,
    },
    select: {
      id: true,
      name: true,
      schemaVersion: true,
      worldSeed: true,
      lastPlayedAt: true,
      createdAt: true,
    },
  });

  res.status(201).json({ save });
});

savesRouter.get('/:id', async (req: AuthenticatedRequest, res) => {
  const saveId = String(req.params.id);
  const save = await prisma.save.findFirst({
    where: { id: saveId, userId: req.user!.userId },
    select: {
      id: true,
      name: true,
      schemaVersion: true,
      worldSeed: true,
      lastPlayedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!save) {
    res.status(404).json({ error: 'Save not found' });
    return;
  }

  res.json({ save });
});
