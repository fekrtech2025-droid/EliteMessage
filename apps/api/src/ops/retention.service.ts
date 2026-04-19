import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  createLogger,
  loadWorkspaceEnv,
  parseApiEnv,
} from '@elite-message/config';
import { prisma } from '@elite-message/db';
import { MetricsService } from './metrics.service';

@Injectable()
export class RetentionService implements OnModuleInit, OnModuleDestroy {
  private readonly env;
  private readonly logger = createLogger({ service: 'api' });
  private sweepTimer: NodeJS.Timeout | undefined;
  private running = false;

  constructor(private readonly metricsService: MetricsService) {
    loadWorkspaceEnv();
    this.env = parseApiEnv(process.env);
  }

  onModuleInit() {
    this.sweepTimer = setInterval(() => {
      void this.runSweep().catch((error) => {
        this.logger.error({ error }, 'retention.sweep.failed');
      });
    }, this.env.API_RETENTION_SWEEP_INTERVAL_MS);
    this.sweepTimer.unref();

    void this.runSweep().catch((error) => {
      this.logger.error({ error }, 'retention.sweep.failed');
    });
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
        const refreshCutoff = new Date(
          now.getTime() -
            this.env.API_REFRESH_SESSION_RETENTION_DAYS * 24 * 60 * 60 * 1_000,
        );
        const refreshResult = await prisma.refreshSession.deleteMany({
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
        this.metricsService.recordRetentionDeletion(
          'retentionRefreshSessionsDeleted',
          refreshResult.count,
        );
      }

      if (this.env.API_WEBHOOK_DELIVERY_RETENTION_DAYS > 0) {
        const deliveryCutoff = new Date(
          now.getTime() -
            this.env.API_WEBHOOK_DELIVERY_RETENTION_DAYS * 24 * 60 * 60 * 1_000,
        );
        const deliveryResult = await prisma.webhookDelivery.deleteMany({
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
        this.metricsService.recordRetentionDeletion(
          'retentionWebhookDeliveriesDeleted',
          deliveryResult.count,
        );
      }

      if (this.env.API_AUDIT_LOG_RETENTION_DAYS > 0) {
        const auditCutoff = new Date(
          now.getTime() -
            this.env.API_AUDIT_LOG_RETENTION_DAYS * 24 * 60 * 60 * 1_000,
        );
        const auditResult = await prisma.auditLog.deleteMany({
          where: {
            createdAt: {
              lt: auditCutoff,
            },
          },
        });
        deleted.auditLogs = auditResult.count;
        this.metricsService.recordRetentionDeletion(
          'retentionAuditLogsDeleted',
          auditResult.count,
        );
      }

      this.metricsService.markRetentionRun(now);
      this.logger.info({ deleted }, 'retention.sweep.completed');
    } finally {
      this.running = false;
    }
  }
}
