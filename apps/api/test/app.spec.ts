import 'reflect-metadata';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';
import { loadWorkspaceEnv } from '@elite-message/config';
import { ensureBootstrapData, prisma } from '@elite-message/db';
import { generateTotpCode } from '../src/auth/totp';

const require = createRequire(import.meta.url);
const testWorkerId = 'worker-phase2a-a';
const secondaryWorkerId = 'worker-phase2a-b';

vi.setConfig({
  testTimeout: 60_000,
  hookTimeout: 60_000,
});

function getInternalToken() {
  return process.env.API_INTERNAL_TOKEN ?? 'change-me';
}

function extractCookieValue(
  setCookieHeaders: string[] | undefined,
  cookieName: string,
) {
  const matchedHeader = setCookieHeaders?.find((header) =>
    header.startsWith(`${cookieName}=`),
  );
  if (!matchedHeader) {
    return null;
  }

  const [cookiePair] = matchedHeader.split(';');
  if (!cookiePair) {
    return null;
  }

  return cookiePair.slice(cookieName.length + 1);
}

async function login(
  app: Awaited<ReturnType<typeof NestFactory.create>>,
  email: string | undefined,
  password: string | undefined,
) {
  const response = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({
      email,
      password,
    });

  expect(response.status).toBe(201);
  return response.body.accessToken as string;
}

async function createInstance(
  app: Awaited<ReturnType<typeof NestFactory.create>>,
  accessToken: string,
  workspaceId: string,
  name: string,
) {
  const response = await request(app.getHttpServer())
    .post('/api/v1/customer/instances')
    .set('authorization', `Bearer ${accessToken}`)
    .send({
      workspaceId,
      name,
    });

  expect(response.status).toBe(201);
  return response.body as {
    instance: {
      id: string;
      publicId: string;
    };
    instanceApiToken: string;
  };
}

