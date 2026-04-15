import { readFile } from 'node:fs/promises';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  CreateInstanceRequestSchema,
  RequestInstanceActionRequestSchema,
  UpdateInstanceSettingsRequestSchema,
  routePrefixes,
} from '@elite-message/contracts';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { RequireRoles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../common/current-user.decorator';
import type { RequestUser } from '../common/request-user';
import { InstancesService } from './instances.service';

@Controller(routePrefixes.customer)
@UseGuards(AccessTokenGuard, RolesGuard)
@RequireRoles('customer')
export class CustomerInstancesController {
  constructor(private readonly instancesService: InstancesService) {}

  @Get('instances')
  async listInstances(@CurrentUser() user: RequestUser) {
    return this.instancesService.listCustomerInstances(user.id);
  }

  @Post('instances')
  async createInstance(
    @CurrentUser() user: RequestUser,
    @Body() body: unknown,
  ) {
    const payload = CreateInstanceRequestSchema.parse(body);
    return this.instancesService.createCustomerInstance(user.id, payload);
  }

  @Get('instances/:instanceId')
  async getInstanceDetail(
    @CurrentUser() user: RequestUser,
    @Param('instanceId') instanceId: string,
  ) {
    return this.instancesService.getCustomerInstanceDetail(user.id, instanceId);
  }

  @Get('instances/:instanceId/screenshot')
  async getInstanceScreenshot(
    @CurrentUser() user: RequestUser,
    @Param('instanceId') instanceId: string,
    @Res() response: Response,
  ) {
    const screenshot =
      await this.instancesService.getCustomerInstanceScreenshot(
        user.id,
        instanceId,
      );
    const file = await readFile(screenshot.path);
    response.setHeader('content-type', 'image/png');
    response.setHeader('cache-control', 'no-store');
    response.setHeader(
      'content-disposition',
      `inline; filename="${screenshot.filename}"`,
    );
    return response.send(file);
  }

  @Patch('instances/:instanceId/settings')
  async updateInstanceSettings(
    @CurrentUser() user: RequestUser,
    @Param('instanceId') instanceId: string,
    @Body() body: unknown,
  ) {
    const payload = UpdateInstanceSettingsRequestSchema.parse(body);
    return this.instancesService.updateCustomerInstanceSettings(
      user.id,
      instanceId,
      payload,
    );
  }

  @Post('instances/:instanceId/actions')
  async requestInstanceAction(
    @CurrentUser() user: RequestUser,
    @Param('instanceId') instanceId: string,
    @Body() body: unknown,
  ) {
    const payload = RequestInstanceActionRequestSchema.parse(body);
    return this.instancesService.requestCustomerInstanceAction(
      user.id,
      instanceId,
      payload,
    );
  }

  @Post('instances/:instanceId/rotate-token')
  async rotateInstanceToken(
    @CurrentUser() user: RequestUser,
    @Param('instanceId') instanceId: string,
  ) {
    return this.instancesService.rotateCustomerInstanceToken(
      user.id,
      instanceId,
    );
  }
}
