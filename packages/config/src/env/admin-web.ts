import { z } from 'zod';
import { sharedEnvSchema } from './shared';

export const adminWebEnvSchema = sharedEnvSchema.extend({
  ADMIN_WEB_APP_NAME: z.string().min(1),
  ADMIN_WEB_PORT: z.coerce.number().int().positive(),
  ADMIN_WEB_PUBLIC_BASE_URL: z.string().url(),
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
});

export type AdminWebEnv = z.infer<typeof adminWebEnvSchema>;

export function parseAdminWebEnv(input: NodeJS.ProcessEnv): AdminWebEnv {
  return adminWebEnvSchema.parse(input);
}
