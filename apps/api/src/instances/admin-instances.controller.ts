import { readFile } from 'node:fs/promises';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  RequestInstanceActionRequestSchema,
  routePrefixes,
} from '@elite-message/contracts';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { RequireRoles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../common/current-user.decorator';
import type { RequestUser } from '../common/request-user';
import { InstancesService } from './instances.service';

@Controller(routePrefixes.admin)
@UseGuards(AccessTokenGuard, RolesGuard)
@RequireRoles('platform_admin')
export class AdminInstancesController {
  constructor(private readonly instancesService: InstancesService) {}

  @Get('instances/:instanceId')
  async getInstanceDetail(@Param('instanceId') instanceId: string) {
    return this.instancesService.getAdminInstanceDetail(instanceId);
  }

  @Get('instances/:instanceId/screenshot')
  async getInstanceScreenshot(
    @Param('instanceId') instanceId: string,
    @Res() response: Response,
  ) {
    const screenshot =
      await this.instancesService.getAdminInstanceScreenshot(instanceId);
    const file = await readFile(screenshot.path);
    response.setHeader('content-type', 'image/png');
    response.setHeader('cache-control', 'no-store');
    response.setHeader(
      'content-disposition',
      `inline; filename="${screenshot.filename}"`,
    );
    return response.send(file);
  }

  @Post('instances/:instanceId/actions')
  async requestInstanceAction(
    @CurrentUser() user: RequestUser,
    @Param('instanceId') instanceId: string,
    @Body() body: unknown,
  ) {
    const payload = RequestInstanceActionRequestSchema.parse(body);
    return this.instancesService.requestAdminInstanceAction(
      user.id,
      instanceId,
      payload,
    );
  }
}
