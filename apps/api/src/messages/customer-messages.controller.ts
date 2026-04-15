import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ClearMessagesByStatusRequestSchema,
  type MessageStatus,
  ResendMessagesByStatusRequestSchema,
  SendChatMessageRequestSchema,
  SendImageMessageRequestSchema,
  type WebhookDeliveryStatus,
  type WebhookEventType,
  routePrefixes,
} from '@elite-message/contracts';
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

@Controller(routePrefixes.customer)
@UseGuards(AccessTokenGuard, RolesGuard)
@RequireRoles('customer')
export class CustomerMessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('messages')
  async listWorkspaceMessages(
    @CurrentUser() user: RequestUser,
    @Query('workspaceId') workspaceId?: string,
    @Query('instanceId') instanceId?: string,
    @Query('status') status?: string,
    @Query('to') recipient?: string,
    @Query('referenceId') referenceId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.messagesService.listWorkspaceCustomerMessages(user.id, {
      workspaceId,
      instanceId,
      status: status as MessageStatus | undefined,
      recipient,
      referenceId,
      limit: parseLimit(limit),
    });
  }

  @Get('inbound-messages')
  async listWorkspaceInboundMessages(
    @CurrentUser() user: RequestUser,
    @Query('workspaceId') workspaceId?: string,
    @Query('instanceId') instanceId?: string,
    @Query('from') sender?: string,
    @Query('limit') limit?: string,
  ) {
    return this.messagesService.listWorkspaceCustomerInboundMessages(user.id, {
      workspaceId,
      instanceId,
      sender,
      limit: parseLimit(limit),
    });
  }

  @Get('instances/:instanceId/messages')
  async listMessages(
    @CurrentUser() user: RequestUser,
    @Param('instanceId') instanceId: string,
    @Query('status') status?: string,
    @Query('to') recipient?: string,
    @Query('referenceId') referenceId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.messagesService.listCustomerMessages(user.id, instanceId, {
      status: status as MessageStatus | undefined,
      recipient,
      referenceId,
      limit: parseLimit(limit),
    });
  }

  @Get('instances/:instanceId/webhook-deliveries')
  async listWebhookDeliveries(
    @CurrentUser() user: RequestUser,
    @Param('instanceId') instanceId: string,
    @Query('status') status?: string,
    @Query('eventType') eventType?: string,
    @Query('limit') limit?: string,
  ) {
    return this.messagesService.listCustomerWebhookDeliveries(
      user.id,
      instanceId,
      {
        status: status as WebhookDeliveryStatus | undefined,
        eventType: eventType as WebhookEventType | undefined,
        limit: parseLimit(limit),
      },
    );
  }

  @Get('instances/:instanceId/inbound-messages')
  async listInboundMessages(
    @CurrentUser() user: RequestUser,
    @Param('instanceId') instanceId: string,
    @Query('from') sender?: string,
    @Query('limit') limit?: string,
  ) {
    return this.messagesService.listCustomerInboundMessages(
      user.id,
      instanceId,
      {
        sender,
        limit: parseLimit(limit),
      },
    );
  }

  @Post('instances/:instanceId/messages/chat')
  async sendChatMessage(
    @CurrentUser() user: RequestUser,
    @Param('instanceId') instanceId: string,
    @Body() body: unknown,
  ) {
    const payload = SendChatMessageRequestSchema.parse(body);
    return this.messagesService.sendCustomerChatMessage(
      user.id,
      instanceId,
      payload,
    );
  }

  @Post('instances/:instanceId/messages/image')
  async sendImageMessage(
    @CurrentUser() user: RequestUser,
    @Param('instanceId') instanceId: string,
    @Body() body: unknown,
  ) {
    const payload = SendImageMessageRequestSchema.parse(body);
    return this.messagesService.sendCustomerImageMessage(
      user.id,
      instanceId,
      payload,
    );
  }

  @Post('instances/:instanceId/messages/image-upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndSendImageMessage(
    @CurrentUser() user: RequestUser,
    @Param('instanceId') instanceId: string,
    @UploadedFile()
    file:
      | {
          originalname?: string;
          mimetype?: string;
          buffer?: Buffer;
        }
      | undefined,
    @Body() body: Record<string, unknown>,
  ) {
    const recipient = typeof body.to === 'string' ? body.to.trim() : '';
    if (!recipient) {
      throw new BadRequestException('Recipient is required.');
    }

    const priority =
      typeof body.priority === 'string'
        ? Number.parseInt(body.priority, 10)
        : Number.NaN;
    return this.messagesService.sendCustomerUploadedImageMessage(
      user.id,
      instanceId,
      {
        to: recipient,
        caption:
          typeof body.caption === 'string' && body.caption.trim() !== ''
            ? body.caption
            : null,
        referenceId:
          typeof body.referenceId === 'string' && body.referenceId.trim() !== ''
            ? body.referenceId.trim()
            : null,
        priority: Number.isFinite(priority) ? priority : 100,
      },
      {
        originalName: file?.originalname ?? 'upload.bin',
        mimeType: file?.mimetype ?? 'application/octet-stream',
        buffer: file?.buffer ?? Buffer.alloc(0),
      },
    );
  }

  @Get('instances/:instanceId/messages/statistics')
  async getMessageStatistics(
    @CurrentUser() user: RequestUser,
    @Param('instanceId') instanceId: string,
  ) {
    return this.messagesService.getCustomerMessageStatistics(
      user.id,
      instanceId,
    );
  }

  @Post('instances/:instanceId/messages/:messageId/resend')
  @HttpCode(200)
  async resendMessage(
    @CurrentUser() user: RequestUser,
    @Param('instanceId') instanceId: string,
    @Param('messageId') messageId: string,
  ) {
    return this.messagesService.resendCustomerMessage(
      user.id,
      instanceId,
      messageId,
    );
  }

  @Post('instances/:instanceId/messages/resend-by-status')
  @HttpCode(200)
  async resendMessagesByStatus(
    @CurrentUser() user: RequestUser,
    @Param('instanceId') instanceId: string,
    @Body() body: unknown,
  ) {
    const payload = ResendMessagesByStatusRequestSchema.parse(body);
    return this.messagesService.resendCustomerMessagesByStatus(
      user.id,
      instanceId,
      payload,
    );
  }

  @Post('instances/:instanceId/messages/clear')
  @HttpCode(200)
  async clearMessagesByStatus(
    @CurrentUser() user: RequestUser,
    @Param('instanceId') instanceId: string,
    @Body() body: unknown,
  ) {
    const payload = ClearMessagesByStatusRequestSchema.parse(body);
    return this.messagesService.clearCustomerMessagesByStatus(
      user.id,
      instanceId,
      payload,
    );
  }
}
