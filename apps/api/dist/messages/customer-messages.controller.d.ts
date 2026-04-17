import type { RequestUser } from '../common/request-user';
import { MessagesService } from './messages.service';
export declare class CustomerMessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    listWorkspaceMessages(user: RequestUser, workspaceId?: string, instanceId?: string, status?: string, recipient?: string, referenceId?: string, limit?: string): Promise<{
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
    listWorkspaceInboundMessages(user: RequestUser, workspaceId?: string, instanceId?: string, sender?: string, limit?: string): Promise<{
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
    listMessages(user: RequestUser, instanceId: string, status?: string, recipient?: string, referenceId?: string, limit?: string): Promise<{
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
    listWebhookDeliveries(user: RequestUser, instanceId: string, status?: string, eventType?: string, limit?: string): Promise<{
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
    listInboundMessages(user: RequestUser, instanceId: string, sender?: string, limit?: string): Promise<{
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
    sendChatMessage(user: RequestUser, instanceId: string, body: unknown): Promise<{
        message: {
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
        };
    }>;
    sendImageMessage(user: RequestUser, instanceId: string, body: unknown): Promise<{
        message: {
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
        };
    }>;
    uploadAndSendImageMessage(user: RequestUser, instanceId: string, file: {
        originalname?: string;
        mimetype?: string;
        buffer?: Buffer;
    } | undefined, body: Record<string, unknown>): Promise<{
        message: {
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
        };
    }>;
    getMessageStatistics(user: RequestUser, instanceId: string): Promise<{
        instanceId: string;
        counts: {
            queue: number;
            sent: number;
            unsent: number;
            invalid: number;
            expired: number;
            total: number;
        };
        generatedAt: string;
    }>;
    resendMessage(user: RequestUser, instanceId: string, messageId: string): Promise<{
        message: {
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
        };
    }>;
    resendMessagesByStatus(user: RequestUser, instanceId: string, body: unknown): Promise<{
        instanceId: string;
        status: "expired" | "queue" | "sent" | "unsent" | "invalid";
        requeuedCount: number;
        updatedAt: string;
    }>;
    clearMessagesByStatus(user: RequestUser, instanceId: string, body: unknown): Promise<{
        instanceId: string;
        status: "expired" | "queue" | "sent" | "unsent" | "invalid";
        clearedCount: number;
        updatedAt: string;
    }>;
}
//# sourceMappingURL=customer-messages.controller.d.ts.map