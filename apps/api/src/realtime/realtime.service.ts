import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import type {
  InstanceStatusPayload,
  WebsocketEnvelope,
} from '@elite-message/contracts';
import { websocketEventNames } from '@elite-message/contracts';
import { RealtimeGateway } from './realtime.gateway';

@Injectable()
export class RealtimeService {
  constructor(private readonly realtimeGateway: RealtimeGateway) {}

  publish(event: string, payload: unknown) {
    const envelope: WebsocketEnvelope = {
      event,
      timestamp: new Date().toISOString(),
      correlationId: randomUUID(),
      payload,
    };

    this.realtimeGateway.server.emit(event, envelope);
  }

  publishInstanceStatusChanged(
    payload: InstanceStatusPayload & { publicId?: string | null },
  ) {
    this.publish(websocketEventNames.instanceStatusChanged, payload);
  }

  publishInstanceQrUpdated(payload: {
    instanceId: string;
    publicId?: string | null;
    qrCode: string | null;
    qrExpiresAt: string | null;
  }) {
    this.publish(websocketEventNames.instanceQrUpdated, payload);
    this.publish(websocketEventNames.instanceRuntimeUpdated, payload);
  }

  publishInstanceRuntimeUpdated(payload: {
    instanceId: string;
    publicId?: string | null;
    currentSessionLabel?: string | null;
    disconnectReason?: string | null;
  }) {
    this.publish(websocketEventNames.instanceRuntimeUpdated, payload);
  }

  publishInstanceLifecycleUpdated(payload: {
    instanceId: string;
    publicId?: string | null;
  }) {
    this.publish(websocketEventNames.instanceLifecycleUpdated, payload);
  }

  publishInstanceOperationUpdated(payload: {
    instanceId: string;
    publicId?: string | null;
    operationId?: string | null;
    status?: string | null;
  }) {
    this.publish(websocketEventNames.instanceOperationUpdated, payload);
  }

  publishInstanceSettingsUpdated(payload: {
    instanceId: string;
    publicId?: string | null;
  }) {
    this.publish(websocketEventNames.instanceSettingsUpdated, payload);
  }

  publishInstanceMessageUpdated(payload: {
    instanceId: string;
    publicId?: string | null;
    messageId?: string | null;
  }) {
    this.publish(websocketEventNames.instanceMessageUpdated, payload);
  }

  publishInstanceInboundMessageUpdated(payload: {
    instanceId: string;
    publicId?: string | null;
    messageId?: string | null;
  }) {
    this.publish(websocketEventNames.instanceInboundMessageUpdated, payload);
  }

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
  }) {
    this.publish(websocketEventNames.instanceStatisticsUpdated, payload);
  }

  publishWebhookDeliveryUpdated(payload: {
    instanceId: string;
    publicId?: string | null;
    deliveryId?: string | null;
  }) {
    this.publish(websocketEventNames.webhookDeliveryUpdated, payload);
  }

  publishWorkerHealthUpdated(payload: { workerId: string }) {
    this.publish(websocketEventNames.workerHealthUpdated, payload);
  }
}
