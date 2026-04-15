import { afterEach, describe, expect, it, vi } from 'vitest';
import type { WorkerEnv } from '@elite-message/config';
import { createSessionRuntime } from '../src/runtime/runtime-factory';
import * as whatsAppRuntimeModule from '../src/runtime/whatsapp-web-session-runtime';

function createBaseEnv(overrides: Partial<WorkerEnv> = {}): WorkerEnv {
  return {
    NODE_ENV: 'test',
    LOG_LEVEL: 'info',
    ENABLE_EXTERNAL_CONNECTIONS: false,
    DATABASE_URL: 'postgresql://localhost:5432/elite_message',
    POSTGRES_HOST: 'localhost',
    POSTGRES_PORT: 5432,
    POSTGRES_USER: 'postgres',
    POSTGRES_PASSWORD: 'postgres',
    POSTGRES_DB: 'elite_message',
    REDIS_URL: 'redis://localhost:6379',
    REDIS_HOST: 'localhost',
    REDIS_PORT: 6379,
    S3_ENDPOINT: 'http://localhost:9000',
    S3_PORT: 9000,
    S3_BUCKET: 'elite-message',
    S3_ACCESS_KEY: 'test',
    S3_SECRET_KEY: 'test',
    S3_REGION: 'local',
    WORKER_APP_NAME: 'elite-worker',
    WORKER_PORT: 3003,
    WORKER_HEARTBEAT_INTERVAL_MS: 5_000,
    WORKER_CONTROL_LOOP_INTERVAL_MS: 5_000,
    WORKER_ID: 'worker-test-1',
    WORKER_REGION: 'local',
    WORKER_MAX_AUTO_ASSIGNMENTS: 1,
    WORKER_SESSION_BACKEND: 'placeholder',
    WORKER_SESSION_STORAGE_DIR:
      '/Volumes/MACOS/EliteMessage/.runtime/test-worker',
    WORKER_PLACEHOLDER_QR_DISPLAY_MS: 15_000,
    WORKER_WA_HEADLESS: true,
    WORKER_WA_CAPTURE_SCREENSHOTS: false,
    WORKER_WA_DOWNLOAD_INBOUND_MEDIA: true,
    WORKER_WA_STARTUP_TIMEOUT_MS: 60_000,
    WORKER_WA_AUTO_RECOVERY_DELAY_MS: 5_000,
    API_BASE_URL: 'http://127.0.0.1:3002',
    API_INTERNAL_TOKEN: 'test-internal-token',
    ...overrides,
  } as WorkerEnv;
}

describe('worker runtime factory', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps placeholder mode when placeholder backend is requested', () => {
    const result = createSessionRuntime(createBaseEnv(), {
      workerId: 'worker-test-1',
      logger: {
        info: () => undefined,
        warn: () => undefined,
        error: () => undefined,
        debug: () => undefined,
        child: () => {
          throw new Error('child logger should not be called in this test.');
        },
      } as never,
      internalApi: {} as never,
    });

    expect(result.backend).toBe('placeholder');
  });

  it('fails fast when whatsapp_web is requested without a browser executable', () => {
    vi.spyOn(
      whatsAppRuntimeModule,
      'resolveWorkerBrowserExecutablePath',
    ).mockReturnValue(null);

    expect(() =>
      createSessionRuntime(
        createBaseEnv({
          WORKER_SESSION_BACKEND: 'whatsapp_web',
          WORKER_WA_BROWSER_EXECUTABLE_PATH:
            '/Volumes/MACOS/EliteMessage/.runtime/does-not-exist/chrome',
        }),
        {
          workerId: 'worker-test-1',
          logger: {
            info: () => undefined,
            warn: () => undefined,
            error: () => undefined,
            debug: () => undefined,
            child: () => {
              throw new Error(
                'child logger should not be called in this test.',
              );
            },
          } as never,
          internalApi: {} as never,
        },
      ),
    ).toThrow(/no supported browser executable/i);
  });
});
