import { randomBytes } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateSupportCaseRequest,
  ListSupportCasesResponse,
  SupportCasePriority,
  SupportCaseResponse,
  SupportCaseStatus,
  UpdateSupportCaseRequest,
} from '@elite-message/contracts';
import { prisma } from '@elite-message/db';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { toSupportCaseSummary } from '../common/presenters';

type ListSupportCasesFilters = {
  status?: SupportCaseStatus;
  priority?: SupportCasePriority;
  workspaceId?: string;
  assignedAdminUserId?: string;
  limit: number;
};

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
} as const;

function createSupportCasePublicId() {
  return `SUP-${randomBytes(4).toString('hex').toUpperCase()}`;
}

@Injectable()
export class SupportCasesService {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  async listSupportCases(
    filters: ListSupportCasesFilters,
  ): Promise<ListSupportCasesResponse> {
    const items = await prisma.supportCase.findMany({
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
      items: items.map((item) => toSupportCaseSummary(item)),
    };
  }

  async createSupportCase(
    adminUserId: string,
    input: CreateSupportCaseRequest,
  ): Promise<SupportCaseResponse> {
    const resolvedReferences = await this.resolveCaseReferences(input);

    const created = await prisma.$transaction(async (tx) => {
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
      case: toSupportCaseSummary(created),
    };
  }

  async updateSupportCase(
    adminUserId: string,
    caseId: string,
    input: UpdateSupportCaseRequest,
  ): Promise<SupportCaseResponse> {
    const existing = await prisma.supportCase.findUnique({
      where: {
        id: caseId,
      },
      include: supportCaseInclude,
    });

    if (!existing) {
      throw new NotFoundException('Support case not found.');
    }

    if (Object.prototype.hasOwnProperty.call(input, 'assignedAdminUserId')) {
      await this.ensureAdminUser(input.assignedAdminUserId ?? null);
    }

    const now = new Date();
    const nextStatus = input.status ?? existing.status;
    const nextResolvedAt =
      nextStatus === 'resolved' || nextStatus === 'closed'
        ? (existing.resolvedAt ?? now)
        : input.status
          ? null
          : existing.resolvedAt;

    const updated = await prisma.$transaction(async (tx) => {
      const caseRecord = await tx.supportCase.update({
        where: {
          id: caseId,
        },
        data: {
          status: nextStatus,
          priority: input.priority ?? existing.priority,
          assignedAdminUserId: Object.prototype.hasOwnProperty.call(
            input,
            'assignedAdminUserId',
          )
            ? (input.assignedAdminUserId ?? null)
            : existing.assignedAdminUserId,
          internalNotes: Object.prototype.hasOwnProperty.call(
            input,
            'internalNotes',
          )
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
          assignedAdminUserId: Object.prototype.hasOwnProperty.call(
            input,
            'assignedAdminUserId',
          )
            ? (input.assignedAdminUserId ?? null)
            : existing.assignedAdminUserId,
        },
      });

      return caseRecord;
    });

    return {
      case: toSupportCaseSummary(updated),
    };
  }

  private async resolveCaseReferences(input: CreateSupportCaseRequest) {
    let workspaceId = input.workspaceId ?? null;
    let instanceId = input.instanceId ?? null;
    const requesterUserId = input.requesterUserId ?? null;
    const assignedAdminUserId = input.assignedAdminUserId ?? null;

    if (instanceId) {
      const instance = await prisma.instance.findUnique({
        where: {
          id: instanceId,
        },
        select: {
          id: true,
          workspaceId: true,
        },
      });

      if (!instance) {
        throw new NotFoundException('Referenced instance was not found.');
      }

      if (workspaceId && workspaceId !== instance.workspaceId) {
        throw new BadRequestException(
          'The selected instance does not belong to the selected workspace.',
        );
      }

      workspaceId = instance.workspaceId;
      instanceId = instance.id;
    }

    if (workspaceId) {
      const workspace = await prisma.workspace.findUnique({
        where: {
          id: workspaceId,
        },
        select: {
          id: true,
        },
      });

      if (!workspace) {
        throw new NotFoundException('Referenced workspace was not found.');
      }
    }

    if (requesterUserId) {
      const requester = await prisma.user.findUnique({
        where: {
          id: requesterUserId,
        },
        select: {
          id: true,
        },
      });

      if (!requester) {
        throw new NotFoundException('Referenced requester user was not found.');
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

  private async ensureAdminUser(userId: string | null) {
    if (!userId) {
      return;
    }

    const adminUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!adminUser) {
      throw new NotFoundException('Assigned admin user was not found.');
    }

    if (adminUser.role !== 'platform_admin') {
      throw new BadRequestException(
        'Support cases can only be assigned to platform admin users.',
      );
    }
  }
}
