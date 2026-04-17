import type { NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
export declare class RequestLoggerMiddleware implements NestMiddleware {
    use(request: Request, response: Response, next: NextFunction): void;
}
//# sourceMappingURL=request-logger.middleware.d.ts.map