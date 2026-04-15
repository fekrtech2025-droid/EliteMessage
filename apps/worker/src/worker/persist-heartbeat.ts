import { prisma } from '@elite-message/db';
import type { WorkerHeartbeatPayload } from '@elite-message/contracts';

export async function persistWorkerHeartbeat(payload: WorkerHeartbeatPayload) {
  const lastSeenAt = new Date(payload.timestamp);

  await prisma.workerHeartbeat.upsert({
    where: {
      workerId: payload.workerId,
    },
    update: {
      status: payload.status,
      region: payload.region,
      uptimeSeconds: payload.uptimeSeconds,
      activeInstanceCount: payload.activeInstanceCount,
      lastSeenAt,
    },
    create: {
      workerId: payload.workerId,
      status: payload.status,
      region: payload.region,
      uptimeSeconds: payload.uptimeSeconds,
      activeInstanceCount: payload.activeInstanceCount,
      lastSeenAt,
    },
  });
}
