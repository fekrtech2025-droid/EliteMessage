import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { createLogger } from '@elite-message/config';
import { requestContext } from './request-context';

function sanitizeRequestPath(originalUrl: string) {
  try {
    const url = new URL(originalUrl, 'http://localhost');
    for (const field of ['token', 'access_token']) {
      if (url.searchParams.has(field)) {
        url.searchParams.set(field, '[redacted]');
      }
    }

    const query = url.searchParams.toString();
    return query ? `${url.pathname}?${query}` : url.pathname;
  } catch {
    return originalUrl.replace(
      /([?&](?:token|access_token)=)[^&]+/gi,
      '$1[redacted]',
    );
  }
}

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const requestId = requestContext.getStore()?.requestId;
    const logger = createLogger({ service: 'api', requestId });
    const startedAt = Date.now();
    const sanitizedPath = sanitizeRequestPath(request.originalUrl);

    logger.info(
      { method: request.method, path: sanitizedPath },
      'request.started',
    );

    response.on('finish', () => {
      logger.info(
        {
          method: request.method,
          path: sanitizedPath,
          statusCode: response.statusCode,
          durationMs: Date.now() - startedAt,
        },
        'request.completed',
      );
    });

    next();
  }
}
