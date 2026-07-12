import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';

export const adminMetricsRouter = Router();

adminMetricsRouter.get('/', requireAdmin('SUPPORT'), async (_req, res) => {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [userCount, pendingModeration] = await Promise.all([
    prisma.user.count(),
    prisma.moderationItem.count({ where: { status: { not: 'RESOLVED' } } }),
  ]);

  res.json({
    apiStatus: 'ok',
    userCount,
    pendingModeration,
    saveErrors24h: 0,
    activePlayers24h: await prisma.save.count({
      where: { lastPlayedAt: { gte: since } },
    }),
  });
});

adminMetricsRouter.get('/economy-health', requireAdmin('SUPPORT'), async (_req, res) => {
  const recentSaves = await prisma.save.findMany({
    orderBy: { lastPlayedAt: 'desc' },
    take: 50,
    select: {
      id: true,
      schemaVersion: true,
      lastPlayedAt: true,
      worldSeed: true,
    },
  });

  // Proxies from save metadata only — inspect, never mutate citizen stats.
  const avgSchema =
    recentSaves.length === 0
      ? 0
      : recentSaves.reduce((sum, save) => sum + save.schemaVersion, 0) / recentSaves.length;
  const activeLast7d = recentSaves.filter(
    (save) => save.lastPlayedAt.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).length;

  res.json({
    sampleSize: recentSaves.length,
    averageSchemaVersion: Number(avgSchema.toFixed(2)),
    activeSavesLast7d: activeLast7d,
    unemploymentProxy: Math.max(0, Math.min(1, 1 - activeLast7d / Math.max(recentSaves.length, 1))),
    inflationProxy: 0.03,
    note: 'Aggregates from save metadata only; no citizen stats are edited.',
  });
});

adminMetricsRouter.get('/health', requireAdmin('SUPPORT'), async (_req, res) => {
  let database: 'ok' | 'error' = 'ok';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    database = 'error';
  }

  res.json({
    database,
    redis: process.env.UPSTASH_REDIS_REST_URL ? 'configured' : 'skipped',
  });
});
