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
exports.AdminInstancesController = void 0;
const promises_1 = require("node:fs/promises");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@elite-message/contracts");
const access_token_guard_1 = require("../auth/access-token.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const current_user_decorator_1 = require("../common/current-user.decorator");
const instances_service_1 = require("./instances.service");
let AdminInstancesController = class AdminInstancesController {
    instancesService;
    constructor(instancesService) {
        this.instancesService = instancesService;
    }
    async getInstanceDetail(instanceId) {
        return this.instancesService.getAdminInstanceDetail(instanceId);
    }
    async getInstanceScreenshot(instanceId, response) {
        const screenshot = await this.instancesService.getAdminInstanceScreenshot(instanceId);
        const file = await (0, promises_1.readFile)(screenshot.path);
        response.setHeader('content-type', 'image/png');
        response.setHeader('cache-control', 'no-store');
        response.setHeader('content-disposition', `inline; filename="${screenshot.filename}"`);
        return response.send(file);
    }
    async requestInstanceAction(user, instanceId, body) {
        const payload = contracts_1.RequestInstanceActionRequestSchema.parse(body);
        return this.instancesService.requestAdminInstanceAction(user.id, instanceId, payload);
    }
};
exports.AdminInstancesController = AdminInstancesController;
__decorate([
    (0, common_1.Get)('instances/:instanceId'),
    __param(0, (0, common_1.Param)('instanceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminInstancesController.prototype, "getInstanceDetail", null);
__decorate([
    (0, common_1.Get)('instances/:instanceId/screenshot'),
    __param(0, (0, common_1.Param)('instanceId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminInstancesController.prototype, "getInstanceScreenshot", null);
__decorate([
    (0, common_1.Post)('instances/:instanceId/actions'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('instanceId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AdminInstancesController.prototype, "requestInstanceAction", null);
exports.AdminInstancesController = AdminInstancesController = __decorate([
    (0, common_1.Controller)(contracts_1.routePrefixes.admin),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('platform_admin'),
    __metadata("design:paramtypes", [instances_service_1.InstancesService])
], AdminInstancesController);
//# sourceMappingURL=admin-instances.controller.js.map