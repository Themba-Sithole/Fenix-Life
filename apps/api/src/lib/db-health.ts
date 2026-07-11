import { Prisma } from '../../node_modules/.prisma/client/index.js';
import { prisma } from './prisma.js';

export type DatabaseStatus = 'ok' | 'error' | 'unavailable';

export function isDatabaseConnectionError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === 'P1001' || error.code === 'P1002' || error.code === 'P1017';
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return true;
  }

  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("Can't reach database server") ||
    message.includes('Connection terminated') ||
    message.includes('ECONNREFUSED') ||
    message.includes('ENOTFOUND')
  );
}

export function databaseErrorMessage(): string {
  return 'Database is unavailable. If you use Neon free tier, open the Neon dashboard to wake the project, confirm DATABASE_URL uses the pooled connection string, then retry.';
}

export async function checkDatabase(): Promise<DatabaseStatus> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return 'ok';
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return 'unavailable';
    }
    return 'error';
  }
}
