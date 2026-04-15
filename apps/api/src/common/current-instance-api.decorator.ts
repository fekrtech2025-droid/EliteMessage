import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { AppRequest } from './request-user';

export const CurrentInstanceApi = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AppRequest>();
    return request.instanceApi;
  },
);
