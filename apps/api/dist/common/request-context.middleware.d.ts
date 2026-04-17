import type { NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
export declare class RequestContextMiddleware implements NestMiddleware {
    use(request: Request, response: Response, next: NextFunction): void;
}
//# sourceMappingURL=request-context.middleware.d.ts.map