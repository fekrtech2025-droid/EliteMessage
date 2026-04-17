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
exports.InternalMessagesController = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("@elite-message/contracts");
const internal_token_guard_1 = require("../auth/internal-token.guard");
const messages_service_1 = require("./messages.service");
let InternalMessagesController = class InternalMessagesController {
    messagesService;
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    async claimNextOutboundMessage(instanceId, body) {
        const payload = contracts_1.InternalClaimNextOutboundMessageRequestSchema.parse(body);
        return this.messagesService.claimNextOutboundMessage(instanceId, payload);
    }
    async updateOutboundMessage(instanceId, messageId, body) {
        const payload = contracts_1.InternalUpdateOutboundMessageRequestSchema.parse(body);
        return this.messagesService.updateOutboundMessage(instanceId, messageId, payload);
    }
    async receiveInboundMessage(instanceId, body) {
        const payload = contracts_1.InternalReceiveInboundMessageRequestSchema.parse(body);
        return this.messagesService.receiveInboundMessage(instanceId, payload);
    }
};
exports.InternalMessagesController = InternalMessagesController;
__decorate([
    (0, common_1.Post)('instances/:instanceId/messages/claim-next'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('instanceId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InternalMessagesController.prototype, "claimNextOutboundMessage", null);
__decorate([
    (0, common_1.Post)('instances/:instanceId/messages/:messageId/status'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('instanceId')),
    __param(1, (0, common_1.Param)('messageId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], InternalMessagesController.prototype, "updateOutboundMessage", null);
__decorate([
    (0, common_1.Post)('instances/:instanceId/messages/received'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('instanceId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InternalMessagesController.prototype, "receiveInboundMessage", null);
exports.InternalMessagesController = InternalMessagesController = __decorate([
    (0, common_1.Controller)(contracts_1.routePrefixes.internal),
    (0, common_1.UseGuards)(internal_token_guard_1.InternalTokenGuard),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], InternalMessagesController);
//# sourceMappingURL=internal-messages.controller.js.map