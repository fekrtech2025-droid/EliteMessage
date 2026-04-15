import { Module } from '@nestjs/common';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { AuthModule } from '../auth/auth.module';
import { AdminSupportCasesController } from './admin-support-cases.controller';
import { SupportCasesService } from './support-cases.service';

@Module({
  imports: [AuthModule, AuditLogsModule],
  controllers: [AdminSupportCasesController],
  providers: [SupportCasesService],
})
export class SupportCasesModule {}
