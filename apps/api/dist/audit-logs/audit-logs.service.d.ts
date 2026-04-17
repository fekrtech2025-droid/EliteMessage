import type { AuditActorType, AuditEntityType, ListAuditLogsResponse } from '@elite-message/contracts';
import { Prisma, prisma } from '@elite-message/db';
type AuditDatabaseClient = Prisma.TransactionClient | typeof prisma;
type RecordAuditLogInput = {
    workspaceId?: string | null;
    instanceId?: string | null;
    actorType: AuditActorType;
    actorId?: string | null;
    entityType: AuditEntityType;
    entityId?: string | null;
    action: string;
    summary: string;
    metadata?: unknown;
};
type AccountAuditFilters = {
    workspaceId?: string;
    instanceId?: string;
    action?: string;
    entityType?: AuditEntityType;
    limit: number;
};
type AdminAuditFilters = {
    workspaceId?: string;
    instanceId?: string;
    actorType?: AuditActorType;
    entityType?: AuditEntityType;
    action?: string;
    limit: number;
};
export declare class AuditLogsService {
    record(input: RecordAuditLogInput): Promise<{
        id: string;
        createdAt: Date;
        instanceId: string | null;
        action: string;
        workspaceId: string | null;
        actorType: import("@elite-message/db").$Enums.AuditActorType;
        entityType: import("@elite-message/db").$Enums.AuditEntityType;
        actorId: string | null;
        entityId: string | null;
        summary: string;
        metadata: Prisma.JsonValue | null;
    }>;
    recordWithClient(client: AuditDatabaseClient, input: RecordAuditLogInput): Promise<{
        id: string;
        createdAt: Date;
        instanceId: string | null;
        action: string;
        workspaceId: string | null;
        actorType: import("@elite-message/db").$Enums.AuditActorType;
        entityType: import("@elite-message/db").$Enums.AuditEntityType;
        actorId: string | null;
        entityId: string | null;
        summary: string;
        metadata: Prisma.JsonValue | null;
    }>;
    listAccountAuditLogs(userId: string, filters: AccountAuditFilters): Promise<ListAuditLogsResponse>;
    listAdminAuditLogs(filters: AdminAuditFilters): Promise<ListAuditLogsResponse>;
}
export {};
//# sourceMappingURL=audit-logs.service.d.ts.map