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
exports.PublicMessagesController = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("@elite-message/contracts");
const instance_api_token_guard_1 = require("../auth/instance-api-token.guard");
const current_instance_api_decorator_1 = require("../common/current-instance-api.decorator");
const messages_service_1 = require("./messages.service");
function parseLimit(input) {
    const raw = typeof input === 'string' ? Number.parseInt(input, 10) : Number.NaN;
    if (!Number.isFinite(raw)) {
        return 25;
    }
    return Math.min(Math.max(raw, 1), 100);
}
let PublicMessagesController = class PublicMessagesController {
    messagesService;
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    async sendChatMessage(principal, body) {
        const payload = contracts_1.SendChatMessageRequestSchema.parse(body);
        return this.messagesService.sendPublicChatMessage(principal, payload);
    }
    async sendImageMessage(principal, body) {
        const payload = contracts_1.PublicSendImageMessageRequestSchema.parse(body);
        return this.messagesService.sendPublicImageMessage(principal, {
            to: payload.to,
            imageUrl: payload.imageUrl ?? payload.image ?? '',
            caption: payload.caption ?? null,
            referenceId: payload.referenceId ?? null,
            priority: payload.priority,
        });
    }
    async listMessages(principal, messageId, status, ack, recipient, referenceId, limit) {
        return this.messagesService.listPublicMessages(principal, {
            messageId,
            status: status,
            ack: ack,
            recipient,
            referenceId,
            limit: parseLimit(limit),
        });
    }
    async getMessageStatistics(principal) {
        return this.messagesService.getPublicMessageStatistics(principal);
    }
    async resendById(principal, body) {
        const payload = contracts_1.PublicResendByIdRequestSchema.parse(body);
        return this.messagesService.resendPublicMessage(principal, payload.id);
    }
    async resendByStatus(principal, body) {
        const payload = contracts_1.ResendMessagesByStatusRequestSchema.parse(body);
        return this.messagesService.resendPublicMessagesByStatus(principal, payload);
    }
    async clearByStatus(principal, body) {
        const payload = contracts_1.ClearMessagesByStatusRequestSchema.parse(body);
        return this.messagesService.clearPublicMessagesByStatus(principal, payload);
    }
};
exports.PublicMessagesController = PublicMessagesController;
__decorate([
    (0, common_1.Post)('messages/chat'),
    __param(0, (0, current_instance_api_decorator_1.CurrentInstanceApi)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PublicMessagesController.prototype, "sendChatMessage", null);
__decorate([
    (0, common_1.Post)('messages/image'),
    __param(0, (0, current_instance_api_decorator_1.CurrentInstanceApi)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PublicMessagesController.prototype, "sendImageMessage", null);
__decorate([
    (0, common_1.Get)('messages'),
    __param(0, (0, current_instance_api_decorator_1.CurrentInstanceApi)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('ack')),
    __param(4, (0, common_1.Query)('to')),
    __param(5, (0, common_1.Query)('referenceId')),
    __param(6, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PublicMessagesController.prototype, "listMessages", null);
__decorate([
    (0, common_1.Get)('messages/statistics'),
    __param(0, (0, current_instance_api_decorator_1.CurrentInstanceApi)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicMessagesController.prototype, "getMessageStatistics", null);
__decorate([
    (0, common_1.Post)('messages/resendById'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_instance_api_decorator_1.CurrentInstanceApi)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PublicMessagesController.prototype, "resendById", null);
__decorate([
    (0, common_1.Post)('messages/resendByStatus'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_instance_api_decorator_1.CurrentInstanceApi)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PublicMessagesController.prototype, "resendByStatus", null);
__decorate([
    (0, common_1.Post)('messages/clear'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_instance_api_decorator_1.CurrentInstanceApi)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PublicMessagesController.prototype, "clearByStatus", null);
exports.PublicMessagesController = PublicMessagesController = __decorate([
    (0, common_1.Controller)(contracts_1.routePrefixes.perInstance),
    (0, common_1.UseGuards)(instance_api_token_guard_1.InstanceApiTokenGuard),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], PublicMessagesController);
//# sourceMappingURL=public-messages.controller.js.map