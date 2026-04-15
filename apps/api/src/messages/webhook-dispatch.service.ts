import { createHmac } from 'node:crypto';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { WebhookEventType } from '@elite-message/contracts';
import { Prisma, prisma } from '@elite-message/db';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { toWebhookDeliverySummary } from '../common/presenters';
import { RealtimeService } from '../realtime/realtime.service';

const webhookRetryDelaysMs = [1_000, 5_000, 15_000] as const;
const webhookRequestTimeoutMs = 1_000;

type EnqueueWebhookEventInput = {
  instanceId: string;
  publicId: string;
  messageId?: string | null;
  eventType: WebhookEventType;
  targetUrl: string;
  data: unknown;
};

function toJsonInput(value: unknown): Prisma.InputJsonValue | null {
  if (value === null || value === undefined) {
    return null;
  }

  return value as Prisma.InputJsonValue;
}

@Injectable()
export class WebhookDispatchService implements OnModuleInit, OnModuleDestroy {
  private retryTimer: NodeJS.Timeout | undefined;
  private processingDueDeliveries = false;

  constructor(
    private readonly realtimeService: RealtimeService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

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

  async enqueueEvent(input: EnqueueWebhookEventInput) {
    const payload = {
      event_type: input.eventType,
      instanceId: input.instanceId,
      publicId: input.publicId,
      timestamp: new Date().toISOString(),
      data: toJsonInput(input.data),
    };

    const delivery = await prisma.webhookDelivery.create({
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

  async dispatchDeliveryNow(deliveryId: string) {
    await this.processDelivery(deliveryId);
  }

  private async dispatchDueDeliveries() {
    if (this.processingDueDeliveries) {
      return;
    }

    this.processingDueDeliveries = true;
    try {
      const dueDeliveries = await prisma.webhookDelivery.findMany({
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
    } finally {
      this.processingDueDeliveries = false;
    }
  }

  private async processDelivery(deliveryId: string) {
    const delivery = await prisma.webhookDelivery.findUnique({
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

    if (
      !delivery ||
      delivery.status === 'delivered' ||
      delivery.status === 'exhausted'
    ) {
      return;
    }

    const attemptedAt = new Date();
    const nextAttemptCount = delivery.attemptCount + 1;

    let responseStatusCode: number | null = null;
    let responseBody: string | null = null;
    let errorMessage: string | null = null;
    let delivered = false;
    const payloadBody = JSON.stringify(delivery.payload);
    const signedTimestamp = attemptedAt.toISOString();
    const signature = createHmac(
      'sha256',
      delivery.instance.settings?.webhookSecret ?? '',
    )
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
    } catch (error) {
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

    const updated = await prisma.webhookDelivery.update({
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

    const summary = toWebhookDeliverySummary(updated);
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
}
