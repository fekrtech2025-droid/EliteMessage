"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("@elite-message/db");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const presenters_1 = require("../common/presenters");
let AccountsService = class AccountsService {
    auditLogsService;
    constructor(auditLogsService) {
        this.auditLogsService = auditLogsService;
    }
    async getAccountMe(userId) {
        const user = await db_1.prisma.user.findUnique({
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
            throw new common_1.UnauthorizedException('User session is no longer valid.');
        }
        return {
            user: (0, presenters_1.toUserProfile)(user),
            workspaces: user.memberships.map((membership) => (0, presenters_1.toWorkspaceSummary)(membership.workspace, membership.role)),
            themePreference: user.themePreference,
        };
    }
    async updateAccountProfile(userId, input) {
        const displayName = input.displayName.trim();
        const existing = await db_1.prisma.user.findUnique({
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
            throw new common_1.UnauthorizedException('User session is no longer valid.');
        }
        const updated = await db_1.prisma.user.update({
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
            user: (0, presenters_1.toUserProfile)(updated),
            updatedAt: updated.updatedAt.toISOString(),
        };
    }
    async updateAccountThemePreference(userId, input) {
        const existing = await db_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                status: true,
            },
        });
        if (!existing || existing.status !== 'active') {
            throw new common_1.UnauthorizedException('User session is no longer valid.');
        }
        const updated = await db_1.prisma.user.update({
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
    async listAccountApiTokens(userId, workspaceId) {
        const membership = await this.getWorkspaceMembership(userId, workspaceId);
        const tokens = await db_1.prisma.apiToken.findMany({
            where: {
                workspaceId: membership.workspaceId,
                tokenType: 'account_api',
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return {
            workspace: (0, presenters_1.toWorkspaceSummary)(membership.workspace, membership.role),
            items: tokens.map((token) => (0, presenters_1.toAccountApiTokenSummary)({
                ...token,
                workspaceId: token.workspaceId ?? membership.workspaceId,
            })),
        };
    }
    async createAccountApiToken(userId, input) {
        const membership = await this.getWorkspaceMembership(userId, input.workspaceId, true);
        const rawToken = (0, db_1.createOpaqueToken)('account');
        const token = await db_1.prisma.$transaction(async (tx) => {
            const createdToken = await tx.apiToken.create({
                data: {
                    workspaceId: membership.workspaceId,
                    tokenType: 'account_api',
                    name: input.name.trim(),
                    tokenHash: (0, db_1.hashOpaqueToken)(rawToken),
                    prefix: (0, db_1.createTokenPrefix)(rawToken),
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
            summary: (0, presenters_1.toAccountApiTokenSummary)({
                ...token,
                workspaceId: token.workspaceId ?? membership.workspaceId,
            }),
        };
    }
    async rotateAccountApiToken(userId, tokenId) {
        const token = await db_1.prisma.apiToken.findFirst({
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
            throw new common_1.NotFoundException('Account API token not found or not rotatable by this user.');
        }
        if (token.revokedAt) {
            throw new common_1.BadRequestException('This account API token is already revoked.');
        }
        const rawToken = (0, db_1.createOpaqueToken)('account');
        const now = new Date();
        const rotated = await db_1.prisma.$transaction(async (tx) => {
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
                    tokenHash: (0, db_1.hashOpaqueToken)(rawToken),
                    prefix: (0, db_1.createTokenPrefix)(rawToken),
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
            throw new common_1.BadRequestException('Rotated account API token is missing a workspace scope.');
        }
        return {
            token: rawToken,
            summary: (0, presenters_1.toAccountApiTokenSummary)({
                ...rotated,
                workspaceId,
            }),
        };
    }
    async getWorkspaceSubscription(userId, workspaceId) {
        const membership = await this.getWorkspaceMembership(userId, workspaceId);
        const subscription = await this.buildWorkspaceSubscriptionSummary(membership.workspace);
        return {
            workspace: (0, presenters_1.toWorkspaceSummary)(membership.workspace, membership.role),
            ...subscription,
        };
    }
    async listAdminUsers() {
        const users = await db_1.prisma.user.findMany({
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
            items: users.map((user) => (0, presenters_1.toAdminUserSummary)(user)),
        };
    }
    async getAdminUserDetail(userId) {
        const user = await db_1.prisma.user.findUnique({
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
            throw new common_1.NotFoundException('User not found.');
        }
        return {
            user: (0, presenters_1.toAdminUserSummary)(user),
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
    async updateAdminUserStatus(adminUserId, userId, input) {
        if (adminUserId === userId && input.status === 'suspended') {
            throw new common_1.BadRequestException('You cannot suspend the account currently used by this admin session.');
        }
        const existing = await db_1.prisma.user.findUnique({
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
            throw new common_1.NotFoundException('User not found.');
        }
        const updated = await db_1.prisma.$transaction(async (tx) => {
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
            user: (0, presenters_1.toAdminUserSummary)(updated),
            updatedAt: updated.updatedAt.toISOString(),
        };
    }
    async listAdminWorkspaces() {
        const workspaces = await db_1.prisma.workspace.findMany({
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
            items: workspaces.map((workspace) => (0, presenters_1.toAdminWorkspaceSummary)(workspace)),
        };
    }
    async getAdminWorkspaceDetail(workspaceId) {
        const workspace = await db_1.prisma.workspace.findUnique({
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
            throw new common_1.NotFoundException('Workspace not found.');
        }
        const subscription = await this.buildWorkspaceSubscriptionSummary(workspace);
        return {
            workspace: (0, presenters_1.toAdminWorkspaceSummary)(workspace),
            subscription,
            members: workspace.memberships.map((membership) => (0, presenters_1.toAdminWorkspaceMemberSummary)(membership)),
            instances: workspace.instances.map((instance) => (0, presenters_1.toInstanceSummary)(instance)),
        };
    }
    async updateAdminWorkspaceStatus(adminUserId, workspaceId, input) {
        const existing = await db_1.prisma.workspace.findUnique({
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
            throw new common_1.NotFoundException('Workspace not found.');
        }
        const updated = await db_1.prisma.$transaction(async (tx) => {
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
            workspace: (0, presenters_1.toAdminWorkspaceSummary)(updated),
            updatedAt: updated.updatedAt.toISOString(),
        };
    }
    async extendAdminWorkspaceTrial(adminUserId, workspaceId, input) {
        const existing = await db_1.prisma.workspace.findUnique({
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
            throw new common_1.NotFoundException('Workspace not found.');
        }
        const now = new Date();
        const currentTrial = (0, presenters_1.resolveWorkspaceTrialState)(existing);
        const extensionBase = currentTrial.status === 'trialing' && currentTrial.trialEndsAt
            ? currentTrial.trialEndsAt
            : now;
        const nextTrialEndsAt = new Date(extensionBase.getTime() + input.days * 24 * 60 * 60 * 1_000);
        const updated = await db_1.prisma.$transaction(async (tx) => {
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
            workspace: (0, presenters_1.toAdminWorkspaceSummary)(updated),
            subscription: await this.buildWorkspaceSubscriptionSummary(updated),
            updatedAt: updated.updatedAt.toISOString(),
        };
    }
    async getWorkspaceMembership(userId, workspaceId, requireManagement = false) {
        const membership = await db_1.prisma.membership.findFirst({
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
                throw new common_1.ForbiddenException('You do not have permission to manage account API tokens for this workspace.');
            }
            if (workspaceId) {
                throw new common_1.NotFoundException('Workspace not found or not accessible by this user.');
            }
            throw new common_1.NotFoundException('No accessible workspace was found for this user.');
        }
        return membership;
    }
    async buildWorkspaceSubscriptionSummary(workspace) {
        const [instanceCount, linkedInstanceCount, webhookEnabledInstanceCount] = await Promise.all([
            db_1.prisma.instance.count({
                where: {
                    workspaceId: workspace.id,
                },
            }),
            db_1.prisma.instance.count({
                where: {
                    workspaceId: workspace.id,
                    status: 'authenticated',
                },
            }),
            db_1.prisma.instance.count({
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
        const trial = (0, presenters_1.resolveWorkspaceTrialState)(workspace);
        return {
            status: trial.status,
            planName: trial.status === 'trialing' ? 'Founder Trial' : 'MVP Manual Plan',
            billingMode: 'manual',
            trialEndsAt: trial.trialEndsAt?.toISOString() ?? null,
            currentPeriodStart: workspace.createdAt.toISOString(),
            currentPeriodEnd: trial.status === 'trialing'
                ? (trial.trialEndsAt?.toISOString() ?? null)
                : null,
            instanceCount,
            linkedInstanceCount,
            webhookEnabledInstanceCount,
            notes: trial.status === 'trialing'
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
};
exports.AccountsService = AccountsService;
exports.AccountsService = AccountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_logs_service_1.AuditLogsService])
], AccountsService);
//# sourceMappingURL=accounts.service.js.map