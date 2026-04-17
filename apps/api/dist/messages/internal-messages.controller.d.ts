import { MessagesService } from './messages.service';
export declare class InternalMessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    claimNextOutboundMessage(instanceId: string, body: unknown): Promise<{
        message?: {
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
        } | null | undefined;
    }>;
    updateOutboundMessage(instanceId: string, messageId: string, body: unknown): Promise<{
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
    }>;
    receiveInboundMessage(instanceId: string, body: unknown): Promise<{
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
    }>;
}
//# sourceMappingURL=internal-messages.controller.d.ts.map