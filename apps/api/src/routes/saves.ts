import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, type AuthenticatedRequest } from '../lib/auth.js';
import {
  checksumBuffer,
  compressSavePayload,
  decompressSavePayload,
} from '../lib/save-blob.js';

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

const renameSaveSchema = z.object({
  name: z.string().min(1).max(128),
});

savesRouter.patch('/:id', async (req: AuthenticatedRequest, res) => {
  const saveId = String(req.params.id);
  const parsed = renameSaveSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }

  const owned = await assertSaveOwner(saveId, req.user!.userId);
  if (!owned) {
    res.status(404).json({ error: 'Save not found' });
    return;
  }

  const save = await prisma.save.update({
    where: { id: saveId },
    data: { name: parsed.data.name },
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

  res.json({ save });
});

savesRouter.post('/:id/play', async (req: AuthenticatedRequest, res) => {
  const saveId = String(req.params.id);
  const existing = await prisma.save.findFirst({
    where: { id: saveId, userId: req.user!.userId },
  });

  if (!existing) {
    res.status(404).json({ error: 'Save not found' });
    return;
  }

  const save = await prisma.save.update({
    where: { id: saveId },
    data: { lastPlayedAt: new Date() },
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

  res.json({ save });
});

const uploadBlobSchema = z.object({
  blob: z.string().min(2),
  checksum: z.string().regex(/^[a-f0-9]{64}$/i).optional(),
});

async function assertSaveOwner(saveId: string, userId: string) {
  return prisma.save.findFirst({
    where: { id: saveId, userId },
  });
}

savesRouter.put('/:id/blob', async (req: AuthenticatedRequest, res) => {
  const saveId = String(req.params.id);
  const parsed = uploadBlobSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }

  const owned = await assertSaveOwner(saveId, req.user!.userId);
  if (!owned) {
    res.status(404).json({ error: 'Save not found' });
    return;
  }

  let payload: string;
  try {
    payload = parsed.data.blob;
    JSON.parse(payload);
  } catch {
    res.status(400).json({ error: 'Invalid save blob payload' });
    return;
  }

  const compressed = compressSavePayload(payload);
  const checksum = checksumBuffer(compressed);
  const blobData = new Uint8Array(compressed);

  if (parsed.data.checksum && parsed.data.checksum.toLowerCase() !== checksum) {
    res.status(400).json({ error: 'Save blob checksum mismatch' });
    return;
  }

  const schemaVersion =
    (JSON.parse(payload) as { schemaVersion?: number }).schemaVersion ?? owned.schemaVersion;

  await prisma.$transaction([
    prisma.saveBlob.upsert({
      where: { saveId },
      create: { saveId, data: blobData, checksum },
      update: { data: blobData, checksum },
    }),
    prisma.save.update({
      where: { id: saveId },
      data: {
        blobSizeBytes: compressed.byteLength,
        blobChecksum: checksum,
        schemaVersion,
        lastPlayedAt: new Date(),
      },
    }),
  ]);

  res.json({
    saveId,
    blobSizeBytes: compressed.byteLength,
    checksum,
  });
});

savesRouter.get('/:id/blob', async (req: AuthenticatedRequest, res) => {
  const saveId = String(req.params.id);
  const owned = await assertSaveOwner(saveId, req.user!.userId);
  if (!owned) {
    res.status(404).json({ error: 'Save not found' });
    return;
  }

  const record = await prisma.saveBlob.findUnique({ where: { saveId } });
  if (!record) {
    res.status(404).json({ error: 'Save blob not found' });
    return;
  }

  const payload = decompressSavePayload(Buffer.from(record.data));
  res.json({
    saveId,
    schemaVersion: owned.schemaVersion,
    blobSizeBytes: owned.blobSizeBytes,
    checksum: record.checksum,
    blob: payload,
  });
});

savesRouter.delete('/:id', async (req: AuthenticatedRequest, res) => {
  const saveId = String(req.params.id);
  const owned = await assertSaveOwner(saveId, req.user!.userId);
  if (!owned) {
    res.status(404).json({ error: 'Save not found' });
    return;
  }

  await prisma.save.delete({ where: { id: saveId } });
  res.status(204).send();
});
