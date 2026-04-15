import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import {
  createLogger,
  loadWorkspaceEnv,
  parseApiEnv,
} from '@elite-message/config';
import { AppModule } from './app.module';

async function bootstrap() {
  loadWorkspaceEnv();
  const env = parseApiEnv(process.env);
  const logger = createLogger({ service: 'api' });
  const app = await NestFactory.create(AppModule, { logger: false });

  app.enableCors({
    origin: env.API_CORS_ORIGINS.split(','),
    credentials: true,
  });

  await app.listen(env.API_PORT);
  logger.info({ port: env.API_PORT, baseUrl: env.API_BASE_URL }, 'api.started');
}

void bootstrap();
