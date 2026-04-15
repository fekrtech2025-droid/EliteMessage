import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import type { WorkerEnv } from '@elite-message/config';
import type {
  InstanceAction,
  InternalWorkerAssignedInstance,
  OutboundMessageSummary,
} from '@elite-message/contracts';
import type {
  Client as WhatsAppClient,
  Message as WhatsAppMessage,
} from 'whatsapp-web.js';
import type { SessionRuntime, SessionRuntimeOptions } from './session-runtime';

type WhatsAppWebModule = typeof import('whatsapp-web.js');

type WhatsAppWebRuntimeModule = Pick<
  WhatsAppWebModule,
  'Client' | 'LocalAuth' | 'MessageMedia'
>;

type StartupOutcome = 'qr' | 'ready';

type StartupSignal = {
  promise: Promise<StartupOutcome>;
  resolve: (value: StartupOutcome) => void;
  reject: (reason?: unknown) => void;
};

type ManagedWhatsAppInstance = {
  snapshot: InternalWorkerAssignedInstance;
  client: WhatsAppClient | null;
  clientState:
    | 'idle'
    | 'initializing'
    | 'booting'
    | 'loading'
    | 'qr'
    | 'authenticated'
    | 'ready'
    | 'conflict'
    | 'disconnected'
    | 'stopped';
  startupSignal: StartupSignal | null;
  desiredState: 'running' | 'stopped';
  recoverAfterAt: number | null;
  startupAttempts: number;
  recoveryAttempts: number;
  lastClientEvent: string | null;
  lastClientEventAt: string | null;
  lastError: string | null;
  lastReadyAt: string | null;
  clientPromise?: Promise<void>;
  processingOperationId?: string;
  processingPromise?: Promise<void>;
  processingMessageId?: string;
  messagePromise?: Promise<void>;
  outboundByProviderId: Map<string, string>;
};

type WhatsAppWebSessionRuntimeOptions = SessionRuntimeOptions & {
  browserExecutablePath: string;
  env: WorkerEnv;
};

function wait(ms: number) {
  return new Promise<void>((resolvePromise) => {
    setTimeout(resolvePromise, ms).unref();
  });
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string) {
  return new Promise<T>((resolvePromise, rejectPromise) => {
    const timer = setTimeout(() => {
      rejectPromise(new Error(`${label} timed out after ${ms}ms.`));
    }, ms);

    timer.unref();

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolvePromise(value);
      },
      (error) => {
        clearTimeout(timer);
        rejectPromise(error);
      },
    );
  });
}

function createStartupSignal(): StartupSignal {
  let resolvePromise!: (value: StartupOutcome) => void;
  let rejectPromise!: (reason?: unknown) => void;

  const promise = new Promise<StartupOutcome>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  return {
    promise,
    resolve: resolvePromise,
    reject: rejectPromise,
  };
}

