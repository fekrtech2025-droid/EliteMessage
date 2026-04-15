import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  AdminMfaVerifyRequestSchema,
  GoogleAuthModeSchema,
  LoginRequestSchema,
  SignupRequestSchema,
  routePrefixes,
} from '@elite-message/contracts';
import { CurrentUser } from '../common/current-user.decorator';
import type { RequestUser } from '../common/request-user';
import { AccessTokenGuard } from './access-token.guard';
import {
  AuthService,
  googleStateCookieName,
  refreshCookieName,
} from './auth.service';
import { RequireRoles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller(routePrefixes.auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() body: unknown,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const payload = SignupRequestSchema.parse(body);
    const result = await this.authService.signup(
      payload,
      this.getRequestMetadata(request),
    );
    response.cookie(
      refreshCookieName,
      result.refreshToken,
      this.authService.buildRefreshCookieOptions(result.refreshExpiresAt),
    );
    return result.response;
  }

  @Post('login')
  async login(
    @Body() body: unknown,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const payload = LoginRequestSchema.parse(body);
    const result = await this.authService.login(
      payload,
      this.getRequestMetadata(request),
    );
    response.cookie(
      refreshCookieName,
      result.refreshToken,
      this.authService.buildRefreshCookieOptions(result.refreshExpiresAt),
    );
    return result.response;
  }

  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = this.authService.extractRefreshToken(
      request.headers.cookie,
    );
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh session.');
    }

    const result = await this.authService.refresh(
      refreshToken,
      this.getRequestMetadata(request),
    );
    response.cookie(
      refreshCookieName,
      result.refreshToken,
      this.authService.buildRefreshCookieOptions(result.refreshExpiresAt),
    );
    return result.response;
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = this.authService.extractRefreshToken(
      request.headers.cookie,
    );
    await this.authService.logout(refreshToken);
    response.clearCookie(
      refreshCookieName,
      this.authService.buildClearRefreshCookieOptions(),
    );
    return { success: true };
  }

  @Get('google/authorize')
  authorizeWithGoogle(
    @Query('mode') mode: string | undefined,
    @Res() response: Response,
  ) {
    const parsedMode = GoogleAuthModeSchema.catch('login').parse(mode);
    const result = this.authService.startGoogleAuthorization(parsedMode);

    if (result.stateCookieValue && result.stateExpiresAt) {
      response.cookie(
        googleStateCookieName,
        result.stateCookieValue,
        this.authService.buildGoogleStateCookieOptions(result.stateExpiresAt),
      );
    }

    return response.redirect(result.redirectUrl);
  }

  @Get('google/callback')
  async handleGoogleCallback(
    @Query('code') code: string | string[] | undefined,
    @Query('state') state: string | string[] | undefined,
    @Query('error') error: string | string[] | undefined,
    @Query('error_description') errorDescription: string | string[] | undefined,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const result = await this.authService.completeGoogleAuthorization(
      {
        code: this.readSingleQueryValue(code),
        state: this.readSingleQueryValue(state),
        error: this.readSingleQueryValue(error),
        errorDescription: this.readSingleQueryValue(errorDescription),
      },
      this.authService.extractGoogleStateCookie(request.headers.cookie),
      this.getRequestMetadata(request),
    );

    response.clearCookie(
      googleStateCookieName,
      this.authService.buildClearGoogleStateCookieOptions(),
    );

    if (result.refreshToken && result.refreshExpiresAt) {
      response.cookie(
        refreshCookieName,
        result.refreshToken,
        this.authService.buildRefreshCookieOptions(result.refreshExpiresAt),
      );
    }

    return response.redirect(result.redirectUrl);
  }

  @Get('admin/mfa')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @RequireRoles('platform_admin')
  async getAdminMfaStatus(@CurrentUser() user: RequestUser) {
    return this.authService.getAdminMfaStatus(user.id);
  }

  @Post('admin/mfa/challenge')
  @HttpCode(200)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @RequireRoles('platform_admin')
  async createAdminMfaChallenge(@CurrentUser() user: RequestUser) {
    return this.authService.createAdminMfaChallenge(user.id);
  }

  @Post('admin/mfa/verify')
  @HttpCode(200)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @RequireRoles('platform_admin')
  async verifyAdminMfaChallenge(
    @CurrentUser() user: RequestUser,
    @Body() body: unknown,
  ) {
    const payload = AdminMfaVerifyRequestSchema.parse(body);
    return this.authService.verifyAdminMfaChallenge(user.id, payload);
  }

  private getRequestMetadata(request: Request) {
    return {
      userAgent: request.header('user-agent'),
      ipAddress: request.ip ?? request.socket.remoteAddress ?? null,
    };
  }

  private readSingleQueryValue(value: string | string[] | undefined) {
    if (typeof value === 'string') {
      return value;
    }

    return Array.isArray(value) && typeof value[0] === 'string'
      ? value[0]
      : undefined;
  }
}
