import type { RequestUser } from '../common/request-user';
import { SupportCasesService } from './support-cases.service';
export declare class AdminSupportCasesController {
    private readonly supportCasesService;
    constructor(supportCasesService: SupportCasesService);
    listSupportCases(status?: string, priority?: string, workspaceId?: string, assignedAdminUserId?: string, limit?: string): Promise<{
        items: {
            id: string;
            publicId: string;
            title: string;
            description: string;
            priority: "low" | "normal" | "high" | "urgent";
            status: "open" | "in_progress" | "waiting_on_customer" | "resolved" | "closed";
            createdAt: string;
            updatedAt: string;
            workspaceId?: string | null | undefined;
            workspaceName?: string | null | undefined;
            instanceId?: string | null | undefined;
            instancePublicId?: string | null | undefined;
            requesterUserId?: string | null | undefined;
            requesterDisplayName?: string | null | undefined;
            requesterEmail?: string | null | undefined;
            assignedAdminUserId?: string | null | undefined;
            assignedAdminDisplayName?: string | null | undefined;
            internalNotes?: string | null | undefined;
            resolvedAt?: string | null | undefined;
        }[];
    }>;
    createSupportCase(user: RequestUser, body: unknown): Promise<{
        case: {
            id: string;
            publicId: string;
            title: string;
            description: string;
            priority: "low" | "normal" | "high" | "urgent";
            status: "open" | "in_progress" | "waiting_on_customer" | "resolved" | "closed";
            createdAt: string;
            updatedAt: string;
            workspaceId?: string | null | undefined;
            workspaceName?: string | null | undefined;
            instanceId?: string | null | undefined;
            instancePublicId?: string | null | undefined;
            requesterUserId?: string | null | undefined;
            requesterDisplayName?: string | null | undefined;
            requesterEmail?: string | null | undefined;
            assignedAdminUserId?: string | null | undefined;
            assignedAdminDisplayName?: string | null | undefined;
            internalNotes?: string | null | undefined;
            resolvedAt?: string | null | undefined;
        };
    }>;
    updateSupportCase(user: RequestUser, caseId: string, body: unknown): Promise<{
        case: {
            id: string;
            publicId: string;
            title: string;
            description: string;
            priority: "low" | "normal" | "high" | "urgent";
            status: "open" | "in_progress" | "waiting_on_customer" | "resolved" | "closed";
            createdAt: string;
            updatedAt: string;
            workspaceId?: string | null | undefined;
            workspaceName?: string | null | undefined;
            instanceId?: string | null | undefined;
            instancePublicId?: string | null | undefined;
            requesterUserId?: string | null | undefined;
            requesterDisplayName?: string | null | undefined;
            requesterEmail?: string | null | undefined;
            assignedAdminUserId?: string | null | undefined;
            assignedAdminDisplayName?: string | null | undefined;
            internalNotes?: string | null | undefined;
            resolvedAt?: string | null | undefined;
        };
    }>;
}
//# sourceMappingURL=admin-support-cases.controller.d.ts.map