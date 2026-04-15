import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { extname, resolve } from 'node:path';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  ClearMessagesByStatusRequest,
  ClearMessagesByStatusResponse,
  InternalClaimNextOutboundMessageRequest,
  InternalClaimNextOutboundMessageResponse,
  InternalReceiveInboundMessageRequest,
  InternalUpdateOutboundMessageRequest,
  InboundMessageSummary,
  InstanceStatus,
  ListInboundMessagesResponse,
  ListOutboundMessagesResponse,
  ListWebhookDeliveriesResponse,
  MessageAck,
  MessageStatistics,
  MessageStatisticsResponse,
  MessageStatus,
  OutboundMessageSummary,
  ReplayWebhookDeliveryResponse,
  ResendMessageByIdResponse,
  ResendMessagesByStatusRequest,
  ResendMessagesByStatusResponse,
  SendChatMessageRequest,
  SendImageMessageRequest,
  SendMessageResponse,
  WebhookDeliveryStatus,
  WebhookEventType,
} from '@elite-message/contracts';
import { Prisma, prisma } from '@elite-message/db';
import {
  findWorkspaceRoot,
  parseApiEnv,
  type ApiEnv,
} from '@elite-message/config';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import type { InstanceApiPrincipal } from '../common/request-user';
import {
  toInboundMessageSummary,
  toOutboundMessageSummary,
  toWebhookDeliverySummary,
} from '../common/presenters';
import { MetricsService } from '../ops/metrics.service';
import { RealtimeService } from '../realtime/realtime.service';
import { WebhookDispatchService } from './webhook-dispatch.service';

const outboundMessageInclude = {
  instance: {
    select: {
      publicId: true,
    },
  },
} as const;

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
} as const;

const inboundMessageInclude = {
  instance: {
    select: {
      publicId: true,
    },
  },
} as const;

type OutboundMessageRecord = Prisma.OutboundMessageGetPayload<{
  include: typeof outboundMessageInclude;
}>;

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

type MessagingInstanceRecord = {
  id: string;
  publicId: string;
  workspaceId: string;
  status: InstanceStatus;
  assignedWorkerId: string | null;
  settings: {
    sendDelay: number;
    sendDelayMax: number;
    webhookUrl: string | null;
    webhookMessageReceived: boolean;
    webhookMessageCreate: boolean;
    webhookMessageAck: boolean;
  } | null;
};

type UploadedCustomerMediaInput = {
  originalName: string;
  mimeType: string;
  buffer: Buffer;
};

const initialMessageStatistics: MessageStatistics = {
  queue: 0,
  sent: 0,
  unsent: 0,
  invalid: 0,
  expired: 0,
  total: 0,
};

function isUuidLike(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function toNullableJsonInput(
  value: unknown,
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return Prisma.JsonNull;
  }

  return value as Prisma.InputJsonValue;
}

function sanitizeOpaqueSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80) || 'asset';
}

function sanitizeFileName(value: string) {
  const extension =
    extname(value)
      .slice(0, 12)
      .replace(/[^a-zA-Z0-9.]/g, '') || '.bin';
  const baseName = value
    .replace(extname(value), '')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

  return `${baseName || 'upload'}${extension}`;
}

