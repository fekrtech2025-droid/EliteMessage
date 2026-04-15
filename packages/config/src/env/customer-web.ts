import { z } from 'zod';
import { sharedEnvSchema } from './shared';

export const customerWebEnvSchema = sharedEnvSchema.extend({
  CUSTOMER_WEB_APP_NAME: z.string().min(1),
  CUSTOMER_WEB_PORT: z.coerce.number().int().positive(),
  CUSTOMER_WEB_PUBLIC_BASE_URL: z
    .string()
    .url()
    .default('https://levan-pms.com'),
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url()
    .default('https://api.levan-pms.com'),
});

export type CustomerWebEnv = z.infer<typeof customerWebEnvSchema>;

export function parseCustomerWebEnv(input: NodeJS.ProcessEnv): CustomerWebEnv {
  return customerWebEnvSchema.parse(input);
}
