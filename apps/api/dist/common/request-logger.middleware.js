"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@elite-message/config");
const request_context_1 = require("./request-context");
function sanitizeRequestPath(originalUrl) {
    try {
        const url = new URL(originalUrl, 'http://localhost');
        for (const field of ['token', 'access_token']) {
            if (url.searchParams.has(field)) {
                url.searchParams.set(field, '[redacted]');
            }
        }
        const query = url.searchParams.toString();
        return query ? `${url.pathname}?${query}` : url.pathname;
    }
    catch {
        return originalUrl.replace(/([?&](?:token|access_token)=)[^&]+/gi, '$1[redacted]');
    }
}
let RequestLoggerMiddleware = class RequestLoggerMiddleware {
    use(request, response, next) {
        const requestId = request_context_1.requestContext.getStore()?.requestId;
        const logger = (0, config_1.createLogger)({ service: 'api', requestId });
        const startedAt = Date.now();
        const sanitizedPath = sanitizeRequestPath(request.originalUrl);
        logger.info({ method: request.method, path: sanitizedPath }, 'request.started');
        response.on('finish', () => {
            logger.info({
                method: request.method,
                path: sanitizedPath,
                statusCode: response.statusCode,
                durationMs: Date.now() - startedAt,
            }, 'request.completed');
        });
        next();
    }
};
exports.RequestLoggerMiddleware = RequestLoggerMiddleware;
exports.RequestLoggerMiddleware = RequestLoggerMiddleware = __decorate([
    (0, common_1.Injectable)()
], RequestLoggerMiddleware);
//# sourceMappingURL=request-logger.middleware.js.map