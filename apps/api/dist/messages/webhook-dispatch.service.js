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
exports.WebhookDispatchService = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const db_1 = require("@elite-message/db");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const presenters_1 = require("../common/presenters");
const realtime_service_1 = require("../realtime/realtime.service");
const webhookRetryDelaysMs = [1_000, 5_000, 15_000];
const webhookRequestTimeoutMs = 1_000;
function toJsonInput(value) {
    if (value === null || value === undefined) {
        return null;
    }
    return value;
}
let WebhookDispatchService = class WebhookDispatchService {
    realtimeService;
    auditLogsService;
    retryTimer;
    processingDueDeliveries = false;
    constructor(realtimeService, auditLogsService) {
        this.realtimeService = realtimeService;
        this.auditLogsService = auditLogsService;
    }
    onModuleInit() {
        this.retryTimer = setInterval(() => {
            void this.dispatchDueDeliveries();
        }, 2_000);
        this.retryTimer.unref();
    }
    onModuleDestroy() {
        if (this.retryTimer) {
            clearInterval(this.retryTimer);
            this.retryTimer = undefined;
        }
    }
    async enqueueEvent(input) {
        const payload = {
            event_type: input.eventType,
            instanceId: input.instanceId,
            publicId: input.publicId,
            timestamp: new Date().toISOString(),
            data: toJsonInput(input.data),
        };
        const delivery = await db_1.prisma.webhookDelivery.create({
            data: {
                instanceId: input.instanceId,
                messageId: input.messageId ?? null,
                eventType: input.eventType,
                status: 'pending',
                targetUrl: input.targetUrl,
                payload,
            },
            include: {
                instance: {
                    select: {
                        publicId: true,
                    },
                },
                outboundMessage: {
                    select: {
                        publicMessageId: true,
                    },
                },
            },
        });
        this.realtimeService.publishWebhookDeliveryUpdated({
            instanceId: input.instanceId,
            publicId: input.publicId,
            deliveryId: delivery.id,
        });
        await this.processDelivery(delivery.id);
    }
    async dispatchDeliveryNow(deliveryId) {
        await this.processDelivery(deliveryId);
    }
    async dispatchDueDeliveries() {
        if (this.processingDueDeliveries) {
            return;
        }
        this.processingDueDeliveries = true;
        try {
            const dueDeliveries = await db_1.prisma.webhookDelivery.findMany({
                where: {
                    status: {
                        in: ['pending', 'failed'],
                    },
                    nextAttemptAt: {
                        lte: new Date(),
                    },
                },
                orderBy: {
                    nextAttemptAt: 'asc',
                },
                take: 25,
            });
            for (const delivery of dueDeliveries) {
                await this.processDelivery(delivery.id);
            }
        }
        finally {
            this.processingDueDeliveries = false;
        }
    }
    async processDelivery(deliveryId) {
        const delivery = await db_1.prisma.webhookDelivery.findUnique({
            where: {
                id: deliveryId,
            },
            include: {
                instance: {
                    select: {
                        publicId: true,
                        workspaceId: true,
                        settings: {
                            select: {
                                webhookSecret: true,
                            },
                        },
                    },
                },
                outboundMessage: {
                    select: {
                        publicMessageId: true,
                    },
                },
            },
        });
        if (!delivery ||
            delivery.status === 'delivered' ||
            delivery.status === 'exhausted') {
            return;
        }
        const attemptedAt = new Date();
        const nextAttemptCount = delivery.attemptCount + 1;
        let responseStatusCode = null;
        let responseBody = null;
        let errorMessage = null;
        let delivered = false;
        const payloadBody = JSON.stringify(delivery.payload);
        const signedTimestamp = attemptedAt.toISOString();
        const signature = (0, node_crypto_1.createHmac)('sha256', delivery.instance.settings?.webhookSecret ?? '')
            .update(`${signedTimestamp}.${payloadBody}`)
            .digest('hex');
        try {
            const response = await fetch(delivery.targetUrl, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-elite-message-delivery-id': delivery.id,
                    'x-elite-message-event': delivery.eventType,
                    'x-elite-message-instance-public-id': delivery.instance.publicId,
                    'x-elite-message-timestamp': signedTimestamp,
                    'x-elite-message-signature': `v1=${signature}`,
                },
                body: payloadBody,
                signal: AbortSignal.timeout(webhookRequestTimeoutMs),
            });
            responseStatusCode = response.status;
            responseBody = (await response.text()).slice(0, 2_000);
            delivered = response.ok;
            if (!response.ok) {
                errorMessage = `Webhook returned ${response.status}.`;
            }
        }
        catch (error) {
            errorMessage = error instanceof Error ? error.message : String(error);
        }
        const retryDelayMs = webhookRetryDelaysMs[nextAttemptCount - 1];
        const status = delivered
            ? 'delivered'
            : retryDelayMs
                ? 'failed'
                : 'exhausted';
        const nextAttemptAt = delivered
            ? attemptedAt
            : new Date(attemptedAt.getTime() + (retryDelayMs ?? 0));
        const updated = await db_1.prisma.webhookDelivery.update({
            where: {
                id: delivery.id,
            },
            data: {
                status,
                attemptCount: nextAttemptCount,
                nextAttemptAt,
                lastAttemptAt: attemptedAt,
                deliveredAt: delivered ? attemptedAt : null,
                responseStatusCode,
                responseBody,
                errorMessage,
            },
            include: {
                instance: {
                    select: {
                        publicId: true,
                    },
                },
                outboundMessage: {
                    select: {
                        publicMessageId: true,
                    },
                },
            },
        });
        const summary = (0, presenters_1.toWebhookDeliverySummary)(updated);
        this.realtimeService.publishWebhookDeliveryUpdated({
            instanceId: summary.instanceId,
            publicId: summary.instancePublicId,
            deliveryId: summary.id,
        });
        if (updated.status === 'exhausted') {
            await this.auditLogsService.record({
                workspaceId: delivery.instance.workspaceId,
                instanceId: delivery.instanceId,
                actorType: 'system',
                actorId: null,
                entityType: 'webhook_delivery',
                entityId: delivery.id,
                action: 'webhook.delivery.exhausted',
                summary: 'Webhook delivery exhausted all retry attempts.',
                metadata: {
                    eventType: delivery.eventType,
                    targetUrl: delivery.targetUrl,
                    lastErrorMessage: updated.errorMessage ?? errorMessage,
                },
            });
        }
    }
};
exports.WebhookDispatchService = WebhookDispatchService;
exports.WebhookDispatchService = WebhookDispatchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [realtime_service_1.RealtimeService,
        audit_logs_service_1.AuditLogsService])
], WebhookDispatchService);
//# sourceMappingURL=webhook-dispatch.service.js.map