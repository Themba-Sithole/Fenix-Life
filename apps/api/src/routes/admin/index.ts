import { Router } from 'express';
import { adminAccountsRouter } from './accounts.js';
import { adminAuditRouter } from './audit.js';
import { adminMetricsRouter } from './metrics.js';
import { adminModerationRouter } from './moderation.js';
import { adminSavesRouter } from './saves.js';
import { adminFeatureFlagsRouter } from './feature-flags.js';

export const adminRouter = Router();

adminRouter.use('/metrics', adminMetricsRouter);
adminRouter.use('/accounts', adminAccountsRouter);
adminRouter.use('/saves', adminSavesRouter);
adminRouter.use('/audit-log', adminAuditRouter);
adminRouter.use('/moderation', adminModerationRouter);
adminRouter.use('/feature-flags', adminFeatureFlagsRouter);
