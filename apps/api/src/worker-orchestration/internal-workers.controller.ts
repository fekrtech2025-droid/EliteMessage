import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  InternalReleaseInstanceRequestSchema,
  InternalUpdateInstanceOperationRequestSchema,
  InternalUpdateInstanceRuntimeRequestSchema,
  InternalUpdateInstanceStatusRequestSchema,
  WorkerHeartbeatPayloadSchema,
  routePrefixes,
} from '@elite-message/contracts';
import { InternalTokenGuard } from '../auth/internal-token.guard';
import { WorkerOrchestrationService } from './worker-orchestration.service';

@Controller(routePrefixes.internal)
@UseGuards(InternalTokenGuard)
export class InternalWorkersController {
  constructor(
    private readonly workerOrchestrationService: WorkerOrchestrationService,
  ) {}

  @Post('workers/register')
  @HttpCode(200)
  async registerWorker(@Body() body: unknown) {
    const payload = WorkerHeartbeatPayloadSchema.parse(body);
    return this.workerOrchestrationService.registerWorker(payload);
  }

  @Post('workers/:workerId/claim-next')
  @HttpCode(200)
  async claimNextInstance(@Param('workerId') workerId: string) {
    return this.workerOrchestrationService.claimNextInstance(workerId);
  }

  @Post('workers/:workerId/release-instance')
  @HttpCode(200)
  async releaseInstance(
    @Param('workerId') workerId: string,
    @Body() body: unknown,
  ) {
    const payload = InternalReleaseInstanceRequestSchema.parse(body);
    return this.workerOrchestrationService.releaseAssignedInstance(
      workerId,
      payload,
    );
  }

  @Post('instances/:instanceId/status')
  @HttpCode(200)
  async updateInstanceStatus(
    @Param('instanceId') instanceId: string,
    @Body() body: unknown,
  ) {
    const payload = InternalUpdateInstanceStatusRequestSchema.parse(body);
    return this.workerOrchestrationService.updateInstanceStatus(
      instanceId,
      payload,
    );
  }

  @Post('instances/:instanceId/runtime')
  @HttpCode(200)
  async updateInstanceRuntime(
    @Param('instanceId') instanceId: string,
    @Body() body: unknown,
  ) {
    const payload = InternalUpdateInstanceRuntimeRequestSchema.parse(body);
    return this.workerOrchestrationService.updateInstanceRuntime(
      instanceId,
      payload,
    );
  }

  @Post('instances/:instanceId/operations/:operationId/status')
  @HttpCode(200)
  async updateInstanceOperationStatus(
    @Param('instanceId') instanceId: string,
    @Param('operationId') operationId: string,
    @Body() body: unknown,
  ) {
    const payload = InternalUpdateInstanceOperationRequestSchema.parse(body);
    return this.workerOrchestrationService.updateInstanceOperationStatus(
      instanceId,
      operationId,
      payload,
    );
  }
}
