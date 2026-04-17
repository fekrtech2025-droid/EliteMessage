"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesModule = void 0;
const common_1 = require("@nestjs/common");
const audit_logs_module_1 = require("../audit-logs/audit-logs.module");
const auth_module_1 = require("../auth/auth.module");
const ops_module_1 = require("../ops/ops.module");
const realtime_module_1 = require("../realtime/realtime.module");
const admin_messages_controller_1 = require("./admin-messages.controller");
const customer_messages_controller_1 = require("./customer-messages.controller");
const internal_messages_controller_1 = require("./internal-messages.controller");
const messages_service_1 = require("./messages.service");
const public_customer_media_controller_1 = require("./public-customer-media.controller");
const public_messages_controller_1 = require("./public-messages.controller");
const webhook_dispatch_service_1 = require("./webhook-dispatch.service");
let MessagesModule = class MessagesModule {
};
exports.MessagesModule = MessagesModule;
exports.MessagesModule = MessagesModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, realtime_module_1.RealtimeModule, audit_logs_module_1.AuditLogsModule, ops_module_1.OpsModule],
        controllers: [
            customer_messages_controller_1.CustomerMessagesController,
            public_messages_controller_1.PublicMessagesController,
            public_customer_media_controller_1.PublicCustomerMediaController,
            admin_messages_controller_1.AdminMessagesController,
            internal_messages_controller_1.InternalMessagesController,
        ],
        providers: [messages_service_1.MessagesService, webhook_dispatch_service_1.WebhookDispatchService],
        exports: [messages_service_1.MessagesService],
    })
], MessagesModule);
//# sourceMappingURL=messages.module.js.map