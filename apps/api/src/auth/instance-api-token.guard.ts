import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import type { AppRequest } from '../common/request-user';
import { AuthService } from './auth.service';

function readTokenValue(input: unknown): string | undefined {
  if (typeof input === 'string') {
    const trimmed = input.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (Array.isArray(input)) {
    return input
      .map((value) => readTokenValue(value))
      .find((value): value is string => Boolean(value));
  }

  return undefined;
}

function extractInstanceApiToken(request: Request): string | undefined {
  const authorizationHeader = request.header('authorization');
  if (authorizationHeader?.startsWith('Bearer ')) {
    const bearerToken = authorizationHeader.slice('Bearer '.length).trim();
    if (bearerToken.length > 0) {
      return bearerToken;
    }
  }

  const queryToken = readTokenValue(
    (request.query as Record<string, unknown> | undefined)?.token,
  );
  if (queryToken) {
    return queryToken;
  }

  const bodyToken = readTokenValue(
    (request.body as Record<string, unknown> | undefined)?.token,
  );
  if (bodyToken) {
    return bodyToken;
  }

  return undefined;
}

@Injectable()
export class InstanceApiTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & AppRequest>();
    const instancePathId = readTokenValue(request.params?.instanceId);
    const token = extractInstanceApiToken(request);

    if (!instancePathId) {
      throw new UnauthorizedException('Missing target instance identifier.');
    }

    if (!token) {
      throw new UnauthorizedException('Missing instance API token.');
    }

    request.instanceApi = await this.authService.authenticateInstanceApiToken(
      instancePathId,
      token,
    );
    return true;
  }
}
