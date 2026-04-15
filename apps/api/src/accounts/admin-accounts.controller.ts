import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ExtendAdminWorkspaceTrialRequestSchema,
  UpdateAdminUserStatusRequestSchema,
  UpdateAdminWorkspaceStatusRequestSchema,
  routePrefixes,
} from '@elite-message/contracts';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { RequireRoles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../common/current-user.decorator';
import type { RequestUser } from '../common/request-user';
import { AccountsService } from './accounts.service';

@Controller(routePrefixes.admin)
@UseGuards(AccessTokenGuard, RolesGuard)
@RequireRoles('platform_admin')
export class AdminAccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('users')
  async listUsers() {
    return this.accountsService.listAdminUsers();
  }

  @Get('users/:userId')
  async getUserDetail(@Param('userId') userId: string) {
    return this.accountsService.getAdminUserDetail(userId);
  }

  @Patch('users/:userId/status')
  async updateUserStatus(
    @CurrentUser() user: RequestUser,
    @Param('userId') userId: string,
    @Body() body: unknown,
  ) {
    const payload = UpdateAdminUserStatusRequestSchema.parse(body);
    return this.accountsService.updateAdminUserStatus(user.id, userId, payload);
  }

  @Get('workspaces')
  async listWorkspaces() {
    return this.accountsService.listAdminWorkspaces();
  }

  @Get('workspaces/:workspaceId')
  async getWorkspaceDetail(@Param('workspaceId') workspaceId: string) {
    return this.accountsService.getAdminWorkspaceDetail(workspaceId);
  }

  @Patch('workspaces/:workspaceId/status')
  async updateWorkspaceStatus(
    @CurrentUser() user: RequestUser,
    @Param('workspaceId') workspaceId: string,
    @Body() body: unknown,
  ) {
    const payload = UpdateAdminWorkspaceStatusRequestSchema.parse(body);
    return this.accountsService.updateAdminWorkspaceStatus(
      user.id,
      workspaceId,
      payload,
    );
  }

  @Post('workspaces/:workspaceId/extend-trial')
  @HttpCode(200)
  async extendWorkspaceTrial(
    @CurrentUser() user: RequestUser,
    @Param('workspaceId') workspaceId: string,
    @Body() body: unknown,
  ) {
    const payload = ExtendAdminWorkspaceTrialRequestSchema.parse(body);
    return this.accountsService.extendAdminWorkspaceTrial(
      user.id,
      workspaceId,
      payload,
    );
  }
}
