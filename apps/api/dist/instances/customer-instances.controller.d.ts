import type { Response } from 'express';
import type { RequestUser } from '../common/request-user';
import { InstancesService } from './instances.service';
export declare class CustomerInstancesController {
    private readonly instancesService;
    constructor(instancesService: InstancesService);
    listInstances(user: RequestUser): Promise<{
        items: {
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
    }>;
    createInstance(user: RequestUser, body: unknown): Promise<{
        instance: {
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
        };
        instanceApiToken: string;
    }>;
    getInstanceDetail(user: RequestUser, instanceId: string): Promise<{
        instance: {
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
        };
        settings: {
            id: string;
            sendDelay: number;
            sendDelayMax: number;
            webhookSecret: string;
            webhookMessageReceived: boolean;
            webhookMessageCreate: boolean;
            webhookMessageAck: boolean;
            createdAt: string;
            updatedAt: string;
            webhookUrl?: string | null | undefined;
        };
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
        operations: {
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
        }[];
        tokens: {
            id: string;
            name: string;
            prefix: string;
            createdAt: string;
            revokedAt?: string | null | undefined;
            lastUsedAt?: string | null | undefined;
        }[];
        events: {
            id: string;
            eventType: "instance_created" | "token_rotated" | "worker_assigned" | "worker_released" | "status_changed" | "settings_updated" | "action_requested" | "action_completed" | "action_failed";
            actorType: "customer_user" | "platform_admin" | "worker" | "system";
            message: string;
            createdAt: string;
            actorId?: string | null | undefined;
            fromStatus?: "qr" | "initialize" | "booting" | "loading" | "retrying" | "authenticated" | "disconnected" | "standby" | "stopped" | "expired" | null | undefined;
            toStatus?: "qr" | "initialize" | "booting" | "loading" | "retrying" | "authenticated" | "disconnected" | "standby" | "stopped" | "expired" | null | undefined;
        }[];
        assignedWorker?: {
            workerId: string;
            status: "online" | "degraded" | "draining" | "offline";
            region: string;
            uptimeSeconds: number;
            activeInstanceCount: number;
            lastSeenAt: string;
        } | null | undefined;
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
    }>;
    getInstanceScreenshot(user: RequestUser, instanceId: string, response: Response): Promise<Response<any, Record<string, any>>>;
    updateInstanceSettings(user: RequestUser, instanceId: string, body: unknown): Promise<{
        instanceId: string;
        settings: {
            id: string;
            sendDelay: number;
            sendDelayMax: number;
            webhookSecret: string;
            webhookMessageReceived: boolean;
            webhookMessageCreate: boolean;
            webhookMessageAck: boolean;
            createdAt: string;
            updatedAt: string;
            webhookUrl?: string | null | undefined;
        };
        updatedAt: string;
    }>;
    requestInstanceAction(user: RequestUser, instanceId: string, body: unknown): Promise<{
        instanceId: string;
        message: string;
        operation?: {
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
    }>;
    rotateInstanceToken(user: RequestUser, instanceId: string): Promise<{
        instanceId: string;
        token: string;
        prefix: string;
        createdAt: string;
    }>;
}
//# sourceMappingURL=customer-instances.controller.d.ts.map