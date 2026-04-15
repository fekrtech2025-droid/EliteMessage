import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { routePrefixes } from '@elite-message/contracts';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { RequireRoles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { WorkerOrchestrationService } from './worker-orchestration.service';

@Controller(routePrefixes.admin)
@UseGuards(AccessTokenGuard, RolesGuard)
@RequireRoles('platform_admin')
export class AdminWorkersController {
  constructor(
    private readonly workerOrchestrationService: WorkerOrchestrationService,
  ) {}

  @Get('workers')
  async listWorkers() {
    return this.workerOrchestrationService.listAdminWorkers();
  }

  @Get('workers/:workerId')
  async getWorkerDetail(@Param('workerId') workerId: string) {
    return this.workerOrchestrationService.getAdminWorkerDetail(workerId);
  }
}
