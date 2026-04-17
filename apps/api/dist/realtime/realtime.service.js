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
exports.RealtimeService = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@elite-message/contracts");
const realtime_gateway_1 = require("./realtime.gateway");
let RealtimeService = class RealtimeService {
    realtimeGateway;
    constructor(realtimeGateway) {
        this.realtimeGateway = realtimeGateway;
    }
    publish(event, payload) {
        const envelope = {
            event,
            timestamp: new Date().toISOString(),
            correlationId: (0, node_crypto_1.randomUUID)(),
            payload,
        };
        this.realtimeGateway.server.emit(event, envelope);
    }
    publishInstanceStatusChanged(payload) {
        this.publish(contracts_1.websocketEventNames.instanceStatusChanged, payload);
    }
    publishInstanceQrUpdated(payload) {
        this.publish(contracts_1.websocketEventNames.instanceQrUpdated, payload);
        this.publish(contracts_1.websocketEventNames.instanceRuntimeUpdated, payload);
    }
    publishInstanceRuntimeUpdated(payload) {
        this.publish(contracts_1.websocketEventNames.instanceRuntimeUpdated, payload);
    }
    publishInstanceLifecycleUpdated(payload) {
        this.publish(contracts_1.websocketEventNames.instanceLifecycleUpdated, payload);
    }
    publishInstanceOperationUpdated(payload) {
        this.publish(contracts_1.websocketEventNames.instanceOperationUpdated, payload);
    }
    publishInstanceSettingsUpdated(payload) {
        this.publish(contracts_1.websocketEventNames.instanceSettingsUpdated, payload);
    }
    publishInstanceMessageUpdated(payload) {
        this.publish(contracts_1.websocketEventNames.instanceMessageUpdated, payload);
    }
    publishInstanceInboundMessageUpdated(payload) {
        this.publish(contracts_1.websocketEventNames.instanceInboundMessageUpdated, payload);
    }
    publishInstanceStatisticsUpdated(payload) {
        this.publish(contracts_1.websocketEventNames.instanceStatisticsUpdated, payload);
    }
    publishWebhookDeliveryUpdated(payload) {
        this.publish(contracts_1.websocketEventNames.webhookDeliveryUpdated, payload);
    }
    publishWorkerHealthUpdated(payload) {
        this.publish(contracts_1.websocketEventNames.workerHealthUpdated, payload);
    }
};
exports.RealtimeService = RealtimeService;
exports.RealtimeService = RealtimeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [realtime_gateway_1.RealtimeGateway])
], RealtimeService);
//# sourceMappingURL=realtime.service.js.map