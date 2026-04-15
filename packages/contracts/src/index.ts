import { z } from 'zod';

export const instanceStatusValues = [
  'qr',
  'initialize',
  'booting',
  'loading',
  'retrying',
  'authenticated',
  'disconnected',
  'standby',
  'stopped',
  'expired',
] as const;

export const messageTypeValues = ['chat', 'image'] as const;
export const messageStatusValues = [
  'queue',
  'sent',
  'unsent',
  'invalid',
  'expired',
] as const;
export const messageAckValues = [
  'pending',
  'server',
  'device',
  'read',
  'played',
] as const;
export const sessionBackendValues = ['placeholder', 'whatsapp_web'] as const;
export const inboundMessageKindValues = [
  'chat',
  'image',
  'document',
  'audio',
  'video',
  'sticker',
  'unknown',
] as const;
export const webhookEventTypeValues = [
  'message_create',
  'message_ack',
  'message_received',
] as const;
export const webhookDeliveryStatusValues = [
  'pending',
  'failed',
  'delivered',
  'exhausted',
] as const;
export const auditActorTypeValues = [
  'anonymous',
  'customer_user',
  'platform_admin',
  'worker',
  'system',
] as const;
export const auditEntityTypeValues = [
  'auth_session',
  'user',
  'workspace',
  'account_api_token',
  'instance',
  'instance_settings',
  'instance_api_token',
  'instance_operation',
  'outbound_message',
  'inbound_message',
  'webhook_delivery',
  'worker',
  'support_case',
] as const;
export const authTokenTypeValues = [
  'dashboard_access',
  'dashboard_refresh',
  'account_api',
  'instance_api',
  'internal_service',
] as const;
export const userRoleValues = ['platform_admin', 'customer'] as const;
export const userStatusValues = ['active', 'suspended'] as const;
export const membershipRoleValues = [
  'owner',
  'admin',
  'operator',
  'viewer',
] as const;
export const googleAuthModeValues = ['login', 'signup'] as const;
export const workerStatusValues = [
  'online',
  'degraded',
  'draining',
  'offline',
] as const;
export const workspaceStatusValues = ['active', 'suspended'] as const;
export const workspaceSubscriptionStatusValues = [
  'trialing',
  'active',
  'manual',
] as const;
export const supportCaseStatusValues = [
  'open',
  'in_progress',
  'waiting_on_customer',
  'resolved',
  'closed',
] as const;
export const supportCasePriorityValues = [
  'low',
  'normal',
  'high',
  'urgent',
] as const;
export const lifecycleEventTypeValues = [
  'instance_created',
  'token_rotated',
  'worker_assigned',
  'worker_released',
  'status_changed',
  'settings_updated',
  'action_requested',
  'action_completed',
  'action_failed',
] as const;
export const lifecycleActorTypeValues = [
  'customer_user',
  'platform_admin',
  'worker',
  'system',
] as const;
export const instanceActionValues = [
  'start',
  'stop',
  'restart',
  'logout',
  'clear',
  'takeover',
  'reassign',
] as const;
export const instanceOperationStatusValues = [
  'pending',
  'running',
  'completed',
  'failed',
  'cancelled',
] as const;

export type InstanceStatus = (typeof instanceStatusValues)[number];
export type MessageType = (typeof messageTypeValues)[number];
export type MessageStatus = (typeof messageStatusValues)[number];
export type MessageAck = (typeof messageAckValues)[number];
export type SessionBackend = (typeof sessionBackendValues)[number];
export type InboundMessageKind = (typeof inboundMessageKindValues)[number];
export type WebhookEventType = (typeof webhookEventTypeValues)[number];
export type WebhookDeliveryStatus =
  (typeof webhookDeliveryStatusValues)[number];
export type AuditActorType = (typeof auditActorTypeValues)[number];
export type AuditEntityType = (typeof auditEntityTypeValues)[number];
export type AuthTokenType = (typeof authTokenTypeValues)[number];
export type UserRole = (typeof userRoleValues)[number];
export type UserStatus = (typeof userStatusValues)[number];
export type MembershipRole = (typeof membershipRoleValues)[number];
export type GoogleAuthMode = (typeof googleAuthModeValues)[number];
export type WorkerStatus = (typeof workerStatusValues)[number];
export type WorkspaceStatus = (typeof workspaceStatusValues)[number];
export type WorkspaceSubscriptionStatus =
  (typeof workspaceSubscriptionStatusValues)[number];
export type SupportCaseStatus = (typeof supportCaseStatusValues)[number];
export type SupportCasePriority = (typeof supportCasePriorityValues)[number];
export type LifecycleEventType = (typeof lifecycleEventTypeValues)[number];
export type LifecycleActorType = (typeof lifecycleActorTypeValues)[number];
export type InstanceAction = (typeof instanceActionValues)[number];
export type InstanceOperationStatus =
  (typeof instanceOperationStatusValues)[number];

export const InstanceStatusSchema = z.enum(instanceStatusValues);
export const MessageTypeSchema = z.enum(messageTypeValues);
export const MessageStatusSchema = z.enum(messageStatusValues);
export const MessageAckSchema = z.enum(messageAckValues);
export const SessionBackendSchema = z.enum(sessionBackendValues);
export const InboundMessageKindSchema = z.enum(inboundMessageKindValues);
export const WebhookEventTypeSchema = z.enum(webhookEventTypeValues);
export const WebhookDeliveryStatusSchema = z.enum(webhookDeliveryStatusValues);
export const AuditActorTypeSchema = z.enum(auditActorTypeValues);
export const AuditEntityTypeSchema = z.enum(auditEntityTypeValues);
export const AuthTokenTypeSchema = z.enum(authTokenTypeValues);
export const UserRoleSchema = z.enum(userRoleValues);
export const UserStatusSchema = z.enum(userStatusValues);
export const MembershipRoleSchema = z.enum(membershipRoleValues);
export const GoogleAuthModeSchema = z.enum(googleAuthModeValues);
export const WorkerStatusSchema = z.enum(workerStatusValues);
export const WorkspaceStatusSchema = z.enum(workspaceStatusValues);
export const WorkspaceSubscriptionStatusSchema = z.enum(
  workspaceSubscriptionStatusValues,
);
export const SupportCaseStatusSchema = z.enum(supportCaseStatusValues);
export const SupportCasePrioritySchema = z.enum(supportCasePriorityValues);
export const LifecycleEventTypeSchema = z.enum(lifecycleEventTypeValues);
export const LifecycleActorTypeSchema = z.enum(lifecycleActorTypeValues);
export const InstanceActionSchema = z.enum(instanceActionValues);
export const InstanceOperationStatusSchema = z.enum(
  instanceOperationStatusValues,
);

