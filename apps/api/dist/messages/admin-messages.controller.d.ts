import type { RequestUser } from '../common/request-user';
import { MessagesService } from './messages.service';
export declare class AdminMessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    listMessages(instanceId?: string, status?: string, recipient?: string, referenceId?: string, limit?: string): Promise<{
        items: {
            id: string;
            publicMessageId: string;
            instanceId: string;
            instancePublicId: string;
            messageType: "chat" | "image";
            recipient: string;
            priority: number;
            status: "expired" | "queue" | "sent" | "unsent" | "invalid";
            ack: "pending" | "server" | "device" | "read" | "played";
            scheduledFor: string;
            createdAt: string;
            updatedAt: string;
            body?: string | null | undefined;
            mediaUrl?: string | null | undefined;
            caption?: string | null | undefined;
            referenceId?: string | null | undefined;
            processingWorkerId?: string | null | undefined;
            workerId?: string | null | undefined;
            providerMessageId?: string | null | undefined;
            errorMessage?: string | null | undefined;
            sentAt?: string | null | undefined;
            acknowledgedAt?: string | null | undefined;
        }[];
    }>;
    listWebhookDeliveries(instanceId?: string, status?: string, eventType?: string, limit?: string): Promise<{
        items: {
            id: string;
            instanceId: string;
            instancePublicId: string;
            eventType: "message_create" | "message_ack" | "message_received";
            status: "pending" | "failed" | "delivered" | "exhausted";
            targetUrl: string;
            attemptCount: number;
            nextAttemptAt: string;
            payload: unknown;
            createdAt: string;
            updatedAt: string;
            messageId?: string | null | undefined;
            publicMessageId?: string | null | undefined;
            lastAttemptAt?: string | null | undefined;
            deliveredAt?: string | null | undefined;
            responseStatusCode?: number | null | undefined;
            responseBody?: string | null | undefined;
            errorMessage?: string | null | undefined;
        }[];
    }>;
    listInboundMessages(instanceId?: string, sender?: string, limit?: string): Promise<{
        items: {
            id: string;
            publicMessageId: string;
            instanceId: string;
            instancePublicId: string;
            sender: string;
            kind: "chat" | "image" | "document" | "audio" | "video" | "sticker" | "unknown";
            fromMe: boolean;
            receivedAt: string;
            createdAt: string;
            updatedAt: string;
            providerMessageId?: string | null | undefined;
            chatId?: string | null | undefined;
            pushName?: string | null | undefined;
            body?: string | null | undefined;
            mediaUrl?: string | null | undefined;
            mimeType?: string | null | undefined;
            sentAt?: string | null | undefined;
            rawPayload?: unknown;
        }[];
    }>;
    replayWebhookDelivery(user: RequestUser, deliveryId: string): Promise<{
        delivery: {
            id: string;
            instanceId: string;
            instancePublicId: string;
            eventType: "message_create" | "message_ack" | "message_received";
            status: "pending" | "failed" | "delivered" | "exhausted";
            targetUrl: string;
            attemptCount: number;
            nextAttemptAt: string;
            payload: unknown;
            createdAt: string;
            updatedAt: string;
            messageId?: string | null | undefined;
            publicMessageId?: string | null | undefined;
            lastAttemptAt?: string | null | undefined;
            deliveredAt?: string | null | undefined;
            responseStatusCode?: number | null | undefined;
            responseBody?: string | null | undefined;
            errorMessage?: string | null | undefined;
        };
        updatedAt: string;
    }>;
}
//# sourceMappingURL=admin-messages.controller.d.ts.map