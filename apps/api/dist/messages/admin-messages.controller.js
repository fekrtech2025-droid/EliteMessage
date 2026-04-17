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
exports.AdminMessagesController = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("@elite-message/contracts");
const access_token_guard_1 = require("../auth/access-token.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const current_user_decorator_1 = require("../common/current-user.decorator");
const messages_service_1 = require("./messages.service");
function parseLimit(input) {
    const raw = typeof input === 'string' ? Number.parseInt(input, 10) : Number.NaN;
    if (!Number.isFinite(raw)) {
        return 25;
    }
    return Math.min(Math.max(raw, 1), 100);
}
let AdminMessagesController = class AdminMessagesController {
    messagesService;
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    async listMessages(instanceId, status, recipient, referenceId, limit) {
        return this.messagesService.listAdminMessages({
            instanceId,
            status: status,
            recipient,
            referenceId,
            limit: parseLimit(limit),
        });
    }
    async listWebhookDeliveries(instanceId, status, eventType, limit) {
        return this.messagesService.listAdminWebhookDeliveries({
            instanceId,
            status: status,
            eventType: eventType,
            limit: parseLimit(limit),
        });
    }
    async listInboundMessages(instanceId, sender, limit) {
        return this.messagesService.listAdminInboundMessages({
            instanceId,
            sender,
            limit: parseLimit(limit),
        });
    }
    async replayWebhookDelivery(user, deliveryId) {
        return this.messagesService.replayAdminWebhookDelivery(user.id, deliveryId);
    }
};
exports.AdminMessagesController = AdminMessagesController;
__decorate([
    (0, common_1.Get)('messages'),
    __param(0, (0, common_1.Query)('instanceId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('to')),
    __param(3, (0, common_1.Query)('referenceId')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminMessagesController.prototype, "listMessages", null);
__decorate([
    (0, common_1.Get)('webhook-deliveries'),
    __param(0, (0, common_1.Query)('instanceId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('eventType')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminMessagesController.prototype, "listWebhookDeliveries", null);
__decorate([
    (0, common_1.Get)('inbound-messages'),
    __param(0, (0, common_1.Query)('instanceId')),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminMessagesController.prototype, "listInboundMessages", null);
__decorate([
    (0, common_1.Post)('webhook-deliveries/:deliveryId/replay'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('deliveryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminMessagesController.prototype, "replayWebhookDelivery", null);
exports.AdminMessagesController = AdminMessagesController = __decorate([
    (0, common_1.Controller)(contracts_1.routePrefixes.admin),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('platform_admin'),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], AdminMessagesController);
//# sourceMappingURL=admin-messages.controller.js.map