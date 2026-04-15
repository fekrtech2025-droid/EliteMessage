import { Module } from '@nestjs/common';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { AuthModule } from '../auth/auth.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { AdminInstancesController } from './admin-instances.controller';
import { CustomerInstancesController } from './customer-instances.controller';
import { InstancesService } from './instances.service';
import { PublicInstancesController } from './public-instances.controller';

@Module({
  imports: [AuthModule, RealtimeModule, AuditLogsModule],
  controllers: [
    CustomerInstancesController,
    AdminInstancesController,
    PublicInstancesController,
  ],
  providers: [InstancesService],
  exports: [InstancesService],
})
export class InstancesModule {}
