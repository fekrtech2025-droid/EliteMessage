import { PrismaPg } from '@prisma/adapter-pg';
import { loadWorkspaceEnv } from '@elite-message/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

declare global {
  var __eliteMessagePrisma__: PrismaClient | undefined;
  var __eliteMessagePgPool__: Pool | undefined;
}

loadWorkspaceEnv();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to initialize Prisma.');
}

const pool =
  global.__eliteMessagePgPool__ ??
  new Pool({
    connectionString: databaseUrl,
  });

export const prisma =
  global.__eliteMessagePrisma__ ??
  new PrismaClient({
    adapter: new PrismaPg(pool),
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__eliteMessagePrisma__ = prisma;
  global.__eliteMessagePgPool__ = pool;
}

export async function checkDatabaseConnection() {
  return prisma.$queryRaw`SELECT 1`;
}

export * from './bootstrap';
export * from './security';
export * from '@prisma/client';
