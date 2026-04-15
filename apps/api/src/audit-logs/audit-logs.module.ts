import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AccountAuditLogsController } from './account-audit-logs.controller';
import { AdminAuditLogsController } from './admin-audit-logs.controller';
import { AuditLogsService } from './audit-logs.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [AccountAuditLogsController, AdminAuditLogsController],
  providers: [AuditLogsService],
  exports: [AuditLogsService],
})
export class AuditLogsModule {}
