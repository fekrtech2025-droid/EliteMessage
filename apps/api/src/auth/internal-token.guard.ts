import { timingSafeEqual } from 'node:crypto';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { loadWorkspaceEnv, parseApiEnv } from '@elite-message/config';

@Injectable()
export class InternalTokenGuard implements CanActivate {
  private readonly env;

  constructor() {
    loadWorkspaceEnv();
    this.env = parseApiEnv(process.env);
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<{ header: (name: string) => string | undefined }>();
    const authorizationHeader = request.header('authorization');

    if (!authorizationHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing internal authorization token.');
    }

    const providedToken = Buffer.from(
      authorizationHeader.slice('Bearer '.length).trim(),
    );
    const expectedToken = Buffer.from(this.env.API_INTERNAL_TOKEN);

    if (
      providedToken.length !== expectedToken.length ||
      !timingSafeEqual(providedToken, expectedToken)
    ) {
      throw new UnauthorizedException('Invalid internal authorization token.');
    }

    return true;
  }
}
