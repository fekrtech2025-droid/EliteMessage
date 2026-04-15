import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ClearMessagesByStatusRequestSchema,
  type MessageAck,
  type MessageStatus,
  PublicResendByIdRequestSchema,
  PublicSendImageMessageRequestSchema,
  ResendMessagesByStatusRequestSchema,
  SendChatMessageRequestSchema,
  routePrefixes,
} from '@elite-message/contracts';
import { InstanceApiTokenGuard } from '../auth/instance-api-token.guard';
import { CurrentInstanceApi } from '../common/current-instance-api.decorator';
import type { InstanceApiPrincipal } from '../common/request-user';
import { MessagesService } from './messages.service';

function parseLimit(input: unknown) {
  const raw =
    typeof input === 'string' ? Number.parseInt(input, 10) : Number.NaN;
  if (!Number.isFinite(raw)) {
    return 25;
  }

  return Math.min(Math.max(raw, 1), 100);
}

@Controller(routePrefixes.perInstance)
@UseGuards(InstanceApiTokenGuard)
export class PublicMessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('messages/chat')
  async sendChatMessage(
    @CurrentInstanceApi() principal: InstanceApiPrincipal,
    @Body() body: unknown,
  ) {
    const payload = SendChatMessageRequestSchema.parse(body);
    return this.messagesService.sendPublicChatMessage(principal, payload);
  }

  @Post('messages/image')
  async sendImageMessage(
    @CurrentInstanceApi() principal: InstanceApiPrincipal,
    @Body() body: unknown,
  ) {
    const payload = PublicSendImageMessageRequestSchema.parse(body);
    return this.messagesService.sendPublicImageMessage(principal, {
      to: payload.to,
      imageUrl: payload.imageUrl ?? payload.image ?? '',
      caption: payload.caption ?? null,
      referenceId: payload.referenceId ?? null,
      priority: payload.priority,
    });
  }

  @Get('messages')
  async listMessages(
    @CurrentInstanceApi() principal: InstanceApiPrincipal,
    @Query('id') messageId?: string,
    @Query('status') status?: string,
    @Query('ack') ack?: string,
    @Query('to') recipient?: string,
    @Query('referenceId') referenceId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.messagesService.listPublicMessages(principal, {
      messageId,
      status: status as MessageStatus | undefined,
      ack: ack as MessageAck | undefined,
      recipient,
      referenceId,
      limit: parseLimit(limit),
    });
  }

  @Get('messages/statistics')
  async getMessageStatistics(
    @CurrentInstanceApi() principal: InstanceApiPrincipal,
  ) {
    return this.messagesService.getPublicMessageStatistics(principal);
  }

  @Post('messages/resendById')
  @HttpCode(200)
  async resendById(
    @CurrentInstanceApi() principal: InstanceApiPrincipal,
    @Body() body: unknown,
  ) {
    const payload = PublicResendByIdRequestSchema.parse(body);
    return this.messagesService.resendPublicMessage(principal, payload.id);
  }

  @Post('messages/resendByStatus')
  @HttpCode(200)
  async resendByStatus(
    @CurrentInstanceApi() principal: InstanceApiPrincipal,
    @Body() body: unknown,
  ) {
    const payload = ResendMessagesByStatusRequestSchema.parse(body);
    return this.messagesService.resendPublicMessagesByStatus(
      principal,
      payload,
    );
  }

  @Post('messages/clear')
  @HttpCode(200)
  async clearByStatus(
    @CurrentInstanceApi() principal: InstanceApiPrincipal,
    @Body() body: unknown,
  ) {
    const payload = ClearMessagesByStatusRequestSchema.parse(body);
    return this.messagesService.clearPublicMessagesByStatus(principal, payload);
  }
}
