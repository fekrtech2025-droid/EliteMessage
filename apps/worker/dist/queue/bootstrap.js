"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapQueues = bootstrapQueues;
const bullmq_1 = require("bullmq");
const contracts_1 = require("@elite-message/contracts");
function bootstrapQueues(connection) {
    return {
        instanceLifecycleQueue: new bullmq_1.Queue(contracts_1.queueNames.instanceLifecycle, {
            connection,
        }),
        instanceRecoveryQueue: new bullmq_1.Queue(contracts_1.queueNames.instanceRecovery, {
            connection,
        }),
        outboundSendQueue: new bullmq_1.Queue(contracts_1.queueNames.outboundSend, { connection }),
        webhookDeliveryQueue: new bullmq_1.Queue(contracts_1.queueNames.webhookDelivery, { connection }),
        adminOperationsQueue: new bullmq_1.Queue(contracts_1.queueNames.adminOperations, { connection }),
    };
}
//# sourceMappingURL=bootstrap.js.map