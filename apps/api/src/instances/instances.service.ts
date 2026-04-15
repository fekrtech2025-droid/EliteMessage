import { randomBytes } from 'node:crypto';
import { stat } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateInstanceRequest,
  CreateInstanceResponse,
  InstanceDetailResponse,
  InstanceStatus,
  ListCustomerInstancesResponse,
  PublicInstanceMeResponse,
  PublicInstanceQrCodeResponse,
  PublicInstanceStatusResponse,
  PublicUpdateInstanceSettingsRequest,
  RequestInstanceActionRequest,
  RequestInstanceActionResponse,
  RotateInstanceTokenResponse,
  UpdateInstanceSettingsRequest,
  UpdateInstanceSettingsResponse,
} from '@elite-message/contracts';
import {
  createOpaqueToken,
  createTokenPrefix,
  hashOpaqueToken,
  prisma,
} from '@elite-message/db';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import {
  toInstanceDetailResponse,
  toInstanceOperationSummary,
  toInstanceSettingsView,
  toInstanceSummary,
} from '../common/presenters';
import type { InstanceApiPrincipal } from '../common/request-user';
import { RealtimeService } from '../realtime/realtime.service';

const detailInclude = {
  workspace: true,
  settings: true,
  runtimeState: true,
  apiTokens: {
    where: {
      tokenType: 'instance_api',
    },
    orderBy: {
      createdAt: 'desc',
    },
  },
  operations: {
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  },
  lifecycleEvents: {
    orderBy: {
      createdAt: 'desc',
    },
    take: 25,
  },
} as const;

const startNoOpStatuses = new Set<InstanceStatus>([
  'qr',
  'initialize',
  'booting',
  'loading',
  'retrying',
  'authenticated',
]);

function getStartNoOpMessage(status: InstanceStatus) {
  switch (status) {
    case 'qr':
      return 'This instance already has a QR ready for scan.';
    case 'authenticated':
      return 'This instance is already connected.';
    case 'retrying':
      return 'This instance is already retrying startup.';
    default:
      return 'This instance is already starting.';
  }
}

function isConflictSubstatus(substatus: string | null | undefined) {
  return substatus === 'conflict';
}

function generateWebhookSecret() {
  return randomBytes(24).toString('hex');
}

function resolveWebhookSecret(
  currentSecret: string | undefined,
  nextSecret: string | null | undefined,
) {
  if (nextSecret === undefined) {
    return currentSecret ?? generateWebhookSecret();
  }

  if (nextSecret === null) {
    return generateWebhookSecret();
  }

  const normalized = nextSecret.trim();
  return normalized.length > 0 ? normalized : generateWebhookSecret();
}

