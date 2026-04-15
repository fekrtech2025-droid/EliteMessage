import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { RateLimitService } from './rate-limit.service';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  constructor(private readonly rateLimitService: RateLimitService) {}

  use(request: Request, response: Response, next: NextFunction) {
    const decision = this.rateLimitService.evaluate(request);
    if (!decision) {
      next();
      return;
    }

    response.setHeader('x-ratelimit-limit', String(decision.limit));
    response.setHeader('x-ratelimit-remaining', String(decision.remaining));
    response.setHeader(
      'x-ratelimit-reset',
      String(Math.floor(decision.resetAt / 1_000)),
    );

    if (decision.allowed) {
      next();
      return;
    }

    response.setHeader('retry-after', String(decision.retryAfterSeconds));
    response.status(429).json({
      code: 'rate_limited',
      message: decision.blocked
        ? 'Too many requests from this client. Temporary block applied.'
        : 'Too many requests. Slow down and retry shortly.',
      details: {
        group: decision.group,
      },
    });
  }
}
