import { readFile } from 'node:fs/promises';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import QRCode from 'qrcode';
import {
  PublicUpdateInstanceSettingsRequestSchema,
  routePrefixes,
  type InstanceAction,
  type RequestInstanceActionResponse,
} from '@elite-message/contracts';
import { InstanceApiTokenGuard } from '../auth/instance-api-token.guard';
import { CurrentInstanceApi } from '../common/current-instance-api.decorator';
import type { InstanceApiPrincipal } from '../common/request-user';
import { InstancesService } from './instances.service';

function assertAction(
  action: InstanceAction,
): Exclude<InstanceAction, 'reassign'> {
  if (action === 'reassign') {
    throw new NotFoundException();
  }

  return action;
}

@Controller(routePrefixes.perInstance)
@UseGuards(InstanceApiTokenGuard)
export class PublicInstancesController {
  constructor(private readonly instancesService: InstancesService) {}

  @Get('instance/status')
  async getStatus(@CurrentInstanceApi() principal: InstanceApiPrincipal) {
    return this.instancesService.getPublicInstanceStatus(principal);
  }

  @Get('instance/me')
  async getMe(@CurrentInstanceApi() principal: InstanceApiPrincipal) {
    return this.instancesService.getPublicInstanceMe(principal);
  }

  @Get('instance/settings')
  async getSettings(@CurrentInstanceApi() principal: InstanceApiPrincipal) {
    return this.instancesService.getPublicInstanceSettings(principal);
  }

  @Post('instance/settings')
  @HttpCode(200)
  async updateSettings(
    @CurrentInstanceApi() principal: InstanceApiPrincipal,
    @Body() body: unknown,
  ) {
    const payload = PublicUpdateInstanceSettingsRequestSchema.parse(body);
    return this.instancesService.updatePublicInstanceSettings(
      principal,
      payload,
    );
  }

  @Get('instance/qrCode')
  async getQrCode(@CurrentInstanceApi() principal: InstanceApiPrincipal) {
    return this.instancesService.getPublicInstanceQrCode(principal);
  }

  @Get('instance/qr')
  async getQr(
    @CurrentInstanceApi() principal: InstanceApiPrincipal,
    @Res() response: Response,
  ) {
    const qrCode =
      await this.instancesService.getPublicInstanceQrCode(principal);
    if (!qrCode.qrCode) {
      throw new NotFoundException(
        'No QR code is currently available for this instance.',
      );
    }

    const buffer = await QRCode.toBuffer(qrCode.qrCode, {
      margin: 1,
      width: 512,
    });

    response.setHeader('content-type', 'image/png');
    response.setHeader('cache-control', 'no-store');
    response.setHeader(
      'content-disposition',
      `inline; filename="${principal.instancePublicId}-qr.png"`,
    );
    return response.send(buffer);
  }

  @Post('instance/start')
  @HttpCode(200)
  async start(@CurrentInstanceApi() principal: InstanceApiPrincipal) {
    return this.requestAction(principal, 'start');
  }

  @Post('instance/stop')
  @HttpCode(200)
  async stop(@CurrentInstanceApi() principal: InstanceApiPrincipal) {
    return this.requestAction(principal, 'stop');
  }

  @Post('instance/restart')
  @HttpCode(200)
  async restart(@CurrentInstanceApi() principal: InstanceApiPrincipal) {
    return this.requestAction(principal, 'restart');
  }

  @Post('instance/logout')
  @HttpCode(200)
  async logout(@CurrentInstanceApi() principal: InstanceApiPrincipal) {
    return this.requestAction(principal, 'logout');
  }

  @Post('instance/clear')
  @HttpCode(200)
  async clear(@CurrentInstanceApi() principal: InstanceApiPrincipal) {
    return this.requestAction(principal, 'clear');
  }

  @Post('instance/takeover')
  @HttpCode(200)
  async takeover(@CurrentInstanceApi() principal: InstanceApiPrincipal) {
    return this.requestAction(principal, 'takeover');
  }

  @Get('instance/screenshot')
  async getScreenshot(
    @CurrentInstanceApi() principal: InstanceApiPrincipal,
    @Query('encoding') encoding: string | undefined,
    @Res() response: Response,
  ) {
    const screenshot =
      await this.instancesService.getPublicInstanceScreenshot(principal);
    const file = await readFile(screenshot.path);

    if (encoding === 'base64') {
      return response.send({
        publicId: screenshot.publicId,
        filename: screenshot.filename,
        capturedAt: screenshot.capturedAt,
        mimeType: 'image/png',
        data: file.toString('base64'),
      });
    }

    response.setHeader('content-type', 'image/png');
    response.setHeader('cache-control', 'no-store');
    response.setHeader(
      'content-disposition',
      `inline; filename="${screenshot.filename}"`,
    );
    return response.send(file);
  }

  private requestAction(
    principal: InstanceApiPrincipal,
    action: Exclude<InstanceAction, 'reassign'>,
  ): Promise<RequestInstanceActionResponse> {
    return this.instancesService.requestPublicInstanceAction(principal, {
      action: assertAction(action),
    });
  }
}