export const queueNames = {
  instanceLifecycle: 'instance-lifecycle',
  instanceRecovery: 'instance-recovery',
  outboundSend: 'outbound-send',
  webhookDelivery: 'webhook-delivery',
  adminOperations: 'admin-operations',
} as const;

export const websocketEventNames = {
  instanceStatusChanged: 'instance.status.changed',
  instanceQrUpdated: 'instance.qr.updated',
  instanceRuntimeUpdated: 'instance.runtime.updated',
  instanceLifecycleUpdated: 'instance.lifecycle.updated',
  instanceOperationUpdated: 'instance.operation.updated',
  instanceSettingsUpdated: 'instance.settings.updated',
  instanceMessageUpdated: 'instance.message.updated',
  instanceInboundMessageUpdated: 'instance.inbound_message.updated',
  instanceStatisticsUpdated: 'instance.statistics.updated',
  instanceLimitsUpdated: 'instance.limits.updated',
  webhookDeliveryUpdated: 'webhook.delivery.updated',
  workerHealthUpdated: 'worker.health.updated',
} as const;

export const routePrefixes = {
  auth: '/api/v1/auth',
  account: '/api/v1/account',
  customer: '/api/v1/customer',
  admin: '/api/v1/admin',
  public: '/api/v1/public',
  internal: '/api/v1/internal',
  meta: '/api/v1/meta',
  perInstance: '/instance/:instanceId',
} as const;

export const reservedRouteGroups = [
  routePrefixes.auth,
  routePrefixes.account,
  routePrefixes.customer,
  routePrefixes.admin,
  routePrefixes.public,
  routePrefixes.internal,
  routePrefixes.perInstance,
] as const;

export const WorkerHeartbeatPayloadSchema = z.object({
  workerId: z.string().min(1),
  status: WorkerStatusSchema,
  region: z.string().min(1),
  uptimeSeconds: z.number().int().nonnegative(),
  activeInstanceCount: z.number().int().nonnegative(),
  timestamp: z.string().datetime(),
});

export type WorkerHeartbeatPayload = z.infer<
  typeof WorkerHeartbeatPayloadSchema
>;

export const WorkerHeartbeatRecordSchema = WorkerHeartbeatPayloadSchema.extend({
  id: z.string().uuid(),
  lastSeenAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type WorkerHeartbeatRecord = z.infer<typeof WorkerHeartbeatRecordSchema>;

export const WorkerAssignmentSummarySchema = z.object({
  workerId: z.string().min(1),
  status: WorkerStatusSchema,
  region: z.string().min(1),
  uptimeSeconds: z.number().int().nonnegative(),
  activeInstanceCount: z.number().int().nonnegative(),
  lastSeenAt: z.string().datetime(),
});

export type WorkerAssignmentSummary = z.infer<
  typeof WorkerAssignmentSummarySchema
>;

export const InstanceStatusPayloadSchema = z.object({
  instanceId: z.string().min(1),
  status: InstanceStatusSchema,
  substatus: z.string().nullish(),
  lastUpdatedAt: z.string().datetime(),
});

export type InstanceStatusPayload = z.infer<typeof InstanceStatusPayloadSchema>;

export const ApiErrorSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  requestId: z.string().uuid().optional(),
  details: z.unknown().optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const WebsocketEnvelopeSchema = z.object({
  event: z.string().min(1),
  timestamp: z.string().datetime(),
  correlationId: z.string().uuid(),
  payload: z.unknown(),
});

export type WebsocketEnvelope = z.infer<typeof WebsocketEnvelopeSchema>;

export const WorkspaceSummarySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  role: MembershipRoleSchema,
  createdAt: z.string().datetime(),
});

export type WorkspaceSummary = z.infer<typeof WorkspaceSummarySchema>;

export const ThemePreferenceSchema = z.enum(['system', 'light', 'dark']);

export type ThemePreference = z.infer<typeof ThemePreferenceSchema>;

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().min(1),
  role: UserRoleSchema,
  createdAt: z.string().datetime(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const AccountMeResponseSchema = z.object({
  user: UserProfileSchema,
  workspaces: z.array(WorkspaceSummarySchema),
  themePreference: ThemePreferenceSchema,
});

export type AccountMeResponse = z.infer<typeof AccountMeResponseSchema>;

export const UpdateAccountProfileRequestSchema = z.object({
  displayName: z.string().min(2).max(80),
});

export type UpdateAccountProfileRequest = z.infer<
  typeof UpdateAccountProfileRequestSchema
>;

export const UpdateAccountProfileResponseSchema = z.object({
  user: UserProfileSchema,
  updatedAt: z.string().datetime(),
});

export type UpdateAccountProfileResponse = z.infer<
  typeof UpdateAccountProfileResponseSchema
>;

export const UpdateAccountThemePreferenceRequestSchema = z.object({
  themePreference: ThemePreferenceSchema,
});

export type UpdateAccountThemePreferenceRequest = z.infer<
  typeof UpdateAccountThemePreferenceRequestSchema
>;

export const UpdateAccountThemePreferenceResponseSchema = z.object({
  themePreference: ThemePreferenceSchema,
  updatedAt: z.string().datetime(),
});

export type UpdateAccountThemePreferenceResponse = z.infer<
  typeof UpdateAccountThemePreferenceResponseSchema
>;

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  mfaCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'MFA codes must be six digits.')
    .optional(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const SignupRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2).max(80),
  workspaceName: z.string().min(2).max(80).optional(),
});

