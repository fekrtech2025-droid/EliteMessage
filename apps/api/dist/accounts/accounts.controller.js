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
exports.AccountsController = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("@elite-message/contracts");
const access_token_guard_1 = require("../auth/access-token.guard");
const current_user_decorator_1 = require("../common/current-user.decorator");
const accounts_service_1 = require("./accounts.service");
let AccountsController = class AccountsController {
    accountsService;
    constructor(accountsService) {
        this.accountsService = accountsService;
    }
    async getMe(user) {
        return this.accountsService.getAccountMe(user.id);
    }
    async updateMe(user, body) {
        const payload = contracts_1.UpdateAccountProfileRequestSchema.parse(body);
        return this.accountsService.updateAccountProfile(user.id, payload);
    }
    async updateTheme(user, body) {
        const parsedBody = contracts_1.UpdateAccountThemePreferenceRequestSchema.safeParse(body);
        if (!parsedBody.success) {
            throw new common_1.BadRequestException(parsedBody.error.issues[0]?.message ??
                'Invalid theme preference payload.');
        }
        const payload = parsedBody.data;
        return this.accountsService.updateAccountThemePreference(user.id, payload);
    }
    async getSubscription(user, workspaceId) {
        return this.accountsService.getWorkspaceSubscription(user.id, workspaceId);
    }
    async listApiTokens(user, workspaceId) {
        return this.accountsService.listAccountApiTokens(user.id, workspaceId);
    }
    async createApiToken(user, body) {
        const payload = contracts_1.CreateAccountApiTokenRequestSchema.parse(body);
        return this.accountsService.createAccountApiToken(user.id, payload);
    }
    async rotateApiToken(user, tokenId) {
        return this.accountsService.rotateAccountApiToken(user.id, tokenId);
    }
};
exports.AccountsController = AccountsController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "getMe", null);
__decorate([
    (0, common_1.Patch)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Patch)('me/theme'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "updateTheme", null);
__decorate([
    (0, common_1.Get)('subscription'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('workspaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "getSubscription", null);
__decorate([
    (0, common_1.Get)('api-tokens'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('workspaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "listApiTokens", null);
__decorate([
    (0, common_1.Post)('api-tokens'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "createApiToken", null);
__decorate([
    (0, common_1.Post)('api-tokens/:tokenId/rotate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tokenId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "rotateApiToken", null);
exports.AccountsController = AccountsController = __decorate([
    (0, common_1.Controller)(contracts_1.routePrefixes.account),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard),
    __metadata("design:paramtypes", [accounts_service_1.AccountsService])
], AccountsController);
//# sourceMappingURL=accounts.controller.js.map