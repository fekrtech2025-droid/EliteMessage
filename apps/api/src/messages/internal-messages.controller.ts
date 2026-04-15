import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  InternalClaimNextOutboundMessageRequestSchema,
  InternalReceiveInboundMessageRequestSchema,
  InternalUpdateOutboundMessageRequestSchema,
  routePrefixes,
} from '@elite-message/contracts';
import { InternalTokenGuard } from '../auth/internal-token.guard';
import { MessagesService } from './messages.service';

@Controller(routePrefixes.internal)
@UseGuards(InternalTokenGuard)
export class InternalMessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('instances/:instanceId/messages/claim-next')
  @HttpCode(200)
  async claimNextOutboundMessage(
    @Param('instanceId') instanceId: string,
    @Body() body: unknown,
  ) {
    const payload = InternalClaimNextOutboundMessageRequestSchema.parse(body);
    return this.messagesService.claimNextOutboundMessage(instanceId, payload);
  }

  @Post('instances/:instanceId/messages/:messageId/status')
  @HttpCode(200)
  async updateOutboundMessage(
    @Param('instanceId') instanceId: string,
    @Param('messageId') messageId: string,
    @Body() body: unknown,
  ) {
    const payload = InternalUpdateOutboundMessageRequestSchema.parse(body);
    return this.messagesService.updateOutboundMessage(
      instanceId,
      messageId,
      payload,
    );
  }

  @Post('instances/:instanceId/messages/received')
  @HttpCode(200)
  async receiveInboundMessage(
    @Param('instanceId') instanceId: string,
    @Body() body: unknown,
  ) {
    const payload = InternalReceiveInboundMessageRequestSchema.parse(body);
    return this.messagesService.receiveInboundMessage(instanceId, payload);
  }
}
