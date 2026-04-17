import type { RequestUser } from '../common/request-user';
import { AccountsService } from './accounts.service';
export declare class AdminAccountsController {
    private readonly accountsService;
    constructor(accountsService: AccountsService);
    listUsers(): Promise<{
        items: {
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
    }>;
    getUserDetail(userId: string): Promise<{
        user: {
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
        };
        workspaces: {
            workspaceId: string;
            workspaceName: string;
            workspaceSlug: string;
            workspaceStatus: "active" | "suspended";
            membershipRole: "owner" | "admin" | "operator" | "viewer";
            joinedAt: string;
        }[];
    }>;
    updateUserStatus(user: RequestUser, userId: string, body: unknown): Promise<{
        user: {
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
        };
        updatedAt: string;
    }>;
    listWorkspaces(): Promise<{
        items: {
            id: string;
            name: string;
            slug: string;
            status: "active" | "suspended";
            subscriptionStatus: "active" | "trialing" | "manual";
            memberCount: number;
            instanceCount: number;
            createdAt: string;
            updatedAt: string;
            trialEndsAt?: string | null | undefined;
        }[];
    }>;
    getWorkspaceDetail(workspaceId: string): Promise<{
        workspace: {
            id: string;
            name: string;
            slug: string;
            status: "active" | "suspended";
            subscriptionStatus: "active" | "trialing" | "manual";
            memberCount: number;
            instanceCount: number;
            createdAt: string;
            updatedAt: string;
            trialEndsAt?: string | null | undefined;
        };
        subscription: {
            status: "active" | "trialing" | "manual";
            planName: string;
            billingMode: "manual";
            currentPeriodStart: string;
            instanceCount: number;
            linkedInstanceCount: number;
            webhookEnabledInstanceCount: number;
            notes: string[];
            trialEndsAt?: string | null | undefined;
            currentPeriodEnd?: string | null | undefined;
        };
        members: {
            userId: string;
            email: string;
            displayName: string;
            userRole: "platform_admin" | "customer";
            userStatus: "active" | "suspended";
            membershipRole: "owner" | "admin" | "operator" | "viewer";
            joinedAt: string;
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
    }>;
    updateWorkspaceStatus(user: RequestUser, workspaceId: string, body: unknown): Promise<{
        workspace: {
            id: string;
            name: string;
            slug: string;
            status: "active" | "suspended";
            subscriptionStatus: "active" | "trialing" | "manual";
            memberCount: number;
            instanceCount: number;
            createdAt: string;
            updatedAt: string;
            trialEndsAt?: string | null | undefined;
        };
        updatedAt: string;
    }>;
    extendWorkspaceTrial(user: RequestUser, workspaceId: string, body: unknown): Promise<{
        workspace: {
            id: string;
            name: string;
            slug: string;
            status: "active" | "suspended";
            subscriptionStatus: "active" | "trialing" | "manual";
            memberCount: number;
            instanceCount: number;
            createdAt: string;
            updatedAt: string;
            trialEndsAt?: string | null | undefined;
        };
        subscription: {
            status: "active" | "trialing" | "manual";
            planName: string;
            billingMode: "manual";
            currentPeriodStart: string;
            instanceCount: number;
            linkedInstanceCount: number;
            webhookEnabledInstanceCount: number;
            notes: string[];
            trialEndsAt?: string | null | undefined;
            currentPeriodEnd?: string | null | undefined;
        };
        updatedAt: string;
    }>;
}
//# sourceMappingURL=admin-accounts.controller.d.ts.map