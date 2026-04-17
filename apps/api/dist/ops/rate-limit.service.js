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
exports.RateLimitService = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const config_1 = require("@elite-message/config");
const contracts_1 = require("@elite-message/contracts");
function hashAuthorizationHeader(value) {
    if (!value) {
        return 'anonymous';
    }
    return (0, node_crypto_1.createHash)('sha256').update(value).digest('hex').slice(0, 16);
}
function getClientIp(request) {
    const forwarded = request.header('x-forwarded-for');
    if (forwarded) {
        return (forwarded.split(',')[0]?.trim() ||
            request.ip ||
            request.socket.remoteAddress ||
            'unknown');
    }
    return request.ip || request.socket.remoteAddress || 'unknown';
}
let RateLimitService = class RateLimitService {
    env;
    logger = (0, config_1.createLogger)({ service: 'api' });
    buckets = new Map();
    abuseByClient = new Map();
    exceededCounts = new Map([
        ['auth', 0],
        ['public', 0],
        ['dashboard', 0],
        ['admin', 0],
    ]);
    constructor() {
        (0, config_1.loadWorkspaceEnv)();
        this.env = (0, config_1.parseApiEnv)(process.env);
    }
    evaluate(request) {
        const policy = this.resolvePolicy(request.path);
        if (!policy) {
            return null;
        }
        const now = Date.now();
        const clientId = this.getClientId(request, policy.group);
        const abuseState = this.getAbuseState(clientId, now);
        if (abuseState.blockedUntil && abuseState.blockedUntil > now) {
            const retryAfterSeconds = Math.max(1, Math.ceil((abuseState.blockedUntil - now) / 1_000));
            return {
                allowed: false,
                limit: policy.maxRequests,
                remaining: 0,
                resetAt: abuseState.blockedUntil,
                retryAfterSeconds,
                group: policy.group,
                blocked: true,
            };
        }
        const bucketKey = `${policy.group}:${clientId}`;
        const current = this.buckets.get(bucketKey);
        const bucket = current && current.resetAt > now
            ? current
            : {
                count: 0,
                resetAt: now + policy.windowMs,
            };
        bucket.count += 1;
        this.buckets.set(bucketKey, bucket);
        this.pruneStaleEntries(now);
        if (bucket.count > policy.maxRequests) {
            this.registerExceeded(clientId, policy.group, now);
            const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1_000));
            return {
                allowed: false,
                limit: policy.maxRequests,
                remaining: 0,
                resetAt: bucket.resetAt,
                retryAfterSeconds,
                group: policy.group,
                blocked: false,
            };
        }
        return {
            allowed: true,
            limit: policy.maxRequests,
            remaining: Math.max(policy.maxRequests - bucket.count, 0),
            resetAt: bucket.resetAt,
            retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1_000)),
            group: policy.group,
            blocked: false,
        };
    }
    getMetricsSnapshot() {
        const now = Date.now();
        let blockedClients = 0;
        for (const abuse of this.abuseByClient.values()) {
            if (abuse.blockedUntil && abuse.blockedUntil > now) {
                blockedClients += 1;
            }
        }
        return {
            exceededCounts: {
                auth: this.exceededCounts.get('auth') ?? 0,
                public: this.exceededCounts.get('public') ?? 0,
                dashboard: this.exceededCounts.get('dashboard') ?? 0,
                admin: this.exceededCounts.get('admin') ?? 0,
            },
            blockedClients,
        };
    }
    resolvePolicy(path) {
        if (path === '/health' ||
            path === '/ready' ||
            path === '/metrics' ||
            path.startsWith('/socket.io')) {
            return null;
        }
        if (path.startsWith(contracts_1.routePrefixes.auth)) {
            return {
                group: 'auth',
                maxRequests: this.env.API_RATE_LIMIT_AUTH_MAX_REQUESTS,
                windowMs: this.env.API_RATE_LIMIT_AUTH_WINDOW_MS,
            };
        }
        if (path.startsWith('/instance/') ||
            path.startsWith(contracts_1.routePrefixes.public)) {
            return {
                group: 'public',
                maxRequests: this.env.API_RATE_LIMIT_PUBLIC_MAX_REQUESTS,
                windowMs: this.env.API_RATE_LIMIT_PUBLIC_WINDOW_MS,
            };
        }
        if (path.startsWith(contracts_1.routePrefixes.admin)) {
            return {
                group: 'admin',
                maxRequests: this.env.API_RATE_LIMIT_ADMIN_MAX_REQUESTS,
                windowMs: this.env.API_RATE_LIMIT_ADMIN_WINDOW_MS,
            };
        }
        if (path.startsWith(contracts_1.routePrefixes.account) ||
            path.startsWith(contracts_1.routePrefixes.customer)) {
            return {
                group: 'dashboard',
                maxRequests: this.env.API_RATE_LIMIT_DASHBOARD_MAX_REQUESTS,
                windowMs: this.env.API_RATE_LIMIT_DASHBOARD_WINDOW_MS,
            };
        }
        return null;
    }
    getClientId(request, group) {
        return `${group}:${getClientIp(request)}:${hashAuthorizationHeader(request.header('authorization'))}`;
    }
    getAbuseState(clientId, now) {
        const existing = this.abuseByClient.get(clientId);
        if (!existing ||
            now - existing.windowStartedAt > this.env.API_RATE_LIMIT_STRIKE_WINDOW_MS) {
            const nextState = {
                blockedUntil: null,
                strikes: 0,
                windowStartedAt: now,
            };
            this.abuseByClient.set(clientId, nextState);
            return nextState;
        }
        return existing;
    }
    registerExceeded(clientId, group, now) {
        this.exceededCounts.set(group, (this.exceededCounts.get(group) ?? 0) + 1);
        const abuse = this.getAbuseState(clientId, now);
        abuse.strikes += 1;
        if (abuse.strikes >= this.env.API_RATE_LIMIT_STRIKE_THRESHOLD) {
            abuse.blockedUntil = now + this.env.API_RATE_LIMIT_BLOCK_DURATION_MS;
            this.logger.warn({
                clientId,
                group,
                strikes: abuse.strikes,
                blockedUntil: new Date(abuse.blockedUntil).toISOString(),
            }, 'rate_limit.client_blocked');
        }
    }
    pruneStaleEntries(now) {
        if (this.buckets.size > 2_000) {
            for (const [key, bucket] of this.buckets.entries()) {
                if (bucket.resetAt <= now) {
                    this.buckets.delete(key);
                }
            }
        }
        if (this.abuseByClient.size > 2_000) {
            for (const [key, abuse] of this.abuseByClient.entries()) {
                const expiredWindow = now - abuse.windowStartedAt >
                    this.env.API_RATE_LIMIT_STRIKE_WINDOW_MS;
                const unblocked = !abuse.blockedUntil || abuse.blockedUntil <= now;
                if (expiredWindow && unblocked) {
                    this.abuseByClient.delete(key);
                }
            }
        }
    }
};
exports.RateLimitService = RateLimitService;
exports.RateLimitService = RateLimitService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RateLimitService);
//# sourceMappingURL=rate-limit.service.js.map