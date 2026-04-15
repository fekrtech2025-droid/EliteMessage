import { describe, expect, it } from 'vitest';
import { parseApiEnv } from './env/api';

describe('config env parsing', () => {
  it('parses a valid API environment', () => {
    const env = parseApiEnv({
      NODE_ENV: 'test',
      LOG_LEVEL: 'info',
      ENABLE_EXTERNAL_CONNECTIONS: 'false',
      CUSTOMER_WEB_PUBLIC_BASE_URL: 'http://localhost:3000',
      API_APP_NAME: 'API',
      API_PORT: '3002',
      API_BASE_URL: 'http://localhost:3002',
      API_ACCESS_TOKEN_TTL: '15m',
      API_ACCESS_TOKEN_SECRET: 'super-secret-access-token',
      API_REFRESH_TOKEN_TTL: '7d',
      API_COOKIE_DOMAIN: 'localhost',
      API_COOKIE_SECURE: 'false',
      API_CORS_ORIGINS: 'http://localhost:3000',
      API_INTERNAL_TOKEN: 'secret',
      DEV_BOOTSTRAP_ADMIN_EMAIL: 'admin@elite.local',
      DEV_BOOTSTRAP_ADMIN_PASSWORD: 'Admin123456!',
      DEV_BOOTSTRAP_ADMIN_NAME: 'Elite Admin',
      DEV_BOOTSTRAP_CUSTOMER_EMAIL: 'owner@elite.local',
      DEV_BOOTSTRAP_CUSTOMER_PASSWORD: 'Customer123456!',
      DEV_BOOTSTRAP_CUSTOMER_NAME: 'Workspace Owner',
      DEV_BOOTSTRAP_WORKSPACE_NAME: 'Acme Workspace',
      DATABASE_URL:
        'postgresql://postgres:postgres@localhost:5432/elite_message?schema=public',
      POSTGRES_HOST: 'localhost',
      POSTGRES_PORT: '5432',
      POSTGRES_USER: 'postgres',
      POSTGRES_PASSWORD: 'postgres',
      POSTGRES_DB: 'elite_message',
      REDIS_URL: 'redis://localhost:6379',
      REDIS_HOST: 'localhost',
      REDIS_PORT: '6379',
      S3_ENDPOINT: 'http://localhost:9000',
      S3_PORT: '9000',
      S3_ACCESS_KEY: 'minioadmin',
      S3_SECRET_KEY: 'minioadmin',
      S3_BUCKET: 'elite-message-local',
      S3_REGION: 'us-east-1',
    });

    expect(env.API_PORT).toBe(3002);
    expect(env.ENABLE_EXTERNAL_CONNECTIONS).toBe(false);
  });

  it('fails fast on invalid API environment', () => {
    expect(() =>
      parseApiEnv({
        NODE_ENV: 'test',
      }),
    ).toThrow();
  });
});
