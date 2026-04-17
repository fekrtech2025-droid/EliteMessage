import type { InstanceStatusPayload } from '@elite-message/contracts';
import { RealtimeGateway } from './realtime.gateway';
export declare class RealtimeService {
    private readonly realtimeGateway;
    constructor(realtimeGateway: RealtimeGateway);
    publish(event: string, payload: unknown): void;
    publishInstanceStatusChanged(payload: InstanceStatusPayload & {
        publicId?: string | null;
    }): void;
    publishInstanceQrUpdated(payload: {
        instanceId: string;
        publicId?: string | null;
        qrCode: string | null;
        qrExpiresAt: string | null;
    }): void;
    publishInstanceRuntimeUpdated(payload: {
        instanceId: string;
        publicId?: string | null;
        currentSessionLabel?: string | null;
        disconnectReason?: string | null;
    }): void;
    publishInstanceLifecycleUpdated(payload: {
        instanceId: string;
        publicId?: string | null;
    }): void;
    publishInstanceOperationUpdated(payload: {
        instanceId: string;
        publicId?: string | null;
        operationId?: string | null;
        status?: string | null;
    }): void;
    publishInstanceSettingsUpdated(payload: {
        instanceId: string;
        publicId?: string | null;
    }): void;
    publishInstanceMessageUpdated(payload: {
        instanceId: string;
        publicId?: string | null;
        messageId?: string | null;
    }): void;
    publishInstanceInboundMessageUpdated(payload: {
        instanceId: string;
        publicId?: string | null;
        messageId?: string | null;
    }): void;
    publishInstanceStatisticsUpdated(payload: {
        instanceId: string;
        publicId?: string | null;
        counts: {
            queue: number;
            sent: number;
            unsent: number;
            invalid: number;
            expired: number;
            total: number;
        };
    }): void;
    publishWebhookDeliveryUpdated(payload: {
        instanceId: string;
        publicId?: string | null;
        deliveryId?: string | null;
    }): void;
    publishWorkerHealthUpdated(payload: {
        workerId: string;
    }): void;
}
//# sourceMappingURL=realtime.service.d.ts.map