import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CreateAccountApiTokenRequestSchema,
  UpdateAccountProfileRequestSchema,
  UpdateAccountThemePreferenceRequestSchema,
  routePrefixes,
} from '@elite-message/contracts';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { CurrentUser } from '../common/current-user.decorator';
import type { RequestUser } from '../common/request-user';
import { AccountsService } from './accounts.service';

@Controller(routePrefixes.account)
@UseGuards(AccessTokenGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('me')
  async getMe(@CurrentUser() user: RequestUser) {
    return this.accountsService.getAccountMe(user.id);
  }

  @Patch('me')
  async updateMe(@CurrentUser() user: RequestUser, @Body() body: unknown) {
    const payload = UpdateAccountProfileRequestSchema.parse(body);
    return this.accountsService.updateAccountProfile(user.id, payload);
  }

  @Patch('me/theme')
  async updateTheme(@CurrentUser() user: RequestUser, @Body() body: unknown) {
    const parsedBody =
      UpdateAccountThemePreferenceRequestSchema.safeParse(body);
    if (!parsedBody.success) {
      throw new BadRequestException(
        parsedBody.error.issues[0]?.message ??
          'Invalid theme preference payload.',
      );
    }

    const payload = parsedBody.data;
    return this.accountsService.updateAccountThemePreference(user.id, payload);
  }

  @Get('subscription')
  async getSubscription(
    @CurrentUser() user: RequestUser,
    @Query('workspaceId') workspaceId?: string,
  ) {
    return this.accountsService.getWorkspaceSubscription(user.id, workspaceId);
  }

  @Get('api-tokens')
  async listApiTokens(
    @CurrentUser() user: RequestUser,
    @Query('workspaceId') workspaceId?: string,
  ) {
    return this.accountsService.listAccountApiTokens(user.id, workspaceId);
  }

  @Post('api-tokens')
  async createApiToken(
    @CurrentUser() user: RequestUser,
    @Body() body: unknown,
  ) {
    const payload = CreateAccountApiTokenRequestSchema.parse(body);
    return this.accountsService.createAccountApiToken(user.id, payload);
  }

  @Post('api-tokens/:tokenId/rotate')
  async rotateApiToken(
    @CurrentUser() user: RequestUser,
    @Param('tokenId') tokenId: string,
  ) {
    return this.accountsService.rotateAccountApiToken(user.id, tokenId);
  }
}
