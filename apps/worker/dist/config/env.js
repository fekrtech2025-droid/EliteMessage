"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadWorkerEnv = loadWorkerEnv;
const config_1 = require("@elite-message/config");
function loadWorkerEnv() {
    (0, config_1.loadWorkspaceEnv)();
    return (0, config_1.parseWorkerEnv)(process.env);
}
//# sourceMappingURL=env.js.map