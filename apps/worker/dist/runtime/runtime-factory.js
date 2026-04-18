"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionRuntime = createSessionRuntime;
const session_runtime_1 = require("./session-runtime");
const whatsapp_web_session_runtime_1 = require("./whatsapp-web-session-runtime");
function createSessionRuntime(env, runtimeOptions) {
    if (env.WORKER_SESSION_BACKEND === 'placeholder') {
        return {
            runtime: new session_runtime_1.PlaceholderSessionRuntime({
                ...runtimeOptions,
                placeholderQrDisplayMs: env.WORKER_PLACEHOLDER_QR_DISPLAY_MS,
            }),
            backend: 'placeholder',
        };
    }
    const browserExecutablePath = (0, whatsapp_web_session_runtime_1.resolveWorkerBrowserExecutablePath)(env.WORKER_WA_BROWSER_EXECUTABLE_PATH);
    if (!browserExecutablePath) {
        throw new Error(`WORKER_SESSION_BACKEND is "whatsapp_web" but no supported browser executable was found. Checked ${env.WORKER_WA_BROWSER_EXECUTABLE_PATH ?? 'default browser locations'}.`);
    }
    return {
        runtime: new whatsapp_web_session_runtime_1.WhatsAppWebSessionRuntime({
            ...runtimeOptions,
            browserExecutablePath,
            env,
        }),
        backend: 'whatsapp_web',
    };
}
//# sourceMappingURL=runtime-factory.js.map