import type { Request } from 'express';
export type RateLimitGroup = 'auth' | 'public' | 'dashboard' | 'admin';
export type RateLimitDecision = {
    allowed: boolean;
    limit: number;
    remaining: number;
    resetAt: number;
    retryAfterSeconds: number;
    group: RateLimitGroup;
    blocked: boolean;
};
export declare class RateLimitService {
    private readonly env;
    private readonly logger;
    private readonly buckets;
    private readonly abuseByClient;
    private readonly exceededCounts;
    constructor();
    evaluate(request: Request): RateLimitDecision | null;
    getMetricsSnapshot(): {
        exceededCounts: {
            auth: number;
            public: number;
            dashboard: number;
            admin: number;
        };
        blockedClients: number;
    };
    private resolvePolicy;
    private getClientId;
    private getAbuseState;
    private registerExceeded;
    private pruneStaleEntries;
}
//# sourceMappingURL=rate-limit.service.d.ts.map