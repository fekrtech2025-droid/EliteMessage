import { z } from 'zod';
import { sharedEnvSchema } from './shared';

export const adminWebEnvSchema = sharedEnvSchema.extend({
  ADMIN_WEB_APP_NAME: z.string().min(1).default('Elite Message Admin'),
  ADMIN_WEB_PORT: z.coerce.number().int().positive().default(3001),
  ADMIN_WEB_PUBLIC_BASE_URL: z
    .string()
    .url()
    .default('https://admin.levan-pms.com'),
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url()
    .default('https://api.levan-pms.com'),
});

export type AdminWebEnv = z.infer<typeof adminWebEnvSchema>;

export function parseAdminWebEnv(input: NodeJS.ProcessEnv): AdminWebEnv {
  return adminWebEnvSchema.parse(input);
}
