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
exports.InternalTokenGuard = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const config_1 = require("@elite-message/config");
let InternalTokenGuard = class InternalTokenGuard {
    env;
    constructor() {
        (0, config_1.loadWorkspaceEnv)();
        this.env = (0, config_1.parseApiEnv)(process.env);
    }
    canActivate(context) {
        const request = context
            .switchToHttp()
            .getRequest();
        const authorizationHeader = request.header('authorization');
        if (!authorizationHeader?.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Missing internal authorization token.');
        }
        const providedToken = Buffer.from(authorizationHeader.slice('Bearer '.length).trim());
        const expectedToken = Buffer.from(this.env.API_INTERNAL_TOKEN);
        if (providedToken.length !== expectedToken.length ||
            !(0, node_crypto_1.timingSafeEqual)(providedToken, expectedToken)) {
            throw new common_1.UnauthorizedException('Invalid internal authorization token.');
        }
        return true;
    }
};
exports.InternalTokenGuard = InternalTokenGuard;
exports.InternalTokenGuard = InternalTokenGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], InternalTokenGuard);
//# sourceMappingURL=internal-token.guard.js.map