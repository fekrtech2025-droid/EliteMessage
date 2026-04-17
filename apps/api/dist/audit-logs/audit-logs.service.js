"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogsService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("@elite-message/db");
const presenters_1 = require("../common/presenters");
const request_context_1 = require("../common/request-context");
const auditLogInclude = {
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
};
function toNullableJsonInput(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return db_1.Prisma.JsonNull;
    }
    return value;
}
function buildAuditMetadata(value, requestId) {
    if (!requestId && value === undefined) {
        return undefined;
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return {
            ...value,
            ...(requestId ? { requestId } : {}),
        };
    }
    return {
        value: value ?? null,
        ...(requestId ? { requestId } : {}),
    };
}
let AuditLogsService = class AuditLogsService {
    async record(input) {
        return this.recordWithClient(db_1.prisma, input);
    }
    async recordWithClient(client, input) {
        const requestId = request_context_1.requestContext.getStore()?.requestId;
        const metadata = buildAuditMetadata(input.metadata, requestId);
        return client.auditLog.create({
            data: {
                workspaceId: input.workspaceId ?? null,
                instanceId: input.instanceId ?? null,
                actorType: input.actorType,
                actorId: input.actorId ?? null,
                entityType: input.entityType,
                entityId: input.entityId ?? null,
                action: input.action,
                summary: input.summary,
                metadata: toNullableJsonInput(metadata),
            },
        });
    }
    async listAccountAuditLogs(userId, filters) {
        const memberships = await db_1.prisma.membership.findMany({
            where: {
                userId,
            },
            select: {
                workspaceId: true,
            },
        });
        const workspaceIds = memberships.map((membership) => membership.workspaceId);
        if (workspaceIds.length === 0) {
            return { items: [] };
        }
        if (filters.workspaceId && !workspaceIds.includes(filters.workspaceId)) {
            throw new common_1.NotFoundException('Workspace not found or not accessible by this user.');
        }
        const logs = await db_1.prisma.auditLog.findMany({
            where: {
                workspaceId: filters.workspaceId
                    ? filters.workspaceId
                    : {
                        in: workspaceIds,
                    },
                instanceId: filters.instanceId,
                action: filters.action
                    ? {
                        contains: filters.action,
                        mode: 'insensitive',
                    }
                    : undefined,
                entityType: filters.entityType,
            },
            include: auditLogInclude,
            orderBy: {
                createdAt: 'desc',
            },
            take: filters.limit,
        });
        return {
            items: logs.map((log) => (0, presenters_1.toAuditLogSummary)(log)),
        };
    }
    async listAdminAuditLogs(filters) {
        const logs = await db_1.prisma.auditLog.findMany({
            where: {
                workspaceId: filters.workspaceId,
                instanceId: filters.instanceId,
                actorType: filters.actorType,
                entityType: filters.entityType,
                action: filters.action
                    ? {
                        contains: filters.action,
                        mode: 'insensitive',
                    }
                    : undefined,
            },
            include: auditLogInclude,
            orderBy: {
                createdAt: 'desc',
            },
            take: filters.limit,
        });
        return {
            items: logs.map((log) => (0, presenters_1.toAuditLogSummary)(log)),
        };
    }
};
exports.AuditLogsService = AuditLogsService;
exports.AuditLogsService = AuditLogsService = __decorate([
    (0, common_1.Injectable)()
], AuditLogsService);
//# sourceMappingURL=audit-logs.service.js.map