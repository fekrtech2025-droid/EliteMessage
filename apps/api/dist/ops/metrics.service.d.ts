import { RateLimitService } from './rate-limit.service';
type CounterName = 'webhookReplays' | 'retentionRefreshSessionsDeleted' | 'retentionWebhookDeliveriesDeleted' | 'retentionAuditLogsDeleted';
export declare class MetricsService {
    private readonly rateLimitService;
    private readonly env;
    private readonly counters;
    private lastRetentionRunAt;
    constructor(rateLimitService: RateLimitService);
    incrementWebhookReplay(): void;
    recordRetentionDeletion(kind: Exclude<CounterName, 'webhookReplays'>, count: number): void;
    markRetentionRun(at?: Date): void;
    renderPrometheus(): Promise<string>;
    private increment;
}
export {};
//# sourceMappingURL=metrics.service.d.ts.map