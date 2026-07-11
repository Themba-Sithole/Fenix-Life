import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../prisma/.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { savesRouter } from './routes/saves.js';
import { adminRouter } from './routes/admin/index.js';
import { checkDatabase } from './lib/db-health.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();
const port = Number(process.env.PORT ?? 3001);

const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

async function checkRedis(): Promise<'ok' | 'skipped' | 'error'> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return 'skipped';
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(['PING']),
    });
    const data = (await response.json()) as { result?: string };
    return data.result === 'PONG' ? 'ok' : 'error';
  } catch {
    return 'error';
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '2mb' }));

app.get('/health', async (_req, res) => {
  const redis = await checkRedis();
  const database = await checkDatabase();
  const ok = database === 'ok';
  res.status(ok ? 200 : 503).json({
    status: ok ? 'ok' : 'degraded',
    service: 'fenix-life-api',
    version: '0.0.1',
    timestamp: new Date().toISOString(),
    redis,
    database,
  });
});

app.get('/v1/health', async (_req, res) => {
  const database = await checkDatabase();
  res.status(database === 'ok' ? 200 : 503).json({ status: database === 'ok' ? 'ok' : 'degraded', database });
});

app.use('/v1/auth', authRouter);
app.use('/v1/saves', savesRouter);
app.use('/v1/admin', adminRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

async function warmDatabase(): Promise<void> {
  const status = await checkDatabase();
  if (status === 'ok') {
    console.log('Database connection OK');
    return;
  }
  console.warn(
    `Database not reachable (${status}). Auth and saves will fail until DATABASE_URL is fixed or Neon is awake.`,
  );
}

void warmDatabase();

app.listen(port, () => {
  console.log(`Fenix Life API listening on port ${port}`);
});
