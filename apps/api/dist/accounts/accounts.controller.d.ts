import type { RequestUser } from '../common/request-user';
import { AccountsService } from './accounts.service';
export declare class AccountsController {
    private readonly accountsService;
    constructor(accountsService: AccountsService);
    getMe(user: RequestUser): Promise<{
        user: {
            id: string;
            email: string;
            displayName: string;
            role: "platform_admin" | "customer";
            createdAt: string;
        };
        workspaces: {
            id: string;
            name: string;
            slug: string;
            role: "owner" | "admin" | "operator" | "viewer";
            createdAt: string;
        }[];
        themePreference: "system" | "light" | "dark";
    }>;
    updateMe(user: RequestUser, body: unknown): Promise<{
        user: {
            id: string;
            email: string;
            displayName: string;
            role: "platform_admin" | "customer";
            createdAt: string;
        };
        updatedAt: string;
    }>;
    updateTheme(user: RequestUser, body: unknown): Promise<{
        themePreference: "system" | "light" | "dark";
        updatedAt: string;
    }>;
    getSubscription(user: RequestUser, workspaceId?: string): Promise<{
        workspace: {
            id: string;
            name: string;
            slug: string;
            role: "owner" | "admin" | "operator" | "viewer";
            createdAt: string;
        };
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
    }>;
    listApiTokens(user: RequestUser, workspaceId?: string): Promise<{
        workspace: {
            id: string;
            name: string;
            slug: string;
            role: "owner" | "admin" | "operator" | "viewer";
            createdAt: string;
        };
        items: {
            id: string;
            workspaceId: string;
            name: string;
            prefix: string;
            createdAt: string;
            revokedAt?: string | null | undefined;
            lastUsedAt?: string | null | undefined;
        }[];
    }>;
    createApiToken(user: RequestUser, body: unknown): Promise<{
        token: string;
        summary: {
            id: string;
            workspaceId: string;
            name: string;
            prefix: string;
            createdAt: string;
            revokedAt?: string | null | undefined;
            lastUsedAt?: string | null | undefined;
        };
    }>;
    rotateApiToken(user: RequestUser, tokenId: string): Promise<{
        token: string;
        summary: {
            id: string;
            workspaceId: string;
            name: string;
            prefix: string;
            createdAt: string;
            revokedAt?: string | null | undefined;
            lastUsedAt?: string | null | undefined;
        };
    }>;
}
//# sourceMappingURL=accounts.controller.d.ts.map