import { WorkerOrchestrationService } from './worker-orchestration.service';
export declare class AdminOverviewController {
    private readonly workerOrchestrationService;
    constructor(workerOrchestrationService: WorkerOrchestrationService);
    getOverview(): Promise<{
        counts: {
            users: number;
            workspaces: number;
            instances: number;
            workers: number;
        };
        users: {
            id: string;
            email: string;
            displayName: string;
            role: "platform_admin" | "customer";
            createdAt: string;
            status: "active" | "suspended";
            workspaceCount: number;
            instanceCount: number;
            activeRefreshSessionCount: number;
            lastRefreshAt?: string | null | undefined;
        }[];
        instances: {
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
        workers: {
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
}
//# sourceMappingURL=admin-overview.controller.d.ts.map