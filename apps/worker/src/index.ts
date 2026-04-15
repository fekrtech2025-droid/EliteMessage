import { randomUUID } from 'node:crypto';
import type { InternalWorkerAssignedInstance } from '@elite-message/contracts';
import { createWorkerLogger } from './logging/logger';
import { loadWorkerEnv } from './config/env';
import { createRedisConnection } from './redis/connection';
import { bootstrapQueues } from './queue/bootstrap';
import { startHealthServer } from './health/server';
import { InternalApiClient } from './internal-api/client';
import type { SessionRuntimeOptions } from './runtime/session-runtime';
import { createSessionRuntime } from './runtime/runtime-factory';
import { buildHeartbeatPayload } from './worker/heartbeat';

async function bootstrap() {
  const env = loadWorkerEnv();
  const logger = createWorkerLogger(env.WORKER_ID);
  const redis = await createRedisConnection(
    env.REDIS_URL,
    env.ENABLE_EXTERNAL_CONNECTIONS,
  );
  const queues = bootstrapQueues(redis);
  const internalApi = new InternalApiClient({
    baseUrl: env.API_BASE_URL,
    internalToken: env.API_INTERNAL_TOKEN,
  });
  const runtimeOptions: SessionRuntimeOptions = {
    internalApi,
    logger,
    workerId: env.WORKER_ID,
  };
  const { runtime, backend: selectedBackend } = createSessionRuntime(
    env,
    runtimeOptions,
  );

  const healthServer = await startHealthServer(env.WORKER_PORT);

  let assignedInstances: InternalWorkerAssignedInstance[] = [];
  let shuttingDown = false;
  const timers: { controlLoop: NodeJS.Timeout | undefined } = {
    controlLoop: undefined,
  };

  const syncAssignments = (
    nextAssignments: InternalWorkerAssignedInstance[],
  ) => {
    const previousIds = new Set(
      assignedInstances.map((instance) => instance.id),
    );
    const nextIds = new Set(nextAssignments.map((instance) => instance.id));

    for (const instance of nextAssignments) {
      if (previousIds.has(instance.id)) {
        continue;
      }

      logger.info(
        {
          correlationId: randomUUID(),
          instanceId: instance.id,
          publicId: instance.publicId,
          status: instance.status,
        },
        'worker.assignment.adopted',
      );
    }

    for (const instance of assignedInstances) {
      if (nextIds.has(instance.id)) {
        continue;
      }

      logger.info(
        {
          correlationId: randomUUID(),
          instanceId: instance.id,
          publicId: instance.publicId,
        },
        'worker.assignment.removed',
      );
      runtime.removeInstance(instance.id);
    }

    assignedInstances = nextAssignments;
    runtime.syncAssignedInstances(nextAssignments);
  };

  const claimAvailableInstances = async (
    currentAssignments: InternalWorkerAssignedInstance[],
  ) => {
    const nextAssignments = [...currentAssignments];

    while (nextAssignments.length < env.WORKER_MAX_AUTO_ASSIGNMENTS) {
      const claimed = await internalApi.claimNextInstance(env.WORKER_ID);
      if (!claimed.assignedInstance) {
        return nextAssignments;
      }

      nextAssignments.push(claimed.assignedInstance);
      logger.info(
        {
          correlationId: randomUUID(),
          instanceId: claimed.assignedInstance.id,
          publicId: claimed.assignedInstance.publicId,
        },
        'worker.assignment.claimed',
      );
    }

    return nextAssignments;
  };

  const syncWorkerState = async () => {
    const payload = buildHeartbeatPayload({
      workerId: env.WORKER_ID,
      status: 'online',
      region: env.WORKER_REGION,
      uptimeSeconds: Math.floor(process.uptime()),
      activeInstanceCount: assignedInstances.length,
      timestamp: new Date().toISOString(),
    });

    if (env.ENABLE_EXTERNAL_CONNECTIONS) {
      try {
        const response = await internalApi.registerWorker(payload);
        const nextAssignments = await claimAvailableInstances(
          response.assignedInstances,
        );
        syncAssignments(nextAssignments);
        await runtime.processAssignments();
      } catch (error) {
        logger.warn(
          {
            correlationId: randomUUID(),
            error: error instanceof Error ? error.message : String(error),
          },
          'worker.internal_api.sync_failed',
        );
      }
    }

    logger.info(payload, 'worker.heartbeat.tick');
  };

  const releaseAssignments = async (reason: string) => {
    const instances = [...assignedInstances];
    for (const instance of instances) {
      try {
        if (env.ENABLE_EXTERNAL_CONNECTIONS) {
          await internalApi.releaseInstance(env.WORKER_ID, {
            instanceId: instance.id,
            reason,
          });
        }

        runtime.removeInstance(instance.id);
        assignedInstances = assignedInstances.filter(
          (item) => item.id !== instance.id,
        );
        logger.info(
          {
            correlationId: randomUUID(),
            instanceId: instance.id,
            publicId: instance.publicId,
          },
          'worker.assignment.released',
        );
      } catch (error) {
        logger.warn(
          {
            correlationId: randomUUID(),
            instanceId: instance.id,
            error: error instanceof Error ? error.message : String(error),
          },
          'worker.assignment.release_failed',
        );
      }
    }
  };

  const shutdown = async (signal: string) => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    if (timers.controlLoop) {
      clearInterval(timers.controlLoop);
    }

    logger.info(
      { signal, correlationId: randomUUID() },
      'worker.shutdown.started',
    );

    await releaseAssignments(`Worker shutdown via ${signal}.`);
    await runtime.stop();
    await Promise.allSettled(
      Object.values(queues).map((queue) => queue.close()),
    );
    await redis.quit().catch(() => {
      redis.disconnect();
    });
    await healthServer.close();

    logger.info(
      { signal, correlationId: randomUUID() },
      'worker.shutdown.completed',
    );
    process.exit(0);
  };

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });

  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });

  await runtime.start();

  logger.info(
    {
      workerId: env.WORKER_ID,
      region: env.WORKER_REGION,
      queues: Object.keys(queues),
      port: healthServer.port,
      sessionBackend: selectedBackend,
    },
    'worker.started',
  );

  logger.info(
    { workerId: env.WORKER_ID, correlationId: randomUUID() },
    'worker.heartbeat.ready',
  );
  await syncWorkerState();

  timers.controlLoop = setInterval(() => {
    void syncWorkerState().catch((error) => {
      logger.warn(
        {
          correlationId: randomUUID(),
          error: error instanceof Error ? error.message : String(error),
        },
        'worker.control_loop.failed',
      );
    });
  }, env.WORKER_CONTROL_LOOP_INTERVAL_MS);

  timers.controlLoop.unref();
}

void bootstrap();
