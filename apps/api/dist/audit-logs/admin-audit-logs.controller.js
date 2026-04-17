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
exports.AdminAuditLogsController = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("@elite-message/contracts");
const access_token_guard_1 = require("../auth/access-token.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const audit_logs_service_1 = require("./audit-logs.service");
function parseLimit(input) {
    const raw = typeof input === 'string' ? Number.parseInt(input, 10) : Number.NaN;
    if (!Number.isFinite(raw)) {
        return 50;
    }
    return Math.min(Math.max(raw, 1), 200);
}
let AdminAuditLogsController = class AdminAuditLogsController {
    auditLogsService;
    constructor(auditLogsService) {
        this.auditLogsService = auditLogsService;
    }
    async listAuditLogs(workspaceId, instanceId, actorType, entityType, action, limit) {
        return this.auditLogsService.listAdminAuditLogs({
            workspaceId,
            instanceId,
            actorType: actorType,
            entityType: entityType,
            action,
            limit: parseLimit(limit),
        });
    }
};
exports.AdminAuditLogsController = AdminAuditLogsController;
__decorate([
    (0, common_1.Get)('audit-logs'),
    __param(0, (0, common_1.Query)('workspaceId')),
    __param(1, (0, common_1.Query)('instanceId')),
    __param(2, (0, common_1.Query)('actorType')),
    __param(3, (0, common_1.Query)('entityType')),
    __param(4, (0, common_1.Query)('action')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminAuditLogsController.prototype, "listAuditLogs", null);
exports.AdminAuditLogsController = AdminAuditLogsController = __decorate([
    (0, common_1.Controller)(contracts_1.routePrefixes.admin),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('platform_admin'),
    __metadata("design:paramtypes", [audit_logs_service_1.AuditLogsService])
], AdminAuditLogsController);
//# sourceMappingURL=admin-audit-logs.controller.js.map