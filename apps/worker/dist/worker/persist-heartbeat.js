"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.persistWorkerHeartbeat = persistWorkerHeartbeat;
const db_1 = require("@elite-message/db");
async function persistWorkerHeartbeat(payload) {
    const lastSeenAt = new Date(payload.timestamp);
    await db_1.prisma.workerHeartbeat.upsert({
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
//# sourceMappingURL=persist-heartbeat.js.map