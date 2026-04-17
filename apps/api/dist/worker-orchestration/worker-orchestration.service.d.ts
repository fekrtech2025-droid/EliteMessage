import type { AdminWorkerDetailResponse, AdminOverviewResponse, InstanceStatusPayload, InternalClaimNextInstanceResponse, InternalReleaseInstanceRequest, InternalUpdateInstanceOperationRequest, InternalUpdateInstanceRuntimeRequest, InternalUpdateInstanceStatusRequest, InternalWorkerRegisterResponse, ListAdminWorkersResponse, WorkerHeartbeatPayload } from '@elite-message/contracts';
import { RealtimeService } from '../realtime/realtime.service';
export declare class WorkerOrchestrationService {
    private readonly realtimeService;
    constructor(realtimeService: RealtimeService);
    getAdminOverview(): Promise<AdminOverviewResponse>;
    listAdminWorkers(): Promise<ListAdminWorkersResponse>;
    getAdminWorkerDetail(workerId: string): Promise<AdminWorkerDetailResponse>;
    registerWorker(payload: WorkerHeartbeatPayload): Promise<InternalWorkerRegisterResponse>;
    claimNextInstance(workerId: string): Promise<InternalClaimNextInstanceResponse>;
    releaseAssignedInstance(workerId: string, input: InternalReleaseInstanceRequest): Promise<InstanceStatusPayload>;
    updateInstanceStatus(instanceId: string, input: InternalUpdateInstanceStatusRequest): Promise<InstanceStatusPayload>;
    updateInstanceRuntime(instanceId: string, input: InternalUpdateInstanceRuntimeRequest): Promise<{
        id: string;
        sessionBackend: "placeholder" | "whatsapp_web";
        createdAt: string;
        updatedAt: string;
        qrCode?: string | null | undefined;
        qrExpiresAt?: string | null | undefined;
        currentSessionLabel?: string | null | undefined;
        sessionDiagnostics?: unknown;
        lastStartedAt?: string | null | undefined;
        lastAuthenticatedAt?: string | null | undefined;
        lastDisconnectedAt?: string | null | undefined;
        lastInboundMessageAt?: string | null | undefined;
        lastScreenshotAt?: string | null | undefined;
        lastScreenshotPath?: string | null | undefined;
        disconnectReason?: string | null | undefined;
    }>;
    updateInstanceOperationStatus(instanceId: string, operationId: string, input: InternalUpdateInstanceOperationRequest): Promise<{
        id: string;
        action: "start" | "stop" | "restart" | "logout" | "clear" | "takeover" | "reassign";
        status: "pending" | "failed" | "running" | "completed" | "cancelled";
        requestedByActorType: "customer_user" | "platform_admin" | "worker" | "system";
        createdAt: string;
        targetWorkerId?: string | null | undefined;
        message?: string | null | undefined;
        errorMessage?: string | null | undefined;
        requestedByActorId?: string | null | undefined;
        startedAt?: string | null | undefined;
        completedAt?: string | null | undefined;
    }>;
    private ensureWorkerExists;
    private ensureInstanceScaffolding;
    private refreshWorkerActivity;
    private listAssignedInstances;
    private loadAssignedInstanceOrThrow;
}
//# sourceMappingURL=worker-orchestration.service.d.ts.map