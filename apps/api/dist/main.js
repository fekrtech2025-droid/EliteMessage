"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const config_1 = require("@elite-message/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    (0, config_1.loadWorkspaceEnv)();
    const env = (0, config_1.parseApiEnv)(process.env);
    const logger = (0, config_1.createLogger)({ service: 'api' });
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: false });
    app.enableCors({
        origin: env.API_CORS_ORIGINS.split(','),
        credentials: true,
    });
    await app.listen(env.API_PORT);
    logger.info({ port: env.API_PORT, baseUrl: env.API_BASE_URL }, 'api.started');
}
void bootstrap();
//# sourceMappingURL=main.js.map