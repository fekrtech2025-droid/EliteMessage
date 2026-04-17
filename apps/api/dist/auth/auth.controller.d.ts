import type { Request, Response } from 'express';
import type { RequestUser } from '../common/request-user';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(body: unknown, request: Request, response: Response): Promise<{
        accessToken: string;
        expiresAt: string;
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
    }>;
    login(body: unknown, request: Request, response: Response): Promise<{
        accessToken: string;
        expiresAt: string;
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
    }>;
    refresh(request: Request, response: Response): Promise<{
        accessToken: string;
        expiresAt: string;
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
    }>;
    logout(request: Request, response: Response): Promise<{
        success: boolean;
    }>;
    authorizeWithGoogle(mode: string | undefined, response: Response): void;
    handleGoogleCallback(code: string | string[] | undefined, state: string | string[] | undefined, error: string | string[] | undefined, errorDescription: string | string[] | undefined, request: Request, response: Response): Promise<void>;
    getAdminMfaStatus(user: RequestUser): Promise<{
        enabled: boolean;
        pending: boolean;
        configuredAt?: string | null | undefined;
    }>;
    createAdminMfaChallenge(user: RequestUser): Promise<{
        secret: string;
        otpauthUrl: string;
        issuer: string;
        accountLabel: string;
    }>;
    verifyAdminMfaChallenge(user: RequestUser, body: unknown): Promise<{
        enabled: boolean;
        pending: boolean;
        configuredAt?: string | null | undefined;
    }>;
    private getRequestMetadata;
    private readSingleQueryValue;
}
//# sourceMappingURL=auth.controller.d.ts.map