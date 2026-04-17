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
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@elite-message/config");
const db_1 = require("@elite-message/db");
const rate_limit_service_1 = require("./rate-limit.service");
let MetricsService = class MetricsService {
    rateLimitService;
    env;
    counters = new Map([
        ['webhookReplays', 0],
        ['retentionRefreshSessionsDeleted', 0],
        ['retentionWebhookDeliveriesDeleted', 0],
        ['retentionAuditLogsDeleted', 0],
    ]);
    lastRetentionRunAt = null;
    constructor(rateLimitService) {
        this.rateLimitService = rateLimitService;
        (0, config_1.loadWorkspaceEnv)();
        this.env = (0, config_1.parseApiEnv)(process.env);
    }
    incrementWebhookReplay() {
        this.increment('webhookReplays');
    }
    recordRetentionDeletion(kind, count) {
        if (count <= 0) {
            return;
        }
        this.increment(kind, count);
    }
    markRetentionRun(at = new Date()) {
        this.lastRetentionRunAt = at;
    }
    async renderPrometheus() {
        const now = new Date();
        const staleWorkerThreshold = new Date(now.getTime() - this.env.API_WORKER_STALE_AFTER_MS);
        const [userCount, workspaceCount, instanceCount, workerCount, onlineWorkers, staleWorkers, queuedMessages, pendingWebhooks, failedWebhooks, exhaustedWebhooks, refreshSessions,] = await Promise.all([
            db_1.prisma.user.count(),
            db_1.prisma.workspace.count(),
            db_1.prisma.instance.count(),
            db_1.prisma.workerHeartbeat.count(),
            db_1.prisma.workerHeartbeat.count({
                where: {
                    status: 'online',
                },
            }),
            db_1.prisma.workerHeartbeat.count({
                where: {
                    lastSeenAt: {
                        lt: staleWorkerThreshold,
                    },
                },
            }),
            db_1.prisma.outboundMessage.count({
                where: {
                    status: 'queue',
                },
            }),
            db_1.prisma.webhookDelivery.count({
                where: {
                    status: 'pending',
                },
            }),
            db_1.prisma.webhookDelivery.count({
                where: {
                    status: 'failed',
                },
            }),
            db_1.prisma.webhookDelivery.count({
                where: {
                    status: 'exhausted',
                },
            }),
            db_1.prisma.refreshSession.count({
                where: {
                    revokedAt: null,
                    expiresAt: {
                        gt: now,
                    },
                },
            }),
        ]);
        const security = this.rateLimitService.getMetricsSnapshot();
        const lines = [
            '# HELP elite_message_users_total Total users.',
            '# TYPE elite_message_users_total gauge',
            `elite_message_users_total ${userCount}`,
            '# HELP elite_message_workspaces_total Total workspaces.',
            '# TYPE elite_message_workspaces_total gauge',
            `elite_message_workspaces_total ${workspaceCount}`,
            '# HELP elite_message_instances_total Total instances.',
            '# TYPE elite_message_instances_total gauge',
            `elite_message_instances_total ${instanceCount}`,
            '# HELP elite_message_workers_total Total worker heartbeat records.',
            '# TYPE elite_message_workers_total gauge',
            `elite_message_workers_total ${workerCount}`,
            '# HELP elite_message_workers_online_total Online workers.',
            '# TYPE elite_message_workers_online_total gauge',
            `elite_message_workers_online_total ${onlineWorkers}`,
            '# HELP elite_message_workers_stale_total Workers with stale heartbeats.',
            '# TYPE elite_message_workers_stale_total gauge',
            `elite_message_workers_stale_total ${staleWorkers}`,
            '# HELP elite_message_outbound_queue_total Queued outbound messages.',
            '# TYPE elite_message_outbound_queue_total gauge',
            `elite_message_outbound_queue_total ${queuedMessages}`,
            '# HELP elite_message_webhook_deliveries_total Webhook deliveries by status.',
            '# TYPE elite_message_webhook_deliveries_total gauge',
            `elite_message_webhook_deliveries_total{status="pending"} ${pendingWebhooks}`,
            `elite_message_webhook_deliveries_total{status="failed"} ${failedWebhooks}`,
            `elite_message_webhook_deliveries_total{status="exhausted"} ${exhaustedWebhooks}`,
            '# HELP elite_message_refresh_sessions_active_total Active refresh sessions.',
            '# TYPE elite_message_refresh_sessions_active_total gauge',
            `elite_message_refresh_sessions_active_total ${refreshSessions}`,
            '# HELP elite_message_security_rate_limit_exceeded_total Rate limit exceedances by group.',
            '# TYPE elite_message_security_rate_limit_exceeded_total counter',
            `elite_message_security_rate_limit_exceeded_total{group="auth"} ${security.exceededCounts.auth}`,
            `elite_message_security_rate_limit_exceeded_total{group="public"} ${security.exceededCounts.public}`,
            `elite_message_security_rate_limit_exceeded_total{group="dashboard"} ${security.exceededCounts.dashboard}`,
            `elite_message_security_rate_limit_exceeded_total{group="admin"} ${security.exceededCounts.admin}`,
            '# HELP elite_message_security_blocked_clients_total Currently blocked clients.',
            '# TYPE elite_message_security_blocked_clients_total gauge',
            `elite_message_security_blocked_clients_total ${security.blockedClients}`,
            '# HELP elite_message_webhook_replays_total Admin-triggered webhook replays.',
            '# TYPE elite_message_webhook_replays_total counter',
            `elite_message_webhook_replays_total ${this.counters.get('webhookReplays') ?? 0}`,
            '# HELP elite_message_retention_deleted_total Rows deleted by retention sweeps.',
            '# TYPE elite_message_retention_deleted_total counter',
            `elite_message_retention_deleted_total{kind="refresh_session"} ${this.counters.get('retentionRefreshSessionsDeleted') ?? 0}`,
            `elite_message_retention_deleted_total{kind="webhook_delivery"} ${this.counters.get('retentionWebhookDeliveriesDeleted') ?? 0}`,
            `elite_message_retention_deleted_total{kind="audit_log"} ${this.counters.get('retentionAuditLogsDeleted') ?? 0}`,
            '# HELP elite_message_retention_last_run_timestamp_seconds Timestamp of the latest retention sweep.',
            '# TYPE elite_message_retention_last_run_timestamp_seconds gauge',
            `elite_message_retention_last_run_timestamp_seconds ${this.lastRetentionRunAt ? Math.floor(this.lastRetentionRunAt.getTime() / 1_000) : 0}`,
        ];
        return `${lines.join('\n')}\n`;
    }
    increment(counter, by = 1) {
        this.counters.set(counter, (this.counters.get(counter) ?? 0) + by);
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rate_limit_service_1.RateLimitService])
], MetricsService);
//# sourceMappingURL=metrics.service.js.map