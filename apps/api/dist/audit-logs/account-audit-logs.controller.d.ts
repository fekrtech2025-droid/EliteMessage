import type { RequestUser } from '../common/request-user';
import { AuditLogsService } from './audit-logs.service';
export declare class AccountAuditLogsController {
    private readonly auditLogsService;
    constructor(auditLogsService: AuditLogsService);
    listAuditLogs(user: RequestUser, workspaceId?: string, instanceId?: string, action?: string, entityType?: string, limit?: string): Promise<{
        items: {
            id: string;
            actorType: "anonymous" | "customer_user" | "platform_admin" | "worker" | "system";
            entityType: "worker" | "auth_session" | "user" | "workspace" | "account_api_token" | "instance" | "instance_settings" | "instance_api_token" | "instance_operation" | "outbound_message" | "inbound_message" | "webhook_delivery" | "support_case";
            action: string;
            summary: string;
            createdAt: string;
            workspaceId?: string | null | undefined;
            workspaceName?: string | null | undefined;
            instanceId?: string | null | undefined;
            instancePublicId?: string | null | undefined;
            actorId?: string | null | undefined;
            entityId?: string | null | undefined;
            metadata?: unknown;
        }[];
    }>;
}
//# sourceMappingURL=account-audit-logs.controller.d.ts.map