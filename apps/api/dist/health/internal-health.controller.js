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
exports.InternalHealthController = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("@elite-message/contracts");
const internal_token_guard_1 = require("../auth/internal-token.guard");
const health_service_1 = require("./health.service");
let InternalHealthController = class InternalHealthController {
    healthService;
    constructor(healthService) {
        this.healthService = healthService;
    }
    getHealth() {
        return this.healthService.getHealth();
    }
    async getMetrics() {
        return this.healthService.getMetrics();
    }
};
exports.InternalHealthController = InternalHealthController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InternalHealthController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('metrics'),
    (0, common_1.Header)('content-type', 'text/plain; version=0.0.4; charset=utf-8'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InternalHealthController.prototype, "getMetrics", null);
exports.InternalHealthController = InternalHealthController = __decorate([
    (0, common_1.Controller)(contracts_1.routePrefixes.internal),
    (0, common_1.UseGuards)(internal_token_guard_1.InternalTokenGuard),
    __metadata("design:paramtypes", [health_service_1.HealthService])
], InternalHealthController);
//# sourceMappingURL=internal-health.controller.js.map