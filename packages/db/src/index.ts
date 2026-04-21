import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { loadWorkspaceEnv } from '@elite-message/config';
import { PrismaClient } from '@prisma/client';

declare global {
  var __eliteMessagePrisma__: PrismaClient | undefined;
  var __eliteMessageDbAdapter__: PrismaMariaDb | undefined;
}

loadWorkspaceEnv();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to initialize Prisma.');
}

const adapter =
  global.__eliteMessageDbAdapter__ ??
  new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

export const prisma =
  global.__eliteMessagePrisma__ ??
  new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__eliteMessagePrisma__ = prisma;
  global.__eliteMessageDbAdapter__ = adapter;
}

export async function checkDatabaseConnection() {
  return prisma.$queryRaw`SELECT 1`;
}

export * from './bootstrap';
export * from './security';
export * from '@prisma/client';
