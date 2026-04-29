"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppWebSessionRuntime = void 0;
exports.resolveWorkerBrowserExecutablePath = resolveWorkerBrowserExecutablePath;
const node_crypto_1 = require("node:crypto");
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
function wait(ms) {
    return new Promise((resolvePromise) => {
        setTimeout(resolvePromise, ms).unref();
    });
}
function isExpiredIsoTimestamp(timestamp) {
    if (!timestamp) {
        return false;
    }
    const parsed = Date.parse(timestamp);
    return Number.isNaN(parsed) ? false : parsed <= Date.now();
}
function withTimeout(promise, ms, label) {
    return new Promise((resolvePromise, rejectPromise) => {
        const timer = setTimeout(() => {
            rejectPromise(new Error(`${label} timed out after ${ms}ms.`));
        }, ms);
        timer.unref();
        promise.then((value) => {
            clearTimeout(timer);
            resolvePromise(value);
        }, (error) => {
            clearTimeout(timer);
            rejectPromise(error);
        });
    });
}
function createStartupSignal() {
    let resolvePromise;
    let rejectPromise;
    const promise = new Promise((resolve, reject) => {
        resolvePromise = resolve;
        rejectPromise = reject;
    });
    return {
        promise,
        resolve: resolvePromise,
        reject: rejectPromise,
    };
}
function mapAckValue(value) {
    switch (value) {
        case 1:
            return 'server';
        case 2:
            return 'device';
        case 3:
            return 'read';
        case 4:
            return 'played';
        default:
            return 'pending';
    }
}
function getErrorMessage(error, fallback = 'Unknown error.') {
    return error instanceof Error ? error.message : String(error || fallback);
}
function isRecoverableBrowserFrameError(error) {
    const message = getErrorMessage(error).toLowerCase();
    return [
        'detached frame',
        'execution context was destroyed',
        'target closed',
        'session closed',
        'page has been closed',
        'browser has disconnected',
        'cannot find context with specified id',
    ].some((fragment) => message.includes(fragment));
}
const customerSafeBrowserRecoveryMessage = 'WhatsApp Web is reconnecting after a temporary browser issue. Queued messages will retry automatically.';
function calculateBrowserRecoveryRequeueDelayMs(baseDelayMs, recoveryAttempts) {
    const safeBaseDelayMs = Math.max(baseDelayMs, 5_000);
    const exponent = Math.min(Math.max(recoveryAttempts, 1) - 1, 4);
    return Math.min(safeBaseDelayMs * 2 ** exponent, 60_000);
}
function mapInboundKind(type) {
    switch (type) {
        case 'chat':
            return 'chat';
        case 'image':
            return 'image';
        case 'document':
            return 'document';
        case 'audio':
        case 'ptt':
            return 'audio';
        case 'video':
            return 'video';
        case 'sticker':
            return 'sticker';
        default:
            return 'unknown';
    }
}
function shouldAutoRecover(status) {
    return [
        'authenticated',
        'qr',
        'loading',
        'retrying',
        'initialize',
        'booting',
    ].includes(status);
}
function shouldReconnectForQueuedMessages(instance) {
    return (instance.substatus === 'worker_claimed_for_messages' &&
        !['stopped', 'expired'].includes(instance.status));
}
function inferDesiredState(instance) {
    if (instance.pendingOperation &&
        ['start', 'restart'].includes(instance.pendingOperation.action)) {
        return 'running';
    }
    if (shouldAutoRecover(instance.status)) {
        return 'running';
    }
    if (shouldReconnectForQueuedMessages(instance)) {
        return 'running';
    }
    return 'stopped';
}
function isBootInProgress(clientState) {
    return ['initializing', 'booting', 'loading', 'authenticated'].includes(clientState);
}
function isConflictState(state) {
    return String(state).trim().toUpperCase() === 'CONFLICT';
}
function normalizeRecipient(recipient) {
    const trimmed = recipient.trim();
    if (trimmed.endsWith('@c.us') || trimmed.endsWith('@g.us')) {
        return trimmed;
    }
    const digits = trimmed.replace(/[^\d]/g, '');
    if (digits.length < 3) {
        throw new Error('Recipient could not be normalized into a WhatsApp chat id.');
    }
    return `${digits}@c.us`;
}
function resolveSessionDirectory(storageRoot, publicId) {
    return (0, node_path_1.resolve)(storageRoot, `session-${publicId}`);
}
function resolveScreenshotPath(storageRoot, publicId) {
    return (0, node_path_1.resolve)(storageRoot, 'screenshots', `${publicId}.png`);
}
function resolveInboundMediaDirectory(storageRoot, publicId) {
    return (0, node_path_1.resolve)(storageRoot, 'media', publicId);
}
function inferFileExtension(mimeType, fallback) {
    const normalizedFallback = fallback?.split('.').pop()?.trim().toLowerCase();
    if (normalizedFallback) {
        return normalizedFallback;
    }
    switch (mimeType) {
        case 'image/jpeg':
            return 'jpg';
        case 'image/png':
            return 'png';
        case 'image/webp':
            return 'webp';
        case 'image/gif':
            return 'gif';
        case 'application/pdf':
            return 'pdf';
        case 'audio/ogg':
            return 'ogg';
        case 'audio/mpeg':
            return 'mp3';
        case 'video/mp4':
            return 'mp4';
        default:
            return 'bin';
    }
}
function resolveWorkerBrowserExecutablePath(preferredPath) {
    const candidates = [
        preferredPath,
        '/usr/bin/google-chrome-stable',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/opt/google/chrome/google-chrome',
        '/snap/bin/chromium',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
        '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    ].filter((value) => Boolean(value));
    return candidates.find((candidate) => (0, node_fs_1.existsSync)(candidate)) ?? null;
}
async function findLinuxProcessesUsingPath(targetPath) {
    if (process.platform !== 'linux') {
        return [];
    }
    let entries;
    try {
        entries = await (0, promises_1.readdir)('/proc');
    }
    catch {
        return [];
    }
    const matches = [];
    await Promise.all(entries.map(async (entry) => {
        if (!/^\d+$/.test(entry)) {
            return;
        }
        const pid = Number(entry);
        if (!Number.isSafeInteger(pid) || pid === process.pid) {
            return;
        }
        try {
            const command = (await (0, promises_1.readFile)(`/proc/${pid}/cmdline`, 'utf8'))
                .replace(/\0/g, ' ')
                .trim();
            if (command.includes(targetPath)) {
                matches.push({ pid, command });
            }
        }
        catch {
            // Process exited or is not readable; ignore it.
        }
    }));
    return matches;
}
async function terminateProcess(pid) {
    try {
        process.kill(pid, 'SIGTERM');
    }
    catch {
        return;
    }
    await wait(1_500);
    try {
        process.kill(pid, 0);
    }
    catch {
        return;
    }
    try {
        process.kill(pid, 'SIGKILL');
    }
    catch {
        // Best-effort cleanup.
    }
}
function resolveWhatsAppWebRuntimeModule(module) {
    const candidate = ('default' in module && module.default && typeof module.default === 'object'
        ? module.default
        : module);
    if (typeof candidate.Client !== 'function' ||
        typeof candidate.LocalAuth !== 'function' ||
        typeof candidate.MessageMedia?.fromUrl !== 'function') {
        throw new Error('whatsapp-web.js runtime exports are invalid.');
    }
    return candidate;
}
class WhatsAppWebSessionRuntime {
    options;
    managedInstances = new Map();
    sessionStorageDir;
    screenshotRootDir;
    module = null;
    stopping = false;
    constructor(options) {
        this.options = options;
        this.sessionStorageDir = (0, node_path_1.resolve)(this.options.env.WORKER_SESSION_STORAGE_DIR);
        this.screenshotRootDir = (0, node_path_1.resolve)(this.options.env.WORKER_SESSION_STORAGE_DIR, 'screenshots');
    }
    async start() {
        this.stopping = false;
        this.module = resolveWhatsAppWebRuntimeModule(await import('whatsapp-web.js'));
        await (0, promises_1.mkdir)(this.sessionStorageDir, { recursive: true });
        if (this.options.env.WORKER_WA_CAPTURE_SCREENSHOTS) {
            await (0, promises_1.mkdir)(this.screenshotRootDir, { recursive: true });
        }
    }
    async stop() {
        this.stopping = true;
        await Promise.allSettled([...this.managedInstances.keys()].map((instanceId) => this.destroyClient(instanceId, 'Worker shutdown requested.')));
        await Promise.allSettled([...this.managedInstances.values()]
            .flatMap((entry) => [
            entry.processingPromise,
            entry.messagePromise,
            entry.clientPromise,
        ])
            .filter((promise) => Boolean(promise)));
    }
    syncAssignedInstances(instances) {
        const nextIds = new Set(instances.map((instance) => instance.id));
        for (const instance of instances) {
            const existing = this.managedInstances.get(instance.id);
            this.managedInstances.set(instance.id, {
                snapshot: instance,
                client: existing?.client ?? null,
                clientState: existing?.clientState ?? 'idle',
                startupSignal: existing?.startupSignal ?? null,
                desiredState: existing?.desiredState ?? inferDesiredState(instance),
                recoverAfterAt: existing?.recoverAfterAt ?? null,
                startupAttempts: existing?.startupAttempts ?? 0,
                recoveryAttempts: existing?.recoveryAttempts ?? 0,
                lastClientEvent: existing?.lastClientEvent ?? null,
                lastClientEventAt: existing?.lastClientEventAt ?? null,
                lastError: existing?.lastError ?? null,
                lastReadyAt: existing?.lastReadyAt ?? null,
                clientPromise: existing?.clientPromise,
                processingOperationId: existing?.processingOperationId,
                processingPromise: existing?.processingPromise,
                processingMessageId: existing?.processingMessageId,
                messagePromise: existing?.messagePromise,
                outboundByProviderId: existing?.outboundByProviderId ?? new Map(),
            });
        }
        for (const [instanceId] of this.managedInstances.entries()) {
            if (nextIds.has(instanceId)) {
                continue;
            }
            void this.destroyClient(instanceId, 'Instance assignment removed from worker.');
            this.managedInstances.delete(instanceId);
        }
    }
    async processAssignments() {
        for (const [instanceId, entry] of this.managedInstances.entries()) {
            if (this.stopping) {
                return;
            }
            const canAutoRecover = entry.desiredState === 'running' &&
                !entry.snapshot.pendingOperation &&
                (shouldAutoRecover(entry.snapshot.status) ||
                    shouldReconnectForQueuedMessages(entry.snapshot)) &&
                (!entry.recoverAfterAt || entry.recoverAfterAt <= Date.now());
            if (!entry.client && !entry.clientPromise && canAutoRecover) {
                entry.clientPromise = this.ensureClient(instanceId)
                    .then(() => undefined)
                    .catch((error) => {
                    this.options.logger.warn({
                        correlationId: (0, node_crypto_1.randomUUID)(),
                        instanceId,
                        backend: 'whatsapp_web',
                        error: error instanceof Error ? error.message : String(error),
                    }, 'worker.runtime.ensure_client_failed');
                })
                    .finally(() => {
                    const current = this.managedInstances.get(instanceId);
                    if (current) {
                        current.clientPromise = undefined;
                    }
                });
                continue;
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
            if (entry.clientState !== 'ready' ||
                !entry.client ||
                entry.messagePromise) {
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
        void this.destroyClient(instanceId, 'Instance removed from worker runtime.');
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
        entry.snapshot = {
            ...entry.snapshot,
            pendingOperation: {
                ...operation,
                status: 'running',
            },
        };
        try {
            await this.options.internalApi.updateInstanceOperationStatus(instanceId, operation.id, {
                workerId: this.options.workerId,
                status: 'running',
                message: `${operation.action} operation accepted by WhatsApp Web runtime.`,
            });
            switch (operation.action) {
                case 'start': {
                    entry.desiredState = 'running';
                    if (entry.clientState === 'ready') {
                        await this.completeOperation(instanceId, 'start', 'WhatsApp Web session is already connected.');
                        break;
                    }
                    if (entry.client && entry.clientState === 'qr') {
                        if (!isExpiredIsoTimestamp(entry.snapshot.runtime.qrExpiresAt)) {
                            await this.completeOperation(instanceId, 'start', 'WhatsApp Web QR is ready for scan.');
                            break;
                        }
                        await this.destroyClient(instanceId, 'Expired WhatsApp Web QR refresh requested.');
                        await wait(250);
                    }
                    if ((entry.client && isBootInProgress(entry.clientState)) ||
                        entry.clientPromise) {
                        await this.completeOperation(instanceId, 'start', 'WhatsApp Web startup is already in progress.');
                        break;
                    }
                    const startupOutcome = await this.ensureClient(instanceId);
                    await this.completeOperation(instanceId, 'start', startupOutcome === 'ready'
                        ? 'WhatsApp Web session connected.'
                        : 'WhatsApp Web QR is ready for scan.');
                    break;
                }
                case 'restart': {
                    entry.desiredState = 'running';
                    await this.destroyClient(instanceId, 'Restart requested.');
                    await wait(250);
                    const startupOutcome = await this.ensureClient(instanceId);
                    await this.completeOperation(instanceId, 'restart', startupOutcome === 'ready'
                        ? 'WhatsApp Web session restarted and connected.'
                        : 'WhatsApp Web QR is ready after restart.');
                    break;
                }
                case 'stop':
                    entry.desiredState = 'stopped';
                    await this.stopClient(instanceId);
                    await this.completeOperation(instanceId, 'stop', 'WhatsApp Web runtime stopped.');
                    break;
                case 'logout':
                    entry.desiredState = 'stopped';
                    await this.logoutClient(instanceId, false);
                    await this.completeOperation(instanceId, 'logout', 'WhatsApp Web session logged out.');
                    break;
                case 'clear':
                    entry.desiredState = 'stopped';
                    await this.logoutClient(instanceId, true);
                    await this.completeOperation(instanceId, 'clear', 'WhatsApp Web session cleared from local storage.');
                    break;
                case 'takeover':
                    entry.desiredState = 'running';
                    await this.takeoverClient(instanceId);
                    await this.completeOperation(instanceId, 'takeover', 'WhatsApp Web session conflict takeover completed.');
                    break;
                case 'reassign':
                    await this.completeOperation(instanceId, 'reassign', 'Reassign action is handled by the control plane.');
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
            entry.clientState !== 'ready' ||
            !entry.client ||
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
    async processOutboundMessage(instanceId, message) {
        const entry = this.managedInstances.get(instanceId);
        if (!entry?.client) {
            return;
        }
        try {
            const invalidReason = this.validateOutboundMessage(message);
            if (invalidReason) {
                await this.options.internalApi.updateOutboundMessage(instanceId, message.id, {
                    workerId: this.options.workerId,
                    status: 'invalid',
                    message: 'WhatsApp Web runtime rejected the outbound message.',
                    errorMessage: invalidReason,
                });
                return;
            }
            const sentMessage = await this.sendOutboundMessage(entry, message);
            await this.completeOutboundMessageSend(instanceId, message, sentMessage, 'Sent through WhatsApp Web runtime.', 'worker.message.sent');
        }
        catch (error) {
            const errorMessage = getErrorMessage(error);
            if (isRecoverableBrowserFrameError(error)) {
                entry.lastError = customerSafeBrowserRecoveryMessage;
                await this.retryOutboundAfterBrowserRecovery(instanceId, message, errorMessage);
                return;
            }
            entry.lastError = errorMessage;
            await this.failOutboundMessage(instanceId, message, errorMessage);
        }
    }
    async sendOutboundMessage(entry, message) {
        if (!entry.client) {
            throw new Error('WhatsApp Web client is not connected.');
        }
        const chatId = normalizeRecipient(message.recipient);
        if (message.messageType === 'chat') {
            return entry.client.sendMessage(chatId, message.body ?? '');
        }
        if (!this.module) {
            throw new Error('WhatsApp Web module is not loaded.');
        }
        const media = await this.module.MessageMedia.fromUrl(message.mediaUrl, {
            unsafeMime: true,
        });
        return entry.client.sendMessage(chatId, media, {
            caption: message.caption ?? undefined,
        });
    }
    async completeOutboundMessageSend(instanceId, message, sentMessage, statusMessage, logEvent) {
        const entry = this.managedInstances.get(instanceId);
        const providerMessageId = this.extractMessageId(sentMessage);
        if (entry && providerMessageId) {
            entry.outboundByProviderId.set(providerMessageId, message.id);
        }
        await this.options.internalApi.updateOutboundMessage(instanceId, message.id, {
            workerId: this.options.workerId,
            status: 'sent',
            ack: 'server',
            providerMessageId: providerMessageId ?? undefined,
            message: statusMessage,
        });
        this.options.logger.info({
            correlationId: (0, node_crypto_1.randomUUID)(),
            instanceId,
            messageId: message.id,
            publicMessageId: message.publicMessageId,
            providerMessageId,
            backend: 'whatsapp_web',
        }, logEvent);
    }
    async retryOutboundAfterBrowserRecovery(instanceId, message, initialErrorMessage) {
        const entry = this.managedInstances.get(instanceId);
        if (!entry || this.stopping) {
            await this.requeueOutboundAfterBrowserRecoveryFailure(instanceId, message, initialErrorMessage, this.stopping
                ? 'Worker is restarting before browser recovery could complete.'
                : 'Worker assignment was not available for browser recovery.');
            return true;
        }
        this.options.logger.warn({
            correlationId: (0, node_crypto_1.randomUUID)(),
            instanceId,
            messageId: message.id,
            publicMessageId: message.publicMessageId,
            backend: 'whatsapp_web',
            error: initialErrorMessage,
        }, 'worker.message.recoverable_browser_send_failed');
        try {
            entry.desiredState = 'running';
            entry.lastError = customerSafeBrowserRecoveryMessage;
            entry.recoveryAttempts += 1;
            entry.recoverAfterAt = null;
            this.recordClientEvent(entry, 'send_recovery_requested');
            await this.options.internalApi.updateInstanceRuntime(instanceId, {
                workerId: this.options.workerId,
                sessionBackend: 'whatsapp_web',
                disconnectReason: customerSafeBrowserRecoveryMessage,
                sessionDiagnostics: this.buildDiagnostics(instanceId, {
                    phase: 'send_recovery_requested',
                    reasonCode: 'recoverable_browser_send_failure',
                }),
            });
            await this.destroyClient(instanceId, `Recovering WhatsApp Web browser after send failure: ${initialErrorMessage}`);
            await wait(500);
            const startupOutcome = await this.ensureClient(instanceId);
            if (startupOutcome !== 'ready') {
                throw new Error('WhatsApp Web recovery requires a fresh QR scan before retrying the message.');
            }
            const recoveredEntry = this.managedInstances.get(instanceId);
            if (!recoveredEntry?.client || recoveredEntry.clientState !== 'ready') {
                throw new Error('WhatsApp Web browser recovery did not reconnect.');
            }
            const sentMessage = await this.sendOutboundMessage(recoveredEntry, message);
            await this.completeOutboundMessageSend(instanceId, message, sentMessage, 'Sent through WhatsApp Web runtime after browser recovery.', 'worker.message.sent_after_browser_recovery');
            await this.options.internalApi.updateInstanceRuntime(instanceId, {
                workerId: this.options.workerId,
                sessionBackend: 'whatsapp_web',
                disconnectReason: null,
                sessionDiagnostics: this.buildDiagnostics(instanceId, {
                    phase: 'send_recovery_completed',
                    recoveredMessageId: message.id,
                }),
            });
            return true;
        }
        catch (retryError) {
            const retryErrorMessage = getErrorMessage(retryError);
            const current = this.managedInstances.get(instanceId);
            if (current) {
                current.lastError = customerSafeBrowserRecoveryMessage;
            }
            this.options.logger.warn({
                correlationId: (0, node_crypto_1.randomUUID)(),
                instanceId,
                messageId: message.id,
                publicMessageId: message.publicMessageId,
                backend: 'whatsapp_web',
                initialError: initialErrorMessage,
                retryError: retryErrorMessage,
            }, 'worker.message.browser_recovery_retry_failed');
            await this.requeueOutboundAfterBrowserRecoveryFailure(instanceId, message, initialErrorMessage, retryErrorMessage);
            return true;
        }
    }
    async requeueOutboundAfterBrowserRecoveryFailure(instanceId, message, initialErrorMessage, retryErrorMessage) {
        const entry = this.managedInstances.get(instanceId);
        const retryAfterMs = calculateBrowserRecoveryRequeueDelayMs(this.options.env.WORKER_WA_AUTO_RECOVERY_DELAY_MS, entry?.recoveryAttempts ?? 1);
        const recoverAfterAt = new Date(Date.now() + this.options.env.WORKER_WA_AUTO_RECOVERY_DELAY_MS);
        await this.options.internalApi.updateOutboundMessage(instanceId, message.id, {
            workerId: this.options.workerId,
            status: 'queue',
            ack: 'pending',
            message: customerSafeBrowserRecoveryMessage,
            requeueAfterMs: retryAfterMs,
        });
        if (entry) {
            entry.desiredState = 'running';
            entry.recoverAfterAt = recoverAfterAt.getTime();
            entry.lastError = customerSafeBrowserRecoveryMessage;
            this.recordClientEvent(entry, 'send_recovery_retry_requeued');
        }
        await this.destroyClient(instanceId, `WhatsApp Web browser recovery did not reconnect after send failure: ${retryErrorMessage}`);
        await this.transitionStatus(instanceId, 'retrying', 'send_recovery_retry_pending', customerSafeBrowserRecoveryMessage);
        await this.options.internalApi.updateInstanceRuntime(instanceId, {
            workerId: this.options.workerId,
            qrCode: null,
            qrExpiresAt: null,
            sessionBackend: 'whatsapp_web',
            currentSessionLabel: null,
            disconnectReason: customerSafeBrowserRecoveryMessage,
            lastDisconnectedAt: new Date().toISOString(),
            sessionDiagnostics: this.buildDiagnostics(instanceId, {
                phase: 'send_recovery_retry_pending',
                reasonCode: 'recoverable_browser_reconnect_pending',
                requeuedMessageId: message.id,
                messageRetryAfterMs: retryAfterMs,
                recoverAfterAt: recoverAfterAt.toISOString(),
            }),
        });
        this.options.logger.warn({
            correlationId: (0, node_crypto_1.randomUUID)(),
            instanceId,
            messageId: message.id,
            publicMessageId: message.publicMessageId,
            backend: 'whatsapp_web',
            initialError: initialErrorMessage,
            retryError: retryErrorMessage,
            retryAfterMs,
        }, 'worker.message.requeued_after_browser_recovery_failure');
    }
    async failOutboundMessage(instanceId, message, errorMessage) {
        await this.options.internalApi.updateOutboundMessage(instanceId, message.id, {
            workerId: this.options.workerId,
            status: 'unsent',
            message: 'WhatsApp Web runtime failed to send the outbound message.',
            errorMessage,
        });
    }
    async ensureClient(instanceId) {
        const entry = this.managedInstances.get(instanceId);
        if (!entry) {
            throw new Error('Managed instance not found.');
        }
        if (entry.clientState === 'ready') {
            return 'ready';
        }
        if (entry.startupSignal) {
            return withTimeout(entry.startupSignal.promise, this.options.env.WORKER_WA_STARTUP_TIMEOUT_MS, 'WhatsApp Web startup');
        }
        if (!this.module) {
            throw new Error('WhatsApp Web module is not loaded.');
        }
        const { Client, LocalAuth } = this.module;
        entry.startupSignal = createStartupSignal();
        entry.clientState = 'initializing';
        entry.desiredState = 'running';
        entry.recoverAfterAt = null;
        entry.startupAttempts += 1;
        entry.lastError = null;
        this.recordClientEvent(entry, 'initializing');
        await this.options.internalApi.updateInstanceRuntime(instanceId, {
            workerId: this.options.workerId,
            qrCode: null,
            qrExpiresAt: null,
            sessionBackend: 'whatsapp_web',
            sessionDiagnostics: this.buildDiagnostics(instanceId),
        });
        await this.transitionStatus(instanceId, 'initialize', 'preparing_whatsapp_web', 'Preparing WhatsApp Web runtime.');
        await wait(200);
        await this.transitionStatus(instanceId, 'booting', 'launching_browser', 'Launching the browser-backed WhatsApp session.');
        await this.options.internalApi.updateInstanceRuntime(instanceId, {
            workerId: this.options.workerId,
            qrCode: null,
            qrExpiresAt: null,
            sessionBackend: 'whatsapp_web',
            lastStartedAt: new Date().toISOString(),
            currentSessionLabel: null,
            disconnectReason: null,
            sessionDiagnostics: this.buildDiagnostics(instanceId),
        });
        await this.cleanupStaleBrowserProcesses(instanceId);
        const client = new Client({
            authStrategy: new LocalAuth({
                clientId: entry.snapshot.publicId,
                dataPath: this.sessionStorageDir,
            }),
            takeoverOnConflict: true,
            takeoverTimeoutMs: 2_147_483_647,
            puppeteer: {
                headless: this.options.env.WORKER_WA_HEADLESS,
                executablePath: this.options.browserExecutablePath,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                ],
            },
        });
        entry.client = client;
        this.bindClientEvents(instanceId, client);
        entry.clientPromise = client
            .initialize()
            .catch(async (error) => {
            const current = this.managedInstances.get(instanceId);
            current?.startupSignal?.reject(error);
            if (current) {
                current.lastError =
                    error instanceof Error ? error.message : String(error);
                this.recordClientEvent(current, 'startup_failed');
                await this.disposeClientReference(instanceId);
            }
            const errorMessage = error instanceof Error
                ? error.message
                : 'WhatsApp Web startup failed.';
            const shouldRecover = Boolean(current && !this.stopping && current.desiredState === 'running');
            if (current && shouldRecover) {
                current.recoveryAttempts += 1;
                current.recoverAfterAt =
                    Date.now() + this.options.env.WORKER_WA_AUTO_RECOVERY_DELAY_MS;
                await this.transitionStatus(instanceId, 'retrying', 'startup_failed_retry', errorMessage);
            }
            else {
                await this.transitionStatus(instanceId, 'disconnected', 'startup_failed', errorMessage);
            }
            await this.options.internalApi.updateInstanceRuntime(instanceId, {
                workerId: this.options.workerId,
                qrCode: null,
                qrExpiresAt: null,
                sessionBackend: 'whatsapp_web',
                disconnectReason: error instanceof Error ? error.message : String(error),
                lastDisconnectedAt: new Date().toISOString(),
                sessionDiagnostics: this.buildDiagnostics(instanceId, {
                    phase: shouldRecover ? 'startup_failed_retry' : 'startup_failed',
                    startupFailed: true,
                    recoverAfterAt: current?.recoverAfterAt
                        ? new Date(current.recoverAfterAt).toISOString()
                        : null,
                }),
            });
            return undefined;
        })
            .finally(() => {
            const current = this.managedInstances.get(instanceId);
            if (current) {
                current.clientPromise = undefined;
            }
        });
        return withTimeout(entry.startupSignal.promise, this.options.env.WORKER_WA_STARTUP_TIMEOUT_MS, 'WhatsApp Web startup');
    }
    async cleanupStaleBrowserProcesses(instanceId) {
        const entry = this.managedInstances.get(instanceId);
        if (!entry) {
            return;
        }
        const sessionDirectory = resolveSessionDirectory(this.sessionStorageDir, entry.snapshot.publicId);
        const matches = await findLinuxProcessesUsingPath(sessionDirectory);
        if (matches.length === 0) {
            return;
        }
        this.options.logger.warn({
            correlationId: (0, node_crypto_1.randomUUID)(),
            instanceId,
            backend: 'whatsapp_web',
            sessionDirectory,
            processIds: matches.map((match) => match.pid),
        }, 'worker.runtime.stale_browser_processes_found');
        await Promise.all(matches.map((match) => terminateProcess(match.pid)));
        await wait(500);
        this.options.logger.warn({
            correlationId: (0, node_crypto_1.randomUUID)(),
            instanceId,
            backend: 'whatsapp_web',
            sessionDirectory,
            processIds: matches.map((match) => match.pid),
        }, 'worker.runtime.stale_browser_processes_cleaned');
    }
    bindClientEvents(instanceId, client) {
        client.on('qr', (qr) => {
            void this.handleQr(instanceId, client, qr);
        });
        client.on('loading_screen', (percent, message) => {
            void this.handleLoading(instanceId, client, percent, message);
        });
        client.on('change_state', (state) => {
            void this.handleStateChange(instanceId, client, state);
        });
        client.on('authenticated', () => {
            void this.handleAuthenticated(instanceId, client);
        });
        client.on('ready', () => {
            void this.handleReady(instanceId, client);
        });
        client.on('disconnected', (reason) => {
            void this.handleDisconnected(instanceId, client, reason);
        });
        client.on('message', (message) => {
            if (message.fromMe) {
                return;
            }
            void this.handleInboundMessage(instanceId, client, message);
        });
        client.on('message_ack', (message, ack) => {
            if (!message.fromMe) {
                return;
            }
            void this.handleOutboundAck(instanceId, client, message, ack);
        });
    }
    getCurrentEntry(instanceId, client) {
        const entry = this.managedInstances.get(instanceId);
        if (!entry || entry.client !== client) {
            return null;
        }
        return entry;
    }
    async handleQr(instanceId, client, qr) {
        const entry = this.getCurrentEntry(instanceId, client);
        if (!entry) {
            return;
        }
        entry.clientState = 'qr';
        entry.desiredState = 'running';
        this.recordClientEvent(entry, 'qr');
        entry.startupSignal?.resolve('qr');
        entry.startupSignal = null;
        const qrExpiresAt = new Date(Date.now() + 45_000).toISOString();
        await this.transitionStatus(instanceId, 'qr', 'awaiting_scan', 'WhatsApp Web QR generated.');
        await this.options.internalApi.updateInstanceRuntime(instanceId, {
            workerId: this.options.workerId,
            qrCode: qr,
            qrExpiresAt,
            sessionBackend: 'whatsapp_web',
            currentSessionLabel: null,
            disconnectReason: null,
            sessionDiagnostics: this.buildDiagnostics(instanceId, { phase: 'qr' }),
        });
        await this.captureScreenshot(instanceId);
    }
    async handleLoading(instanceId, client, percent, message) {
        const entry = this.getCurrentEntry(instanceId, client);
        if (!entry) {
            return;
        }
        entry.clientState = 'loading';
        this.recordClientEvent(entry, 'loading_screen');
        await this.transitionStatus(instanceId, 'loading', 'loading_session', `WhatsApp Web loading screen ${String(percent ?? 0)}%. ${String(message ?? '').trim()}`.trim());
        await this.options.internalApi.updateInstanceRuntime(instanceId, {
            workerId: this.options.workerId,
            sessionBackend: 'whatsapp_web',
            sessionDiagnostics: this.buildDiagnostics(instanceId, {
                phase: 'loading',
                percent,
                message,
            }),
        });
    }
    async handleStateChange(instanceId, client, state) {
        const entry = this.getCurrentEntry(instanceId, client);
        if (!entry) {
            return;
        }
        const stateText = String(state);
        this.recordClientEvent(entry, `state_${stateText.toLowerCase()}`);
        if (!isConflictState(state)) {
            await this.options.internalApi.updateInstanceRuntime(instanceId, {
                workerId: this.options.workerId,
                sessionBackend: 'whatsapp_web',
                sessionDiagnostics: this.buildDiagnostics(instanceId, {
                    phase: 'state_changed',
                    waState: stateText,
                }),
            });
            return;
        }
        entry.clientState = 'conflict';
        await this.transitionStatus(instanceId, 'disconnected', 'conflict', 'WhatsApp Web reported a linked-device conflict.');
        await this.options.internalApi.updateInstanceRuntime(instanceId, {
            workerId: this.options.workerId,
            sessionBackend: 'whatsapp_web',
            disconnectReason: 'WhatsApp Web reported a linked-device conflict.',
            lastDisconnectedAt: new Date().toISOString(),
            sessionDiagnostics: this.buildDiagnostics(instanceId, {
                phase: 'conflict',
                waState: stateText,
                takeoverRequired: true,
            }),
        });
        await this.captureScreenshot(instanceId);
    }
    async handleAuthenticated(instanceId, client) {
        const entry = this.getCurrentEntry(instanceId, client);
        if (!entry) {
            return;
        }
        entry.clientState = 'authenticated';
        this.recordClientEvent(entry, 'authenticated');
        await this.options.internalApi.updateInstanceRuntime(instanceId, {
            workerId: this.options.workerId,
            qrCode: null,
            qrExpiresAt: null,
            sessionBackend: 'whatsapp_web',
            lastAuthenticatedAt: new Date().toISOString(),
            sessionDiagnostics: this.buildDiagnostics(instanceId, {
                phase: 'authenticated',
            }),
        });
    }
    async handleReady(instanceId, client) {
        const entry = this.getCurrentEntry(instanceId, client);
        if (!entry) {
            return;
        }
        entry.clientState = 'ready';
        entry.desiredState = 'running';
        entry.recoverAfterAt = null;
        entry.recoveryAttempts = 0;
        entry.lastReadyAt = new Date().toISOString();
        this.recordClientEvent(entry, 'ready');
        entry.startupSignal?.resolve('ready');
        entry.startupSignal = null;
        const sessionLabel = this.resolveSessionLabel(client, entry.snapshot.publicId);
        await this.transitionStatus(instanceId, 'authenticated', 'connected', 'WhatsApp Web session is connected.');
        await this.options.internalApi.updateInstanceRuntime(instanceId, {
            workerId: this.options.workerId,
            qrCode: null,
            qrExpiresAt: null,
            sessionBackend: 'whatsapp_web',
            currentSessionLabel: sessionLabel,
            lastAuthenticatedAt: new Date().toISOString(),
            disconnectReason: null,
            sessionDiagnostics: this.buildDiagnostics(instanceId, { phase: 'ready' }),
        });
        await this.captureScreenshot(instanceId);
    }
    async handleDisconnected(instanceId, client, reason) {
        const entry = this.getCurrentEntry(instanceId, client);
        if (!entry) {
            return;
        }
        const reasonText = String(reason);
        entry.clientState = 'disconnected';
        entry.lastError = reasonText;
        this.recordClientEvent(entry, 'disconnected');
        entry.startupSignal?.reject(new Error(`WhatsApp Web disconnected before startup completed: ${String(reason)}`));
        entry.startupSignal = null;
        await this.captureScreenshot(instanceId);
        await this.disposeClientReference(instanceId);
        if (!this.stopping && entry.desiredState === 'running') {
            entry.recoveryAttempts += 1;
            entry.recoverAfterAt =
                Date.now() + this.options.env.WORKER_WA_AUTO_RECOVERY_DELAY_MS;
            await this.transitionStatus(instanceId, 'retrying', 'auto_recover_pending', `WhatsApp Web disconnected: ${reasonText}`);
            await this.options.internalApi.updateInstanceRuntime(instanceId, {
                workerId: this.options.workerId,
                qrCode: null,
                qrExpiresAt: null,
                sessionBackend: 'whatsapp_web',
                currentSessionLabel: null,
                disconnectReason: reasonText,
                lastDisconnectedAt: new Date().toISOString(),
                sessionDiagnostics: this.buildDiagnostics(instanceId, {
                    phase: 'retrying',
                    reason: reasonText,
                    recoverAfterAt: new Date(entry.recoverAfterAt).toISOString(),
                }),
            });
            return;
        }
        await this.transitionStatus(instanceId, 'disconnected', 'whatsapp_web_disconnected', `WhatsApp Web disconnected: ${reasonText}`);
        await this.options.internalApi.updateInstanceRuntime(instanceId, {
            workerId: this.options.workerId,
            qrCode: null,
            qrExpiresAt: null,
            sessionBackend: 'whatsapp_web',
            currentSessionLabel: null,
            disconnectReason: reasonText,
            lastDisconnectedAt: new Date().toISOString(),
            sessionDiagnostics: this.buildDiagnostics(instanceId, {
                phase: 'disconnected',
                reason: reasonText,
            }),
        });
    }
    async handleInboundMessage(instanceId, client, message) {
        const entry = this.getCurrentEntry(instanceId, client);
        if (!entry) {
            return;
        }
        this.recordClientEvent(entry, 'message');
        const hasMedia = this.readBooleanField(message, ['hasMedia']);
        const downloadedMedia = hasMedia
            ? await this.downloadInboundMedia(instanceId, message)
            : null;
        const payload = {
            workerId: this.options.workerId,
            providerMessageId: this.extractMessageId(message) ?? undefined,
            chatId: this.readStringField(message, ['from', 'to']) ?? undefined,
            sender: this.readStringField(message, ['from']) ?? 'unknown',
            pushName: this.readStringField(message, ['notifyName', '_data.notifyName']) ??
                null,
            kind: mapInboundKind(this.readStringField(message, ['type'])),
            body: this.readStringField(message, ['body']) ?? null,
            mediaUrl: downloadedMedia?.path ?? null,
            mimeType: downloadedMedia?.mimeType ??
                this.readStringField(message, ['_data.mimetype']) ??
                null,
            fromMe: Boolean(message.fromMe),
            sentAt: this.readTimestampField(message, ['timestamp']),
            receivedAt: new Date().toISOString(),
            rawPayload: {
                id: this.extractMessageId(message),
                from: this.readStringField(message, ['from']),
                to: this.readStringField(message, ['to']),
                type: this.readStringField(message, ['type']),
                body: this.readStringField(message, ['body']),
                timestamp: this.readTimestampField(message, ['timestamp']),
                hasMedia,
                mediaStoredPath: downloadedMedia?.path ?? null,
                mediaMimeType: downloadedMedia?.mimeType ?? null,
            },
        };
        await this.options.internalApi.receiveInboundMessage(instanceId, payload);
        await this.options.internalApi.updateInstanceRuntime(instanceId, {
            workerId: this.options.workerId,
            sessionBackend: 'whatsapp_web',
            lastInboundMessageAt: new Date().toISOString(),
            sessionDiagnostics: this.buildDiagnostics(instanceId, {
                phase: 'inbound_message',
                sender: payload.sender,
                kind: payload.kind,
            }),
        });
    }
    async handleOutboundAck(instanceId, client, message, ack) {
        const entry = this.getCurrentEntry(instanceId, client);
        if (!entry) {
            return;
        }
        this.recordClientEvent(entry, 'message_ack');
        const providerMessageId = this.extractMessageId(message);
        if (!providerMessageId) {
            return;
        }
        const outboundMessageId = entry.outboundByProviderId.get(providerMessageId);
        if (!outboundMessageId) {
            return;
        }
        await this.options.internalApi.updateOutboundMessage(instanceId, outboundMessageId, {
            workerId: this.options.workerId,
            ack: mapAckValue(ack),
            message: `WhatsApp Web ack updated to ${mapAckValue(ack)}.`,
        });
    }
    async stopClient(instanceId) {
        const entry = this.managedInstances.get(instanceId);
        if (entry) {
            entry.desiredState = 'stopped';
            entry.recoverAfterAt = null;
            this.recordClientEvent(entry, 'stop_requested');
        }
        await this.destroyClient(instanceId, 'Stop requested.');
        await this.transitionStatus(instanceId, 'stopped', 'idle', 'WhatsApp Web runtime stopped.');
        await this.options.internalApi.updateInstanceRuntime(instanceId, {
            workerId: this.options.workerId,
            sessionBackend: 'whatsapp_web',
            qrCode: null,
            qrExpiresAt: null,
            currentSessionLabel: null,
            disconnectReason: 'Stopped by operator.',
            lastDisconnectedAt: new Date().toISOString(),
            sessionDiagnostics: this.buildDiagnostics(instanceId, {
                phase: 'stopped',
            }),
        });
    }
    async logoutClient(instanceId, clearStorage) {
        const entry = this.managedInstances.get(instanceId);
        if (entry) {
            entry.desiredState = 'stopped';
            entry.recoverAfterAt = null;
            this.recordClientEvent(entry, clearStorage ? 'clear_requested' : 'logout_requested');
        }
        if (entry?.client) {
            try {
                await entry.client.logout();
            }
            catch {
                // Continue to destroy and clear local data even if the remote logout fails.
            }
        }
        await this.destroyClient(instanceId, clearStorage ? 'Clear requested.' : 'Logout requested.');
        if (clearStorage) {
            await this.clearLocalSessionStorage(instanceId);
        }
        await this.transitionStatus(instanceId, 'standby', clearStorage ? 'cleared' : 'logged_out', clearStorage
            ? 'Local session data cleared.'
            : 'WhatsApp Web session logged out.');
        await this.options.internalApi.updateInstanceRuntime(instanceId, {
            workerId: this.options.workerId,
            sessionBackend: 'whatsapp_web',
            qrCode: null,
            qrExpiresAt: null,
            currentSessionLabel: null,
            disconnectReason: clearStorage ? 'Session cleared.' : 'Logged out.',
            lastDisconnectedAt: new Date().toISOString(),
            sessionDiagnostics: this.buildDiagnostics(instanceId, {
                phase: clearStorage ? 'cleared' : 'logged_out',
            }),
        });
    }
    async takeoverClient(instanceId) {
        const entry = this.managedInstances.get(instanceId);
        if (!entry?.client) {
            throw new Error('Cannot take over a session without an active WhatsApp Web client.');
        }
        if (!entry.snapshot.substatus || entry.snapshot.substatus !== 'conflict') {
            throw new Error('This instance is not currently in a conflict state.');
        }
        const page = entry.client.pupPage;
        if (!page?.evaluate) {
            throw new Error('WhatsApp Web takeover is unavailable because the browser page handle is missing.');
        }
        entry.clientState = 'loading';
        this.recordClientEvent(entry, 'takeover_requested');
        await this.transitionStatus(instanceId, 'loading', 'taking_over', 'Requesting WhatsApp Web takeover.');
        await this.options.internalApi.updateInstanceRuntime(instanceId, {
            workerId: this.options.workerId,
            sessionBackend: 'whatsapp_web',
            sessionDiagnostics: this.buildDiagnostics(instanceId, {
                phase: 'takeover_requested',
            }),
        });
        await page.evaluate(() => {
            globalThis.Store.AppState.takeover();
        });
        const resolvedState = await this.waitForConflictResolution(instanceId);
        entry.clientState = 'ready';
        entry.recoverAfterAt = null;
        entry.recoveryAttempts = 0;
        entry.lastReadyAt = new Date().toISOString();
        const sessionLabel = this.resolveSessionLabel(entry.client, entry.snapshot.publicId);
        await this.transitionStatus(instanceId, 'authenticated', 'connected', 'WhatsApp Web session takeover completed.');
        await this.options.internalApi.updateInstanceRuntime(instanceId, {
            workerId: this.options.workerId,
            sessionBackend: 'whatsapp_web',
            currentSessionLabel: sessionLabel,
            lastAuthenticatedAt: new Date().toISOString(),
            disconnectReason: null,
            sessionDiagnostics: this.buildDiagnostics(instanceId, {
                phase: 'takeover_completed',
                waState: resolvedState,
            }),
        });
        await this.captureScreenshot(instanceId);
    }
    async destroyClient(instanceId, reason) {
        const entry = this.managedInstances.get(instanceId);
        if (!entry?.client) {
            return;
        }
        const client = entry.client;
        await this.disposeClientReference(instanceId, reason);
        try {
            await client.destroy();
        }
        catch {
            // Best-effort cleanup.
        }
    }
    async disposeClientReference(instanceId, rejectReason) {
        const entry = this.managedInstances.get(instanceId);
        if (!entry) {
            return;
        }
        entry.client = null;
        entry.clientState = 'idle';
        entry.startupSignal?.reject(new Error(rejectReason ?? 'Client reference disposed.'));
        entry.startupSignal = null;
    }
    async clearLocalSessionStorage(instanceId) {
        const entry = this.managedInstances.get(instanceId);
        if (!entry) {
            return;
        }
        const candidatePaths = [
            resolveSessionDirectory(this.sessionStorageDir, entry.snapshot.publicId),
            (0, node_path_1.resolve)(this.sessionStorageDir, 'LocalAuth', entry.snapshot.publicId),
            (0, node_path_1.resolve)(this.sessionStorageDir, `LocalAuth-${entry.snapshot.publicId}`),
        ];
        await Promise.allSettled(candidatePaths.map((candidatePath) => (0, promises_1.rm)(candidatePath, { recursive: true, force: true })));
    }
    async captureScreenshot(instanceId) {
        if (!this.options.env.WORKER_WA_CAPTURE_SCREENSHOTS) {
            return;
        }
        const entry = this.managedInstances.get(instanceId);
        if (!entry?.client) {
            return;
        }
        const page = entry.client.pupPage;
        if (!page?.screenshot) {
            return;
        }
        const screenshotPath = resolveScreenshotPath(this.sessionStorageDir, entry.snapshot.publicId);
        await (0, promises_1.mkdir)((0, node_path_1.dirname)(screenshotPath), { recursive: true });
        await page.screenshot({
            path: screenshotPath,
            type: 'png',
        });
        await this.options.internalApi.updateInstanceRuntime(instanceId, {
            workerId: this.options.workerId,
            sessionBackend: 'whatsapp_web',
            lastScreenshotAt: new Date().toISOString(),
            lastScreenshotPath: screenshotPath,
            sessionDiagnostics: this.buildDiagnostics(instanceId, {
                phase: 'screenshot',
            }),
        });
    }
    async waitForConflictResolution(instanceId) {
        const startedAt = Date.now();
        while (Date.now() - startedAt <
            this.options.env.WORKER_WA_STARTUP_TIMEOUT_MS) {
            const entry = this.managedInstances.get(instanceId);
            if (!entry?.client) {
                throw new Error('WhatsApp Web client was lost while waiting for conflict resolution.');
            }
            const state = await entry.client.getState().catch(() => null);
            const stateText = state ? String(state) : null;
            if (stateText && !isConflictState(stateText)) {
                return stateText;
            }
            await wait(300);
        }
        throw new Error('Timed out waiting for WhatsApp Web conflict resolution.');
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
            backend: 'whatsapp_web',
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
            message: `${action} failed in WhatsApp Web runtime.`,
            errorMessage,
        });
        this.options.logger.warn({
            correlationId: (0, node_crypto_1.randomUUID)(),
            instanceId,
            action,
            backend: 'whatsapp_web',
            error: errorMessage,
        }, 'worker.operation.failed');
        entry.snapshot = {
            ...entry.snapshot,
            pendingOperation: null,
        };
    }
    buildDiagnostics(instanceId, extra) {
        const entry = this.managedInstances.get(instanceId);
        return {
            backend: 'whatsapp_web',
            clientState: entry?.clientState ?? 'idle',
            desiredState: entry?.desiredState ?? 'stopped',
            startupAttempts: entry?.startupAttempts ?? 0,
            recoveryAttempts: entry?.recoveryAttempts ?? 0,
            lastClientEvent: entry?.lastClientEvent ?? null,
            lastClientEventAt: entry?.lastClientEventAt ?? null,
            lastError: entry?.lastError ?? null,
            lastReadyAt: entry?.lastReadyAt ?? null,
            recoverAfterAt: entry?.recoverAfterAt
                ? new Date(entry.recoverAfterAt).toISOString()
                : null,
            browserExecutablePath: this.options.browserExecutablePath,
            sessionStorageDir: resolveSessionDirectory(this.sessionStorageDir, entry?.snapshot.publicId ?? instanceId),
            timestamp: new Date().toISOString(),
            ...(extra ?? {}),
        };
    }
    recordClientEvent(entry, eventName) {
        entry.lastClientEvent = eventName;
        entry.lastClientEventAt = new Date().toISOString();
    }
    async downloadInboundMedia(instanceId, message) {
        const entry = this.managedInstances.get(instanceId);
        if (!entry || !this.options.env.WORKER_WA_DOWNLOAD_INBOUND_MEDIA) {
            return null;
        }
        const messageWithMedia = message;
        if (!messageWithMedia.downloadMedia) {
            return null;
        }
        const downloaded = await messageWithMedia.downloadMedia();
        if (!downloaded?.data) {
            return null;
        }
        const mimeType = downloaded.mimetype ??
            this.readStringField(message, ['_data.mimetype']) ??
            null;
        const extension = inferFileExtension(mimeType, downloaded.filename ?? null);
        const providerMessageId = this.extractMessageId(message) ??
            `${Date.now().toString(36)}-${(0, node_crypto_1.randomUUID)().slice(0, 6)}`;
        const mediaDirectory = resolveInboundMediaDirectory(this.sessionStorageDir, entry.snapshot.publicId);
        const mediaPath = (0, node_path_1.resolve)(mediaDirectory, `${providerMessageId.replace(/[^\w.-]+/g, '_')}.${extension}`);
        await (0, promises_1.mkdir)((0, node_path_1.dirname)(mediaPath), { recursive: true });
        await (0, promises_1.writeFile)(mediaPath, Buffer.from(downloaded.data, 'base64'));
        return {
            path: mediaPath,
            mimeType,
        };
    }
    validateOutboundMessage(message) {
        const recipient = message.recipient.trim();
        if (recipient.length < 3) {
            return 'Recipient is too short.';
        }
        if (message.messageType === 'chat' && !message.body?.trim()) {
            return 'Chat messages require a body.';
        }
        if (message.messageType === 'image' && !message.mediaUrl?.trim()) {
            return 'Image messages require a media URL.';
        }
        try {
            normalizeRecipient(recipient);
        }
        catch (error) {
            return error instanceof Error ? error.message : String(error);
        }
        return null;
    }
    extractMessageId(message) {
        const candidate = message
            ?.id?._serialized;
        return typeof candidate === 'string' && candidate.length > 0
            ? candidate
            : null;
    }
    resolveSessionLabel(client, publicId) {
        const info = client;
        return (info?.info?.wid?._serialized ??
            info?.info?.wid?.user ??
            info?.info?.pushname ??
            `session-${publicId}`);
    }
    readStringField(message, fieldPaths) {
        const raw = message;
        for (const fieldPath of fieldPaths) {
            const segments = fieldPath.split('.');
            let current = raw;
            for (const segment of segments) {
                if (!current || typeof current !== 'object') {
                    current = undefined;
                    break;
                }
                current = current[segment];
            }
            if (typeof current === 'string' && current.length > 0) {
                return current;
            }
        }
        return null;
    }
    readBooleanField(message, fieldPaths) {
        const raw = message;
        for (const fieldPath of fieldPaths) {
            const segments = fieldPath.split('.');
            let current = raw;
            for (const segment of segments) {
                if (!current || typeof current !== 'object') {
                    current = undefined;
                    break;
                }
                current = current[segment];
            }
            if (typeof current === 'boolean') {
                return current;
            }
        }
        return false;
    }
    readTimestampField(message, fieldPaths) {
        const raw = message;
        for (const fieldPath of fieldPaths) {
            const segments = fieldPath.split('.');
            let current = raw;
            for (const segment of segments) {
                if (!current || typeof current !== 'object') {
                    current = undefined;
                    break;
                }
                current = current[segment];
            }
            if (typeof current === 'number' && Number.isFinite(current)) {
                return new Date(current * 1_000).toISOString();
            }
        }
        return null;
    }
}
exports.WhatsAppWebSessionRuntime = WhatsAppWebSessionRuntime;
//# sourceMappingURL=whatsapp-web-session-runtime.js.map