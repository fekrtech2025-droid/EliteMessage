import { createHash } from 'node:crypto';
import type { Request } from 'express';
import { Injectable } from '@nestjs/common';
import {
  createLogger,
  loadWorkspaceEnv,
  parseApiEnv,
} from '@elite-message/config';
import { routePrefixes } from '@elite-message/contracts';

export type RateLimitGroup = 'auth' | 'public' | 'dashboard' | 'admin';

type RateLimitPolicy = {
  group: RateLimitGroup;
  maxRequests: number;
  windowMs: number;
};

type BucketState = {
  count: number;
  resetAt: number;
};

type AbuseState = {
  blockedUntil: number | null;
  strikes: number;
  windowStartedAt: number;
};

export type RateLimitDecision = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
  group: RateLimitGroup;
  blocked: boolean;
};

function hashAuthorizationHeader(value: string | undefined) {
  if (!value) {
    return 'anonymous';
  }

  return createHash('sha256').update(value).digest('hex').slice(0, 16);
}

function getClientIp(request: Request) {
  const forwarded = request.header('x-forwarded-for');
  if (forwarded) {
    return (
      forwarded.split(',')[0]?.trim() ||
      request.ip ||
      request.socket.remoteAddress ||
      'unknown'
    );
  }

  return request.ip || request.socket.remoteAddress || 'unknown';
}

@Injectable()
export class RateLimitService {
  private readonly env;
  private readonly logger = createLogger({ service: 'api' });
  private readonly buckets = new Map<string, BucketState>();
  private readonly abuseByClient = new Map<string, AbuseState>();
  private readonly exceededCounts = new Map<RateLimitGroup, number>([
    ['auth', 0],
    ['public', 0],
    ['dashboard', 0],
    ['admin', 0],
  ]);

  constructor() {
    loadWorkspaceEnv();
    this.env = parseApiEnv(process.env);
  }

  evaluate(request: Request): RateLimitDecision | null {
    const policy = this.resolvePolicy(request.path);
    if (!policy) {
      return null;
    }

    const now = Date.now();
    const clientId = this.getClientId(request, policy.group);
    const abuseState = this.getAbuseState(clientId, now);
    if (abuseState.blockedUntil && abuseState.blockedUntil > now) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((abuseState.blockedUntil - now) / 1_000),
      );
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
    const bucket =
      current && current.resetAt > now
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
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((bucket.resetAt - now) / 1_000),
      );
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

  private resolvePolicy(path: string): RateLimitPolicy | null {
    if (
      path === '/health' ||
      path === '/ready' ||
      path === '/metrics' ||
      path.startsWith('/socket.io')
    ) {
      return null;
    }

    if (path.startsWith(routePrefixes.auth)) {
      return {
        group: 'auth',
        maxRequests: this.env.API_RATE_LIMIT_AUTH_MAX_REQUESTS,
        windowMs: this.env.API_RATE_LIMIT_AUTH_WINDOW_MS,
      };
    }

    if (
      path.startsWith('/instance/') ||
      path.startsWith(routePrefixes.public)
    ) {
      return {
        group: 'public',
        maxRequests: this.env.API_RATE_LIMIT_PUBLIC_MAX_REQUESTS,
        windowMs: this.env.API_RATE_LIMIT_PUBLIC_WINDOW_MS,
      };
    }

    if (path.startsWith(routePrefixes.admin)) {
      return {
        group: 'admin',
        maxRequests: this.env.API_RATE_LIMIT_ADMIN_MAX_REQUESTS,
        windowMs: this.env.API_RATE_LIMIT_ADMIN_WINDOW_MS,
      };
    }

    if (
      path.startsWith(routePrefixes.account) ||
      path.startsWith(routePrefixes.customer)
    ) {
      return {
        group: 'dashboard',
        maxRequests: this.env.API_RATE_LIMIT_DASHBOARD_MAX_REQUESTS,
        windowMs: this.env.API_RATE_LIMIT_DASHBOARD_WINDOW_MS,
      };
    }

    return null;
  }

  private getClientId(request: Request, group: RateLimitGroup) {
    return `${group}:${getClientIp(request)}:${hashAuthorizationHeader(request.header('authorization'))}`;
  }

  private getAbuseState(clientId: string, now: number) {
    const existing = this.abuseByClient.get(clientId);
    if (
      !existing ||
      now - existing.windowStartedAt > this.env.API_RATE_LIMIT_STRIKE_WINDOW_MS
    ) {
      const nextState: AbuseState = {
        blockedUntil: null,
        strikes: 0,
        windowStartedAt: now,
      };
      this.abuseByClient.set(clientId, nextState);
      return nextState;
    }

    return existing;
  }

  private registerExceeded(
    clientId: string,
    group: RateLimitGroup,
    now: number,
  ) {
    this.exceededCounts.set(group, (this.exceededCounts.get(group) ?? 0) + 1);
    const abuse = this.getAbuseState(clientId, now);
    abuse.strikes += 1;

    if (abuse.strikes >= this.env.API_RATE_LIMIT_STRIKE_THRESHOLD) {
      abuse.blockedUntil = now + this.env.API_RATE_LIMIT_BLOCK_DURATION_MS;
      this.logger.warn(
        {
          clientId,
          group,
          strikes: abuse.strikes,
          blockedUntil: new Date(abuse.blockedUntil).toISOString(),
        },
        'rate_limit.client_blocked',
      );
    }
  }

  private pruneStaleEntries(now: number) {
    if (this.buckets.size > 2_000) {
      for (const [key, bucket] of this.buckets.entries()) {
        if (bucket.resetAt <= now) {
          this.buckets.delete(key);
        }
      }
    }

    if (this.abuseByClient.size > 2_000) {
      for (const [key, abuse] of this.abuseByClient.entries()) {
        const expiredWindow =
          now - abuse.windowStartedAt >
          this.env.API_RATE_LIMIT_STRIKE_WINDOW_MS;
        const unblocked = !abuse.blockedUntil || abuse.blockedUntil <= now;
        if (expiredWindow && unblocked) {
          this.abuseByClient.delete(key);
        }
      }
    }
  }
}
