import type { CreateSupportCaseRequest, ListSupportCasesResponse, SupportCasePriority, SupportCaseResponse, SupportCaseStatus, UpdateSupportCaseRequest } from '@elite-message/contracts';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
type ListSupportCasesFilters = {
    status?: SupportCaseStatus;
    priority?: SupportCasePriority;
    workspaceId?: string;
    assignedAdminUserId?: string;
    limit: number;
};
export declare class SupportCasesService {
    private readonly auditLogsService;
    constructor(auditLogsService: AuditLogsService);
    listSupportCases(filters: ListSupportCasesFilters): Promise<ListSupportCasesResponse>;
    createSupportCase(adminUserId: string, input: CreateSupportCaseRequest): Promise<SupportCaseResponse>;
    updateSupportCase(adminUserId: string, caseId: string, input: UpdateSupportCaseRequest): Promise<SupportCaseResponse>;
    private resolveCaseReferences;
    private ensureAdminUser;
}
export {};
//# sourceMappingURL=support-cases.service.d.ts.map