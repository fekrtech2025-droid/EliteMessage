import { type InternalClaimNextOutboundMessageRequest, type InternalClaimNextOutboundMessageResponse, type InternalReceiveInboundMessageRequest, type InstanceOperationSummary, type InboundMessageSummary, type InstanceRuntimeView, type InstanceStatusPayload, type InternalClaimNextInstanceResponse, type InternalReleaseInstanceRequest, type OutboundMessageSummary, type InternalUpdateOutboundMessageRequest, type InternalUpdateInstanceOperationRequest, type InternalUpdateInstanceRuntimeRequest, type InternalUpdateInstanceStatusRequest, type InternalWorkerRegisterResponse, type WorkerHeartbeatPayload } from '@elite-message/contracts';
type InternalApiClientOptions = {
    baseUrl: string;
    internalToken: string;
};
export declare class InternalApiClient {
    private readonly options;
    constructor(options: InternalApiClientOptions);
    registerWorker(payload: WorkerHeartbeatPayload): Promise<InternalWorkerRegisterResponse>;
    claimNextInstance(workerId: string): Promise<InternalClaimNextInstanceResponse>;
    updateInstanceStatus(instanceId: string, payload: InternalUpdateInstanceStatusRequest): Promise<InstanceStatusPayload>;
    updateInstanceRuntime(instanceId: string, payload: InternalUpdateInstanceRuntimeRequest): Promise<InstanceRuntimeView>;
    updateInstanceOperationStatus(instanceId: string, operationId: string, payload: InternalUpdateInstanceOperationRequest): Promise<InstanceOperationSummary>;
    releaseInstance(workerId: string, payload: InternalReleaseInstanceRequest): Promise<InstanceStatusPayload>;
    claimNextOutboundMessage(instanceId: string, payload: InternalClaimNextOutboundMessageRequest): Promise<InternalClaimNextOutboundMessageResponse>;
    updateOutboundMessage(instanceId: string, messageId: string, payload: InternalUpdateOutboundMessageRequest): Promise<OutboundMessageSummary>;
    receiveInboundMessage(instanceId: string, payload: InternalReceiveInboundMessageRequest): Promise<InboundMessageSummary>;
    private request;
}
export {};
//# sourceMappingURL=client.d.ts.map