import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';

export const adminSavesRouter = Router();

adminSavesRouter.get('/:saveId/inspect', requireAdmin('SUPPORT'), async (req, res) => {
  const saveId = String(req.params.saveId);

  const save = await prisma.save.findUnique({
    where: { id: saveId },
    select: {
      id: true,
      userId: true,
      name: true,
      schemaVersion: true,
      worldSeed: true,
      blobSizeBytes: true,
      blobChecksum: true,
      lastPlayedAt: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: { id: true, email: true, displayName: true, suspended: true },
      },
      blob: {
        select: { checksum: true, updatedAt: true, createdAt: true },
      },
    },
  });

  if (!save) {
    res.status(404).json({ error: 'Save not found' });
    return;
  }

  res.json({
    save: {
      id: save.id,
      userId: save.userId,
      name: save.name,
      schemaVersion: save.schemaVersion,
      worldSeed: save.worldSeed,
      blobSizeBytes: save.blobSizeBytes,
      blobChecksum: save.blobChecksum,
      lastPlayedAt: save.lastPlayedAt,
      createdAt: save.createdAt,
      updatedAt: save.updatedAt,
      hasBlob: save.blob !== null,
      blobUpdatedAt: save.blob?.updatedAt ?? null,
      owner: save.user,
    },
  });
});
