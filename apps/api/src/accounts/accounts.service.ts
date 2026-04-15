import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type {
  AccountMeResponse,
  AdminUserDetailResponse,
  AdminWorkspaceDetailResponse,
  AdminWorkspaceSubscriptionSummary,
  CreateAccountApiTokenRequest,
  CreateAccountApiTokenResponse,
  ExtendAdminWorkspaceTrialRequest,
  ExtendAdminWorkspaceTrialResponse,
  GetWorkspaceSubscriptionResponse,
  ListAccountApiTokensResponse,
  ListAdminUsersResponse,
  ListAdminWorkspacesResponse,
  RotateAccountApiTokenResponse,
  UpdateAdminUserStatusRequest,
  UpdateAdminUserStatusResponse,
  UpdateAdminWorkspaceStatusRequest,
  UpdateAdminWorkspaceStatusResponse,
  UpdateAccountProfileRequest,
  UpdateAccountProfileResponse,
  UpdateAccountThemePreferenceRequest,
  UpdateAccountThemePreferenceResponse,
} from '@elite-message/contracts';
import {
  createOpaqueToken,
  createTokenPrefix,
  hashOpaqueToken,
  prisma,
} from '@elite-message/db';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import {
  toAccountApiTokenSummary,
  toAdminUserSummary,
  toAdminWorkspaceMemberSummary,
  toAdminWorkspaceSummary,
  toInstanceSummary,
  resolveWorkspaceTrialState,
  toUserProfile,
  toWorkspaceSummary,
} from '../common/presenters';

