import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import {
  createLogger,
  loadWorkspaceEnv,
  parseApiEnv,
} from '@elite-message/config';
import { AppModule } from './app.module';
import { writeApiDebugLog } from './common/api-debug';

process.on('uncaughtException', (error) => {
  writeApiDebugLog('process.uncaughtException', { error });
});

process.on('unhandledRejection', (reason) => {
  writeApiDebugLog('process.unhandledRejection', { reason });
});

function parseCorsOrigins(rawOrigins: string) {
  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function normalizeOrigin(origin: string) {
  try {
    return new URL(origin).origin;
  } catch {
    return origin.trim();
  }
}

async function bootstrap() {
  writeApiDebugLog('bootstrap.start', {
    argv: process.argv,
    envPort: process.env.PORT ?? null,
    envApiPort: process.env.API_PORT ?? null,
    nodeEnv: process.env.NODE_ENV ?? null,
  });

  const envFiles = loadWorkspaceEnv();
  writeApiDebugLog('bootstrap.env.loaded', { envFiles });

  const env = parseApiEnv(process.env);
  writeApiDebugLog('bootstrap.env.parsed', {
    apiPort: env.API_PORT,
    apiBaseUrl: env.API_BASE_URL,
    apiCorsOrigins: env.API_CORS_ORIGINS.split(','),
  });

  const logger = createLogger({ service: 'api' });
  const app = await NestFactory.create(AppModule, { logger: false });
  writeApiDebugLog('bootstrap.nest.created');
  const corsOrigins = parseCorsOrigins(env.API_CORS_ORIGINS);
  const corsOriginSet = new Set(
    corsOrigins.map((origin) => normalizeOrigin(origin)),
  );

  app.enableCors({
    origin(
      origin: string | undefined,
      callback: (error: Error | null, origin?: string | boolean) => void,
    ) {
      if (!origin) {
        callback(null, false);
        return;
      }

      const normalizedOrigin = normalizeOrigin(origin);
      const allowed =
        corsOriginSet.has('*') || corsOriginSet.has(normalizedOrigin);

      writeApiDebugLog('cors.origin.checked', {
        origin,
        normalizedOrigin,
        allowed,
        configuredOrigins: corsOrigins,
      });

      callback(null, allowed ? normalizedOrigin : false);
    },
    credentials: true,
  });
  writeApiDebugLog('bootstrap.cors.enabled');

  await app.listen(env.API_PORT);
  writeApiDebugLog('bootstrap.listen.ready', {
    apiPort: env.API_PORT,
    apiBaseUrl: env.API_BASE_URL,
  });
  logger.info({ port: env.API_PORT, baseUrl: env.API_BASE_URL }, 'api.started');
}

void bootstrap().catch((error) => {
  writeApiDebugLog('bootstrap.failed', { error });
  setImmediate(() => {
    throw error;
  });
});
