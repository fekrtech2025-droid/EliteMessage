"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildHeartbeatPayload = buildHeartbeatPayload;
const contracts_1 = require("@elite-message/contracts");
function buildHeartbeatPayload(input) {
    return contracts_1.WorkerHeartbeatPayloadSchema.parse(input);
}
//# sourceMappingURL=heartbeat.js.map