function mapAckValue(value: unknown) {
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

function mapInboundKind(type: unknown) {
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

function shouldAutoRecover(status: InternalWorkerAssignedInstance['status']) {
  return [
    'authenticated',
    'qr',
    'loading',
    'retrying',
    'initialize',
    'booting',
  ].includes(status);
}

function inferDesiredState(instance: InternalWorkerAssignedInstance) {
  if (
    instance.pendingOperation &&
    ['start', 'restart'].includes(instance.pendingOperation.action)
  ) {
    return 'running' as const;
  }

  if (shouldAutoRecover(instance.status)) {
    return 'running' as const;
  }

  return 'stopped' as const;
}

function isBootInProgress(clientState: ManagedWhatsAppInstance['clientState']) {
  return ['initializing', 'booting', 'loading', 'authenticated'].includes(
    clientState,
  );
}

function isConflictState(state: unknown) {
  return String(state).trim().toUpperCase() === 'CONFLICT';
}

function normalizeRecipient(recipient: string) {
  const trimmed = recipient.trim();
  if (trimmed.endsWith('@c.us') || trimmed.endsWith('@g.us')) {
    return trimmed;
  }

  const digits = trimmed.replace(/[^\d]/g, '');
  if (digits.length < 3) {
    throw new Error(
      'Recipient could not be normalized into a WhatsApp chat id.',
    );
  }

  return `${digits}@c.us`;
}

function resolveSessionDirectory(storageRoot: string, publicId: string) {
  return resolve(storageRoot, `session-${publicId}`);
}

function resolveScreenshotPath(storageRoot: string, publicId: string) {
  return resolve(storageRoot, 'screenshots', `${publicId}.png`);
}

function resolveInboundMediaDirectory(storageRoot: string, publicId: string) {
  return resolve(storageRoot, 'media', publicId);
}

function inferFileExtension(
  mimeType: string | null | undefined,
  fallback?: string | null,
) {
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

export function resolveWorkerBrowserExecutablePath(preferredPath?: string) {
  const candidates = [
    preferredPath,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  ].filter((value): value is string => Boolean(value));

  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

function resolveWhatsAppWebRuntimeModule(
  module: WhatsAppWebModule,
): WhatsAppWebRuntimeModule {
  const candidate = (
    'default' in module && module.default && typeof module.default === 'object'
      ? module.default
      : module
  ) as Partial<WhatsAppWebRuntimeModule>;

  if (
    typeof candidate.Client !== 'function' ||
    typeof candidate.LocalAuth !== 'function' ||
    typeof candidate.MessageMedia?.fromUrl !== 'function'
  ) {
    throw new Error('whatsapp-web.js runtime exports are invalid.');
  }

  return candidate as WhatsAppWebRuntimeModule;
}

export class WhatsAppWebSessionRuntime implements SessionRuntime {
  private readonly managedInstances = new Map<
    string,
    ManagedWhatsAppInstance
  >();
  private readonly sessionStorageDir: string;
  private readonly screenshotRootDir: string;
  private module: WhatsAppWebRuntimeModule | null = null;
  private stopping = false;

  constructor(private readonly options: WhatsAppWebSessionRuntimeOptions) {
    this.sessionStorageDir = resolve(
      this.options.env.WORKER_SESSION_STORAGE_DIR,
    );
    this.screenshotRootDir = resolve(
      this.options.env.WORKER_SESSION_STORAGE_DIR,
      'screenshots',
    );
  }

  async start() {
    this.stopping = false;
    this.module = resolveWhatsAppWebRuntimeModule(
      await import('whatsapp-web.js'),
    );
    await mkdir(this.sessionStorageDir, { recursive: true });
    if (this.options.env.WORKER_WA_CAPTURE_SCREENSHOTS) {
      await mkdir(this.screenshotRootDir, { recursive: true });
    }
  }

  async stop() {
    this.stopping = true;
    await Promise.allSettled(
      [...this.managedInstances.keys()].map((instanceId) =>
        this.destroyClient(instanceId, 'Worker shutdown requested.'),
      ),
    );
    await Promise.allSettled(
      [...this.managedInstances.values()]
        .flatMap((entry) => [
          entry.processingPromise,
          entry.messagePromise,
          entry.clientPromise,
        ])
        .filter((promise): promise is Promise<void> => Boolean(promise)),
    );
  }

  syncAssignedInstances(instances: InternalWorkerAssignedInstance[]) {
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
        outboundByProviderId:
          existing?.outboundByProviderId ?? new Map<string, string>(),
      });
    }

    for (const [instanceId] of this.managedInstances.entries()) {
      if (nextIds.has(instanceId)) {
        continue;
      }

      void this.destroyClient(
        instanceId,
        'Instance assignment removed from worker.',
      );
      this.managedInstances.delete(instanceId);
    }
  }

  async processAssignments() {
    for (const [instanceId, entry] of this.managedInstances.entries()) {
      if (this.stopping) {
        return;
      }

      const canAutoRecover =
        entry.desiredState === 'running' &&
        !entry.snapshot.pendingOperation &&
        shouldAutoRecover(entry.snapshot.status) &&
        (!entry.recoverAfterAt || entry.recoverAfterAt <= Date.now());

      if (!entry.client && !entry.clientPromise && canAutoRecover) {
        entry.clientPromise = this.ensureClient(instanceId)
          .then(() => undefined)
          .catch((error) => {
            this.options.logger.warn(
              {
                correlationId: randomUUID(),
                instanceId,
                backend: 'whatsapp_web',
                error: error instanceof Error ? error.message : String(error),
              },
              'worker.runtime.ensure_client_failed',
            );
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
        if (
          entry.processingOperationId === pendingOperation.id ||
          entry.processingPromise
        ) {
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

      if (
        entry.clientState !== 'ready' ||
        !entry.client ||
        entry.messagePromise
      ) {
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

  removeInstance(instanceId: string) {
    void this.destroyClient(
      instanceId,
      'Instance removed from worker runtime.',
    );
    this.managedInstances.delete(instanceId);
  }

  getActiveInstanceCount() {
    return this.managedInstances.size;
  }

  private async runOperation(instanceId: string) {
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
      await this.options.internalApi.updateInstanceOperationStatus(
        instanceId,
        operation.id,
        {
          workerId: this.options.workerId,
          status: 'running',
          message: `${operation.action} operation accepted by WhatsApp Web runtime.`,
        },
      );

      switch (operation.action) {
        case 'start': {
          entry.desiredState = 'running';
          if (entry.clientState === 'ready') {
            await this.completeOperation(
              instanceId,
              'start',
              'WhatsApp Web session is already connected.',
            );
            break;
          }

          if (entry.client && entry.clientState === 'qr') {
            await this.completeOperation(
              instanceId,
              'start',
              'WhatsApp Web QR is ready for scan.',
            );
            break;
          }

          if (
            (entry.client && isBootInProgress(entry.clientState)) ||
            entry.clientPromise
          ) {
            await this.completeOperation(
              instanceId,
              'start',
              'WhatsApp Web startup is already in progress.',
            );
            break;
          }

          const startupOutcome = await this.ensureClient(instanceId);
          await this.completeOperation(
            instanceId,
            'start',
            startupOutcome === 'ready'
              ? 'WhatsApp Web session connected.'
              : 'WhatsApp Web QR is ready for scan.',
          );
          break;
        }
        case 'restart': {
          entry.desiredState = 'running';
          await this.destroyClient(instanceId, 'Restart requested.');
          await wait(250);
          const startupOutcome = await this.ensureClient(instanceId);
          await this.completeOperation(
            instanceId,
            'restart',
            startupOutcome === 'ready'
              ? 'WhatsApp Web session restarted and connected.'
              : 'WhatsApp Web QR is ready after restart.',
          );
          break;
        }
        case 'stop':
          entry.desiredState = 'stopped';
          await this.stopClient(instanceId);
          await this.completeOperation(
            instanceId,
            'stop',
            'WhatsApp Web runtime stopped.',
          );
          break;
        case 'logout':
          entry.desiredState = 'stopped';
          await this.logoutClient(instanceId, false);
          await this.completeOperation(
            instanceId,
            'logout',
            'WhatsApp Web session logged out.',
          );
          break;
        case 'clear':
          entry.desiredState = 'stopped';
          await this.logoutClient(instanceId, true);
          await this.completeOperation(
            instanceId,
            'clear',
            'WhatsApp Web session cleared from local storage.',
          );
          break;
        case 'takeover':
          entry.desiredState = 'running';
          await this.takeoverClient(instanceId);
          await this.completeOperation(
            instanceId,
            'takeover',
            'WhatsApp Web session conflict takeover completed.',
          );
          break;
        case 'reassign':
          await this.completeOperation(
            instanceId,
            'reassign',
            'Reassign action is handled by the control plane.',
          );
          break;
      }
    } catch (error) {
      await this.failOperation(
        instanceId,
        operation.action,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  private async runNextMessage(instanceId: string) {
    const entry = this.managedInstances.get(instanceId);
    if (
      !entry ||
      this.stopping ||
      entry.clientState !== 'ready' ||
      !entry.client ||
      entry.snapshot.pendingOperation
    ) {
      return;
    }

    const claimed = await this.options.internalApi.claimNextOutboundMessage(
      instanceId,
      {
        workerId: this.options.workerId,
      },
    );

    if (!claimed.message) {
      return;
    }

    entry.processingMessageId = claimed.message.id;
    await this.processOutboundMessage(instanceId, claimed.message);
  }

  private async processOutboundMessage(
    instanceId: string,
    message: OutboundMessageSummary,
  ) {
    const entry = this.managedInstances.get(instanceId);
    if (!entry?.client) {
      return;
    }

    try {
      const invalidReason = this.validateOutboundMessage(message);
      if (invalidReason) {
        await this.options.internalApi.updateOutboundMessage(
          instanceId,
          message.id,
          {
            workerId: this.options.workerId,
            status: 'invalid',
            message: 'WhatsApp Web runtime rejected the outbound message.',
            errorMessage: invalidReason,
          },
        );
        return;
      }

      const chatId = normalizeRecipient(message.recipient);
      let sentMessage: WhatsAppMessage;
      if (message.messageType === 'chat') {
        sentMessage = await entry.client.sendMessage(
          chatId,
          message.body ?? '',
        );
      } else {
        if (!this.module) {
          throw new Error('WhatsApp Web module is not loaded.');
        }

        const media = await this.module.MessageMedia.fromUrl(
          message.mediaUrl!,
          {
            unsafeMime: true,
          },
        );
        sentMessage = await entry.client.sendMessage(chatId, media, {
          caption: message.caption ?? undefined,
        });
      }

      const providerMessageId = this.extractMessageId(sentMessage);
      if (providerMessageId) {
        entry.outboundByProviderId.set(providerMessageId, message.id);
      }

      await this.options.internalApi.updateOutboundMessage(
        instanceId,
        message.id,
        {
          workerId: this.options.workerId,
          status: 'sent',
          ack: 'server',
          providerMessageId: providerMessageId ?? undefined,
          message: 'Sent through WhatsApp Web runtime.',
        },
      );

      this.options.logger.info(
        {
          correlationId: randomUUID(),
          instanceId,
          messageId: message.id,
          publicMessageId: message.publicMessageId,
          providerMessageId,
          backend: 'whatsapp_web',
        },
        'worker.message.sent',
      );
    } catch (error) {
      entry.lastError = error instanceof Error ? error.message : String(error);
      await this.options.internalApi.updateOutboundMessage(
        instanceId,
        message.id,
        {
          workerId: this.options.workerId,
          status: 'unsent',
          message: 'WhatsApp Web runtime failed to send the outbound message.',
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      );
    }
  }

  private async ensureClient(instanceId: string): Promise<StartupOutcome> {
    const entry = this.managedInstances.get(instanceId);
    if (!entry) {
      throw new Error('Managed instance not found.');
    }

    if (entry.clientState === 'ready') {
      return 'ready';
    }

    if (entry.startupSignal) {
      return withTimeout(
        entry.startupSignal.promise,
        this.options.env.WORKER_WA_STARTUP_TIMEOUT_MS,
        'WhatsApp Web startup',
      );
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
    await this.transitionStatus(
      instanceId,
      'initialize',
      'preparing_whatsapp_web',
      'Preparing WhatsApp Web runtime.',
    );
    await wait(200);
    await this.transitionStatus(
      instanceId,
      'booting',
      'launching_browser',
      'Launching the browser-backed WhatsApp session.',
    );
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

        const errorMessage =
          error instanceof Error
            ? error.message
            : 'WhatsApp Web startup failed.';
        const shouldRecover = Boolean(
          current && !this.stopping && current.desiredState === 'running',
        );

        if (current && shouldRecover) {
          current.recoveryAttempts += 1;
          current.recoverAfterAt =
            Date.now() + this.options.env.WORKER_WA_AUTO_RECOVERY_DELAY_MS;
          await this.transitionStatus(
            instanceId,
            'retrying',
            'startup_failed_retry',
            errorMessage,
          );
        } else {
          await this.transitionStatus(
            instanceId,
            'disconnected',
            'startup_failed',
            errorMessage,
          );
        }

        await this.options.internalApi.updateInstanceRuntime(instanceId, {
          workerId: this.options.workerId,
          qrCode: null,
          qrExpiresAt: null,
          sessionBackend: 'whatsapp_web',
          disconnectReason:
            error instanceof Error ? error.message : String(error),
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

    return withTimeout(
      entry.startupSignal.promise,
      this.options.env.WORKER_WA_STARTUP_TIMEOUT_MS,
      'WhatsApp Web startup',
    );
  }

  private bindClientEvents(instanceId: string, client: WhatsAppClient) {
    client.on('qr', (qr) => {
      void this.handleQr(instanceId, qr);
    });

    client.on('loading_screen', (percent, message) => {
      void this.handleLoading(instanceId, percent, message);
    });

    client.on('change_state', (state) => {
      void this.handleStateChange(instanceId, state);
    });

    client.on('authenticated', () => {
      void this.handleAuthenticated(instanceId);
    });

    client.on('ready', () => {
      void this.handleReady(instanceId);
    });

    client.on('disconnected', (reason) => {
      void this.handleDisconnected(instanceId, reason);
    });

    client.on('message', (message) => {
      if ((message as { fromMe?: boolean }).fromMe) {
        return;
      }

      void this.handleInboundMessage(instanceId, message);
    });

    client.on('message_ack', (message, ack) => {
      if (!(message as { fromMe?: boolean }).fromMe) {
        return;
      }

      void this.handleOutboundAck(instanceId, message, ack);
    });
  }

  private async handleQr(instanceId: string, qr: string) {
    const entry = this.managedInstances.get(instanceId);
    if (!entry) {
      return;
    }

    entry.clientState = 'qr';
    entry.desiredState = 'running';
    this.recordClientEvent(entry, 'qr');
    entry.startupSignal?.resolve('qr');
    entry.startupSignal = null;

    const qrExpiresAt = new Date(Date.now() + 45_000).toISOString();
    await this.transitionStatus(
      instanceId,
      'qr',
      'awaiting_scan',
      'WhatsApp Web QR generated.',
    );
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

  private async handleLoading(
    instanceId: string,
    percent: unknown,
    message: unknown,
  ) {
    const entry = this.managedInstances.get(instanceId);
    if (!entry) {
      return;
    }

    entry.clientState = 'loading';
    this.recordClientEvent(entry, 'loading_screen');
    await this.transitionStatus(
      instanceId,
      'loading',
      'loading_session',
      `WhatsApp Web loading screen ${String(percent ?? 0)}%. ${String(message ?? '').trim()}`.trim(),
    );
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

  private async handleStateChange(instanceId: string, state: unknown) {
    const entry = this.managedInstances.get(instanceId);
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
    await this.transitionStatus(
      instanceId,
      'disconnected',
      'conflict',
      'WhatsApp Web reported a linked-device conflict.',
    );
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

  private async handleAuthenticated(instanceId: string) {
    const entry = this.managedInstances.get(instanceId);
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

  private async handleReady(instanceId: string) {
    const entry = this.managedInstances.get(instanceId);
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

    const sessionLabel = this.resolveSessionLabel(
      entry.client,
      entry.snapshot.publicId,
    );
    await this.transitionStatus(
      instanceId,
      'authenticated',
      'connected',
      'WhatsApp Web session is connected.',
    );
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

  private async handleDisconnected(instanceId: string, reason: unknown) {
    const entry = this.managedInstances.get(instanceId);
    if (!entry) {
      return;
    }

    const reasonText = String(reason);
    entry.clientState = 'disconnected';
    entry.lastError = reasonText;
    this.recordClientEvent(entry, 'disconnected');
    entry.startupSignal?.reject(
      new Error(
        `WhatsApp Web disconnected before startup completed: ${String(reason)}`,
      ),
    );
    entry.startupSignal = null;

    await this.captureScreenshot(instanceId);
    await this.disposeClientReference(instanceId);

    if (!this.stopping && entry.desiredState === 'running') {
      entry.recoveryAttempts += 1;
      entry.recoverAfterAt =
        Date.now() + this.options.env.WORKER_WA_AUTO_RECOVERY_DELAY_MS;
      await this.transitionStatus(
        instanceId,
        'retrying',
        'auto_recover_pending',
        `WhatsApp Web disconnected: ${reasonText}`,
      );
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

    await this.transitionStatus(
      instanceId,
      'disconnected',
      'whatsapp_web_disconnected',
      `WhatsApp Web disconnected: ${reasonText}`,
    );
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

  private async handleInboundMessage(
    instanceId: string,
    message: WhatsAppMessage,
  ) {
    const entry = this.managedInstances.get(instanceId);
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
      pushName:
        this.readStringField(message, ['notifyName', '_data.notifyName']) ??
        null,
      kind: mapInboundKind(this.readStringField(message, ['type'])),
      body: this.readStringField(message, ['body']) ?? null,
      mediaUrl: downloadedMedia?.path ?? null,
      mimeType:
        downloadedMedia?.mimeType ??
        this.readStringField(message, ['_data.mimetype']) ??
        null,
      fromMe: Boolean((message as { fromMe?: boolean }).fromMe),
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
    } as const;

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

  private async handleOutboundAck(
    instanceId: string,
    message: WhatsAppMessage,
    ack: unknown,
  ) {
    const entry = this.managedInstances.get(instanceId);
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

    await this.options.internalApi.updateOutboundMessage(
      instanceId,
      outboundMessageId,
      {
        workerId: this.options.workerId,
        ack: mapAckValue(ack),
        message: `WhatsApp Web ack updated to ${mapAckValue(ack)}.`,
      },
    );
  }

  private async stopClient(instanceId: string) {
    const entry = this.managedInstances.get(instanceId);
    if (entry) {
      entry.desiredState = 'stopped';
      entry.recoverAfterAt = null;
      this.recordClientEvent(entry, 'stop_requested');
    }

    await this.destroyClient(instanceId, 'Stop requested.');
    await this.transitionStatus(
      instanceId,
      'stopped',
      'idle',
      'WhatsApp Web runtime stopped.',
    );
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

  private async logoutClient(instanceId: string, clearStorage: boolean) {
    const entry = this.managedInstances.get(instanceId);
    if (entry) {
      entry.desiredState = 'stopped';
      entry.recoverAfterAt = null;
      this.recordClientEvent(
        entry,
        clearStorage ? 'clear_requested' : 'logout_requested',
      );
    }

    if (entry?.client) {
      try {
        await entry.client.logout();
      } catch {
        // Continue to destroy and clear local data even if the remote logout fails.
      }
    }

    await this.destroyClient(
      instanceId,
      clearStorage ? 'Clear requested.' : 'Logout requested.',
    );
    if (clearStorage) {
      await this.clearLocalSessionStorage(instanceId);
    }

    await this.transitionStatus(
      instanceId,
      'standby',
      clearStorage ? 'cleared' : 'logged_out',
      clearStorage
        ? 'Local session data cleared.'
        : 'WhatsApp Web session logged out.',
    );
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

  private async takeoverClient(instanceId: string) {
    const entry = this.managedInstances.get(instanceId);
    if (!entry?.client) {
      throw new Error(
        'Cannot take over a session without an active WhatsApp Web client.',
      );
    }

    if (!entry.snapshot.substatus || entry.snapshot.substatus !== 'conflict') {
      throw new Error('This instance is not currently in a conflict state.');
    }

    const page = (
      entry.client as unknown as {
        pupPage?: {
          evaluate: <T>(fn: () => T | Promise<T>) => Promise<T>;
        };
      }
    ).pupPage;

    if (!page?.evaluate) {
      throw new Error(
        'WhatsApp Web takeover is unavailable because the browser page handle is missing.',
      );
    }

    entry.clientState = 'loading';
    this.recordClientEvent(entry, 'takeover_requested');
    await this.transitionStatus(
      instanceId,
      'loading',
      'taking_over',
      'Requesting WhatsApp Web takeover.',
    );
    await this.options.internalApi.updateInstanceRuntime(instanceId, {
      workerId: this.options.workerId,
      sessionBackend: 'whatsapp_web',
      sessionDiagnostics: this.buildDiagnostics(instanceId, {
        phase: 'takeover_requested',
      }),
    });

    await page.evaluate(() => {
      (
        globalThis as unknown as {
          Store: {
            AppState: {
              takeover: () => void;
            };
          };
        }
      ).Store.AppState.takeover();
    });

    const resolvedState = await this.waitForConflictResolution(instanceId);
    entry.clientState = 'ready';
    entry.recoverAfterAt = null;
    entry.recoveryAttempts = 0;
    entry.lastReadyAt = new Date().toISOString();

    const sessionLabel = this.resolveSessionLabel(
      entry.client,
      entry.snapshot.publicId,
    );
    await this.transitionStatus(
      instanceId,
      'authenticated',
      'connected',
      'WhatsApp Web session takeover completed.',
    );
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

  private async destroyClient(instanceId: string, reason: string) {
    const entry = this.managedInstances.get(instanceId);
    if (!entry?.client) {
      return;
    }

    const client = entry.client;
    await this.disposeClientReference(instanceId, reason);

    try {
      await client.destroy();
    } catch {
      // Best-effort cleanup.
    }
  }

  private async disposeClientReference(
    instanceId: string,
    rejectReason?: string,
  ) {
    const entry = this.managedInstances.get(instanceId);
    if (!entry) {
      return;
    }

    entry.client = null;
    entry.clientState = 'idle';
    entry.startupSignal?.reject(
      new Error(rejectReason ?? 'Client reference disposed.'),
    );
    entry.startupSignal = null;
  }

  private async clearLocalSessionStorage(instanceId: string) {
    const entry = this.managedInstances.get(instanceId);
    if (!entry) {
      return;
    }

    const candidatePaths = [
      resolveSessionDirectory(this.sessionStorageDir, entry.snapshot.publicId),
      resolve(this.sessionStorageDir, 'LocalAuth', entry.snapshot.publicId),
      resolve(this.sessionStorageDir, `LocalAuth-${entry.snapshot.publicId}`),
    ];

    await Promise.allSettled(
      candidatePaths.map((candidatePath) =>
        rm(candidatePath, { recursive: true, force: true }),
      ),
    );
  }

  private async captureScreenshot(instanceId: string) {
    if (!this.options.env.WORKER_WA_CAPTURE_SCREENSHOTS) {
      return;
    }

    const entry = this.managedInstances.get(instanceId);
    if (!entry?.client) {
      return;
    }

    const page = (
      entry.client as unknown as {
        pupPage?: {
          screenshot: (options: {
            path: string;
            type: 'png';
          }) => Promise<unknown>;
        };
      }
    ).pupPage;
    if (!page?.screenshot) {
      return;
    }

    const screenshotPath = resolveScreenshotPath(
      this.sessionStorageDir,
      entry.snapshot.publicId,
    );
    await mkdir(dirname(screenshotPath), { recursive: true });
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

  private async waitForConflictResolution(instanceId: string) {
    const startedAt = Date.now();
    while (
      Date.now() - startedAt <
      this.options.env.WORKER_WA_STARTUP_TIMEOUT_MS
    ) {
      const entry = this.managedInstances.get(instanceId);
      if (!entry?.client) {
        throw new Error(
          'WhatsApp Web client was lost while waiting for conflict resolution.',
        );
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

  private async transitionStatus(
    instanceId: string,
    status: InternalWorkerAssignedInstance['status'],
    substatus: string,
    message: string,
  ) {
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

  private async completeOperation(
    instanceId: string,
    action: InstanceAction,
    message: string,
  ) {
    const entry = this.managedInstances.get(instanceId);
    if (!entry?.snapshot.pendingOperation) {
      return;
    }

    await this.options.internalApi.updateInstanceOperationStatus(
      instanceId,
      entry.snapshot.pendingOperation.id,
      {
        workerId: this.options.workerId,
        status: 'completed',
        message,
      },
    );

    this.options.logger.info(
      {
        correlationId: randomUUID(),
        instanceId,
        action,
        backend: 'whatsapp_web',
      },
      'worker.operation.completed',
    );

    entry.snapshot = {
      ...entry.snapshot,
      pendingOperation: null,
    };
  }

  private async failOperation(
    instanceId: string,
    action: InstanceAction,
    errorMessage: string,
  ) {
    const entry = this.managedInstances.get(instanceId);
    if (!entry?.snapshot.pendingOperation) {
      return;
    }

    await this.options.internalApi.updateInstanceOperationStatus(
      instanceId,
      entry.snapshot.pendingOperation.id,
      {
        workerId: this.options.workerId,
        status: 'failed',
        message: `${action} failed in WhatsApp Web runtime.`,
        errorMessage,
      },
    );

    this.options.logger.warn(
      {
        correlationId: randomUUID(),
        instanceId,
        action,
        backend: 'whatsapp_web',
        error: errorMessage,
      },
      'worker.operation.failed',
    );

    entry.snapshot = {
      ...entry.snapshot,
      pendingOperation: null,
    };
  }

  private buildDiagnostics(
    instanceId: string,
    extra?: Record<string, unknown>,
  ) {
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
      sessionStorageDir: resolveSessionDirectory(
        this.sessionStorageDir,
        entry?.snapshot.publicId ?? instanceId,
      ),
      timestamp: new Date().toISOString(),
      ...(extra ?? {}),
    };
  }

  private recordClientEvent(entry: ManagedWhatsAppInstance, eventName: string) {
    entry.lastClientEvent = eventName;
    entry.lastClientEventAt = new Date().toISOString();
  }

  private async downloadInboundMedia(
    instanceId: string,
    message: WhatsAppMessage,
  ) {
    const entry = this.managedInstances.get(instanceId);
    if (!entry || !this.options.env.WORKER_WA_DOWNLOAD_INBOUND_MEDIA) {
      return null;
    }

    const messageWithMedia = message as unknown as {
      downloadMedia?: () => Promise<{
        data?: string;
        mimetype?: string;
        filename?: string;
      } | null>;
    };

    if (!messageWithMedia.downloadMedia) {
      return null;
    }

    const downloaded = await messageWithMedia.downloadMedia();
    if (!downloaded?.data) {
      return null;
    }

    const mimeType =
      downloaded.mimetype ??
      this.readStringField(message, ['_data.mimetype']) ??
      null;
    const extension = inferFileExtension(mimeType, downloaded.filename ?? null);
    const providerMessageId =
      this.extractMessageId(message) ??
      `${Date.now().toString(36)}-${randomUUID().slice(0, 6)}`;
    const mediaDirectory = resolveInboundMediaDirectory(
      this.sessionStorageDir,
      entry.snapshot.publicId,
    );
    const mediaPath = resolve(
      mediaDirectory,
      `${providerMessageId.replace(/[^\w.-]+/g, '_')}.${extension}`,
    );

    await mkdir(dirname(mediaPath), { recursive: true });
    await writeFile(mediaPath, Buffer.from(downloaded.data, 'base64'));
    return {
      path: mediaPath,
      mimeType,
    };
  }

  private validateOutboundMessage(message: OutboundMessageSummary) {
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
    } catch (error) {
      return error instanceof Error ? error.message : String(error);
    }

    return null;
  }

  private extractMessageId(message: WhatsAppMessage | null | undefined) {
    const candidate = (message as unknown as { id?: { _serialized?: string } })
      ?.id?._serialized;
    return typeof candidate === 'string' && candidate.length > 0
      ? candidate
      : null;
  }

  private resolveSessionLabel(client: WhatsAppClient | null, publicId: string) {
    const info = client as unknown as {
      info?: {
        wid?: {
          _serialized?: string;
          user?: string;
        };
        pushname?: string;
      };
    };

    return (
      info.info?.wid?._serialized ??
      info.info?.wid?.user ??
      info.info?.pushname ??
      `session-${publicId}`
    );
  }

  private readStringField(message: WhatsAppMessage, fieldPaths: string[]) {
    const raw = message as unknown as Record<string, unknown>;

    for (const fieldPath of fieldPaths) {
      const segments = fieldPath.split('.');
      let current: unknown = raw;
      for (const segment of segments) {
        if (!current || typeof current !== 'object') {
          current = undefined;
          break;
        }

        current = (current as Record<string, unknown>)[segment];
      }

      if (typeof current === 'string' && current.length > 0) {
        return current;
      }
    }

    return null;
  }

  private readBooleanField(message: WhatsAppMessage, fieldPaths: string[]) {
    const raw = message as unknown as Record<string, unknown>;

    for (const fieldPath of fieldPaths) {
      const segments = fieldPath.split('.');
      let current: unknown = raw;
      for (const segment of segments) {
        if (!current || typeof current !== 'object') {
          current = undefined;
          break;
        }

        current = (current as Record<string, unknown>)[segment];
      }

      if (typeof current === 'boolean') {
        return current;
      }
    }

    return false;
  }

  private readTimestampField(message: WhatsAppMessage, fieldPaths: string[]) {
    const raw = message as unknown as Record<string, unknown>;

    for (const fieldPath of fieldPaths) {
      const segments = fieldPath.split('.');
      let current: unknown = raw;
      for (const segment of segments) {
        if (!current || typeof current !== 'object') {
          current = undefined;
          break;
        }

        current = (current as Record<string, unknown>)[segment];
      }

      if (typeof current === 'number' && Number.isFinite(current)) {
        return new Date(current * 1_000).toISOString();
      }
    }

    return null;
  }
}