describe('api phase 2 routes', () => {
  let app: Awaited<ReturnType<typeof NestFactory.create>>;
  const createdInstanceIds: string[] = [];
  const createdWorkspaceIds: string[] = [];
  const createdUserIds: string[] = [];
  const createdSupportCaseIds: string[] = [];
  const createdArtifactPaths: string[] = [];

  async function cleanupCreatedData() {
    if (createdArtifactPaths.length > 0) {
      await Promise.allSettled(
        createdArtifactPaths.map((artifactPath) =>
          rm(artifactPath, { force: true }),
        ),
      );
      createdArtifactPaths.splice(0, createdArtifactPaths.length);
    }

    if (
      createdInstanceIds.length > 0 ||
      createdWorkspaceIds.length > 0 ||
      createdUserIds.length > 0 ||
      createdSupportCaseIds.length > 0
    ) {
      await prisma.auditLog.deleteMany({
        where: {
          OR: [
            createdInstanceIds.length > 0
              ? {
                  instanceId: {
                    in: createdInstanceIds,
                  },
                }
              : undefined,
            createdWorkspaceIds.length > 0
              ? {
                  workspaceId: {
                    in: createdWorkspaceIds,
                  },
                }
              : undefined,
            createdUserIds.length > 0
              ? {
                  actorId: {
                    in: createdUserIds,
                  },
                }
              : undefined,
            createdUserIds.length > 0
              ? {
                  entityId: {
                    in: createdUserIds,
                  },
                }
              : undefined,
            createdSupportCaseIds.length > 0
              ? {
                  entityId: {
                    in: createdSupportCaseIds,
                  },
                }
              : undefined,
          ].filter(Boolean) as Array<Record<string, unknown>>,
        },
      });
    }

    if (createdSupportCaseIds.length > 0) {
      await prisma.supportCase.deleteMany({
        where: {
          id: {
            in: createdSupportCaseIds,
          },
        },
      });
      createdSupportCaseIds.splice(0, createdSupportCaseIds.length);
    }

    if (createdInstanceIds.length > 0) {
      await prisma.instance.deleteMany({
        where: {
          id: {
            in: createdInstanceIds,
          },
        },
      });
      createdInstanceIds.splice(0, createdInstanceIds.length);
    }

    if (createdWorkspaceIds.length > 0) {
      await prisma.workspace.deleteMany({
        where: {
          id: {
            in: createdWorkspaceIds,
          },
        },
      });
      createdWorkspaceIds.splice(0, createdWorkspaceIds.length);
    }

    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({
        where: {
          id: {
            in: createdUserIds,
          },
        },
      });
      createdUserIds.splice(0, createdUserIds.length);
    }

    await prisma.workerHeartbeat.deleteMany({
      where: {
        workerId: {
          in: [testWorkerId, secondaryWorkerId],
        },
      },
    });

    await prisma.refreshSession.deleteMany();
  }

  beforeAll(async () => {
    process.env.API_RATE_LIMIT_AUTH_MAX_REQUESTS = '500';
    process.env.API_RATE_LIMIT_PUBLIC_MAX_REQUESTS = '1000';
    process.env.API_RATE_LIMIT_DASHBOARD_MAX_REQUESTS = '1000';
    process.env.API_RATE_LIMIT_ADMIN_MAX_REQUESTS = '1000';
    process.env.CUSTOMER_WEB_PUBLIC_BASE_URL = 'http://localhost:3000';
    process.env.API_GOOGLE_CLIENT_ID = 'google-client-id';
    process.env.API_GOOGLE_CLIENT_SECRET = 'google-client-secret';
    loadWorkspaceEnv();
    await ensureBootstrapData();

    const { AppModule } = require('../dist/app.module.js') as {
      AppModule: Parameters<typeof NestFactory.create>[0];
    };
    app = await NestFactory.create(AppModule, { logger: false });
    await app.init();
  }, 60_000);

  afterEach(async () => {
    await cleanupCreatedData();
    vi.restoreAllMocks();
  }, 30_000);

  afterAll(async () => {
    await cleanupCreatedData();
    await app.close();
    await prisma.$disconnect();
  }, 30_000);

  it('returns health status', async () => {
    const response = await request(app.getHttpServer()).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('supports customer signup and account creation', async () => {
    const email = `customer-${Date.now()}@elite.local`;
    const signupResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/signup')
      .send({
        email,
        password: 'Customer123456!',
        displayName: 'New Customer',
        workspaceName: 'New Customer Workspace',
      });

    expect(signupResponse.status).toBe(201);
    expect(signupResponse.body.user.email).toBe(email);
    expect(signupResponse.body.workspaces).toHaveLength(1);
    expect(signupResponse.body.workspaces[0].name).toBe(
      'New Customer Workspace',
    );

    createdUserIds.push(signupResponse.body.user.id);
    createdWorkspaceIds.push(signupResponse.body.workspaces[0].id);

    const meResponse = await request(app.getHttpServer())
      .get('/api/v1/account/me')
      .set('authorization', `Bearer ${signupResponse.body.accessToken}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.user.email).toBe(email);
    expect(meResponse.body.workspaces[0].role).toBe('owner');
    expect(meResponse.body.themePreference).toBe('light');
  });

  it('issues a refresh cookie that browsers accept in insecure local development', async () => {
    const email = `customer-cookie-${Date.now()}@elite.local`;
    const signupResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/signup')
      .send({
        email,
        password: 'Customer123456!',
        displayName: 'Cookie Customer',
        workspaceName: 'Cookie Workspace',
      });

    expect(signupResponse.status).toBe(201);
    createdUserIds.push(signupResponse.body.user.id);
    createdWorkspaceIds.push(signupResponse.body.workspaces[0].id);

    const refreshCookieHeader = signupResponse.headers['set-cookie']?.find(
      (header) => header.startsWith('elite_message_refresh='),
    );
    expect(refreshCookieHeader).toBeTruthy();
    expect(refreshCookieHeader).toContain('HttpOnly');
    expect(refreshCookieHeader).toContain('SameSite=Lax');
    expect(refreshCookieHeader).not.toContain('Secure');
  });

  it('supports Google signup through the API redirect flow', async () => {
    const googleEmail = `google-signup-${Date.now()}@elite.local`;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL) => {
        const url = input.toString();
        if (url === 'https://oauth2.googleapis.com/token') {
          return new Response(
            JSON.stringify({ access_token: 'google-access-token' }),
            {
              status: 200,
              headers: { 'content-type': 'application/json' },
            },
          );
        }

        if (url === 'https://openidconnect.googleapis.com/v1/userinfo') {
          return new Response(
            JSON.stringify({
              sub: 'google-sub-signup',
              email: googleEmail,
              email_verified: true,
              name: 'Google Signup User',
            }),
            {
              status: 200,
              headers: { 'content-type': 'application/json' },
            },
          );
        }

        throw new Error(`Unexpected fetch url: ${url}`);
      }),
    );

    const authorizeResponse = await request(app.getHttpServer()).get(
      '/api/v1/auth/google/authorize?mode=signup',
    );
    expect(authorizeResponse.status).toBe(302);
    expect(authorizeResponse.headers.location).toContain('accounts.google.com');

    const googleStateCookie = extractCookieValue(
      authorizeResponse.headers['set-cookie'],
      'elite_message_google_state',
    );
    expect(googleStateCookie).toBeTruthy();

    const googleAuthorizeUrl = new URL(authorizeResponse.headers.location);
    const state = googleAuthorizeUrl.searchParams.get('state');
    expect(state).toBeTruthy();

    const callbackResponse = await request(app.getHttpServer())
      .get('/api/v1/auth/google/callback')
      .query({
        code: 'google-signup-code',
        state,
      })
      .set('Cookie', [`elite_message_google_state=${googleStateCookie}`]);

    expect(callbackResponse.status).toBe(302);
    expect(callbackResponse.headers.location).toContain(
      'http://localhost:3000/auth/google#',
    );
    expect(
      extractCookieValue(
        callbackResponse.headers['set-cookie'],
        'elite_message_refresh',
      ),
    ).toBeTruthy();

    const customerRedirect = new URL(callbackResponse.headers.location);
    const fragment = new URLSearchParams(customerRedirect.hash.slice(1));
    const accessToken = fragment.get('access_token');
    expect(fragment.get('mode')).toBe('signup');
    expect(accessToken).toBeTruthy();

    const meResponse = await request(app.getHttpServer())
      .get('/api/v1/account/me')
      .set('authorization', `Bearer ${accessToken}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.user.email).toBe(googleEmail);
    createdUserIds.push(meResponse.body.user.id);
    createdWorkspaceIds.push(meResponse.body.workspaces[0].id);

    const passwordLoginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: googleEmail,
        password: 'Customer123456!',
      });

    expect(passwordLoginResponse.status).toBe(401);
    expect(passwordLoginResponse.body.message).toBe(
      'This account was created with Google. Use Continue with Google.',
    );
  });

  it('supports Google login for an existing customer account', async () => {
    const email = `google-login-${Date.now()}@elite.local`;
    const signupResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/signup')
      .send({
        email,
        password: 'Customer123456!',
        displayName: 'Google Login Customer',
        workspaceName: 'Google Login Workspace',
      });

    expect(signupResponse.status).toBe(201);
    createdUserIds.push(signupResponse.body.user.id);
    createdWorkspaceIds.push(signupResponse.body.workspaces[0].id);

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL) => {
        const url = input.toString();
        if (url === 'https://oauth2.googleapis.com/token') {
          return new Response(
            JSON.stringify({ access_token: 'google-access-token-login' }),
            {
              status: 200,
              headers: { 'content-type': 'application/json' },
            },
          );
        }

        if (url === 'https://openidconnect.googleapis.com/v1/userinfo') {
          return new Response(
            JSON.stringify({
              sub: 'google-sub-login',
              email,
              email_verified: true,
              name: 'Google Login Customer',
            }),
            {
              status: 200,
              headers: { 'content-type': 'application/json' },
            },
          );
        }

        throw new Error(`Unexpected fetch url: ${url}`);
      }),
    );

    const authorizeResponse = await request(app.getHttpServer()).get(
      '/api/v1/auth/google/authorize?mode=login',
    );
    expect(authorizeResponse.status).toBe(302);

    const googleStateCookie = extractCookieValue(
      authorizeResponse.headers['set-cookie'],
      'elite_message_google_state',
    );
    const googleAuthorizeUrl = new URL(authorizeResponse.headers.location);
    const state = googleAuthorizeUrl.searchParams.get('state');

    const callbackResponse = await request(app.getHttpServer())
      .get('/api/v1/auth/google/callback')
      .query({
        code: 'google-login-code',
        state,
      })
      .set('Cookie', [`elite_message_google_state=${googleStateCookie}`]);

    expect(callbackResponse.status).toBe(302);
    const customerRedirect = new URL(callbackResponse.headers.location);
    const fragment = new URLSearchParams(customerRedirect.hash.slice(1));
    const accessToken = fragment.get('access_token');

    expect(fragment.get('mode')).toBe('login');
    expect(accessToken).toBeTruthy();

    const meResponse = await request(app.getHttpServer())
      .get('/api/v1/account/me')
      .set('authorization', `Bearer ${accessToken}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.user.email).toBe(email);
  });

  it('supports account API token creation, listing, and rotation', async () => {
    const email = `token-owner-${Date.now()}@elite.local`;
    const signupResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/signup')
      .send({
        email,
        password: 'Customer123456!',
        displayName: 'Token Owner',
        workspaceName: 'Token Workspace',
      });

    expect(signupResponse.status).toBe(201);
    createdUserIds.push(signupResponse.body.user.id);
    createdWorkspaceIds.push(signupResponse.body.workspaces[0].id);

    const accessToken = signupResponse.body.accessToken as string;
    const workspaceId = signupResponse.body.workspaces[0].id as string;

    const emptyListResponse = await request(app.getHttpServer())
      .get(
        `/api/v1/account/api-tokens?workspaceId=${encodeURIComponent(workspaceId)}`,
      )
      .set('authorization', `Bearer ${accessToken}`);

    expect(emptyListResponse.status).toBe(200);
    expect(emptyListResponse.body.items).toHaveLength(0);

    const createTokenResponse = await request(app.getHttpServer())
      .post('/api/v1/account/api-tokens')
      .set('authorization', `Bearer ${accessToken}`)
      .send({
        workspaceId,
        name: 'Primary account token',
      });

    expect(createTokenResponse.status).toBe(201);
    expect(createTokenResponse.body.token.startsWith('account_')).toBe(true);
    expect(createTokenResponse.body.summary.workspaceId).toBe(workspaceId);

    const firstTokenId = createTokenResponse.body.summary.id as string;

    const createdListResponse = await request(app.getHttpServer())
      .get(
        `/api/v1/account/api-tokens?workspaceId=${encodeURIComponent(workspaceId)}`,
      )
      .set('authorization', `Bearer ${accessToken}`);

    expect(createdListResponse.status).toBe(200);
    expect(createdListResponse.body.items).toHaveLength(1);
    expect(createdListResponse.body.items[0].id).toBe(firstTokenId);
    expect(createdListResponse.body.items[0].revokedAt).toBeNull();

    const rotateTokenResponse = await request(app.getHttpServer())
      .post(`/api/v1/account/api-tokens/${firstTokenId}/rotate`)
      .set('authorization', `Bearer ${accessToken}`);

    expect(rotateTokenResponse.status).toBe(201);
    expect(rotateTokenResponse.body.token.startsWith('account_')).toBe(true);
    expect(rotateTokenResponse.body.summary.id).not.toBe(firstTokenId);

    const rotatedListResponse = await request(app.getHttpServer())
      .get(
        `/api/v1/account/api-tokens?workspaceId=${encodeURIComponent(workspaceId)}`,
      )
      .set('authorization', `Bearer ${accessToken}`);

    expect(rotatedListResponse.status).toBe(200);
    expect(rotatedListResponse.body.items).toHaveLength(2);
    expect(
      rotatedListResponse.body.items.some(
        (token: { id: string; revokedAt: string | null }) =>
          token.id === firstTokenId && token.revokedAt,
      ),
    ).toBe(true);
    expect(
      rotatedListResponse.body.items.some(
        (token: { id: string; revokedAt: string | null }) =>
          token.id === rotateTokenResponse.body.summary.id &&
          token.revokedAt === null,
      ),
    ).toBe(true);
  });

  it('supports customer settings, subscription, workspace message explorer, and upload-backed image send', async () => {
    const email = `phase4-customer-${Date.now()}@elite.local`;
    const signupResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/signup')
      .send({
        email,
        password: 'Customer123456!',
        displayName: 'Phase 4 Customer',
        workspaceName: 'Phase 4 Workspace',
      });

    expect(signupResponse.status).toBe(201);
    createdUserIds.push(signupResponse.body.user.id);
    createdWorkspaceIds.push(signupResponse.body.workspaces[0].id);

    const accessToken = signupResponse.body.accessToken as string;
    const workspaceId = signupResponse.body.workspaces[0].id as string;

    const profileResponse = await request(app.getHttpServer())
      .patch('/api/v1/account/me')
      .set('authorization', `Bearer ${accessToken}`)
      .send({
        displayName: 'Workspace Owner Phase 4',
      });

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.user.displayName).toBe(
      'Workspace Owner Phase 4',
    );

    const themeResponse = await request(app.getHttpServer())
      .patch('/api/v1/account/me/theme')
      .set('authorization', `Bearer ${accessToken}`)
      .send({
        themePreference: 'dark',
      });

    expect(themeResponse.status).toBe(200);
    expect(themeResponse.body.themePreference).toBe('dark');
    expect(themeResponse.body.updatedAt).toBeTypeOf('string');

    const meResponse = await request(app.getHttpServer())
      .get('/api/v1/account/me')
      .set('authorization', `Bearer ${accessToken}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.themePreference).toBe('dark');

    const invalidThemeResponse = await request(app.getHttpServer())
      .patch('/api/v1/account/me/theme')
      .set('authorization', `Bearer ${accessToken}`)
      .send({
        themePreference: 'sepia',
      });

    expect(invalidThemeResponse.status).toBe(400);

    const subscriptionResponse = await request(app.getHttpServer())
      .get(
        `/api/v1/account/subscription?workspaceId=${encodeURIComponent(workspaceId)}`,
      )
      .set('authorization', `Bearer ${accessToken}`);

    expect(subscriptionResponse.status).toBe(200);
    expect(subscriptionResponse.body.workspace.id).toBe(workspaceId);
    expect(['trialing', 'manual', 'active']).toContain(
      subscriptionResponse.body.status,
    );

    const created = await createInstance(
      app,
      accessToken,
      workspaceId,
      'Phase 4 Customer Messages',
    );
    createdInstanceIds.push(created.instance.id);

    const outboundResponse = await request(app.getHttpServer())
      .post(`/api/v1/customer/instances/${created.instance.id}/messages/chat`)
      .set('authorization', `Bearer ${accessToken}`)
      .send({
        to: '963933445566',
        body: 'Phase 4 outbound',
        referenceId: 'phase4-outbound',
        priority: 5,
      });

    expect(outboundResponse.status).toBe(201);

    const uploadResponse = await request(app.getHttpServer())
      .post(
        `/api/v1/customer/instances/${created.instance.id}/messages/image-upload`,
      )
      .set('authorization', `Bearer ${accessToken}`)
      .field('to', '963933445566')
      .field('caption', 'Uploaded image')
      .field('referenceId', 'phase4-upload')
      .field('priority', '7')
      .attach(
        'file',
        Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9s5xGX0AAAAASUVORK5CYII=',
          'base64',
        ),
        {
          filename: 'phase4-image.png',
          contentType: 'image/png',
        },
      );

    expect(uploadResponse.status).toBe(201);
    expect(uploadResponse.body.message.mediaUrl).toContain(
      '/api/v1/public/customer-media/',
    );

    const uploadedAssetUrl = new URL(
      uploadResponse.body.message.mediaUrl as string,
    );
    const uploadedAssetSegments = uploadedAssetUrl.pathname
      .split('/')
      .filter(Boolean);
    const assetId = uploadedAssetSegments[uploadedAssetSegments.length - 2];
    if (assetId) {
      createdArtifactPaths.push(
        resolve('/Volumes/MACOS/EliteMessage/.runtime/customer-media', assetId),
      );
    }

    const assetResponse = await request(app.getHttpServer()).get(
      uploadedAssetUrl.pathname,
    );
    expect(assetResponse.status).toBe(200);
    expect(assetResponse.headers['content-type']).toContain('image/png');
    expect(assetResponse.body.length).toBeGreaterThan(20);

    await prisma.inboundMessage.create({
      data: {
        publicMessageId: `in_${Date.now().toString(36)}`,
        instanceId: created.instance.id,
        sender: '963933445566@c.us',
        kind: 'chat',
        body: 'Phase 4 inbound',
        receivedAt: new Date(),
      },
    });

    const workspaceMessagesResponse = await request(app.getHttpServer())
      .get(
        `/api/v1/customer/messages?workspaceId=${encodeURIComponent(workspaceId)}&limit=20`,
      )
      .set('authorization', `Bearer ${accessToken}`);

    expect(workspaceMessagesResponse.status).toBe(200);
    expect(
      workspaceMessagesResponse.body.items.some(
        (item: { referenceId: string | null }) =>
          item.referenceId === 'phase4-outbound',
      ),
    ).toBe(true);
    expect(
      workspaceMessagesResponse.body.items.some(
        (item: { referenceId: string | null }) =>
          item.referenceId === 'phase4-upload',
      ),
    ).toBe(true);

    const workspaceInboundResponse = await request(app.getHttpServer())
      .get(
        `/api/v1/customer/inbound-messages?workspaceId=${encodeURIComponent(workspaceId)}&limit=20`,
      )
      .set('authorization', `Bearer ${accessToken}`);

    expect(workspaceInboundResponse.status).toBe(200);
    expect(
      workspaceInboundResponse.body.items.some(
        (item: { body: string | null }) => item.body === 'Phase 4 inbound',
      ),
    ).toBe(true);
  });

  it('exposes dedicated account and admin audit log routes with recorded actions', async () => {
    const email = `audit-owner-${Date.now()}@elite.local`;
    const signupResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/signup')
      .send({
        email,
        password: 'Customer123456!',
        displayName: 'Audit Owner',
        workspaceName: 'Audit Workspace',
      });

    expect(signupResponse.status).toBe(201);
    createdUserIds.push(signupResponse.body.user.id);
    createdWorkspaceIds.push(signupResponse.body.workspaces[0].id);

    const accessToken = signupResponse.body.accessToken as string;
    const workspaceId = signupResponse.body.workspaces[0].id as string;

    const createAccountTokenResponse = await request(app.getHttpServer())
      .post('/api/v1/account/api-tokens')
      .set('authorization', `Bearer ${accessToken}`)
      .send({
        workspaceId,
        name: 'Audit account token',
      });

    expect(createAccountTokenResponse.status).toBe(201);
    const accountTokenId = createAccountTokenResponse.body.summary.id as string;

    await request(app.getHttpServer())
      .post(`/api/v1/account/api-tokens/${accountTokenId}/rotate`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(201);

    const createdInstance = await createInstance(
      app,
      accessToken,
      workspaceId,
      'Audit Instance',
    );
    createdInstanceIds.push(createdInstance.instance.id);

    await request(app.getHttpServer())
      .patch(
        `/api/v1/customer/instances/${createdInstance.instance.id}/settings`,
      )
      .set('authorization', `Bearer ${accessToken}`)
      .send({
        sendDelay: 2,
        sendDelayMax: 12,
        webhookUrl: null,
        webhookMessageReceived: false,
        webhookMessageCreate: false,
        webhookMessageAck: false,
      })
      .expect(200);

    await request(app.getHttpServer())
      .post(
        `/api/v1/customer/instances/${createdInstance.instance.id}/rotate-token`,
      )
      .set('authorization', `Bearer ${accessToken}`)
      .expect(201);

    await request(app.getHttpServer())
      .post(
        `/api/v1/customer/instances/${createdInstance.instance.id}/messages/chat`,
      )
      .set('authorization', `Bearer ${accessToken}`)
      .send({
        to: '963944556677',
        body: 'Audit trail message',
        referenceId: 'audit-trail-check',
        priority: 5,
      })
      .expect(201);

    const accountAuditResponse = await request(app.getHttpServer())
      .get(
        `/api/v1/account/audit-logs?workspaceId=${encodeURIComponent(workspaceId)}&limit=100`,
      )
      .set('authorization', `Bearer ${accessToken}`);

    expect(accountAuditResponse.status).toBe(200);
    expect(
      accountAuditResponse.body.items.some(
        (item: { action: string }) => item.action === 'auth.signup',
      ),
    ).toBe(true);
    expect(
      accountAuditResponse.body.items.some(
        (item: { action: string }) =>
          item.action === 'account.api_token.created',
      ),
    ).toBe(true);
    expect(
      accountAuditResponse.body.items.some(
        (item: { action: string }) =>
          item.action === 'account.api_token.rotated',
      ),
    ).toBe(true);
    expect(
      accountAuditResponse.body.items.some(
        (item: { action: string }) => item.action === 'instance.created',
      ),
    ).toBe(true);
    expect(
      accountAuditResponse.body.items.some(
        (item: { action: string }) =>
          item.action === 'instance.settings.updated',
      ),
    ).toBe(true);
    expect(
      accountAuditResponse.body.items.some(
        (item: { action: string }) =>
          item.action === 'instance.api_token.rotated',
      ),
    ).toBe(true);
    expect(
      accountAuditResponse.body.items.some(
        (item: { action: string }) => item.action === 'message.outbound.queued',
      ),
    ).toBe(true);

    const adminToken = await login(
      app,
      process.env.DEV_BOOTSTRAP_ADMIN_EMAIL,
      process.env.DEV_BOOTSTRAP_ADMIN_PASSWORD,
    );
    const adminAuditResponse = await request(app.getHttpServer())
      .get(
        `/api/v1/admin/audit-logs?instanceId=${encodeURIComponent(createdInstance.instance.id)}&limit=100`,
      )
      .set('authorization', `Bearer ${adminToken}`);

    expect(adminAuditResponse.status).toBe(200);
    expect(
      adminAuditResponse.body.items.some(
        (item: { action: string }) => item.action === 'instance.created',
      ),
    ).toBe(true);
    expect(
      adminAuditResponse.body.items.some(
        (item: { action: string }) => item.action === 'message.outbound.queued',
      ),
    ).toBe(true);
    expect(
      adminAuditResponse.body.items.every(
        (item: { instanceId: string | null; workspaceId: string | null }) =>
          item.instanceId === createdInstance.instance.id &&
          item.workspaceId === workspaceId,
      ),
    ).toBe(true);
  });

  it('supports customer settings mutation and action queueing', async () => {
    const accessToken = await login(
      app,
      process.env.DEV_BOOTSTRAP_CUSTOMER_EMAIL,
      process.env.DEV_BOOTSTRAP_CUSTOMER_PASSWORD,
    );

    const meResponse = await request(app.getHttpServer())
      .get('/api/v1/account/me')
      .set('authorization', `Bearer ${accessToken}`);

    expect(meResponse.status).toBe(200);
    const workspaceId = meResponse.body.workspaces[0].id as string;

    const created = await createInstance(
      app,
      accessToken,
      workspaceId,
      'Phase 2A Settings Sender',
    );
    createdInstanceIds.push(created.instance.id);

    const settingsResponse = await request(app.getHttpServer())
      .patch(`/api/v1/customer/instances/${created.instance.id}/settings`)
      .set('authorization', `Bearer ${accessToken}`)
      .send({
        sendDelay: 5,
        sendDelayMax: 20,
        webhookUrl: 'https://example.com/webhook',
        webhookMessageReceived: true,
        webhookMessageCreate: true,
        webhookMessageAck: false,
      });

    expect(settingsResponse.status).toBe(200);
    expect(settingsResponse.body.settings.sendDelay).toBe(5);
    expect(settingsResponse.body.settings.webhookUrl).toBe(
      'https://example.com/webhook',
    );

    const actionResponse = await request(app.getHttpServer())
      .post(`/api/v1/customer/instances/${created.instance.id}/actions`)
      .set('authorization', `Bearer ${accessToken}`)
      .send({
        action: 'start',
      });

    expect(actionResponse.status).toBe(201);
    expect(actionResponse.body.operation.action).toBe('start');
    expect(actionResponse.body.operation.status).toBe('pending');

    const detailResponse = await request(app.getHttpServer())
      .get(`/api/v1/customer/instances/${created.instance.id}`)
      .set('authorization', `Bearer ${accessToken}`);

    expect(detailResponse.status).toBe(200);
    expect(detailResponse.body.settings.sendDelay).toBe(5);
    expect(detailResponse.body.pendingOperation.action).toBe('start');
    expect(detailResponse.body.runtime.qrCode).toBeNull();
    expect(
      detailResponse.body.events.some(
        (event: { eventType: string }) =>
          event.eventType === 'settings_updated',
      ),
    ).toBe(true);
    expect(
      detailResponse.body.events.some(
        (event: { eventType: string }) =>
          event.eventType === 'action_requested',
      ),
    ).toBe(true);
  });

  it('supports worker claim, runtime updates, operation completion, and release', async () => {
    const customerToken = await login(
      app,
      process.env.DEV_BOOTSTRAP_CUSTOMER_EMAIL,
      process.env.DEV_BOOTSTRAP_CUSTOMER_PASSWORD,
    );
    const adminToken = await login(
      app,
      process.env.DEV_BOOTSTRAP_ADMIN_EMAIL,
      process.env.DEV_BOOTSTRAP_ADMIN_PASSWORD,
    );

    const meResponse = await request(app.getHttpServer())
      .get('/api/v1/account/me')
      .set('authorization', `Bearer ${customerToken}`);

    expect(meResponse.status).toBe(200);
    const workspaceId = meResponse.body.workspaces[0].id as string;
    const created = await createInstance(
      app,
      customerToken,
      workspaceId,
      'Phase 2A Runtime Sender',
    );
    createdInstanceIds.push(created.instance.id);

    const actionResponse = await request(app.getHttpServer())
      .post(`/api/v1/customer/instances/${created.instance.id}/actions`)
      .set('authorization', `Bearer ${customerToken}`)
      .send({
        action: 'start',
      });

    expect(actionResponse.status).toBe(201);
    const operationId = actionResponse.body.operation.id as string;

    const registerResponse = await request(app.getHttpServer())
      .post('/api/v1/internal/workers/register')
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'online',
        region: 'local',
        uptimeSeconds: 45,
        activeInstanceCount: 0,
        timestamp: new Date().toISOString(),
      });

    expect(registerResponse.status).toBe(200);
    expect(registerResponse.body.worker.workerId).toBe(testWorkerId);

    const claimResponse = await request(app.getHttpServer())
      .post(`/api/v1/internal/workers/${testWorkerId}/claim-next`)
      .set('authorization', `Bearer ${getInternalToken()}`);

    expect(claimResponse.status).toBe(200);
    expect(claimResponse.body.assignedInstance.id).toBe(created.instance.id);
    expect(claimResponse.body.assignedInstance.pendingOperation.id).toBe(
      operationId,
    );

    const runningOperationResponse = await request(app.getHttpServer())
      .post(
        `/api/v1/internal/instances/${created.instance.id}/operations/${operationId}/status`,
      )
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'running',
        message: 'Worker accepted the start action.',
      });

    expect(runningOperationResponse.status).toBe(200);
    expect(runningOperationResponse.body.status).toBe('running');

    const statusResponse = await request(app.getHttpServer())
      .post(`/api/v1/internal/instances/${created.instance.id}/status`)
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'qr',
        substatus: 'awaiting_scan',
        message: 'Generated placeholder QR payload.',
      });

    expect(statusResponse.status).toBe(200);
    expect(statusResponse.body.status).toBe('qr');

    const runtimeResponse = await request(app.getHttpServer())
      .post(`/api/v1/internal/instances/${created.instance.id}/runtime`)
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        qrCode: 'ELITE-QRPAYLOAD|TEST',
        qrExpiresAt: new Date(Date.now() + 45_000).toISOString(),
        lastStartedAt: new Date().toISOString(),
      });

    expect(runtimeResponse.status).toBe(200);
    expect(runtimeResponse.body.qrCode).toBe('ELITE-QRPAYLOAD|TEST');

    const authenticatedStatusResponse = await request(app.getHttpServer())
      .post(`/api/v1/internal/instances/${created.instance.id}/status`)
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'authenticated',
        substatus: 'placeholder_linked',
        message: 'Placeholder session linked automatically.',
      });

    expect(authenticatedStatusResponse.status).toBe(200);
    expect(authenticatedStatusResponse.body.status).toBe('authenticated');

    const authenticatedRuntimeResponse = await request(app.getHttpServer())
      .post(`/api/v1/internal/instances/${created.instance.id}/runtime`)
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        qrCode: null,
        qrExpiresAt: null,
        currentSessionLabel: 'session-test',
        lastAuthenticatedAt: new Date().toISOString(),
        disconnectReason: null,
      });

    expect(authenticatedRuntimeResponse.status).toBe(200);
    expect(authenticatedRuntimeResponse.body.currentSessionLabel).toBe(
      'session-test',
    );

    const completedOperationResponse = await request(app.getHttpServer())
      .post(
        `/api/v1/internal/instances/${created.instance.id}/operations/${operationId}/status`,
      )
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'completed',
        message: 'Start action completed in placeholder runtime.',
      });

    expect(completedOperationResponse.status).toBe(200);
    expect(completedOperationResponse.body.status).toBe('completed');

    const adminDetailResponse = await request(app.getHttpServer())
      .get(`/api/v1/admin/instances/${created.instance.id}`)
      .set('authorization', `Bearer ${adminToken}`);

    expect(adminDetailResponse.status).toBe(200);
    expect(adminDetailResponse.body.instance.status).toBe('authenticated');
    expect(adminDetailResponse.body.assignedWorker.workerId).toBe(testWorkerId);
    expect(adminDetailResponse.body.pendingOperation).toBeNull();
    expect(adminDetailResponse.body.runtime.currentSessionLabel).toBe(
      'session-test',
    );
    expect(
      adminDetailResponse.body.operations.some(
        (operation: { status: string }) => operation.status === 'completed',
      ),
    ).toBe(true);
    expect(
      adminDetailResponse.body.events.some(
        (event: { eventType: string }) =>
          event.eventType === 'action_completed',
      ),
    ).toBe(true);

    const releaseResponse = await request(app.getHttpServer())
      .post(`/api/v1/internal/workers/${testWorkerId}/release-instance`)
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        instanceId: created.instance.id,
        reason: 'Phase 2A test release.',
      });

    expect(releaseResponse.status).toBe(200);
    expect(releaseResponse.body.status).toBe('standby');
  });

  it('supports admin reassignment', async () => {
    const customerToken = await login(
      app,
      process.env.DEV_BOOTSTRAP_CUSTOMER_EMAIL,
      process.env.DEV_BOOTSTRAP_CUSTOMER_PASSWORD,
    );
    const adminToken = await login(
      app,
      process.env.DEV_BOOTSTRAP_ADMIN_EMAIL,
      process.env.DEV_BOOTSTRAP_ADMIN_PASSWORD,
    );

    const meResponse = await request(app.getHttpServer())
      .get('/api/v1/account/me')
      .set('authorization', `Bearer ${customerToken}`);

    expect(meResponse.status).toBe(200);
    const workspaceId = meResponse.body.workspaces[0].id as string;
    const created = await createInstance(
      app,
      customerToken,
      workspaceId,
      'Phase 2A Reassign Sender',
    );
    createdInstanceIds.push(created.instance.id);

    await request(app.getHttpServer())
      .post(`/api/v1/customer/instances/${created.instance.id}/actions`)
      .set('authorization', `Bearer ${customerToken}`)
      .send({
        action: 'start',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/internal/workers/register')
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'online',
        region: 'local',
        uptimeSeconds: 30,
        activeInstanceCount: 0,
        timestamp: new Date().toISOString(),
      })
      .expect(200);

    await request(app.getHttpServer())
      .post('/api/v1/internal/workers/register')
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: secondaryWorkerId,
        status: 'online',
        region: 'secondary',
        uptimeSeconds: 30,
        activeInstanceCount: 0,
        timestamp: new Date().toISOString(),
      })
      .expect(200);

    await request(app.getHttpServer())
      .post(`/api/v1/internal/workers/${testWorkerId}/claim-next`)
      .set('authorization', `Bearer ${getInternalToken()}`)
      .expect(200);

    const reassignResponse = await request(app.getHttpServer())
      .post(`/api/v1/admin/instances/${created.instance.id}/actions`)
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        action: 'reassign',
        targetWorkerId: secondaryWorkerId,
      });

    expect(reassignResponse.status).toBe(201);
    expect(reassignResponse.body.operation).toBeNull();

    const adminDetailResponse = await request(app.getHttpServer())
      .get(`/api/v1/admin/instances/${created.instance.id}`)
      .set('authorization', `Bearer ${adminToken}`);

    expect(adminDetailResponse.status).toBe(200);
    expect(adminDetailResponse.body.instance.assignedWorkerId).toBe(
      secondaryWorkerId,
    );
    expect(adminDetailResponse.body.instance.status).toBe('standby');
    expect(adminDetailResponse.body.instance.substatus).toBe('reassigned');
    expect(
      adminDetailResponse.body.events.some(
        (event: { eventType: string }) => event.eventType === 'worker_assigned',
      ),
    ).toBe(true);
  });

  it('serves screenshot assets and exposes takeover as a conflict action', async () => {
    const customerToken = await login(
      app,
      process.env.DEV_BOOTSTRAP_CUSTOMER_EMAIL,
      process.env.DEV_BOOTSTRAP_CUSTOMER_PASSWORD,
    );
    const adminToken = await login(
      app,
      process.env.DEV_BOOTSTRAP_ADMIN_EMAIL,
      process.env.DEV_BOOTSTRAP_ADMIN_PASSWORD,
    );

    const meResponse = await request(app.getHttpServer())
      .get('/api/v1/account/me')
      .set('authorization', `Bearer ${customerToken}`);

    expect(meResponse.status).toBe(200);
    const workspaceId = meResponse.body.workspaces[0].id as string;
    const created = await createInstance(
      app,
      customerToken,
      workspaceId,
      'Phase 2 Screenshot Receiver',
    );
    createdInstanceIds.push(created.instance.id);

    const screenshotPath = resolve(
      '/Volumes/MACOS/EliteMessage/.runtime/test-screenshots',
      `${created.instance.publicId}-${Date.now().toString(36)}.png`,
    );
    createdArtifactPaths.push(screenshotPath);
    await mkdir(dirname(screenshotPath), { recursive: true });
    await writeFile(
      screenshotPath,
      Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9s5xGX0AAAAASUVORK5CYII=',
        'base64',
      ),
    );

    await prisma.instanceRuntimeState.update({
      where: {
        instanceId: created.instance.id,
      },
      data: {
        lastScreenshotAt: new Date(),
        lastScreenshotPath: screenshotPath,
      },
    });

    const customerScreenshotResponse = await request(app.getHttpServer())
      .get(`/api/v1/customer/instances/${created.instance.id}/screenshot`)
      .set('authorization', `Bearer ${customerToken}`);

    expect(customerScreenshotResponse.status).toBe(200);
    expect(customerScreenshotResponse.headers['content-type']).toContain(
      'image/png',
    );
    expect(customerScreenshotResponse.body.length).toBeGreaterThan(20);

    const adminScreenshotResponse = await request(app.getHttpServer())
      .get(`/api/v1/admin/instances/${created.instance.id}/screenshot`)
      .set('authorization', `Bearer ${adminToken}`);

    expect(adminScreenshotResponse.status).toBe(200);
    expect(adminScreenshotResponse.headers['content-type']).toContain(
      'image/png',
    );
    expect(adminScreenshotResponse.body.length).toBeGreaterThan(20);

    await request(app.getHttpServer())
      .post('/api/v1/internal/workers/register')
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'online',
        region: 'local',
        uptimeSeconds: 30,
        activeInstanceCount: 0,
        timestamp: new Date().toISOString(),
      })
      .expect(200);

    const startActionResponse = await request(app.getHttpServer())
      .post(`/api/v1/customer/instances/${created.instance.id}/actions`)
      .set('authorization', `Bearer ${customerToken}`)
      .send({
        action: 'start',
      });

    expect(startActionResponse.status).toBe(201);
    const operationId = startActionResponse.body.operation.id as string;

    await request(app.getHttpServer())
      .post(`/api/v1/internal/workers/${testWorkerId}/claim-next`)
      .set('authorization', `Bearer ${getInternalToken()}`)
      .expect(200);

    await request(app.getHttpServer())
      .post(
        `/api/v1/internal/instances/${created.instance.id}/operations/${operationId}/status`,
      )
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'running',
        message: 'Worker accepted the start action.',
      })
      .expect(200);

    await request(app.getHttpServer())
      .post(`/api/v1/internal/instances/${created.instance.id}/status`)
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'authenticated',
        substatus: 'connected',
        message: 'Session connected before conflict.',
      })
      .expect(200);

    await request(app.getHttpServer())
      .post(
        `/api/v1/internal/instances/${created.instance.id}/operations/${operationId}/status`,
      )
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'completed',
        message: 'Start action completed.',
      })
      .expect(200);

    await request(app.getHttpServer())
      .post(`/api/v1/internal/instances/${created.instance.id}/status`)
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'disconnected',
        substatus: 'conflict',
        message: 'WhatsApp Web reported a linked-device conflict.',
      })
      .expect(200);

    const takeoverResponse = await request(app.getHttpServer())
      .post(`/api/v1/customer/instances/${created.instance.id}/actions`)
      .set('authorization', `Bearer ${customerToken}`)
      .send({
        action: 'takeover',
      });

    expect(takeoverResponse.status).toBe(201);
    expect(takeoverResponse.body.operation.action).toBe('takeover');
    expect(takeoverResponse.body.operation.status).toBe('pending');
  });

  it('supports message statistics, resend-by-id, resend-by-status, and clear-by-status', async () => {
    const customerToken = await login(
      app,
      process.env.DEV_BOOTSTRAP_CUSTOMER_EMAIL,
      process.env.DEV_BOOTSTRAP_CUSTOMER_PASSWORD,
    );

    const meResponse = await request(app.getHttpServer())
      .get('/api/v1/account/me')
      .set('authorization', `Bearer ${customerToken}`);

    expect(meResponse.status).toBe(200);
    const workspaceId = meResponse.body.workspaces[0].id as string;
    const created = await createInstance(
      app,
      customerToken,
      workspaceId,
      'Phase 3 Message Controls',
    );
    createdInstanceIds.push(created.instance.id);

    const queueResponse = await request(app.getHttpServer())
      .post(`/api/v1/customer/instances/${created.instance.id}/messages/chat`)
      .set('authorization', `Bearer ${customerToken}`)
      .send({
        to: '15550000001',
        body: 'Queued message',
      });

    expect(queueResponse.status).toBe(201);

    const sentResponse = await request(app.getHttpServer())
      .post(`/api/v1/customer/instances/${created.instance.id}/messages/chat`)
      .set('authorization', `Bearer ${customerToken}`)
      .send({
        to: '15550000002',
        body: 'Sent message',
      });

    expect(sentResponse.status).toBe(201);

    const unsentResponse = await request(app.getHttpServer())
      .post(`/api/v1/customer/instances/${created.instance.id}/messages/chat`)
      .set('authorization', `Bearer ${customerToken}`)
      .send({
        to: '15550000003',
        body: 'Unsent message',
      });

    expect(unsentResponse.status).toBe(201);

    const invalidResponse = await request(app.getHttpServer())
      .post(`/api/v1/customer/instances/${created.instance.id}/messages/image`)
      .set('authorization', `Bearer ${customerToken}`)
      .send({
        to: '15550000004',
        imageUrl: 'https://example.com/asset.png',
        caption: 'Invalid message',
      });

    expect(invalidResponse.status).toBe(201);

    const expiredResponse = await request(app.getHttpServer())
      .post(`/api/v1/customer/instances/${created.instance.id}/messages/chat`)
      .set('authorization', `Bearer ${customerToken}`)
      .send({
        to: '15550000005',
        body: 'Expired message',
      });

    expect(expiredResponse.status).toBe(201);

    const now = new Date();
    await prisma.outboundMessage.update({
      where: {
        id: sentResponse.body.message.id,
      },
      data: {
        status: 'sent',
        ack: 'device',
        workerId: testWorkerId,
        providerMessageId: 'provider-sent-1',
        sentAt: now,
        acknowledgedAt: now,
      },
    });

    await prisma.outboundMessage.update({
      where: {
        id: unsentResponse.body.message.id,
      },
      data: {
        status: 'unsent',
        errorMessage: 'Worker send failed.',
      },
    });

    await prisma.outboundMessage.update({
      where: {
        id: invalidResponse.body.message.id,
      },
      data: {
        status: 'invalid',
        errorMessage: 'Invalid recipient.',
      },
    });

    await prisma.outboundMessage.update({
      where: {
        id: expiredResponse.body.message.id,
      },
      data: {
        status: 'expired',
        errorMessage: 'Message expired in queue.',
      },
    });

    const statisticsResponse = await request(app.getHttpServer())
      .get(
        `/api/v1/customer/instances/${created.instance.id}/messages/statistics`,
      )
      .set('authorization', `Bearer ${customerToken}`);

    expect(statisticsResponse.status).toBe(200);
    expect(statisticsResponse.body.counts).toMatchObject({
      queue: 1,
      sent: 1,
      unsent: 1,
      invalid: 1,
      expired: 1,
      total: 5,
    });

    const resendByIdResponse = await request(app.getHttpServer())
      .post(
        `/api/v1/customer/instances/${created.instance.id}/messages/${invalidResponse.body.message.id}/resend`,
      )
      .set('authorization', `Bearer ${customerToken}`)
      .send({});

    expect(resendByIdResponse.status).toBe(200);
    expect(resendByIdResponse.body.message.status).toBe('queue');
    expect(resendByIdResponse.body.message.ack).toBe('pending');
    expect(resendByIdResponse.body.message.errorMessage).toBeNull();

    const statisticsAfterIdResend = await request(app.getHttpServer())
      .get(
        `/api/v1/customer/instances/${created.instance.id}/messages/statistics`,
      )
      .set('authorization', `Bearer ${customerToken}`);

    expect(statisticsAfterIdResend.status).toBe(200);
    expect(statisticsAfterIdResend.body.counts).toMatchObject({
      queue: 2,
      sent: 1,
      unsent: 1,
      invalid: 0,
      expired: 1,
      total: 5,
    });

    const resendByStatusResponse = await request(app.getHttpServer())
      .post(
        `/api/v1/customer/instances/${created.instance.id}/messages/resend-by-status`,
      )
      .set('authorization', `Bearer ${customerToken}`)
      .send({
        status: 'unsent',
      });

    expect(resendByStatusResponse.status).toBe(200);
    expect(resendByStatusResponse.body.requeuedCount).toBe(1);

    const statisticsAfterStatusResend = await request(app.getHttpServer())
      .get(
        `/api/v1/customer/instances/${created.instance.id}/messages/statistics`,
      )
      .set('authorization', `Bearer ${customerToken}`);

    expect(statisticsAfterStatusResend.status).toBe(200);
    expect(statisticsAfterStatusResend.body.counts).toMatchObject({
      queue: 3,
      sent: 1,
      unsent: 0,
      invalid: 0,
      expired: 1,
      total: 5,
    });

    const clearResponse = await request(app.getHttpServer())
      .post(`/api/v1/customer/instances/${created.instance.id}/messages/clear`)
      .set('authorization', `Bearer ${customerToken}`)
      .send({
        status: 'expired',
      });

    expect(clearResponse.status).toBe(200);
    expect(clearResponse.body.clearedCount).toBe(1);

    const finalStatisticsResponse = await request(app.getHttpServer())
      .get(
        `/api/v1/customer/instances/${created.instance.id}/messages/statistics`,
      )
      .set('authorization', `Bearer ${customerToken}`);

    expect(finalStatisticsResponse.status).toBe(200);
    expect(finalStatisticsResponse.body.counts).toMatchObject({
      queue: 3,
      sent: 1,
      unsent: 0,
      invalid: 0,
      expired: 0,
      total: 4,
    });
  });

  it('supports outbound message queueing, worker claims, ack updates, and webhook persistence', async () => {
    const customerToken = await login(
      app,
      process.env.DEV_BOOTSTRAP_CUSTOMER_EMAIL,
      process.env.DEV_BOOTSTRAP_CUSTOMER_PASSWORD,
    );
    const adminToken = await login(
      app,
      process.env.DEV_BOOTSTRAP_ADMIN_EMAIL,
      process.env.DEV_BOOTSTRAP_ADMIN_PASSWORD,
    );

    const meResponse = await request(app.getHttpServer())
      .get('/api/v1/account/me')
      .set('authorization', `Bearer ${customerToken}`);

    expect(meResponse.status).toBe(200);
    const workspaceId = meResponse.body.workspaces[0].id as string;
    const created = await createInstance(
      app,
      customerToken,
      workspaceId,
      'Phase 2B Queue Sender',
    );
    createdInstanceIds.push(created.instance.id);

    await request(app.getHttpServer())
      .patch(`/api/v1/customer/instances/${created.instance.id}/settings`)
      .set('authorization', `Bearer ${customerToken}`)
      .send({
        sendDelay: 1,
        sendDelayMax: 15,
        webhookUrl: 'http://127.0.0.1:9/webhook',
        webhookMessageReceived: false,
        webhookMessageCreate: true,
        webhookMessageAck: true,
      })
      .expect(200);

    const actionResponse = await request(app.getHttpServer())
      .post(`/api/v1/customer/instances/${created.instance.id}/actions`)
      .set('authorization', `Bearer ${customerToken}`)
      .send({
        action: 'start',
      });

    expect(actionResponse.status).toBe(201);
    const operationId = actionResponse.body.operation.id as string;

    await request(app.getHttpServer())
      .post('/api/v1/internal/workers/register')
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'online',
        region: 'local',
        uptimeSeconds: 60,
        activeInstanceCount: 0,
        timestamp: new Date().toISOString(),
      })
      .expect(200);

    const claimInstanceResponse = await request(app.getHttpServer())
      .post(`/api/v1/internal/workers/${testWorkerId}/claim-next`)
      .set('authorization', `Bearer ${getInternalToken()}`);

    expect(claimInstanceResponse.status).toBe(200);
    expect(claimInstanceResponse.body.assignedInstance.id).toBe(
      created.instance.id,
    );

    await request(app.getHttpServer())
      .post(
        `/api/v1/internal/instances/${created.instance.id}/operations/${operationId}/status`,
      )
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'running',
        message: 'Worker accepted the start action.',
      })
      .expect(200);

    await request(app.getHttpServer())
      .post(`/api/v1/internal/instances/${created.instance.id}/status`)
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'authenticated',
        substatus: 'placeholder_linked',
        message: 'Placeholder session linked automatically.',
      })
      .expect(200);

    await request(app.getHttpServer())
      .post(`/api/v1/internal/instances/${created.instance.id}/runtime`)
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        qrCode: null,
        qrExpiresAt: null,
        currentSessionLabel: 'session-phase2b',
        lastStartedAt: new Date().toISOString(),
        lastAuthenticatedAt: new Date().toISOString(),
        disconnectReason: null,
      })
      .expect(200);

    await request(app.getHttpServer())
      .post(
        `/api/v1/internal/instances/${created.instance.id}/operations/${operationId}/status`,
      )
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'completed',
        message: 'Start action completed in placeholder runtime.',
      })
      .expect(200);

    const sendResponse = await request(app.getHttpServer())
      .post(`/api/v1/customer/instances/${created.instance.id}/messages/chat`)
      .set('authorization', `Bearer ${customerToken}`)
      .send({
        to: '963944556677',
        body: 'Phase 2B placeholder message',
        referenceId: 'phase2b-chat',
        priority: 10,
      });

    expect(sendResponse.status).toBe(201);
    expect(sendResponse.body.message.status).toBe('queue');
    expect(sendResponse.body.message.ack).toBe('pending');
    const messageId = sendResponse.body.message.id as string;

    const claimMessageResponse = await request(app.getHttpServer())
      .post(
        `/api/v1/internal/instances/${created.instance.id}/messages/claim-next`,
      )
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
      });

    expect(claimMessageResponse.status).toBe(200);
    expect(claimMessageResponse.body.message.id).toBe(messageId);
    expect(claimMessageResponse.body.message.status).toBe('queue');

    const sentUpdateResponse = await request(app.getHttpServer())
      .post(
        `/api/v1/internal/instances/${created.instance.id}/messages/${messageId}/status`,
      )
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'sent',
        ack: 'server',
        providerMessageId: 'provider-phase2b',
        message: 'Placeholder runtime accepted the outbound message.',
      });

    expect(sentUpdateResponse.status).toBe(200);
    expect(sentUpdateResponse.body.status).toBe('sent');
    expect(sentUpdateResponse.body.ack).toBe('server');

    const deviceAckResponse = await request(app.getHttpServer())
      .post(
        `/api/v1/internal/instances/${created.instance.id}/messages/${messageId}/status`,
      )
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        ack: 'device',
        message: 'Placeholder device acknowledgement received.',
      });

    expect(deviceAckResponse.status).toBe(200);
    expect(deviceAckResponse.body.status).toBe('sent');
    expect(deviceAckResponse.body.ack).toBe('device');

    const customerMessagesResponse = await request(app.getHttpServer())
      .get(`/api/v1/customer/instances/${created.instance.id}/messages`)
      .set('authorization', `Bearer ${customerToken}`);

    expect(customerMessagesResponse.status).toBe(200);
    expect(
      customerMessagesResponse.body.items.some(
        (message: { id: string; status: string; ack: string }) =>
          message.id === messageId &&
          message.status === 'sent' &&
          message.ack === 'device',
      ),
    ).toBe(true);

    const adminMessagesResponse = await request(app.getHttpServer())
      .get(
        `/api/v1/admin/messages?instanceId=${encodeURIComponent(created.instance.id)}`,
      )
      .set('authorization', `Bearer ${adminToken}`);

    expect(adminMessagesResponse.status).toBe(200);
    expect(
      adminMessagesResponse.body.items.some(
        (message: { id: string; providerMessageId: string }) =>
          message.id === messageId &&
          message.providerMessageId === 'provider-phase2b',
      ),
    ).toBe(true);

    const webhookResponse = await request(app.getHttpServer())
      .get(
        `/api/v1/customer/instances/${created.instance.id}/webhook-deliveries`,
      )
      .set('authorization', `Bearer ${customerToken}`);

    expect(webhookResponse.status).toBe(200);
    expect(
      webhookResponse.body.items.some(
        (delivery: { eventType: string }) =>
          delivery.eventType === 'message_create',
      ),
    ).toBe(true);
    expect(
      webhookResponse.body.items.some(
        (delivery: { eventType: string }) =>
          delivery.eventType === 'message_ack',
      ),
    ).toBe(true);
    expect(
      webhookResponse.body.items.every(
        (delivery: { messageId: string | null; status: string }) =>
          delivery.messageId === messageId &&
          ['failed', 'pending', 'delivered', 'exhausted'].includes(
            delivery.status,
          ),
      ),
    ).toBe(true);
  }, 20_000);

  it('supports inbound message persistence, received webhooks, and runtime backend diagnostics', async () => {
    const customerToken = await login(
      app,
      process.env.DEV_BOOTSTRAP_CUSTOMER_EMAIL,
      process.env.DEV_BOOTSTRAP_CUSTOMER_PASSWORD,
    );
    const adminToken = await login(
      app,
      process.env.DEV_BOOTSTRAP_ADMIN_EMAIL,
      process.env.DEV_BOOTSTRAP_ADMIN_PASSWORD,
    );

    const meResponse = await request(app.getHttpServer())
      .get('/api/v1/account/me')
      .set('authorization', `Bearer ${customerToken}`);

    expect(meResponse.status).toBe(200);
    const workspaceId = meResponse.body.workspaces[0].id as string;
    const created = await createInstance(
      app,
      customerToken,
      workspaceId,
      'Phase 3A Inbound Receiver',
    );
    createdInstanceIds.push(created.instance.id);

    await request(app.getHttpServer())
      .patch(`/api/v1/customer/instances/${created.instance.id}/settings`)
      .set('authorization', `Bearer ${customerToken}`)
      .send({
        sendDelay: 1,
        sendDelayMax: 15,
        webhookUrl: 'http://127.0.0.1:9/inbound-webhook',
        webhookMessageReceived: true,
        webhookMessageCreate: false,
        webhookMessageAck: false,
      })
      .expect(200);

    const actionResponse = await request(app.getHttpServer())
      .post(`/api/v1/customer/instances/${created.instance.id}/actions`)
      .set('authorization', `Bearer ${customerToken}`)
      .send({
        action: 'start',
      });

    expect(actionResponse.status).toBe(201);
    const operationId = actionResponse.body.operation.id as string;

    await request(app.getHttpServer())
      .post('/api/v1/internal/workers/register')
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'online',
        region: 'local',
        uptimeSeconds: 90,
        activeInstanceCount: 0,
        timestamp: new Date().toISOString(),
      })
      .expect(200);

    await request(app.getHttpServer())
      .post(`/api/v1/internal/workers/${testWorkerId}/claim-next`)
      .set('authorization', `Bearer ${getInternalToken()}`)
      .expect(200);

    await request(app.getHttpServer())
      .post(
        `/api/v1/internal/instances/${created.instance.id}/operations/${operationId}/status`,
      )
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'running',
        message: 'Worker accepted the start action.',
      })
      .expect(200);

    await request(app.getHttpServer())
      .post(`/api/v1/internal/instances/${created.instance.id}/status`)
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'authenticated',
        substatus: 'placeholder_linked',
        message: 'Placeholder session linked automatically.',
      })
      .expect(200);

    const runtimeUpdateResponse = await request(app.getHttpServer())
      .post(`/api/v1/internal/instances/${created.instance.id}/runtime`)
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        sessionBackend: 'placeholder',
        currentSessionLabel: 'session-phase3a',
        sessionDiagnostics: {
          backend: 'placeholder',
          phase: 'ready',
          workerId: testWorkerId,
        },
        lastStartedAt: new Date().toISOString(),
        lastAuthenticatedAt: new Date().toISOString(),
        lastScreenshotAt: new Date().toISOString(),
        lastScreenshotPath:
          '/Volumes/MACOS/EliteMessage/.runtime/test-phase3a.png',
        disconnectReason: null,
      });

    expect(runtimeUpdateResponse.status).toBe(200);
    expect(runtimeUpdateResponse.body.sessionBackend).toBe('placeholder');
    expect(runtimeUpdateResponse.body.lastScreenshotPath).toBe(
      '/Volumes/MACOS/EliteMessage/.runtime/test-phase3a.png',
    );

    await request(app.getHttpServer())
      .post(
        `/api/v1/internal/instances/${created.instance.id}/operations/${operationId}/status`,
      )
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'completed',
        message: 'Start action completed in placeholder runtime.',
      })
      .expect(200);

    const receivedAt = new Date().toISOString();
    const inboundResponse = await request(app.getHttpServer())
      .post(
        `/api/v1/internal/instances/${created.instance.id}/messages/received`,
      )
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        providerMessageId: 'provider-inbound-phase3a',
        chatId: '963944556677@c.us',
        sender: '963944556677@c.us',
        pushName: 'Phase 3A Sender',
        kind: 'chat',
        body: 'Inbound hello from phase 3A',
        mediaUrl:
          '/Volumes/MACOS/EliteMessage/.runtime/test-media/inbound-image.jpg',
        mimeType: 'image/jpeg',
        receivedAt,
        rawPayload: {
          type: 'chat',
          from: '963944556677@c.us',
        },
      });

    expect(inboundResponse.status).toBe(200);
    expect(inboundResponse.body.sender).toBe('963944556677@c.us');
    expect(inboundResponse.body.kind).toBe('chat');
    expect(inboundResponse.body.mediaUrl).toBe(
      '/Volumes/MACOS/EliteMessage/.runtime/test-media/inbound-image.jpg',
    );
    expect(inboundResponse.body.mimeType).toBe('image/jpeg');

    const customerInboundResponse = await request(app.getHttpServer())
      .get(`/api/v1/customer/instances/${created.instance.id}/inbound-messages`)
      .set('authorization', `Bearer ${customerToken}`);

    expect(customerInboundResponse.status).toBe(200);
    expect(
      customerInboundResponse.body.items.some(
        (message: { providerMessageId: string; sender: string }) =>
          message.providerMessageId === 'provider-inbound-phase3a' &&
          message.sender === '963944556677@c.us',
      ),
    ).toBe(true);

    const adminInboundResponse = await request(app.getHttpServer())
      .get(
        `/api/v1/admin/inbound-messages?instanceId=${encodeURIComponent(created.instance.id)}`,
      )
      .set('authorization', `Bearer ${adminToken}`);

    expect(adminInboundResponse.status).toBe(200);
    expect(adminInboundResponse.body.items[0].providerMessageId).toBe(
      'provider-inbound-phase3a',
    );

    const customerDetailResponse = await request(app.getHttpServer())
      .get(`/api/v1/customer/instances/${created.instance.id}`)
      .set('authorization', `Bearer ${customerToken}`);

    expect(customerDetailResponse.status).toBe(200);
    expect(customerDetailResponse.body.runtime.sessionBackend).toBe(
      'placeholder',
    );
    expect(customerDetailResponse.body.runtime.sessionDiagnostics.backend).toBe(
      'placeholder',
    );
    expect(customerDetailResponse.body.runtime.sessionDiagnostics.phase).toBe(
      'ready',
    );
    expect(
      customerDetailResponse.body.runtime.lastInboundMessageAt,
    ).not.toBeNull();
    expect(customerDetailResponse.body.runtime.lastScreenshotPath).toBe(
      '/Volumes/MACOS/EliteMessage/.runtime/test-phase3a.png',
    );

    const webhookResponse = await request(app.getHttpServer())
      .get(
        `/api/v1/customer/instances/${created.instance.id}/webhook-deliveries`,
      )
      .set('authorization', `Bearer ${customerToken}`);

    expect(webhookResponse.status).toBe(200);
    expect(
      webhookResponse.body.items.some(
        (delivery: { eventType: string }) =>
          delivery.eventType === 'message_received',
      ),
    ).toBe(true);
  }, 20_000);

  it('exposes the public per-instance developer API with token and bearer authentication', async () => {
    const customerToken = await login(
      app,
      process.env.DEV_BOOTSTRAP_CUSTOMER_EMAIL,
      process.env.DEV_BOOTSTRAP_CUSTOMER_PASSWORD,
    );

    const meResponse = await request(app.getHttpServer())
      .get('/api/v1/account/me')
      .set('authorization', `Bearer ${customerToken}`);

    expect(meResponse.status).toBe(200);
    const workspaceId = meResponse.body.workspaces[0].id as string;
    const created = await createInstance(
      app,
      customerToken,
      workspaceId,
      'Phase Public API Sender',
    );
    createdInstanceIds.push(created.instance.id);

    const screenshotPath = resolve(
      '/Volumes/MACOS/EliteMessage/.runtime/test-public-screenshots',
      `${created.instance.publicId}-${Date.now().toString(36)}.png`,
    );
    createdArtifactPaths.push(screenshotPath);
    await mkdir(dirname(screenshotPath), { recursive: true });
    await writeFile(
      screenshotPath,
      Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9s5xGX0AAAAASUVORK5CYII=',
        'base64',
      ),
    );

    const now = new Date();
    await prisma.instance.update({
      where: {
        id: created.instance.id,
      },
      data: {
        status: 'authenticated',
        substatus: 'connected',
      },
    });

    await prisma.instanceRuntimeState.update({
      where: {
        instanceId: created.instance.id,
      },
      data: {
        qrCode: 'ELITE-PUBLIC-QR|READY',
        qrExpiresAt: new Date(Date.now() + 60_000),
        currentSessionLabel: 'public-session-963944556677',
        sessionBackend: 'placeholder',
        sessionDiagnostics: {
          backend: 'placeholder',
          phase: 'ready',
          me: {
            wid: '963944556677@c.us',
          },
        },
        lastAuthenticatedAt: now,
        lastScreenshotAt: now,
        lastScreenshotPath: screenshotPath,
        disconnectReason: null,
      },
    });

    const statusResponse = await request(app.getHttpServer()).get(
      `/instance/${created.instance.publicId}/instance/status?token=${encodeURIComponent(created.instanceApiToken)}`,
    );

    expect(statusResponse.status).toBe(200);
    expect(statusResponse.body.publicId).toBe(created.instance.publicId);
    expect(statusResponse.body.status).toBe('authenticated');
    expect(statusResponse.body.qrReady).toBe(true);

    const settingsResponse = await request(app.getHttpServer())
      .get(`/instance/${created.instance.publicId}/instance/settings`)
      .set('authorization', `Bearer ${created.instanceApiToken}`);

    expect(settingsResponse.status).toBe(200);
    expect(settingsResponse.body.sendDelay).toBe(1);

    const updatedSettingsResponse = await request(app.getHttpServer())
      .post(
        `/instance/${created.instance.publicId}/instance/settings?token=${encodeURIComponent(created.instanceApiToken)}`,
      )
      .send({
        sendDelaySeconds: 4,
        sendDelayMaxSeconds: 9,
        webhookUrl: 'https://example.com/public-webhook',
        webhookMessageCreate: true,
      });

    expect(updatedSettingsResponse.status).toBe(200);
    expect(updatedSettingsResponse.body.settings.sendDelay).toBe(4);
    expect(updatedSettingsResponse.body.settings.sendDelayMax).toBe(9);
    expect(updatedSettingsResponse.body.settings.webhookUrl).toBe(
      'https://example.com/public-webhook',
    );

    const mePublicResponse = await request(app.getHttpServer())
      .get(`/instance/${created.instance.publicId}/instance/me`)
      .set('authorization', `Bearer ${created.instanceApiToken}`);

    expect(mePublicResponse.status).toBe(200);
    expect(mePublicResponse.body.currentSessionLabel).toBe(
      'public-session-963944556677',
    );
    expect(mePublicResponse.body.connected).toBe(true);

    const qrCodeResponse = await request(app.getHttpServer()).get(
      `/instance/${created.instance.publicId}/instance/qrCode?token=${encodeURIComponent(created.instanceApiToken)}`,
    );

    expect(qrCodeResponse.status).toBe(200);
    expect(qrCodeResponse.body.qrCode).toBe('ELITE-PUBLIC-QR|READY');

    const qrImageResponse = await request(app.getHttpServer())
      .get(`/instance/${created.instance.publicId}/instance/qr`)
      .set('authorization', `Bearer ${created.instanceApiToken}`);

    expect(qrImageResponse.status).toBe(200);
    expect(qrImageResponse.headers['content-type']).toContain('image/png');
    expect(qrImageResponse.body.length).toBeGreaterThan(100);

    const screenshotResponse = await request(app.getHttpServer()).get(
      `/instance/${created.instance.publicId}/instance/screenshot?token=${encodeURIComponent(created.instanceApiToken)}&encoding=base64`,
    );

    expect(screenshotResponse.status).toBe(200);
    expect(screenshotResponse.body.filename).toContain(
      created.instance.publicId,
    );
    expect(screenshotResponse.body.mimeType).toBe('image/png');
    expect(screenshotResponse.body.data.length).toBeGreaterThan(20);

    const startResponse = await request(app.getHttpServer())
      .post(`/instance/${created.instance.publicId}/instance/start`)
      .set('authorization', `Bearer ${created.instanceApiToken}`);

    expect(startResponse.status).toBe(200);
    expect(startResponse.body.instanceId).toBe(created.instance.id);

    await prisma.instanceOperation.deleteMany({
      where: {
        instanceId: created.instance.id,
      },
    });

    const chatResponse = await request(app.getHttpServer())
      .post(
        `/instance/${created.instance.publicId}/messages/chat?token=${encodeURIComponent(created.instanceApiToken)}`,
      )
      .send({
        to: '963944556677',
        body: 'Public API hello',
        referenceId: 'pub-chat-1',
        priority: 3,
      });

    expect(chatResponse.status).toBe(201);
    expect(chatResponse.body.message.referenceId).toBe('pub-chat-1');

    const imageResponse = await request(app.getHttpServer())
      .post(`/instance/${created.instance.publicId}/messages/image`)
      .set('authorization', `Bearer ${created.instanceApiToken}`)
      .send({
        to: '963944556677',
        image: 'https://example.com/public-image.png',
        caption: 'Public API image',
        referenceId: 'pub-image-1',
        priority: 4,
      });

    expect(imageResponse.status).toBe(201);
    expect(imageResponse.body.message.mediaUrl).toBe(
      'https://example.com/public-image.png',
    );

    await prisma.outboundMessage.update({
      where: {
        id: chatResponse.body.message.id,
      },
      data: {
        status: 'sent',
        ack: 'device',
      },
    });

    await prisma.outboundMessage.update({
      where: {
        id: imageResponse.body.message.id,
      },
      data: {
        status: 'invalid',
        ack: 'pending',
      },
    });

    const listResponse = await request(app.getHttpServer()).get(
      `/instance/${created.instance.publicId}/messages?token=${encodeURIComponent(created.instanceApiToken)}&status=sent&ack=device&id=${encodeURIComponent(chatResponse.body.message.publicMessageId)}`,
    );

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.items).toHaveLength(1);
    expect(listResponse.body.items[0].publicMessageId).toBe(
      chatResponse.body.message.publicMessageId,
    );

    const statisticsResponse = await request(app.getHttpServer())
      .get(`/instance/${created.instance.publicId}/messages/statistics`)
      .set('authorization', `Bearer ${created.instanceApiToken}`);

    expect(statisticsResponse.status).toBe(200);
    expect(statisticsResponse.body.counts.sent).toBe(1);
    expect(statisticsResponse.body.counts.invalid).toBe(1);

    const resendByIdResponse = await request(app.getHttpServer())
      .post(
        `/instance/${created.instance.publicId}/messages/resendById?token=${encodeURIComponent(created.instanceApiToken)}`,
      )
      .send({
        id: chatResponse.body.message.publicMessageId,
      });

    expect(resendByIdResponse.status).toBe(200);
    expect(resendByIdResponse.body.message.status).toBe('queue');

    const resendByStatusResponse = await request(app.getHttpServer())
      .post(`/instance/${created.instance.publicId}/messages/resendByStatus`)
      .set('authorization', `Bearer ${created.instanceApiToken}`)
      .send({
        status: 'invalid',
      });

    expect(resendByStatusResponse.status).toBe(200);
    expect(resendByStatusResponse.body.requeuedCount).toBe(1);

    const clearResponse = await request(app.getHttpServer())
      .post(
        `/instance/${created.instance.publicId}/messages/clear?token=${encodeURIComponent(created.instanceApiToken)}`,
      )
      .send({
        status: 'queue',
      });

    expect(clearResponse.status).toBe(200);
    expect(clearResponse.body.clearedCount).toBeGreaterThanOrEqual(2);
  }, 30_000);

  it('supports admin overview access', async () => {
    const registerResponse = await request(app.getHttpServer())
      .post('/api/v1/internal/workers/register')
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'online',
        region: 'local',
        uptimeSeconds: 30,
        activeInstanceCount: 0,
        timestamp: new Date().toISOString(),
      });

    expect(registerResponse.status).toBe(200);

    const accessToken = await login(
      app,
      process.env.DEV_BOOTSTRAP_ADMIN_EMAIL,
      process.env.DEV_BOOTSTRAP_ADMIN_PASSWORD,
    );

    const overviewResponse = await request(app.getHttpServer())
      .get('/api/v1/admin/overview')
      .set('authorization', `Bearer ${accessToken}`);

    expect(overviewResponse.status).toBe(200);
    expect(overviewResponse.body.counts.users).toBeGreaterThanOrEqual(2);
    expect(overviewResponse.body.workers.length).toBeGreaterThanOrEqual(1);
  }, 10_000);

  it('supports admin user and workspace management routes', async () => {
    const signupResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/signup')
      .send({
        email: `phase5-admin-${Date.now()}@elite.local`,
        password: 'Customer123456!',
        displayName: 'Phase Five Customer',
        workspaceName: 'Phase Five Workspace',
      });

    expect(signupResponse.status).toBe(201);
    createdUserIds.push(signupResponse.body.user.id);
    createdWorkspaceIds.push(signupResponse.body.workspaces[0].id);

    const adminToken = await login(
      app,
      process.env.DEV_BOOTSTRAP_ADMIN_EMAIL,
      process.env.DEV_BOOTSTRAP_ADMIN_PASSWORD,
    );

    const usersResponse = await request(app.getHttpServer())
      .get('/api/v1/admin/users')
      .set('authorization', `Bearer ${adminToken}`);

    expect(usersResponse.status).toBe(200);
    expect(
      usersResponse.body.items.some(
        (user: { id: string }) => user.id === signupResponse.body.user.id,
      ),
    ).toBe(true);

    const userDetailResponse = await request(app.getHttpServer())
      .get(`/api/v1/admin/users/${signupResponse.body.user.id}`)
      .set('authorization', `Bearer ${adminToken}`);

    expect(userDetailResponse.status).toBe(200);
    expect(userDetailResponse.body.workspaces[0].workspaceId).toBe(
      signupResponse.body.workspaces[0].id,
    );

    const suspendUserResponse = await request(app.getHttpServer())
      .patch(`/api/v1/admin/users/${signupResponse.body.user.id}/status`)
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        status: 'suspended',
      });

    expect(suspendUserResponse.status).toBe(200);
    expect(suspendUserResponse.body.user.status).toBe('suspended');

    const reactivateUserResponse = await request(app.getHttpServer())
      .patch(`/api/v1/admin/users/${signupResponse.body.user.id}/status`)
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        status: 'active',
      });

    expect(reactivateUserResponse.status).toBe(200);
    expect(reactivateUserResponse.body.user.status).toBe('active');

    const workspacesResponse = await request(app.getHttpServer())
      .get('/api/v1/admin/workspaces')
      .set('authorization', `Bearer ${adminToken}`);

    expect(workspacesResponse.status).toBe(200);
    expect(
      workspacesResponse.body.items.some(
        (workspace: { id: string }) =>
          workspace.id === signupResponse.body.workspaces[0].id,
      ),
    ).toBe(true);

    const workspaceDetailResponse = await request(app.getHttpServer())
      .get(`/api/v1/admin/workspaces/${signupResponse.body.workspaces[0].id}`)
      .set('authorization', `Bearer ${adminToken}`);

    expect(workspaceDetailResponse.status).toBe(200);
    expect(workspaceDetailResponse.body.members[0].userId).toBe(
      signupResponse.body.user.id,
    );

    const suspendWorkspaceResponse = await request(app.getHttpServer())
      .patch(
        `/api/v1/admin/workspaces/${signupResponse.body.workspaces[0].id}/status`,
      )
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        status: 'suspended',
      });

    expect(suspendWorkspaceResponse.status).toBe(200);
    expect(suspendWorkspaceResponse.body.workspace.status).toBe('suspended');

    const reactivateWorkspaceResponse = await request(app.getHttpServer())
      .patch(
        `/api/v1/admin/workspaces/${signupResponse.body.workspaces[0].id}/status`,
      )
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        status: 'active',
      });

    expect(reactivateWorkspaceResponse.status).toBe(200);
    expect(reactivateWorkspaceResponse.body.workspace.status).toBe('active');
  }, 20_000);

  it('supports admin worker detail, support cases, and audit exploration', async () => {
    const signupResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/signup')
      .send({
        email: `phase5-support-${Date.now()}@elite.local`,
        password: 'Customer123456!',
        displayName: 'Support Target',
        workspaceName: 'Support Workspace',
      });

    expect(signupResponse.status).toBe(201);
    createdUserIds.push(signupResponse.body.user.id);
    createdWorkspaceIds.push(signupResponse.body.workspaces[0].id);

    const customerToken = signupResponse.body.accessToken as string;
    const created = await createInstance(
      app,
      customerToken,
      signupResponse.body.workspaces[0].id,
      'Support Instance',
    );
    createdInstanceIds.push(created.instance.id);

    await request(app.getHttpServer())
      .post('/api/v1/internal/workers/register')
      .set('authorization', `Bearer ${getInternalToken()}`)
      .send({
        workerId: testWorkerId,
        status: 'online',
        region: 'local',
        uptimeSeconds: 45,
        activeInstanceCount: 0,
        timestamp: new Date().toISOString(),
      })
      .expect(200);

    await prisma.instance.update({
      where: {
        id: created.instance.id,
      },
      data: {
        assignedWorkerId: testWorkerId,
        status: 'authenticated',
        substatus: 'connected',
      },
    });

    await prisma.instanceOperation.create({
      data: {
        instanceId: created.instance.id,
        operationType: 'restart',
        status: 'completed',
        requestedByActorType: 'platform_admin',
        requestedByActorId: signupResponse.body.user.id,
        targetWorkerId: testWorkerId,
        message: 'Worker completed restart.',
      },
    });

    const adminToken = await login(
      app,
      process.env.DEV_BOOTSTRAP_ADMIN_EMAIL,
      process.env.DEV_BOOTSTRAP_ADMIN_PASSWORD,
    );

    const workerDetailResponse = await request(app.getHttpServer())
      .get(`/api/v1/admin/workers/${encodeURIComponent(testWorkerId)}`)
      .set('authorization', `Bearer ${adminToken}`);

    expect(workerDetailResponse.status).toBe(200);
    expect(workerDetailResponse.body.worker.workerId).toBe(testWorkerId);
    expect(
      workerDetailResponse.body.assignedInstances.some(
        (instance: { id: string }) => instance.id === created.instance.id,
      ),
    ).toBe(true);

    const createCaseResponse = await request(app.getHttpServer())
      .post('/api/v1/admin/support-cases')
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        workspaceId: signupResponse.body.workspaces[0].id,
        instanceId: created.instance.id,
        requesterUserId: signupResponse.body.user.id,
        title: 'Live support test case',
        description: 'Admin support case coverage for Phase 5.',
        priority: 'high',
      });

    expect(createCaseResponse.status).toBe(201);
    createdSupportCaseIds.push(createCaseResponse.body.case.id);
    expect(createCaseResponse.body.case.publicId).toMatch(/^SUP-/);

    const updateCaseResponse = await request(app.getHttpServer())
      .patch(`/api/v1/admin/support-cases/${createCaseResponse.body.case.id}`)
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        status: 'resolved',
        internalNotes: 'Operator verified the admin support flow.',
      });

    expect(updateCaseResponse.status).toBe(200);
    expect(updateCaseResponse.body.case.status).toBe('resolved');

    const listCasesResponse = await request(app.getHttpServer())
      .get('/api/v1/admin/support-cases?status=resolved')
      .set('authorization', `Bearer ${adminToken}`);

    expect(listCasesResponse.status).toBe(200);
    expect(
      listCasesResponse.body.items.some(
        (item: { id: string }) => item.id === createCaseResponse.body.case.id,
      ),
    ).toBe(true);

    const auditLogsResponse = await request(app.getHttpServer())
      .get('/api/v1/admin/audit-logs?action=admin.support_case')
      .set('authorization', `Bearer ${adminToken}`);

    expect(auditLogsResponse.status).toBe(200);
    expect(
      auditLogsResponse.body.items.some(
        (item: { entityId: string }) =>
          item.entityId === createCaseResponse.body.case.id,
      ),
    ).toBe(true);
  }, 20_000);

  it('supports admin trial extension and returns persisted workspace subscription details', async () => {
    const signupResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/signup')
      .send({
        email: `phase6-trial-${Date.now()}@elite.local`,
        password: 'Customer123456!',
        displayName: 'Trial Customer',
        workspaceName: 'Trial Workspace',
      });

    expect(signupResponse.status).toBe(201);
    createdUserIds.push(signupResponse.body.user.id);
    createdWorkspaceIds.push(signupResponse.body.workspaces[0].id);

    const adminToken = await login(
      app,
      process.env.DEV_BOOTSTRAP_ADMIN_EMAIL,
      process.env.DEV_BOOTSTRAP_ADMIN_PASSWORD,
    );
    const customerToken = signupResponse.body.accessToken as string;

    const extendResponse = await request(app.getHttpServer())
      .post(
        `/api/v1/admin/workspaces/${signupResponse.body.workspaces[0].id}/extend-trial`,
      )
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        days: 21,
      });

    expect(extendResponse.status).toBe(200);
    expect(extendResponse.body.workspace.subscriptionStatus).toBe('trialing');
    expect(extendResponse.body.subscription.trialEndsAt).toBeTruthy();

    const workspaceDetailResponse = await request(app.getHttpServer())
      .get(`/api/v1/admin/workspaces/${signupResponse.body.workspaces[0].id}`)
      .set('authorization', `Bearer ${adminToken}`);

    expect(workspaceDetailResponse.status).toBe(200);
    expect(workspaceDetailResponse.body.subscription.trialEndsAt).toBe(
      extendResponse.body.subscription.trialEndsAt,
    );

    const customerSubscriptionResponse = await request(app.getHttpServer())
      .get(
        `/api/v1/account/subscription?workspaceId=${encodeURIComponent(signupResponse.body.workspaces[0].id)}`,
      )
      .set('authorization', `Bearer ${customerToken}`);

    expect(customerSubscriptionResponse.status).toBe(200);
    expect(customerSubscriptionResponse.body.trialEndsAt).toBe(
      extendResponse.body.subscription.trialEndsAt,
    );
    expect(customerSubscriptionResponse.body.status).toBe('trialing');
  }, 20_000);

  it('signs webhook deliveries and lets admins replay failed deliveries', async () => {
    const customerToken = await login(
      app,
      process.env.DEV_BOOTSTRAP_CUSTOMER_EMAIL,
      process.env.DEV_BOOTSTRAP_CUSTOMER_PASSWORD,
    );
    const adminToken = await login(
      app,
      process.env.DEV_BOOTSTRAP_ADMIN_EMAIL,
      process.env.DEV_BOOTSTRAP_ADMIN_PASSWORD,
    );

    const meResponse = await request(app.getHttpServer())
      .get('/api/v1/account/me')
      .set('authorization', `Bearer ${customerToken}`);

    expect(meResponse.status).toBe(200);
    const workspaceId = meResponse.body.workspaces[0].id as string;
    const created = await createInstance(
      app,
      customerToken,
      workspaceId,
      'Replay Target Instance',
    );
    createdInstanceIds.push(created.instance.id);

    await request(app.getHttpServer())
      .patch(`/api/v1/customer/instances/${created.instance.id}/settings`)
      .set('authorization', `Bearer ${customerToken}`)
      .send({
        sendDelay: 1,
        sendDelayMax: 15,
        webhookUrl: 'http://127.0.0.1:9/webhook',
        webhookMessageReceived: false,
        webhookMessageCreate: true,
        webhookMessageAck: false,
      })
      .expect(200);

    const sendResponse = await request(app.getHttpServer())
      .post(`/api/v1/customer/instances/${created.instance.id}/messages/chat`)
      .set('authorization', `Bearer ${customerToken}`)
      .send({
        to: '15551234567',
        body: 'Replay me',
      });

    expect(sendResponse.status).toBe(201);

    const failedDeliveriesResponse = await request(app.getHttpServer())
      .get(
        `/api/v1/admin/webhook-deliveries?instanceId=${encodeURIComponent(created.instance.id)}&status=failed`,
      )
      .set('authorization', `Bearer ${adminToken}`);

    expect(failedDeliveriesResponse.status).toBe(200);
    expect(failedDeliveriesResponse.body.items).toHaveLength(1);

    const deliveryId = failedDeliveriesResponse.body.items[0].id as string;
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      }),
    );

    try {
      const replayResponse = await request(app.getHttpServer())
        .post(`/api/v1/admin/webhook-deliveries/${deliveryId}/replay`)
        .set('authorization', `Bearer ${adminToken}`);

      expect(replayResponse.status).toBe(200);
      expect(replayResponse.body.delivery.status).toBe('delivered');
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      const [, requestInit] = fetchSpy.mock.calls[0] ?? [];
      const headers = (requestInit as RequestInit | undefined)?.headers as
        | Record<string, string>
        | undefined;

      expect(headers?.['x-elite-message-signature']).toMatch(/^v1=/);
      expect(headers?.['x-elite-message-timestamp']).toBeTruthy();
      expect(headers?.['x-elite-message-event']).toBe('message_create');
    } finally {
      fetchSpy.mockRestore();
    }
  }, 20_000);

  it('supports admin MFA setup and requires MFA on subsequent logins', async () => {
    const signupResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/signup')
      .send({
        email: `phase6-admin-mfa-${Date.now()}@elite.local`,
        password: 'Customer123456!',
        displayName: 'Admin MFA User',
        workspaceName: 'Admin MFA Workspace',
      });

    expect(signupResponse.status).toBe(201);
    createdUserIds.push(signupResponse.body.user.id);
    createdWorkspaceIds.push(signupResponse.body.workspaces[0].id);

    await prisma.user.update({
      where: {
        id: signupResponse.body.user.id,
      },
      data: {
        role: 'platform_admin',
      },
    });

    const initialLoginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: signupResponse.body.user.email,
        password: 'Customer123456!',
      });

    expect(initialLoginResponse.status).toBe(201);
    const adminToken = initialLoginResponse.body.accessToken as string;

    const challengeResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/admin/mfa/challenge')
      .set('authorization', `Bearer ${adminToken}`);

    expect(challengeResponse.status).toBe(200);
    expect(challengeResponse.body.secret).toBeTruthy();

    const verifyResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/admin/mfa/verify')
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        code: generateTotpCode(challengeResponse.body.secret),
      });

    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.body.enabled).toBe(true);

    const missingMfaLoginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: signupResponse.body.user.email,
        password: 'Customer123456!',
      });

    expect(missingMfaLoginResponse.status).toBe(401);
    expect(missingMfaLoginResponse.body.message).toContain('MFA');

    const verifiedLoginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: signupResponse.body.user.email,
        password: 'Customer123456!',
        mfaCode: generateTotpCode(challengeResponse.body.secret),
      });

    expect(verifiedLoginResponse.status).toBe(201);
    expect(verifiedLoginResponse.body.user.role).toBe('platform_admin');
  }, 20_000);
});
