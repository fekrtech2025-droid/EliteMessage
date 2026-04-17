"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const audit_logs_module_1 = require("../audit-logs/audit-logs.module");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const access_token_guard_1 = require("./access-token.guard");
const instance_api_token_guard_1 = require("./instance-api-token.guard");
const internal_token_guard_1 = require("./internal-token.guard");
const roles_guard_1 = require("./roles.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => audit_logs_module_1.AuditLogsModule)],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            access_token_guard_1.AccessTokenGuard,
            instance_api_token_guard_1.InstanceApiTokenGuard,
            internal_token_guard_1.InternalTokenGuard,
            roles_guard_1.RolesGuard,
        ],
        exports: [
            auth_service_1.AuthService,
            access_token_guard_1.AccessTokenGuard,
            instance_api_token_guard_1.InstanceApiTokenGuard,
            internal_token_guard_1.InternalTokenGuard,
            roles_guard_1.RolesGuard,
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map