import type { Request } from 'express';
import type { Prisma } from '../../node_modules/.prisma/client/index.js';
import { prisma } from '../lib/prisma.js';
import type { AdminRequest } from './requireAdmin.js';

export async function recordAdminAudit(
  req: AdminRequest,
  input: {
    action: string;
    resourceType: string;
    resourceId?: string;
    metadata?: Record<string, unknown>;
  },
): Promise<void> {
  if (!req.adminUser) {
    throw new Error('Admin audit requires authenticated admin user');
  }

  await prisma.adminAuditLog.create({
    data: {
      actorId: req.adminUser.id,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
      ipAddress: resolveIp(req),
    },
  });
}

function resolveIp(req: Request): string | undefined {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0]?.trim();
  }
  return req.socket.remoteAddress;
}
