import { Controller, Get, UseGuards } from '@nestjs/common';
import { routePrefixes } from '@elite-message/contracts';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { RequireRoles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { WorkerOrchestrationService } from './worker-orchestration.service';

@Controller(routePrefixes.admin)
@UseGuards(AccessTokenGuard, RolesGuard)
@RequireRoles('platform_admin')
export class AdminOverviewController {
  constructor(
    private readonly workerOrchestrationService: WorkerOrchestrationService,
  ) {}

  @Get('overview')
  async getOverview() {
    return this.workerOrchestrationService.getAdminOverview();
  }
}
