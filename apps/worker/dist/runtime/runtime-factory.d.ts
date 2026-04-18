import type { WorkerEnv } from '@elite-message/config';
import type { SessionRuntime, SessionRuntimeOptions } from './session-runtime';
export type SelectedSessionBackend = 'placeholder' | 'whatsapp_web';
export declare function createSessionRuntime(env: WorkerEnv, runtimeOptions: SessionRuntimeOptions): {
    runtime: SessionRuntime;
    backend: SelectedSessionBackend;
};
//# sourceMappingURL=runtime-factory.d.ts.map