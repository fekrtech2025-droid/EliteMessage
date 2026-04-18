"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkerLogger = createWorkerLogger;
const config_1 = require("@elite-message/config");
function createWorkerLogger(workerId) {
    return (0, config_1.createLogger)({
        service: 'worker',
        workerId,
    });
}
//# sourceMappingURL=logger.js.map