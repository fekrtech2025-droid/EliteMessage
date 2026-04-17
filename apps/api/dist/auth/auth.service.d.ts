import type { CookieOptions } from 'express';
import type { AdminMfaChallengeResponse, AdminMfaStatusResponse, AdminMfaVerifyRequest, AuthResponse, GoogleAuthMode, LoginRequest, SignupRequest } from '@elite-message/contracts';
import type { InstanceApiPrincipal, RequestUser } from '../common/request-user';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
type LoginMetadata = {
    userAgent?: string;
    ipAddress?: string | null;
};
type AuthFlowResult = {
    response: AuthResponse;
    refreshToken: string;
    refreshExpiresAt: Date;
};
type GoogleCallbackParams = {
    code?: string;
    state?: string;
    error?: string;
    errorDescription?: string;
};
type GoogleAuthorizationRedirect = {
    redirectUrl: string;
    stateCookieValue?: string;
    stateExpiresAt?: Date;
};
type GoogleCallbackRedirect = {
    redirectUrl: string;
    refreshToken?: string;
    refreshExpiresAt?: Date;
};
export declare const refreshCookieName = "elite_message_refresh";
export declare const googleStateCookieName = "elite_message_google_state";
export declare class AuthService {
    private readonly auditLogsService;
    private readonly env;
    constructor(auditLogsService: AuditLogsService);
    login(input: LoginRequest, metadata: LoginMetadata): Promise<AuthFlowResult>;
    signup(input: SignupRequest, metadata: LoginMetadata): Promise<AuthFlowResult>;
    startGoogleAuthorization(mode: GoogleAuthMode): GoogleAuthorizationRedirect;
    completeGoogleAuthorization(params: GoogleCallbackParams, stateCookieValue: string | undefined, metadata: LoginMetadata): Promise<GoogleCallbackRedirect>;
    refresh(refreshToken: string, metadata: LoginMetadata): Promise<AuthFlowResult>;
    getAdminMfaStatus(userId: string): Promise<AdminMfaStatusResponse>;
    createAdminMfaChallenge(userId: string): Promise<AdminMfaChallengeResponse>;
    verifyAdminMfaChallenge(userId: string, input: AdminMfaVerifyRequest): Promise<AdminMfaStatusResponse>;
    logout(refreshToken?: string): Promise<void>;
    authenticateAccessToken(token: string): RequestUser;
    authenticateInstanceApiToken(instancePathId: string, token: string): Promise<InstanceApiPrincipal>;
    extractRefreshToken(cookieHeader?: string): string | undefined;
    extractGoogleStateCookie(cookieHeader?: string): string | undefined;
    buildRefreshCookieOptions(expiresAt: Date): CookieOptions;
    buildGoogleStateCookieOptions(expiresAt: Date): CookieOptions;
    buildClearRefreshCookieOptions(): CookieOptions;
    buildClearGoogleStateCookieOptions(): CookieOptions;
    private loginWithGoogleProfile;
    private signupWithGoogleProfile;
    private fetchGoogleProfile;
    private buildCustomerGoogleRedirect;
    private resolveGoogleCallbackUrl;
    private signGoogleState;
    private verifyGoogleState;
    private readGoogleModeFromState;
    private resolveGoogleDisplayName;
    private findUserByEmail;
    private extractCookieValue;
    private buildAuthResponse;
    private issueAuthFlow;
    private generateUniqueWorkspaceSlug;
    private signAccessToken;
    private verifyAccessToken;
    private addDuration;
    private resolveCookieDomain;
}
export {};
//# sourceMappingURL=auth.service.d.ts.map