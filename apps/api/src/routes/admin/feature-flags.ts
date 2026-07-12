import { Router } from 'express';
import { requireAdmin, type AdminRequest } from '../../middleware/requireAdmin.js';
import { prisma } from '../../lib/prisma.js';
import { recordAdminAudit } from '../../middleware/audit.js';

export const adminFeatureFlagsRouter = Router();

const DEFAULT_FLAGS: ReadonlyArray<{ key: string; description: string; enabled: boolean }> = [
  {
    key: 'flag_civic_engine',
    description: 'Enables PAYE tax withholding and unemployment benefit simulation',
    enabled: true,
  },
  {
    key: 'flag_while_away_screen',
    description: 'Shows a catch-up summary when player returns after 1+ days offline',
    enabled: true,
  },
  {
    key: 'flag_succession',
    description: 'Enables mortality risk evaluation and heir succession on death',
    enabled: true,
  },
  {
    key: 'flag_extended_occupations',
    description: 'Unlocks the full occupation list in job market',
    enabled: true,
  },
  {
    key: 'flag_company_runway_alert',
    description: 'Emits SimEvents when company has <3 months cash runway',
    enabled: true,
  },
  {
    key: 'flag_monthly_bills',
    description: 'Deducts itemised bills (utilities, food, insurance) monthly',
    enabled: true,
  },
];

async function ensureDefaultFlags(): Promise<void> {
  for (const flag of DEFAULT_FLAGS) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      create: {
        key: flag.key,
        enabled: flag.enabled,
        description: flag.description,
      },
      update: {},
    });
  }
}

adminFeatureFlagsRouter.get('/', requireAdmin('LIVEOPS'), async (_req, res) => {
  await ensureDefaultFlags();
  const rows = await prisma.featureFlag.findMany({ orderBy: { key: 'asc' } });
  const flags = rows.map((flag) => ({
    key: flag.key,
    label: flag.key.replace(/^flag_/, '').replace(/_/g, ' '),
    description: flag.description ?? '',
    enabled: flag.enabled,
    enabledForPercent: flag.enabled ? 100 : 0,
    updatedAt: flag.updatedAt.toISOString(),
    updatedBy: flag.updatedBy,
  }));
  res.json({ flags, count: flags.length });
});

adminFeatureFlagsRouter.patch('/:key', requireAdmin('LIVEOPS'), async (req, res) => {
  const adminReq = req as AdminRequest;
  const key = String(req.params.key);
  const { enabled } = req.body as { enabled?: boolean };

  if (!adminReq.adminUser) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  await ensureDefaultFlags();

  try {
    const flag = await prisma.featureFlag.update({
      where: { key },
      data: {
        ...(typeof enabled === 'boolean' ? { enabled } : {}),
        updatedBy: adminReq.adminUser.id,
      },
    });

    await recordAdminAudit(adminReq, {
      action: 'feature_flag.toggle',
      resourceType: 'feature_flag',
      resourceId: key,
      metadata: { enabled: flag.enabled },
    });

    // Flags may toggle UI/feature advantages only — never edit citizen stats.
    res.json({
      flag: {
        key: flag.key,
        label: flag.key.replace(/^flag_/, '').replace(/_/g, ' '),
        description: flag.description ?? '',
        enabled: flag.enabled,
        enabledForPercent: flag.enabled ? 100 : 0,
        updatedAt: flag.updatedAt.toISOString(),
        updatedBy: flag.updatedBy,
      },
    });
  } catch {
    res.status(404).json({ error: 'Feature flag not found' });
  }
});
