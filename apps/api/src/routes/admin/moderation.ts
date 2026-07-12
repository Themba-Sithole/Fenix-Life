import { Router } from 'express';
import { requireAdmin, type AdminRequest } from '../../middleware/requireAdmin.js';
import { prisma } from '../../lib/prisma.js';
import { recordAdminAudit } from '../../middleware/audit.js';

export const adminModerationRouter = Router();

type ApiStatus = 'pending' | 'resolved' | 'escalated';
type ApiType = 'display_name' | 'company_name' | 'chat_message' | 'save_content';

function toApiStatus(status: string): ApiStatus {
  switch (status) {
    case 'PENDING':
      return 'pending';
    case 'RESOLVED':
      return 'resolved';
    case 'ESCALATED':
      return 'escalated';
    default:
      return 'pending';
  }
}

function toDbStatus(status: ApiStatus): 'PENDING' | 'RESOLVED' | 'ESCALATED' {
  switch (status) {
    case 'pending':
      return 'PENDING';
    case 'resolved':
      return 'RESOLVED';
    case 'escalated':
      return 'ESCALATED';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function toApiType(type: string): ApiType {
  switch (type) {
    case 'DISPLAY_NAME':
      return 'display_name';
    case 'COMPANY_NAME':
      return 'company_name';
    case 'CHAT_MESSAGE':
      return 'chat_message';
    case 'SAVE_CONTENT':
      return 'save_content';
    default:
      return 'save_content';
  }
}

function mapItem(item: {
  id: string;
  type: string;
  status: string;
  reportedContent: string;
  reportedByUserId: string | null;
  targetUserId: string;
  reason: string;
  createdAt: Date;
  resolvedAt: Date | null;
  resolvedByAdminId: string | null;
}) {
  return {
    id: item.id,
    type: toApiType(item.type),
    status: toApiStatus(item.status),
    reportedContent: item.reportedContent,
    reportedByUserId: item.reportedByUserId,
    targetUserId: item.targetUserId,
    reason: item.reason,
    createdAt: item.createdAt.toISOString(),
    resolvedAt: item.resolvedAt?.toISOString() ?? null,
    resolvedByAdminId: item.resolvedByAdminId,
  };
}

adminModerationRouter.get('/queue', requireAdmin('MODERATOR'), async (req, res) => {
  const status = req.query['status'] as ApiStatus | undefined;
  const items = await prisma.moderationItem.findMany({
    where: status
      ? { status: toDbStatus(status) }
      : { status: { not: 'RESOLVED' } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const queue = items.map(mapItem);
  res.json({ queue, count: queue.length });
});

adminModerationRouter.post('/queue/:itemId/resolve', requireAdmin('MODERATOR'), async (req, res) => {
  const adminReq = req as AdminRequest;
  const itemId = String(req.params.itemId);
  if (!adminReq.adminUser) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const item = await prisma.moderationItem.update({
      where: { id: itemId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        resolvedByAdminId: adminReq.adminUser.id,
      },
    });
    await recordAdminAudit(adminReq, {
      action: 'moderation.resolve',
      resourceType: 'moderation_item',
      resourceId: itemId,
      metadata: { status: 'resolved' },
    });
    res.json({ item: mapItem(item) });
  } catch {
    res.status(404).json({ error: 'Moderation item not found' });
  }
});

adminModerationRouter.post('/queue/:itemId/escalate', requireAdmin('MODERATOR'), async (req, res) => {
  const adminReq = req as AdminRequest;
  const itemId = String(req.params.itemId);
  if (!adminReq.adminUser) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const item = await prisma.moderationItem.update({
      where: { id: itemId },
      data: { status: 'ESCALATED' },
    });
    await recordAdminAudit(adminReq, {
      action: 'moderation.escalate',
      resourceType: 'moderation_item',
      resourceId: itemId,
      metadata: { status: 'escalated' },
    });
    res.json({ item: mapItem(item) });
  } catch {
    res.status(404).json({ error: 'Moderation item not found' });
  }
});