@Injectable()
export class AccountsService {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  async getAccountMe(userId: string): Promise<AccountMeResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      throw new UnauthorizedException('User session is no longer valid.');
    }

    return {
      user: toUserProfile(user),
      workspaces: user.memberships.map((membership) =>
        toWorkspaceSummary(membership.workspace, membership.role),
      ),
      themePreference: user.themePreference,
    };
  }

  async updateAccountProfile(
    userId: string,
    input: UpdateAccountProfileRequest,
  ): Promise<UpdateAccountProfileResponse> {
    const displayName = input.displayName.trim();
    const existing = await prisma.user.findUnique({
      where: { id: userId },
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

    if (!existing || existing.status !== 'active') {
      throw new UnauthorizedException('User session is no longer valid.');
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        displayName,
      },
    });

    await this.auditLogsService.record({
      workspaceId: existing.memberships[0]?.workspaceId ?? null,
      actorType: 'customer_user',
      actorId: userId,
      entityType: 'user',
      entityId: userId,
      action: 'account.profile.updated',
      summary: `Customer profile updated for ${updated.email}.`,
      metadata: {
        displayName,
      },
    });

    return {
      user: toUserProfile(updated),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async updateAccountThemePreference(
    userId: string,
    input: UpdateAccountThemePreferenceRequest,
  ): Promise<UpdateAccountThemePreferenceResponse> {
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!existing || existing.status !== 'active') {
      throw new UnauthorizedException('User session is no longer valid.');
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        themePreference: input.themePreference,
      },
      select: {
        themePreference: true,
        updatedAt: true,
      },
    });

    return {
      themePreference: updated.themePreference,
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async listAccountApiTokens(
    userId: string,
    workspaceId?: string,
  ): Promise<ListAccountApiTokensResponse> {
    const membership = await this.getWorkspaceMembership(userId, workspaceId);
    const tokens = await prisma.apiToken.findMany({
      where: {
        workspaceId: membership.workspaceId,
        tokenType: 'account_api',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      workspace: toWorkspaceSummary(membership.workspace, membership.role),
      items: tokens.map((token) =>
        toAccountApiTokenSummary({
          ...token,
          workspaceId: token.workspaceId ?? membership.workspaceId,
        }),
      ),
    };
  }

  async createAccountApiToken(
    userId: string,
    input: CreateAccountApiTokenRequest,
  ): Promise<CreateAccountApiTokenResponse> {
    const membership = await this.getWorkspaceMembership(
      userId,
      input.workspaceId,
      true,
    );
    const rawToken = createOpaqueToken('account');

    const token = await prisma.$transaction(async (tx) => {
      const createdToken = await tx.apiToken.create({
        data: {
          workspaceId: membership.workspaceId,
          tokenType: 'account_api',
          name: input.name.trim(),
          tokenHash: hashOpaqueToken(rawToken),
          prefix: createTokenPrefix(rawToken),
          createdByUserId: userId,
        },
      });

      await this.auditLogsService.recordWithClient(tx, {
        workspaceId: membership.workspaceId,
        actorType: 'customer_user',
        actorId: userId,
        entityType: 'account_api_token',
        entityId: createdToken.id,
        action: 'account.api_token.created',
        summary: `Account API token "${createdToken.name}" created.`,
        metadata: {
          prefix: createdToken.prefix,
        },
      });

      return createdToken;
    });

    return {
      token: rawToken,
      summary: toAccountApiTokenSummary({
        ...token,
        workspaceId: token.workspaceId ?? membership.workspaceId,
      }),
    };
  }

  async rotateAccountApiToken(
    userId: string,
    tokenId: string,
  ): Promise<RotateAccountApiTokenResponse> {
    const token = await prisma.apiToken.findFirst({
      where: {
        id: tokenId,
        tokenType: 'account_api',
        workspace: {
          memberships: {
            some: {
              userId,
              role: {
                in: ['owner', 'admin'],
              },
            },
          },
        },
      },
      include: {
        workspace: true,
      },
    });

    if (!token) {
      throw new NotFoundException(
        'Account API token not found or not rotatable by this user.',
      );
    }

    if (token.revokedAt) {
      throw new BadRequestException(
        'This account API token is already revoked.',
      );
    }

    const rawToken = createOpaqueToken('account');
    const now = new Date();

    const rotated = await prisma.$transaction(async (tx) => {
      await tx.apiToken.update({
        where: {
          id: token.id,
        },
        data: {
          revokedAt: now,
        },
      });

      const nextToken = await tx.apiToken.create({
        data: {
          workspaceId: token.workspaceId,
          tokenType: 'account_api',
          name: token.name,
          tokenHash: hashOpaqueToken(rawToken),
          prefix: createTokenPrefix(rawToken),
          createdByUserId: userId,
        },
      });

      await this.auditLogsService.recordWithClient(tx, {
        workspaceId: token.workspaceId ?? null,
        actorType: 'customer_user',
        actorId: userId,
        entityType: 'account_api_token',
        entityId: nextToken.id,
        action: 'account.api_token.rotated',
        summary: `Account API token "${token.name}" rotated.`,
        metadata: {
          revokedTokenId: token.id,
          prefix: nextToken.prefix,
        },
      });

      return nextToken;
    });

    const workspaceId = rotated.workspaceId ?? token.workspaceId;
    if (!workspaceId) {
      throw new BadRequestException(
        'Rotated account API token is missing a workspace scope.',
      );
    }

    return {
      token: rawToken,
      summary: toAccountApiTokenSummary({
        ...rotated,
        workspaceId,
      }),
    };
  }

  async getWorkspaceSubscription(
    userId: string,
    workspaceId?: string,
  ): Promise<GetWorkspaceSubscriptionResponse> {
    const membership = await this.getWorkspaceMembership(userId, workspaceId);
    const subscription = await this.buildWorkspaceSubscriptionSummary(
      membership.workspace,
    );

    return {
      workspace: toWorkspaceSummary(membership.workspace, membership.role),
      ...subscription,
    };
  }

  async listAdminUsers(): Promise<ListAdminUsersResponse> {
    const users = await prisma.user.findMany({
      include: {
        refreshSessions: {
          where: {
            revokedAt: null,
            expiresAt: {
              gt: new Date(),
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
          take: 1,
        },
        _count: {
          select: {
            memberships: true,
            createdInstances: true,
            refreshSessions: {
              where: {
                revokedAt: null,
                expiresAt: {
                  gt: new Date(),
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return {
      items: users.map((user) => toAdminUserSummary(user)),
    };
  }

  async getAdminUserDetail(userId: string): Promise<AdminUserDetailResponse> {
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
        refreshSessions: {
          where: {
            revokedAt: null,
            expiresAt: {
              gt: new Date(),
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
          take: 1,
        },
        _count: {
          select: {
            memberships: true,
            createdInstances: true,
            refreshSessions: {
              where: {
                revokedAt: null,
                expiresAt: {
                  gt: new Date(),
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return {
      user: toAdminUserSummary(user),
      workspaces: user.memberships.map((membership) => ({
        workspaceId: membership.workspaceId,
        workspaceName: membership.workspace.name,
        workspaceSlug: membership.workspace.slug,
        workspaceStatus: membership.workspace.status,
        membershipRole: membership.role,
        joinedAt: membership.createdAt.toISOString(),
      })),
    };
  }

  async updateAdminUserStatus(
    adminUserId: string,
    userId: string,
    input: UpdateAdminUserStatusRequest,
  ): Promise<UpdateAdminUserStatusResponse> {
    if (adminUserId === userId && input.status === 'suspended') {
      throw new BadRequestException(
        'You cannot suspend the account currently used by this admin session.',
      );
    }

    const existing = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        memberships: {
          orderBy: {
            createdAt: 'asc',
          },
          take: 1,
        },
        refreshSessions: {
          where: {
            revokedAt: null,
            expiresAt: {
              gt: new Date(),
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
          take: 1,
        },
        _count: {
          select: {
            memberships: true,
            createdInstances: true,
            refreshSessions: {
              where: {
                revokedAt: null,
                expiresAt: {
                  gt: new Date(),
                },
              },
            },
          },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('User not found.');
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (input.status === 'suspended') {
        await tx.refreshSession.updateMany({
          where: {
            userId,
            revokedAt: null,
          },
          data: {
            revokedAt: new Date(),
          },
        });
      }

      const nextUser = await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          status: input.status,
        },
        include: {
          refreshSessions: {
            where: {
              revokedAt: null,
              expiresAt: {
                gt: new Date(),
              },
            },
            orderBy: {
              updatedAt: 'desc',
            },
            take: 1,
          },
          _count: {
            select: {
              memberships: true,
              createdInstances: true,
              refreshSessions: {
                where: {
                  revokedAt: null,
                  expiresAt: {
                    gt: new Date(),
                  },
                },
              },
            },
          },
        },
      });

      await this.auditLogsService.recordWithClient(tx, {
        workspaceId: existing.memberships[0]?.workspaceId ?? null,
        actorType: 'platform_admin',
        actorId: adminUserId,
        entityType: 'user',
        entityId: userId,
        action: 'admin.user.status.updated',
        summary: `Admin updated user ${existing.email} to ${input.status}.`,
        metadata: {
          previousStatus: existing.status,
          nextStatus: input.status,
        },
      });

      return nextUser;
    });

    return {
      user: toAdminUserSummary(updated),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async listAdminWorkspaces(): Promise<ListAdminWorkspacesResponse> {
    const workspaces = await prisma.workspace.findMany({
      include: {
        _count: {
          select: {
            memberships: true,
            instances: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return {
      items: workspaces.map((workspace) => toAdminWorkspaceSummary(workspace)),
    };
  }

  async getAdminWorkspaceDetail(
    workspaceId: string,
  ): Promise<AdminWorkspaceDetailResponse> {
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        memberships: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        instances: {
          include: {
            workspace: true,
            settings: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            memberships: true,
            instances: true,
          },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found.');
    }

    const subscription =
      await this.buildWorkspaceSubscriptionSummary(workspace);

    return {
      workspace: toAdminWorkspaceSummary(workspace),
      subscription,
      members: workspace.memberships.map((membership) =>
        toAdminWorkspaceMemberSummary(membership),
      ),
      instances: workspace.instances.map((instance) =>
        toInstanceSummary(instance),
      ),
    };
  }

  async updateAdminWorkspaceStatus(
    adminUserId: string,
    workspaceId: string,
    input: UpdateAdminWorkspaceStatusRequest,
  ): Promise<UpdateAdminWorkspaceStatusResponse> {
    const existing = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        _count: {
          select: {
            memberships: true,
            instances: true,
          },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Workspace not found.');
    }

    const updated = await prisma.$transaction(async (tx) => {
      const nextWorkspace = await tx.workspace.update({
        where: {
          id: workspaceId,
        },
        data: {
          status: input.status,
        },
        include: {
          _count: {
            select: {
              memberships: true,
              instances: true,
            },
          },
        },
      });

      await this.auditLogsService.recordWithClient(tx, {
        workspaceId,
        actorType: 'platform_admin',
        actorId: adminUserId,
        entityType: 'workspace',
        entityId: workspaceId,
        action: 'admin.workspace.status.updated',
        summary: `Admin updated workspace ${existing.name} to ${input.status}.`,
        metadata: {
          previousStatus: existing.status,
          nextStatus: input.status,
        },
      });

      return nextWorkspace;
    });

    return {
      workspace: toAdminWorkspaceSummary(updated),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async extendAdminWorkspaceTrial(
    adminUserId: string,
    workspaceId: string,
    input: ExtendAdminWorkspaceTrialRequest,
  ): Promise<ExtendAdminWorkspaceTrialResponse> {
    const existing = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        _count: {
          select: {
            memberships: true,
            instances: true,
          },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Workspace not found.');
    }

    const now = new Date();
    const currentTrial = resolveWorkspaceTrialState(existing);
    const extensionBase =
      currentTrial.status === 'trialing' && currentTrial.trialEndsAt
        ? currentTrial.trialEndsAt
        : now;
    const nextTrialEndsAt = new Date(
      extensionBase.getTime() + input.days * 24 * 60 * 60 * 1_000,
    );

    const updated = await prisma.$transaction(async (tx) => {
      const nextWorkspace = await tx.workspace.update({
        where: {
          id: workspaceId,
        },
        data: {
          trialEndsAt: nextTrialEndsAt,
        },
        include: {
          _count: {
            select: {
              memberships: true,
              instances: true,
            },
          },
        },
      });

      await this.auditLogsService.recordWithClient(tx, {
        workspaceId,
        actorType: 'platform_admin',
        actorId: adminUserId,
        entityType: 'workspace',
        entityId: workspaceId,
        action: 'admin.workspace.trial.extended',
        summary: `Admin extended the workspace trial by ${input.days} days.`,
        metadata: {
          previousTrialEndsAt: currentTrial.trialEndsAt?.toISOString() ?? null,
          nextTrialEndsAt: nextTrialEndsAt.toISOString(),
          days: input.days,
        },
      });

      return nextWorkspace;
    });

    return {
      workspace: toAdminWorkspaceSummary(updated),
      subscription: await this.buildWorkspaceSubscriptionSummary(updated),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  private async getWorkspaceMembership(
    userId: string,
    workspaceId?: string,
    requireManagement = false,
  ) {
    const membership = await prisma.membership.findFirst({
      where: {
        userId,
        workspaceId,
        role: requireManagement
          ? {
              in: ['owner', 'admin'],
            }
          : {
              in: ['owner', 'admin', 'operator', 'viewer'],
            },
      },
      include: {
        workspace: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (!membership) {
      if (workspaceId && requireManagement) {
        throw new ForbiddenException(
          'You do not have permission to manage account API tokens for this workspace.',
        );
      }

      if (workspaceId) {
        throw new NotFoundException(
          'Workspace not found or not accessible by this user.',
        );
      }

      throw new NotFoundException(
        'No accessible workspace was found for this user.',
      );
    }

    return membership;
  }

  private async buildWorkspaceSubscriptionSummary(workspace: {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    trialEndsAt?: Date | null;
  }): Promise<AdminWorkspaceSubscriptionSummary> {
    const [instanceCount, linkedInstanceCount, webhookEnabledInstanceCount] =
      await Promise.all([
        prisma.instance.count({
          where: {
            workspaceId: workspace.id,
          },
        }),
        prisma.instance.count({
          where: {
            workspaceId: workspace.id,
            status: 'authenticated',
          },
        }),
        prisma.instance.count({
          where: {
            workspaceId: workspace.id,
            settings: {
              is: {
                webhookUrl: {
                  not: null,
                },
              },
            },
          },
        }),
      ]);

    const trial = resolveWorkspaceTrialState(workspace);

    return {
      status: trial.status,
      planName:
        trial.status === 'trialing' ? 'Founder Trial' : 'MVP Manual Plan',
      billingMode: 'manual',
      trialEndsAt: trial.trialEndsAt?.toISOString() ?? null,
      currentPeriodStart: workspace.createdAt.toISOString(),
      currentPeriodEnd:
        trial.status === 'trialing'
          ? (trial.trialEndsAt?.toISOString() ?? null)
          : null,
      instanceCount,
      linkedInstanceCount,
      webhookEnabledInstanceCount,
      notes:
        trial.status === 'trialing'
          ? [
              'This workspace is inside the MVP trial window.',
              'Billing remains manual until the paid subscription flow is shipped.',
            ]
          : [
              'Billing automation is not enabled yet; this workspace is tracked in manual mode.',
              'Admins can extend the trial window without changing the workspace operational status.',
            ],
    };
  }
}
