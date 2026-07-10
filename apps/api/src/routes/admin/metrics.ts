import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';

export const adminMetricsRouter = Router();

adminMetricsRouter.get('/', requireAdmin('SUPPORT'), async (_req, res) => {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [userCount, pendingModeration] = await Promise.all([
    prisma.user.count(),
    Promise.resolve(0),
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
