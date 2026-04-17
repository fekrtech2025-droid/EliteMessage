import { WorkerOrchestrationService } from './worker-orchestration.service';
export declare class AdminWorkersController {
    private readonly workerOrchestrationService;
    constructor(workerOrchestrationService: WorkerOrchestrationService);
    listWorkers(): Promise<{
        items: {
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
        }[];
    }>;
    getWorkerDetail(workerId: string): Promise<{
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
            workspaceId: string;
            workspaceName: string;
            name: string;
            status: "qr" | "initialize" | "booting" | "loading" | "retrying" | "authenticated" | "disconnected" | "standby" | "stopped" | "expired";
            sendDelay: number;
            sendDelayMax: number;
            createdAt: string;
            updatedAt: string;
            substatus?: string | null | undefined;
            assignedWorkerId?: string | null | undefined;
            assignedWorkerStatus?: "online" | "degraded" | "draining" | "offline" | null | undefined;
            assignedWorkerRegion?: string | null | undefined;
            latestEventAt?: string | null | undefined;
        }[];
        recentOperations: {
            id: string;
            instanceId: string;
            instancePublicId: string;
            instanceName: string;
            action: "start" | "stop" | "restart" | "logout" | "clear" | "takeover" | "reassign";
            status: "pending" | "failed" | "running" | "completed" | "cancelled";
            createdAt: string;
            message?: string | null | undefined;
            errorMessage?: string | null | undefined;
            completedAt?: string | null | undefined;
        }[];
    }>;
}
//# sourceMappingURL=admin-workers.controller.d.ts.map