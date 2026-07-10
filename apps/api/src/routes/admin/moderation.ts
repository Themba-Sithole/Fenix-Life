import { Router } from 'express';
import { requireAdmin } from '../../middleware/requireAdmin.js';

export const adminModerationRouter = Router();

adminModerationRouter.get('/queue', requireAdmin('MODERATOR'), async (_req, res) => {
  res.json({ queue: [], count: 0 });
});
