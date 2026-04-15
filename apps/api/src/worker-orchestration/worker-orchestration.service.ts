import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  AdminWorkerDetailResponse,
  AdminOverviewResponse,
  InstanceStatusPayload,
  InternalClaimNextInstanceResponse,
  InternalReleaseInstanceRequest,
  InternalUpdateInstanceOperationRequest,
  InternalUpdateInstanceRuntimeRequest,
  InternalUpdateInstanceStatusRequest,
  InternalWorkerAssignedInstance,
  InternalWorkerRegisterResponse,
  ListAdminWorkersResponse,
  WorkerHeartbeatPayload,
} from '@elite-message/contracts';
import { prisma } from '@elite-message/db';
import {
  toAdminUserSummary,
  toAdminWorkerOperationSummary,
  toInstanceOperationSummary,
  toInstanceRuntimeView,
  toInstanceStatusPayload,
  toInstanceSummary,
  toWorkerHeartbeatRecord,
} from '../common/presenters';
import { RealtimeService } from '../realtime/realtime.service';

@Injectable()
export class WorkerOrchestrationService {
  constructor(private readonly realtimeService: RealtimeService) {}

  async getAdminOverview(): Promise<AdminOverviewResponse> {
    const [counts, users, instances, workers] = await Promise.all([
      Promise.all([
        prisma.user.count(),
        prisma.workspace.count(),
        prisma.instance.count(),
        prisma.workerHeartbeat.count(),
      ]),
      prisma.user.findMany({
        include: {
          _count: {
            select: {
              memberships: true,
              createdInstances: true,
              refreshSessions: {
                where: {
                  revokedAt: null,
                  expiresAt: {
                    gt: new Date(),
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),
      prisma.instance.findMany({
        include: {
          workspace: true,
          settings: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.workerHeartbeat.findMany({
        orderBy: {
          lastSeenAt: 'desc',
        },
      }),
    ]);

    const workerMap = new Map(
      workers.map((worker) => [worker.workerId, worker]),
    );

    return {
      counts: {
        users: counts[0],
        workspaces: counts[1],
        instances: counts[2],
        workers: counts[3],
      },
      users: users.map((user) => ({
        ...toAdminUserSummary({
          ...user,
          refreshSessions: [],
        }),
      })),
      instances: instances.map((instance) =>
        toInstanceSummary(
          instance,
          workerMap.get(instance.assignedWorkerId ?? ''),
        ),
      ),
      workers: workers.map((worker) => toWorkerHeartbeatRecord(worker)),
    };
  }

  async listAdminWorkers(): Promise<ListAdminWorkersResponse> {
    const workers = await prisma.workerHeartbeat.findMany({
      orderBy: {
        lastSeenAt: 'desc',
      },
    });

    return {
      items: workers.map((worker) => toWorkerHeartbeatRecord(worker)),
    };
  }

  async getAdminWorkerDetail(
    workerId: string,
  ): Promise<AdminWorkerDetailResponse> {
    const worker = await prisma.workerHeartbeat.findUnique({
      where: {
        workerId,
      },
    });

    if (!worker) {
      throw new NotFoundException('Worker not found.');
    }

    const [assignedInstances, recentOperations] = await Promise.all([
      prisma.instance.findMany({
        where: {
          assignedWorkerId: workerId,
        },
        include: {
          workspace: true,
          settings: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),
      prisma.instanceOperation.findMany({
        where: {
          OR: [
            {
              targetWorkerId: workerId,
            },
            {
              instance: {
                assignedWorkerId: workerId,
              },
            },
          ],
        },
        include: {
          instance: {
            select: {
              id: true,
              publicId: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 20,
      }),
    ]);

    return {
      worker: toWorkerHeartbeatRecord(worker),
      assignedInstances: assignedInstances.map((instance) =>
        toInstanceSummary(instance),
      ),
      recentOperations: recentOperations.map((operation) =>
        toAdminWorkerOperationSummary(operation),
      ),
    };
  }

  async registerWorker(
    payload: WorkerHeartbeatPayload,
  ): Promise<InternalWorkerRegisterResponse> {
    const lastSeenAt = new Date(payload.timestamp);
    const assignedCount = await prisma.instance.count({
      where: {
        assignedWorkerId: payload.workerId,
      },
    });

    const worker = await prisma.workerHeartbeat.upsert({
      where: {
        workerId: payload.workerId,
      },
      update: {
        status: payload.status,
        region: payload.region,
        uptimeSeconds: payload.uptimeSeconds,
        activeInstanceCount: assignedCount,
        lastSeenAt,
      },
      create: {
        workerId: payload.workerId,
        status: payload.status,
        region: payload.region,
        uptimeSeconds: payload.uptimeSeconds,
        activeInstanceCount: assignedCount,
        lastSeenAt,
      },
    });

    this.realtimeService.publishWorkerHealthUpdated({
      workerId: payload.workerId,
    });

    return {
      worker: toWorkerHeartbeatRecord(worker),
      assignedInstances: await this.listAssignedInstances(payload.workerId),
    };
  }

  async claimNextInstance(
    workerId: string,
  ): Promise<InternalClaimNextInstanceResponse> {
    await this.ensureWorkerExists(workerId);

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const claimedInstanceId = await prisma.$transaction(async (tx) => {
        const candidateOperation = await tx.instanceOperation.findFirst({
          where: {
            status: {
              in: ['pending', 'running'],
            },
            instance: {
              assignedWorkerId: null,
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
          select: {
            instanceId: true,
          },
        });

        if (!candidateOperation) {
          return null;
        }

        await tx.instanceRuntimeState.upsert({
          where: {
            instanceId: candidateOperation.instanceId,
          },
          update: {},
          create: {
            instanceId: candidateOperation.instanceId,
          },
        });

        const now = new Date();
        const claimed = await tx.instance.updateMany({
          where: {
            id: candidateOperation.instanceId,
            assignedWorkerId: null,
          },
          data: {
            assignedWorkerId: workerId,
            lastHeartbeatAt: now,
            lastLifecycleEventAt: now,
            substatus: 'worker_claimed',
          },
        });

        if (claimed.count !== 1) {
          return null;
        }

        await tx.instanceLifecycleEvent.create({
          data: {
            instanceId: candidateOperation.instanceId,
            eventType: 'worker_assigned',
            actorType: 'worker',
            actorId: workerId,
            message: `Worker ${workerId} claimed the instance.`,
            metadata: {
              workerId,
            },
          },
        });

        return candidateOperation.instanceId;
      });

      if (!claimedInstanceId) {
        continue;
      }

      await this.refreshWorkerActivity(workerId);
      const assignedInstance =
        await this.loadAssignedInstanceOrThrow(claimedInstanceId);

      this.realtimeService.publishInstanceLifecycleUpdated({
        instanceId: claimedInstanceId,
        publicId: assignedInstance.publicId,
      });
      this.realtimeService.publishWorkerHealthUpdated({
        workerId,
      });

      return { assignedInstance };
    }

    await this.refreshWorkerActivity(workerId);
    return { assignedInstance: null };
  }

  async releaseAssignedInstance(
    workerId: string,
    input: InternalReleaseInstanceRequest,
  ): Promise<InstanceStatusPayload> {
    await this.ensureWorkerExists(workerId);
    await this.ensureInstanceScaffolding(input.instanceId);

    const existing = await prisma.instance.findUnique({
      where: {
        id: input.instanceId,
      },
      select: {
        id: true,
        publicId: true,
        status: true,
        assignedWorkerId: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Instance not found.');
    }

    if (existing.assignedWorkerId !== workerId) {
      throw new ForbiddenException(
        'This worker is not assigned to the target instance.',
      );
    }

    const now = new Date();
    await prisma.$transaction(async (tx) => {
      await tx.instance.update({
        where: {
          id: input.instanceId,
        },
        data: {
          assignedWorkerId: null,
          status: 'standby',
          substatus: 'released',
          lastHeartbeatAt: now,
          lastLifecycleEventAt: now,
        },
      });

      await tx.instanceRuntimeState.update({
        where: {
          instanceId: input.instanceId,
        },
        data: {
          qrCode: null,
          qrExpiresAt: null,
          currentSessionLabel: null,
          disconnectReason:
            input.reason?.trim() || 'Worker released the instance.',
          lastDisconnectedAt: now,
        },
      });

      await tx.outboundMessage.updateMany({
        where: {
          instanceId: input.instanceId,
          status: 'queue',
          processingWorkerId: workerId,
        },
        data: {
          processingWorkerId: null,
          processingStartedAt: null,
        },
      });

      await tx.instanceLifecycleEvent.create({
        data: {
          instanceId: input.instanceId,
          eventType: 'worker_released',
          actorType: 'worker',
          actorId: workerId,
          message:
            input.reason?.trim() || `Worker ${workerId} released the instance.`,
          fromStatus: existing.status,
          toStatus: 'standby',
          metadata: {
            workerId,
            reason: input.reason?.trim() || null,
          },
        },
      });
    });

    await this.refreshWorkerActivity(workerId);

    this.realtimeService.publishInstanceStatusChanged({
      instanceId: input.instanceId,
      status: 'standby',
      substatus: 'released',
      lastUpdatedAt: now.toISOString(),
      publicId: existing.publicId,
    });
    this.realtimeService.publishInstanceRuntimeUpdated({
      instanceId: input.instanceId,
      publicId: existing.publicId,
      currentSessionLabel: null,
      disconnectReason: input.reason?.trim() || 'Worker released the instance.',
    });
    this.realtimeService.publishInstanceLifecycleUpdated({
      instanceId: input.instanceId,
      publicId: existing.publicId,
    });
    this.realtimeService.publishWorkerHealthUpdated({
      workerId,
    });

    return toInstanceStatusPayload({
      instanceId: input.instanceId,
      status: 'standby',
      substatus: 'released',
      lastUpdatedAt: now,
    });
  }

  async updateInstanceStatus(
    instanceId: string,
    input: InternalUpdateInstanceStatusRequest,
  ): Promise<InstanceStatusPayload> {
    await this.ensureWorkerExists(input.workerId);

    const existing = await prisma.instance.findUnique({
      where: {
        id: instanceId,
      },
      select: {
        id: true,
        publicId: true,
        status: true,
        substatus: true,
        assignedWorkerId: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Instance not found.');
    }

    if (existing.assignedWorkerId !== input.workerId) {
      throw new ForbiddenException(
        'This worker is not assigned to the target instance.',
      );
    }

    const nextSubstatus = input.substatus?.trim() || null;
    const shouldWriteEvent =
      existing.status !== input.status ||
      existing.substatus !== nextSubstatus ||
      Boolean(input.message?.trim());
    const now = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.instance.update({
        where: {
          id: instanceId,
        },
        data: {
          status: input.status,
          substatus: nextSubstatus,
          lastHeartbeatAt: now,
          lastLifecycleEventAt: shouldWriteEvent ? now : undefined,
        },
      });

      if (!shouldWriteEvent) {
        return;
      }

      await tx.instanceLifecycleEvent.create({
        data: {
          instanceId,
          eventType: 'status_changed',
          actorType: 'worker',
          actorId: input.workerId,
          message:
            input.message?.trim() ||
            `Worker ${input.workerId} updated the instance status.`,
          fromStatus: existing.status,
          toStatus: input.status,
          metadata: {
            workerId: input.workerId,
            substatus: nextSubstatus,
          },
        },
      });
    });

    this.realtimeService.publishInstanceStatusChanged({
      instanceId,
      status: input.status,
      substatus: nextSubstatus,
      lastUpdatedAt: now.toISOString(),
      publicId: existing.publicId,
    });
    if (shouldWriteEvent) {
      this.realtimeService.publishInstanceLifecycleUpdated({
        instanceId,
        publicId: existing.publicId,
      });
    }

    return toInstanceStatusPayload({
      instanceId,
      status: input.status,
      substatus: nextSubstatus,
      lastUpdatedAt: now,
    });
  }

  async updateInstanceRuntime(
    instanceId: string,
    input: InternalUpdateInstanceRuntimeRequest,
  ) {
    await this.ensureWorkerExists(input.workerId);
    await this.ensureInstanceScaffolding(instanceId);

    const instance = await prisma.instance.findUnique({
      where: {
        id: instanceId,
      },
      select: {
        publicId: true,
        assignedWorkerId: true,
      },
    });

    if (!instance) {
      throw new NotFoundException('Instance not found.');
    }

    if (instance.assignedWorkerId !== input.workerId) {
      throw new ForbiddenException(
        'This worker is not assigned to the target instance.',
      );
    }

    const updateData: Record<string, Date | string | null | unknown> = {};

    if (Object.prototype.hasOwnProperty.call(input, 'qrCode')) {
      updateData.qrCode = input.qrCode ?? null;
    }

    if (Object.prototype.hasOwnProperty.call(input, 'qrExpiresAt')) {
      updateData.qrExpiresAt = input.qrExpiresAt
        ? new Date(input.qrExpiresAt)
        : null;
    }

    if (Object.prototype.hasOwnProperty.call(input, 'currentSessionLabel')) {
      updateData.currentSessionLabel = input.currentSessionLabel ?? null;
    }

    if (Object.prototype.hasOwnProperty.call(input, 'sessionBackend')) {
      updateData.sessionBackend = input.sessionBackend ?? 'placeholder';
    }

    if (Object.prototype.hasOwnProperty.call(input, 'sessionDiagnostics')) {
      updateData.sessionDiagnostics = input.sessionDiagnostics ?? null;
    }

    if (Object.prototype.hasOwnProperty.call(input, 'lastStartedAt')) {
      updateData.lastStartedAt = input.lastStartedAt
        ? new Date(input.lastStartedAt)
        : null;
    }

    if (Object.prototype.hasOwnProperty.call(input, 'lastAuthenticatedAt')) {
      updateData.lastAuthenticatedAt = input.lastAuthenticatedAt
        ? new Date(input.lastAuthenticatedAt)
        : null;
    }

    if (Object.prototype.hasOwnProperty.call(input, 'lastDisconnectedAt')) {
      updateData.lastDisconnectedAt = input.lastDisconnectedAt
        ? new Date(input.lastDisconnectedAt)
        : null;
    }

    if (Object.prototype.hasOwnProperty.call(input, 'lastInboundMessageAt')) {
      updateData.lastInboundMessageAt = input.lastInboundMessageAt
        ? new Date(input.lastInboundMessageAt)
        : null;
    }

    if (Object.prototype.hasOwnProperty.call(input, 'lastScreenshotAt')) {
      updateData.lastScreenshotAt = input.lastScreenshotAt
        ? new Date(input.lastScreenshotAt)
        : null;
    }

    if (Object.prototype.hasOwnProperty.call(input, 'lastScreenshotPath')) {
      updateData.lastScreenshotPath = input.lastScreenshotPath ?? null;
    }

    if (Object.prototype.hasOwnProperty.call(input, 'disconnectReason')) {
      updateData.disconnectReason = input.disconnectReason ?? null;
    }

    const runtimeState = await prisma.instanceRuntimeState.update({
      where: {
        instanceId,
      },
      data: updateData,
    });

    if (
      Object.prototype.hasOwnProperty.call(input, 'qrCode') ||
      Object.prototype.hasOwnProperty.call(input, 'qrExpiresAt')
    ) {
      this.realtimeService.publishInstanceQrUpdated({
        instanceId,
        publicId: instance.publicId,
        qrCode: runtimeState.qrCode ?? null,
        qrExpiresAt: runtimeState.qrExpiresAt?.toISOString() ?? null,
      });
    } else {
      this.realtimeService.publishInstanceRuntimeUpdated({
        instanceId,
        publicId: instance.publicId,
        currentSessionLabel: runtimeState.currentSessionLabel ?? null,
        disconnectReason: runtimeState.disconnectReason ?? null,
      });
    }

    return toInstanceRuntimeView(runtimeState);
  }

  async updateInstanceOperationStatus(
    instanceId: string,
    operationId: string,
    input: InternalUpdateInstanceOperationRequest,
  ) {
    await this.ensureWorkerExists(input.workerId);

    const instance = await prisma.instance.findUnique({
      where: {
        id: instanceId,
      },
      select: {
        publicId: true,
        assignedWorkerId: true,
      },
    });

    if (!instance) {
      throw new NotFoundException('Instance not found.');
    }

    if (instance.assignedWorkerId !== input.workerId) {
      throw new ForbiddenException(
        'This worker is not assigned to the target instance.',
      );
    }

    const operation = await prisma.instanceOperation.findFirst({
      where: {
        id: operationId,
        instanceId,
      },
    });

    if (!operation) {
      throw new NotFoundException('Instance operation not found.');
    }

    const now = new Date();
    const updatedOperation = await prisma.$transaction(async (tx) => {
      const nextOperation = await tx.instanceOperation.update({
        where: {
          id: operationId,
        },
        data: {
          status: input.status,
          message: input.message ?? operation.message,
          errorMessage:
            input.errorMessage ??
            (input.status === 'failed' ? operation.errorMessage : null),
          startedAt:
            input.status === 'running'
              ? (operation.startedAt ?? now)
              : operation.startedAt,
          completedAt:
            input.status === 'completed' ||
            input.status === 'failed' ||
            input.status === 'cancelled'
              ? now
              : operation.completedAt,
        },
      });

      if (input.status === 'completed' || input.status === 'failed') {
        await tx.instance.update({
          where: {
            id: instanceId,
          },
          data: {
            lastLifecycleEventAt: now,
          },
        });

        await tx.instanceLifecycleEvent.create({
          data: {
            instanceId,
            eventType:
              input.status === 'completed'
                ? 'action_completed'
                : 'action_failed',
            actorType: 'worker',
            actorId: input.workerId,
            message:
              input.message ??
              `${operation.operationType} action ${input.status === 'completed' ? 'completed' : 'failed'} by worker ${input.workerId}.`,
            metadata: {
              workerId: input.workerId,
              action: operation.operationType,
              errorMessage: input.errorMessage ?? null,
            },
          },
        });
      }

      return nextOperation;
    });

    this.realtimeService.publishInstanceOperationUpdated({
      instanceId,
      publicId: instance.publicId,
      operationId: updatedOperation.id,
      status: updatedOperation.status,
    });

    if (input.status === 'completed' || input.status === 'failed') {
      this.realtimeService.publishInstanceLifecycleUpdated({
        instanceId,
        publicId: instance.publicId,
      });
    }

    return toInstanceOperationSummary(updatedOperation);
  }

  private async ensureWorkerExists(workerId: string) {
    const worker = await prisma.workerHeartbeat.findUnique({
      where: {
        workerId,
      },
    });

    if (!worker) {
      throw new NotFoundException('Worker not registered.');
    }

    return worker;
  }

  private async ensureInstanceScaffolding(instanceId: string) {
    await prisma.$transaction(async (tx) => {
      await tx.instanceSettings.upsert({
        where: {
          instanceId,
        },
        update: {},
        create: {
          instanceId,
        },
      });

      await tx.instanceRuntimeState.upsert({
        where: {
          instanceId,
        },
        update: {},
        create: {
          instanceId,
        },
      });
    });
  }

  private async refreshWorkerActivity(workerId: string) {
    const assignedCount = await prisma.instance.count({
      where: {
        assignedWorkerId: workerId,
      },
    });

    await prisma.workerHeartbeat.update({
      where: {
        workerId,
      },
      data: {
        activeInstanceCount: assignedCount,
        lastSeenAt: new Date(),
      },
    });
  }

  private async listAssignedInstances(
    workerId: string,
  ): Promise<InternalWorkerAssignedInstance[]> {
    const instances = await prisma.instance.findMany({
      where: {
        assignedWorkerId: workerId,
      },
      include: {
        runtimeState: true,
        operations: {
          where: {
            status: {
              in: ['pending', 'running'],
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const missingRuntimeIds = instances
      .filter((instance) => !instance.runtimeState)
      .map((instance) => instance.id);
    if (missingRuntimeIds.length > 0) {
      await Promise.all(
        missingRuntimeIds.map((instanceId) =>
          this.ensureInstanceScaffolding(instanceId),
        ),
      );
      return this.listAssignedInstances(workerId);
    }

    return instances.map((instance) => ({
      id: instance.id,
      publicId: instance.publicId,
      name: instance.name,
      status: instance.status,
      substatus: instance.substatus ?? null,
      runtime: toInstanceRuntimeView(
        instance.runtimeState as NonNullable<
          (typeof instances)[number]['runtimeState']
        >,
      ),
      pendingOperation: instance.operations[0]
        ? toInstanceOperationSummary(instance.operations[0])
        : null,
    }));
  }

  private async loadAssignedInstanceOrThrow(
    instanceId: string,
  ): Promise<InternalWorkerAssignedInstance> {
    await this.ensureInstanceScaffolding(instanceId);

    const instance = await prisma.instance.findUnique({
      where: {
        id: instanceId,
      },
      include: {
        runtimeState: true,
        operations: {
          where: {
            status: {
              in: ['pending', 'running'],
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
          take: 1,
        },
      },
    });

    if (!instance || !instance.runtimeState) {
      throw new NotFoundException('Assigned instance could not be loaded.');
    }

    return {
      id: instance.id,
      publicId: instance.publicId,
      name: instance.name,
      status: instance.status,
      substatus: instance.substatus ?? null,
      runtime: toInstanceRuntimeView(instance.runtimeState),
      pendingOperation: instance.operations[0]
        ? toInstanceOperationSummary(instance.operations[0])
        : null,
    };
  }
}
