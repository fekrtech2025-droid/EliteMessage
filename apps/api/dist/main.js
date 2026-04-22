"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const config_1 = require("@elite-message/config");
const app_module_1 = require("./app.module");
const api_debug_1 = require("./common/api-debug");
process.on('uncaughtException', (error) => {
    (0, api_debug_1.writeApiDebugLog)('process.uncaughtException', { error });
});
process.on('unhandledRejection', (reason) => {
    (0, api_debug_1.writeApiDebugLog)('process.unhandledRejection', { reason });
});
function parseCorsOrigins(rawOrigins) {
    return rawOrigins
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
}
function normalizeOrigin(origin) {
    try {
        return new URL(origin).origin;
    }
    catch {
        return origin.trim();
    }
}
function getHeaderValue(value) {
    return Array.isArray(value) ? value.join(',') : value;
}
async function bootstrap() {
    (0, api_debug_1.writeApiDebugLog)('bootstrap.start', {
        argv: process.argv,
        envPort: process.env.PORT ?? null,
        envApiPort: process.env.API_PORT ?? null,
        nodeEnv: process.env.NODE_ENV ?? null,
    });
    const envFiles = (0, config_1.loadWorkspaceEnv)();
    (0, api_debug_1.writeApiDebugLog)('bootstrap.env.loaded', { envFiles });
    const env = (0, config_1.parseApiEnv)(process.env);
    (0, api_debug_1.writeApiDebugLog)('bootstrap.env.parsed', {
        apiPort: env.API_PORT,
        apiBaseUrl: env.API_BASE_URL,
        apiCorsOrigins: env.API_CORS_ORIGINS.split(','),
    });
    const logger = (0, config_1.createLogger)({ service: 'api' });
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: false });
    (0, api_debug_1.writeApiDebugLog)('bootstrap.nest.created');
    const corsOrigins = parseCorsOrigins(env.API_CORS_ORIGINS);
    const corsOriginSet = new Set(corsOrigins.map((origin) => normalizeOrigin(origin)));
    app.use((request, response, next) => {
        const origin = getHeaderValue(request.headers.origin);
        const normalizedOrigin = origin ? normalizeOrigin(origin) : null;
        const allowed = normalizedOrigin !== null &&
            (corsOriginSet.has('*') || corsOriginSet.has(normalizedOrigin));
        if (origin || request.method === 'OPTIONS') {
            (0, api_debug_1.writeApiDebugLog)('cors.manual.checked', {
                method: request.method,
                path: request.originalUrl ?? request.url,
                origin: origin ?? null,
                normalizedOrigin,
                allowed,
                configuredOrigins: corsOrigins,
            });
        }
        if (allowed && normalizedOrigin) {
            const requestedHeaders = getHeaderValue(request.headers['access-control-request-headers']);
            response.vary('Origin');
            response.vary('Access-Control-Request-Headers');
            response.setHeader('Access-Control-Allow-Origin', normalizedOrigin);
            response.setHeader('Access-Control-Allow-Credentials', 'true');
            response.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
            response.setHeader('Access-Control-Allow-Headers', requestedHeaders ?? 'authorization,content-type');
        }
        if (request.method === 'OPTIONS') {
            response.status(204).send();
            return;
        }
        next();
    });
    (0, api_debug_1.writeApiDebugLog)('bootstrap.manual_cors.enabled');
    await app.listen(env.API_PORT);
    (0, api_debug_1.writeApiDebugLog)('bootstrap.listen.ready', {
        apiPort: env.API_PORT,
        apiBaseUrl: env.API_BASE_URL,
    });
    logger.info({ port: env.API_PORT, baseUrl: env.API_BASE_URL }, 'api.started');
}
void bootstrap().catch((error) => {
    (0, api_debug_1.writeApiDebugLog)('bootstrap.failed', { error });
    setImmediate(() => {
        throw error;
    });
});
//# sourceMappingURL=main.js.map