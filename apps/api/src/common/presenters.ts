import type {
  AdminUserSummary,
  AdminWorkspaceMemberSummary,
  AdminWorkspaceSummary,
  AdminWorkerOperationSummary,
  AccountApiTokenSummary,
  AuditActorType,
  AuditEntityType,
  AuditLogSummary,
  InboundMessageKind,
  InboundMessageSummary,
  InstanceAction,
  InstanceApiTokenSummary,
  InstanceDetailResponse,
  InstanceLifecycleEvent,
  InstanceOperationStatus,
  InstanceOperationSummary,
  InstanceRuntimeView,
  InstanceSettingsView,
  InstanceStatus,
  InstanceStatusPayload,
  InstanceSummary,
  LifecycleActorType,
  MessageAck,
  MessageStatus,
  MessageType,
  MembershipRole,
  OutboundMessageSummary,
  SessionBackend,
  SupportCaseSummary,
  UserProfile,
  UserStatus,
  UserRole,
  WebhookDeliveryStatus,
  WebhookDeliverySummary,
  WebhookEventType,
  WorkerAssignmentSummary,
  WorkerHeartbeatRecord,
  WorkerStatus,
  WorkspaceSubscriptionStatus,
  WorkspaceStatus,
  WorkspaceSummary,
} from '@elite-message/contracts';
import type {
  InstanceActorType,
  InstanceLifecycleEventType,
} from '@elite-message/db';

export function toUserProfile(user: {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Date;
}): UserProfile {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

export function toWorkspaceSummary(
  workspace: {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
  },
  role: MembershipRole | string,
): WorkspaceSummary {
  return {
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    role: role as MembershipRole,
    createdAt: workspace.createdAt.toISOString(),
  };
}

export function toAdminUserSummary(user: {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus | string;
  createdAt: Date;
  _count: {
    memberships: number;
    createdInstances: number;
    refreshSessions: number;
  };
  refreshSessions?: Array<{
    lastUsedAt: Date | null;
    createdAt: Date;
  }>;
}): AdminUserSummary {
  const latestRefresh =
    user.refreshSessions?.[0]?.lastUsedAt ??
    user.refreshSessions?.[0]?.createdAt ??
    null;

  return {
    ...toUserProfile(user),
    status: user.status as UserStatus,
    workspaceCount: user._count.memberships,
    instanceCount: user._count.createdInstances,
    activeRefreshSessionCount: user._count.refreshSessions,
    lastRefreshAt: latestRefresh?.toISOString() ?? null,
  };
}

export function toAdminWorkspaceSummary(workspace: {
  id: string;
  name: string;
  slug: string;
  status: WorkspaceStatus | string;
  trialEndsAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    memberships: number;
    instances: number;
  };
}): AdminWorkspaceSummary {
  const trial = resolveWorkspaceTrialState({
    createdAt: workspace.createdAt,
    trialEndsAt: workspace.trialEndsAt ?? null,
  });

  return {
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    status: workspace.status as WorkspaceStatus,
    subscriptionStatus: trial.status,
    trialEndsAt: trial.trialEndsAt?.toISOString() ?? null,
    memberCount: workspace._count.memberships,
    instanceCount: workspace._count.instances,
    createdAt: workspace.createdAt.toISOString(),
    updatedAt: workspace.updatedAt.toISOString(),
  };
}

export function resolveWorkspaceTrialState(workspace: {
  createdAt: Date;
  trialEndsAt?: Date | null;
}): {
  status: WorkspaceSubscriptionStatus;
  trialEndsAt: Date | null;
} {
  const fallbackTrialEndsAt = new Date(
    workspace.createdAt.getTime() + 14 * 24 * 60 * 60 * 1_000,
  );
  const resolvedTrialEndsAt = workspace.trialEndsAt ?? fallbackTrialEndsAt;

  return {
    status: resolvedTrialEndsAt.getTime() > Date.now() ? 'trialing' : 'manual',
    trialEndsAt: resolvedTrialEndsAt,
  };
}

