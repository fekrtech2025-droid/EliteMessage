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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOverviewController = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("@elite-message/contracts");
const access_token_guard_1 = require("../auth/access-token.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const worker_orchestration_service_1 = require("./worker-orchestration.service");
let AdminOverviewController = class AdminOverviewController {
    workerOrchestrationService;
    constructor(workerOrchestrationService) {
        this.workerOrchestrationService = workerOrchestrationService;
    }
    async getOverview() {
        return this.workerOrchestrationService.getAdminOverview();
    }
};
exports.AdminOverviewController = AdminOverviewController;
__decorate([
    (0, common_1.Get)('overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminOverviewController.prototype, "getOverview", null);
exports.AdminOverviewController = AdminOverviewController = __decorate([
    (0, common_1.Controller)(contracts_1.routePrefixes.admin),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('platform_admin'),
    __metadata("design:paramtypes", [worker_orchestration_service_1.WorkerOrchestrationService])
], AdminOverviewController);
//# sourceMappingURL=admin-overview.controller.js.map