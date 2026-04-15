import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { AdminOverviewController } from './admin-overview.controller';
import { AdminWorkersController } from './admin-workers.controller';
import { InternalWorkersController } from './internal-workers.controller';
import { WorkerOrchestrationService } from './worker-orchestration.service';

@Module({
  imports: [AuthModule, RealtimeModule],
  controllers: [
    AdminOverviewController,
    AdminWorkersController,
    InternalWorkersController,
  ],
  providers: [WorkerOrchestrationService],
})
export class WorkerOrchestrationModule {}
