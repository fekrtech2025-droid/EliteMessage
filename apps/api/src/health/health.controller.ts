import { Controller, Get, Header } from '@nestjs/common';
import { writeApiDebugLog } from '../common/api-debug';
import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  getHealth() {
    writeApiDebugLog('health.public.entered');
    return this.healthService.getHealth();
  }

  @Get('ready')
  getReady() {
    writeApiDebugLog('health.public.ready');
    return this.healthService.getReadiness();
  }

  @Get('metrics')
  @Header('content-type', 'text/plain; version=0.0.4; charset=utf-8')
  async getMetrics() {
    return this.healthService.getMetrics();
  }
}
