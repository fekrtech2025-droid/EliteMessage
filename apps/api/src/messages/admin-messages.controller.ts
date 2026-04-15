import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type {
  MessageStatus,
  WebhookDeliveryStatus,
  WebhookEventType,
} from '@elite-message/contracts';
import { routePrefixes } from '@elite-message/contracts';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { RequireRoles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../common/current-user.decorator';
import type { RequestUser } from '../common/request-user';
import { MessagesService } from './messages.service';

function parseLimit(input: unknown) {
  const raw =
    typeof input === 'string' ? Number.parseInt(input, 10) : Number.NaN;
  if (!Number.isFinite(raw)) {
    return 25;
  }

  return Math.min(Math.max(raw, 1), 100);
}

@Controller(routePrefixes.admin)
@UseGuards(AccessTokenGuard, RolesGuard)
@RequireRoles('platform_admin')
export class AdminMessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('messages')
  async listMessages(
    @Query('instanceId') instanceId?: string,
    @Query('status') status?: string,
    @Query('to') recipient?: string,
    @Query('referenceId') referenceId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.messagesService.listAdminMessages({
      instanceId,
      status: status as MessageStatus | undefined,
      recipient,
      referenceId,
      limit: parseLimit(limit),
    });
  }

  @Get('webhook-deliveries')
  async listWebhookDeliveries(
    @Query('instanceId') instanceId?: string,
    @Query('status') status?: string,
    @Query('eventType') eventType?: string,
    @Query('limit') limit?: string,
  ) {
    return this.messagesService.listAdminWebhookDeliveries({
      instanceId,
      status: status as WebhookDeliveryStatus | undefined,
      eventType: eventType as WebhookEventType | undefined,
      limit: parseLimit(limit),
    });
  }

  @Get('inbound-messages')
  async listInboundMessages(
    @Query('instanceId') instanceId?: string,
    @Query('from') sender?: string,
    @Query('limit') limit?: string,
  ) {
    return this.messagesService.listAdminInboundMessages({
      instanceId,
      sender,
      limit: parseLimit(limit),
    });
  }

  @Post('webhook-deliveries/:deliveryId/replay')
  @HttpCode(200)
  async replayWebhookDelivery(
    @CurrentUser() user: RequestUser,
    @Param('deliveryId') deliveryId: string,
  ) {
    return this.messagesService.replayAdminWebhookDelivery(user.id, deliveryId);
  }
}