@Injectable()
export class InstancesService {
  constructor(
    private readonly realtimeService: RealtimeService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async listCustomerInstances(
    userId: string,
  ): Promise<ListCustomerInstancesResponse> {
    const memberships = await prisma.membership.findMany({
      where: { userId },
      select: {
        workspaceId: true,
      },
    });

    const workspaceIds = memberships.map(
      (membership) => membership.workspaceId,
    );
    if (workspaceIds.length === 0) {
      return { items: [] };
    }

    const instances = await prisma.instance.findMany({
      where: {
        workspaceId: {
          in: workspaceIds,
        },
      },
      include: {
        workspace: true,
        settings: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const workerMap = await this.getWorkerMap(
      instances
        .map((instance) => instance.assignedWorkerId)
        .filter((workerId): workerId is string => Boolean(workerId)),
    );

    return {
      items: instances.map((instance) =>
        toInstanceSummary(
          instance,
          workerMap.get(instance.assignedWorkerId ?? ''),
        ),
      ),
    };
  }

  async createCustomerInstance(
    userId: string,
    input: CreateInstanceRequest,
  ): Promise<CreateInstanceResponse> {
    const membership = await prisma.membership.findFirst({
      where: {
        userId,
        workspaceId: input.workspaceId,
        role: {
          in: ['owner', 'admin', 'operator'],
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        'You do not have permission to create instances in this workspace.',
      );
    }

    const rawToken = createOpaqueToken('instance');
    const publicId = `inst_${randomBytes(6).toString('hex')}`;
    const now = new Date();

    const instance = await prisma.$transaction(async (tx) => {
      const createdInstance = await tx.instance.create({
        data: {
          publicId,
          workspaceId: input.workspaceId,
          name: input.name.trim(),
          status: 'standby',
          createdByUserId: userId,
          lastLifecycleEventAt: now,
          settings: {
            create: {
              webhookSecret: generateWebhookSecret(),
            },
          },
          runtimeState: {
            create: {},
          },
          apiTokens: {
            create: {
              name: `${input.name.trim()} primary token`,
              tokenType: 'instance_api',
              tokenHash: hashOpaqueToken(rawToken),
              prefix: createTokenPrefix(rawToken),
              workspaceId: input.workspaceId,
              createdByUserId: userId,
            },
          },
          lifecycleEvents: {
            create: {
              eventType: 'instance_created',
              actorType: 'customer_user',
              actorId: userId,
              message: 'Instance record created.',
              toStatus: 'standby',
            },
          },
        },
        include: {
          workspace: true,
          settings: true,
        },
      });

      await this.auditLogsService.recordWithClient(tx, {
        workspaceId: createdInstance.workspaceId,
        instanceId: createdInstance.id,
        actorType: 'customer_user',
        actorId: userId,
        entityType: 'instance',
        entityId: createdInstance.id,
        action: 'instance.created',
        summary: `Instance "${createdInstance.name}" created.`,
        metadata: {
          publicId: createdInstance.publicId,
        },
      });

      return createdInstance;
    });

    this.realtimeService.publishInstanceLifecycleUpdated({
      instanceId: instance.id,
      publicId: instance.publicId,
    });

    return {
      instance: toInstanceSummary(instance),
      instanceApiToken: rawToken,
    };
  }

  async getCustomerInstanceDetail(
    userId: string,
    instanceId: string,
  ): Promise<InstanceDetailResponse> {
    const instance = await this.loadCustomerScopedInstanceDetail(
      userId,
      instanceId,
    );
    const assignedWorker = await this.getAssignedWorker(
      instance.assignedWorkerId,
    );

    return toInstanceDetailResponse({
      instance: {
        ...instance,
        settings: instance.settings!,
        runtimeState: instance.runtimeState!,
      },
      assignedWorker,
    });
  }

  async getAdminInstanceDetail(
    instanceId: string,
  ): Promise<InstanceDetailResponse> {
    const instance = await this.loadAdminScopedInstanceDetail(instanceId);
    const assignedWorker = await this.getAssignedWorker(
      instance.assignedWorkerId,
    );

    return toInstanceDetailResponse({
      instance: {
        ...instance,
        settings: instance.settings!,
        runtimeState: instance.runtimeState!,
      },
      assignedWorker,
    });
  }

  async getPublicInstanceStatus(
    principal: InstanceApiPrincipal,
  ): Promise<PublicInstanceStatusResponse> {
    const instance = await this.loadPublicScopedInstanceRuntime(
      principal.instanceId,
    );

    return {
      instanceId: instance.id,
      publicId: instance.publicId,
      status: instance.status,
      substatus: instance.substatus ?? null,
      sessionBackend: instance.runtimeState.sessionBackend,
      currentSessionLabel: instance.runtimeState.currentSessionLabel ?? null,
      qrReady: Boolean(instance.runtimeState.qrCode),
      qrExpiresAt: instance.runtimeState.qrExpiresAt?.toISOString() ?? null,
      lastAuthenticatedAt:
        instance.runtimeState.lastAuthenticatedAt?.toISOString() ?? null,
      lastDisconnectedAt:
        instance.runtimeState.lastDisconnectedAt?.toISOString() ?? null,
      disconnectReason: instance.runtimeState.disconnectReason ?? null,
      updatedAt: instance.updatedAt.toISOString(),
    };
  }

  async getPublicInstanceMe(
    principal: InstanceApiPrincipal,
  ): Promise<PublicInstanceMeResponse> {
    const instance = await this.loadPublicScopedInstanceRuntime(
      principal.instanceId,
    );
    const diagnostics = this.readRuntimeDiagnostics(
      instance.runtimeState.sessionDiagnostics,
    );
    const me =
      diagnostics && typeof diagnostics.me === 'object' ? diagnostics.me : null;

    return {
      instanceId: instance.id,
      publicId: instance.publicId,
      status: instance.status,
      substatus: instance.substatus ?? null,
      sessionBackend: instance.runtimeState.sessionBackend,
      currentSessionLabel: instance.runtimeState.currentSessionLabel ?? null,
      connected: instance.status === 'authenticated',
      me: me ?? null,
      diagnostics,
      updatedAt: instance.runtimeState.updatedAt.toISOString(),
    };
  }

  async getPublicInstanceSettings(principal: InstanceApiPrincipal) {
    const instance = await this.loadPublicScopedInstanceRuntime(
      principal.instanceId,
    );
    return toInstanceSettingsView(instance.settings);
  }

  async getPublicInstanceQrCode(
    principal: InstanceApiPrincipal,
  ): Promise<PublicInstanceQrCodeResponse> {
    const instance = await this.loadPublicScopedInstanceRuntime(
      principal.instanceId,
    );
    const qrExpiresAt = instance.runtimeState.qrExpiresAt;
    const expired = Boolean(qrExpiresAt && qrExpiresAt.getTime() <= Date.now());

    return {
      instanceId: instance.id,
      publicId: instance.publicId,
      qrCode: instance.runtimeState.qrCode ?? null,
      qrExpiresAt: qrExpiresAt?.toISOString() ?? null,
      expired,
      updatedAt: instance.runtimeState.updatedAt.toISOString(),
    };
  }

  async getPublicInstanceScreenshot(principal: InstanceApiPrincipal) {
    await this.ensureInstanceScaffolding(principal.instanceId);

    const instance = await prisma.instance.findUnique({
      where: {
        id: principal.instanceId,
      },
      select: {
        publicId: true,
        runtimeState: {
          select: {
            lastScreenshotAt: true,
            lastScreenshotPath: true,
          },
        },
      },
    });

    if (!instance) {
      throw new NotFoundException('Instance not found.');
    }

    return this.resolveScreenshotAsset(
      instance.publicId,
      instance.runtimeState?.lastScreenshotPath,
      instance.runtimeState?.lastScreenshotAt,
    );
  }

  async getCustomerInstanceScreenshot(userId: string, instanceId: string) {
    await this.ensureInstanceScaffolding(instanceId);

    const instance = await prisma.instance.findFirst({
      where: {
        id: instanceId,
        workspace: {
          memberships: {
            some: {
              userId,
            },
          },
        },
      },
      select: {
        publicId: true,
        runtimeState: {
          select: {
            lastScreenshotAt: true,
            lastScreenshotPath: true,
          },
        },
      },
    });

    if (!instance) {
      throw new NotFoundException('Instance not found.');
    }

    return this.resolveScreenshotAsset(
      instance.publicId,
      instance.runtimeState?.lastScreenshotPath,
      instance.runtimeState?.lastScreenshotAt,
    );
  }

  async getAdminInstanceScreenshot(instanceId: string) {
    await this.ensureInstanceScaffolding(instanceId);

    const instance = await prisma.instance.findUnique({
      where: {
        id: instanceId,
      },
      select: {
        publicId: true,
        runtimeState: {
          select: {
            lastScreenshotAt: true,
            lastScreenshotPath: true,
          },
        },
      },
    });

    if (!instance) {
      throw new NotFoundException('Instance not found.');
    }

    return this.resolveScreenshotAsset(
      instance.publicId,
      instance.runtimeState?.lastScreenshotPath,
      instance.runtimeState?.lastScreenshotAt,
    );
  }

  async updateCustomerInstanceSettings(
    userId: string,
    instanceId: string,
    input: UpdateInstanceSettingsRequest,
  ): Promise<UpdateInstanceSettingsResponse> {
    if (input.sendDelayMax < input.sendDelay) {
      throw new BadRequestException(
        'sendDelayMax must be greater than or equal to sendDelay.',
      );
    }

    const instance = await prisma.instance.findFirst({
      where: {
        id: instanceId,
        workspace: {
          memberships: {
            some: {
              userId,
              role: {
                in: ['owner', 'admin', 'operator'],
              },
            },
          },
        },
      },
      select: {
        id: true,
        publicId: true,
        workspaceId: true,
        settings: {
          select: {
            webhookSecret: true,
          },
        },
      },
    });

    if (!instance) {
      throw new NotFoundException(
        'Instance not found or not editable by this user.',
      );
    }

    await this.ensureInstanceScaffolding(instanceId);
    const currentWebhookSecret =
      instance.settings?.webhookSecret ??
      (
        await prisma.instanceSettings.findUnique({
          where: {
            instanceId,
          },
          select: {
            webhookSecret: true,
          },
        })
      )?.webhookSecret;
    const now = new Date();

    const settings = await prisma.$transaction(async (tx) => {
      const updatedSettings = await tx.instanceSettings.update({
        where: {
          instanceId,
        },
        data: {
          sendDelay: input.sendDelay,
          sendDelayMax: input.sendDelayMax,
          webhookUrl: input.webhookUrl,
          webhookSecret: resolveWebhookSecret(
            currentWebhookSecret,
            input.webhookSecret,
          ),
          webhookMessageReceived: input.webhookMessageReceived,
          webhookMessageCreate: input.webhookMessageCreate,
          webhookMessageAck: input.webhookMessageAck,
        },
      });

      await tx.instance.update({
        where: { id: instanceId },
        data: {
          lastLifecycleEventAt: now,
        },
      });

      await tx.instanceLifecycleEvent.create({
        data: {
          instanceId,
          eventType: 'settings_updated',
          actorType: 'customer_user',
          actorId: userId,
          message: 'Instance settings updated.',
        },
      });

      await this.auditLogsService.recordWithClient(tx, {
        workspaceId: instance.workspaceId,
        instanceId,
        actorType: 'customer_user',
        actorId: userId,
        entityType: 'instance_settings',
        entityId: updatedSettings.id,
        action: 'instance.settings.updated',
        summary: 'Instance settings updated.',
        metadata: {
          sendDelay: updatedSettings.sendDelay,
          sendDelayMax: updatedSettings.sendDelayMax,
          webhookUrl: updatedSettings.webhookUrl,
          webhookSecretUpdated: input.webhookSecret !== undefined,
          webhookMessageReceived: updatedSettings.webhookMessageReceived,
          webhookMessageCreate: updatedSettings.webhookMessageCreate,
          webhookMessageAck: updatedSettings.webhookMessageAck,
        },
      });

      return updatedSettings;
    });

    this.realtimeService.publishInstanceSettingsUpdated({
      instanceId,
      publicId: instance.publicId,
    });
    this.realtimeService.publishInstanceLifecycleUpdated({
      instanceId,
      publicId: instance.publicId,
    });

    return {
      instanceId,
      settings: toInstanceSettingsView(settings),
      updatedAt: settings.updatedAt.toISOString(),
    };
  }

  async updatePublicInstanceSettings(
    principal: InstanceApiPrincipal,
    input: PublicUpdateInstanceSettingsRequest,
  ): Promise<UpdateInstanceSettingsResponse> {
    await this.ensureInstanceScaffolding(principal.instanceId);

    const instance = await prisma.instance.findUnique({
      where: {
        id: principal.instanceId,
      },
      include: {
        settings: true,
      },
    });

    if (!instance || !instance.settings) {
      throw new NotFoundException('Instance not found.');
    }

    const currentSettings = instance.settings;

    const mergedSettings: UpdateInstanceSettingsRequest = {
      sendDelay:
        input.sendDelay ?? input.sendDelaySeconds ?? currentSettings.sendDelay,
      sendDelayMax:
        input.sendDelayMax ??
        input.sendDelayMaxSeconds ??
        currentSettings.sendDelayMax,
      webhookUrl:
        input.webhookUrl === undefined
          ? currentSettings.webhookUrl
          : input.webhookUrl,
      webhookSecret:
        input.webhookSecret === undefined
          ? currentSettings.webhookSecret
          : input.webhookSecret,
      webhookMessageReceived:
        input.webhookMessageReceived ?? currentSettings.webhookMessageReceived,
      webhookMessageCreate:
        input.webhookMessageCreate ?? currentSettings.webhookMessageCreate,
      webhookMessageAck:
        input.webhookMessageAck ?? currentSettings.webhookMessageAck,
    };

    if (mergedSettings.sendDelayMax < mergedSettings.sendDelay) {
      throw new BadRequestException(
        'sendDelayMax must be greater than or equal to sendDelay.',
      );
    }

    const now = new Date();
    const settings = await prisma.$transaction(async (tx) => {
      const updatedSettings = await tx.instanceSettings.update({
        where: {
          instanceId: principal.instanceId,
        },
        data: {
          sendDelay: mergedSettings.sendDelay,
          sendDelayMax: mergedSettings.sendDelayMax,
          webhookUrl: mergedSettings.webhookUrl,
          webhookSecret: resolveWebhookSecret(
            currentSettings.webhookSecret,
            mergedSettings.webhookSecret,
          ),
          webhookMessageReceived: mergedSettings.webhookMessageReceived,
          webhookMessageCreate: mergedSettings.webhookMessageCreate,
          webhookMessageAck: mergedSettings.webhookMessageAck,
        },
      });

      await tx.instance.update({
        where: { id: principal.instanceId },
        data: {
          lastLifecycleEventAt: now,
        },
      });

      await tx.instanceLifecycleEvent.create({
        data: {
          instanceId: principal.instanceId,
          eventType: 'settings_updated',
          actorType: 'system',
          actorId: principal.tokenId,
          message: 'Instance settings updated through the public instance API.',
          metadata: {
            authTokenType: principal.tokenType,
            tokenPrefix: principal.tokenPrefix,
          },
        },
      });

      await this.auditLogsService.recordWithClient(tx, {
        workspaceId: principal.workspaceId,
        instanceId: principal.instanceId,
        actorType: 'system',
        actorId: principal.tokenId,
        entityType: 'instance_settings',
        entityId: updatedSettings.id,
        action: 'instance.settings.updated',
        summary: 'Instance settings updated through the public instance API.',
        metadata: {
          authTokenType: principal.tokenType,
          tokenPrefix: principal.tokenPrefix,
          webhookRetries: input.webhookRetries ?? null,
          sendDelay: updatedSettings.sendDelay,
          sendDelayMax: updatedSettings.sendDelayMax,
          webhookUrl: updatedSettings.webhookUrl,
          webhookSecretUpdated: input.webhookSecret !== undefined,
          webhookMessageReceived: updatedSettings.webhookMessageReceived,
          webhookMessageCreate: updatedSettings.webhookMessageCreate,
          webhookMessageAck: updatedSettings.webhookMessageAck,
        },
      });

      return updatedSettings;
    });

    this.realtimeService.publishInstanceSettingsUpdated({
      instanceId: principal.instanceId,
      publicId: principal.instancePublicId,
    });
    this.realtimeService.publishInstanceLifecycleUpdated({
      instanceId: principal.instanceId,
      publicId: principal.instancePublicId,
    });

    return {
      instanceId: principal.instanceId,
      settings: toInstanceSettingsView(settings),
      updatedAt: settings.updatedAt.toISOString(),
    };
  }

  async requestCustomerInstanceAction(
    userId: string,
    instanceId: string,
    input: RequestInstanceActionRequest,
  ): Promise<RequestInstanceActionResponse> {
    if (input.action === 'reassign') {
      throw new ForbiddenException(
        'Only platform admins can reassign an instance.',
      );
    }

    const instance = await prisma.instance.findFirst({
      where: {
        id: instanceId,
        workspace: {
          memberships: {
            some: {
              userId,
              role: {
                in: ['owner', 'admin', 'operator'],
              },
            },
          },
        },
      },
      select: {
        id: true,
        publicId: true,
        workspaceId: true,
        status: true,
        substatus: true,
      },
    });

    if (!instance) {
      throw new NotFoundException(
        'Instance not found or not actionable by this user.',
      );
    }

    if (
      input.action === 'takeover' &&
      !isConflictSubstatus(instance.substatus)
    ) {
      return {
        instanceId: instance.id,
        message:
          'This instance is not currently blocked by a session conflict.',
        operation: null,
      };
    }

    return this.enqueueInstanceAction({
      instanceId: instance.id,
      publicId: instance.publicId,
      workspaceId: instance.workspaceId,
      currentStatus: instance.status,
      currentSubstatus: instance.substatus,
      actorType: 'customer_user',
      actorId: userId,
      input,
    });
  }

  async requestPublicInstanceAction(
    principal: InstanceApiPrincipal,
    input: RequestInstanceActionRequest,
  ): Promise<RequestInstanceActionResponse> {
    if (input.action === 'reassign') {
      throw new ForbiddenException(
        'Public instance API tokens cannot reassign an instance.',
      );
    }

    const instance = await prisma.instance.findUnique({
      where: {
        id: principal.instanceId,
      },
      select: {
        id: true,
        publicId: true,
        workspaceId: true,
        status: true,
        substatus: true,
      },
    });

    if (!instance) {
      throw new NotFoundException('Instance not found.');
    }

    if (
      input.action === 'takeover' &&
      !isConflictSubstatus(instance.substatus)
    ) {
      return {
        instanceId: instance.id,
        message:
          'This instance is not currently blocked by a session conflict.',
        operation: null,
      };
    }

    return this.enqueueInstanceAction({
      instanceId: instance.id,
      publicId: instance.publicId,
      workspaceId: instance.workspaceId,
      currentStatus: instance.status,
      currentSubstatus: instance.substatus,
      actorType: 'system',
      actorId: principal.tokenId,
      extraAuditMetadata: {
        authTokenType: principal.tokenType,
        tokenPrefix: principal.tokenPrefix,
      },
      input,
    });
  }

  async requestAdminInstanceAction(
    userId: string,
    instanceId: string,
    input: RequestInstanceActionRequest,
  ): Promise<RequestInstanceActionResponse> {
    const instance = await prisma.instance.findUnique({
      where: {
        id: instanceId,
      },
      select: {
        id: true,
        publicId: true,
        workspaceId: true,
        status: true,
        substatus: true,
        assignedWorkerId: true,
      },
    });

    if (!instance) {
      throw new NotFoundException('Instance not found.');
    }

    if (input.action === 'reassign') {
      return this.reassignInstance(
        userId,
        instance.id,
        instance.publicId,
        instance.status,
        instance.substatus,
        input.targetWorkerId,
      );
    }

    if (
      input.action === 'takeover' &&
      !isConflictSubstatus(instance.substatus)
    ) {
      return {
        instanceId: instance.id,
        message:
          'This instance is not currently blocked by a session conflict.',
        operation: null,
      };
    }

    return this.enqueueInstanceAction({
      instanceId: instance.id,
      publicId: instance.publicId,
      workspaceId: instance.workspaceId,
      currentStatus: instance.status,
      currentSubstatus: instance.substatus,
      actorType: 'platform_admin',
      actorId: userId,
      input,
    });
  }

  async rotateCustomerInstanceToken(
    userId: string,
    instanceId: string,
  ): Promise<RotateInstanceTokenResponse> {
    const instance = await prisma.instance.findFirst({
      where: {
        id: instanceId,
        workspace: {
          memberships: {
            some: {
              userId,
              role: {
                in: ['owner', 'admin', 'operator'],
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        workspaceId: true,
        publicId: true,
      },
    });

    if (!instance) {
      throw new NotFoundException(
        'Instance not found or not rotatable by this user.',
      );
    }

    const rawToken = createOpaqueToken('instance');
    const tokenPrefix = createTokenPrefix(rawToken);
    const now = new Date();

    const createdToken = await prisma.$transaction(async (tx) => {
      await tx.apiToken.updateMany({
        where: {
          instanceId,
          tokenType: 'instance_api',
          revokedAt: null,
        },
        data: {
          revokedAt: now,
        },
      });

      const nextToken = await tx.apiToken.create({
        data: {
          name: `${instance.name} rotated token`,
          tokenType: 'instance_api',
          tokenHash: hashOpaqueToken(rawToken),
          prefix: tokenPrefix,
          workspaceId: instance.workspaceId,
          instanceId,
          createdByUserId: userId,
        },
      });

      await tx.instance.update({
        where: { id: instanceId },
        data: {
          lastLifecycleEventAt: now,
        },
      });

      await tx.instanceLifecycleEvent.create({
        data: {
          instanceId,
          eventType: 'token_rotated',
          actorType: 'customer_user',
          actorId: userId,
          message: 'Instance API token rotated.',
        },
      });

      await this.auditLogsService.recordWithClient(tx, {
        workspaceId: instance.workspaceId,
        instanceId,
        actorType: 'customer_user',
        actorId: userId,
        entityType: 'instance_api_token',
        entityId: nextToken.id,
        action: 'instance.api_token.rotated',
        summary: `Instance API token rotated for "${instance.name}".`,
        metadata: {
          prefix: nextToken.prefix,
        },
      });

      return nextToken;
    });

    this.realtimeService.publishInstanceLifecycleUpdated({
      instanceId,
      publicId: instance.publicId,
    });

    return {
      instanceId,
      token: rawToken,
      prefix: createdToken.prefix,
      createdAt: createdToken.createdAt.toISOString(),
    };
  }

  private async enqueueInstanceAction(input: {
    instanceId: string;
    publicId: string;
    workspaceId: string;
    currentStatus: InstanceStatus;
    currentSubstatus: string | null;
    actorType: 'customer_user' | 'platform_admin' | 'system';
    actorId: string;
    extraAuditMetadata?: Record<string, unknown>;
    input: RequestInstanceActionRequest;
  }): Promise<RequestInstanceActionResponse> {
    await this.ensureInstanceScaffolding(input.instanceId);

    if (
      input.input.action === 'start' &&
      startNoOpStatuses.has(input.currentStatus)
    ) {
      return {
        instanceId: input.instanceId,
        message: getStartNoOpMessage(input.currentStatus),
        operation: null,
      };
    }

    const existingOperation = await prisma.instanceOperation.findFirst({
      where: {
        instanceId: input.instanceId,
        status: {
          in: ['pending', 'running'],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (existingOperation) {
      throw new ConflictException(
        'An instance action is already pending or running.',
      );
    }

    const now = new Date();
    const operation = await prisma.$transaction(async (tx) => {
      const createdOperation = await tx.instanceOperation.create({
        data: {
          instanceId: input.instanceId,
          operationType: input.input.action,
          status: 'pending',
          requestedByActorType: input.actorType,
          requestedByActorId: input.actorId,
          targetWorkerId: input.input.targetWorkerId ?? null,
          message: `${input.input.action} requested.`,
        },
      });

      await tx.instance.update({
        where: {
          id: input.instanceId,
        },
        data: {
          lastLifecycleEventAt: now,
          substatus: `${input.input.action}_queued`,
        },
      });

      await tx.instanceLifecycleEvent.create({
        data: {
          instanceId: input.instanceId,
          eventType: 'action_requested',
          actorType: input.actorType,
          actorId: input.actorId,
          message: `${input.input.action} action requested.`,
          fromStatus: input.currentStatus,
          toStatus: input.currentStatus,
          metadata: {
            action: input.input.action,
            targetWorkerId: input.input.targetWorkerId ?? null,
            previousSubstatus: input.currentSubstatus,
            ...(input.extraAuditMetadata ?? {}),
          },
        },
      });

      await this.auditLogsService.recordWithClient(tx, {
        workspaceId: input.workspaceId,
        instanceId: input.instanceId,
        actorType: input.actorType,
        actorId: input.actorId,
        entityType: 'instance_operation',
        entityId: createdOperation.id,
        action: 'instance.action.requested',
        summary: `${input.input.action} action queued.`,
        metadata: {
          action: input.input.action,
          targetWorkerId: input.input.targetWorkerId ?? null,
          previousSubstatus: input.currentSubstatus,
          ...(input.extraAuditMetadata ?? {}),
        },
      });

      return createdOperation;
    });

    this.realtimeService.publishInstanceOperationUpdated({
      instanceId: input.instanceId,
      publicId: input.publicId,
      operationId: operation.id,
      status: operation.status,
    });
    this.realtimeService.publishInstanceLifecycleUpdated({
      instanceId: input.instanceId,
      publicId: input.publicId,
    });

    return {
      instanceId: input.instanceId,
      message: `${input.input.action} action queued.`,
      operation: toInstanceOperationSummary(operation),
    };
  }

  private async reassignInstance(
    userId: string,
    instanceId: string,
    publicId: string,
    currentStatus: InstanceStatus,
    currentSubstatus: string | null,
    targetWorkerId?: string,
  ): Promise<RequestInstanceActionResponse> {
    if (!targetWorkerId) {
      throw new BadRequestException('targetWorkerId is required for reassign.');
    }

    const targetWorker = await prisma.workerHeartbeat.findUnique({
      where: {
        workerId: targetWorkerId,
      },
    });

    if (!targetWorker) {
      throw new NotFoundException('Target worker was not found.');
    }

    await this.ensureInstanceScaffolding(instanceId);

    const current = await prisma.instance.findUnique({
      where: {
        id: instanceId,
      },
      select: {
        assignedWorkerId: true,
        workspaceId: true,
        name: true,
      },
    });

    if (!current) {
      throw new NotFoundException('Instance not found.');
    }

    if (current.assignedWorkerId === targetWorkerId) {
      return {
        instanceId,
        message: `Instance is already assigned to ${targetWorkerId}.`,
        operation: null,
      };
    }

    const now = new Date();
    await prisma.$transaction(async (tx) => {
      await tx.instance.update({
        where: {
          id: instanceId,
        },
        data: {
          assignedWorkerId: targetWorkerId,
          status: 'standby',
          substatus: 'reassigned',
          lastHeartbeatAt: now,
          lastLifecycleEventAt: now,
        },
      });

      await tx.instanceRuntimeState.update({
        where: {
          instanceId,
        },
        data: {
          qrCode: null,
          qrExpiresAt: null,
          currentSessionLabel: null,
          disconnectReason: null,
          lastDisconnectedAt: now,
        },
      });

      await tx.instanceOperation.updateMany({
        where: {
          instanceId,
          status: 'running',
        },
        data: {
          status: 'pending',
          startedAt: null,
          message: 'Operation returned to pending after reassignment.',
        },
      });

      await tx.outboundMessage.updateMany({
        where: {
          instanceId,
          status: 'queue',
        },
        data: {
          processingWorkerId: null,
          processingStartedAt: null,
        },
      });

      if (current.assignedWorkerId) {
        await tx.instanceLifecycleEvent.create({
          data: {
            instanceId,
            eventType: 'worker_released',
            actorType: 'platform_admin',
            actorId: userId,
            message: `Admin reassigned instance away from ${current.assignedWorkerId}.`,
            fromStatus: currentStatus,
            toStatus: 'standby',
            metadata: {
              previousWorkerId: current.assignedWorkerId,
              previousSubstatus: currentSubstatus,
            },
          },
        });
      }

      await tx.instanceLifecycleEvent.create({
        data: {
          instanceId,
          eventType: 'worker_assigned',
          actorType: 'platform_admin',
          actorId: userId,
          message: `Admin assigned instance to ${targetWorkerId}.`,
          fromStatus: currentStatus,
          toStatus: 'standby',
          metadata: {
            targetWorkerId,
            previousSubstatus: currentSubstatus,
          },
        },
      });

      await this.auditLogsService.recordWithClient(tx, {
        workspaceId: current.workspaceId,
        instanceId,
        actorType: 'platform_admin',
        actorId: userId,
        entityType: 'instance',
        entityId: instanceId,
        action: 'instance.reassigned',
        summary: `Instance "${current.name}" reassigned to worker ${targetWorkerId}.`,
        metadata: {
          previousWorkerId: current.assignedWorkerId ?? null,
          targetWorkerId,
          previousStatus: currentStatus,
          previousSubstatus: currentSubstatus,
        },
      });
    });

    this.realtimeService.publishInstanceStatusChanged({
      instanceId,
      status: 'standby',
      substatus: 'reassigned',
      lastUpdatedAt: now.toISOString(),
      publicId,
    });
    this.realtimeService.publishInstanceRuntimeUpdated({
      instanceId,
      publicId,
      currentSessionLabel: null,
      disconnectReason: null,
    });
    this.realtimeService.publishInstanceLifecycleUpdated({
      instanceId,
      publicId,
    });
    this.realtimeService.publishWorkerHealthUpdated({
      workerId: targetWorkerId,
    });
    if (current.assignedWorkerId) {
      this.realtimeService.publishWorkerHealthUpdated({
        workerId: current.assignedWorkerId,
      });
    }

    return {
      instanceId,
      message: `Instance reassigned to ${targetWorkerId}.`,
      operation: null,
    };
  }

  private async loadPublicScopedInstanceRuntime(instanceId: string) {
    await this.ensureInstanceScaffolding(instanceId);

    const instance = await prisma.instance.findUnique({
      where: {
        id: instanceId,
      },
      include: {
        settings: true,
        runtimeState: true,
      },
    });

    if (!instance?.settings || !instance.runtimeState) {
      throw new NotFoundException('Instance not found.');
    }

    return {
      ...instance,
      settings: instance.settings,
      runtimeState: instance.runtimeState,
    };
  }

  private readRuntimeDiagnostics(value: unknown) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    return value as Record<string, unknown>;
  }

  private async loadCustomerScopedInstanceDetail(
    userId: string,
    instanceId: string,
  ) {
    await this.ensureInstanceScaffolding(instanceId);

    const instance = await prisma.instance.findFirst({
      where: {
        id: instanceId,
        workspace: {
          memberships: {
            some: {
              userId,
            },
          },
        },
      },
      include: detailInclude,
    });

    if (!instance || !instance.settings || !instance.runtimeState) {
      throw new NotFoundException('Instance not found.');
    }

    return instance;
  }

  private async loadAdminScopedInstanceDetail(instanceId: string) {
    await this.ensureInstanceScaffolding(instanceId);

    const instance = await prisma.instance.findUnique({
      where: {
        id: instanceId,
      },
      include: detailInclude,
    });

    if (!instance || !instance.settings || !instance.runtimeState) {
      throw new NotFoundException('Instance not found.');
    }

    return instance;
  }

  private async ensureInstanceScaffolding(instanceId: string) {
    await prisma.$transaction(async (tx) => {
      await tx.instanceSettings.upsert({
        where: {
          instanceId,
        },
        update: {},
        create: {
          instanceId,
          webhookSecret: generateWebhookSecret(),
        },
      });

      await tx.instanceRuntimeState.upsert({
        where: {
          instanceId,
        },
        update: {},
        create: {
          instanceId,
        },
      });
    });
  }

  private async getWorkerMap(workerIds: string[]) {
    const uniqueWorkerIds = [
      ...new Set(
        workerIds.filter((workerId): workerId is string => Boolean(workerId)),
      ),
    ];
    if (uniqueWorkerIds.length === 0) {
      return new Map<
        string,
        Awaited<ReturnType<typeof this.getAssignedWorker>>
      >();
    }

    const workers = await prisma.workerHeartbeat.findMany({
      where: {
        workerId: {
          in: uniqueWorkerIds,
        },
      },
    });

    return new Map(workers.map((worker) => [worker.workerId, worker]));
  }

  private async getAssignedWorker(workerId: string | null | undefined) {
    if (!workerId) {
      return null;
    }

    return prisma.workerHeartbeat.findUnique({
      where: {
        workerId,
      },
    });
  }

  private async resolveScreenshotAsset(
    publicId: string,
    lastScreenshotPath?: string | null,
    lastScreenshotAt?: Date | null,
  ) {
    if (!lastScreenshotPath) {
      throw new NotFoundException(
        'No screenshot has been captured for this instance.',
      );
    }

    const screenshotPath = resolve(lastScreenshotPath);
    const screenshotStat = await stat(screenshotPath).catch(() => null);
    if (!screenshotStat?.isFile()) {
      throw new NotFoundException(
        'The saved screenshot file is no longer available.',
      );
    }

    return {
      publicId,
      path: screenshotPath,
      filename: basename(screenshotPath),
      capturedAt: lastScreenshotAt?.toISOString() ?? null,
    };
  }
}
