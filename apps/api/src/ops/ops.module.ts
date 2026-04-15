import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { RateLimitMiddleware } from './rate-limit.middleware';
import { RateLimitService } from './rate-limit.service';
import { RetentionService } from './retention.service';

@Module({
  providers: [
    RateLimitService,
    RateLimitMiddleware,
    MetricsService,
    RetentionService,
  ],
  exports: [RateLimitService, RateLimitMiddleware, MetricsService],
})
export class OpsModule {}
