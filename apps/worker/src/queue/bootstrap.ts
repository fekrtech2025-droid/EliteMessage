import { Queue } from 'bullmq';
import { queueNames } from '@elite-message/contracts';
import type Redis from 'ioredis';

export function bootstrapQueues(connection: Redis) {
  return {
    instanceLifecycleQueue: new Queue(queueNames.instanceLifecycle, {
      connection,
    }),
    instanceRecoveryQueue: new Queue(queueNames.instanceRecovery, {
      connection,
    }),
    outboundSendQueue: new Queue(queueNames.outboundSend, { connection }),
    webhookDeliveryQueue: new Queue(queueNames.webhookDelivery, { connection }),
    adminOperationsQueue: new Queue(queueNames.adminOperations, { connection }),
  };
}
