import { Module } from '@nestjs/common';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { AuthModule } from '../auth/auth.module';
import { AdminAccountsController } from './admin-accounts.controller';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
  imports: [AuthModule, AuditLogsModule],
  controllers: [AccountsController, AdminAccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
