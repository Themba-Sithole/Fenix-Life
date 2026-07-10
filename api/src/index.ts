import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { savesRouter } from './routes/saves.js';

const app = express();
const port = Number(process.env.PORT ?? 3001);

const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
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
app.use(express.json());

app.get('/health', async (_req, res) => {
  const redis = await checkRedis();
  res.json({
    status: 'ok',
    service: 'fenix-life-api',
    version: '0.0.1',
    timestamp: new Date().toISOString(),
    redis,
  });
});

app.get('/v1/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/v1/auth', authRouter);
app.use('/v1/saves', savesRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
  console.log(`Fenix Life API listening on port ${port}`);
});
