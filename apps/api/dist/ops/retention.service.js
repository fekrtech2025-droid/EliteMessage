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
exports.RetentionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@elite-message/config");
const db_1 = require("@elite-message/db");
const metrics_service_1 = require("./metrics.service");
let RetentionService = class RetentionService {
    metricsService;
    env;
    logger = (0, config_1.createLogger)({ service: 'api' });
    sweepTimer;
    running = false;
    constructor(metricsService) {
        this.metricsService = metricsService;
        (0, config_1.loadWorkspaceEnv)();
        this.env = (0, config_1.parseApiEnv)(process.env);
    }
    onModuleInit() {
        this.sweepTimer = setInterval(() => {
            void this.runSweep();
        }, this.env.API_RETENTION_SWEEP_INTERVAL_MS);
        this.sweepTimer.unref();
        void this.runSweep();
    }
    onModuleDestroy() {
        if (this.sweepTimer) {
            clearInterval(this.sweepTimer);
            this.sweepTimer = undefined;
        }
    }
    async runSweep() {
        if (this.running) {
            return;
        }
        this.running = true;
        try {
            const now = new Date();
            const deleted = {
                refreshSessions: 0,
                webhookDeliveries: 0,
                auditLogs: 0,
            };
            if (this.env.API_REFRESH_SESSION_RETENTION_DAYS > 0) {
                const refreshCutoff = new Date(now.getTime() -
                    this.env.API_REFRESH_SESSION_RETENTION_DAYS * 24 * 60 * 60 * 1_000);
                const refreshResult = await db_1.prisma.refreshSession.deleteMany({
                    where: {
                        OR: [
                            {
                                expiresAt: {
                                    lt: refreshCutoff,
                                },
                            },
                            {
                                revokedAt: {
                                    lt: refreshCutoff,
                                },
                            },
                        ],
                    },
                });
                deleted.refreshSessions = refreshResult.count;
                this.metricsService.recordRetentionDeletion('retentionRefreshSessionsDeleted', refreshResult.count);
            }
            if (this.env.API_WEBHOOK_DELIVERY_RETENTION_DAYS > 0) {
                const deliveryCutoff = new Date(now.getTime() -
                    this.env.API_WEBHOOK_DELIVERY_RETENTION_DAYS * 24 * 60 * 60 * 1_000);
                const deliveryResult = await db_1.prisma.webhookDelivery.deleteMany({
                    where: {
                        status: {
                            in: ['delivered', 'exhausted'],
                        },
                        updatedAt: {
                            lt: deliveryCutoff,
                        },
                    },
                });
                deleted.webhookDeliveries = deliveryResult.count;
                this.metricsService.recordRetentionDeletion('retentionWebhookDeliveriesDeleted', deliveryResult.count);
            }
            if (this.env.API_AUDIT_LOG_RETENTION_DAYS > 0) {
                const auditCutoff = new Date(now.getTime() -
                    this.env.API_AUDIT_LOG_RETENTION_DAYS * 24 * 60 * 60 * 1_000);
                const auditResult = await db_1.prisma.auditLog.deleteMany({
                    where: {
                        createdAt: {
                            lt: auditCutoff,
                        },
                    },
                });
                deleted.auditLogs = auditResult.count;
                this.metricsService.recordRetentionDeletion('retentionAuditLogsDeleted', auditResult.count);
            }
            this.metricsService.markRetentionRun(now);
            this.logger.info({ deleted }, 'retention.sweep.completed');
        }
        finally {
            this.running = false;
        }
    }
};
exports.RetentionService = RetentionService;
exports.RetentionService = RetentionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [metrics_service_1.MetricsService])
], RetentionService);
//# sourceMappingURL=retention.service.js.map