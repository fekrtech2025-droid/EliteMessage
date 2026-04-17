"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstancesModule = void 0;
const common_1 = require("@nestjs/common");
const audit_logs_module_1 = require("../audit-logs/audit-logs.module");
const auth_module_1 = require("../auth/auth.module");
const realtime_module_1 = require("../realtime/realtime.module");
const admin_instances_controller_1 = require("./admin-instances.controller");
const customer_instances_controller_1 = require("./customer-instances.controller");
const instances_service_1 = require("./instances.service");
const public_instances_controller_1 = require("./public-instances.controller");
let InstancesModule = class InstancesModule {
};
exports.InstancesModule = InstancesModule;
exports.InstancesModule = InstancesModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, realtime_module_1.RealtimeModule, audit_logs_module_1.AuditLogsModule],
        controllers: [
            customer_instances_controller_1.CustomerInstancesController,
            admin_instances_controller_1.AdminInstancesController,
            public_instances_controller_1.PublicInstancesController,
        ],
        providers: [instances_service_1.InstancesService],
        exports: [instances_service_1.InstancesService],
    })
], InstancesModule);
//# sourceMappingURL=instances.module.js.map