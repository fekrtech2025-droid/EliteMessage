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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicInstancesController = void 0;
const promises_1 = require("node:fs/promises");
const common_1 = require("@nestjs/common");
const qrcode_1 = __importDefault(require("qrcode"));
const contracts_1 = require("@elite-message/contracts");
const instance_api_token_guard_1 = require("../auth/instance-api-token.guard");
const current_instance_api_decorator_1 = require("../common/current-instance-api.decorator");
const instances_service_1 = require("./instances.service");
function assertAction(action) {
    if (action === 'reassign') {
        throw new common_1.NotFoundException();
    }
    return action;
}
let PublicInstancesController = class PublicInstancesController {
    instancesService;
    constructor(instancesService) {
        this.instancesService = instancesService;
    }
    async getStatus(principal) {
        return this.instancesService.getPublicInstanceStatus(principal);
    }
    async getMe(principal) {
        return this.instancesService.getPublicInstanceMe(principal);
    }
    async getSettings(principal) {
        return this.instancesService.getPublicInstanceSettings(principal);
    }
    async updateSettings(principal, body) {
        const payload = contracts_1.PublicUpdateInstanceSettingsRequestSchema.parse(body);
        return this.instancesService.updatePublicInstanceSettings(principal, payload);
    }
    async getQrCode(principal) {
        return this.instancesService.getPublicInstanceQrCode(principal);
    }
    async getQr(principal, response) {
        const qrCode = await this.instancesService.getPublicInstanceQrCode(principal);
        if (!qrCode.qrCode) {
            throw new common_1.NotFoundException('No QR code is currently available for this instance.');
        }
        const buffer = await qrcode_1.default.toBuffer(qrCode.qrCode, {
            margin: 1,
            width: 512,
        });
        response.setHeader('content-type', 'image/png');
        response.setHeader('cache-control', 'no-store');
        response.setHeader('content-disposition', `inline; filename="${principal.instancePublicId}-qr.png"`);
        return response.send(buffer);
    }
    async start(principal) {
        return this.requestAction(principal, 'start');
    }
    async stop(principal) {
        return this.requestAction(principal, 'stop');
    }
    async restart(principal) {
        return this.requestAction(principal, 'restart');
    }
    async logout(principal) {
        return this.requestAction(principal, 'logout');
    }
    async clear(principal) {
        return this.requestAction(principal, 'clear');
    }
    async takeover(principal) {
        return this.requestAction(principal, 'takeover');
    }
    async getScreenshot(principal, encoding, response) {
        const screenshot = await this.instancesService.getPublicInstanceScreenshot(principal);
        const file = await (0, promises_1.readFile)(screenshot.path);
        if (encoding === 'base64') {
            return response.send({
                publicId: screenshot.publicId,
                filename: screenshot.filename,
                capturedAt: screenshot.capturedAt,
                mimeType: 'image/png',
                data: file.toString('base64'),
            });
        }
        response.setHeader('content-type', 'image/png');
        response.setHeader('cache-control', 'no-store');
        response.setHeader('content-disposition', `inline; filename="${screenshot.filename}"`);
        return response.send(file);
    }
    requestAction(principal, action) {
        return this.instancesService.requestPublicInstanceAction(principal, {
            action: assertAction(action),
        });
    }
};
exports.PublicInstancesController = PublicInstancesController;
__decorate([
    (0, common_1.Get)('instance/status'),
    __param(0, (0, current_instance_api_decorator_1.CurrentInstanceApi)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicInstancesController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)('instance/me'),
    __param(0, (0, current_instance_api_decorator_1.CurrentInstanceApi)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicInstancesController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)('instance/settings'),
    __param(0, (0, current_instance_api_decorator_1.CurrentInstanceApi)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicInstancesController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Post)('instance/settings'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_instance_api_decorator_1.CurrentInstanceApi)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PublicInstancesController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Get)('instance/qrCode'),
    __param(0, (0, current_instance_api_decorator_1.CurrentInstanceApi)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicInstancesController.prototype, "getQrCode", null);
__decorate([
    (0, common_1.Get)('instance/qr'),
    __param(0, (0, current_instance_api_decorator_1.CurrentInstanceApi)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PublicInstancesController.prototype, "getQr", null);
__decorate([
    (0, common_1.Post)('instance/start'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_instance_api_decorator_1.CurrentInstanceApi)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicInstancesController.prototype, "start", null);
__decorate([
    (0, common_1.Post)('instance/stop'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_instance_api_decorator_1.CurrentInstanceApi)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicInstancesController.prototype, "stop", null);
__decorate([
    (0, common_1.Post)('instance/restart'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_instance_api_decorator_1.CurrentInstanceApi)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicInstancesController.prototype, "restart", null);
__decorate([
    (0, common_1.Post)('instance/logout'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_instance_api_decorator_1.CurrentInstanceApi)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicInstancesController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('instance/clear'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_instance_api_decorator_1.CurrentInstanceApi)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicInstancesController.prototype, "clear", null);
__decorate([
    (0, common_1.Post)('instance/takeover'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_instance_api_decorator_1.CurrentInstanceApi)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicInstancesController.prototype, "takeover", null);
__decorate([
    (0, common_1.Get)('instance/screenshot'),
    __param(0, (0, current_instance_api_decorator_1.CurrentInstanceApi)()),
    __param(1, (0, common_1.Query)('encoding')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PublicInstancesController.prototype, "getScreenshot", null);
exports.PublicInstancesController = PublicInstancesController = __decorate([
    (0, common_1.Controller)(contracts_1.routePrefixes.perInstance),
    (0, common_1.UseGuards)(instance_api_token_guard_1.InstanceApiTokenGuard),
    __metadata("design:paramtypes", [instances_service_1.InstancesService])
], PublicInstancesController);
//# sourceMappingURL=public-instances.controller.js.map