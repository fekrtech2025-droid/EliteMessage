import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { routePrefixes } from '@elite-message/contracts';
import { InternalTokenGuard } from '../auth/internal-token.guard';
import { HealthService } from './health.service';

@Controller(routePrefixes.internal)
@UseGuards(InternalTokenGuard)
export class InternalHealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  getHealth() {
    return this.healthService.getHealth();
  }

  @Get('metrics')
  @Header('content-type', 'text/plain; version=0.0.4; charset=utf-8')
  async getMetrics() {
    return this.healthService.getMetrics();
  }
}
