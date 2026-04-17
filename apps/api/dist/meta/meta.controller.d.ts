export declare class MetaController {
    getMeta(): {
        service: string;
        version: string;
        routeGroups: readonly ["/api/v1/auth", "/api/v1/account", "/api/v1/customer", "/api/v1/admin", "/api/v1/public", "/api/v1/internal", "/instance/:instanceId"];
        queueNames: {
            readonly instanceLifecycle: "instance-lifecycle";
            readonly instanceRecovery: "instance-recovery";
            readonly outboundSend: "outbound-send";
            readonly webhookDelivery: "webhook-delivery";
            readonly adminOperations: "admin-operations";
        };
        websocketEvents: {
            readonly instanceStatusChanged: "instance.status.changed";
            readonly instanceQrUpdated: "instance.qr.updated";
            readonly instanceRuntimeUpdated: "instance.runtime.updated";
            readonly instanceLifecycleUpdated: "instance.lifecycle.updated";
            readonly instanceOperationUpdated: "instance.operation.updated";
            readonly instanceSettingsUpdated: "instance.settings.updated";
            readonly instanceMessageUpdated: "instance.message.updated";
            readonly instanceInboundMessageUpdated: "instance.inbound_message.updated";
            readonly instanceStatisticsUpdated: "instance.statistics.updated";
            readonly instanceLimitsUpdated: "instance.limits.updated";
            readonly webhookDeliveryUpdated: "webhook.delivery.updated";
            readonly workerHealthUpdated: "worker.health.updated";
        };
        authTokenTypes: readonly ["dashboard_access", "dashboard_refresh", "account_api", "instance_api", "internal_service"];
    };
}
//# sourceMappingURL=meta.controller.d.ts.map