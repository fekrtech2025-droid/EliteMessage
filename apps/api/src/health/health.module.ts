import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OpsModule } from '../ops/ops.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { InternalHealthController } from './internal-health.controller';

@Module({
  imports: [AuthModule, OpsModule],
  controllers: [HealthController, InternalHealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
