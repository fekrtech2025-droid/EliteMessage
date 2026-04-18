"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceholderSessionRuntime = void 0;
const node_crypto_1 = require("node:crypto");
function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms).unref();
    });
}
class PlaceholderSessionRuntime {
    options;
    managedInstances = new Map();
    stopping = false;
    constructor(options) {
        this.options = options;
    }
    async start() {
        this.stopping = false;
    }
    async stop() {
        this.stopping = true;
        await Promise.allSettled([...this.managedInstances.values()]
            .flatMap((entry) => [entry.processingPromise, entry.messagePromise])
            .filter((promise) => Boolean(promise)));
    }
    syncAssignedInstances(instances) {
        const nextIds = new Set(instances.map((instance) => instance.id));
        for (const instance of instances) {
            const existing = this.managedInstances.get(instance.id);
            this.managedInstances.set(instance.id, {
                snapshot: instance,
                processingOperationId: existing?.processingOperationId,
                processingPromise: existing?.processingPromise,
                processingMessageId: existing?.processingMessageId,
                messagePromise: existing?.messagePromise,
            });
        }
        for (const instanceId of this.managedInstances.keys()) {
            if (nextIds.has(instanceId)) {
                continue;
            }
            this.managedInstances.delete(instanceId);
        }
    }
    async processAssignments() {
        for (const [instanceId, entry] of this.managedInstances.entries()) {
            if (this.stopping) {
                return;
            }
            const pendingOperation = entry.snapshot.pendingOperation;
            if (pendingOperation) {
                if (entry.processingOperationId === pendingOperation.id ||
                    entry.processingPromise) {
                    continue;
                }
                const processingPromise = this.runOperation(instanceId).finally(() => {
                    const current = this.managedInstances.get(instanceId);
                    if (!current) {
                        return;
                    }
                    current.processingOperationId = undefined;
                    current.processingPromise = undefined;
                });
                entry.processingOperationId = pendingOperation.id;
                entry.processingPromise = processingPromise;
                continue;
            }
            if (entry.snapshot.status !== 'authenticated' || entry.messagePromise) {
                continue;
            }
            const messagePromise = this.runNextMessage(instanceId).finally(() => {
                const current = this.managedInstances.get(instanceId);
                if (!current) {
                    return;
                }
                current.processingMessageId = undefined;
                current.messagePromise = undefined;
            });
            entry.messagePromise = messagePromise;
        }
    }
    removeInstance(instanceId) {
        this.managedInstances.delete(instanceId);
    }
    getActiveInstanceCount() {
        return this.managedInstances.size;
    }
    async runOperation(instanceId) {
        const entry = this.managedInstances.get(instanceId);
        if (!entry || !entry.snapshot.pendingOperation || this.stopping) {
            return;
        }
        const operation = entry.snapshot.pendingOperation;
        try {
            await this.options.internalApi.updateInstanceOperationStatus(instanceId, operation.id, {
                workerId: this.options.workerId,
                status: 'running',
                message: `${operation.action} operation accepted by placeholder runtime.`,
            });
            switch (operation.action) {
                case 'start':
                    await this.runStartSequence(instanceId);
                    break;
                case 'restart':
                    await this.runRestartSequence(instanceId);
                    break;
                case 'stop':
                    await this.runStopSequence(instanceId);
                    break;
                case 'logout':
                    await this.runLogoutSequence(instanceId);
                    break;
                case 'clear':
                    await this.runClearSequence(instanceId);
                    break;
                case 'takeover':
                    await this.runTakeoverSequence(instanceId);
                    break;
                case 'reassign':
                    await this.completeOperation(instanceId, operation.action, 'Reassign action does not run inside the worker placeholder runtime.');
                    break;
            }
        }
        catch (error) {
            await this.failOperation(instanceId, operation.action, error instanceof Error ? error.message : String(error));
        }
    }
    async runNextMessage(instanceId) {
        const entry = this.managedInstances.get(instanceId);
        if (!entry ||
            this.stopping ||
            entry.snapshot.status !== 'authenticated' ||
            entry.snapshot.pendingOperation) {
            return;
        }
        const claimed = await this.options.internalApi.claimNextOutboundMessage(instanceId, {
            workerId: this.options.workerId,
        });
        if (!claimed.message) {
            return;
        }
        entry.processingMessageId = claimed.message.id;
        await this.processOutboundMessage(instanceId, claimed.message);
    }
    async runStartSequence(instanceId) {
        const startedAt = new Date().toISOString();
        await this.updateRuntime(instanceId, {
            lastStartedAt: startedAt,
            disconnectReason: null,
            currentSessionLabel: null,
        }, {
            phase: 'start',
        });
        await this.runBootAndLinkSequence(instanceId);
        await this.completeOperation(instanceId, 'start', 'Start action completed in placeholder runtime.');
    }
    async runBootAndLinkSequence(instanceId) {
        await this.transitionStatus(instanceId, 'initialize', 'preparing_runtime', 'Preparing placeholder runtime.');
        await wait(400);
        await this.transitionStatus(instanceId, 'booting', 'launching_placeholder', 'Launching placeholder runtime.');
        await wait(500);
        const qrDisplayMs = this.options.placeholderQrDisplayMs ?? 300_000;
        const qrPayload = this.generateQrPayload(instanceId);
        const qrExpiresAt = new Date(Date.now() + qrDisplayMs).toISOString();
        await this.transitionStatus(instanceId, 'qr', 'awaiting_scan', 'Generated placeholder QR payload.');
        await this.updateRuntime(instanceId, {
            qrCode: qrPayload,
            qrExpiresAt,
            currentSessionLabel: null,
            disconnectReason: null,
        }, {
            phase: 'qr',
        });
        await wait(qrDisplayMs);
        await this.transitionStatus(instanceId, 'authenticated', 'placeholder_linked', 'Placeholder session linked automatically.');
        await this.updateRuntime(instanceId, {
            qrCode: null,
            qrExpiresAt: null,
            currentSessionLabel: this.generateSessionLabel(instanceId),
            lastAuthenticatedAt: new Date().toISOString(),
            disconnectReason: null,
        }, {
            phase: 'authenticated',
        });
    }
    async runRestartSequence(instanceId) {
        const disconnectedAt = new Date().toISOString();
        await this.transitionStatus(instanceId, 'disconnected', 'restarting_runtime', 'Restart requested. Disconnecting placeholder session.');
        await this.updateRuntime(instanceId, {
            qrCode: null,
            qrExpiresAt: null,
            currentSessionLabel: null,
            lastDisconnectedAt: disconnectedAt,
            disconnectReason: 'Restart requested.',
        }, {
            phase: 'restart_disconnected',
        });
        await wait(400);
        await this.transitionStatus(instanceId, 'retrying', 'restart_retry', 'Retrying placeholder runtime startup.');
        await wait(400);
        await this.updateRuntime(instanceId, {
            lastStartedAt: new Date().toISOString(),
            disconnectReason: null,
            currentSessionLabel: null,
        }, {
            phase: 'retrying',
        });
        await this.runBootAndLinkSequence(instanceId);
        await this.completeOperation(instanceId, 'restart', 'Restart action completed in placeholder runtime.');
    }
    async runStopSequence(instanceId) {
        const disconnectedAt = new Date().toISOString();
        await this.transitionStatus(instanceId, 'disconnected', 'stopping_runtime', 'Stopping placeholder runtime.');
        await this.updateRuntime(instanceId, {
            qrCode: null,
            qrExpiresAt: null,
            currentSessionLabel: null,
            lastDisconnectedAt: disconnectedAt,
            disconnectReason: 'Stopped by operator.',
        }, {
            phase: 'stopping',
        });
        await wait(400);
        await this.transitionStatus(instanceId, 'stopped', 'idle', 'Placeholder runtime stopped.');
        await this.completeOperation(instanceId, 'stop', 'Stop action completed in placeholder runtime.');
    }
    async runLogoutSequence(instanceId) {
        const disconnectedAt = new Date().toISOString();
        await this.transitionStatus(instanceId, 'disconnected', 'logging_out', 'Logging out placeholder session.');
        await this.updateRuntime(instanceId, {
            qrCode: null,
            qrExpiresAt: null,
            currentSessionLabel: null,
            lastDisconnectedAt: disconnectedAt,
            disconnectReason: 'Logged out by operator.',
        }, {
            phase: 'logging_out',
        });
        await wait(400);
        await this.transitionStatus(instanceId, 'standby', 'logged_out', 'Placeholder session cleared and waiting to start again.');
        await this.completeOperation(instanceId, 'logout', 'Logout action completed in placeholder runtime.');
    }
    async runClearSequence(instanceId) {
        const disconnectedAt = new Date().toISOString();
        await this.transitionStatus(instanceId, 'disconnected', 'clearing_runtime', 'Clearing placeholder runtime state.');
        await this.updateRuntime(instanceId, {
            qrCode: null,
            qrExpiresAt: null,
            currentSessionLabel: null,
            lastStartedAt: null,
            lastAuthenticatedAt: null,
            lastDisconnectedAt: disconnectedAt,
            disconnectReason: 'Runtime cleared by operator.',
        }, {
            phase: 'clearing',
        });
        await wait(400);
        await this.transitionStatus(instanceId, 'standby', 'cleared', 'Placeholder runtime reset to standby.');
        await this.completeOperation(instanceId, 'clear', 'Clear action completed in placeholder runtime.');
    }
    async runTakeoverSequence(instanceId) {
        await this.transitionStatus(instanceId, 'loading', 'taking_over', 'Resolving placeholder session conflict.');
        await this.updateRuntime(instanceId, {
            qrCode: null,
            qrExpiresAt: null,
            currentSessionLabel: this.generateSessionLabel(instanceId),
            lastAuthenticatedAt: new Date().toISOString(),
            disconnectReason: null,
        }, {
            phase: 'takeover',
        });
        await wait(350);
        await this.transitionStatus(instanceId, 'authenticated', 'connected', 'Placeholder session conflict resolved.');
        await this.completeOperation(instanceId, 'takeover', 'Takeover action completed in placeholder runtime.');
    }
    async processOutboundMessage(instanceId, message) {
        try {
            const invalidReason = this.validateOutboundMessage(message);
            if (invalidReason) {
                await this.options.internalApi.updateOutboundMessage(instanceId, message.id, {
                    workerId: this.options.workerId,
                    status: 'invalid',
                    message: 'Placeholder send rejected by validation.',
                    errorMessage: invalidReason,
                });
                this.options.logger.warn({
                    correlationId: (0, node_crypto_1.randomUUID)(),
                    instanceId,
                    messageId: message.id,
                    publicMessageId: message.publicMessageId,
                    error: invalidReason,
                }, 'worker.message.invalid');
                return;
            }
            await wait(300);
            const providerMessageId = `placeholder-${message.publicMessageId}-${Date.now().toString(36)}`;
            await this.options.internalApi.updateOutboundMessage(instanceId, message.id, {
                workerId: this.options.workerId,
                status: 'sent',
                ack: 'server',
                providerMessageId,
                message: 'Placeholder runtime accepted the outbound message.',
            });
            this.options.logger.info({
                correlationId: (0, node_crypto_1.randomUUID)(),
                instanceId,
                messageId: message.id,
                publicMessageId: message.publicMessageId,
                recipient: message.recipient,
                messageType: message.messageType,
            }, 'worker.message.sent');
            await wait(450);
            await this.options.internalApi.updateOutboundMessage(instanceId, message.id, {
                workerId: this.options.workerId,
                ack: 'device',
                message: 'Placeholder device acknowledgement received.',
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            await this.options.internalApi.updateOutboundMessage(instanceId, message.id, {
                workerId: this.options.workerId,
                status: 'unsent',
                message: 'Placeholder runtime failed to send the outbound message.',
                errorMessage,
            });
            this.options.logger.warn({
                correlationId: (0, node_crypto_1.randomUUID)(),
                instanceId,
                messageId: message.id,
                publicMessageId: message.publicMessageId,
                error: errorMessage,
            }, 'worker.message.failed');
        }
    }
    async transitionStatus(instanceId, status, substatus, message) {
        await this.options.internalApi.updateInstanceStatus(instanceId, {
            workerId: this.options.workerId,
            status,
            substatus,
            message,
        });
        const entry = this.managedInstances.get(instanceId);
        if (!entry) {
            return;
        }
        entry.snapshot = {
            ...entry.snapshot,
            status,
            substatus,
        };
    }
    updateRuntime(instanceId, payload, diagnostics) {
        return this.options.internalApi.updateInstanceRuntime(instanceId, {
            workerId: this.options.workerId,
            sessionBackend: 'placeholder',
            sessionDiagnostics: this.buildDiagnostics(instanceId, diagnostics),
            ...payload,
        });
    }
    async completeOperation(instanceId, action, message) {
        const entry = this.managedInstances.get(instanceId);
        if (!entry?.snapshot.pendingOperation) {
            return;
        }
        await this.options.internalApi.updateInstanceOperationStatus(instanceId, entry.snapshot.pendingOperation.id, {
            workerId: this.options.workerId,
            status: 'completed',
            message,
        });
        this.options.logger.info({
            correlationId: (0, node_crypto_1.randomUUID)(),
            instanceId,
            action,
        }, 'worker.operation.completed');
        entry.snapshot = {
            ...entry.snapshot,
            pendingOperation: null,
        };
    }
    async failOperation(instanceId, action, errorMessage) {
        const entry = this.managedInstances.get(instanceId);
        if (!entry?.snapshot.pendingOperation) {
            return;
        }
        await this.options.internalApi.updateInstanceOperationStatus(instanceId, entry.snapshot.pendingOperation.id, {
            workerId: this.options.workerId,
            status: 'failed',
            message: `${action} failed in placeholder runtime.`,
            errorMessage,
        });
        this.options.logger.warn({
            correlationId: (0, node_crypto_1.randomUUID)(),
            instanceId,
            action,
            error: errorMessage,
        }, 'worker.operation.failed');
        entry.snapshot = {
            ...entry.snapshot,
            pendingOperation: null,
        };
    }
    generateQrPayload(instanceId) {
        const entry = this.managedInstances.get(instanceId);
        const publicId = entry?.snapshot.publicId ?? instanceId;
        return `ELITE-QRPAYLOAD|${publicId}|${Date.now()}|${(0, node_crypto_1.randomUUID)().slice(0, 8)}`;
    }
    generateSessionLabel(instanceId) {
        const entry = this.managedInstances.get(instanceId);
        const publicId = entry?.snapshot.publicId ?? instanceId;
        return `session-${publicId}-${Date.now().toString(36)}`;
    }
    buildDiagnostics(instanceId, extra) {
        const entry = this.managedInstances.get(instanceId);
        return {
            backend: 'placeholder',
            publicId: entry?.snapshot.publicId ?? instanceId,
            workerId: this.options.workerId,
            timestamp: new Date().toISOString(),
            ...(extra ?? {}),
        };
    }
    validateOutboundMessage(message) {
        const recipient = message.recipient.trim();
        if (recipient.length < 3) {
            return 'Recipient is too short.';
        }
        if (!/^[0-9+@._-]+$/.test(recipient)) {
            return 'Recipient contains unsupported characters.';
        }
        if (message.messageType === 'chat' && !message.body?.trim()) {
            return 'Chat messages require a non-empty body.';
        }
        if (message.messageType === 'image' && !message.mediaUrl?.trim()) {
            return 'Image messages require a media URL.';
        }
        return null;
    }
}
exports.PlaceholderSessionRuntime = PlaceholderSessionRuntime;
//# sourceMappingURL=session-runtime.js.map