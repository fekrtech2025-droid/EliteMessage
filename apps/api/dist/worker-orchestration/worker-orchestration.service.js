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
exports.WorkerOrchestrationService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("@elite-message/db");
const presenters_1 = require("../common/presenters");
const realtime_service_1 = require("../realtime/realtime.service");
let WorkerOrchestrationService = class WorkerOrchestrationService {
    realtimeService;
    constructor(realtimeService) {
        this.realtimeService = realtimeService;
    }
    async getAdminOverview() {
        const [counts, users, instances, workers] = await Promise.all([
            Promise.all([
                db_1.prisma.user.count(),
                db_1.prisma.workspace.count(),
                db_1.prisma.instance.count(),
                db_1.prisma.workerHeartbeat.count(),
            ]),
            db_1.prisma.user.findMany({
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
            db_1.prisma.instance.findMany({
                include: {
                    workspace: true,
                    settings: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            db_1.prisma.workerHeartbeat.findMany({
                orderBy: {
                    lastSeenAt: 'desc',
                },
            }),
        ]);
        const workerMap = new Map(workers.map((worker) => [worker.workerId, worker]));
        return {
            counts: {
                users: counts[0],
                workspaces: counts[1],
                instances: counts[2],
                workers: counts[3],
            },
            users: users.map((user) => ({
                ...(0, presenters_1.toAdminUserSummary)({
                    ...user,
                    refreshSessions: [],
                }),
            })),
            instances: instances.map((instance) => (0, presenters_1.toInstanceSummary)(instance, workerMap.get(instance.assignedWorkerId ?? ''))),
            workers: workers.map((worker) => (0, presenters_1.toWorkerHeartbeatRecord)(worker)),
        };
    }
    async listAdminWorkers() {
        const workers = await db_1.prisma.workerHeartbeat.findMany({
            orderBy: {
                lastSeenAt: 'desc',
            },
        });
        return {
            items: workers.map((worker) => (0, presenters_1.toWorkerHeartbeatRecord)(worker)),
        };
    }
    async getAdminWorkerDetail(workerId) {
        const worker = await db_1.prisma.workerHeartbeat.findUnique({
            where: {
                workerId,
            },
        });
        if (!worker) {
            throw new common_1.NotFoundException('Worker not found.');
        }
        const [assignedInstances, recentOperations] = await Promise.all([
            db_1.prisma.instance.findMany({
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
            db_1.prisma.instanceOperation.findMany({
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
            worker: (0, presenters_1.toWorkerHeartbeatRecord)(worker),
            assignedInstances: assignedInstances.map((instance) => (0, presenters_1.toInstanceSummary)(instance)),
            recentOperations: recentOperations.map((operation) => (0, presenters_1.toAdminWorkerOperationSummary)(operation)),
        };
    }
    async registerWorker(payload) {
        const lastSeenAt = new Date(payload.timestamp);
        const assignedCount = await db_1.prisma.instance.count({
            where: {
                assignedWorkerId: payload.workerId,
            },
        });
        const worker = await db_1.prisma.workerHeartbeat.upsert({
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
            worker: (0, presenters_1.toWorkerHeartbeatRecord)(worker),
            assignedInstances: await this.listAssignedInstances(payload.workerId),
        };
    }
    async claimNextInstance(workerId) {
        await this.ensureWorkerExists(workerId);
        for (let attempt = 0; attempt < 3; attempt += 1) {
            const claimedInstanceId = await db_1.prisma.$transaction(async (tx) => {
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
            const assignedInstance = await this.loadAssignedInstanceOrThrow(claimedInstanceId);
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
    async releaseAssignedInstance(workerId, input) {
        await this.ensureWorkerExists(workerId);
        await this.ensureInstanceScaffolding(input.instanceId);
        const existing = await db_1.prisma.instance.findUnique({
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
            throw new common_1.NotFoundException('Instance not found.');
        }
        if (existing.assignedWorkerId !== workerId) {
            throw new common_1.ForbiddenException('This worker is not assigned to the target instance.');
        }
        const now = new Date();
        await db_1.prisma.$transaction(async (tx) => {
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
                    disconnectReason: input.reason?.trim() || 'Worker released the instance.',
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
                    message: input.reason?.trim() || `Worker ${workerId} released the instance.`,
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
        return (0, presenters_1.toInstanceStatusPayload)({
            instanceId: input.instanceId,
            status: 'standby',
            substatus: 'released',
            lastUpdatedAt: now,
        });
    }
    async updateInstanceStatus(instanceId, input) {
        await this.ensureWorkerExists(input.workerId);
        const existing = await db_1.prisma.instance.findUnique({
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
            throw new common_1.NotFoundException('Instance not found.');
        }
        if (existing.assignedWorkerId !== input.workerId) {
            throw new common_1.ForbiddenException('This worker is not assigned to the target instance.');
        }
        const nextSubstatus = input.substatus?.trim() || null;
        const shouldWriteEvent = existing.status !== input.status ||
            existing.substatus !== nextSubstatus ||
            Boolean(input.message?.trim());
        const now = new Date();
        await db_1.prisma.$transaction(async (tx) => {
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
                    message: input.message?.trim() ||
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
        return (0, presenters_1.toInstanceStatusPayload)({
            instanceId,
            status: input.status,
            substatus: nextSubstatus,
            lastUpdatedAt: now,
        });
    }
    async updateInstanceRuntime(instanceId, input) {
        await this.ensureWorkerExists(input.workerId);
        await this.ensureInstanceScaffolding(instanceId);
        const instance = await db_1.prisma.instance.findUnique({
            where: {
                id: instanceId,
            },
            select: {
                publicId: true,
                assignedWorkerId: true,
            },
        });
        if (!instance) {
            throw new common_1.NotFoundException('Instance not found.');
        }
        if (instance.assignedWorkerId !== input.workerId) {
            throw new common_1.ForbiddenException('This worker is not assigned to the target instance.');
        }
        const updateData = {};
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
        const runtimeState = await db_1.prisma.instanceRuntimeState.update({
            where: {
                instanceId,
            },
            data: updateData,
        });
        if (Object.prototype.hasOwnProperty.call(input, 'qrCode') ||
            Object.prototype.hasOwnProperty.call(input, 'qrExpiresAt')) {
            this.realtimeService.publishInstanceQrUpdated({
                instanceId,
                publicId: instance.publicId,
                qrCode: runtimeState.qrCode ?? null,
                qrExpiresAt: runtimeState.qrExpiresAt?.toISOString() ?? null,
            });
        }
        else {
            this.realtimeService.publishInstanceRuntimeUpdated({
                instanceId,
                publicId: instance.publicId,
                currentSessionLabel: runtimeState.currentSessionLabel ?? null,
                disconnectReason: runtimeState.disconnectReason ?? null,
            });
        }
        return (0, presenters_1.toInstanceRuntimeView)(runtimeState);
    }
    async updateInstanceOperationStatus(instanceId, operationId, input) {
        await this.ensureWorkerExists(input.workerId);
        const instance = await db_1.prisma.instance.findUnique({
            where: {
                id: instanceId,
            },
            select: {
                publicId: true,
                assignedWorkerId: true,
            },
        });
        if (!instance) {
            throw new common_1.NotFoundException('Instance not found.');
        }
        if (instance.assignedWorkerId !== input.workerId) {
            throw new common_1.ForbiddenException('This worker is not assigned to the target instance.');
        }
        const operation = await db_1.prisma.instanceOperation.findFirst({
            where: {
                id: operationId,
                instanceId,
            },
        });
        if (!operation) {
            throw new common_1.NotFoundException('Instance operation not found.');
        }
        const now = new Date();
        const updatedOperation = await db_1.prisma.$transaction(async (tx) => {
            const nextOperation = await tx.instanceOperation.update({
                where: {
                    id: operationId,
                },
                data: {
                    status: input.status,
                    message: input.message ?? operation.message,
                    errorMessage: input.errorMessage ??
                        (input.status === 'failed' ? operation.errorMessage : null),
                    startedAt: input.status === 'running'
                        ? (operation.startedAt ?? now)
                        : operation.startedAt,
                    completedAt: input.status === 'completed' ||
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
                        eventType: input.status === 'completed'
                            ? 'action_completed'
                            : 'action_failed',
                        actorType: 'worker',
                        actorId: input.workerId,
                        message: input.message ??
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
        return (0, presenters_1.toInstanceOperationSummary)(updatedOperation);
    }
    async ensureWorkerExists(workerId) {
        const worker = await db_1.prisma.workerHeartbeat.findUnique({
            where: {
                workerId,
            },
        });
        if (!worker) {
            throw new common_1.NotFoundException('Worker not registered.');
        }
        return worker;
    }
    async ensureInstanceScaffolding(instanceId) {
        await db_1.prisma.$transaction(async (tx) => {
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
    async refreshWorkerActivity(workerId) {
        const assignedCount = await db_1.prisma.instance.count({
            where: {
                assignedWorkerId: workerId,
            },
        });
        await db_1.prisma.workerHeartbeat.update({
            where: {
                workerId,
            },
            data: {
                activeInstanceCount: assignedCount,
                lastSeenAt: new Date(),
            },
        });
    }
    async listAssignedInstances(workerId) {
        const instances = await db_1.prisma.instance.findMany({
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
            await Promise.all(missingRuntimeIds.map((instanceId) => this.ensureInstanceScaffolding(instanceId)));
            return this.listAssignedInstances(workerId);
        }
        return instances.map((instance) => ({
            id: instance.id,
            publicId: instance.publicId,
            name: instance.name,
            status: instance.status,
            substatus: instance.substatus ?? null,
            runtime: (0, presenters_1.toInstanceRuntimeView)(instance.runtimeState),
            pendingOperation: instance.operations[0]
                ? (0, presenters_1.toInstanceOperationSummary)(instance.operations[0])
                : null,
        }));
    }
    async loadAssignedInstanceOrThrow(instanceId) {
        await this.ensureInstanceScaffolding(instanceId);
        const instance = await db_1.prisma.instance.findUnique({
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
            throw new common_1.NotFoundException('Assigned instance could not be loaded.');
        }
        return {
            id: instance.id,
            publicId: instance.publicId,
            name: instance.name,
            status: instance.status,
            substatus: instance.substatus ?? null,
            runtime: (0, presenters_1.toInstanceRuntimeView)(instance.runtimeState),
            pendingOperation: instance.operations[0]
                ? (0, presenters_1.toInstanceOperationSummary)(instance.operations[0])
                : null,
        };
    }
};
exports.WorkerOrchestrationService = WorkerOrchestrationService;
exports.WorkerOrchestrationService = WorkerOrchestrationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [realtime_service_1.RealtimeService])
], WorkerOrchestrationService);
//# sourceMappingURL=worker-orchestration.service.js.map