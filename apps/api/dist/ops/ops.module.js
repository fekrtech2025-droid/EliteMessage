"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpsModule = void 0;
const common_1 = require("@nestjs/common");
const metrics_service_1 = require("./metrics.service");
const rate_limit_middleware_1 = require("./rate-limit.middleware");
const rate_limit_service_1 = require("./rate-limit.service");
const retention_service_1 = require("./retention.service");
let OpsModule = class OpsModule {
};
exports.OpsModule = OpsModule;
exports.OpsModule = OpsModule = __decorate([
    (0, common_1.Module)({
        providers: [
            rate_limit_service_1.RateLimitService,
            rate_limit_middleware_1.RateLimitMiddleware,
            metrics_service_1.MetricsService,
            retention_service_1.RetentionService,
        ],
        exports: [rate_limit_service_1.RateLimitService, rate_limit_middleware_1.RateLimitMiddleware, metrics_service_1.MetricsService],
    })
], OpsModule);
//# sourceMappingURL=ops.module.js.map