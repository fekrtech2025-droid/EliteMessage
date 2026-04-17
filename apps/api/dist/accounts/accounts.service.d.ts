import type { AccountMeResponse, AdminUserDetailResponse, AdminWorkspaceDetailResponse, CreateAccountApiTokenRequest, CreateAccountApiTokenResponse, ExtendAdminWorkspaceTrialRequest, ExtendAdminWorkspaceTrialResponse, GetWorkspaceSubscriptionResponse, ListAccountApiTokensResponse, ListAdminUsersResponse, ListAdminWorkspacesResponse, RotateAccountApiTokenResponse, UpdateAdminUserStatusRequest, UpdateAdminUserStatusResponse, UpdateAdminWorkspaceStatusRequest, UpdateAdminWorkspaceStatusResponse, UpdateAccountProfileRequest, UpdateAccountProfileResponse, UpdateAccountThemePreferenceRequest, UpdateAccountThemePreferenceResponse } from '@elite-message/contracts';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
export declare class AccountsService {
    private readonly auditLogsService;
    constructor(auditLogsService: AuditLogsService);
    getAccountMe(userId: string): Promise<AccountMeResponse>;
    updateAccountProfile(userId: string, input: UpdateAccountProfileRequest): Promise<UpdateAccountProfileResponse>;
    updateAccountThemePreference(userId: string, input: UpdateAccountThemePreferenceRequest): Promise<UpdateAccountThemePreferenceResponse>;
    listAccountApiTokens(userId: string, workspaceId?: string): Promise<ListAccountApiTokensResponse>;
    createAccountApiToken(userId: string, input: CreateAccountApiTokenRequest): Promise<CreateAccountApiTokenResponse>;
    rotateAccountApiToken(userId: string, tokenId: string): Promise<RotateAccountApiTokenResponse>;
    getWorkspaceSubscription(userId: string, workspaceId?: string): Promise<GetWorkspaceSubscriptionResponse>;
    listAdminUsers(): Promise<ListAdminUsersResponse>;
    getAdminUserDetail(userId: string): Promise<AdminUserDetailResponse>;
    updateAdminUserStatus(adminUserId: string, userId: string, input: UpdateAdminUserStatusRequest): Promise<UpdateAdminUserStatusResponse>;
    listAdminWorkspaces(): Promise<ListAdminWorkspacesResponse>;
    getAdminWorkspaceDetail(workspaceId: string): Promise<AdminWorkspaceDetailResponse>;
    updateAdminWorkspaceStatus(adminUserId: string, workspaceId: string, input: UpdateAdminWorkspaceStatusRequest): Promise<UpdateAdminWorkspaceStatusResponse>;
    extendAdminWorkspaceTrial(adminUserId: string, workspaceId: string, input: ExtendAdminWorkspaceTrialRequest): Promise<ExtendAdminWorkspaceTrialResponse>;
    private getWorkspaceMembership;
    private buildWorkspaceSubscriptionSummary;
}
//# sourceMappingURL=accounts.service.d.ts.map