function routeSafePublicMediaPath(assetId: string, fileName: string) {
  return `/api/v1/public/customer-media/${encodeURIComponent(assetId)}/${encodeURIComponent(fileName)}`;
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

@Injectable()
export class MessagesService {
  private readonly apiEnv: ApiEnv;
  private readonly customerMediaRoot: string;

  constructor(
    private readonly realtimeService: RealtimeService,
    private readonly webhookDispatchService: WebhookDispatchService,
    private readonly auditLogsService: AuditLogsService,
    private readonly metricsService: MetricsService,
  ) {
    this.apiEnv = parseApiEnv(process.env);
    this.customerMediaRoot = resolve(
      findWorkspaceRoot(process.cwd()),
      '.runtime',
      'customer-media',
    );
  }

  async sendCustomerChatMessage(
    userId: string,
    instanceId: string,
    input: SendChatMessageRequest,
  ): Promise<SendMessageResponse> {
    const instance = await this.loadCustomerMessagingInstance(
      userId,
      instanceId,
    );
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

  async sendCustomerImageMessage(
    userId: string,
    instanceId: string,
    input: SendImageMessageRequest,
  ): Promise<SendMessageResponse> {
    const instance = await this.loadCustomerMessagingInstance(
      userId,
      instanceId,
    );
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

  async sendPublicChatMessage(
    principal: InstanceApiPrincipal,
    input: SendChatMessageRequest,
  ): Promise<SendMessageResponse> {
    const instance = await this.loadPublicMessagingInstance(
      principal.instanceId,
    );
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

  async sendPublicImageMessage(
    principal: InstanceApiPrincipal,
    input: SendImageMessageRequest,
  ): Promise<SendMessageResponse> {
    const instance = await this.loadPublicMessagingInstance(
      principal.instanceId,
    );
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

  async listCustomerMessages(
    userId: string,
    instanceId: string,
    filters: Omit<MessageListFilters, 'instanceId'>,
  ): Promise<ListOutboundMessagesResponse> {
    const instance = await this.loadCustomerMessagingInstance(
      userId,
      instanceId,
    );
    return this.listMessages({
      ...filters,
      instanceId: instance.id,
    });
  }

  async listPublicMessages(
    principal: InstanceApiPrincipal,
    filters: Omit<MessageListFilters, 'instanceId'>,
  ): Promise<ListOutboundMessagesResponse> {
    const instance = await this.loadPublicMessagingInstance(
      principal.instanceId,
    );
    return this.listMessages({
      ...filters,
      instanceId: instance.id,
    });
  }

  async getCustomerMessageStatistics(
    userId: string,
    instanceId: string,
  ): Promise<MessageStatisticsResponse> {
    const instance = await this.loadCustomerMessagingInstance(
      userId,
      instanceId,
    );
    return this.getMessageStatistics(instance.id);
  }

  async getPublicMessageStatistics(
    principal: InstanceApiPrincipal,
  ): Promise<MessageStatisticsResponse> {
    const instance = await this.loadPublicMessagingInstance(
      principal.instanceId,
    );
    return this.getMessageStatistics(instance.id);
  }

  async resendCustomerMessage(
    userId: string,
    instanceId: string,
    messageId: string,
  ): Promise<ResendMessageByIdResponse> {
    const instance = await this.loadCustomerMessagingInstance(
      userId,
      instanceId,
    );
    const existing = await prisma.outboundMessage.findFirst({
      where: {
        id: messageId,
        instanceId: instance.id,
      },
      include: outboundMessageInclude,
    });

    if (!existing) {
      throw new NotFoundException('Outbound message not found.');
    }

    const message = await this.requeueOutboundMessage(instance, existing, {
      actorId: userId,
      actorType: 'customer_user',
      auditStrategy: 'single',
    });
    await this.publishInstanceStatistics(instance.id, instance.publicId);

    return { message };
  }

  async resendPublicMessage(
    principal: InstanceApiPrincipal,
    messageId: string,
  ): Promise<ResendMessageByIdResponse> {
    const instance = await this.loadPublicMessagingInstance(
      principal.instanceId,
    );
    const messageSelectors = isUuidLike(messageId)
      ? [{ id: messageId }, { publicMessageId: messageId }]
      : [{ publicMessageId: messageId }];
    const existing = await prisma.outboundMessage.findFirst({
      where: {
        instanceId: instance.id,
        OR: messageSelectors,
      },
      include: outboundMessageInclude,
    });

    if (!existing) {
      throw new NotFoundException('Outbound message not found.');
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

  async resendCustomerMessagesByStatus(
    userId: string,
    instanceId: string,
    input: ResendMessagesByStatusRequest,
  ): Promise<ResendMessagesByStatusResponse> {
    const instance = await this.loadCustomerMessagingInstance(
      userId,
      instanceId,
    );

    if (input.status === 'queue') {
      return {
        instanceId: instance.id,
        status: input.status,
        requeuedCount: 0,
        updatedAt: new Date().toISOString(),
      };
    }

    const messages = await prisma.outboundMessage.findMany({
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

  async resendPublicMessagesByStatus(
    principal: InstanceApiPrincipal,
    input: ResendMessagesByStatusRequest,
  ): Promise<ResendMessagesByStatusResponse> {
    const instance = await this.loadPublicMessagingInstance(
      principal.instanceId,
    );

    if (input.status === 'queue') {
      return {
        instanceId: instance.id,
        status: input.status,
        requeuedCount: 0,
        updatedAt: new Date().toISOString(),
      };
    }

    const messages = await prisma.outboundMessage.findMany({
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

  async clearCustomerMessagesByStatus(
    userId: string,
    instanceId: string,
    input: ClearMessagesByStatusRequest,
  ): Promise<ClearMessagesByStatusResponse> {
    const instance = await this.loadCustomerMessagingInstance(
      userId,
      instanceId,
    );

    const cleared = await prisma.outboundMessage.deleteMany({
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

  async clearPublicMessagesByStatus(
    principal: InstanceApiPrincipal,
    input: ClearMessagesByStatusRequest,
  ): Promise<ClearMessagesByStatusResponse> {
    const instance = await this.loadPublicMessagingInstance(
      principal.instanceId,
    );

    const cleared = await prisma.outboundMessage.deleteMany({
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

  async listCustomerWebhookDeliveries(
    userId: string,
    instanceId: string,
    filters: Omit<WebhookDeliveryFilters, 'instanceId'>,
  ): Promise<ListWebhookDeliveriesResponse> {
    const instance = await this.loadCustomerMessagingInstance(
      userId,
      instanceId,
    );
    return this.listWebhookDeliveries({
      ...filters,
      instanceId: instance.id,
    });
  }

  async listCustomerInboundMessages(
    userId: string,
    instanceId: string,
    filters: Omit<InboundMessageListFilters, 'instanceId'>,
  ): Promise<ListInboundMessagesResponse> {
    const instance = await this.loadCustomerMessagingInstance(
      userId,
      instanceId,
    );
    return this.listInboundMessages({
      ...filters,
      instanceId: instance.id,
    });
  }

  async listWorkspaceCustomerMessages(
    userId: string,
    filters: Omit<MessageListFilters, 'instanceId' | 'instanceIds'> & {
      workspaceId?: string;
      instanceId?: string;
    },
  ): Promise<ListOutboundMessagesResponse> {
    const access = await this.loadCustomerMessageAccess(
      userId,
      filters.workspaceId,
      filters.instanceId,
    );
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

  async listWorkspaceCustomerInboundMessages(
    userId: string,
    filters: Omit<InboundMessageListFilters, 'instanceId' | 'instanceIds'> & {
      workspaceId?: string;
      instanceId?: string;
    },
  ): Promise<ListInboundMessagesResponse> {
    const access = await this.loadCustomerMessageAccess(
      userId,
      filters.workspaceId,
      filters.instanceId,
    );
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

  async sendCustomerUploadedImageMessage(
    userId: string,
    instanceId: string,
    input: Omit<SendImageMessageRequest, 'imageUrl'>,
    file: UploadedCustomerMediaInput,
  ): Promise<SendMessageResponse> {
    if (!file.buffer.length) {
      throw new BadRequestException('Uploaded media file is empty.');
    }

    if (!file.mimeType.startsWith('image/')) {
      throw new BadRequestException(
        'Only image uploads are supported by this endpoint.',
      );
    }

    const instance = await this.loadCustomerMessagingInstance(
      userId,
      instanceId,
    );
    const uploadedAsset = await this.persistCustomerMediaAsset(
      instance.publicId,
      file,
    );
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

  async readPublicCustomerMediaAsset(assetId: string, fileName: string) {
    const assetDirectory = resolve(
      this.customerMediaRoot,
      sanitizeOpaqueSegment(assetId),
    );
    const absolutePath = resolve(assetDirectory, sanitizeFileName(fileName));
    const metadataPath = resolve(assetDirectory, 'metadata.json');
    const assetStats = await stat(absolutePath).catch(() => null);
    if (!assetStats?.isFile()) {
      throw new NotFoundException('Customer media asset not found.');
    }

    const metadataRaw = await readFile(metadataPath, 'utf8').catch(() => null);
    const metadata = metadataRaw ? safeJsonParse(metadataRaw) : null;

    return {
      filePath: absolutePath,
      contentType:
        metadata &&
        typeof metadata === 'object' &&
        typeof (metadata as { mimeType?: unknown }).mimeType === 'string'
          ? (metadata as { mimeType: string }).mimeType
          : 'application/octet-stream',
    };
  }

  async listAdminMessages(
    filters: MessageListFilters,
  ): Promise<ListOutboundMessagesResponse> {
    return this.listMessages(filters);
  }

  async listAdminWebhookDeliveries(
    filters: WebhookDeliveryFilters,
  ): Promise<ListWebhookDeliveriesResponse> {
    return this.listWebhookDeliveries(filters);
  }

  async listAdminInboundMessages(
    filters: InboundMessageListFilters,
  ): Promise<ListInboundMessagesResponse> {
    return this.listInboundMessages(filters);
  }

  async replayAdminWebhookDelivery(
    adminUserId: string,
    deliveryId: string,
  ): Promise<ReplayWebhookDeliveryResponse> {
    const existing = await prisma.webhookDelivery.findUnique({
      where: {
        id: deliveryId,
      },
      include: webhookDeliveryInclude,
    });

    if (!existing) {
      throw new NotFoundException('Webhook delivery not found.');
    }

    const now = new Date();
    await prisma.$transaction(async (tx) => {
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

    const replayed = await prisma.webhookDelivery.findUnique({
      where: {
        id: existing.id,
      },
      include: webhookDeliveryInclude,
    });

    if (!replayed) {
      throw new NotFoundException('Webhook delivery not found after replay.');
    }

    return {
      delivery: toWebhookDeliverySummary(replayed),
      updatedAt: replayed.updatedAt.toISOString(),
    };
  }

  async claimNextOutboundMessage(
    instanceId: string,
    input: InternalClaimNextOutboundMessageRequest,
  ): Promise<InternalClaimNextOutboundMessageResponse> {
    const instance = await prisma.instance.findUnique({
      where: {
        id: instanceId,
      },
      include: {
        settings: true,
      },
    });

    if (!instance) {
      throw new NotFoundException('Instance not found.');
    }

    if (instance.assignedWorkerId !== input.workerId) {
      throw new ForbiddenException(
        'This worker is not assigned to the target instance.',
      );
    }

    if (instance.status !== 'authenticated') {
      return {
        message: null,
      };
    }

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const claimedId = await prisma.$transaction(async (tx) => {
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

      const message = await prisma.outboundMessage.findUnique({
        where: {
          id: claimedId,
        },
        include: outboundMessageInclude,
      });

      if (!message) {
        break;
      }

      const summary = toOutboundMessageSummary(message);
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

  async updateOutboundMessage(
    instanceId: string,
    messageId: string,
    input: InternalUpdateOutboundMessageRequest,
  ): Promise<OutboundMessageSummary> {
    const instance = await prisma.instance.findUnique({
      where: {
        id: instanceId,
      },
      include: {
        settings: true,
      },
    });

    if (!instance) {
      throw new NotFoundException('Instance not found.');
    }

    if (instance.assignedWorkerId !== input.workerId) {
      throw new ForbiddenException(
        'This worker is not assigned to the target instance.',
      );
    }

    const existing = await prisma.outboundMessage.findFirst({
      where: {
        id: messageId,
        instanceId,
      },
      include: outboundMessageInclude,
    });

    if (!existing) {
      throw new NotFoundException('Outbound message not found.');
    }

    const nextStatus = input.status ?? existing.status;
    const nextAck = input.ack ?? existing.ack;
    const ackChanged = nextAck !== existing.ack;
    const now = new Date();
    const shouldCreateAttempt =
      existing.status === 'queue' && nextStatus !== 'queue';

    const updated = await prisma.$transaction(async (tx) => {
      let attemptNumber: number | null = null;
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
          errorMessage:
            input.errorMessage ??
            (nextStatus === 'sent' ? null : existing.errorMessage),
          processingWorkerId:
            nextStatus === 'queue' ? existing.processingWorkerId : null,
          processingStartedAt:
            nextStatus === 'queue' ? existing.processingStartedAt : null,
          sentAt:
            nextStatus === 'sent' && !existing.sentAt ? now : existing.sentAt,
          acknowledgedAt:
            ackChanged && ['device', 'read', 'played'].includes(nextAck)
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

    const summary = toOutboundMessageSummary(updated);
    this.realtimeService.publishInstanceMessageUpdated({
      instanceId,
      publicId: summary.instancePublicId,
      messageId: summary.id,
    });

    if (nextStatus !== existing.status) {
      await this.publishInstanceStatistics(
        instanceId,
        summary.instancePublicId,
      );
    }

    if (ackChanged) {
      await this.enqueueWebhookIfEnabled(instance, summary, 'message_ack');
    }

    return summary;
  }

  async receiveInboundMessage(
    instanceId: string,
    input: InternalReceiveInboundMessageRequest,
  ): Promise<InboundMessageSummary> {
    const instance = await prisma.instance.findUnique({
      where: {
        id: instanceId,
      },
      include: {
        settings: true,
      },
    });

    if (!instance) {
      throw new NotFoundException('Instance not found.');
    }

    if (instance.assignedWorkerId !== input.workerId) {
      throw new ForbiddenException(
        'This worker is not assigned to the target instance.',
      );
    }

    const receivedAt = input.receivedAt
      ? new Date(input.receivedAt)
      : new Date();
    const sentAt = input.sentAt ? new Date(input.sentAt) : null;

    const created = await prisma.$transaction(async (tx) => {
      const message = await tx.inboundMessage.create({
        data: {
          publicMessageId: `in_${randomBytes(8).toString('hex')}`,
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

    const summary = toInboundMessageSummary(created);
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

  private async createOutboundMessage(input: {
    instance: MessagingInstanceRecord;
    actorId: string;
    actorType: 'customer_user' | 'system';
    auditMetadata?: Record<string, unknown>;
    messageType: 'chat' | 'image';
    recipient: string;
    body: string | null;
    mediaUrl: string | null;
    caption: string | null;
    referenceId: string | null;
    priority: number;
  }) {
    const scheduledFor = await this.calculateScheduledFor(
      input.instance.id,
      input.instance.settings?.sendDelay ?? 1,
      input.instance.settings?.sendDelayMax ?? 15,
    );

    const created = await prisma.outboundMessage.create({
      data: {
        publicMessageId: `msg_${randomBytes(8).toString('hex')}`,
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

    const summary = toOutboundMessageSummary(created);
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
    await this.publishInstanceStatistics(
      input.instance.id,
      input.instance.publicId,
    );

    await this.enqueueWebhookIfEnabled(
      input.instance,
      summary,
      'message_create',
    );
    return summary;
  }

  private async getMessageStatistics(
    instanceId: string,
  ): Promise<MessageStatisticsResponse> {
    const grouped = await prisma.outboundMessage.groupBy({
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

  private async enqueueWebhookIfEnabled(
    instance: MessagingInstanceRecord,
    message: OutboundMessageSummary,
    eventType: WebhookEventType,
  ) {
    const webhookUrl = instance.settings?.webhookUrl?.trim();
    if (!webhookUrl) {
      return;
    }

    if (
      eventType === 'message_create' &&
      !instance.settings?.webhookMessageCreate
    ) {
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

  private async enqueueInboundWebhookIfEnabled(
    instance: MessagingInstanceRecord,
    message: InboundMessageSummary,
  ) {
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

  private async listMessages(
    filters: MessageListFilters,
  ): Promise<ListOutboundMessagesResponse> {
    const messageIdFilter = filters.messageId
      ? isUuidLike(filters.messageId)
        ? [{ id: filters.messageId }, { publicMessageId: filters.messageId }]
        : [{ publicMessageId: filters.messageId }]
      : undefined;
    const scopedInstanceIds = filters.instanceIds?.length
      ? filters.instanceIds
      : undefined;
    const instanceFilter =
      scopedInstanceIds && scopedInstanceIds.length > 0
        ? { in: scopedInstanceIds }
        : filters.instanceId;

    const messages = await prisma.outboundMessage.findMany({
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
      items: messages.map((message) => toOutboundMessageSummary(message)),
    };
  }

  private async listWebhookDeliveries(
    filters: WebhookDeliveryFilters,
  ): Promise<ListWebhookDeliveriesResponse> {
    const deliveries = await prisma.webhookDelivery.findMany({
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
      items: deliveries.map((delivery) => toWebhookDeliverySummary(delivery)),
    };
  }

  private async listInboundMessages(
    filters: InboundMessageListFilters,
  ): Promise<ListInboundMessagesResponse> {
    const scopedInstanceIds = filters.instanceIds?.length
      ? filters.instanceIds
      : undefined;
    const instanceFilter =
      scopedInstanceIds && scopedInstanceIds.length > 0
        ? { in: scopedInstanceIds }
        : filters.instanceId;

    const messages = await prisma.inboundMessage.findMany({
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
      items: messages.map((message) => toInboundMessageSummary(message)),
    };
  }

  private async calculateScheduledFor(
    instanceId: string,
    sendDelay: number,
    sendDelayMax: number,
  ) {
    const now = new Date();
    const [queueDepth, latestQueued] = await Promise.all([
      prisma.outboundMessage.count({
        where: {
          instanceId,
          status: 'queue',
        },
      }),
      prisma.outboundMessage.findFirst({
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
    const anchor =
      latestQueued.scheduledFor > now ? latestQueued.scheduledFor : now;
    return new Date(anchor.getTime() + delaySeconds * 1_000);
  }

  private async loadCustomerMessagingInstance(
    userId: string,
    instanceId: string,
  ): Promise<MessagingInstanceRecord> {
    const instance = await prisma.instance.findFirst({
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
      throw new NotFoundException(
        'Instance not found or not accessible by this user.',
      );
    }

    return instance;
  }

  private async loadCustomerMessageAccess(
    userId: string,
    workspaceId?: string,
    instanceId?: string,
  ) {
    const memberships = await prisma.membership.findMany({
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
      throw new NotFoundException(
        'No accessible workspace was found for this user.',
      );
    }

    const instances = await prisma.instance.findMany({
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
        throw new NotFoundException(
          'Instance not found or not accessible by this user.',
        );
      }

      return {
        instanceIds: [] as string[],
      };
    }

    return {
      instanceIds: instances.map((instance) => instance.id),
    };
  }

  private async loadPublicMessagingInstance(
    instanceId: string,
  ): Promise<MessagingInstanceRecord> {
    const instance = await prisma.instance.findUnique({
      where: {
        id: instanceId,
      },
      include: {
        settings: true,
      },
    });

    if (!instance) {
      throw new NotFoundException('Instance not found.');
    }

    return instance;
  }

  private async publishInstanceStatistics(
    instanceId: string,
    publicId?: string | null,
  ) {
    const statistics = await this.getMessageStatistics(instanceId);
    this.realtimeService.publishInstanceStatisticsUpdated({
      instanceId,
      publicId,
      counts: statistics.counts,
    });
  }

  private async requeueOutboundMessage(
    instance: MessagingInstanceRecord,
    message: OutboundMessageRecord,
    input: {
      actorId: string;
      actorType: 'customer_user' | 'system';
      auditStrategy: 'single' | 'none';
      auditMetadata?: Record<string, unknown>;
    },
  ): Promise<OutboundMessageSummary> {
    if (message.status === 'queue') {
      return toOutboundMessageSummary(message);
    }

    const scheduledFor = await this.calculateScheduledFor(
      instance.id,
      instance.settings?.sendDelay ?? 1,
      instance.settings?.sendDelayMax ?? 15,
    );

    const updated = await prisma.outboundMessage.update({
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

    const summary = toOutboundMessageSummary(updated);
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

  private async persistCustomerMediaAsset(
    instancePublicId: string,
    file: UploadedCustomerMediaInput,
  ) {
    const assetId = `asset_${randomBytes(8).toString('hex')}`;
    const safeName = sanitizeFileName(file.originalName);
    const assetDirectory = resolve(this.customerMediaRoot, assetId);
    const filePath = resolve(assetDirectory, safeName);
    const assetUrl = `${this.apiEnv.API_BASE_URL}${routeSafePublicMediaPath(assetId, safeName)}`;

    await mkdir(assetDirectory, { recursive: true });
    await writeFile(filePath, file.buffer);
    await writeFile(
      resolve(assetDirectory, 'metadata.json'),
      JSON.stringify(
        {
          assetId,
          instancePublicId,
          fileName: safeName,
          mimeType: file.mimeType,
          uploadedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
      'utf8',
    );

    return {
      assetId,
      assetUrl,
      fileName: safeName,
      filePath,
    };
  }
}
