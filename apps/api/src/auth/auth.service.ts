import { createHmac, timingSafeEqual } from 'node:crypto';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { CookieOptions } from 'express';
import type {
  AdminMfaChallengeResponse,
  AdminMfaStatusResponse,
  AdminMfaVerifyRequest,
  AuthResponse,
  GoogleAuthMode,
  LoginRequest,
  SignupRequest,
  UserRole,
} from '@elite-message/contracts';
import { routePrefixes } from '@elite-message/contracts';
import { parseApiEnv, loadWorkspaceEnv } from '@elite-message/config';
import {
  createOpaqueToken,
  hashOpaqueToken,
  hashPassword,
  normalizeEmail,
  prisma,
  verifyPassword,
} from '@elite-message/db';
import { toUserProfile, toWorkspaceSummary } from '../common/presenters';
import type { InstanceApiPrincipal, RequestUser } from '../common/request-user';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { buildOtpauthUrl, createTotpSecret, verifyTotp } from './totp';

type LoginMetadata = {
  userAgent?: string;
  ipAddress?: string | null;
};

type AccessTokenPayload = {
  version: 'em1';
  typ: 'dashboard_access';
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
};

type AuthFlowResult = {
  response: AuthResponse;
  refreshToken: string;
  refreshExpiresAt: Date;
};

type AuthenticatedUserRecord = {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  role: UserRole;
  status: string;
  createdAt: Date;
  adminMfaSecret?: string | null;
  adminMfaEnabledAt?: Date | null;
  memberships: Array<{
    role: string;
    workspace: {
      id: string;
      name: string;
      slug: string;
      createdAt: Date;
    };
  }>;
};

type GoogleStatePayload = {
  mode: GoogleAuthMode;
  nonce: string;
  issuedAt: number;
};

type GoogleCallbackParams = {
  code?: string;
  state?: string;
  error?: string;
  errorDescription?: string;
};

type GoogleAuthorizationRedirect = {
  redirectUrl: string;
  stateCookieValue?: string;
  stateExpiresAt?: Date;
};

type GoogleCallbackRedirect = {
  redirectUrl: string;
  refreshToken?: string;
  refreshExpiresAt?: Date;
};

type GoogleUserProfile = {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
};

export const refreshCookieName = 'elite_message_refresh';
export const googleStateCookieName = 'elite_message_google_state';

const googleStateTtl = '10m';

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

@Injectable()
export class AuthService {
  private readonly env;

  constructor(private readonly auditLogsService: AuditLogsService) {
    loadWorkspaceEnv();
    this.env = parseApiEnv(process.env);
  }

