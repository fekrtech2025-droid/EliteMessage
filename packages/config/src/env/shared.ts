import { z } from 'zod';

const booleanString = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true');

const numberFromString = z
  .string()
  .min(1)
  .transform((value) => Number(value));

export const sharedEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  LOG_LEVEL: z.string().min(1).default('info'),
  ENABLE_EXTERNAL_CONNECTIONS: booleanString.default(true),
});

export const bootstrapEnvSchema = z.object({
  DEV_BOOTSTRAP_ADMIN_EMAIL: z.string().email().default('admin@elite.local'),
  DEV_BOOTSTRAP_ADMIN_PASSWORD: z.string().min(8).default('Admin123456!'),
  DEV_BOOTSTRAP_ADMIN_NAME: z.string().min(1).default('Elite Admin'),
  DEV_BOOTSTRAP_CUSTOMER_EMAIL: z.string().email().default('owner@elite.local'),
  DEV_BOOTSTRAP_CUSTOMER_PASSWORD: z.string().min(8).default('Customer123456!'),
  DEV_BOOTSTRAP_CUSTOMER_NAME: z.string().min(1).default('Workspace Owner'),
  DEV_BOOTSTRAP_WORKSPACE_NAME: z.string().min(1).default('Acme Workspace'),
});

export const databaseEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PORT: numberFromString.pipe(z.number().int().positive()),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
});

export const redisEnvSchema = z.object({
  REDIS_URL: z.string().url(),
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: numberFromString.pipe(z.number().int().positive()),
});

export const storageEnvSchema = z.object({
  S3_ENDPOINT: z.string().url(),
  S3_PORT: numberFromString.pipe(z.number().int().positive()),
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1),
  S3_BUCKET: z.string().min(1),
  S3_REGION: z.string().min(1),
});
