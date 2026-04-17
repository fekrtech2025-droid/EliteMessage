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
exports.AdminSupportCasesController = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("@elite-message/contracts");
const access_token_guard_1 = require("../auth/access-token.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const current_user_decorator_1 = require("../common/current-user.decorator");
const support_cases_service_1 = require("./support-cases.service");
function parseLimit(input) {
    const raw = typeof input === 'string' ? Number.parseInt(input, 10) : Number.NaN;
    if (!Number.isFinite(raw)) {
        return 50;
    }
    return Math.min(Math.max(raw, 1), 200);
}
let AdminSupportCasesController = class AdminSupportCasesController {
    supportCasesService;
    constructor(supportCasesService) {
        this.supportCasesService = supportCasesService;
    }
    async listSupportCases(status, priority, workspaceId, assignedAdminUserId, limit) {
        return this.supportCasesService.listSupportCases({
            status: status,
            priority: priority,
            workspaceId,
            assignedAdminUserId,
            limit: parseLimit(limit),
        });
    }
    async createSupportCase(user, body) {
        const payload = contracts_1.CreateSupportCaseRequestSchema.parse(body);
        return this.supportCasesService.createSupportCase(user.id, payload);
    }
    async updateSupportCase(user, caseId, body) {
        const payload = contracts_1.UpdateSupportCaseRequestSchema.parse(body);
        return this.supportCasesService.updateSupportCase(user.id, caseId, payload);
    }
};
exports.AdminSupportCasesController = AdminSupportCasesController;
__decorate([
    (0, common_1.Get)('support-cases'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('priority')),
    __param(2, (0, common_1.Query)('workspaceId')),
    __param(3, (0, common_1.Query)('assignedAdminUserId')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminSupportCasesController.prototype, "listSupportCases", null);
__decorate([
    (0, common_1.Post)('support-cases'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminSupportCasesController.prototype, "createSupportCase", null);
__decorate([
    (0, common_1.Patch)('support-cases/:caseId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('caseId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AdminSupportCasesController.prototype, "updateSupportCase", null);
exports.AdminSupportCasesController = AdminSupportCasesController = __decorate([
    (0, common_1.Controller)(contracts_1.routePrefixes.admin),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('platform_admin'),
    __metadata("design:paramtypes", [support_cases_service_1.SupportCasesService])
], AdminSupportCasesController);
//# sourceMappingURL=admin-support-cases.controller.js.map