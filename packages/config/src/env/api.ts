import { z } from 'zod';
import {
  bootstrapEnvSchema,
  databaseEnvSchema,
  redisEnvSchema,
  sharedEnvSchema,
  storageEnvSchema,
} from './shared';

const optionalNonEmptyString = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}, z.string().min(1).optional());

export const apiEnvSchema = sharedEnvSchema
  .extend({
    CUSTOMER_WEB_PUBLIC_BASE_URL: z.string().url(),
    API_APP_NAME: z.string().min(1),
    API_PORT: z.coerce.number().int().positive(),
    API_BASE_URL: z.string().url(),
    API_ACCESS_TOKEN_TTL: z.string().min(1),
    API_ACCESS_TOKEN_SECRET: z.string().min(16),
    API_REFRESH_TOKEN_TTL: z.string().min(1),
    API_COOKIE_DOMAIN: z.string().min(1),
    API_COOKIE_SECURE: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true'),
    API_CORS_ORIGINS: z.string().min(1),
    API_INTERNAL_TOKEN: z.string().min(1),
    API_RATE_LIMIT_AUTH_WINDOW_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(60_000),
    API_RATE_LIMIT_AUTH_MAX_REQUESTS: z.coerce
      .number()
      .int()
      .positive()
      .default(10),
    API_RATE_LIMIT_PUBLIC_WINDOW_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(60_000),
    API_RATE_LIMIT_PUBLIC_MAX_REQUESTS: z.coerce
      .number()
      .int()
      .positive()
      .default(120),
    API_RATE_LIMIT_DASHBOARD_WINDOW_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(60_000),
    API_RATE_LIMIT_DASHBOARD_MAX_REQUESTS: z.coerce
      .number()
      .int()
      .positive()
      .default(240),
    API_RATE_LIMIT_ADMIN_WINDOW_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(60_000),
    API_RATE_LIMIT_ADMIN_MAX_REQUESTS: z.coerce
      .number()
      .int()
      .positive()
      .default(300),
    API_RATE_LIMIT_STRIKE_WINDOW_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(15 * 60_000),
    API_RATE_LIMIT_BLOCK_DURATION_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(15 * 60_000),
    API_RATE_LIMIT_STRIKE_THRESHOLD: z.coerce
      .number()
      .int()
      .positive()
      .default(5),
    API_WORKER_STALE_AFTER_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(90_000),
    API_REFRESH_SESSION_RETENTION_DAYS: z.coerce
      .number()
      .int()
      .nonnegative()
      .default(30),
    API_WEBHOOK_DELIVERY_RETENTION_DAYS: z.coerce
      .number()
      .int()
      .nonnegative()
      .default(14),
    API_AUDIT_LOG_RETENTION_DAYS: z.coerce
      .number()
      .int()
      .nonnegative()
      .default(90),
    API_RETENTION_SWEEP_INTERVAL_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(5 * 60_000),
    API_WEBHOOK_SIGNATURE_TOLERANCE_SECONDS: z.coerce
      .number()
      .int()
      .positive()
      .default(300),
    API_GOOGLE_CLIENT_ID: optionalNonEmptyString,
    API_GOOGLE_CLIENT_SECRET: optionalNonEmptyString,
  })
  .and(databaseEnvSchema)
  .and(redisEnvSchema)
  .and(storageEnvSchema)
  .and(bootstrapEnvSchema);

export type ApiEnv = z.infer<typeof apiEnvSchema>;

export function parseApiEnv(input: NodeJS.ProcessEnv): ApiEnv {
  const parsed = apiEnvSchema.parse(input);
  const hasAnyGoogleConfig = Boolean(
    parsed.API_GOOGLE_CLIENT_ID || parsed.API_GOOGLE_CLIENT_SECRET,
  );

  if (
    hasAnyGoogleConfig &&
    (!parsed.API_GOOGLE_CLIENT_ID || !parsed.API_GOOGLE_CLIENT_SECRET)
  ) {
    throw new Error(
      'Google OAuth requires both API_GOOGLE_CLIENT_ID and API_GOOGLE_CLIENT_SECRET.',
    );
  }

  return parsed;
}
