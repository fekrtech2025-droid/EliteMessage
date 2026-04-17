"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportCasesModule = void 0;
const common_1 = require("@nestjs/common");
const audit_logs_module_1 = require("../audit-logs/audit-logs.module");
const auth_module_1 = require("../auth/auth.module");
const admin_support_cases_controller_1 = require("./admin-support-cases.controller");
const support_cases_service_1 = require("./support-cases.service");
let SupportCasesModule = class SupportCasesModule {
};
exports.SupportCasesModule = SupportCasesModule;
exports.SupportCasesModule = SupportCasesModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, audit_logs_module_1.AuditLogsModule],
        controllers: [admin_support_cases_controller_1.AdminSupportCasesController],
        providers: [support_cases_service_1.SupportCasesService],
    })
], SupportCasesModule);
//# sourceMappingURL=support-cases.module.js.map