export function toAdminWorkspaceMemberSummary(membership: {
  role: string;
  createdAt: Date;
  user: {
    id: string;
    email: string;
    displayName: string;
    role: UserRole;
    status: UserStatus | string;
  };
}): AdminWorkspaceMemberSummary {
  return {
    userId: membership.user.id,
    email: membership.user.email,
    displayName: membership.user.displayName,
    userRole: membership.user.role,
    userStatus: membership.user.status as UserStatus,
    membershipRole:
      membership.role as AdminWorkspaceMemberSummary['membershipRole'],
    joinedAt: membership.createdAt.toISOString(),
  };
}

export function toAdminWorkerOperationSummary(operation: {
  id: string;
  operationType: string;
  status: string;
  message: string | null;
  errorMessage: string | null;
  createdAt: Date;
  completedAt: Date | null;
  instance: {
    id: string;
    publicId: string;
    name: string;
  };
}): AdminWorkerOperationSummary {
  return {
    id: operation.id,
    instanceId: operation.instance.id,
    instancePublicId: operation.instance.publicId,
    instanceName: operation.instance.name,
    action: operation.operationType as AdminWorkerOperationSummary['action'],
    status: operation.status as AdminWorkerOperationSummary['status'],
    message: operation.message ?? null,
    errorMessage: operation.errorMessage ?? null,
    createdAt: operation.createdAt.toISOString(),
    completedAt: operation.completedAt?.toISOString() ?? null,
  };
}

export function toSupportCaseSummary(caseRecord: {
  id: string;
  publicId: string;
  workspaceId: string | null;
  instanceId: string | null;
  requesterUserId: string | null;
  assignedAdminUserId: string | null;
  title: string;
  description: string;
  priority: string;
  status: string;
  internalNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
  workspace?: {
    name: string;
  } | null;
  instance?: {
    publicId: string;
  } | null;
  requesterUser?: {
    displayName: string;
    email: string;
  } | null;
  assignedAdminUser?: {
    displayName: string;
  } | null;
}): SupportCaseSummary {
  return {
    id: caseRecord.id,
    publicId: caseRecord.publicId,
    workspaceId: caseRecord.workspaceId,
    workspaceName: caseRecord.workspace?.name ?? null,
    instanceId: caseRecord.instanceId,
    instancePublicId: caseRecord.instance?.publicId ?? null,
    requesterUserId: caseRecord.requesterUserId,
    requesterDisplayName: caseRecord.requesterUser?.displayName ?? null,
    requesterEmail: caseRecord.requesterUser?.email ?? null,
    assignedAdminUserId: caseRecord.assignedAdminUserId,
    assignedAdminDisplayName: caseRecord.assignedAdminUser?.displayName ?? null,
    title: caseRecord.title,
    description: caseRecord.description,
    priority: caseRecord.priority as SupportCaseSummary['priority'],
    status: caseRecord.status as SupportCaseSummary['status'],
    internalNotes: caseRecord.internalNotes ?? null,
    createdAt: caseRecord.createdAt.toISOString(),
    updatedAt: caseRecord.updatedAt.toISOString(),
    resolvedAt: caseRecord.resolvedAt?.toISOString() ?? null,
  };
}

export function toWorkerHeartbeatRecord(worker: {
  id: string;
  workerId: string;
  status: WorkerStatus | string;
  region: string;
  uptimeSeconds: number;
  activeInstanceCount: number;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}): WorkerHeartbeatRecord {
  return {
    id: worker.id,
    workerId: worker.workerId,
    status: worker.status as WorkerStatus,
    region: worker.region,
    uptimeSeconds: worker.uptimeSeconds,
    activeInstanceCount: worker.activeInstanceCount,
    timestamp: worker.lastSeenAt.toISOString(),
    lastSeenAt: worker.lastSeenAt.toISOString(),
    createdAt: worker.createdAt.toISOString(),
    updatedAt: worker.updatedAt.toISOString(),
  };
}

