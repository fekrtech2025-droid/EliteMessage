import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import type { NextFunction, Request, Response } from 'express';
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

function getHeaderValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value.join(',') : value;
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

  app.use((request: Request, response: Response, next: NextFunction) => {
    const origin = getHeaderValue(request.headers.origin);
    const normalizedOrigin = origin ? normalizeOrigin(origin) : null;
    const allowed =
      normalizedOrigin !== null &&
      (corsOriginSet.has('*') || corsOriginSet.has(normalizedOrigin));

    if (origin || request.method === 'OPTIONS') {
      writeApiDebugLog('cors.manual.checked', {
        method: request.method,
        path: request.originalUrl ?? request.url,
        origin: origin ?? null,
        normalizedOrigin,
        allowed,
        configuredOrigins: corsOrigins,
      });
    }

    if (allowed && normalizedOrigin) {
      const requestedHeaders = getHeaderValue(
        request.headers['access-control-request-headers'],
      );

      response.vary('Origin');
      response.vary('Access-Control-Request-Headers');
      response.setHeader('Access-Control-Allow-Origin', normalizedOrigin);
      response.setHeader('Access-Control-Allow-Credentials', 'true');
      response.setHeader(
        'Access-Control-Allow-Methods',
        'GET,HEAD,PUT,PATCH,POST,DELETE',
      );
      response.setHeader(
        'Access-Control-Allow-Headers',
        requestedHeaders ?? 'authorization,content-type',
      );
    }

    if (request.method === 'OPTIONS') {
      response.status(204).send();
      return;
    }

    next();
  });
  writeApiDebugLog('bootstrap.manual_cors.enabled');

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
