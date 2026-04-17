"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminWorkersController = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("@elite-message/contracts");
const access_token_guard_1 = require("../auth/access-token.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const worker_orchestration_service_1 = require("./worker-orchestration.service");
let AdminWorkersController = class AdminWorkersController {
    workerOrchestrationService;
    constructor(workerOrchestrationService) {
        this.workerOrchestrationService = workerOrchestrationService;
    }
    async listWorkers() {
        return this.workerOrchestrationService.listAdminWorkers();
    }
    async getWorkerDetail(workerId) {
        return this.workerOrchestrationService.getAdminWorkerDetail(workerId);
    }
};
exports.AdminWorkersController = AdminWorkersController;
__decorate([
    (0, common_1.Get)('workers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminWorkersController.prototype, "listWorkers", null);
__decorate([
    (0, common_1.Get)('workers/:workerId'),
    __param(0, (0, common_1.Param)('workerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminWorkersController.prototype, "getWorkerDetail", null);
exports.AdminWorkersController = AdminWorkersController = __decorate([
    (0, common_1.Controller)(contracts_1.routePrefixes.admin),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('platform_admin'),
    __metadata("design:paramtypes", [worker_orchestration_service_1.WorkerOrchestrationService])
], AdminWorkersController);
//# sourceMappingURL=admin-workers.controller.js.map