export function toAssignedWorkerSummary(
  worker:
    | {
        workerId: string;
        status: WorkerStatus | string;
        region: string;
        uptimeSeconds: number;
        activeInstanceCount: number;
        lastSeenAt: Date;
      }
    | null
    | undefined,
): WorkerAssignmentSummary | null {
  if (!worker) {
    return null;
  }

  return {
    workerId: worker.workerId,
    status: worker.status as WorkerStatus,
    region: worker.region,
    uptimeSeconds: worker.uptimeSeconds,
    activeInstanceCount: worker.activeInstanceCount,
    lastSeenAt: worker.lastSeenAt.toISOString(),
  };
}

export function toInstanceSummary(
  instance: {
    id: string;
    publicId: string;
    workspaceId: string;
    name: string;
    status: InstanceStatus | string;
    substatus?: string | null;
    assignedWorkerId?: string | null;
    lastLifecycleEventAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    workspace: {
      name: string;
    };
    settings?: {
      sendDelay: number;
      sendDelayMax: number;
    } | null;
  },
  assignedWorker?: {
    status: WorkerStatus | string;
    region: string;
  } | null,
): InstanceSummary {
  return {
    id: instance.id,
    publicId: instance.publicId,
    workspaceId: instance.workspaceId,
    workspaceName: instance.workspace.name,
    name: instance.name,
    status: instance.status as InstanceStatus,
    substatus: instance.substatus ?? null,
    sendDelay: instance.settings?.sendDelay ?? 1,
    sendDelayMax: instance.settings?.sendDelayMax ?? 15,
    assignedWorkerId: instance.assignedWorkerId ?? null,
    assignedWorkerStatus:
      (assignedWorker?.status as WorkerStatus | undefined) ?? null,
    assignedWorkerRegion: assignedWorker?.region ?? null,
    latestEventAt: instance.lastLifecycleEventAt?.toISOString() ?? null,
    createdAt: instance.createdAt.toISOString(),
    updatedAt: instance.updatedAt.toISOString(),
  };
}

export function toInstanceSettingsView(settings: {
  id: string;
  sendDelay: number;
  sendDelayMax: number;
  webhookUrl: string | null;
  webhookSecret: string;
  webhookMessageReceived: boolean;
  webhookMessageCreate: boolean;
  webhookMessageAck: boolean;
  createdAt: Date;
  updatedAt: Date;
}): InstanceSettingsView {
  return {
    id: settings.id,
    sendDelay: settings.sendDelay,
    sendDelayMax: settings.sendDelayMax,
    webhookUrl: settings.webhookUrl,
    webhookSecret: settings.webhookSecret,
    webhookMessageReceived: settings.webhookMessageReceived,
    webhookMessageCreate: settings.webhookMessageCreate,
    webhookMessageAck: settings.webhookMessageAck,
    createdAt: settings.createdAt.toISOString(),
    updatedAt: settings.updatedAt.toISOString(),
  };
}

export function toInstanceRuntimeView(runtime: {
  id: string;
  qrCode: string | null;
  qrExpiresAt: Date | null;
  sessionBackend: SessionBackend | string;
  currentSessionLabel: string | null;
  sessionDiagnostics: unknown;
  lastStartedAt: Date | null;
  lastAuthenticatedAt: Date | null;
  lastDisconnectedAt: Date | null;
  lastInboundMessageAt: Date | null;
  lastScreenshotAt: Date | null;
  lastScreenshotPath: string | null;
  disconnectReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}): InstanceRuntimeView {
  return {
    id: runtime.id,
    qrCode: runtime.qrCode ?? null,
    qrExpiresAt: runtime.qrExpiresAt?.toISOString() ?? null,
    sessionBackend: runtime.sessionBackend as SessionBackend,
    currentSessionLabel: runtime.currentSessionLabel ?? null,
    sessionDiagnostics: runtime.sessionDiagnostics ?? null,
    lastStartedAt: runtime.lastStartedAt?.toISOString() ?? null,
    lastAuthenticatedAt: runtime.lastAuthenticatedAt?.toISOString() ?? null,
    lastDisconnectedAt: runtime.lastDisconnectedAt?.toISOString() ?? null,
    lastInboundMessageAt: runtime.lastInboundMessageAt?.toISOString() ?? null,
    lastScreenshotAt: runtime.lastScreenshotAt?.toISOString() ?? null,
    lastScreenshotPath: runtime.lastScreenshotPath ?? null,
    disconnectReason: runtime.disconnectReason ?? null,
    createdAt: runtime.createdAt.toISOString(),
    updatedAt: runtime.updatedAt.toISOString(),
  };
}

