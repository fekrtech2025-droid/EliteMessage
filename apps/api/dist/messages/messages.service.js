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
exports.MessagesService = void 0;
const promises_1 = require("node:fs/promises");
const node_crypto_1 = require("node:crypto");
const node_path_1 = require("node:path");
const common_1 = require("@nestjs/common");
const db_1 = require("@elite-message/db");
const config_1 = require("@elite-message/config");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const presenters_1 = require("../common/presenters");
const metrics_service_1 = require("../ops/metrics.service");
const realtime_service_1 = require("../realtime/realtime.service");
const webhook_dispatch_service_1 = require("./webhook-dispatch.service");
const outboundMessageInclude = {
    instance: {
        select: {
            publicId: true,
        },
    },
};
const webhookDeliveryInclude = {
    instance: {
        select: {
            publicId: true,
            workspaceId: true,
        },
    },
    outboundMessage: {
        select: {
            publicMessageId: true,
        },
    },
};
const inboundMessageInclude = {
    instance: {
        select: {
            publicId: true,
        },
    },
};
const initialMessageStatistics = {
    queue: 0,
    sent: 0,
    unsent: 0,
    invalid: 0,
    expired: 0,
    total: 0,
};
function isUuidLike(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
function toNullableJsonInput(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return db_1.Prisma.JsonNull;
    }
    return value;
}
function sanitizeOpaqueSegment(value) {
    return value.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80) || 'asset';
}
function sanitizeFileName(value) {
    const extension = (0, node_path_1.extname)(value)
        .slice(0, 12)
        .replace(/[^a-zA-Z0-9.]/g, '') || '.bin';
    const baseName = value
        .replace((0, node_path_1.extname)(value), '')
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 80);
    return `${baseName || 'upload'}${extension}`;
}
function routeSafePublicMediaPath(assetId, fileName) {
    return `/api/v1/public/customer-media/${encodeURIComponent(assetId)}/${encodeURIComponent(fileName)}`;
}
function safeJsonParse(value) {
    try {
        return JSON.parse(value);
    }
    catch {
        return null;
    }
}
let MessagesService = class MessagesService {
    realtimeService;
    webhookDispatchService;
    auditLogsService;
    metricsService;
    apiEnv;
    customerMediaRoot;
    constructor(realtimeService, webhookDispatchService, auditLogsService, metricsService) {
        this.realtimeService = realtimeService;
        this.webhookDispatchService = webhookDispatchService;
        this.auditLogsService = auditLogsService;
        this.metricsService = metricsService;
        this.apiEnv = (0, config_1.parseApiEnv)(process.env);
        this.customerMediaRoot = (0, node_path_1.resolve)((0, config_1.findWorkspaceRoot)(process.cwd()), '.runtime', 'customer-media');
    }
    async sendCustomerChatMessage(userId, instanceId, input) {
        const instance = await this.loadCustomerMessagingInstance(userId, instanceId);
        const message = await this.createOutboundMessage({
            instance,
            actorId: userId,
            actorType: 'customer_user',
            messageType: 'chat',
            recipient: input.to.trim(),
            body: input.body.trim(),
            mediaUrl: null,
            caption: null,
            referenceId: input.referenceId?.trim() || null,
            priority: input.priority ?? 100,
        });
        return { message };
    }
    async sendCustomerImageMessage(userId, instanceId, input) {
        const instance = await this.loadCustomerMessagingInstance(userId, instanceId);
        const message = await this.createOutboundMessage({
            instance,
            actorId: userId,
            actorType: 'customer_user',
            messageType: 'image',
            recipient: input.to.trim(),
            body: null,
            mediaUrl: input.imageUrl,
            caption: input.caption?.trim() || null,
            referenceId: input.referenceId?.trim() || null,
            priority: input.priority ?? 100,
        });
        return { message };
    }
    async sendPublicChatMessage(principal, input) {
        const instance = await this.loadPublicMessagingInstance(principal.instanceId);
        const message = await this.createOutboundMessage({
            instance,
            actorId: principal.tokenId,
            actorType: 'system',
            auditMetadata: {
                authTokenType: principal.tokenType,
                tokenPrefix: principal.tokenPrefix,
            },
            messageType: 'chat',
            recipient: input.to.trim(),
            body: input.body.trim(),
            mediaUrl: null,
            caption: null,
            referenceId: input.referenceId?.trim() || null,
            priority: input.priority ?? 100,
        });
        return { message };
    }
    async sendPublicImageMessage(principal, input) {
        const instance = await this.loadPublicMessagingInstance(principal.instanceId);
        const message = await this.createOutboundMessage({
            instance,
            actorId: principal.tokenId,
            actorType: 'system',
            auditMetadata: {
                authTokenType: principal.tokenType,
                tokenPrefix: principal.tokenPrefix,
            },
            messageType: 'image',
            recipient: input.to.trim(),
            body: null,
            mediaUrl: input.imageUrl,
            caption: input.caption?.trim() || null,
            referenceId: input.referenceId?.trim() || null,
            priority: input.priority ?? 100,
        });
        return { message };
    }
    async listCustomerMessages(userId, instanceId, filters) {
        const instance = await this.loadCustomerMessagingInstance(userId, instanceId);
        return this.listMessages({
            ...filters,
            instanceId: instance.id,
        });
    }
    async listPublicMessages(principal, filters) {
        const instance = await this.loadPublicMessagingInstance(principal.instanceId);
        return this.listMessages({
            ...filters,
            instanceId: instance.id,
        });
    }
    async getCustomerMessageStatistics(userId, instanceId) {
        const instance = await this.loadCustomerMessagingInstance(userId, instanceId);
        return this.getMessageStatistics(instance.id);
    }
    async getPublicMessageStatistics(principal) {
        const instance = await this.loadPublicMessagingInstance(principal.instanceId);
        return this.getMessageStatistics(instance.id);
    }
    async resendCustomerMessage(userId, instanceId, messageId) {
        const instance = await this.loadCustomerMessagingInstance(userId, instanceId);
        const existing = await db_1.prisma.outboundMessage.findFirst({
            where: {
                id: messageId,
                instanceId: instance.id,
            },
            include: outboundMessageInclude,
        });
        if (!existing) {
            throw new common_1.NotFoundException('Outbound message not found.');
        }
        const message = await this.requeueOutboundMessage(instance, existing, {
            actorId: userId,
            actorType: 'customer_user',
            auditStrategy: 'single',
        });
        await this.publishInstanceStatistics(instance.id, instance.publicId);
        return { message };
    }
    async resendPublicMessage(principal, messageId) {
        const instance = await this.loadPublicMessagingInstance(principal.instanceId);
        const messageSelectors = isUuidLike(messageId)
            ? [{ id: messageId }, { publicMessageId: messageId }]
            : [{ publicMessageId: messageId }];
        const existing = await db_1.prisma.outboundMessage.findFirst({
            where: {
                instanceId: instance.id,
                OR: messageSelectors,
            },
            include: outboundMessageInclude,
        });
        if (!existing) {
            throw new common_1.NotFoundException('Outbound message not found.');
        }
        const message = await this.requeueOutboundMessage(instance, existing, {
            actorId: principal.tokenId,
            actorType: 'system',
            auditStrategy: 'single',
            auditMetadata: {
                authTokenType: principal.tokenType,
                tokenPrefix: principal.tokenPrefix,
            },
        });
        await this.publishInstanceStatistics(instance.id, instance.publicId);
        return { message };
    }
    async resendCustomerMessagesByStatus(userId, instanceId, input) {
        const instance = await this.loadCustomerMessagingInstance(userId, instanceId);
        if (input.status === 'queue') {
            return {
                instanceId: instance.id,
                status: input.status,
                requeuedCount: 0,
                updatedAt: new Date().toISOString(),
            };
        }
        const messages = await db_1.prisma.outboundMessage.findMany({
            where: {
                instanceId: instance.id,
                status: input.status,
            },
            include: outboundMessageInclude,
            orderBy: {
                createdAt: 'asc',
            },
        });
        let requeuedCount = 0;
        for (const message of messages) {
            const requeued = await this.requeueOutboundMessage(instance, message, {
                actorId: userId,
                actorType: 'customer_user',
                auditStrategy: 'none',
            });
            if (requeued.status === 'queue' && message.status !== 'queue') {
                requeuedCount += 1;
            }
        }
        const updatedAt = new Date().toISOString();
        await this.auditLogsService.record({
            workspaceId: instance.workspaceId,
            instanceId: instance.id,
            actorType: 'customer_user',
            actorId: userId,
            entityType: 'instance',
            entityId: instance.id,
            action: 'message.outbound.requeued_by_status',
            summary: `${requeuedCount} outbound messages requeued from ${input.status}.`,
            metadata: {
                status: input.status,
                requeuedCount,
            },
        });
        await this.publishInstanceStatistics(instance.id, instance.publicId);
        return {
            instanceId: instance.id,
            status: input.status,
            requeuedCount,
            updatedAt,
        };
    }
    async resendPublicMessagesByStatus(principal, input) {
        const instance = await this.loadPublicMessagingInstance(principal.instanceId);
        if (input.status === 'queue') {
            return {
                instanceId: instance.id,
                status: input.status,
                requeuedCount: 0,
                updatedAt: new Date().toISOString(),
            };
        }
        const messages = await db_1.prisma.outboundMessage.findMany({
            where: {
                instanceId: instance.id,
                status: input.status,
            },
            include: outboundMessageInclude,
            orderBy: {
                createdAt: 'asc',
            },
        });
        let requeuedCount = 0;
        for (const message of messages) {
            const requeued = await this.requeueOutboundMessage(instance, message, {
                actorId: principal.tokenId,
                actorType: 'system',
                auditStrategy: 'none',
                auditMetadata: {
                    authTokenType: principal.tokenType,
                    tokenPrefix: principal.tokenPrefix,
                },
            });
            if (requeued.status === 'queue' && message.status !== 'queue') {
                requeuedCount += 1;
            }
        }
        const updatedAt = new Date().toISOString();
        await this.auditLogsService.record({
            workspaceId: instance.workspaceId,
            instanceId: instance.id,
            actorType: 'system',
            actorId: principal.tokenId,
            entityType: 'instance',
            entityId: instance.id,
            action: 'message.outbound.requeued_by_status',
            summary: `${requeuedCount} outbound messages requeued from ${input.status} through the public instance API.`,
            metadata: {
                authTokenType: principal.tokenType,
                tokenPrefix: principal.tokenPrefix,
                status: input.status,
                requeuedCount,
            },
        });
        await this.publishInstanceStatistics(instance.id, instance.publicId);
        return {
            instanceId: instance.id,
            status: input.status,
            requeuedCount,
            updatedAt,
        };
    }
    async clearCustomerMessagesByStatus(userId, instanceId, input) {
        const instance = await this.loadCustomerMessagingInstance(userId, instanceId);
        const cleared = await db_1.prisma.outboundMessage.deleteMany({
            where: {
                instanceId: instance.id,
                status: input.status,
                processingWorkerId: input.status === 'queue' ? null : undefined,
            },
        });
        const updatedAt = new Date().toISOString();
        await this.auditLogsService.record({
            workspaceId: instance.workspaceId,
            instanceId: instance.id,
            actorType: 'customer_user',
            actorId: userId,
            entityType: 'instance',
            entityId: instance.id,
            action: 'message.outbound.cleared_by_status',
            summary: `${cleared.count} outbound messages cleared from ${input.status}.`,
            metadata: {
                status: input.status,
                clearedCount: cleared.count,
            },
        });
        this.realtimeService.publishInstanceMessageUpdated({
            instanceId: instance.id,
            publicId: instance.publicId,
            messageId: null,
        });
        await this.publishInstanceStatistics(instance.id, instance.publicId);
        return {
            instanceId: instance.id,
            status: input.status,
            clearedCount: cleared.count,
            updatedAt,
        };
    }
    async clearPublicMessagesByStatus(principal, input) {
        const instance = await this.loadPublicMessagingInstance(principal.instanceId);
        const cleared = await db_1.prisma.outboundMessage.deleteMany({
            where: {
                instanceId: instance.id,
                status: input.status,
                processingWorkerId: input.status === 'queue' ? null : undefined,
            },
        });
        const updatedAt = new Date().toISOString();
        await this.auditLogsService.record({
            workspaceId: instance.workspaceId,
            instanceId: instance.id,
            actorType: 'system',
            actorId: principal.tokenId,
            entityType: 'instance',
            entityId: instance.id,
            action: 'message.outbound.cleared_by_status',
            summary: `${cleared.count} outbound messages cleared from ${input.status} through the public instance API.`,
            metadata: {
                authTokenType: principal.tokenType,
                tokenPrefix: principal.tokenPrefix,
                status: input.status,
                clearedCount: cleared.count,
            },
        });
        this.realtimeService.publishInstanceMessageUpdated({
            instanceId: instance.id,
            publicId: instance.publicId,
            messageId: null,
        });
        await this.publishInstanceStatistics(instance.id, instance.publicId);
        return {
            instanceId: instance.id,
            status: input.status,
            clearedCount: cleared.count,
            updatedAt,
        };
    }
    async listCustomerWebhookDeliveries(userId, instanceId, filters) {
        const instance = await this.loadCustomerMessagingInstance(userId, instanceId);
        return this.listWebhookDeliveries({
            ...filters,
            instanceId: instance.id,
        });
    }
    async listCustomerInboundMessages(userId, instanceId, filters) {
        const instance = await this.loadCustomerMessagingInstance(userId, instanceId);
        return this.listInboundMessages({
            ...filters,
            instanceId: instance.id,
        });
    }
    async listWorkspaceCustomerMessages(userId, filters) {
        const access = await this.loadCustomerMessageAccess(userId, filters.workspaceId, filters.instanceId);
        if (access.instanceIds.length === 0) {
            return {
                items: [],
            };
        }
        return this.listMessages({
            ...filters,
            instanceIds: access.instanceIds,
        });
    }
    async listWorkspaceCustomerInboundMessages(userId, filters) {
        const access = await this.loadCustomerMessageAccess(userId, filters.workspaceId, filters.instanceId);
        if (access.instanceIds.length === 0) {
            return {
                items: [],
            };
        }
        return this.listInboundMessages({
            ...filters,
            instanceIds: access.instanceIds,
        });
    }
    async sendCustomerUploadedImageMessage(userId, instanceId, input, file) {
        if (!file.buffer.length) {
            throw new common_1.BadRequestException('Uploaded media file is empty.');
        }
        if (!file.mimeType.startsWith('image/')) {
            throw new common_1.BadRequestException('Only image uploads are supported by this endpoint.');
        }
        const instance = await this.loadCustomerMessagingInstance(userId, instanceId);
        const uploadedAsset = await this.persistCustomerMediaAsset(instance.publicId, file);
        const message = await this.createOutboundMessage({
            instance,
            actorId: userId,
            actorType: 'customer_user',
            messageType: 'image',
            recipient: input.to.trim(),
            body: null,
            mediaUrl: uploadedAsset.assetUrl,
            caption: input.caption?.trim() || null,
            referenceId: input.referenceId?.trim() || null,
            priority: input.priority ?? 100,
        });
        return { message };
    }
    async readPublicCustomerMediaAsset(assetId, fileName) {
        const assetDirectory = (0, node_path_1.resolve)(this.customerMediaRoot, sanitizeOpaqueSegment(assetId));
        const absolutePath = (0, node_path_1.resolve)(assetDirectory, sanitizeFileName(fileName));
        const metadataPath = (0, node_path_1.resolve)(assetDirectory, 'metadata.json');
        const assetStats = await (0, promises_1.stat)(absolutePath).catch(() => null);
        if (!assetStats?.isFile()) {
            throw new common_1.NotFoundException('Customer media asset not found.');
        }
        const metadataRaw = await (0, promises_1.readFile)(metadataPath, 'utf8').catch(() => null);
        const metadata = metadataRaw ? safeJsonParse(metadataRaw) : null;
        return {
            filePath: absolutePath,
            contentType: metadata &&
                typeof metadata === 'object' &&
                typeof metadata.mimeType === 'string'
                ? metadata.mimeType
                : 'application/octet-stream',
        };
    }
    async listAdminMessages(filters) {
        return this.listMessages(filters);
    }
    async listAdminWebhookDeliveries(filters) {
        return this.listWebhookDeliveries(filters);
    }
    async listAdminInboundMessages(filters) {
        return this.listInboundMessages(filters);
    }
    async replayAdminWebhookDelivery(adminUserId, deliveryId) {
        const existing = await db_1.prisma.webhookDelivery.findUnique({
            where: {
                id: deliveryId,
            },
            include: webhookDeliveryInclude,
        });
        if (!existing) {
            throw new common_1.NotFoundException('Webhook delivery not found.');
        }
        const now = new Date();
        await db_1.prisma.$transaction(async (tx) => {
            await tx.webhookDelivery.update({
                where: {
                    id: deliveryId,
                },
                data: {
                    status: 'pending',
                    attemptCount: 0,
                    nextAttemptAt: now,
                    lastAttemptAt: null,
                    deliveredAt: null,
                    responseStatusCode: null,
                    responseBody: null,
                    errorMessage: null,
                },
            });
            await this.auditLogsService.recordWithClient(tx, {
                workspaceId: existing.instance.workspaceId,
                instanceId: existing.instanceId,
                actorType: 'platform_admin',
                actorId: adminUserId,
                entityType: 'webhook_delivery',
                entityId: existing.id,
                action: 'admin.webhook_delivery.replayed',
                summary: 'Admin replayed a webhook delivery.',
                metadata: {
                    previousStatus: existing.status,
                    eventType: existing.eventType,
                    targetUrl: existing.targetUrl,
                },
            });
        });
        this.metricsService.incrementWebhookReplay();
        await this.webhookDispatchService.dispatchDeliveryNow(existing.id);
        const replayed = await db_1.prisma.webhookDelivery.findUnique({
            where: {
                id: existing.id,
            },
            include: webhookDeliveryInclude,
        });
        if (!replayed) {
            throw new common_1.NotFoundException('Webhook delivery not found after replay.');
        }
        return {
            delivery: (0, presenters_1.toWebhookDeliverySummary)(replayed),
            updatedAt: replayed.updatedAt.toISOString(),
        };
    }
    async claimNextOutboundMessage(instanceId, input) {
        const instance = await db_1.prisma.instance.findUnique({
            where: {
                id: instanceId,
            },
            include: {
                settings: true,
            },
        });
        if (!instance) {
            throw new common_1.NotFoundException('Instance not found.');
        }
        if (instance.assignedWorkerId !== input.workerId) {
            throw new common_1.ForbiddenException('This worker is not assigned to the target instance.');
        }
        if (instance.status !== 'authenticated') {
            return {
                message: null,
            };
        }
        for (let attempt = 0; attempt < 3; attempt += 1) {
            const claimedId = await db_1.prisma.$transaction(async (tx) => {
                const candidate = await tx.outboundMessage.findFirst({
                    where: {
                        instanceId,
                        status: 'queue',
                        processingWorkerId: null,
                        scheduledFor: {
                            lte: new Date(),
                        },
                    },
                    orderBy: [
                        { priority: 'asc' },
                        { scheduledFor: 'asc' },
                        { createdAt: 'asc' },
                    ],
                    select: {
                        id: true,
                    },
                });
                if (!candidate) {
                    return null;
                }
                const claimed = await tx.outboundMessage.updateMany({
                    where: {
                        id: candidate.id,
                        processingWorkerId: null,
                        status: 'queue',
                    },
                    data: {
                        processingWorkerId: input.workerId,
                        processingStartedAt: new Date(),
                        workerId: input.workerId,
                    },
                });
                if (claimed.count !== 1) {
                    return null;
                }
                return candidate.id;
            });
            if (!claimedId) {
                continue;
            }
            const message = await db_1.prisma.outboundMessage.findUnique({
                where: {
                    id: claimedId,
                },
                include: outboundMessageInclude,
            });
            if (!message) {
                break;
            }
            const summary = (0, presenters_1.toOutboundMessageSummary)(message);
            this.realtimeService.publishInstanceMessageUpdated({
                instanceId,
                publicId: summary.instancePublicId,
                messageId: summary.id,
            });
            return {
                message: summary,
            };
        }
        return {
            message: null,
        };
    }
    async updateOutboundMessage(instanceId, messageId, input) {
        const instance = await db_1.prisma.instance.findUnique({
            where: {
                id: instanceId,
            },
            include: {
                settings: true,
            },
        });
        if (!instance) {
            throw new common_1.NotFoundException('Instance not found.');
        }
        if (instance.assignedWorkerId !== input.workerId) {
            throw new common_1.ForbiddenException('This worker is not assigned to the target instance.');
        }
        const existing = await db_1.prisma.outboundMessage.findFirst({
            where: {
                id: messageId,
                instanceId,
            },
            include: outboundMessageInclude,
        });
        if (!existing) {
            throw new common_1.NotFoundException('Outbound message not found.');
        }
        const nextStatus = input.status ?? existing.status;
        const nextAck = input.ack ?? existing.ack;
        const ackChanged = nextAck !== existing.ack;
        const now = new Date();
        const shouldCreateAttempt = existing.status === 'queue' && nextStatus !== 'queue';
        const updated = await db_1.prisma.$transaction(async (tx) => {
            let attemptNumber = null;
            if (shouldCreateAttempt) {
                attemptNumber =
                    (await tx.outboundMessageAttempt.count({
                        where: {
                            messageId,
                        },
                    })) + 1;
            }
            const message = await tx.outboundMessage.update({
                where: {
                    id: messageId,
                },
                data: {
                    status: nextStatus,
                    ack: nextAck,
                    workerId: input.workerId,
                    providerMessageId: input.providerMessageId ?? undefined,
                    errorMessage: input.errorMessage ??
                        (nextStatus === 'sent' ? null : existing.errorMessage),
                    processingWorkerId: nextStatus === 'queue' ? existing.processingWorkerId : null,
                    processingStartedAt: nextStatus === 'queue' ? existing.processingStartedAt : null,
                    sentAt: nextStatus === 'sent' && !existing.sentAt ? now : existing.sentAt,
                    acknowledgedAt: ackChanged && ['device', 'read', 'played'].includes(nextAck)
                        ? now
                        : existing.acknowledgedAt,
                },
                include: outboundMessageInclude,
            });
            if (shouldCreateAttempt && attemptNumber) {
                await tx.outboundMessageAttempt.create({
                    data: {
                        messageId,
                        workerId: input.workerId,
                        attemptNumber,
                        status: nextStatus,
                        ack: nextAck,
                        message: input.message?.trim() || null,
                        errorMessage: input.errorMessage?.trim() || null,
                    },
                });
            }
            return message;
        });
        const summary = (0, presenters_1.toOutboundMessageSummary)(updated);
        this.realtimeService.publishInstanceMessageUpdated({
            instanceId,
            publicId: summary.instancePublicId,
            messageId: summary.id,
        });
        if (nextStatus !== existing.status) {
            await this.publishInstanceStatistics(instanceId, summary.instancePublicId);
        }
        if (ackChanged) {
            await this.enqueueWebhookIfEnabled(instance, summary, 'message_ack');
        }
        return summary;
    }
    async receiveInboundMessage(instanceId, input) {
        const instance = await db_1.prisma.instance.findUnique({
            where: {
                id: instanceId,
            },
            include: {
                settings: true,
            },
        });
        if (!instance) {
            throw new common_1.NotFoundException('Instance not found.');
        }
        if (instance.assignedWorkerId !== input.workerId) {
            throw new common_1.ForbiddenException('This worker is not assigned to the target instance.');
        }
        const receivedAt = input.receivedAt
            ? new Date(input.receivedAt)
            : new Date();
        const sentAt = input.sentAt ? new Date(input.sentAt) : null;
        const created = await db_1.prisma.$transaction(async (tx) => {
            const message = await tx.inboundMessage.create({
                data: {
                    publicMessageId: `in_${(0, node_crypto_1.randomBytes)(8).toString('hex')}`,
                    instanceId,
                    providerMessageId: input.providerMessageId?.trim() || null,
                    chatId: input.chatId?.trim() || null,
                    sender: input.sender.trim(),
                    pushName: input.pushName?.trim() || null,
                    kind: input.kind,
                    body: input.body?.trim() || null,
                    mediaUrl: input.mediaUrl?.trim() || null,
                    mimeType: input.mimeType?.trim() || null,
                    fromMe: input.fromMe ?? false,
                    sentAt,
                    receivedAt,
                    rawPayload: toNullableJsonInput(input.rawPayload),
                },
            });
            await tx.instanceRuntimeState.update({
                where: {
                    instanceId,
                },
                data: {
                    lastInboundMessageAt: receivedAt,
                },
            });
            return tx.inboundMessage.findUniqueOrThrow({
                where: {
                    id: message.id,
                },
                include: inboundMessageInclude,
            });
        });
        const summary = (0, presenters_1.toInboundMessageSummary)(created);
        await this.auditLogsService.record({
            workspaceId: instance.workspaceId,
            instanceId,
            actorType: 'worker',
            actorId: input.workerId,
            entityType: 'inbound_message',
            entityId: summary.id,
            action: 'message.inbound.received',
            summary: `Inbound ${summary.kind} message received from ${summary.sender}.`,
            metadata: {
                providerMessageId: summary.providerMessageId,
                fromMe: summary.fromMe,
            },
        });
        this.realtimeService.publishInstanceInboundMessageUpdated({
            instanceId,
            publicId: summary.instancePublicId,
            messageId: summary.id,
        });
        await this.enqueueInboundWebhookIfEnabled(instance, summary);
        return summary;
    }
    async createOutboundMessage(input) {
        const scheduledFor = await this.calculateScheduledFor(input.instance.id, input.instance.settings?.sendDelay ?? 1, input.instance.settings?.sendDelayMax ?? 15);
        const created = await db_1.prisma.outboundMessage.create({
            data: {
                publicMessageId: `msg_${(0, node_crypto_1.randomBytes)(8).toString('hex')}`,
                instanceId: input.instance.id,
                messageType: input.messageType,
                recipient: input.recipient,
                body: input.body,
                mediaUrl: input.mediaUrl,
                caption: input.caption,
                referenceId: input.referenceId,
                priority: input.priority,
                scheduledFor,
                status: 'queue',
                ack: 'pending',
                createdByActorType: input.actorType,
                createdByActorId: input.actorId,
            },
            include: outboundMessageInclude,
        });
        const summary = (0, presenters_1.toOutboundMessageSummary)(created);
        await this.auditLogsService.record({
            workspaceId: input.instance.workspaceId,
            instanceId: input.instance.id,
            actorType: input.actorType,
            actorId: input.actorId,
            entityType: 'outbound_message',
            entityId: summary.id,
            action: 'message.outbound.queued',
            summary: `Outbound ${summary.messageType} message queued for ${summary.recipient}.`,
            metadata: {
                referenceId: summary.referenceId,
                priority: summary.priority,
                ...(input.auditMetadata ?? {}),
            },
        });
        this.realtimeService.publishInstanceMessageUpdated({
            instanceId: input.instance.id,
            publicId: input.instance.publicId,
            messageId: summary.id,
        });
        await this.publishInstanceStatistics(input.instance.id, input.instance.publicId);
        await this.enqueueWebhookIfEnabled(input.instance, summary, 'message_create');
        return summary;
    }
    async getMessageStatistics(instanceId) {
        const grouped = await db_1.prisma.outboundMessage.groupBy({
            by: ['status'],
            where: {
                instanceId,
            },
            _count: {
                _all: true,
            },
        });
        const counts = { ...initialMessageStatistics };
        for (const entry of grouped) {
            counts[entry.status] = entry._count._all;
            counts.total += entry._count._all;
        }
        return {
            instanceId,
            counts,
            generatedAt: new Date().toISOString(),
        };
    }
    async enqueueWebhookIfEnabled(instance, message, eventType) {
        const webhookUrl = instance.settings?.webhookUrl?.trim();
        if (!webhookUrl) {
            return;
        }
        if (eventType === 'message_create' &&
            !instance.settings?.webhookMessageCreate) {
            return;
        }
        if (eventType === 'message_ack' && !instance.settings?.webhookMessageAck) {
            return;
        }
        await this.webhookDispatchService.enqueueEvent({
            instanceId: instance.id,
            publicId: instance.publicId,
            messageId: message.id,
            eventType,
            targetUrl: webhookUrl,
            data: message,
        });
    }
    async enqueueInboundWebhookIfEnabled(instance, message) {
        const webhookUrl = instance.settings?.webhookUrl?.trim();
        if (!webhookUrl || !instance.settings?.webhookMessageReceived) {
            return;
        }
        await this.webhookDispatchService.enqueueEvent({
            instanceId: instance.id,
            publicId: instance.publicId,
            eventType: 'message_received',
            targetUrl: webhookUrl,
            data: message,
        });
    }
    async listMessages(filters) {
        const messageIdFilter = filters.messageId
            ? isUuidLike(filters.messageId)
                ? [{ id: filters.messageId }, { publicMessageId: filters.messageId }]
                : [{ publicMessageId: filters.messageId }]
            : undefined;
        const scopedInstanceIds = filters.instanceIds?.length
            ? filters.instanceIds
            : undefined;
        const instanceFilter = scopedInstanceIds && scopedInstanceIds.length > 0
            ? { in: scopedInstanceIds }
            : filters.instanceId;
        const messages = await db_1.prisma.outboundMessage.findMany({
            where: {
                instanceId: instanceFilter,
                OR: messageIdFilter,
                status: filters.status,
                ack: filters.ack,
                recipient: filters.recipient
                    ? {
                        contains: filters.recipient,
                        mode: 'insensitive',
                    }
                    : undefined,
                referenceId: filters.referenceId
                    ? {
                        contains: filters.referenceId,
                        mode: 'insensitive',
                    }
                    : undefined,
            },
            include: outboundMessageInclude,
            orderBy: {
                createdAt: 'desc',
            },
            take: filters.limit,
        });
        return {
            items: messages.map((message) => (0, presenters_1.toOutboundMessageSummary)(message)),
        };
    }
    async listWebhookDeliveries(filters) {
        const deliveries = await db_1.prisma.webhookDelivery.findMany({
            where: {
                instanceId: filters.instanceId,
                status: filters.status,
                eventType: filters.eventType,
            },
            include: webhookDeliveryInclude,
            orderBy: {
                createdAt: 'desc',
            },
            take: filters.limit,
        });
        return {
            items: deliveries.map((delivery) => (0, presenters_1.toWebhookDeliverySummary)(delivery)),
        };
    }
    async listInboundMessages(filters) {
        const scopedInstanceIds = filters.instanceIds?.length
            ? filters.instanceIds
            : undefined;
        const instanceFilter = scopedInstanceIds && scopedInstanceIds.length > 0
            ? { in: scopedInstanceIds }
            : filters.instanceId;
        const messages = await db_1.prisma.inboundMessage.findMany({
            where: {
                instanceId: instanceFilter,
                sender: filters.sender
                    ? {
                        contains: filters.sender,
                        mode: 'insensitive',
                    }
                    : undefined,
            },
            include: inboundMessageInclude,
            orderBy: {
                receivedAt: 'desc',
            },
            take: filters.limit,
        });
        return {
            items: messages.map((message) => (0, presenters_1.toInboundMessageSummary)(message)),
        };
    }
    async calculateScheduledFor(instanceId, sendDelay, sendDelayMax) {
        const now = new Date();
        const [queueDepth, latestQueued] = await Promise.all([
            db_1.prisma.outboundMessage.count({
                where: {
                    instanceId,
                    status: 'queue',
                },
            }),
            db_1.prisma.outboundMessage.findFirst({
                where: {
                    instanceId,
                    status: 'queue',
                },
                orderBy: {
                    scheduledFor: 'desc',
                },
                select: {
                    scheduledFor: true,
                },
            }),
        ]);
        if (queueDepth === 0 || !latestQueued) {
            return now;
        }
        const delaySeconds = queueDepth >= 10 ? sendDelayMax : sendDelay;
        const anchor = latestQueued.scheduledFor > now ? latestQueued.scheduledFor : now;
        return new Date(anchor.getTime() + delaySeconds * 1_000);
    }
    async loadCustomerMessagingInstance(userId, instanceId) {
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
            include: {
                settings: true,
            },
        });
        if (!instance) {
            throw new common_1.NotFoundException('Instance not found or not accessible by this user.');
        }
        return instance;
    }
    async loadCustomerMessageAccess(userId, workspaceId, instanceId) {
        const memberships = await db_1.prisma.membership.findMany({
            where: {
                userId,
                role: {
                    in: ['owner', 'admin', 'operator', 'viewer'],
                },
                workspaceId,
            },
            select: {
                workspaceId: true,
            },
        });
        const workspaceIds = [
            ...new Set(memberships.map((membership) => membership.workspaceId)),
        ];
        if (workspaceIds.length === 0) {
            throw new common_1.NotFoundException('No accessible workspace was found for this user.');
        }
        const instances = await db_1.prisma.instance.findMany({
            where: {
                id: instanceId,
                workspaceId: {
                    in: workspaceIds,
                },
            },
            select: {
                id: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        if (instances.length === 0) {
            if (instanceId) {
                throw new common_1.NotFoundException('Instance not found or not accessible by this user.');
            }
            return {
                instanceIds: [],
            };
        }
        return {
            instanceIds: instances.map((instance) => instance.id),
        };
    }
    async loadPublicMessagingInstance(instanceId) {
        const instance = await db_1.prisma.instance.findUnique({
            where: {
                id: instanceId,
            },
            include: {
                settings: true,
            },
        });
        if (!instance) {
            throw new common_1.NotFoundException('Instance not found.');
        }
        return instance;
    }
    async publishInstanceStatistics(instanceId, publicId) {
        const statistics = await this.getMessageStatistics(instanceId);
        this.realtimeService.publishInstanceStatisticsUpdated({
            instanceId,
            publicId,
            counts: statistics.counts,
        });
    }
    async requeueOutboundMessage(instance, message, input) {
        if (message.status === 'queue') {
            return (0, presenters_1.toOutboundMessageSummary)(message);
        }
        const scheduledFor = await this.calculateScheduledFor(instance.id, instance.settings?.sendDelay ?? 1, instance.settings?.sendDelayMax ?? 15);
        const updated = await db_1.prisma.outboundMessage.update({
            where: {
                id: message.id,
            },
            data: {
                status: 'queue',
                ack: 'pending',
                scheduledFor,
                processingWorkerId: null,
                processingStartedAt: null,
                workerId: null,
                providerMessageId: null,
                errorMessage: null,
                sentAt: null,
                acknowledgedAt: null,
            },
            include: outboundMessageInclude,
        });
        const summary = (0, presenters_1.toOutboundMessageSummary)(updated);
        if (input.auditStrategy === 'single') {
            await this.auditLogsService.record({
                workspaceId: instance.workspaceId,
                instanceId: instance.id,
                actorType: input.actorType,
                actorId: input.actorId,
                entityType: 'outbound_message',
                entityId: summary.id,
                action: 'message.outbound.requeued',
                summary: `Outbound ${summary.messageType} message requeued for ${summary.recipient}.`,
                metadata: {
                    previousStatus: message.status,
                    referenceId: summary.referenceId,
                    ...(input.auditMetadata ?? {}),
                },
            });
        }
        this.realtimeService.publishInstanceMessageUpdated({
            instanceId: instance.id,
            publicId: instance.publicId,
            messageId: summary.id,
        });
        return summary;
    }
    async persistCustomerMediaAsset(instancePublicId, file) {
        const assetId = `asset_${(0, node_crypto_1.randomBytes)(8).toString('hex')}`;
        const safeName = sanitizeFileName(file.originalName);
        const assetDirectory = (0, node_path_1.resolve)(this.customerMediaRoot, assetId);
        const filePath = (0, node_path_1.resolve)(assetDirectory, safeName);
        const assetUrl = `${this.apiEnv.API_BASE_URL}${routeSafePublicMediaPath(assetId, safeName)}`;
        await (0, promises_1.mkdir)(assetDirectory, { recursive: true });
        await (0, promises_1.writeFile)(filePath, file.buffer);
        await (0, promises_1.writeFile)((0, node_path_1.resolve)(assetDirectory, 'metadata.json'), JSON.stringify({
            assetId,
            instancePublicId,
            fileName: safeName,
            mimeType: file.mimeType,
            uploadedAt: new Date().toISOString(),
        }, null, 2), 'utf8');
        return {
            assetId,
            assetUrl,
            fileName: safeName,
            filePath,
        };
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [realtime_service_1.RealtimeService,
        webhook_dispatch_service_1.WebhookDispatchService,
        audit_logs_service_1.AuditLogsService,
        metrics_service_1.MetricsService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map