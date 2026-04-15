import { forwardRef, Module } from '@nestjs/common';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './access-token.guard';
import { InstanceApiTokenGuard } from './instance-api-token.guard';
import { InternalTokenGuard } from './internal-token.guard';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [forwardRef(() => AuditLogsModule)],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenGuard,
    InstanceApiTokenGuard,
    InternalTokenGuard,
    RolesGuard,
  ],
  exports: [
    AuthService,
    AccessTokenGuard,
    InstanceApiTokenGuard,
    InternalTokenGuard,
    RolesGuard,
  ],
})
export class AuthModule {}