export function toInstanceTokenSummary(token: {
  id: string;
  name: string;
  prefix: string;
  createdAt: Date;
  revokedAt: Date | null;
  lastUsedAt: Date | null;
}): InstanceApiTokenSummary {
  return {
    id: token.id,
    name: token.name,
    prefix: token.prefix,
    createdAt: token.createdAt.toISOString(),
    revokedAt: token.revokedAt?.toISOString() ?? null,
    lastUsedAt: token.lastUsedAt?.toISOString() ?? null,
  };
}

export function toAccountApiTokenSummary(token: {
  id: string;
  workspaceId: string;
  name: string;
  prefix: string;
  createdAt: Date;
  revokedAt: Date | null;
  lastUsedAt: Date | null;
}): AccountApiTokenSummary {
  return {
    id: token.id,
    workspaceId: token.workspaceId,
    name: token.name,
    prefix: token.prefix,
    createdAt: token.createdAt.toISOString(),
    revokedAt: token.revokedAt?.toISOString() ?? null,
    lastUsedAt: token.lastUsedAt?.toISOString() ?? null,
  };
}

export function toAuditLogSummary(log: {
  id: string;
  workspaceId: string | null;
  instanceId: string | null;
  actorType: AuditActorType | string;
  actorId: string | null;
  entityType: AuditEntityType | string;
  entityId: string | null;
  action: string;
  summary: string;
  metadata: unknown;
  createdAt: Date;
  workspace?: {
    name: string;
  } | null;
  instance?: {
    publicId: string;
  } | null;
}): AuditLogSummary {
  return {
    id: log.id,
    workspaceId: log.workspaceId,
    workspaceName: log.workspace?.name ?? null,
    instanceId: log.instanceId,
    instancePublicId: log.instance?.publicId ?? null,
    actorType: log.actorType as AuditActorType,
    actorId: log.actorId ?? null,
    entityType: log.entityType as AuditEntityType,
    entityId: log.entityId ?? null,
    action: log.action,
    summary: log.summary,
    metadata: log.metadata ?? null,
    createdAt: log.createdAt.toISOString(),
  };
}

export function toInstanceOperationSummary(operation: {
  id: string;
  operationType: InstanceAction | string;
  status: InstanceOperationStatus | string;
  targetWorkerId: string | null;
  message: string | null;
  errorMessage: string | null;
  requestedByActorType: LifecycleActorType | string;
  requestedByActorId: string | null;
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
}): InstanceOperationSummary {
  return {
    id: operation.id,
    action: operation.operationType as InstanceAction,
    status: operation.status as InstanceOperationStatus,
    targetWorkerId: operation.targetWorkerId ?? null,
    message: operation.message ?? null,
    errorMessage: operation.errorMessage ?? null,
    requestedByActorType: operation.requestedByActorType as LifecycleActorType,
    requestedByActorId: operation.requestedByActorId ?? null,
    createdAt: operation.createdAt.toISOString(),
    startedAt: operation.startedAt?.toISOString() ?? null,
    completedAt: operation.completedAt?.toISOString() ?? null,
  };
}

export function toLifecycleEvent(event: {
  id: string;
  eventType: InstanceLifecycleEventType | string;
  actorType: InstanceActorType | string;
  actorId: string | null;
  message: string;
  fromStatus: InstanceStatus | string | null;
  toStatus: InstanceStatus | string | null;
  createdAt: Date;
}): InstanceLifecycleEvent {
  return {
    id: event.id,
    eventType: event.eventType as InstanceLifecycleEvent['eventType'],
    actorType: event.actorType as InstanceLifecycleEvent['actorType'],
    actorId: event.actorId ?? null,
    message: event.message,
    fromStatus: (event.fromStatus as InstanceStatus | null) ?? null,
    toStatus: (event.toStatus as InstanceStatus | null) ?? null,
    createdAt: event.createdAt.toISOString(),
  };
}

