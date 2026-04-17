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
exports.CustomerInstancesController = void 0;
const promises_1 = require("node:fs/promises");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@elite-message/contracts");
const access_token_guard_1 = require("../auth/access-token.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const current_user_decorator_1 = require("../common/current-user.decorator");
const instances_service_1 = require("./instances.service");
let CustomerInstancesController = class CustomerInstancesController {
    instancesService;
    constructor(instancesService) {
        this.instancesService = instancesService;
    }
    async listInstances(user) {
        return this.instancesService.listCustomerInstances(user.id);
    }
    async createInstance(user, body) {
        const payload = contracts_1.CreateInstanceRequestSchema.parse(body);
        return this.instancesService.createCustomerInstance(user.id, payload);
    }
    async getInstanceDetail(user, instanceId) {
        return this.instancesService.getCustomerInstanceDetail(user.id, instanceId);
    }
    async getInstanceScreenshot(user, instanceId, response) {
        const screenshot = await this.instancesService.getCustomerInstanceScreenshot(user.id, instanceId);
        const file = await (0, promises_1.readFile)(screenshot.path);
        response.setHeader('content-type', 'image/png');
        response.setHeader('cache-control', 'no-store');
        response.setHeader('content-disposition', `inline; filename="${screenshot.filename}"`);
        return response.send(file);
    }
    async updateInstanceSettings(user, instanceId, body) {
        const payload = contracts_1.UpdateInstanceSettingsRequestSchema.parse(body);
        return this.instancesService.updateCustomerInstanceSettings(user.id, instanceId, payload);
    }
    async requestInstanceAction(user, instanceId, body) {
        const payload = contracts_1.RequestInstanceActionRequestSchema.parse(body);
        return this.instancesService.requestCustomerInstanceAction(user.id, instanceId, payload);
    }
    async rotateInstanceToken(user, instanceId) {
        return this.instancesService.rotateCustomerInstanceToken(user.id, instanceId);
    }
};
exports.CustomerInstancesController = CustomerInstancesController;
__decorate([
    (0, common_1.Get)('instances'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerInstancesController.prototype, "listInstances", null);
__decorate([
    (0, common_1.Post)('instances'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CustomerInstancesController.prototype, "createInstance", null);
__decorate([
    (0, common_1.Get)('instances/:instanceId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('instanceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CustomerInstancesController.prototype, "getInstanceDetail", null);
__decorate([
    (0, common_1.Get)('instances/:instanceId/screenshot'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('instanceId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CustomerInstancesController.prototype, "getInstanceScreenshot", null);
__decorate([
    (0, common_1.Patch)('instances/:instanceId/settings'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('instanceId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CustomerInstancesController.prototype, "updateInstanceSettings", null);
__decorate([
    (0, common_1.Post)('instances/:instanceId/actions'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('instanceId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CustomerInstancesController.prototype, "requestInstanceAction", null);
__decorate([
    (0, common_1.Post)('instances/:instanceId/rotate-token'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('instanceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CustomerInstancesController.prototype, "rotateInstanceToken", null);
exports.CustomerInstancesController = CustomerInstancesController = __decorate([
    (0, common_1.Controller)(contracts_1.routePrefixes.customer),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('customer'),
    __metadata("design:paramtypes", [instances_service_1.InstancesService])
], CustomerInstancesController);
//# sourceMappingURL=customer-instances.controller.js.map