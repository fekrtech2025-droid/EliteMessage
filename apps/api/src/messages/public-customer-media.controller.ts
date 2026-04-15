import { Controller, Get, Param, Res } from '@nestjs/common';
import { routePrefixes } from '@elite-message/contracts';
import type { Response } from 'express';
import { MessagesService } from './messages.service';

@Controller(routePrefixes.public)
export class PublicCustomerMediaController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('customer-media/:assetId/:fileName')
  async getCustomerMediaAsset(
    @Param('assetId') assetId: string,
    @Param('fileName') fileName: string,
    @Res() response: Response,
  ) {
    const asset = await this.messagesService.readPublicCustomerMediaAsset(
      assetId,
      fileName,
    );
    const content = await import('node:fs/promises').then(({ readFile }) =>
      readFile(asset.filePath),
    );

    response.setHeader('content-type', asset.contentType);
    response.setHeader('cache-control', 'public, max-age=3600');
    response.send(content);
  }
}
