import type { AdminUserSummary, AdminWorkspaceMemberSummary, AdminWorkspaceSummary, AdminWorkerOperationSummary, AccountApiTokenSummary, AuditActorType, AuditEntityType, AuditLogSummary, InboundMessageKind, InboundMessageSummary, InstanceAction, InstanceApiTokenSummary, InstanceDetailResponse, InstanceLifecycleEvent, InstanceOperationStatus, InstanceOperationSummary, InstanceRuntimeView, InstanceSettingsView, InstanceStatus, InstanceStatusPayload, InstanceSummary, LifecycleActorType, MessageAck, MessageStatus, MessageType, MembershipRole, OutboundMessageSummary, SessionBackend, SupportCaseSummary, UserProfile, UserStatus, UserRole, WebhookDeliveryStatus, WebhookDeliverySummary, WebhookEventType, WorkerAssignmentSummary, WorkerHeartbeatRecord, WorkerStatus, WorkspaceSubscriptionStatus, WorkspaceStatus, WorkspaceSummary } from '@elite-message/contracts';
import type { InstanceActorType, InstanceLifecycleEventType } from '@elite-message/db';
export declare function toUserProfile(user: {
    id: string;
    email: string;
    displayName: string;
    role: UserRole;
    createdAt: Date;
}): UserProfile;
export declare function toWorkspaceSummary(workspace: {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
}, role: MembershipRole | string): WorkspaceSummary;
export declare function toAdminUserSummary(user: {
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
}): AdminUserSummary;
export declare function toAdminWorkspaceSummary(workspace: {
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
}): AdminWorkspaceSummary;
export declare function resolveWorkspaceTrialState(workspace: {
    createdAt: Date;
    trialEndsAt?: Date | null;
}): {
    status: WorkspaceSubscriptionStatus;
    trialEndsAt: Date | null;
};
export declare function toAdminWorkspaceMemberSummary(membership: {
    role: string;
    createdAt: Date;
    user: {
        id: string;
        email: string;
        displayName: string;
        role: UserRole;
        status: UserStatus | string;
    };
}): AdminWorkspaceMemberSummary;
export declare function toAdminWorkerOperationSummary(operation: {
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
}): AdminWorkerOperationSummary;
export declare function toSupportCaseSummary(caseRecord: {
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
}): SupportCaseSummary;
export declare function toWorkerHeartbeatRecord(worker: {
    id: string;
    workerId: string;
    status: WorkerStatus | string;
    region: string;
    uptimeSeconds: number;
    activeInstanceCount: number;
    lastSeenAt: Date;
    createdAt: Date;
    updatedAt: Date;
}): WorkerHeartbeatRecord;
export declare function toAssignedWorkerSummary(worker: {
    workerId: string;
    status: WorkerStatus | string;
    region: string;
    uptimeSeconds: number;
    activeInstanceCount: number;
    lastSeenAt: Date;
} | null | undefined): WorkerAssignmentSummary | null;
export declare function toInstanceSummary(instance: {
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
}, assignedWorker?: {
    status: WorkerStatus | string;
    region: string;
} | null): InstanceSummary;
export declare function toInstanceSettingsView(settings: {
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
}): InstanceSettingsView;
export declare function toInstanceRuntimeView(runtime: {
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
}): InstanceRuntimeView;
export declare function toInstanceTokenSummary(token: {
    id: string;
    name: string;
    prefix: string;
    createdAt: Date;
    revokedAt: Date | null;
    lastUsedAt: Date | null;
}): InstanceApiTokenSummary;
export declare function toAccountApiTokenSummary(token: {
    id: string;
    workspaceId: string;
    name: string;
    prefix: string;
    createdAt: Date;
    revokedAt: Date | null;
    lastUsedAt: Date | null;
}): AccountApiTokenSummary;
export declare function toAuditLogSummary(log: {
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
}): AuditLogSummary;
export declare function toInstanceOperationSummary(operation: {
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
}): InstanceOperationSummary;
export declare function toLifecycleEvent(event: {
    id: string;
    eventType: InstanceLifecycleEventType | string;
    actorType: InstanceActorType | string;
    actorId: string | null;
    message: string;
    fromStatus: InstanceStatus | string | null;
    toStatus: InstanceStatus | string | null;
    createdAt: Date;
}): InstanceLifecycleEvent;
export declare function toOutboundMessageSummary(message: {
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
}): OutboundMessageSummary;
export declare function toWebhookDeliverySummary(delivery: {
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
}): WebhookDeliverySummary;
export declare function toInboundMessageSummary(message: {
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
}): InboundMessageSummary;
export declare function toInstanceStatusPayload(input: {
    instanceId: string;
    status: InstanceStatus | string;
    substatus?: string | null;
    lastUpdatedAt: Date;
}): InstanceStatusPayload;
export declare function toInstanceDetailResponse(input: {
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
}): InstanceDetailResponse;
//# sourceMappingURL=presenters.d.ts.map