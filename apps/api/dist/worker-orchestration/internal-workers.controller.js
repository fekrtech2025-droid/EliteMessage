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
exports.InternalWorkersController = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("@elite-message/contracts");
const internal_token_guard_1 = require("../auth/internal-token.guard");
const worker_orchestration_service_1 = require("./worker-orchestration.service");
let InternalWorkersController = class InternalWorkersController {
    workerOrchestrationService;
    constructor(workerOrchestrationService) {
        this.workerOrchestrationService = workerOrchestrationService;
    }
    async registerWorker(body) {
        const payload = contracts_1.WorkerHeartbeatPayloadSchema.parse(body);
        return this.workerOrchestrationService.registerWorker(payload);
    }
    async claimNextInstance(workerId) {
        return this.workerOrchestrationService.claimNextInstance(workerId);
    }
    async releaseInstance(workerId, body) {
        const payload = contracts_1.InternalReleaseInstanceRequestSchema.parse(body);
        return this.workerOrchestrationService.releaseAssignedInstance(workerId, payload);
    }
    async updateInstanceStatus(instanceId, body) {
        const payload = contracts_1.InternalUpdateInstanceStatusRequestSchema.parse(body);
        return this.workerOrchestrationService.updateInstanceStatus(instanceId, payload);
    }
    async updateInstanceRuntime(instanceId, body) {
        const payload = contracts_1.InternalUpdateInstanceRuntimeRequestSchema.parse(body);
        return this.workerOrchestrationService.updateInstanceRuntime(instanceId, payload);
    }
    async updateInstanceOperationStatus(instanceId, operationId, body) {
        const payload = contracts_1.InternalUpdateInstanceOperationRequestSchema.parse(body);
        return this.workerOrchestrationService.updateInstanceOperationStatus(instanceId, operationId, payload);
    }
};
exports.InternalWorkersController = InternalWorkersController;
__decorate([
    (0, common_1.Post)('workers/register'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InternalWorkersController.prototype, "registerWorker", null);
__decorate([
    (0, common_1.Post)('workers/:workerId/claim-next'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('workerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InternalWorkersController.prototype, "claimNextInstance", null);
__decorate([
    (0, common_1.Post)('workers/:workerId/release-instance'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('workerId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InternalWorkersController.prototype, "releaseInstance", null);
__decorate([
    (0, common_1.Post)('instances/:instanceId/status'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('instanceId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InternalWorkersController.prototype, "updateInstanceStatus", null);
__decorate([
    (0, common_1.Post)('instances/:instanceId/runtime'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('instanceId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InternalWorkersController.prototype, "updateInstanceRuntime", null);
__decorate([
    (0, common_1.Post)('instances/:instanceId/operations/:operationId/status'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('instanceId')),
    __param(1, (0, common_1.Param)('operationId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], InternalWorkersController.prototype, "updateInstanceOperationStatus", null);
exports.InternalWorkersController = InternalWorkersController = __decorate([
    (0, common_1.Controller)(contracts_1.routePrefixes.internal),
    (0, common_1.UseGuards)(internal_token_guard_1.InternalTokenGuard),
    __metadata("design:paramtypes", [worker_orchestration_service_1.WorkerOrchestrationService])
], InternalWorkersController);
//# sourceMappingURL=internal-workers.controller.js.map