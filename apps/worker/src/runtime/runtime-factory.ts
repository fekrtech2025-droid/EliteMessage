import type { WorkerEnv } from '@elite-message/config';
import type { SessionRuntime, SessionRuntimeOptions } from './session-runtime';
import { PlaceholderSessionRuntime } from './session-runtime';
import {
  resolveWorkerBrowserExecutablePath,
  WhatsAppWebSessionRuntime,
} from './whatsapp-web-session-runtime';

export type SelectedSessionBackend = 'placeholder' | 'whatsapp_web';

export function createSessionRuntime(
  env: WorkerEnv,
  runtimeOptions: SessionRuntimeOptions,
): {
  runtime: SessionRuntime;
  backend: SelectedSessionBackend;
} {
  if (env.WORKER_SESSION_BACKEND === 'placeholder') {
    return {
      runtime: new PlaceholderSessionRuntime({
        ...runtimeOptions,
        placeholderQrDisplayMs: env.WORKER_PLACEHOLDER_QR_DISPLAY_MS,
      }),
      backend: 'placeholder',
    };
  }

  const browserExecutablePath = resolveWorkerBrowserExecutablePath(
    env.WORKER_WA_BROWSER_EXECUTABLE_PATH,
  );
  if (!browserExecutablePath) {
    throw new Error(
      `WORKER_SESSION_BACKEND is "whatsapp_web" but no supported browser executable was found. Checked ${env.WORKER_WA_BROWSER_EXECUTABLE_PATH ?? 'default browser locations'}.`,
    );
  }

  return {
    runtime: new WhatsAppWebSessionRuntime({
      ...runtimeOptions,
      browserExecutablePath,
      env,
    }),
    backend: 'whatsapp_web',
  };
}