export type SignupRequest = z.infer<typeof SignupRequestSchema>;

export const AuthResponseSchema = z.object({
  accessToken: z.string().min(1),
  expiresAt: z.string().datetime(),
  user: UserProfileSchema,
  workspaces: z.array(WorkspaceSummarySchema),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export const InstanceRuntimeViewSchema = z.object({
  id: z.string().uuid(),
  qrCode: z.string().nullish(),
  qrExpiresAt: z.string().datetime().nullish(),
  sessionBackend: SessionBackendSchema,
  currentSessionLabel: z.string().nullish(),
  sessionDiagnostics: z.unknown().nullish(),
  lastStartedAt: z.string().datetime().nullish(),
  lastAuthenticatedAt: z.string().datetime().nullish(),
  lastDisconnectedAt: z.string().datetime().nullish(),
  lastInboundMessageAt: z.string().datetime().nullish(),
  lastScreenshotAt: z.string().datetime().nullish(),
  lastScreenshotPath: z.string().nullish(),
  disconnectReason: z.string().nullish(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type InstanceRuntimeView = z.infer<typeof InstanceRuntimeViewSchema>;

export const InstanceOperationSummarySchema = z.object({
  id: z.string().uuid(),
  action: InstanceActionSchema,
  status: InstanceOperationStatusSchema,
  targetWorkerId: z.string().nullish(),
  message: z.string().nullish(),
  errorMessage: z.string().nullish(),
  requestedByActorType: LifecycleActorTypeSchema,
  requestedByActorId: z.string().nullish(),
  createdAt: z.string().datetime(),
  startedAt: z.string().datetime().nullish(),
  completedAt: z.string().datetime().nullish(),
});

export type InstanceOperationSummary = z.infer<
  typeof InstanceOperationSummarySchema
>;

export const InstanceSummarySchema = z.object({
  id: z.string().uuid(),
  publicId: z.string().min(1),
  workspaceId: z.string().uuid(),
  workspaceName: z.string().min(1),
  name: z.string().min(1),
  status: InstanceStatusSchema,
  substatus: z.string().nullish(),
  sendDelay: z.number().int().nonnegative(),
  sendDelayMax: z.number().int().nonnegative(),
  assignedWorkerId: z.string().nullish(),
  assignedWorkerStatus: WorkerStatusSchema.nullish(),
  assignedWorkerRegion: z.string().nullish(),
  latestEventAt: z.string().datetime().nullish(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type InstanceSummary = z.infer<typeof InstanceSummarySchema>;

export const InstanceSettingsViewSchema = z.object({
  id: z.string().uuid(),
  sendDelay: z.number().int().nonnegative(),
  sendDelayMax: z.number().int().nonnegative(),
  webhookUrl: z.string().url().nullish(),
  webhookSecret: z.string().min(32),
  webhookMessageReceived: z.boolean(),
  webhookMessageCreate: z.boolean(),
  webhookMessageAck: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type InstanceSettingsView = z.infer<typeof InstanceSettingsViewSchema>;

export const InstanceApiTokenSummarySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  prefix: z.string().min(1),
  createdAt: z.string().datetime(),
  revokedAt: z.string().datetime().nullish(),
  lastUsedAt: z.string().datetime().nullish(),
});

export type InstanceApiTokenSummary = z.infer<
  typeof InstanceApiTokenSummarySchema
>;

export const AccountApiTokenSummarySchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  name: z.string().min(1),
  prefix: z.string().min(1),
  createdAt: z.string().datetime(),
  revokedAt: z.string().datetime().nullish(),
  lastUsedAt: z.string().datetime().nullish(),
});

export type AccountApiTokenSummary = z.infer<
  typeof AccountApiTokenSummarySchema
>;

export const AuditLogSummarySchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid().nullish(),
  workspaceName: z.string().nullish(),
  instanceId: z.string().uuid().nullish(),
  instancePublicId: z.string().nullish(),
  actorType: AuditActorTypeSchema,
  actorId: z.string().nullish(),
  entityType: AuditEntityTypeSchema,
  entityId: z.string().nullish(),
  action: z.string().min(1),
  summary: z.string().min(1),
  metadata: z.unknown().nullish(),
  createdAt: z.string().datetime(),
});

export type AuditLogSummary = z.infer<typeof AuditLogSummarySchema>;

export const InstanceLifecycleEventSchema = z.object({
  id: z.string().uuid(),
  eventType: LifecycleEventTypeSchema,
  actorType: LifecycleActorTypeSchema,
  actorId: z.string().nullish(),
  message: z.string().min(1),
  fromStatus: InstanceStatusSchema.nullish(),
  toStatus: InstanceStatusSchema.nullish(),
  createdAt: z.string().datetime(),
});

export type InstanceLifecycleEvent = z.infer<
  typeof InstanceLifecycleEventSchema
>;

export const OutboundMessageSummarySchema = z.object({
  id: z.string().uuid(),
  publicMessageId: z.string().min(1),
  instanceId: z.string().uuid(),
  instancePublicId: z.string().min(1),
  messageType: MessageTypeSchema,
  recipient: z.string().min(1),
  body: z.string().nullish(),
  mediaUrl: z.string().url().nullish(),
  caption: z.string().nullish(),
  referenceId: z.string().nullish(),
  priority: z.number().int().nonnegative(),
  status: MessageStatusSchema,
  ack: MessageAckSchema,
  processingWorkerId: z.string().nullish(),
  workerId: z.string().nullish(),
  providerMessageId: z.string().nullish(),
  errorMessage: z.string().nullish(),
  scheduledFor: z.string().datetime(),
  sentAt: z.string().datetime().nullish(),
  acknowledgedAt: z.string().datetime().nullish(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type OutboundMessageSummary = z.infer<
  typeof OutboundMessageSummarySchema
>;

export const WebhookDeliverySummarySchema = z.object({
  id: z.string().uuid(),
  instanceId: z.string().uuid(),
  instancePublicId: z.string().min(1),
  messageId: z.string().uuid().nullish(),
  publicMessageId: z.string().nullish(),
  eventType: WebhookEventTypeSchema,
  status: WebhookDeliveryStatusSchema,
  targetUrl: z.string().url(),
  attemptCount: z.number().int().nonnegative(),
  nextAttemptAt: z.string().datetime(),
  lastAttemptAt: z.string().datetime().nullish(),
  deliveredAt: z.string().datetime().nullish(),
  responseStatusCode: z.number().int().nullish(),
  responseBody: z.string().nullish(),
  errorMessage: z.string().nullish(),
  payload: z.unknown(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type WebhookDeliverySummary = z.infer<
  typeof WebhookDeliverySummarySchema
>;

export const InboundMessageSummarySchema = z.object({
  id: z.string().uuid(),
  publicMessageId: z.string().min(1),
  instanceId: z.string().uuid(),
  instancePublicId: z.string().min(1),
  providerMessageId: z.string().nullish(),
  chatId: z.string().nullish(),
  sender: z.string().min(1),
  pushName: z.string().nullish(),
  kind: InboundMessageKindSchema,
  body: z.string().nullish(),
  mediaUrl: z.string().min(1).nullish(),
  mimeType: z.string().nullish(),
  fromMe: z.boolean(),
  sentAt: z.string().datetime().nullish(),
  receivedAt: z.string().datetime(),
  rawPayload: z.unknown().nullish(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type InboundMessageSummary = z.infer<typeof InboundMessageSummarySchema>;

export const InstanceDetailResponseSchema = z.object({
  instance: InstanceSummarySchema,
  settings: InstanceSettingsViewSchema,
  runtime: InstanceRuntimeViewSchema,
  assignedWorker: WorkerAssignmentSummarySchema.nullish(),
  pendingOperation: InstanceOperationSummarySchema.nullish(),
  operations: z.array(InstanceOperationSummarySchema),
  tokens: z.array(InstanceApiTokenSummarySchema),
  events: z.array(InstanceLifecycleEventSchema),
});

export type InstanceDetailResponse = z.infer<
  typeof InstanceDetailResponseSchema
>;

export const PublicInstanceStatusResponseSchema = z.object({
  instanceId: z.string().uuid(),
  publicId: z.string().min(1),
  status: InstanceStatusSchema,
  substatus: z.string().nullish(),
  sessionBackend: SessionBackendSchema,
  currentSessionLabel: z.string().nullish(),
  qrReady: z.boolean(),
  qrExpiresAt: z.string().datetime().nullish(),
  lastAuthenticatedAt: z.string().datetime().nullish(),
  lastDisconnectedAt: z.string().datetime().nullish(),
  disconnectReason: z.string().nullish(),
  updatedAt: z.string().datetime(),
});

export type PublicInstanceStatusResponse = z.infer<
  typeof PublicInstanceStatusResponseSchema
>;

export const PublicInstanceMeResponseSchema = z.object({
  instanceId: z.string().uuid(),
  publicId: z.string().min(1),
  status: InstanceStatusSchema,
  substatus: z.string().nullish(),
  sessionBackend: SessionBackendSchema,
  currentSessionLabel: z.string().nullish(),
  connected: z.boolean(),
  me: z.unknown().nullish(),
  diagnostics: z.unknown().nullish(),
  updatedAt: z.string().datetime(),
});

export type PublicInstanceMeResponse = z.infer<
  typeof PublicInstanceMeResponseSchema
>;

export const PublicInstanceQrCodeResponseSchema = z.object({
  instanceId: z.string().uuid(),
  publicId: z.string().min(1),
  qrCode: z.string().nullish(),
  qrExpiresAt: z.string().datetime().nullish(),
  expired: z.boolean(),
  updatedAt: z.string().datetime(),
});

export type PublicInstanceQrCodeResponse = z.infer<
  typeof PublicInstanceQrCodeResponseSchema
>;

export const ListCustomerInstancesResponseSchema = z.object({
  items: z.array(InstanceSummarySchema),
});

export type ListCustomerInstancesResponse = z.infer<
  typeof ListCustomerInstancesResponseSchema
>;

export const CreateInstanceRequestSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(2).max(80),
});

export type CreateInstanceRequest = z.infer<typeof CreateInstanceRequestSchema>;

export const CreateInstanceResponseSchema = z.object({
  instance: InstanceSummarySchema,
  instanceApiToken: z.string().min(1),
});

export type CreateInstanceResponse = z.infer<
  typeof CreateInstanceResponseSchema
>;

export const ListAccountApiTokensResponseSchema = z.object({
  workspace: WorkspaceSummarySchema,
  items: z.array(AccountApiTokenSummarySchema),
});

export type ListAccountApiTokensResponse = z.infer<
  typeof ListAccountApiTokensResponseSchema
>;

export const CreateAccountApiTokenRequestSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(2).max(80),
});

export type CreateAccountApiTokenRequest = z.infer<
  typeof CreateAccountApiTokenRequestSchema
>;

export const CreateAccountApiTokenResponseSchema = z.object({
  token: z.string().min(1),
  summary: AccountApiTokenSummarySchema,
});

export type CreateAccountApiTokenResponse = z.infer<
  typeof CreateAccountApiTokenResponseSchema
>;

export const RotateAccountApiTokenResponseSchema = z.object({
  token: z.string().min(1),
  summary: AccountApiTokenSummarySchema,
});

export type RotateAccountApiTokenResponse = z.infer<
  typeof RotateAccountApiTokenResponseSchema
>;

export const WorkspaceSubscriptionSummarySchema = z.object({
  workspace: WorkspaceSummarySchema,
  status: WorkspaceSubscriptionStatusSchema,
  planName: z.string().min(1),
  billingMode: z.literal('manual'),
  trialEndsAt: z.string().datetime().nullish(),
  currentPeriodStart: z.string().datetime(),
  currentPeriodEnd: z.string().datetime().nullish(),
  instanceCount: z.number().int().nonnegative(),
  linkedInstanceCount: z.number().int().nonnegative(),
  webhookEnabledInstanceCount: z.number().int().nonnegative(),
  notes: z.array(z.string().min(1)),
});

export type WorkspaceSubscriptionSummary = z.infer<
  typeof WorkspaceSubscriptionSummarySchema
>;

export const GetWorkspaceSubscriptionResponseSchema =
  WorkspaceSubscriptionSummarySchema;

export type GetWorkspaceSubscriptionResponse = z.infer<
  typeof GetWorkspaceSubscriptionResponseSchema
>;

export const AdminWorkspaceSubscriptionSummarySchema = z.object({
  status: WorkspaceSubscriptionStatusSchema,
  planName: z.string().min(1),
  billingMode: z.literal('manual'),
  trialEndsAt: z.string().datetime().nullish(),
  currentPeriodStart: z.string().datetime(),
  currentPeriodEnd: z.string().datetime().nullish(),
  instanceCount: z.number().int().nonnegative(),
  linkedInstanceCount: z.number().int().nonnegative(),
  webhookEnabledInstanceCount: z.number().int().nonnegative(),
  notes: z.array(z.string().min(1)),
});

export type AdminWorkspaceSubscriptionSummary = z.infer<
  typeof AdminWorkspaceSubscriptionSummarySchema
>;

export const ListAuditLogsResponseSchema = z.object({
  items: z.array(AuditLogSummarySchema),
});

export type ListAuditLogsResponse = z.infer<typeof ListAuditLogsResponseSchema>;

export const SendChatMessageRequestSchema = z.object({
  to: z.string().min(3).max(64),
  body: z.string().min(1).max(4096),
  referenceId: z.string().min(1).max(120).nullable().optional(),
  priority: z.number().int().min(1).max(999).optional(),
});

export type SendChatMessageRequest = z.infer<
  typeof SendChatMessageRequestSchema
>;

export const SendImageMessageRequestSchema = z.object({
  to: z.string().min(3).max(64),
  imageUrl: z.string().url(),
  caption: z.string().max(1024).nullable().optional(),
  referenceId: z.string().min(1).max(120).nullable().optional(),
  priority: z.number().int().min(1).max(999).optional(),
});

export type SendImageMessageRequest = z.infer<
  typeof SendImageMessageRequestSchema
>;

export const PublicSendImageMessageRequestSchema = z
  .object({
    to: z.string().min(3).max(64),
    image: z.string().url().optional(),
    imageUrl: z.string().url().optional(),
    caption: z.string().max(1024).nullable().optional(),
    filename: z.string().max(255).optional(),
    referenceId: z.string().min(1).max(120).nullable().optional(),
    priority: z.number().int().min(1).max(999).optional(),
  })
  .refine((value) => Boolean(value.image || value.imageUrl), {
    message: 'An image URL is required.',
  });

export type PublicSendImageMessageRequest = z.infer<
  typeof PublicSendImageMessageRequestSchema
>;

export const MessageStatisticsSchema = z.object({
  queue: z.number().int().nonnegative(),
  sent: z.number().int().nonnegative(),
  unsent: z.number().int().nonnegative(),
  invalid: z.number().int().nonnegative(),
  expired: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
});

export type MessageStatistics = z.infer<typeof MessageStatisticsSchema>;

export const SendMessageResponseSchema = z.object({
  message: OutboundMessageSummarySchema,
});

export type SendMessageResponse = z.infer<typeof SendMessageResponseSchema>;

export const MessageStatisticsResponseSchema = z.object({
  instanceId: z.string().uuid(),
  counts: MessageStatisticsSchema,
  generatedAt: z.string().datetime(),
});

export type MessageStatisticsResponse = z.infer<
  typeof MessageStatisticsResponseSchema
>;

export const ResendMessageByIdResponseSchema = z.object({
  message: OutboundMessageSummarySchema,
});

export type ResendMessageByIdResponse = z.infer<
  typeof ResendMessageByIdResponseSchema
>;

export const ResendMessagesByStatusRequestSchema = z.object({
  status: MessageStatusSchema,
});

export type ResendMessagesByStatusRequest = z.infer<
  typeof ResendMessagesByStatusRequestSchema
>;

export const ResendMessagesByStatusResponseSchema = z.object({
  instanceId: z.string().uuid(),
  status: MessageStatusSchema,
  requeuedCount: z.number().int().nonnegative(),
  updatedAt: z.string().datetime(),
});

export type ResendMessagesByStatusResponse = z.infer<
  typeof ResendMessagesByStatusResponseSchema
>;

export const ClearMessagesByStatusRequestSchema = z.object({
  status: MessageStatusSchema,
});

export type ClearMessagesByStatusRequest = z.infer<
  typeof ClearMessagesByStatusRequestSchema
>;

export const ClearMessagesByStatusResponseSchema = z.object({
  instanceId: z.string().uuid(),
  status: MessageStatusSchema,
  clearedCount: z.number().int().nonnegative(),
  updatedAt: z.string().datetime(),
});

export type ClearMessagesByStatusResponse = z.infer<
  typeof ClearMessagesByStatusResponseSchema
>;

export const ListOutboundMessagesResponseSchema = z.object({
  items: z.array(OutboundMessageSummarySchema),
});

export type ListOutboundMessagesResponse = z.infer<
  typeof ListOutboundMessagesResponseSchema
>;

export const ListWebhookDeliveriesResponseSchema = z.object({
  items: z.array(WebhookDeliverySummarySchema),
});

export type ListWebhookDeliveriesResponse = z.infer<
  typeof ListWebhookDeliveriesResponseSchema
>;

export const ListInboundMessagesResponseSchema = z.object({
  items: z.array(InboundMessageSummarySchema),
});

export type ListInboundMessagesResponse = z.infer<
  typeof ListInboundMessagesResponseSchema
>;

export const UpdateInstanceSettingsRequestSchema = z.object({
  sendDelay: z.number().int().min(0).max(300),
  sendDelayMax: z.number().int().min(0).max(300),
  webhookUrl: z.string().url().nullable(),
  webhookMessageReceived: z.boolean(),
  webhookMessageCreate: z.boolean(),
  webhookMessageAck: z.boolean(),
  webhookSecret: z.string().min(16).max(128).nullable().optional(),
});

export type UpdateInstanceSettingsRequest = z.infer<
  typeof UpdateInstanceSettingsRequestSchema
>;

export const PublicUpdateInstanceSettingsRequestSchema = z
  .object({
    sendDelay: z.number().int().min(0).max(300).optional(),
    sendDelaySeconds: z.number().int().min(0).max(300).optional(),
    sendDelayMax: z.number().int().min(0).max(300).optional(),
    sendDelayMaxSeconds: z.number().int().min(0).max(300).optional(),
    webhookUrl: z.string().url().nullable().optional(),
    webhookMessageReceived: z.boolean().optional(),
    webhookMessageCreate: z.boolean().optional(),
    webhookMessageAck: z.boolean().optional(),
    webhookSecret: z.string().min(16).max(128).nullable().optional(),
    webhookRetries: z.number().int().min(0).max(10).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one settings field must be provided.',
  });

export type PublicUpdateInstanceSettingsRequest = z.infer<
  typeof PublicUpdateInstanceSettingsRequestSchema
>;

export const UpdateInstanceSettingsResponseSchema = z.object({
  instanceId: z.string().uuid(),
  settings: InstanceSettingsViewSchema,
  updatedAt: z.string().datetime(),
});

export type UpdateInstanceSettingsResponse = z.infer<
  typeof UpdateInstanceSettingsResponseSchema
>;

export const RequestInstanceActionRequestSchema = z.object({
  action: InstanceActionSchema,
  targetWorkerId: z.string().min(1).optional(),
});

export type RequestInstanceActionRequest = z.infer<
  typeof RequestInstanceActionRequestSchema
>;

export const RequestInstanceActionResponseSchema = z.object({
  instanceId: z.string().uuid(),
  message: z.string().min(1),
  operation: InstanceOperationSummarySchema.nullish(),
});

export type RequestInstanceActionResponse = z.infer<
  typeof RequestInstanceActionResponseSchema
>;

export const PublicResendByIdRequestSchema = z.object({
  id: z.string().min(1),
});

export type PublicResendByIdRequest = z.infer<
  typeof PublicResendByIdRequestSchema
>;

export const RotateInstanceTokenResponseSchema = z.object({
  instanceId: z.string().uuid(),
  token: z.string().min(1),
  prefix: z.string().min(1),
  createdAt: z.string().datetime(),
});

export type RotateInstanceTokenResponse = z.infer<
  typeof RotateInstanceTokenResponseSchema
>;

export const AdminUserSummarySchema = UserProfileSchema.extend({
  status: UserStatusSchema,
  workspaceCount: z.number().int().nonnegative(),
  instanceCount: z.number().int().nonnegative(),
  activeRefreshSessionCount: z.number().int().nonnegative(),
  lastRefreshAt: z.string().datetime().nullish(),
});

export type AdminUserSummary = z.infer<typeof AdminUserSummarySchema>;

export const AdminUserWorkspaceMembershipSchema = z.object({
  workspaceId: z.string().uuid(),
  workspaceName: z.string().min(1),
  workspaceSlug: z.string().min(1),
  workspaceStatus: WorkspaceStatusSchema,
  membershipRole: MembershipRoleSchema,
  joinedAt: z.string().datetime(),
});

export type AdminUserWorkspaceMembership = z.infer<
  typeof AdminUserWorkspaceMembershipSchema
>;

export const AdminUserDetailResponseSchema = z.object({
  user: AdminUserSummarySchema,
  workspaces: z.array(AdminUserWorkspaceMembershipSchema),
});

export type AdminUserDetailResponse = z.infer<
  typeof AdminUserDetailResponseSchema
>;

export const AdminWorkspaceSummarySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  status: WorkspaceStatusSchema,
  subscriptionStatus: WorkspaceSubscriptionStatusSchema,
  trialEndsAt: z.string().datetime().nullish(),
  memberCount: z.number().int().nonnegative(),
  instanceCount: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type AdminWorkspaceSummary = z.infer<typeof AdminWorkspaceSummarySchema>;

export const AdminWorkspaceMemberSummarySchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().min(1),
  userRole: UserRoleSchema,
  userStatus: UserStatusSchema,
  membershipRole: MembershipRoleSchema,
  joinedAt: z.string().datetime(),
});

export type AdminWorkspaceMemberSummary = z.infer<
  typeof AdminWorkspaceMemberSummarySchema
>;

export const AdminWorkspaceDetailResponseSchema = z.object({
  workspace: AdminWorkspaceSummarySchema,
  subscription: AdminWorkspaceSubscriptionSummarySchema,
  members: z.array(AdminWorkspaceMemberSummarySchema),
  instances: z.array(InstanceSummarySchema),
});

export type AdminWorkspaceDetailResponse = z.infer<
  typeof AdminWorkspaceDetailResponseSchema
>;

export const UpdateAdminUserStatusRequestSchema = z.object({
  status: UserStatusSchema,
});

export type UpdateAdminUserStatusRequest = z.infer<
  typeof UpdateAdminUserStatusRequestSchema
>;

export const UpdateAdminUserStatusResponseSchema = z.object({
  user: AdminUserSummarySchema,
  updatedAt: z.string().datetime(),
});

export type UpdateAdminUserStatusResponse = z.infer<
  typeof UpdateAdminUserStatusResponseSchema
>;

export const UpdateAdminWorkspaceStatusRequestSchema = z.object({
  status: WorkspaceStatusSchema,
});

export type UpdateAdminWorkspaceStatusRequest = z.infer<
  typeof UpdateAdminWorkspaceStatusRequestSchema
>;

export const UpdateAdminWorkspaceStatusResponseSchema = z.object({
  workspace: AdminWorkspaceSummarySchema,
  updatedAt: z.string().datetime(),
});

export type UpdateAdminWorkspaceStatusResponse = z.infer<
  typeof UpdateAdminWorkspaceStatusResponseSchema
>;

export const ListAdminUsersResponseSchema = z.object({
  items: z.array(AdminUserSummarySchema),
});

export type ListAdminUsersResponse = z.infer<
  typeof ListAdminUsersResponseSchema
>;

export const ListAdminWorkspacesResponseSchema = z.object({
  items: z.array(AdminWorkspaceSummarySchema),
});

export type ListAdminWorkspacesResponse = z.infer<
  typeof ListAdminWorkspacesResponseSchema
>;

export const ExtendAdminWorkspaceTrialRequestSchema = z.object({
  days: z.number().int().min(1).max(90),
});

export type ExtendAdminWorkspaceTrialRequest = z.infer<
  typeof ExtendAdminWorkspaceTrialRequestSchema
>;

export const ExtendAdminWorkspaceTrialResponseSchema = z.object({
  workspace: AdminWorkspaceSummarySchema,
  subscription: AdminWorkspaceSubscriptionSummarySchema,
  updatedAt: z.string().datetime(),
});

export type ExtendAdminWorkspaceTrialResponse = z.infer<
  typeof ExtendAdminWorkspaceTrialResponseSchema
>;

export const ReplayWebhookDeliveryResponseSchema = z.object({
  delivery: WebhookDeliverySummarySchema,
  updatedAt: z.string().datetime(),
});

export type ReplayWebhookDeliveryResponse = z.infer<
  typeof ReplayWebhookDeliveryResponseSchema
>;

export const AdminMfaStatusResponseSchema = z.object({
  enabled: z.boolean(),
  pending: z.boolean(),
  configuredAt: z.string().datetime().nullish(),
});

export type AdminMfaStatusResponse = z.infer<
  typeof AdminMfaStatusResponseSchema
>;

export const AdminMfaChallengeResponseSchema = z.object({
  secret: z.string().min(16),
  otpauthUrl: z.string().min(1),
  issuer: z.string().min(1),
  accountLabel: z.string().min(1),
});

export type AdminMfaChallengeResponse = z.infer<
  typeof AdminMfaChallengeResponseSchema
>;

export const AdminMfaVerifyRequestSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/),
});

export type AdminMfaVerifyRequest = z.infer<typeof AdminMfaVerifyRequestSchema>;

export const AdminOverviewResponseSchema = z.object({
  counts: z.object({
    users: z.number().int().nonnegative(),
    workspaces: z.number().int().nonnegative(),
    instances: z.number().int().nonnegative(),
    workers: z.number().int().nonnegative(),
  }),
  users: z.array(AdminUserSummarySchema),
  instances: z.array(InstanceSummarySchema),
  workers: z.array(WorkerHeartbeatRecordSchema),
});

export type AdminOverviewResponse = z.infer<typeof AdminOverviewResponseSchema>;

export const AdminWorkerOperationSummarySchema = z.object({
  id: z.string().uuid(),
  instanceId: z.string().uuid(),
  instancePublicId: z.string().min(1),
  instanceName: z.string().min(1),
  action: InstanceActionSchema,
  status: InstanceOperationStatusSchema,
  message: z.string().nullish(),
  errorMessage: z.string().nullish(),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().nullish(),
});

export type AdminWorkerOperationSummary = z.infer<
  typeof AdminWorkerOperationSummarySchema
>;

export const ListAdminWorkersResponseSchema = z.object({
  items: z.array(WorkerHeartbeatRecordSchema),
});

export type ListAdminWorkersResponse = z.infer<
  typeof ListAdminWorkersResponseSchema
>;

export const AdminWorkerDetailResponseSchema = z.object({
  worker: WorkerHeartbeatRecordSchema,
  assignedInstances: z.array(InstanceSummarySchema),
  recentOperations: z.array(AdminWorkerOperationSummarySchema),
});

export type AdminWorkerDetailResponse = z.infer<
  typeof AdminWorkerDetailResponseSchema
>;

export const SupportCaseSummarySchema = z.object({
  id: z.string().uuid(),
  publicId: z.string().min(1),
  workspaceId: z.string().uuid().nullish(),
  workspaceName: z.string().nullish(),
  instanceId: z.string().uuid().nullish(),
  instancePublicId: z.string().nullish(),
  requesterUserId: z.string().uuid().nullish(),
  requesterDisplayName: z.string().nullish(),
  requesterEmail: z.string().email().nullish(),
  assignedAdminUserId: z.string().uuid().nullish(),
  assignedAdminDisplayName: z.string().nullish(),
  title: z.string().min(1),
  description: z.string().min(1),
  priority: SupportCasePrioritySchema,
  status: SupportCaseStatusSchema,
  internalNotes: z.string().nullish(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  resolvedAt: z.string().datetime().nullish(),
});

export type SupportCaseSummary = z.infer<typeof SupportCaseSummarySchema>;

export const ListSupportCasesResponseSchema = z.object({
  items: z.array(SupportCaseSummarySchema),
});

export type ListSupportCasesResponse = z.infer<
  typeof ListSupportCasesResponseSchema
>;

export const CreateSupportCaseRequestSchema = z.object({
  workspaceId: z.string().uuid().nullable().optional(),
  instanceId: z.string().uuid().nullable().optional(),
  requesterUserId: z.string().uuid().nullable().optional(),
  assignedAdminUserId: z.string().uuid().nullable().optional(),
  title: z.string().min(4).max(160),
  description: z.string().min(8).max(4000),
  priority: SupportCasePrioritySchema.default('normal'),
  internalNotes: z.string().max(4000).nullable().optional(),
});

export type CreateSupportCaseRequest = z.infer<
  typeof CreateSupportCaseRequestSchema
>;

export const UpdateSupportCaseRequestSchema = z
  .object({
    status: SupportCaseStatusSchema.optional(),
    priority: SupportCasePrioritySchema.optional(),
    assignedAdminUserId: z.string().uuid().nullable().optional(),
    internalNotes: z.string().max(4000).nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one support case field must be updated.',
  });

export type UpdateSupportCaseRequest = z.infer<
  typeof UpdateSupportCaseRequestSchema
>;

export const SupportCaseResponseSchema = z.object({
  case: SupportCaseSummarySchema,
});

export type SupportCaseResponse = z.infer<typeof SupportCaseResponseSchema>;

export const InternalWorkerAssignedInstanceSchema = z.object({
  id: z.string().uuid(),
  publicId: z.string().min(1),
  name: z.string().min(1),
  status: InstanceStatusSchema,
  substatus: z.string().nullish(),
  runtime: InstanceRuntimeViewSchema,
  pendingOperation: InstanceOperationSummarySchema.nullish(),
});

export type InternalWorkerAssignedInstance = z.infer<
  typeof InternalWorkerAssignedInstanceSchema
>;

export const InternalWorkerRegisterResponseSchema = z.object({
  worker: WorkerHeartbeatRecordSchema,
  assignedInstances: z.array(InternalWorkerAssignedInstanceSchema),
});

export type InternalWorkerRegisterResponse = z.infer<
  typeof InternalWorkerRegisterResponseSchema
>;

export const InternalClaimNextInstanceResponseSchema = z.object({
  assignedInstance: InternalWorkerAssignedInstanceSchema.nullish(),
});

export type InternalClaimNextInstanceResponse = z.infer<
  typeof InternalClaimNextInstanceResponseSchema
>;

export const InternalReleaseInstanceRequestSchema = z.object({
  instanceId: z.string().uuid(),
  reason: z.string().min(1).optional(),
});

export type InternalReleaseInstanceRequest = z.infer<
  typeof InternalReleaseInstanceRequestSchema
>;

export const InternalClaimNextOutboundMessageRequestSchema = z.object({
  workerId: z.string().min(1),
});

export type InternalClaimNextOutboundMessageRequest = z.infer<
  typeof InternalClaimNextOutboundMessageRequestSchema
>;

export const InternalClaimNextOutboundMessageResponseSchema = z.object({
  message: OutboundMessageSummarySchema.nullish(),
});

export type InternalClaimNextOutboundMessageResponse = z.infer<
  typeof InternalClaimNextOutboundMessageResponseSchema
>;

export const InternalUpdateInstanceStatusRequestSchema = z.object({
  workerId: z.string().min(1),
  status: InstanceStatusSchema,
  substatus: z.string().nullish(),
  message: z.string().min(1).optional(),
});

export type InternalUpdateInstanceStatusRequest = z.infer<
  typeof InternalUpdateInstanceStatusRequestSchema
>;

export const InternalUpdateInstanceRuntimeRequestSchema = z.object({
  workerId: z.string().min(1),
  qrCode: z.string().nullable().optional(),
  qrExpiresAt: z.string().datetime().nullable().optional(),
  sessionBackend: SessionBackendSchema.optional(),
  currentSessionLabel: z.string().nullable().optional(),
  sessionDiagnostics: z.unknown().nullable().optional(),
  lastStartedAt: z.string().datetime().nullable().optional(),
  lastAuthenticatedAt: z.string().datetime().nullable().optional(),
  lastDisconnectedAt: z.string().datetime().nullable().optional(),
  lastInboundMessageAt: z.string().datetime().nullable().optional(),
  lastScreenshotAt: z.string().datetime().nullable().optional(),
  lastScreenshotPath: z.string().nullable().optional(),
  disconnectReason: z.string().nullable().optional(),
});

export type InternalUpdateInstanceRuntimeRequest = z.infer<
  typeof InternalUpdateInstanceRuntimeRequestSchema
>;

export const InternalUpdateInstanceOperationRequestSchema = z.object({
  workerId: z.string().min(1),
  status: InstanceOperationStatusSchema,
  message: z.string().min(1).optional(),
  errorMessage: z.string().min(1).optional(),
});

export type InternalUpdateInstanceOperationRequest = z.infer<
  typeof InternalUpdateInstanceOperationRequestSchema
>;

export const InternalUpdateOutboundMessageRequestSchema = z
  .object({
    workerId: z.string().min(1),
    status: MessageStatusSchema.optional(),
    ack: MessageAckSchema.optional(),
    providerMessageId: z.string().min(1).optional(),
    message: z.string().min(1).optional(),
    errorMessage: z.string().min(1).optional(),
  })
  .refine(
    (value) =>
      Boolean(
        value.status ||
        value.ack ||
        value.providerMessageId ||
        value.errorMessage ||
        value.message,
      ),
    {
      message: 'At least one outbound message field must be updated.',
    },
  );

export type InternalUpdateOutboundMessageRequest = z.infer<
  typeof InternalUpdateOutboundMessageRequestSchema
>;

export const InternalReceiveInboundMessageRequestSchema = z.object({
  workerId: z.string().min(1),
  providerMessageId: z.string().min(1).optional(),
  chatId: z.string().min(1).optional(),
  sender: z.string().min(1),
  pushName: z.string().min(1).nullable().optional(),
  kind: InboundMessageKindSchema,
  body: z.string().nullable().optional(),
  mediaUrl: z.string().min(1).nullable().optional(),
  mimeType: z.string().min(1).nullable().optional(),
  fromMe: z.boolean().optional(),
  sentAt: z.string().datetime().nullable().optional(),
  receivedAt: z.string().datetime().optional(),
  rawPayload: z.unknown().optional(),
});

export type InternalReceiveInboundMessageRequest = z.infer<
  typeof InternalReceiveInboundMessageRequestSchema
>;
