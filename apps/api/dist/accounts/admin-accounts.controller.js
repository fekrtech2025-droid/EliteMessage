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
exports.AdminAccountsController = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("@elite-message/contracts");
const access_token_guard_1 = require("../auth/access-token.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const current_user_decorator_1 = require("../common/current-user.decorator");
const accounts_service_1 = require("./accounts.service");
let AdminAccountsController = class AdminAccountsController {
    accountsService;
    constructor(accountsService) {
        this.accountsService = accountsService;
    }
    async listUsers() {
        return this.accountsService.listAdminUsers();
    }
    async getUserDetail(userId) {
        return this.accountsService.getAdminUserDetail(userId);
    }
    async updateUserStatus(user, userId, body) {
        const payload = contracts_1.UpdateAdminUserStatusRequestSchema.parse(body);
        return this.accountsService.updateAdminUserStatus(user.id, userId, payload);
    }
    async listWorkspaces() {
        return this.accountsService.listAdminWorkspaces();
    }
    async getWorkspaceDetail(workspaceId) {
        return this.accountsService.getAdminWorkspaceDetail(workspaceId);
    }
    async updateWorkspaceStatus(user, workspaceId, body) {
        const payload = contracts_1.UpdateAdminWorkspaceStatusRequestSchema.parse(body);
        return this.accountsService.updateAdminWorkspaceStatus(user.id, workspaceId, payload);
    }
    async extendWorkspaceTrial(user, workspaceId, body) {
        const payload = contracts_1.ExtendAdminWorkspaceTrialRequestSchema.parse(body);
        return this.accountsService.extendAdminWorkspaceTrial(user.id, workspaceId, payload);
    }
};
exports.AdminAccountsController = AdminAccountsController;
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminAccountsController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Get)('users/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminAccountsController.prototype, "getUserDetail", null);
__decorate([
    (0, common_1.Patch)('users/:userId/status'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AdminAccountsController.prototype, "updateUserStatus", null);
__decorate([
    (0, common_1.Get)('workspaces'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminAccountsController.prototype, "listWorkspaces", null);
__decorate([
    (0, common_1.Get)('workspaces/:workspaceId'),
    __param(0, (0, common_1.Param)('workspaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminAccountsController.prototype, "getWorkspaceDetail", null);
__decorate([
    (0, common_1.Patch)('workspaces/:workspaceId/status'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('workspaceId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AdminAccountsController.prototype, "updateWorkspaceStatus", null);
__decorate([
    (0, common_1.Post)('workspaces/:workspaceId/extend-trial'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('workspaceId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AdminAccountsController.prototype, "extendWorkspaceTrial", null);
exports.AdminAccountsController = AdminAccountsController = __decorate([
    (0, common_1.Controller)(contracts_1.routePrefixes.admin),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('platform_admin'),
    __metadata("design:paramtypes", [accounts_service_1.AccountsService])
], AdminAccountsController);
//# sourceMappingURL=admin-accounts.controller.js.map