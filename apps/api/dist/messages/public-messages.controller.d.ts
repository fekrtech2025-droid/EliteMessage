import type { InstanceApiPrincipal } from '../common/request-user';
import { MessagesService } from './messages.service';
export declare class PublicMessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    sendChatMessage(principal: InstanceApiPrincipal, body: unknown): Promise<{
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
    sendImageMessage(principal: InstanceApiPrincipal, body: unknown): Promise<{
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
    listMessages(principal: InstanceApiPrincipal, messageId?: string, status?: string, ack?: string, recipient?: string, referenceId?: string, limit?: string): Promise<{
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
    getMessageStatistics(principal: InstanceApiPrincipal): Promise<{
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
    resendById(principal: InstanceApiPrincipal, body: unknown): Promise<{
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
    resendByStatus(principal: InstanceApiPrincipal, body: unknown): Promise<{
        instanceId: string;
        status: "expired" | "queue" | "sent" | "unsent" | "invalid";
        requeuedCount: number;
        updatedAt: string;
    }>;
    clearByStatus(principal: InstanceApiPrincipal, body: unknown): Promise<{
        instanceId: string;
        status: "expired" | "queue" | "sent" | "unsent" | "invalid";
        clearedCount: number;
        updatedAt: string;
    }>;
}
//# sourceMappingURL=public-messages.controller.d.ts.map