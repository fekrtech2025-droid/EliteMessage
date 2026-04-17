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
exports.RateLimitMiddleware = void 0;
const common_1 = require("@nestjs/common");
const rate_limit_service_1 = require("./rate-limit.service");
let RateLimitMiddleware = class RateLimitMiddleware {
    rateLimitService;
    constructor(rateLimitService) {
        this.rateLimitService = rateLimitService;
    }
    use(request, response, next) {
        const decision = this.rateLimitService.evaluate(request);
        if (!decision) {
            next();
            return;
        }
        response.setHeader('x-ratelimit-limit', String(decision.limit));
        response.setHeader('x-ratelimit-remaining', String(decision.remaining));
        response.setHeader('x-ratelimit-reset', String(Math.floor(decision.resetAt / 1_000)));
        if (decision.allowed) {
            next();
            return;
        }
        response.setHeader('retry-after', String(decision.retryAfterSeconds));
        response.status(429).json({
            code: 'rate_limited',
            message: decision.blocked
                ? 'Too many requests from this client. Temporary block applied.'
                : 'Too many requests. Slow down and retry shortly.',
            details: {
                group: decision.group,
            },
        });
    }
};
exports.RateLimitMiddleware = RateLimitMiddleware;
exports.RateLimitMiddleware = RateLimitMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rate_limit_service_1.RateLimitService])
], RateLimitMiddleware);
//# sourceMappingURL=rate-limit.middleware.js.map