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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("@elite-message/contracts");
const current_user_decorator_1 = require("../common/current-user.decorator");
const access_token_guard_1 = require("./access-token.guard");
const auth_service_1 = require("./auth.service");
const roles_decorator_1 = require("./roles.decorator");
const roles_guard_1 = require("./roles.guard");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async signup(body, request, response) {
        const payload = contracts_1.SignupRequestSchema.parse(body);
        const result = await this.authService.signup(payload, this.getRequestMetadata(request));
        response.cookie(auth_service_1.refreshCookieName, result.refreshToken, this.authService.buildRefreshCookieOptions(result.refreshExpiresAt));
        return result.response;
    }
    async login(body, request, response) {
        const payload = contracts_1.LoginRequestSchema.parse(body);
        const result = await this.authService.login(payload, this.getRequestMetadata(request));
        response.cookie(auth_service_1.refreshCookieName, result.refreshToken, this.authService.buildRefreshCookieOptions(result.refreshExpiresAt));
        return result.response;
    }
    async refresh(request, response) {
        const refreshToken = this.authService.extractRefreshToken(request.headers.cookie);
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Missing refresh session.');
        }
        const result = await this.authService.refresh(refreshToken, this.getRequestMetadata(request));
        response.cookie(auth_service_1.refreshCookieName, result.refreshToken, this.authService.buildRefreshCookieOptions(result.refreshExpiresAt));
        return result.response;
    }
    async logout(request, response) {
        const refreshToken = this.authService.extractRefreshToken(request.headers.cookie);
        await this.authService.logout(refreshToken);
        response.clearCookie(auth_service_1.refreshCookieName, this.authService.buildClearRefreshCookieOptions());
        return { success: true };
    }
    authorizeWithGoogle(mode, response) {
        const parsedMode = contracts_1.GoogleAuthModeSchema.catch('login').parse(mode);
        const result = this.authService.startGoogleAuthorization(parsedMode);
        if (result.stateCookieValue && result.stateExpiresAt) {
            response.cookie(auth_service_1.googleStateCookieName, result.stateCookieValue, this.authService.buildGoogleStateCookieOptions(result.stateExpiresAt));
        }
        return response.redirect(result.redirectUrl);
    }
    async handleGoogleCallback(code, state, error, errorDescription, request, response) {
        const result = await this.authService.completeGoogleAuthorization({
            code: this.readSingleQueryValue(code),
            state: this.readSingleQueryValue(state),
            error: this.readSingleQueryValue(error),
            errorDescription: this.readSingleQueryValue(errorDescription),
        }, this.authService.extractGoogleStateCookie(request.headers.cookie), this.getRequestMetadata(request));
        response.clearCookie(auth_service_1.googleStateCookieName, this.authService.buildClearGoogleStateCookieOptions());
        if (result.refreshToken && result.refreshExpiresAt) {
            response.cookie(auth_service_1.refreshCookieName, result.refreshToken, this.authService.buildRefreshCookieOptions(result.refreshExpiresAt));
        }
        return response.redirect(result.redirectUrl);
    }
    async getAdminMfaStatus(user) {
        return this.authService.getAdminMfaStatus(user.id);
    }
    async createAdminMfaChallenge(user) {
        return this.authService.createAdminMfaChallenge(user.id);
    }
    async verifyAdminMfaChallenge(user, body) {
        const payload = contracts_1.AdminMfaVerifyRequestSchema.parse(body);
        return this.authService.verifyAdminMfaChallenge(user.id, payload);
    }
    getRequestMetadata(request) {
        return {
            userAgent: request.header('user-agent'),
            ipAddress: request.ip ?? request.socket.remoteAddress ?? null,
        };
    }
    readSingleQueryValue(value) {
        if (typeof value === 'string') {
            return value;
        }
        return Array.isArray(value) && typeof value[0] === 'string'
            ? value[0]
            : undefined;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('google/authorize'),
    __param(0, (0, common_1.Query)('mode')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "authorizeWithGoogle", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('state')),
    __param(2, (0, common_1.Query)('error')),
    __param(3, (0, common_1.Query)('error_description')),
    __param(4, (0, common_1.Req)()),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleGoogleCallback", null);
__decorate([
    (0, common_1.Get)('admin/mfa'),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('platform_admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAdminMfaStatus", null);
__decorate([
    (0, common_1.Post)('admin/mfa/challenge'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('platform_admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createAdminMfaChallenge", null);
__decorate([
    (0, common_1.Post)('admin/mfa/verify'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('platform_admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyAdminMfaChallenge", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)(contracts_1.routePrefixes.auth),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map