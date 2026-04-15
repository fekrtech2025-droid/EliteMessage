import { Injectable } from '@nestjs/common';
import { MetricsService } from '../ops/metrics.service';

@Injectable()
export class HealthService {
  constructor(private readonly metricsService: MetricsService) {}

  getHealth() {
    return {
      status: 'ok',
      service: 'api',
    };
  }

  getReadiness() {
    return {
      ready: true,
      service: 'api',
    };
  }

  async getMetrics() {
    return this.metricsService.renderPrometheus();
  }
}
