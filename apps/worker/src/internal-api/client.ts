import {
  type InternalClaimNextOutboundMessageRequest,
  type InternalClaimNextOutboundMessageResponse,
  InternalClaimNextOutboundMessageResponseSchema,
  type InternalReceiveInboundMessageRequest,
  type InstanceOperationSummary,
  InstanceOperationSummarySchema,
  type InboundMessageSummary,
  InboundMessageSummarySchema,
  type InstanceRuntimeView,
  InstanceRuntimeViewSchema,
  type InstanceStatusPayload,
  type InternalClaimNextInstanceResponse,
  InternalClaimNextInstanceResponseSchema,
  type InternalReleaseInstanceRequest,
  type OutboundMessageSummary,
  OutboundMessageSummarySchema,
  type InternalUpdateOutboundMessageRequest,
  type InternalUpdateInstanceOperationRequest,
  type InternalUpdateInstanceRuntimeRequest,
  type InternalUpdateInstanceStatusRequest,
  type InternalWorkerRegisterResponse,
  InternalWorkerRegisterResponseSchema,
  InstanceStatusPayloadSchema,
  type WorkerHeartbeatPayload,
} from '@elite-message/contracts';

type InternalApiClientOptions = {
  baseUrl: string;
  internalToken: string;
};

export class InternalApiClient {
  constructor(private readonly options: InternalApiClientOptions) {}

  registerWorker(
    payload: WorkerHeartbeatPayload,
  ): Promise<InternalWorkerRegisterResponse> {
    return this.request(
      '/api/v1/internal/workers/register',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      InternalWorkerRegisterResponseSchema,
    );
  }

  claimNextInstance(
    workerId: string,
  ): Promise<InternalClaimNextInstanceResponse> {
    return this.request(
      `/api/v1/internal/workers/${workerId}/claim-next`,
      {
        method: 'POST',
      },
      InternalClaimNextInstanceResponseSchema,
    );
  }

  updateInstanceStatus(
    instanceId: string,
    payload: InternalUpdateInstanceStatusRequest,
  ): Promise<InstanceStatusPayload> {
    return this.request(
      `/api/v1/internal/instances/${instanceId}/status`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      InstanceStatusPayloadSchema,
    );
  }

  updateInstanceRuntime(
    instanceId: string,
    payload: InternalUpdateInstanceRuntimeRequest,
  ): Promise<InstanceRuntimeView> {
    return this.request(
      `/api/v1/internal/instances/${instanceId}/runtime`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      InstanceRuntimeViewSchema,
    );
  }

  updateInstanceOperationStatus(
    instanceId: string,
    operationId: string,
    payload: InternalUpdateInstanceOperationRequest,
  ): Promise<InstanceOperationSummary> {
    return this.request(
      `/api/v1/internal/instances/${instanceId}/operations/${operationId}/status`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      InstanceOperationSummarySchema,
    );
  }

  releaseInstance(
    workerId: string,
    payload: InternalReleaseInstanceRequest,
  ): Promise<InstanceStatusPayload> {
    return this.request(
      `/api/v1/internal/workers/${workerId}/release-instance`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      InstanceStatusPayloadSchema,
    );
  }

  claimNextOutboundMessage(
    instanceId: string,
    payload: InternalClaimNextOutboundMessageRequest,
  ): Promise<InternalClaimNextOutboundMessageResponse> {
    return this.request(
      `/api/v1/internal/instances/${instanceId}/messages/claim-next`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      InternalClaimNextOutboundMessageResponseSchema,
    );
  }

  updateOutboundMessage(
    instanceId: string,
    messageId: string,
    payload: InternalUpdateOutboundMessageRequest,
  ): Promise<OutboundMessageSummary> {
    return this.request(
      `/api/v1/internal/instances/${instanceId}/messages/${messageId}/status`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      OutboundMessageSummarySchema,
    );
  }

  receiveInboundMessage(
    instanceId: string,
    payload: InternalReceiveInboundMessageRequest,
  ): Promise<InboundMessageSummary> {
    return this.request(
      `/api/v1/internal/instances/${instanceId}/messages/received`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      InboundMessageSummarySchema,
    );
  }

  private async request<T>(
    path: string,
    init: RequestInit,
    parser: { parse: (value: unknown) => T },
  ): Promise<T> {
    const url = new URL(
      path.replace(/^\//, ''),
      this.options.baseUrl.endsWith('/')
        ? this.options.baseUrl
        : `${this.options.baseUrl}/`,
    );
    const response = await fetch(url, {
      ...init,
      headers: {
        authorization: `Bearer ${this.options.internalToken}`,
        'content-type': 'application/json',
        ...(init.headers ?? {}),
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Internal API request failed (${response.status} ${response.statusText}): ${body}`,
      );
    }

    const data = (await response.json()) as unknown;
    return parser.parse(data);
  }
}
