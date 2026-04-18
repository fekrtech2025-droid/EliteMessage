import { Queue } from 'bullmq';
import type Redis from 'ioredis';
export declare function bootstrapQueues(connection: Redis): {
    instanceLifecycleQueue: Queue<any, any, string, any, any, string>;
    instanceRecoveryQueue: Queue<any, any, string, any, any, string>;
    outboundSendQueue: Queue<any, any, string, any, any, string>;
    webhookDeliveryQueue: Queue<any, any, string, any, any, string>;
    adminOperationsQueue: Queue<any, any, string, any, any, string>;
};
//# sourceMappingURL=bootstrap.d.ts.map