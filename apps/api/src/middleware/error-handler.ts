import type { NextFunction, Request, Response } from 'express';
import { databaseErrorMessage, isDatabaseConnectionError } from '../lib/db-health.js';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (res.headersSent) {
    return;
  }

  console.error('[api]', error);

  if (isDatabaseConnectionError(error)) {
    res.status(503).json({
      error: databaseErrorMessage(),
      code: 'DATABASE_UNAVAILABLE',
    });
    return;
  }

  if (error instanceof Error && error.message.startsWith('CORS blocked')) {
    res.status(403).json({ error: error.message, code: 'CORS_BLOCKED' });
    return;
  }

  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
}
