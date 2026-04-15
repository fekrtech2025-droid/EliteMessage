import { Injectable } from '@nestjs/common';
import { loadWorkspaceEnv, parseApiEnv } from '@elite-message/config';
import { prisma } from '@elite-message/db';
import { RateLimitService } from './rate-limit.service';

type CounterName =
  | 'webhookReplays'
  | 'retentionRefreshSessionsDeleted'
  | 'retentionWebhookDeliveriesDeleted'
  | 'retentionAuditLogsDeleted';

@Injectable()
export class MetricsService {
  private readonly env;
  private readonly counters = new Map<CounterName, number>([
    ['webhookReplays', 0],
    ['retentionRefreshSessionsDeleted', 0],
    ['retentionWebhookDeliveriesDeleted', 0],
    ['retentionAuditLogsDeleted', 0],
  ]);
  private lastRetentionRunAt: Date | null = null;

  constructor(private readonly rateLimitService: RateLimitService) {
    loadWorkspaceEnv();
    this.env = parseApiEnv(process.env);
  }

  incrementWebhookReplay() {
    this.increment('webhookReplays');
  }

  recordRetentionDeletion(
    kind: Exclude<CounterName, 'webhookReplays'>,
    count: number,
  ) {
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
    const staleWorkerThreshold = new Date(
      now.getTime() - this.env.API_WORKER_STALE_AFTER_MS,
    );

    const [
      userCount,
      workspaceCount,
      instanceCount,
      workerCount,
      onlineWorkers,
      staleWorkers,
      queuedMessages,
      pendingWebhooks,
      failedWebhooks,
      exhaustedWebhooks,
      refreshSessions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.workspace.count(),
      prisma.instance.count(),
      prisma.workerHeartbeat.count(),
      prisma.workerHeartbeat.count({
        where: {
          status: 'online',
        },
      }),
      prisma.workerHeartbeat.count({
        where: {
          lastSeenAt: {
            lt: staleWorkerThreshold,
          },
        },
      }),
      prisma.outboundMessage.count({
        where: {
          status: 'queue',
        },
      }),
      prisma.webhookDelivery.count({
        where: {
          status: 'pending',
        },
      }),
      prisma.webhookDelivery.count({
        where: {
          status: 'failed',
        },
      }),
      prisma.webhookDelivery.count({
        where: {
          status: 'exhausted',
        },
      }),
      prisma.refreshSession.count({
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

  private increment(counter: CounterName, by = 1) {
    this.counters.set(counter, (this.counters.get(counter) ?? 0) + by);
  }
}
