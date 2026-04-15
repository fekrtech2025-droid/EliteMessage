import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  AuditActorType,
  AuditEntityType,
  ListAuditLogsResponse,
} from '@elite-message/contracts';
import { Prisma, prisma } from '@elite-message/db';
import { toAuditLogSummary } from '../common/presenters';
import { requestContext } from '../common/request-context';

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
} as const;

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

function toNullableJsonInput(
  value: unknown,
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return Prisma.JsonNull;
  }

  return value as Prisma.InputJsonValue;
}

function buildAuditMetadata(value: unknown, requestId?: string) {
  if (!requestId && value === undefined) {
    return undefined;
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return {
      ...(value as Record<string, unknown>),
      ...(requestId ? { requestId } : {}),
    };
  }

  return {
    value: value ?? null,
    ...(requestId ? { requestId } : {}),
  };
}

@Injectable()
export class AuditLogsService {
  async record(input: RecordAuditLogInput) {
    return this.recordWithClient(prisma, input);
  }

  async recordWithClient(
    client: AuditDatabaseClient,
    input: RecordAuditLogInput,
  ) {
    const requestId = requestContext.getStore()?.requestId;
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

  async listAccountAuditLogs(
    userId: string,
    filters: AccountAuditFilters,
  ): Promise<ListAuditLogsResponse> {
    const memberships = await prisma.membership.findMany({
      where: {
        userId,
      },
      select: {
        workspaceId: true,
      },
    });

    const workspaceIds = memberships.map(
      (membership) => membership.workspaceId,
    );
    if (workspaceIds.length === 0) {
      return { items: [] };
    }

    if (filters.workspaceId && !workspaceIds.includes(filters.workspaceId)) {
      throw new NotFoundException(
        'Workspace not found or not accessible by this user.',
      );
    }

    const logs = await prisma.auditLog.findMany({
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
      items: logs.map((log) => toAuditLogSummary(log)),
    };
  }

  async listAdminAuditLogs(
    filters: AdminAuditFilters,
  ): Promise<ListAuditLogsResponse> {
    const logs = await prisma.auditLog.findMany({
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
      items: logs.map((log) => toAuditLogSummary(log)),
    };
  }
}
