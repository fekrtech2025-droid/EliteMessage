"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerOrchestrationModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const realtime_module_1 = require("../realtime/realtime.module");
const admin_overview_controller_1 = require("./admin-overview.controller");
const admin_workers_controller_1 = require("./admin-workers.controller");
const internal_workers_controller_1 = require("./internal-workers.controller");
const worker_orchestration_service_1 = require("./worker-orchestration.service");
let WorkerOrchestrationModule = class WorkerOrchestrationModule {
};
exports.WorkerOrchestrationModule = WorkerOrchestrationModule;
exports.WorkerOrchestrationModule = WorkerOrchestrationModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, realtime_module_1.RealtimeModule],
        controllers: [
            admin_overview_controller_1.AdminOverviewController,
            admin_workers_controller_1.AdminWorkersController,
            internal_workers_controller_1.InternalWorkersController,
        ],
        providers: [worker_orchestration_service_1.WorkerOrchestrationService],
    })
], WorkerOrchestrationModule);
//# sourceMappingURL=worker-orchestration.module.js.map