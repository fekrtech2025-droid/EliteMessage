"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportCasesService = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const db_1 = require("@elite-message/db");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const presenters_1 = require("../common/presenters");
const supportCaseInclude = {
    workspace: {
        select: {
            name: true,
        },
    },
    instance: {
        select: {
            publicId: true,
        },
    },
    requesterUser: {
        select: {
            displayName: true,
            email: true,
        },
    },
    assignedAdminUser: {
        select: {
            displayName: true,
        },
    },
};
function createSupportCasePublicId() {
    return `SUP-${(0, node_crypto_1.randomBytes)(4).toString('hex').toUpperCase()}`;
}
let SupportCasesService = class SupportCasesService {
    auditLogsService;
    constructor(auditLogsService) {
        this.auditLogsService = auditLogsService;
    }
    async listSupportCases(filters) {
        const items = await db_1.prisma.supportCase.findMany({
            where: {
                status: filters.status,
                priority: filters.priority,
                workspaceId: filters.workspaceId,
                assignedAdminUserId: filters.assignedAdminUserId,
            },
            include: supportCaseInclude,
            orderBy: [
                {
                    updatedAt: 'desc',
                },
                {
                    createdAt: 'desc',
                },
            ],
            take: filters.limit,
        });
        return {
            items: items.map((item) => (0, presenters_1.toSupportCaseSummary)(item)),
        };
    }
    async createSupportCase(adminUserId, input) {
        const resolvedReferences = await this.resolveCaseReferences(input);
        const created = await db_1.prisma.$transaction(async (tx) => {
            const caseRecord = await tx.supportCase.create({
                data: {
                    publicId: createSupportCasePublicId(),
                    workspaceId: resolvedReferences.workspaceId,
                    instanceId: resolvedReferences.instanceId,
                    requesterUserId: resolvedReferences.requesterUserId,
                    assignedAdminUserId: resolvedReferences.assignedAdminUserId,
                    title: input.title.trim(),
                    description: input.description.trim(),
                    priority: input.priority,
                    internalNotes: input.internalNotes?.trim() || null,
                },
                include: supportCaseInclude,
            });
            await this.auditLogsService.recordWithClient(tx, {
                workspaceId: caseRecord.workspaceId,
                instanceId: caseRecord.instanceId,
                actorType: 'platform_admin',
                actorId: adminUserId,
                entityType: 'support_case',
                entityId: caseRecord.id,
                action: 'admin.support_case.created',
                summary: `Support case ${caseRecord.publicId} created.`,
                metadata: {
                    priority: caseRecord.priority,
                    title: caseRecord.title,
                },
            });
            return caseRecord;
        });
        return {
            case: (0, presenters_1.toSupportCaseSummary)(created),
        };
    }
    async updateSupportCase(adminUserId, caseId, input) {
        const existing = await db_1.prisma.supportCase.findUnique({
            where: {
                id: caseId,
            },
            include: supportCaseInclude,
        });
        if (!existing) {
            throw new common_1.NotFoundException('Support case not found.');
        }
        if (Object.prototype.hasOwnProperty.call(input, 'assignedAdminUserId')) {
            await this.ensureAdminUser(input.assignedAdminUserId ?? null);
        }
        const now = new Date();
        const nextStatus = input.status ?? existing.status;
        const nextResolvedAt = nextStatus === 'resolved' || nextStatus === 'closed'
            ? (existing.resolvedAt ?? now)
            : input.status
                ? null
                : existing.resolvedAt;
        const updated = await db_1.prisma.$transaction(async (tx) => {
            const caseRecord = await tx.supportCase.update({
                where: {
                    id: caseId,
                },
                data: {
                    status: nextStatus,
                    priority: input.priority ?? existing.priority,
                    assignedAdminUserId: Object.prototype.hasOwnProperty.call(input, 'assignedAdminUserId')
                        ? (input.assignedAdminUserId ?? null)
                        : existing.assignedAdminUserId,
                    internalNotes: Object.prototype.hasOwnProperty.call(input, 'internalNotes')
                        ? input.internalNotes?.trim() || null
                        : existing.internalNotes,
                    resolvedAt: nextResolvedAt,
                },
                include: supportCaseInclude,
            });
            await this.auditLogsService.recordWithClient(tx, {
                workspaceId: caseRecord.workspaceId,
                instanceId: caseRecord.instanceId,
                actorType: 'platform_admin',
                actorId: adminUserId,
                entityType: 'support_case',
                entityId: caseRecord.id,
                action: 'admin.support_case.updated',
                summary: `Support case ${caseRecord.publicId} updated.`,
                metadata: {
                    previousStatus: existing.status,
                    nextStatus,
                    previousPriority: existing.priority,
                    nextPriority: input.priority ?? existing.priority,
                    assignedAdminUserId: Object.prototype.hasOwnProperty.call(input, 'assignedAdminUserId')
                        ? (input.assignedAdminUserId ?? null)
                        : existing.assignedAdminUserId,
                },
            });
            return caseRecord;
        });
        return {
            case: (0, presenters_1.toSupportCaseSummary)(updated),
        };
    }
    async resolveCaseReferences(input) {
        let workspaceId = input.workspaceId ?? null;
        let instanceId = input.instanceId ?? null;
        const requesterUserId = input.requesterUserId ?? null;
        const assignedAdminUserId = input.assignedAdminUserId ?? null;
        if (instanceId) {
            const instance = await db_1.prisma.instance.findUnique({
                where: {
                    id: instanceId,
                },
                select: {
                    id: true,
                    workspaceId: true,
                },
            });
            if (!instance) {
                throw new common_1.NotFoundException('Referenced instance was not found.');
            }
            if (workspaceId && workspaceId !== instance.workspaceId) {
                throw new common_1.BadRequestException('The selected instance does not belong to the selected workspace.');
            }
            workspaceId = instance.workspaceId;
            instanceId = instance.id;
        }
        if (workspaceId) {
            const workspace = await db_1.prisma.workspace.findUnique({
                where: {
                    id: workspaceId,
                },
                select: {
                    id: true,
                },
            });
            if (!workspace) {
                throw new common_1.NotFoundException('Referenced workspace was not found.');
            }
        }
        if (requesterUserId) {
            const requester = await db_1.prisma.user.findUnique({
                where: {
                    id: requesterUserId,
                },
                select: {
                    id: true,
                },
            });
            if (!requester) {
                throw new common_1.NotFoundException('Referenced requester user was not found.');
            }
        }
        await this.ensureAdminUser(assignedAdminUserId);
        return {
            workspaceId,
            instanceId,
            requesterUserId,
            assignedAdminUserId,
        };
    }
    async ensureAdminUser(userId) {
        if (!userId) {
            return;
        }
        const adminUser = await db_1.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                role: true,
            },
        });
        if (!adminUser) {
            throw new common_1.NotFoundException('Assigned admin user was not found.');
        }
        if (adminUser.role !== 'platform_admin') {
            throw new common_1.BadRequestException('Support cases can only be assigned to platform admin users.');
        }
    }
};
exports.SupportCasesService = SupportCasesService;
exports.SupportCasesService = SupportCasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_logs_service_1.AuditLogsService])
], SupportCasesService);
//# sourceMappingURL=support-cases.service.js.map