import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { WebhookEventType } from '@elite-message/contracts';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { RealtimeService } from '../realtime/realtime.service';
type EnqueueWebhookEventInput = {
    instanceId: string;
    publicId: string;
    messageId?: string | null;
    eventType: WebhookEventType;
    targetUrl: string;
    data: unknown;
};
export declare class WebhookDispatchService implements OnModuleInit, OnModuleDestroy {
    private readonly realtimeService;
    private readonly auditLogsService;
    private retryTimer;
    private processingDueDeliveries;
    constructor(realtimeService: RealtimeService, auditLogsService: AuditLogsService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    enqueueEvent(input: EnqueueWebhookEventInput): Promise<void>;
    dispatchDeliveryNow(deliveryId: string): Promise<void>;
    private dispatchDueDeliveries;
    private processDelivery;
}
export {};
//# sourceMappingURL=webhook-dispatch.service.d.ts.map