export function toOutboundMessageSummary(message: {
  id: string;
  publicMessageId: string;
  instanceId: string;
  messageType: MessageType | string;
  recipient: string;
  body: string | null;
  mediaUrl: string | null;
  caption: string | null;
  referenceId: string | null;
  priority: number;
  status: MessageStatus | string;
  ack: MessageAck | string;
  processingWorkerId: string | null;
  workerId: string | null;
  providerMessageId: string | null;
  errorMessage: string | null;
  scheduledFor: Date;
  sentAt: Date | null;
  acknowledgedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  instance: {
    publicId: string;
  };
}): OutboundMessageSummary {
  return {
    id: message.id,
    publicMessageId: message.publicMessageId,
    instanceId: message.instanceId,
    instancePublicId: message.instance.publicId,
    messageType: message.messageType as MessageType,
    recipient: message.recipient,
    body: message.body ?? null,
    mediaUrl: message.mediaUrl ?? null,
    caption: message.caption ?? null,
    referenceId: message.referenceId ?? null,
    priority: message.priority,
    status: message.status as MessageStatus,
    ack: message.ack as MessageAck,
    processingWorkerId: message.processingWorkerId ?? null,
    workerId: message.workerId ?? null,
    providerMessageId: message.providerMessageId ?? null,
    errorMessage: message.errorMessage ?? null,
    scheduledFor: message.scheduledFor.toISOString(),
    sentAt: message.sentAt?.toISOString() ?? null,
    acknowledgedAt: message.acknowledgedAt?.toISOString() ?? null,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
  };
}

export function toWebhookDeliverySummary(delivery: {
  id: string;
  instanceId: string;
  messageId: string | null;
  eventType: WebhookEventType | string;
  status: WebhookDeliveryStatus | string;
  targetUrl: string;
  attemptCount: number;
  nextAttemptAt: Date;
  lastAttemptAt: Date | null;
  deliveredAt: Date | null;
  responseStatusCode: number | null;
  responseBody: string | null;
  errorMessage: string | null;
  payload: unknown;
  createdAt: Date;
  updatedAt: Date;
  instance: {
    publicId: string;
  };
  outboundMessage?: {
    publicMessageId: string;
  } | null;
}): WebhookDeliverySummary {
  return {
    id: delivery.id,
    instanceId: delivery.instanceId,
    instancePublicId: delivery.instance.publicId,
    messageId: delivery.messageId ?? null,
    publicMessageId: delivery.outboundMessage?.publicMessageId ?? null,
    eventType: delivery.eventType as WebhookEventType,
    status: delivery.status as WebhookDeliveryStatus,
    targetUrl: delivery.targetUrl,
    attemptCount: delivery.attemptCount,
    nextAttemptAt: delivery.nextAttemptAt.toISOString(),
    lastAttemptAt: delivery.lastAttemptAt?.toISOString() ?? null,
    deliveredAt: delivery.deliveredAt?.toISOString() ?? null,
    responseStatusCode: delivery.responseStatusCode ?? null,
    responseBody: delivery.responseBody ?? null,
    errorMessage: delivery.errorMessage ?? null,
    payload: delivery.payload,
    createdAt: delivery.createdAt.toISOString(),
    updatedAt: delivery.updatedAt.toISOString(),
  };
}

export function toInboundMessageSummary(message: {
  id: string;
  publicMessageId: string;
  instanceId: string;
  providerMessageId: string | null;
  chatId: string | null;
  sender: string;
  pushName: string | null;
  kind: InboundMessageKind | string;
  body: string | null;
  mediaUrl: string | null;
  mimeType: string | null;
  fromMe: boolean;
  sentAt: Date | null;
  receivedAt: Date;
  rawPayload: unknown;
  createdAt: Date;
  updatedAt: Date;
  instance: {
    publicId: string;
  };
}): InboundMessageSummary {
  return {
    id: message.id,
    publicMessageId: message.publicMessageId,
    instanceId: message.instanceId,
    instancePublicId: message.instance.publicId,
    providerMessageId: message.providerMessageId ?? null,
    chatId: message.chatId ?? null,
    sender: message.sender,
    pushName: message.pushName ?? null,
    kind: message.kind as InboundMessageKind,
    body: message.body ?? null,
    mediaUrl: message.mediaUrl ?? null,
    mimeType: message.mimeType ?? null,
    fromMe: message.fromMe,
    sentAt: message.sentAt?.toISOString() ?? null,
    receivedAt: message.receivedAt.toISOString(),
    rawPayload: message.rawPayload ?? null,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
  };
}

