import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { RequestContextMiddleware } from './common/request-context.middleware';
import { RequestLoggerMiddleware } from './common/request-logger.middleware';
import { InstancesModule } from './instances/instances.module';
import { MetaModule } from './meta/meta.module';
import { RealtimeModule } from './realtime/realtime.module';
import { WorkerOrchestrationModule } from './worker-orchestration/worker-orchestration.module';
import { MessagesModule } from './messages/messages.module';
import { OpsModule } from './ops/ops.module';
import { RateLimitMiddleware } from './ops/rate-limit.middleware';
import { SupportCasesModule } from './support-cases/support-cases.module';

@Module({
  imports: [
    HealthModule,
    MetaModule,
    AuthModule,
    AuditLogsModule,
    AccountsModule,
    InstancesModule,
    MessagesModule,
    SupportCasesModule,
    OpsModule,
    RealtimeModule,
    WorkerOrchestrationModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        RequestContextMiddleware,
        RequestLoggerMiddleware,
        RateLimitMiddleware,
      )
      .forRoutes('*');
  }
}
