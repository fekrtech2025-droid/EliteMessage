import { WorkerOrchestrationService } from './worker-orchestration.service';
export declare class InternalWorkersController {
    private readonly workerOrchestrationService;
    constructor(workerOrchestrationService: WorkerOrchestrationService);
    registerWorker(body: unknown): Promise<{
        worker: {
            workerId: string;
            status: "online" | "degraded" | "draining" | "offline";
            region: string;
            uptimeSeconds: number;
            activeInstanceCount: number;
            timestamp: string;
            id: string;
            lastSeenAt: string;
            createdAt: string;
            updatedAt: string;
        };
        assignedInstances: {
            id: string;
            publicId: string;
            name: string;
            status: "qr" | "initialize" | "booting" | "loading" | "retrying" | "authenticated" | "disconnected" | "standby" | "stopped" | "expired";
            runtime: {
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
            };
            substatus?: string | null | undefined;
            pendingOperation?: {
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
            } | null | undefined;
        }[];
    }>;
    claimNextInstance(workerId: string): Promise<{
        assignedInstance?: {
            id: string;
            publicId: string;
            name: string;
            status: "qr" | "initialize" | "booting" | "loading" | "retrying" | "authenticated" | "disconnected" | "standby" | "stopped" | "expired";
            runtime: {
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
            };
            substatus?: string | null | undefined;
            pendingOperation?: {
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
            } | null | undefined;
        } | null | undefined;
    }>;
    releaseInstance(workerId: string, body: unknown): Promise<{
        instanceId: string;
        status: "qr" | "initialize" | "booting" | "loading" | "retrying" | "authenticated" | "disconnected" | "standby" | "stopped" | "expired";
        lastUpdatedAt: string;
        substatus?: string | null | undefined;
    }>;
    updateInstanceStatus(instanceId: string, body: unknown): Promise<{
        instanceId: string;
        status: "qr" | "initialize" | "booting" | "loading" | "retrying" | "authenticated" | "disconnected" | "standby" | "stopped" | "expired";
        lastUpdatedAt: string;
        substatus?: string | null | undefined;
    }>;
    updateInstanceRuntime(instanceId: string, body: unknown): Promise<{
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
    updateInstanceOperationStatus(instanceId: string, operationId: string, body: unknown): Promise<{
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
}
//# sourceMappingURL=internal-workers.controller.d.ts.map