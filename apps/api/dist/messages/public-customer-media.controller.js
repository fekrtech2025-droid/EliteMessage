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
exports.PublicCustomerMediaController = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("@elite-message/contracts");
const messages_service_1 = require("./messages.service");
let PublicCustomerMediaController = class PublicCustomerMediaController {
    messagesService;
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    async getCustomerMediaAsset(assetId, fileName, response) {
        const asset = await this.messagesService.readPublicCustomerMediaAsset(assetId, fileName);
        const content = await import('node:fs/promises').then(({ readFile }) => readFile(asset.filePath));
        response.setHeader('content-type', asset.contentType);
        response.setHeader('cache-control', 'public, max-age=3600');
        response.send(content);
    }
};
exports.PublicCustomerMediaController = PublicCustomerMediaController;
__decorate([
    (0, common_1.Get)('customer-media/:assetId/:fileName'),
    __param(0, (0, common_1.Param)('assetId')),
    __param(1, (0, common_1.Param)('fileName')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PublicCustomerMediaController.prototype, "getCustomerMediaAsset", null);
exports.PublicCustomerMediaController = PublicCustomerMediaController = __decorate([
    (0, common_1.Controller)(contracts_1.routePrefixes.public),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], PublicCustomerMediaController);
//# sourceMappingURL=public-customer-media.controller.js.map