  async login(
    input: LoginRequest,
    metadata: LoginMetadata,
  ): Promise<AuthFlowResult> {
    const email = normalizeEmail(input.email);
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: {
            workspace: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const passwordMatches = await verifyPassword(
      input.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      if (user.role === 'customer') {
        const googleSignupAudit = await prisma.auditLog.findFirst({
          where: {
            actorId: user.id,
            action: 'auth.google.signup',
          },
          select: {
            id: true,
          },
        });

        if (googleSignupAudit) {
          throw new UnauthorizedException(
            'This account was created with Google. Use Continue with Google.',
          );
        }
      }

      throw new UnauthorizedException('Invalid credentials.');
    }

    if (
      user.role === 'platform_admin' &&
      user.adminMfaEnabledAt &&
      user.adminMfaSecret
    ) {
      if (!input.mfaCode || !verifyTotp(user.adminMfaSecret, input.mfaCode)) {
        throw new UnauthorizedException('Admin MFA code required.');
      }
    }

    const result = await this.issueAuthFlow(user, metadata);
    await this.auditLogsService.record({
      workspaceId: user.memberships[0]?.workspace.id ?? null,
      actorType:
        user.role === 'platform_admin' ? 'platform_admin' : 'customer_user',
      actorId: user.id,
      entityType: 'auth_session',
      entityId: user.id,
      action: 'auth.login',
      summary: 'Dashboard login succeeded.',
      metadata: {
        email: user.email,
        userAgent: metadata.userAgent ?? null,
        ipAddress: metadata.ipAddress ?? null,
      },
    });

    return result;
  }

  async signup(
    input: SignupRequest,
    metadata: LoginMetadata,
  ): Promise<AuthFlowResult> {
    const email = normalizeEmail(input.email);
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new ConflictException('An account with this email already exists.');
    }

    const displayName = input.displayName.trim();
    const workspaceName =
      input.workspaceName?.trim() || `${displayName} Workspace`;
    const passwordHash = await hashPassword(input.password);
    const workspaceSlug = await this.generateUniqueWorkspaceSlug(workspaceName);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email,
          displayName,
          passwordHash,
          role: 'customer',
          status: 'active',
        },
      });

      const workspace = await tx.workspace.create({
        data: {
          name: workspaceName,
          slug: workspaceSlug,
          status: 'active',
        },
      });

      await tx.membership.create({
        data: {
          workspaceId: workspace.id,
          userId: createdUser.id,
          role: 'owner',
        },
      });

      return tx.user.findUniqueOrThrow({
        where: {
          id: createdUser.id,
        },
        include: {
          memberships: {
            include: {
              workspace: true,
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });
    });

    const result = await this.issueAuthFlow(user, metadata);
    await this.auditLogsService.record({
      workspaceId: user.memberships[0]?.workspace.id ?? null,
      actorType: 'customer_user',
      actorId: user.id,
      entityType: 'user',
      entityId: user.id,
      action: 'auth.signup',
      summary: 'Customer account created and signed in.',
      metadata: {
        email: user.email,
        workspaceId: user.memberships[0]?.workspace.id ?? null,
        userAgent: metadata.userAgent ?? null,
        ipAddress: metadata.ipAddress ?? null,
      },
    });

    return result;
  }

  startGoogleAuthorization(mode: GoogleAuthMode): GoogleAuthorizationRedirect {
    if (!this.env.API_GOOGLE_CLIENT_ID || !this.env.API_GOOGLE_CLIENT_SECRET) {
      return {
        redirectUrl: this.buildCustomerGoogleRedirect({
          mode,
          errorCode: 'google_not_configured',
          errorMessage:
            'Google sign-in is not configured for this environment.',
        }),
      };
    }

    const stateExpiresAt = this.addDuration(new Date(), googleStateTtl);
    const stateCookieValue = createOpaqueToken('google_state');
    const state = this.signGoogleState({
      mode,
      nonce: stateCookieValue,
      issuedAt: Date.now(),
    });

    const authorizationUrl = new URL(
      'https://accounts.google.com/o/oauth2/v2/auth',
    );
    authorizationUrl.search = new URLSearchParams({
      client_id: this.env.API_GOOGLE_CLIENT_ID,
      redirect_uri: this.resolveGoogleCallbackUrl(),
      response_type: 'code',
      scope: 'openid email profile',
      prompt: 'select_account',
      state,
    }).toString();

    return {
      redirectUrl: authorizationUrl.toString(),
      stateCookieValue,
      stateExpiresAt,
    };
  }

  async completeGoogleAuthorization(
    params: GoogleCallbackParams,
    stateCookieValue: string | undefined,
    metadata: LoginMetadata,
  ): Promise<GoogleCallbackRedirect> {
    const inferredMode = this.readGoogleModeFromState(params.state) ?? 'login';

    if (!this.env.API_GOOGLE_CLIENT_ID || !this.env.API_GOOGLE_CLIENT_SECRET) {
      return {
        redirectUrl: this.buildCustomerGoogleRedirect({
          mode: inferredMode,
          errorCode: 'google_not_configured',
          errorMessage:
            'Google sign-in is not configured for this environment.',
        }),
      };
    }

    if (params.error) {
      return {
        redirectUrl: this.buildCustomerGoogleRedirect({
          mode: inferredMode,
          errorCode: `google_${params.error}`,
          errorMessage:
            params.errorDescription ??
            'Google authentication was cancelled or denied.',
        }),
      };
    }

    let state: GoogleStatePayload;
    try {
      state = this.verifyGoogleState(params.state, stateCookieValue);
    } catch (error) {
      return {
        redirectUrl: this.buildCustomerGoogleRedirect({
          mode: inferredMode,
          errorCode: 'google_invalid_state',
          errorMessage:
            error instanceof Error
              ? error.message
              : 'Google authentication state is invalid.',
        }),
      };
    }

    if (!params.code) {
      return {
        redirectUrl: this.buildCustomerGoogleRedirect({
          mode: state.mode,
          errorCode: 'google_missing_code',
          errorMessage: 'Google did not return an authorization code.',
        }),
      };
    }

    try {
      const profile = await this.fetchGoogleProfile(params.code);
      const authResult =
        state.mode === 'signup'
          ? await this.signupWithGoogleProfile(profile, metadata)
          : await this.loginWithGoogleProfile(profile, metadata);

      return {
        redirectUrl: this.buildCustomerGoogleRedirect({
          mode: state.mode,
          accessToken: authResult.response.accessToken,
        }),
        refreshToken: authResult.refreshToken,
        refreshExpiresAt: authResult.refreshExpiresAt,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        return {
          redirectUrl: this.buildCustomerGoogleRedirect({
            mode: state.mode,
            errorCode: 'google_account_exists',
            errorMessage:
              'An account with this Google email already exists. Sign in instead.',
          }),
        };
      }

      if (error instanceof UnauthorizedException) {
        return {
          redirectUrl: this.buildCustomerGoogleRedirect({
            mode: state.mode,
            errorCode: 'google_auth_failed',
            errorMessage: error.message,
          }),
        };
      }

      return {
        redirectUrl: this.buildCustomerGoogleRedirect({
          mode: state.mode,
          errorCode: 'google_exchange_failed',
          errorMessage: 'Google authentication could not be completed.',
        }),
      };
    }
  }

  async refresh(
    refreshToken: string,
    metadata: LoginMetadata,
  ): Promise<AuthFlowResult> {
    const session = await prisma.refreshSession.findUnique({
      where: { tokenHash: hashOpaqueToken(refreshToken) },
      include: {
        user: {
          include: {
            memberships: {
              include: {
                workspace: true,
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        },
      },
    });

    const now = new Date();
    if (
      !session ||
      session.revokedAt ||
      session.expiresAt <= now ||
      session.user.status !== 'active'
    ) {
      throw new UnauthorizedException('Refresh session is invalid.');
    }

    const rotatedRefreshToken = createOpaqueToken('refresh');
    const refreshExpiresAt = this.addDuration(
      now,
      this.env.API_REFRESH_TOKEN_TTL,
    );

    await prisma.refreshSession.update({
      where: { id: session.id },
      data: {
        tokenHash: hashOpaqueToken(rotatedRefreshToken),
        lastUsedAt: now,
        userAgent: metadata.userAgent ?? session.userAgent,
        ipAddress: metadata.ipAddress ?? session.ipAddress,
        expiresAt: refreshExpiresAt,
      },
    });

    return {
      response: this.buildAuthResponse(session.user),
      refreshToken: rotatedRefreshToken,
      refreshExpiresAt,
    };
  }

  async getAdminMfaStatus(userId: string): Promise<AdminMfaStatusResponse> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
        status: true,
        adminMfaSecret: true,
        adminMfaPendingSecret: true,
        adminMfaEnabledAt: true,
      },
    });

    if (!user || user.status !== 'active' || user.role !== 'platform_admin') {
      throw new UnauthorizedException(
        'Admin MFA status is not available for this account.',
      );
    }

    return {
      enabled: Boolean(user.adminMfaSecret && user.adminMfaEnabledAt),
      pending: Boolean(user.adminMfaPendingSecret),
      configuredAt: user.adminMfaEnabledAt?.toISOString() ?? null,
    };
  }

  async createAdminMfaChallenge(
    userId: string,
  ): Promise<AdminMfaChallengeResponse> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        memberships: {
          include: {
            workspace: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!user || user.status !== 'active' || user.role !== 'platform_admin') {
      throw new UnauthorizedException(
        'Admin MFA can only be configured by active platform admins.',
      );
    }

    const secret = createTotpSecret();
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        adminMfaPendingSecret: secret,
      },
    });

    const issuer = `${this.env.API_APP_NAME} Admin`;
    const accountLabel = user.email;

    await this.auditLogsService.record({
      workspaceId: user.memberships[0]?.workspace.id ?? null,
      actorType: 'platform_admin',
      actorId: userId,
      entityType: 'user',
      entityId: userId,
      action: 'auth.admin_mfa.challenge.created',
      summary: 'Admin MFA challenge created.',
      metadata: {
        email: user.email,
      },
    });

    return {
      secret,
      otpauthUrl: buildOtpauthUrl(issuer, accountLabel, secret),
      issuer,
      accountLabel,
    };
  }

  async verifyAdminMfaChallenge(
    userId: string,
    input: AdminMfaVerifyRequest,
  ): Promise<AdminMfaStatusResponse> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        memberships: {
          include: {
            workspace: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (
      !user ||
      user.status !== 'active' ||
      user.role !== 'platform_admin' ||
      !user.adminMfaPendingSecret
    ) {
      throw new UnauthorizedException(
        'Admin MFA verification is not available.',
      );
    }

    if (!verifyTotp(user.adminMfaPendingSecret, input.code)) {
      throw new UnauthorizedException('The provided MFA code is invalid.');
    }

    const enabledAt = new Date();
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        adminMfaSecret: user.adminMfaPendingSecret,
        adminMfaPendingSecret: null,
        adminMfaEnabledAt: enabledAt,
      },
    });

    await this.auditLogsService.record({
      workspaceId: user.memberships[0]?.workspace.id ?? null,
      actorType: 'platform_admin',
      actorId: userId,
      entityType: 'user',
      entityId: userId,
      action: 'auth.admin_mfa.enabled',
      summary: 'Admin MFA enabled.',
      metadata: {
        email: user.email,
        enabledAt: enabledAt.toISOString(),
      },
    });

    return {
      enabled: true,
      pending: false,
      configuredAt: enabledAt.toISOString(),
    };
  }

  async logout(refreshToken?: string) {
    if (!refreshToken) {
      return;
    }

    const session = await prisma.refreshSession.findUnique({
      where: {
        tokenHash: hashOpaqueToken(refreshToken),
      },
      include: {
        user: {
          include: {
            memberships: {
              include: {
                workspace: true,
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        },
      },
    });

    await prisma.refreshSession.updateMany({
      where: {
        tokenHash: hashOpaqueToken(refreshToken),
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    if (session?.user) {
      await this.auditLogsService.record({
        workspaceId: session.user.memberships[0]?.workspace.id ?? null,
        actorType:
          session.user.role === 'platform_admin'
            ? 'platform_admin'
            : 'customer_user',
        actorId: session.user.id,
        entityType: 'auth_session',
        entityId: session.user.id,
        action: 'auth.logout',
        summary: 'Dashboard logout completed.',
        metadata: {
          email: session.user.email,
        },
      });
    }
  }

  authenticateAccessToken(token: string): RequestUser {
    const payload = this.verifyAccessToken(token);
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }

  async authenticateInstanceApiToken(
    instancePathId: string,
    token: string,
  ): Promise<InstanceApiPrincipal> {
    const tokenHash = hashOpaqueToken(token);
    const apiToken = await prisma.apiToken.findFirst({
      where: {
        tokenHash,
        tokenType: 'instance_api',
        revokedAt: null,
      },
      include: {
        instance: {
          include: {
            workspace: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    if (
      !apiToken?.instance ||
      apiToken.instance.workspace.status !== 'active'
    ) {
      throw new UnauthorizedException('Invalid instance API token.');
    }

    if (
      apiToken.instance.id !== instancePathId &&
      apiToken.instance.publicId !== instancePathId
    ) {
      throw new UnauthorizedException(
        'Instance API token does not match the requested instance.',
      );
    }

    await prisma.apiToken
      .update({
        where: {
          id: apiToken.id,
        },
        data: {
          lastUsedAt: new Date(),
        },
      })
      .catch(() => undefined);

    return {
      tokenId: apiToken.id,
      tokenType: 'instance_api',
      tokenName: apiToken.name,
      tokenPrefix: apiToken.prefix,
      workspaceId: apiToken.instance.workspaceId,
      instanceId: apiToken.instance.id,
      instancePublicId: apiToken.instance.publicId,
    };
  }

  extractRefreshToken(cookieHeader?: string): string | undefined {
    return this.extractCookieValue(cookieHeader, refreshCookieName);
  }

  extractGoogleStateCookie(cookieHeader?: string): string | undefined {
    return this.extractCookieValue(cookieHeader, googleStateCookieName);
  }

  buildRefreshCookieOptions(expiresAt: Date): CookieOptions {
    return {
      httpOnly: true,
      secure: this.env.API_COOKIE_SECURE,
      // Browsers reject SameSite=None cookies unless they are also Secure.
      sameSite: this.env.API_COOKIE_SECURE ? 'none' : 'lax',
      path: '/',
      expires: expiresAt,
      domain: this.resolveCookieDomain(),
    };
  }

  buildGoogleStateCookieOptions(expiresAt: Date): CookieOptions {
    return {
      httpOnly: true,
      secure: this.env.API_COOKIE_SECURE,
      sameSite: 'lax',
      path: `${routePrefixes.auth}/google`,
      expires: expiresAt,
      domain: this.resolveCookieDomain(),
    };
  }

  buildClearRefreshCookieOptions(): CookieOptions {
    return {
      ...this.buildRefreshCookieOptions(new Date(0)),
      expires: new Date(0),
      maxAge: 0,
    };
  }

  buildClearGoogleStateCookieOptions(): CookieOptions {
    return {
      ...this.buildGoogleStateCookieOptions(new Date(0)),
      expires: new Date(0),
      maxAge: 0,
    };
  }

  private async loginWithGoogleProfile(
    profile: GoogleUserProfile,
    metadata: LoginMetadata,
  ): Promise<AuthFlowResult> {
    const user = await this.findUserByEmail(profile.email);

    if (!user || user.status !== 'active' || user.role !== 'customer') {
      throw new UnauthorizedException(
        'No active customer account exists for this Google email.',
      );
    }

    const result = await this.issueAuthFlow(user, metadata);
    await this.auditLogsService.record({
      workspaceId: user.memberships[0]?.workspace.id ?? null,
      actorType: 'customer_user',
      actorId: user.id,
      entityType: 'auth_session',
      entityId: user.id,
      action: 'auth.google.login',
      summary: 'Customer signed in with Google.',
      metadata: {
        email: user.email,
        googleSubject: profile.sub,
        userAgent: metadata.userAgent ?? null,
        ipAddress: metadata.ipAddress ?? null,
      },
    });

    return result;
  }

  private async signupWithGoogleProfile(
    profile: GoogleUserProfile,
    metadata: LoginMetadata,
  ): Promise<AuthFlowResult> {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: profile.email,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new ConflictException('An account with this email already exists.');
    }

    const displayName = this.resolveGoogleDisplayName(profile);
    const workspaceName = `${displayName} Workspace`;
    const passwordHash = await hashPassword(createOpaqueToken('google_user'));
    const workspaceSlug = await this.generateUniqueWorkspaceSlug(workspaceName);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: profile.email,
          displayName,
          passwordHash,
          role: 'customer',
          status: 'active',
        },
      });

      const workspace = await tx.workspace.create({
        data: {
          name: workspaceName,
          slug: workspaceSlug,
          status: 'active',
        },
      });

      await tx.membership.create({
        data: {
          workspaceId: workspace.id,
          userId: createdUser.id,
          role: 'owner',
        },
      });

      return tx.user.findUniqueOrThrow({
        where: {
          id: createdUser.id,
        },
        include: {
          memberships: {
            include: {
              workspace: true,
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });
    });

    const result = await this.issueAuthFlow(user, metadata);
    await this.auditLogsService.record({
      workspaceId: user.memberships[0]?.workspace.id ?? null,
      actorType: 'customer_user',
      actorId: user.id,
      entityType: 'user',
      entityId: user.id,
      action: 'auth.google.signup',
      summary: 'Customer account created with Google.',
      metadata: {
        email: user.email,
        workspaceId: user.memberships[0]?.workspace.id ?? null,
        googleSubject: profile.sub,
        userAgent: metadata.userAgent ?? null,
        ipAddress: metadata.ipAddress ?? null,
      },
    });

    return result;
  }

  private async fetchGoogleProfile(code: string): Promise<GoogleUserProfile> {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: this.env.API_GOOGLE_CLIENT_ID ?? '',
        client_secret: this.env.API_GOOGLE_CLIENT_SECRET ?? '',
        redirect_uri: this.resolveGoogleCallbackUrl(),
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new UnauthorizedException('Google token exchange failed.');
    }

    const tokenPayload = (await tokenResponse.json()) as {
      access_token?: string;
    };
    if (!tokenPayload.access_token) {
      throw new UnauthorizedException('Google token exchange failed.');
    }

    const profileResponse = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          authorization: `Bearer ${tokenPayload.access_token}`,
        },
      },
    );

    if (!profileResponse.ok) {
      throw new UnauthorizedException('Google profile lookup failed.');
    }

    const profile = (await profileResponse.json()) as GoogleUserProfile;
    if (!profile.email || !profile.email_verified) {
      throw new UnauthorizedException(
        'Google returned an email that is missing or not verified.',
      );
    }

    return {
      ...profile,
      email: normalizeEmail(profile.email),
    };
  }

  private buildCustomerGoogleRedirect({
    mode,
    accessToken,
    errorCode,
    errorMessage,
  }: {
    mode: GoogleAuthMode;
    accessToken?: string;
    errorCode?: string;
    errorMessage?: string;
  }) {
    const redirectUrl = new URL(
      '/auth/google',
      this.env.CUSTOMER_WEB_PUBLIC_BASE_URL,
    );
    const fragment = new URLSearchParams({
      mode,
    });

    if (accessToken) {
      fragment.set('access_token', accessToken);
    }

    if (errorCode) {
      fragment.set('error_code', errorCode);
    }

    if (errorMessage) {
      fragment.set('error_message', errorMessage);
    }

    redirectUrl.hash = fragment.toString();
    return redirectUrl.toString();
  }

  private resolveGoogleCallbackUrl() {
    return new URL(
      `${routePrefixes.auth}/google/callback`,
      this.env.API_BASE_URL,
    ).toString();
  }

  private signGoogleState(payload: GoogleStatePayload) {
    const payloadSegment = Buffer.from(JSON.stringify(payload)).toString(
      'base64url',
    );
    const signatureSegment = createHmac(
      'sha256',
      this.env.API_ACCESS_TOKEN_SECRET,
    )
      .update(`google-state:${payloadSegment}`)
      .digest('base64url');

    return `${payloadSegment}.${signatureSegment}`;
  }

  private verifyGoogleState(
    rawState: string | undefined,
    expectedNonce: string | undefined,
  ): GoogleStatePayload {
    if (!rawState || !expectedNonce) {
      throw new Error('Google authentication state is missing.');
    }

    const [payloadSegment, signatureSegment] = rawState.split('.');
    if (!payloadSegment || !signatureSegment) {
      throw new Error('Google authentication state is invalid.');
    }

    const expectedSignature = createHmac(
      'sha256',
      this.env.API_ACCESS_TOKEN_SECRET,
    )
      .update(`google-state:${payloadSegment}`)
      .digest();
    const receivedSignature = Buffer.from(signatureSegment, 'base64url');

    if (
      expectedSignature.length !== receivedSignature.length ||
      !timingSafeEqual(expectedSignature, receivedSignature)
    ) {
      throw new Error('Google authentication state is invalid.');
    }

    const payload = JSON.parse(
      Buffer.from(payloadSegment, 'base64url').toString('utf8'),
    ) as GoogleStatePayload;
    if (!payload.nonce || payload.nonce !== expectedNonce) {
      throw new Error(
        'Google authentication state did not match this browser session.',
      );
    }

    if (Date.now() - payload.issuedAt > 10 * 60_000) {
      throw new Error('Google authentication state expired. Start again.');
    }

    return payload;
  }

  private readGoogleModeFromState(
    rawState: string | undefined,
  ): GoogleAuthMode | null {
    if (!rawState) {
      return null;
    }

    const [payloadSegment] = rawState.split('.');
    if (!payloadSegment) {
      return null;
    }

    try {
      const payload = JSON.parse(
        Buffer.from(payloadSegment, 'base64url').toString('utf8'),
      ) as Partial<GoogleStatePayload>;
      return payload.mode === 'signup'
        ? 'signup'
        : payload.mode === 'login'
          ? 'login'
          : null;
    } catch {
      return null;
    }
  }

  private resolveGoogleDisplayName(profile: GoogleUserProfile) {
    const preferredName = profile.name?.trim();
    if (preferredName) {
      return preferredName.slice(0, 80);
    }

    const [localPart] = profile.email.split('@');
    return (localPart || 'Workspace owner').slice(0, 80);
  }

  private async findUserByEmail(
    email: string,
  ): Promise<AuthenticatedUserRecord | null> {
    return prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: {
            workspace: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }

  private extractCookieValue(
    cookieHeader: string | undefined,
    cookieName: string,
  ): string | undefined {
    if (!cookieHeader) {
      return undefined;
    }

    const cookies = cookieHeader.split(';').map((item) => item.trim());
    for (const cookie of cookies) {
      if (!cookie.startsWith(`${cookieName}=`)) {
        continue;
      }

      return decodeURIComponent(cookie.slice(cookieName.length + 1));
    }

    return undefined;
  }

  private buildAuthResponse(user: {
    id: string;
    email: string;
    displayName: string;
    role: UserRole;
    createdAt: Date;
    memberships: Array<{
      role: string;
      workspace: {
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
      };
    }>;
  }): AuthResponse {
    const accessExpiresAt = this.addDuration(
      new Date(),
      this.env.API_ACCESS_TOKEN_TTL,
    );

    return {
      accessToken: this.signAccessToken({
        version: 'em1',
        typ: 'dashboard_access',
        sub: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(accessExpiresAt.getTime() / 1000),
      }),
      expiresAt: accessExpiresAt.toISOString(),
      user: toUserProfile(user),
      workspaces: user.memberships.map((membership) =>
        toWorkspaceSummary(membership.workspace, membership.role),
      ),
    };
  }

  private async issueAuthFlow(
    user: {
      id: string;
      email: string;
      displayName: string;
      role: UserRole;
      status?: string;
      createdAt: Date;
      memberships: Array<{
        role: string;
        workspace: {
          id: string;
          name: string;
          slug: string;
          createdAt: Date;
        };
      }>;
    },
    metadata: LoginMetadata,
  ): Promise<AuthFlowResult> {
    const refreshToken = createOpaqueToken('refresh');
    const now = new Date();
    const refreshExpiresAt = this.addDuration(
      now,
      this.env.API_REFRESH_TOKEN_TTL,
    );

    await prisma.refreshSession.create({
      data: {
        userId: user.id,
        tokenHash: hashOpaqueToken(refreshToken),
        userAgent: metadata.userAgent,
        ipAddress: metadata.ipAddress ?? undefined,
        expiresAt: refreshExpiresAt,
      },
    });

    return {
      response: this.buildAuthResponse(user),
      refreshToken,
      refreshExpiresAt,
    };
  }

  private async generateUniqueWorkspaceSlug(workspaceName: string) {
    const baseSlug = slugify(workspaceName) || 'workspace';
    let candidate = baseSlug;
    let suffix = 2;

    while (
      await prisma.workspace.findUnique({
        where: { slug: candidate },
        select: { id: true },
      })
    ) {
      candidate = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    return candidate;
  }

  private signAccessToken(payload: AccessTokenPayload): string {
    const payloadSegment = Buffer.from(JSON.stringify(payload)).toString(
      'base64url',
    );
    const signatureSegment = createHmac(
      'sha256',
      this.env.API_ACCESS_TOKEN_SECRET,
    )
      .update(payloadSegment)
      .digest('base64url');

    return `em1.${payloadSegment}.${signatureSegment}`;
  }

  private verifyAccessToken(token: string): AccessTokenPayload {
    const [version, payloadSegment, signatureSegment] = token.split('.');
    if (version !== 'em1' || !payloadSegment || !signatureSegment) {
      throw new UnauthorizedException('Invalid access token.');
    }

    const expectedSignature = createHmac(
      'sha256',
      this.env.API_ACCESS_TOKEN_SECRET,
    )
      .update(payloadSegment)
      .digest();
    const receivedSignature = Buffer.from(signatureSegment, 'base64url');

    if (
      expectedSignature.length !== receivedSignature.length ||
      !timingSafeEqual(expectedSignature, receivedSignature)
    ) {
      throw new UnauthorizedException('Invalid access token.');
    }

    const payload = JSON.parse(
      Buffer.from(payloadSegment, 'base64url').toString('utf8'),
    ) as AccessTokenPayload;
    const now = Math.floor(Date.now() / 1000);

    if (payload.typ !== 'dashboard_access' || payload.exp <= now) {
      throw new UnauthorizedException('Access token expired.');
    }

    return payload;
  }

  private addDuration(baseDate: Date, duration: string): Date {
    const match = duration.match(/^(\d+)(ms|s|m|h|d)$/);
    if (!match) {
      throw new Error(`Unsupported duration value: ${duration}`);
    }

    const [, amountPart, unit] = match;
    if (!amountPart || !unit) {
      throw new Error(`Unsupported duration value: ${duration}`);
    }

    const amount = Number.parseInt(amountPart, 10);
    const multiplier =
      unit === 'ms'
        ? 1
        : unit === 's'
          ? 1_000
          : unit === 'm'
            ? 60_000
            : unit === 'h'
              ? 3_600_000
              : 86_400_000;

    return new Date(baseDate.getTime() + amount * multiplier);
  }

  private resolveCookieDomain() {
    if (
      ['localhost', '127.0.0.1', '::1'].includes(this.env.API_COOKIE_DOMAIN)
    ) {
      return undefined;
    }

    return this.env.API_COOKIE_DOMAIN;
  }
}
