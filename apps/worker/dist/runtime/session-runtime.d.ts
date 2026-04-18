import type { AppLogger } from '@elite-message/config';
import type { InternalWorkerAssignedInstance } from '@elite-message/contracts';
import { InternalApiClient } from '../internal-api/client';
export type SessionRuntimeOptions = {
    internalApi: InternalApiClient;
    logger: AppLogger;
    workerId: string;
    placeholderQrDisplayMs?: number;
};
export interface SessionRuntime {
    start(): Promise<void>;
    stop(): Promise<void>;
    syncAssignedInstances(instances: InternalWorkerAssignedInstance[]): void;
    processAssignments(): Promise<void>;
    removeInstance(instanceId: string): void;
    getActiveInstanceCount(): number;
}
export declare class PlaceholderSessionRuntime implements SessionRuntime {
    private readonly options;
    private readonly managedInstances;
    private stopping;
    constructor(options: SessionRuntimeOptions);
    start(): Promise<void>;
    stop(): Promise<void>;
    syncAssignedInstances(instances: InternalWorkerAssignedInstance[]): void;
    processAssignments(): Promise<void>;
    removeInstance(instanceId: string): void;
    getActiveInstanceCount(): number;
    private runOperation;
    private runNextMessage;
    private runStartSequence;
    private runBootAndLinkSequence;
    private runRestartSequence;
    private runStopSequence;
    private runLogoutSequence;
    private runClearSequence;
    private runTakeoverSequence;
    private processOutboundMessage;
    private transitionStatus;
    private updateRuntime;
    private completeOperation;
    private failOperation;
    private generateQrPayload;
    private generateSessionLabel;
    private buildDiagnostics;
    private validateOutboundMessage;
}
//# sourceMappingURL=session-runtime.d.ts.map