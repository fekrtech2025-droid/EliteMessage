import { Module } from '@nestjs/common';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { AuthModule } from '../auth/auth.module';
import { OpsModule } from '../ops/ops.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { AdminMessagesController } from './admin-messages.controller';
import { CustomerMessagesController } from './customer-messages.controller';
import { InternalMessagesController } from './internal-messages.controller';
import { MessagesService } from './messages.service';
import { PublicCustomerMediaController } from './public-customer-media.controller';
import { PublicMessagesController } from './public-messages.controller';
import { WebhookDispatchService } from './webhook-dispatch.service';

@Module({
  imports: [AuthModule, RealtimeModule, AuditLogsModule, OpsModule],
  controllers: [
    CustomerMessagesController,
    PublicMessagesController,
    PublicCustomerMediaController,
    AdminMessagesController,
    InternalMessagesController,
  ],
  providers: [MessagesService, WebhookDispatchService],
  exports: [MessagesService],
})
export class MessagesModule {}
