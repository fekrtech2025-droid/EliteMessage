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
exports.InstancesService = void 0;
const node_crypto_1 = require("node:crypto");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const common_1 = require("@nestjs/common");
const db_1 = require("@elite-message/db");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const presenters_1 = require("../common/presenters");
const realtime_service_1 = require("../realtime/realtime.service");
const detailInclude = {
    workspace: true,
    settings: true,
    runtimeState: true,
    apiTokens: {
        where: {
            tokenType: 'instance_api',
        },
        orderBy: {
            createdAt: 'desc',
        },
    },
    operations: {
        orderBy: {
            createdAt: 'desc',
        },
        take: 10,
    },
    lifecycleEvents: {
        orderBy: {
            createdAt: 'desc',
        },
        take: 25,
    },
};
const startNoOpStatuses = new Set([
    'qr',
    'initialize',
    'booting',
    'loading',
    'retrying',
    'authenticated',
]);
function getStartNoOpMessage(status) {
    switch (status) {
        case 'qr':
            return 'This instance already has a QR ready for scan.';
        case 'authenticated':
            return 'This instance is already connected.';
        case 'retrying':
            return 'This instance is already retrying startup.';
        default:
            return 'This instance is already starting.';
    }
}
function isConflictSubstatus(substatus) {
    return substatus === 'conflict';
}
function generateWebhookSecret() {
    return (0, node_crypto_1.randomBytes)(24).toString('hex');
}
function resolveWebhookSecret(currentSecret, nextSecret) {
    if (nextSecret === undefined) {
        return currentSecret ?? generateWebhookSecret();
    }
    if (nextSecret === null) {
        return generateWebhookSecret();
    }
    const normalized = nextSecret.trim();
    return normalized.length > 0 ? normalized : generateWebhookSecret();
}
let InstancesService = class InstancesService {
    realtimeService;
    auditLogsService;
    constructor(realtimeService, auditLogsService) {
        this.realtimeService = realtimeService;
        this.auditLogsService = auditLogsService;
    }
    async listCustomerInstances(userId) {
        const memberships = await db_1.prisma.membership.findMany({
            where: { userId },
            select: {
                workspaceId: true,
            },
        });
        const workspaceIds = memberships.map((membership) => membership.workspaceId);
        if (workspaceIds.length === 0) {
            return { items: [] };
        }
        const instances = await db_1.prisma.instance.findMany({
            where: {
                workspaceId: {
                    in: workspaceIds,
                },
            },
            include: {
                workspace: true,
                settings: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const workerMap = await this.getWorkerMap(instances
            .map((instance) => instance.assignedWorkerId)
            .filter((workerId) => Boolean(workerId)));
        return {
            items: instances.map((instance) => (0, presenters_1.toInstanceSummary)(instance, workerMap.get(instance.assignedWorkerId ?? ''))),
        };
    }
    async createCustomerInstance(userId, input) {
        const membership = await db_1.prisma.membership.findFirst({
            where: {
                userId,
                workspaceId: input.workspaceId,
                role: {
                    in: ['owner', 'admin', 'operator'],
                },
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('You do not have permission to create instances in this workspace.');
        }
        const rawToken = (0, db_1.createOpaqueToken)('instance');
        const publicId = `inst_${(0, node_crypto_1.randomBytes)(6).toString('hex')}`;
        const now = new Date();
        const instance = await db_1.prisma.$transaction(async (tx) => {
            const createdInstance = await tx.instance.create({
                data: {
                    publicId,
                    workspaceId: input.workspaceId,
                    name: input.name.trim(),
                    status: 'standby',
                    createdByUserId: userId,
                    lastLifecycleEventAt: now,
                    settings: {
                        create: {
                            webhookSecret: generateWebhookSecret(),
                        },
                    },
                    runtimeState: {
                        create: {},
                    },
                    apiTokens: {
                        create: {
                            name: `${input.name.trim()} primary token`,
                            tokenType: 'instance_api',
                            tokenHash: (0, db_1.hashOpaqueToken)(rawToken),
                            prefix: (0, db_1.createTokenPrefix)(rawToken),
                            workspaceId: input.workspaceId,
                            createdByUserId: userId,
                        },
                    },
                    lifecycleEvents: {
                        create: {
                            eventType: 'instance_created',
                            actorType: 'customer_user',
                            actorId: userId,
                            message: 'Instance record created.',
                            toStatus: 'standby',
                        },
                    },
                },
                include: {
                    workspace: true,
                    settings: true,
                },
            });
            await this.auditLogsService.recordWithClient(tx, {
                workspaceId: createdInstance.workspaceId,
                instanceId: createdInstance.id,
                actorType: 'customer_user',
                actorId: userId,
                entityType: 'instance',
                entityId: createdInstance.id,
                action: 'instance.created',
                summary: `Instance "${createdInstance.name}" created.`,
                metadata: {
                    publicId: createdInstance.publicId,
                },
            });
            return createdInstance;
        });
        this.realtimeService.publishInstanceLifecycleUpdated({
            instanceId: instance.id,
            publicId: instance.publicId,
        });
        return {
            instance: (0, presenters_1.toInstanceSummary)(instance),
            instanceApiToken: rawToken,
        };
    }
    async getCustomerInstanceDetail(userId, instanceId) {
        const instance = await this.loadCustomerScopedInstanceDetail(userId, instanceId);
        const assignedWorker = await this.getAssignedWorker(instance.assignedWorkerId);
        return (0, presenters_1.toInstanceDetailResponse)({
            instance: {
                ...instance,
                settings: instance.settings,
                runtimeState: instance.runtimeState,
            },
            assignedWorker,
        });
    }
    async getAdminInstanceDetail(instanceId) {
        const instance = await this.loadAdminScopedInstanceDetail(instanceId);
        const assignedWorker = await this.getAssignedWorker(instance.assignedWorkerId);
        return (0, presenters_1.toInstanceDetailResponse)({
            instance: {
                ...instance,
                settings: instance.settings,
                runtimeState: instance.runtimeState,
            },
            assignedWorker,
        });
    }
    async getPublicInstanceStatus(principal) {
        const instance = await this.loadPublicScopedInstanceRuntime(principal.instanceId);
        return {
            instanceId: instance.id,
            publicId: instance.publicId,
            status: instance.status,
            substatus: instance.substatus ?? null,
            sessionBackend: instance.runtimeState.sessionBackend,
            currentSessionLabel: instance.runtimeState.currentSessionLabel ?? null,
            qrReady: Boolean(instance.runtimeState.qrCode),
            qrExpiresAt: instance.runtimeState.qrExpiresAt?.toISOString() ?? null,
            lastAuthenticatedAt: instance.runtimeState.lastAuthenticatedAt?.toISOString() ?? null,
            lastDisconnectedAt: instance.runtimeState.lastDisconnectedAt?.toISOString() ?? null,
            disconnectReason: instance.runtimeState.disconnectReason ?? null,
            updatedAt: instance.updatedAt.toISOString(),
        };
    }
    async getPublicInstanceMe(principal) {
        const instance = await this.loadPublicScopedInstanceRuntime(principal.instanceId);
        const diagnostics = this.readRuntimeDiagnostics(instance.runtimeState.sessionDiagnostics);
        const me = diagnostics && typeof diagnostics.me === 'object' ? diagnostics.me : null;
        return {
            instanceId: instance.id,
            publicId: instance.publicId,
            status: instance.status,
            substatus: instance.substatus ?? null,
            sessionBackend: instance.runtimeState.sessionBackend,
            currentSessionLabel: instance.runtimeState.currentSessionLabel ?? null,
            connected: instance.status === 'authenticated',
            me: me ?? null,
            diagnostics,
            updatedAt: instance.runtimeState.updatedAt.toISOString(),
        };
    }
    async getPublicInstanceSettings(principal) {
        const instance = await this.loadPublicScopedInstanceRuntime(principal.instanceId);
        return (0, presenters_1.toInstanceSettingsView)(instance.settings);
    }
    async getPublicInstanceQrCode(principal) {
        const instance = await this.loadPublicScopedInstanceRuntime(principal.instanceId);
        const qrExpiresAt = instance.runtimeState.qrExpiresAt;
        const expired = Boolean(qrExpiresAt && qrExpiresAt.getTime() <= Date.now());
        return {
            instanceId: instance.id,
            publicId: instance.publicId,
            qrCode: instance.runtimeState.qrCode ?? null,
            qrExpiresAt: qrExpiresAt?.toISOString() ?? null,
            expired,
            updatedAt: instance.runtimeState.updatedAt.toISOString(),
        };
    }
    async getPublicInstanceScreenshot(principal) {
        await this.ensureInstanceScaffolding(principal.instanceId);
        const instance = await db_1.prisma.instance.findUnique({
            where: {
                id: principal.instanceId,
            },
            select: {
                publicId: true,
                runtimeState: {
                    select: {
                        lastScreenshotAt: true,
                        lastScreenshotPath: true,
                    },
                },
            },
        });
        if (!instance) {
            throw new common_1.NotFoundException('Instance not found.');
        }
        return this.resolveScreenshotAsset(instance.publicId, instance.runtimeState?.lastScreenshotPath, instance.runtimeState?.lastScreenshotAt);
    }
    async getCustomerInstanceScreenshot(userId, instanceId) {
        await this.ensureInstanceScaffolding(instanceId);
        const instance = await db_1.prisma.instance.findFirst({
            where: {
                id: instanceId,
                workspace: {
                    memberships: {
                        some: {
                            userId,
                        },
                    },
                },
            },
            select: {
                publicId: true,
                runtimeState: {
                    select: {
                        lastScreenshotAt: true,
                        lastScreenshotPath: true,
                    },
                },
            },
        });
        if (!instance) {
            throw new common_1.NotFoundException('Instance not found.');
        }
        return this.resolveScreenshotAsset(instance.publicId, instance.runtimeState?.lastScreenshotPath, instance.runtimeState?.lastScreenshotAt);
    }
    async getAdminInstanceScreenshot(instanceId) {
        await this.ensureInstanceScaffolding(instanceId);
        const instance = await db_1.prisma.instance.findUnique({
            where: {
                id: instanceId,
            },
            select: {
                publicId: true,
                runtimeState: {
                    select: {
                        lastScreenshotAt: true,
                        lastScreenshotPath: true,
                    },
                },
            },
        });
        if (!instance) {
            throw new common_1.NotFoundException('Instance not found.');
        }
        return this.resolveScreenshotAsset(instance.publicId, instance.runtimeState?.lastScreenshotPath, instance.runtimeState?.lastScreenshotAt);
    }
    async updateCustomerInstanceSettings(userId, instanceId, input) {
        if (input.sendDelayMax < input.sendDelay) {
            throw new common_1.BadRequestException('sendDelayMax must be greater than or equal to sendDelay.');
        }
        const instance = await db_1.prisma.instance.findFirst({
            where: {
                id: instanceId,
                workspace: {
                    memberships: {
                        some: {
                            userId,
                            role: {
                                in: ['owner', 'admin', 'operator'],
                            },
                        },
                    },
                },
            },
            select: {
                id: true,
                publicId: true,
                workspaceId: true,
                settings: {
                    select: {
                        webhookSecret: true,
                    },
                },
            },
        });
        if (!instance) {
            throw new common_1.NotFoundException('Instance not found or not editable by this user.');
        }
        await this.ensureInstanceScaffolding(instanceId);
        const currentWebhookSecret = instance.settings?.webhookSecret ??
            (await db_1.prisma.instanceSettings.findUnique({
                where: {
                    instanceId,
                },
                select: {
                    webhookSecret: true,
                },
            }))?.webhookSecret;
        const now = new Date();
        const settings = await db_1.prisma.$transaction(async (tx) => {
            const updatedSettings = await tx.instanceSettings.update({
                where: {
                    instanceId,
                },
                data: {
                    sendDelay: input.sendDelay,
                    sendDelayMax: input.sendDelayMax,
                    webhookUrl: input.webhookUrl,
                    webhookSecret: resolveWebhookSecret(currentWebhookSecret, input.webhookSecret),
                    webhookMessageReceived: input.webhookMessageReceived,
                    webhookMessageCreate: input.webhookMessageCreate,
                    webhookMessageAck: input.webhookMessageAck,
                },
            });
            await tx.instance.update({
                where: { id: instanceId },
                data: {
                    lastLifecycleEventAt: now,
                },
            });
            await tx.instanceLifecycleEvent.create({
                data: {
                    instanceId,
                    eventType: 'settings_updated',
                    actorType: 'customer_user',
                    actorId: userId,
                    message: 'Instance settings updated.',
                },
            });
            await this.auditLogsService.recordWithClient(tx, {
                workspaceId: instance.workspaceId,
                instanceId,
                actorType: 'customer_user',
                actorId: userId,
                entityType: 'instance_settings',
                entityId: updatedSettings.id,
                action: 'instance.settings.updated',
                summary: 'Instance settings updated.',
                metadata: {
                    sendDelay: updatedSettings.sendDelay,
                    sendDelayMax: updatedSettings.sendDelayMax,
                    webhookUrl: updatedSettings.webhookUrl,
                    webhookSecretUpdated: input.webhookSecret !== undefined,
                    webhookMessageReceived: updatedSettings.webhookMessageReceived,
                    webhookMessageCreate: updatedSettings.webhookMessageCreate,
                    webhookMessageAck: updatedSettings.webhookMessageAck,
                },
            });
            return updatedSettings;
        });
        this.realtimeService.publishInstanceSettingsUpdated({
            instanceId,
            publicId: instance.publicId,
        });
        this.realtimeService.publishInstanceLifecycleUpdated({
            instanceId,
            publicId: instance.publicId,
        });
        return {
            instanceId,
            settings: (0, presenters_1.toInstanceSettingsView)(settings),
            updatedAt: settings.updatedAt.toISOString(),
        };
    }
    async updatePublicInstanceSettings(principal, input) {
        await this.ensureInstanceScaffolding(principal.instanceId);
        const instance = await db_1.prisma.instance.findUnique({
            where: {
                id: principal.instanceId,
            },
            include: {
                settings: true,
            },
        });
        if (!instance || !instance.settings) {
            throw new common_1.NotFoundException('Instance not found.');
        }
        const currentSettings = instance.settings;
        const mergedSettings = {
            sendDelay: input.sendDelay ?? input.sendDelaySeconds ?? currentSettings.sendDelay,
            sendDelayMax: input.sendDelayMax ??
                input.sendDelayMaxSeconds ??
                currentSettings.sendDelayMax,
            webhookUrl: input.webhookUrl === undefined
                ? currentSettings.webhookUrl
                : input.webhookUrl,
            webhookSecret: input.webhookSecret === undefined
                ? currentSettings.webhookSecret
                : input.webhookSecret,
            webhookMessageReceived: input.webhookMessageReceived ?? currentSettings.webhookMessageReceived,
            webhookMessageCreate: input.webhookMessageCreate ?? currentSettings.webhookMessageCreate,
            webhookMessageAck: input.webhookMessageAck ?? currentSettings.webhookMessageAck,
        };
        if (mergedSettings.sendDelayMax < mergedSettings.sendDelay) {
            throw new common_1.BadRequestException('sendDelayMax must be greater than or equal to sendDelay.');
        }
        const now = new Date();
        const settings = await db_1.prisma.$transaction(async (tx) => {
            const updatedSettings = await tx.instanceSettings.update({
                where: {
                    instanceId: principal.instanceId,
                },
                data: {
                    sendDelay: mergedSettings.sendDelay,
                    sendDelayMax: mergedSettings.sendDelayMax,
                    webhookUrl: mergedSettings.webhookUrl,
                    webhookSecret: resolveWebhookSecret(currentSettings.webhookSecret, mergedSettings.webhookSecret),
                    webhookMessageReceived: mergedSettings.webhookMessageReceived,
                    webhookMessageCreate: mergedSettings.webhookMessageCreate,
                    webhookMessageAck: mergedSettings.webhookMessageAck,
                },
            });
            await tx.instance.update({
                where: { id: principal.instanceId },
                data: {
                    lastLifecycleEventAt: now,
                },
            });
            await tx.instanceLifecycleEvent.create({
                data: {
                    instanceId: principal.instanceId,
                    eventType: 'settings_updated',
                    actorType: 'system',
                    actorId: principal.tokenId,
                    message: 'Instance settings updated through the public instance API.',
                    metadata: {
                        authTokenType: principal.tokenType,
                        tokenPrefix: principal.tokenPrefix,
                    },
                },
            });
            await this.auditLogsService.recordWithClient(tx, {
                workspaceId: principal.workspaceId,
                instanceId: principal.instanceId,
                actorType: 'system',
                actorId: principal.tokenId,
                entityType: 'instance_settings',
                entityId: updatedSettings.id,
                action: 'instance.settings.updated',
                summary: 'Instance settings updated through the public instance API.',
                metadata: {
                    authTokenType: principal.tokenType,
                    tokenPrefix: principal.tokenPrefix,
                    webhookRetries: input.webhookRetries ?? null,
                    sendDelay: updatedSettings.sendDelay,
                    sendDelayMax: updatedSettings.sendDelayMax,
                    webhookUrl: updatedSettings.webhookUrl,
                    webhookSecretUpdated: input.webhookSecret !== undefined,
                    webhookMessageReceived: updatedSettings.webhookMessageReceived,
                    webhookMessageCreate: updatedSettings.webhookMessageCreate,
                    webhookMessageAck: updatedSettings.webhookMessageAck,
                },
            });
            return updatedSettings;
        });
        this.realtimeService.publishInstanceSettingsUpdated({
            instanceId: principal.instanceId,
            publicId: principal.instancePublicId,
        });
        this.realtimeService.publishInstanceLifecycleUpdated({
            instanceId: principal.instanceId,
            publicId: principal.instancePublicId,
        });
        return {
            instanceId: principal.instanceId,
            settings: (0, presenters_1.toInstanceSettingsView)(settings),
            updatedAt: settings.updatedAt.toISOString(),
        };
    }
    async requestCustomerInstanceAction(userId, instanceId, input) {
        if (input.action === 'reassign') {
            throw new common_1.ForbiddenException('Only platform admins can reassign an instance.');
        }
        const instance = await db_1.prisma.instance.findFirst({
            where: {
                id: instanceId,
                workspace: {
                    memberships: {
                        some: {
                            userId,
                            role: {
                                in: ['owner', 'admin', 'operator'],
                            },
                        },
                    },
                },
            },
            select: {
                id: true,
                publicId: true,
                workspaceId: true,
                status: true,
                substatus: true,
            },
        });
        if (!instance) {
            throw new common_1.NotFoundException('Instance not found or not actionable by this user.');
        }
        if (input.action === 'takeover' &&
            !isConflictSubstatus(instance.substatus)) {
            return {
                instanceId: instance.id,
                message: 'This instance is not currently blocked by a session conflict.',
                operation: null,
            };
        }
        return this.enqueueInstanceAction({
            instanceId: instance.id,
            publicId: instance.publicId,
            workspaceId: instance.workspaceId,
            currentStatus: instance.status,
            currentSubstatus: instance.substatus,
            actorType: 'customer_user',
            actorId: userId,
            input,
        });
    }
    async requestPublicInstanceAction(principal, input) {
        if (input.action === 'reassign') {
            throw new common_1.ForbiddenException('Public instance API tokens cannot reassign an instance.');
        }
        const instance = await db_1.prisma.instance.findUnique({
            where: {
                id: principal.instanceId,
            },
            select: {
                id: true,
                publicId: true,
                workspaceId: true,
                status: true,
                substatus: true,
            },
        });
        if (!instance) {
            throw new common_1.NotFoundException('Instance not found.');
        }
        if (input.action === 'takeover' &&
            !isConflictSubstatus(instance.substatus)) {
            return {
                instanceId: instance.id,
                message: 'This instance is not currently blocked by a session conflict.',
                operation: null,
            };
        }
        return this.enqueueInstanceAction({
            instanceId: instance.id,
            publicId: instance.publicId,
            workspaceId: instance.workspaceId,
            currentStatus: instance.status,
            currentSubstatus: instance.substatus,
            actorType: 'system',
            actorId: principal.tokenId,
            extraAuditMetadata: {
                authTokenType: principal.tokenType,
                tokenPrefix: principal.tokenPrefix,
            },
            input,
        });
    }
    async requestAdminInstanceAction(userId, instanceId, input) {
        const instance = await db_1.prisma.instance.findUnique({
            where: {
                id: instanceId,
            },
            select: {
                id: true,
                publicId: true,
                workspaceId: true,
                status: true,
                substatus: true,
                assignedWorkerId: true,
            },
        });
        if (!instance) {
            throw new common_1.NotFoundException('Instance not found.');
        }
        if (input.action === 'reassign') {
            return this.reassignInstance(userId, instance.id, instance.publicId, instance.status, instance.substatus, input.targetWorkerId);
        }
        if (input.action === 'takeover' &&
            !isConflictSubstatus(instance.substatus)) {
            return {
                instanceId: instance.id,
                message: 'This instance is not currently blocked by a session conflict.',
                operation: null,
            };
        }
        return this.enqueueInstanceAction({
            instanceId: instance.id,
            publicId: instance.publicId,
            workspaceId: instance.workspaceId,
            currentStatus: instance.status,
            currentSubstatus: instance.substatus,
            actorType: 'platform_admin',
            actorId: userId,
            input,
        });
    }
    async rotateCustomerInstanceToken(userId, instanceId) {
        const instance = await db_1.prisma.instance.findFirst({
            where: {
                id: instanceId,
                workspace: {
                    memberships: {
                        some: {
                            userId,
                            role: {
                                in: ['owner', 'admin', 'operator'],
                            },
                        },
                    },
                },
            },
            select: {
                id: true,
                name: true,
                workspaceId: true,
                publicId: true,
            },
        });
        if (!instance) {
            throw new common_1.NotFoundException('Instance not found or not rotatable by this user.');
        }
        const rawToken = (0, db_1.createOpaqueToken)('instance');
        const tokenPrefix = (0, db_1.createTokenPrefix)(rawToken);
        const now = new Date();
        const createdToken = await db_1.prisma.$transaction(async (tx) => {
            await tx.apiToken.updateMany({
                where: {
                    instanceId,
                    tokenType: 'instance_api',
                    revokedAt: null,
                },
                data: {
                    revokedAt: now,
                },
            });
            const nextToken = await tx.apiToken.create({
                data: {
                    name: `${instance.name} rotated token`,
                    tokenType: 'instance_api',
                    tokenHash: (0, db_1.hashOpaqueToken)(rawToken),
                    prefix: tokenPrefix,
                    workspaceId: instance.workspaceId,
                    instanceId,
                    createdByUserId: userId,
                },
            });
            await tx.instance.update({
                where: { id: instanceId },
                data: {
                    lastLifecycleEventAt: now,
                },
            });
            await tx.instanceLifecycleEvent.create({
                data: {
                    instanceId,
                    eventType: 'token_rotated',
                    actorType: 'customer_user',
                    actorId: userId,
                    message: 'Instance API token rotated.',
                },
            });
            await this.auditLogsService.recordWithClient(tx, {
                workspaceId: instance.workspaceId,
                instanceId,
                actorType: 'customer_user',
                actorId: userId,
                entityType: 'instance_api_token',
                entityId: nextToken.id,
                action: 'instance.api_token.rotated',
                summary: `Instance API token rotated for "${instance.name}".`,
                metadata: {
                    prefix: nextToken.prefix,
                },
            });
            return nextToken;
        });
        this.realtimeService.publishInstanceLifecycleUpdated({
            instanceId,
            publicId: instance.publicId,
        });
        return {
            instanceId,
            token: rawToken,
            prefix: createdToken.prefix,
            createdAt: createdToken.createdAt.toISOString(),
        };
    }
    async enqueueInstanceAction(input) {
        await this.ensureInstanceScaffolding(input.instanceId);
        if (input.input.action === 'start' &&
            startNoOpStatuses.has(input.currentStatus)) {
            return {
                instanceId: input.instanceId,
                message: getStartNoOpMessage(input.currentStatus),
                operation: null,
            };
        }
        const existingOperation = await db_1.prisma.instanceOperation.findFirst({
            where: {
                instanceId: input.instanceId,
                status: {
                    in: ['pending', 'running'],
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        if (existingOperation) {
            throw new common_1.ConflictException('An instance action is already pending or running.');
        }
        const now = new Date();
        const operation = await db_1.prisma.$transaction(async (tx) => {
            const createdOperation = await tx.instanceOperation.create({
                data: {
                    instanceId: input.instanceId,
                    operationType: input.input.action,
                    status: 'pending',
                    requestedByActorType: input.actorType,
                    requestedByActorId: input.actorId,
                    targetWorkerId: input.input.targetWorkerId ?? null,
                    message: `${input.input.action} requested.`,
                },
            });
            await tx.instance.update({
                where: {
                    id: input.instanceId,
                },
                data: {
                    lastLifecycleEventAt: now,
                    substatus: `${input.input.action}_queued`,
                },
            });
            await tx.instanceLifecycleEvent.create({
                data: {
                    instanceId: input.instanceId,
                    eventType: 'action_requested',
                    actorType: input.actorType,
                    actorId: input.actorId,
                    message: `${input.input.action} action requested.`,
                    fromStatus: input.currentStatus,
                    toStatus: input.currentStatus,
                    metadata: {
                        action: input.input.action,
                        targetWorkerId: input.input.targetWorkerId ?? null,
                        previousSubstatus: input.currentSubstatus,
                        ...(input.extraAuditMetadata ?? {}),
                    },
                },
            });
            await this.auditLogsService.recordWithClient(tx, {
                workspaceId: input.workspaceId,
                instanceId: input.instanceId,
                actorType: input.actorType,
                actorId: input.actorId,
                entityType: 'instance_operation',
                entityId: createdOperation.id,
                action: 'instance.action.requested',
                summary: `${input.input.action} action queued.`,
                metadata: {
                    action: input.input.action,
                    targetWorkerId: input.input.targetWorkerId ?? null,
                    previousSubstatus: input.currentSubstatus,
                    ...(input.extraAuditMetadata ?? {}),
                },
            });
            return createdOperation;
        });
        this.realtimeService.publishInstanceOperationUpdated({
            instanceId: input.instanceId,
            publicId: input.publicId,
            operationId: operation.id,
            status: operation.status,
        });
        this.realtimeService.publishInstanceLifecycleUpdated({
            instanceId: input.instanceId,
            publicId: input.publicId,
        });
        return {
            instanceId: input.instanceId,
            message: `${input.input.action} action queued.`,
            operation: (0, presenters_1.toInstanceOperationSummary)(operation),
        };
    }
    async reassignInstance(userId, instanceId, publicId, currentStatus, currentSubstatus, targetWorkerId) {
        if (!targetWorkerId) {
            throw new common_1.BadRequestException('targetWorkerId is required for reassign.');
        }
        const targetWorker = await db_1.prisma.workerHeartbeat.findUnique({
            where: {
                workerId: targetWorkerId,
            },
        });
        if (!targetWorker) {
            throw new common_1.NotFoundException('Target worker was not found.');
        }
        await this.ensureInstanceScaffolding(instanceId);
        const current = await db_1.prisma.instance.findUnique({
            where: {
                id: instanceId,
            },
            select: {
                assignedWorkerId: true,
                workspaceId: true,
                name: true,
            },
        });
        if (!current) {
            throw new common_1.NotFoundException('Instance not found.');
        }
        if (current.assignedWorkerId === targetWorkerId) {
            return {
                instanceId,
                message: `Instance is already assigned to ${targetWorkerId}.`,
                operation: null,
            };
        }
        const now = new Date();
        await db_1.prisma.$transaction(async (tx) => {
            await tx.instance.update({
                where: {
                    id: instanceId,
                },
                data: {
                    assignedWorkerId: targetWorkerId,
                    status: 'standby',
                    substatus: 'reassigned',
                    lastHeartbeatAt: now,
                    lastLifecycleEventAt: now,
                },
            });
            await tx.instanceRuntimeState.update({
                where: {
                    instanceId,
                },
                data: {
                    qrCode: null,
                    qrExpiresAt: null,
                    currentSessionLabel: null,
                    disconnectReason: null,
                    lastDisconnectedAt: now,
                },
            });
            await tx.instanceOperation.updateMany({
                where: {
                    instanceId,
                    status: 'running',
                },
                data: {
                    status: 'pending',
                    startedAt: null,
                    message: 'Operation returned to pending after reassignment.',
                },
            });
            await tx.outboundMessage.updateMany({
                where: {
                    instanceId,
                    status: 'queue',
                },
                data: {
                    processingWorkerId: null,
                    processingStartedAt: null,
                },
            });
            if (current.assignedWorkerId) {
                await tx.instanceLifecycleEvent.create({
                    data: {
                        instanceId,
                        eventType: 'worker_released',
                        actorType: 'platform_admin',
                        actorId: userId,
                        message: `Admin reassigned instance away from ${current.assignedWorkerId}.`,
                        fromStatus: currentStatus,
                        toStatus: 'standby',
                        metadata: {
                            previousWorkerId: current.assignedWorkerId,
                            previousSubstatus: currentSubstatus,
                        },
                    },
                });
            }
            await tx.instanceLifecycleEvent.create({
                data: {
                    instanceId,
                    eventType: 'worker_assigned',
                    actorType: 'platform_admin',
                    actorId: userId,
                    message: `Admin assigned instance to ${targetWorkerId}.`,
                    fromStatus: currentStatus,
                    toStatus: 'standby',
                    metadata: {
                        targetWorkerId,
                        previousSubstatus: currentSubstatus,
                    },
                },
            });
            await this.auditLogsService.recordWithClient(tx, {
                workspaceId: current.workspaceId,
                instanceId,
                actorType: 'platform_admin',
                actorId: userId,
                entityType: 'instance',
                entityId: instanceId,
                action: 'instance.reassigned',
                summary: `Instance "${current.name}" reassigned to worker ${targetWorkerId}.`,
                metadata: {
                    previousWorkerId: current.assignedWorkerId ?? null,
                    targetWorkerId,
                    previousStatus: currentStatus,
                    previousSubstatus: currentSubstatus,
                },
            });
        });
        this.realtimeService.publishInstanceStatusChanged({
            instanceId,
            status: 'standby',
            substatus: 'reassigned',
            lastUpdatedAt: now.toISOString(),
            publicId,
        });
        this.realtimeService.publishInstanceRuntimeUpdated({
            instanceId,
            publicId,
            currentSessionLabel: null,
            disconnectReason: null,
        });
        this.realtimeService.publishInstanceLifecycleUpdated({
            instanceId,
            publicId,
        });
        this.realtimeService.publishWorkerHealthUpdated({
            workerId: targetWorkerId,
        });
        if (current.assignedWorkerId) {
            this.realtimeService.publishWorkerHealthUpdated({
                workerId: current.assignedWorkerId,
            });
        }
        return {
            instanceId,
            message: `Instance reassigned to ${targetWorkerId}.`,
            operation: null,
        };
    }
    async loadPublicScopedInstanceRuntime(instanceId) {
        await this.ensureInstanceScaffolding(instanceId);
        const instance = await db_1.prisma.instance.findUnique({
            where: {
                id: instanceId,
            },
            include: {
                settings: true,
                runtimeState: true,
            },
        });
        if (!instance?.settings || !instance.runtimeState) {
            throw new common_1.NotFoundException('Instance not found.');
        }
        return {
            ...instance,
            settings: instance.settings,
            runtimeState: instance.runtimeState,
        };
    }
    readRuntimeDiagnostics(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return null;
        }
        return value;
    }
    async loadCustomerScopedInstanceDetail(userId, instanceId) {
        await this.ensureInstanceScaffolding(instanceId);
        const instance = await db_1.prisma.instance.findFirst({
            where: {
                id: instanceId,
                workspace: {
                    memberships: {
                        some: {
                            userId,
                        },
                    },
                },
            },
            include: detailInclude,
        });
        if (!instance || !instance.settings || !instance.runtimeState) {
            throw new common_1.NotFoundException('Instance not found.');
        }
        return instance;
    }
    async loadAdminScopedInstanceDetail(instanceId) {
        await this.ensureInstanceScaffolding(instanceId);
        const instance = await db_1.prisma.instance.findUnique({
            where: {
                id: instanceId,
            },
            include: detailInclude,
        });
        if (!instance || !instance.settings || !instance.runtimeState) {
            throw new common_1.NotFoundException('Instance not found.');
        }
        return instance;
    }
    async ensureInstanceScaffolding(instanceId) {
        await db_1.prisma.$transaction(async (tx) => {
            await tx.instanceSettings.upsert({
                where: {
                    instanceId,
                },
                update: {},
                create: {
                    instanceId,
                    webhookSecret: generateWebhookSecret(),
                },
            });
            await tx.instanceRuntimeState.upsert({
                where: {
                    instanceId,
                },
                update: {},
                create: {
                    instanceId,
                },
            });
        });
    }
    async getWorkerMap(workerIds) {
        const uniqueWorkerIds = [
            ...new Set(workerIds.filter((workerId) => Boolean(workerId))),
        ];
        if (uniqueWorkerIds.length === 0) {
            return new Map();
        }
        const workers = await db_1.prisma.workerHeartbeat.findMany({
            where: {
                workerId: {
                    in: uniqueWorkerIds,
                },
            },
        });
        return new Map(workers.map((worker) => [worker.workerId, worker]));
    }
    async getAssignedWorker(workerId) {
        if (!workerId) {
            return null;
        }
        return db_1.prisma.workerHeartbeat.findUnique({
            where: {
                workerId,
            },
        });
    }
    async resolveScreenshotAsset(publicId, lastScreenshotPath, lastScreenshotAt) {
        if (!lastScreenshotPath) {
            throw new common_1.NotFoundException('No screenshot has been captured for this instance.');
        }
        const screenshotPath = (0, node_path_1.resolve)(lastScreenshotPath);
        const screenshotStat = await (0, promises_1.stat)(screenshotPath).catch(() => null);
        if (!screenshotStat?.isFile()) {
            throw new common_1.NotFoundException('The saved screenshot file is no longer available.');
        }
        return {
            publicId,
            path: screenshotPath,
            filename: (0, node_path_1.basename)(screenshotPath),
            capturedAt: lastScreenshotAt?.toISOString() ?? null,
        };
    }
};
exports.InstancesService = InstancesService;
exports.InstancesService = InstancesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [realtime_service_1.RealtimeService,
        audit_logs_service_1.AuditLogsService])
], InstancesService);
//# sourceMappingURL=instances.service.js.map