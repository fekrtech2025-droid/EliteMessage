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
    app.enableCors({
        origin(origin, callback) {
            if (!origin) {
                callback(null, false);
                return;
            }
            const normalizedOrigin = normalizeOrigin(origin);
            const allowed = corsOriginSet.has('*') || corsOriginSet.has(normalizedOrigin);
            (0, api_debug_1.writeApiDebugLog)('cors.origin.checked', {
                origin,
                normalizedOrigin,
                allowed,
                configuredOrigins: corsOrigins,
            });
            callback(null, allowed ? normalizedOrigin : false);
        },
        credentials: true,
    });
    (0, api_debug_1.writeApiDebugLog)('bootstrap.cors.enabled');
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