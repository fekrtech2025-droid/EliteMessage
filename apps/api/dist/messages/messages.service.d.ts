import type { ClearMessagesByStatusRequest, ClearMessagesByStatusResponse, InternalClaimNextOutboundMessageRequest, InternalClaimNextOutboundMessageResponse, InternalReceiveInboundMessageRequest, InternalUpdateOutboundMessageRequest, InboundMessageSummary, ListInboundMessagesResponse, ListOutboundMessagesResponse, ListWebhookDeliveriesResponse, MessageAck, MessageStatisticsResponse, MessageStatus, OutboundMessageSummary, ReplayWebhookDeliveryResponse, ResendMessageByIdResponse, ResendMessagesByStatusRequest, ResendMessagesByStatusResponse, SendChatMessageRequest, SendImageMessageRequest, SendMessageResponse, WebhookDeliveryStatus, WebhookEventType } from '@elite-message/contracts';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import type { InstanceApiPrincipal } from '../common/request-user';
import { MetricsService } from '../ops/metrics.service';
import { RealtimeService } from '../realtime/realtime.service';
import { WebhookDispatchService } from './webhook-dispatch.service';
type MessageListFilters = {
    instanceId?: string;
    instanceIds?: string[];
    messageId?: string;
    status?: MessageStatus;
    ack?: MessageAck;
    recipient?: string;
    referenceId?: string;
    limit: number;
};
type WebhookDeliveryFilters = {
    instanceId?: string;
    status?: WebhookDeliveryStatus;
    eventType?: WebhookEventType;
    limit: number;
};
type InboundMessageListFilters = {
    instanceId?: string;
    instanceIds?: string[];
    sender?: string;
    limit: number;
};
type UploadedCustomerMediaInput = {
    originalName: string;
    mimeType: string;
    buffer: Buffer;
};
export declare class MessagesService {
    private readonly realtimeService;
    private readonly webhookDispatchService;
    private readonly auditLogsService;
    private readonly metricsService;
    private readonly apiEnv;
    private readonly customerMediaRoot;
    constructor(realtimeService: RealtimeService, webhookDispatchService: WebhookDispatchService, auditLogsService: AuditLogsService, metricsService: MetricsService);
    sendCustomerChatMessage(userId: string, instanceId: string, input: SendChatMessageRequest): Promise<SendMessageResponse>;
    sendCustomerImageMessage(userId: string, instanceId: string, input: SendImageMessageRequest): Promise<SendMessageResponse>;
    sendPublicChatMessage(principal: InstanceApiPrincipal, input: SendChatMessageRequest): Promise<SendMessageResponse>;
    sendPublicImageMessage(principal: InstanceApiPrincipal, input: SendImageMessageRequest): Promise<SendMessageResponse>;
    listCustomerMessages(userId: string, instanceId: string, filters: Omit<MessageListFilters, 'instanceId'>): Promise<ListOutboundMessagesResponse>;
    listPublicMessages(principal: InstanceApiPrincipal, filters: Omit<MessageListFilters, 'instanceId'>): Promise<ListOutboundMessagesResponse>;
    getCustomerMessageStatistics(userId: string, instanceId: string): Promise<MessageStatisticsResponse>;
    getPublicMessageStatistics(principal: InstanceApiPrincipal): Promise<MessageStatisticsResponse>;
    resendCustomerMessage(userId: string, instanceId: string, messageId: string): Promise<ResendMessageByIdResponse>;
    resendPublicMessage(principal: InstanceApiPrincipal, messageId: string): Promise<ResendMessageByIdResponse>;
    resendCustomerMessagesByStatus(userId: string, instanceId: string, input: ResendMessagesByStatusRequest): Promise<ResendMessagesByStatusResponse>;
    resendPublicMessagesByStatus(principal: InstanceApiPrincipal, input: ResendMessagesByStatusRequest): Promise<ResendMessagesByStatusResponse>;
    clearCustomerMessagesByStatus(userId: string, instanceId: string, input: ClearMessagesByStatusRequest): Promise<ClearMessagesByStatusResponse>;
    clearPublicMessagesByStatus(principal: InstanceApiPrincipal, input: ClearMessagesByStatusRequest): Promise<ClearMessagesByStatusResponse>;
    listCustomerWebhookDeliveries(userId: string, instanceId: string, filters: Omit<WebhookDeliveryFilters, 'instanceId'>): Promise<ListWebhookDeliveriesResponse>;
    listCustomerInboundMessages(userId: string, instanceId: string, filters: Omit<InboundMessageListFilters, 'instanceId'>): Promise<ListInboundMessagesResponse>;
    listWorkspaceCustomerMessages(userId: string, filters: Omit<MessageListFilters, 'instanceId' | 'instanceIds'> & {
        workspaceId?: string;
        instanceId?: string;
    }): Promise<ListOutboundMessagesResponse>;
    listWorkspaceCustomerInboundMessages(userId: string, filters: Omit<InboundMessageListFilters, 'instanceId' | 'instanceIds'> & {
        workspaceId?: string;
        instanceId?: string;
    }): Promise<ListInboundMessagesResponse>;
    sendCustomerUploadedImageMessage(userId: string, instanceId: string, input: Omit<SendImageMessageRequest, 'imageUrl'>, file: UploadedCustomerMediaInput): Promise<SendMessageResponse>;
    readPublicCustomerMediaAsset(assetId: string, fileName: string): Promise<{
        filePath: string;
        contentType: string;
    }>;
    listAdminMessages(filters: MessageListFilters): Promise<ListOutboundMessagesResponse>;
    listAdminWebhookDeliveries(filters: WebhookDeliveryFilters): Promise<ListWebhookDeliveriesResponse>;
    listAdminInboundMessages(filters: InboundMessageListFilters): Promise<ListInboundMessagesResponse>;
    replayAdminWebhookDelivery(adminUserId: string, deliveryId: string): Promise<ReplayWebhookDeliveryResponse>;
    claimNextOutboundMessage(instanceId: string, input: InternalClaimNextOutboundMessageRequest): Promise<InternalClaimNextOutboundMessageResponse>;
    updateOutboundMessage(instanceId: string, messageId: string, input: InternalUpdateOutboundMessageRequest): Promise<OutboundMessageSummary>;
    receiveInboundMessage(instanceId: string, input: InternalReceiveInboundMessageRequest): Promise<InboundMessageSummary>;
    private createOutboundMessage;
    private getMessageStatistics;
    private enqueueWebhookIfEnabled;
    private enqueueInboundWebhookIfEnabled;
    private listMessages;
    private listWebhookDeliveries;
    private listInboundMessages;
    private calculateScheduledFor;
    private loadCustomerMessagingInstance;
    private loadCustomerMessageAccess;
    private loadPublicMessagingInstance;
    private publishInstanceStatistics;
    private requeueOutboundMessage;
    private persistCustomerMediaAsset;
}
export {};
//# sourceMappingURL=messages.service.d.ts.map