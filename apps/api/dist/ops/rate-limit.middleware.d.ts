import type { NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { RateLimitService } from './rate-limit.service';
export declare class RateLimitMiddleware implements NestMiddleware {
    private readonly rateLimitService;
    constructor(rateLimitService: RateLimitService);
    use(request: Request, response: Response, next: NextFunction): void;
}
//# sourceMappingURL=rate-limit.middleware.d.ts.map