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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceApiTokenGuard = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
function readTokenValue(input) {
    if (typeof input === 'string') {
        const trimmed = input.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    }
    if (Array.isArray(input)) {
        return input
            .map((value) => readTokenValue(value))
            .find((value) => Boolean(value));
    }
    return undefined;
}
function extractInstanceApiToken(request) {
    const authorizationHeader = request.header('authorization');
    if (authorizationHeader?.startsWith('Bearer ')) {
        const bearerToken = authorizationHeader.slice('Bearer '.length).trim();
        if (bearerToken.length > 0) {
            return bearerToken;
        }
    }
    const queryToken = readTokenValue(request.query?.token);
    if (queryToken) {
        return queryToken;
    }
    const bodyToken = readTokenValue(request.body?.token);
    if (bodyToken) {
        return bodyToken;
    }
    return undefined;
}
let InstanceApiTokenGuard = class InstanceApiTokenGuard {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const instancePathId = readTokenValue(request.params?.instanceId);
        const token = extractInstanceApiToken(request);
        if (!instancePathId) {
            throw new common_1.UnauthorizedException('Missing target instance identifier.');
        }
        if (!token) {
            throw new common_1.UnauthorizedException('Missing instance API token.');
        }
        request.instanceApi = await this.authService.authenticateInstanceApiToken(instancePathId, token);
        return true;
    }
};
exports.InstanceApiTokenGuard = InstanceApiTokenGuard;
exports.InstanceApiTokenGuard = InstanceApiTokenGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], InstanceApiTokenGuard);
//# sourceMappingURL=instance-api-token.guard.js.map