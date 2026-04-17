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
exports.CustomerMessagesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
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
let CustomerMessagesController = class CustomerMessagesController {
    messagesService;
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    async listWorkspaceMessages(user, workspaceId, instanceId, status, recipient, referenceId, limit) {
        return this.messagesService.listWorkspaceCustomerMessages(user.id, {
            workspaceId,
            instanceId,
            status: status,
            recipient,
            referenceId,
            limit: parseLimit(limit),
        });
    }
    async listWorkspaceInboundMessages(user, workspaceId, instanceId, sender, limit) {
        return this.messagesService.listWorkspaceCustomerInboundMessages(user.id, {
            workspaceId,
            instanceId,
            sender,
            limit: parseLimit(limit),
        });
    }
    async listMessages(user, instanceId, status, recipient, referenceId, limit) {
        return this.messagesService.listCustomerMessages(user.id, instanceId, {
            status: status,
            recipient,
            referenceId,
            limit: parseLimit(limit),
        });
    }
    async listWebhookDeliveries(user, instanceId, status, eventType, limit) {
        return this.messagesService.listCustomerWebhookDeliveries(user.id, instanceId, {
            status: status,
            eventType: eventType,
            limit: parseLimit(limit),
        });
    }
    async listInboundMessages(user, instanceId, sender, limit) {
        return this.messagesService.listCustomerInboundMessages(user.id, instanceId, {
            sender,
            limit: parseLimit(limit),
        });
    }
    async sendChatMessage(user, instanceId, body) {
        const payload = contracts_1.SendChatMessageRequestSchema.parse(body);
        return this.messagesService.sendCustomerChatMessage(user.id, instanceId, payload);
    }
    async sendImageMessage(user, instanceId, body) {
        const payload = contracts_1.SendImageMessageRequestSchema.parse(body);
        return this.messagesService.sendCustomerImageMessage(user.id, instanceId, payload);
    }
    async uploadAndSendImageMessage(user, instanceId, file, body) {
        const recipient = typeof body.to === 'string' ? body.to.trim() : '';
        if (!recipient) {
            throw new common_1.BadRequestException('Recipient is required.');
        }
        const priority = typeof body.priority === 'string'
            ? Number.parseInt(body.priority, 10)
            : Number.NaN;
        return this.messagesService.sendCustomerUploadedImageMessage(user.id, instanceId, {
            to: recipient,
            caption: typeof body.caption === 'string' && body.caption.trim() !== ''
                ? body.caption
                : null,
            referenceId: typeof body.referenceId === 'string' && body.referenceId.trim() !== ''
                ? body.referenceId.trim()
                : null,
            priority: Number.isFinite(priority) ? priority : 100,
        }, {
            originalName: file?.originalname ?? 'upload.bin',
            mimeType: file?.mimetype ?? 'application/octet-stream',
            buffer: file?.buffer ?? Buffer.alloc(0),
        });
    }
    async getMessageStatistics(user, instanceId) {
        return this.messagesService.getCustomerMessageStatistics(user.id, instanceId);
    }
    async resendMessage(user, instanceId, messageId) {
        return this.messagesService.resendCustomerMessage(user.id, instanceId, messageId);
    }
    async resendMessagesByStatus(user, instanceId, body) {
        const payload = contracts_1.ResendMessagesByStatusRequestSchema.parse(body);
        return this.messagesService.resendCustomerMessagesByStatus(user.id, instanceId, payload);
    }
    async clearMessagesByStatus(user, instanceId, body) {
        const payload = contracts_1.ClearMessagesByStatusRequestSchema.parse(body);
        return this.messagesService.clearCustomerMessagesByStatus(user.id, instanceId, payload);
    }
};
exports.CustomerMessagesController = CustomerMessagesController;
__decorate([
    (0, common_1.Get)('messages'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('workspaceId')),
    __param(2, (0, common_1.Query)('instanceId')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('to')),
    __param(5, (0, common_1.Query)('referenceId')),
    __param(6, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], CustomerMessagesController.prototype, "listWorkspaceMessages", null);
__decorate([
    (0, common_1.Get)('inbound-messages'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('workspaceId')),
    __param(2, (0, common_1.Query)('instanceId')),
    __param(3, (0, common_1.Query)('from')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], CustomerMessagesController.prototype, "listWorkspaceInboundMessages", null);
__decorate([
    (0, common_1.Get)('instances/:instanceId/messages'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('instanceId')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('to')),
    __param(4, (0, common_1.Query)('referenceId')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], CustomerMessagesController.prototype, "listMessages", null);
__decorate([
    (0, common_1.Get)('instances/:instanceId/webhook-deliveries'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('instanceId')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('eventType')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], CustomerMessagesController.prototype, "listWebhookDeliveries", null);
__decorate([
    (0, common_1.Get)('instances/:instanceId/inbound-messages'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('instanceId')),
    __param(2, (0, common_1.Query)('from')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], CustomerMessagesController.prototype, "listInboundMessages", null);
__decorate([
    (0, common_1.Post)('instances/:instanceId/messages/chat'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('instanceId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CustomerMessagesController.prototype, "sendChatMessage", null);
__decorate([
    (0, common_1.Post)('instances/:instanceId/messages/image'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('instanceId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CustomerMessagesController.prototype, "sendImageMessage", null);
__decorate([
    (0, common_1.Post)('instances/:instanceId/messages/image-upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('instanceId')),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], CustomerMessagesController.prototype, "uploadAndSendImageMessage", null);
__decorate([
    (0, common_1.Get)('instances/:instanceId/messages/statistics'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('instanceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CustomerMessagesController.prototype, "getMessageStatistics", null);
__decorate([
    (0, common_1.Post)('instances/:instanceId/messages/:messageId/resend'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('instanceId')),
    __param(2, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], CustomerMessagesController.prototype, "resendMessage", null);
__decorate([
    (0, common_1.Post)('instances/:instanceId/messages/resend-by-status'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('instanceId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CustomerMessagesController.prototype, "resendMessagesByStatus", null);
__decorate([
    (0, common_1.Post)('instances/:instanceId/messages/clear'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('instanceId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CustomerMessagesController.prototype, "clearMessagesByStatus", null);
exports.CustomerMessagesController = CustomerMessagesController = __decorate([
    (0, common_1.Controller)(contracts_1.routePrefixes.customer),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('customer'),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], CustomerMessagesController);
//# sourceMappingURL=customer-messages.controller.js.map