import { z } from 'zod';
import {
  databaseEnvSchema,
  redisEnvSchema,
  sharedEnvSchema,
  storageEnvSchema,
} from './shared';

const booleanString = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true');

export const workerEnvSchema = sharedEnvSchema
  .extend({
    WORKER_APP_NAME: z.string().min(1),
    WORKER_PORT: z.coerce.number().int().positive(),
    WORKER_HEARTBEAT_INTERVAL_MS: z.coerce.number().int().positive(),
    WORKER_CONTROL_LOOP_INTERVAL_MS: z.coerce.number().int().positive(),
    WORKER_ID: z.string().min(1),
    WORKER_REGION: z.string().min(1),
    WORKER_MAX_AUTO_ASSIGNMENTS: z.coerce.number().int().positive(),
    WORKER_SESSION_BACKEND: z
      .enum(['placeholder', 'whatsapp_web'])
      .default('placeholder'),
    WORKER_SESSION_STORAGE_DIR: z.string().min(1),
    WORKER_PLACEHOLDER_QR_DISPLAY_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(300_000),
    WORKER_WA_HEADLESS: booleanString.default(true),
    WORKER_WA_BROWSER_EXECUTABLE_PATH: z.string().min(1).optional(),
    WORKER_WA_CAPTURE_SCREENSHOTS: booleanString.default(false),
    WORKER_WA_DOWNLOAD_INBOUND_MEDIA: booleanString.default(true),
    WORKER_WA_STARTUP_TIMEOUT_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(120_000),
    WORKER_WA_AUTO_RECOVERY_DELAY_MS: z.coerce
      .number()
      .int()
      .nonnegative()
      .default(5_000),
    API_BASE_URL: z.string().url(),
    API_INTERNAL_TOKEN: z.string().min(1),
  })
  .and(databaseEnvSchema)
  .and(redisEnvSchema)
  .and(storageEnvSchema);

export type WorkerEnv = z.infer<typeof workerEnvSchema>;

export function parseWorkerEnv(input: NodeJS.ProcessEnv): WorkerEnv {
  return workerEnvSchema.parse(input);
}