export function toInstanceStatusPayload(input: {
  instanceId: string;
  status: InstanceStatus | string;
  substatus?: string | null;
  lastUpdatedAt: Date;
}): InstanceStatusPayload {
  return {
    instanceId: input.instanceId,
    status: input.status as InstanceStatus,
    substatus: input.substatus ?? null,
    lastUpdatedAt: input.lastUpdatedAt.toISOString(),
  };
}

export function toInstanceDetailResponse(input: {
  instance: {
    id: string;
    publicId: string;
    workspaceId: string;
    name: string;
    status: InstanceStatus | string;
    substatus?: string | null;
    assignedWorkerId?: string | null;
    lastLifecycleEventAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    workspace: {
      name: string;
    };
    settings: {
      id: string;
      sendDelay: number;
      sendDelayMax: number;
      webhookUrl: string | null;
      webhookSecret: string;
      webhookMessageReceived: boolean;
      webhookMessageCreate: boolean;
      webhookMessageAck: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
    runtimeState: {
      id: string;
      qrCode: string | null;
      qrExpiresAt: Date | null;
      sessionBackend: SessionBackend | string;
      currentSessionLabel: string | null;
      sessionDiagnostics: unknown;
      lastStartedAt: Date | null;
      lastAuthenticatedAt: Date | null;
      lastDisconnectedAt: Date | null;
      lastInboundMessageAt: Date | null;
      lastScreenshotAt: Date | null;
      lastScreenshotPath: string | null;
      disconnectReason: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
    apiTokens: Array<{
      id: string;
      name: string;
      prefix: string;
      createdAt: Date;
      revokedAt: Date | null;
      lastUsedAt: Date | null;
    }>;
    operations: Array<{
      id: string;
      operationType: InstanceAction | string;
      status: InstanceOperationStatus | string;
      targetWorkerId: string | null;
      message: string | null;
      errorMessage: string | null;
      requestedByActorType: LifecycleActorType | string;
      requestedByActorId: string | null;
      createdAt: Date;
      startedAt: Date | null;
      completedAt: Date | null;
    }>;
    lifecycleEvents: Array<{
      id: string;
      eventType: InstanceLifecycleEventType | string;
      actorType: InstanceActorType | string;
      actorId: string | null;
      message: string;
      fromStatus: InstanceStatus | string | null;
      toStatus: InstanceStatus | string | null;
      createdAt: Date;
    }>;
  };
  assignedWorker?: {
    workerId: string;
    status: WorkerStatus | string;
    region: string;
    uptimeSeconds: number;
    activeInstanceCount: number;
    lastSeenAt: Date;
  } | null;
}): InstanceDetailResponse {
  return {
    instance: toInstanceSummary(input.instance, input.assignedWorker),
    settings: toInstanceSettingsView(input.instance.settings),
    runtime: toInstanceRuntimeView(input.instance.runtimeState),
    assignedWorker: toAssignedWorkerSummary(input.assignedWorker),
    pendingOperation: input.instance.operations.find(
      (operation) =>
        operation.status === 'pending' || operation.status === 'running',
    )
      ? toInstanceOperationSummary(
          input.instance.operations.find(
            (operation) =>
              operation.status === 'pending' || operation.status === 'running',
          ) as NonNullable<(typeof input.instance.operations)[number]>,
        )
      : null,
    operations: input.instance.operations.map((operation) =>
      toInstanceOperationSummary(operation),
    ),
    tokens: input.instance.apiTokens.map((token) =>
      toInstanceTokenSummary(token),
    ),
    events: input.instance.lifecycleEvents.map((event) =>
      toLifecycleEvent(event),
    ),
  };
}
