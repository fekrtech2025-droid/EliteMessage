"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const accounts_module_1 = require("./accounts/accounts.module");
const audit_logs_module_1 = require("./audit-logs/audit-logs.module");
const health_module_1 = require("./health/health.module");
const auth_module_1 = require("./auth/auth.module");
const request_context_middleware_1 = require("./common/request-context.middleware");
const request_logger_middleware_1 = require("./common/request-logger.middleware");
const instances_module_1 = require("./instances/instances.module");
const meta_module_1 = require("./meta/meta.module");
const realtime_module_1 = require("./realtime/realtime.module");
const worker_orchestration_module_1 = require("./worker-orchestration/worker-orchestration.module");
const messages_module_1 = require("./messages/messages.module");
const ops_module_1 = require("./ops/ops.module");
const rate_limit_middleware_1 = require("./ops/rate-limit.middleware");
const support_cases_module_1 = require("./support-cases/support-cases.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(request_context_middleware_1.RequestContextMiddleware, request_logger_middleware_1.RequestLoggerMiddleware, rate_limit_middleware_1.RateLimitMiddleware)
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            health_module_1.HealthModule,
            meta_module_1.MetaModule,
            auth_module_1.AuthModule,
            audit_logs_module_1.AuditLogsModule,
            accounts_module_1.AccountsModule,
            instances_module_1.InstancesModule,
            messages_module_1.MessagesModule,
            support_cases_module_1.SupportCasesModule,
            ops_module_1.OpsModule,
            realtime_module_1.RealtimeModule,
            worker_orchestration_module_1.WorkerOrchestrationModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map