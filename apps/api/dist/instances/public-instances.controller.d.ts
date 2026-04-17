import type { Response } from 'express';
import type { InstanceApiPrincipal } from '../common/request-user';
import { InstancesService } from './instances.service';
export declare class PublicInstancesController {
    private readonly instancesService;
    constructor(instancesService: InstancesService);
    getStatus(principal: InstanceApiPrincipal): Promise<{
        instanceId: string;
        publicId: string;
        status: "qr" | "initialize" | "booting" | "loading" | "retrying" | "authenticated" | "disconnected" | "standby" | "stopped" | "expired";
        sessionBackend: "placeholder" | "whatsapp_web";
        qrReady: boolean;
        updatedAt: string;
        substatus?: string | null | undefined;
        currentSessionLabel?: string | null | undefined;
        qrExpiresAt?: string | null | undefined;
        lastAuthenticatedAt?: string | null | undefined;
        lastDisconnectedAt?: string | null | undefined;
        disconnectReason?: string | null | undefined;
    }>;
    getMe(principal: InstanceApiPrincipal): Promise<{
        instanceId: string;
        publicId: string;
        status: "qr" | "initialize" | "booting" | "loading" | "retrying" | "authenticated" | "disconnected" | "standby" | "stopped" | "expired";
        sessionBackend: "placeholder" | "whatsapp_web";
        connected: boolean;
        updatedAt: string;
        substatus?: string | null | undefined;
        currentSessionLabel?: string | null | undefined;
        me?: unknown;
        diagnostics?: unknown;
    }>;
    getSettings(principal: InstanceApiPrincipal): Promise<{
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
    }>;
    updateSettings(principal: InstanceApiPrincipal, body: unknown): Promise<{
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
    getQrCode(principal: InstanceApiPrincipal): Promise<{
        instanceId: string;
        publicId: string;
        expired: boolean;
        updatedAt: string;
        qrCode?: string | null | undefined;
        qrExpiresAt?: string | null | undefined;
    }>;
    getQr(principal: InstanceApiPrincipal, response: Response): Promise<Response<any, Record<string, any>>>;
    start(principal: InstanceApiPrincipal): Promise<{
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
    stop(principal: InstanceApiPrincipal): Promise<{
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
    restart(principal: InstanceApiPrincipal): Promise<{
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
    logout(principal: InstanceApiPrincipal): Promise<{
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
    clear(principal: InstanceApiPrincipal): Promise<{
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
    takeover(principal: InstanceApiPrincipal): Promise<{
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
    getScreenshot(principal: InstanceApiPrincipal, encoding: string | undefined, response: Response): Promise<Response<any, Record<string, any>>>;
    private requestAction;
}
//# sourceMappingURL=public-instances.controller.d.ts.map