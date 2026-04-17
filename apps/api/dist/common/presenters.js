"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserProfile = toUserProfile;
exports.toWorkspaceSummary = toWorkspaceSummary;
exports.toAdminUserSummary = toAdminUserSummary;
exports.toAdminWorkspaceSummary = toAdminWorkspaceSummary;
exports.resolveWorkspaceTrialState = resolveWorkspaceTrialState;
exports.toAdminWorkspaceMemberSummary = toAdminWorkspaceMemberSummary;
exports.toAdminWorkerOperationSummary = toAdminWorkerOperationSummary;
exports.toSupportCaseSummary = toSupportCaseSummary;
exports.toWorkerHeartbeatRecord = toWorkerHeartbeatRecord;
exports.toAssignedWorkerSummary = toAssignedWorkerSummary;
exports.toInstanceSummary = toInstanceSummary;
exports.toInstanceSettingsView = toInstanceSettingsView;
exports.toInstanceRuntimeView = toInstanceRuntimeView;
exports.toInstanceTokenSummary = toInstanceTokenSummary;
exports.toAccountApiTokenSummary = toAccountApiTokenSummary;
exports.toAuditLogSummary = toAuditLogSummary;
exports.toInstanceOperationSummary = toInstanceOperationSummary;
exports.toLifecycleEvent = toLifecycleEvent;
exports.toOutboundMessageSummary = toOutboundMessageSummary;
exports.toWebhookDeliverySummary = toWebhookDeliverySummary;
exports.toInboundMessageSummary = toInboundMessageSummary;
exports.toInstanceStatusPayload = toInstanceStatusPayload;
exports.toInstanceDetailResponse = toInstanceDetailResponse;
function toUserProfile(user) {
    return {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
    };
}
function toWorkspaceSummary(workspace, role) {
    return {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        role: role,
        createdAt: workspace.createdAt.toISOString(),
    };
}
function toAdminUserSummary(user) {
    const latestRefresh = user.refreshSessions?.[0]?.lastUsedAt ??
        user.refreshSessions?.[0]?.createdAt ??
        null;
    return {
        ...toUserProfile(user),
        status: user.status,
        workspaceCount: user._count.memberships,
        instanceCount: user._count.createdInstances,
        activeRefreshSessionCount: user._count.refreshSessions,
        lastRefreshAt: latestRefresh?.toISOString() ?? null,
    };
}
function toAdminWorkspaceSummary(workspace) {
    const trial = resolveWorkspaceTrialState({
        createdAt: workspace.createdAt,
        trialEndsAt: workspace.trialEndsAt ?? null,
    });
    return {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        status: workspace.status,
        subscriptionStatus: trial.status,
        trialEndsAt: trial.trialEndsAt?.toISOString() ?? null,
        memberCount: workspace._count.memberships,
        instanceCount: workspace._count.instances,
        createdAt: workspace.createdAt.toISOString(),
        updatedAt: workspace.updatedAt.toISOString(),
    };
}
function resolveWorkspaceTrialState(workspace) {
    const fallbackTrialEndsAt = new Date(workspace.createdAt.getTime() + 14 * 24 * 60 * 60 * 1_000);
    const resolvedTrialEndsAt = workspace.trialEndsAt ?? fallbackTrialEndsAt;
    return {
        status: resolvedTrialEndsAt.getTime() > Date.now() ? 'trialing' : 'manual',
        trialEndsAt: resolvedTrialEndsAt,
    };
}
function toAdminWorkspaceMemberSummary(membership) {
    return {
        userId: membership.user.id,
        email: membership.user.email,
        displayName: membership.user.displayName,
        userRole: membership.user.role,
        userStatus: membership.user.status,
        membershipRole: membership.role,
        joinedAt: membership.createdAt.toISOString(),
    };
}
function toAdminWorkerOperationSummary(operation) {
    return {
        id: operation.id,
        instanceId: operation.instance.id,
        instancePublicId: operation.instance.publicId,
        instanceName: operation.instance.name,
        action: operation.operationType,
        status: operation.status,
        message: operation.message ?? null,
        errorMessage: operation.errorMessage ?? null,
        createdAt: operation.createdAt.toISOString(),
        completedAt: operation.completedAt?.toISOString() ?? null,
    };
}
function toSupportCaseSummary(caseRecord) {
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
        priority: caseRecord.priority,
        status: caseRecord.status,
        internalNotes: caseRecord.internalNotes ?? null,
        createdAt: caseRecord.createdAt.toISOString(),
        updatedAt: caseRecord.updatedAt.toISOString(),
        resolvedAt: caseRecord.resolvedAt?.toISOString() ?? null,
    };
}
function toWorkerHeartbeatRecord(worker) {
    return {
        id: worker.id,
        workerId: worker.workerId,
        status: worker.status,
        region: worker.region,
        uptimeSeconds: worker.uptimeSeconds,
        activeInstanceCount: worker.activeInstanceCount,
        timestamp: worker.lastSeenAt.toISOString(),
        lastSeenAt: worker.lastSeenAt.toISOString(),
        createdAt: worker.createdAt.toISOString(),
        updatedAt: worker.updatedAt.toISOString(),
    };
}
function toAssignedWorkerSummary(worker) {
    if (!worker) {
        return null;
    }
    return {
        workerId: worker.workerId,
        status: worker.status,
        region: worker.region,
        uptimeSeconds: worker.uptimeSeconds,
        activeInstanceCount: worker.activeInstanceCount,
        lastSeenAt: worker.lastSeenAt.toISOString(),
    };
}
function toInstanceSummary(instance, assignedWorker) {
    return {
        id: instance.id,
        publicId: instance.publicId,
        workspaceId: instance.workspaceId,
        workspaceName: instance.workspace.name,
        name: instance.name,
        status: instance.status,
        substatus: instance.substatus ?? null,
        sendDelay: instance.settings?.sendDelay ?? 1,
        sendDelayMax: instance.settings?.sendDelayMax ?? 15,
        assignedWorkerId: instance.assignedWorkerId ?? null,
        assignedWorkerStatus: assignedWorker?.status ?? null,
        assignedWorkerRegion: assignedWorker?.region ?? null,
        latestEventAt: instance.lastLifecycleEventAt?.toISOString() ?? null,
        createdAt: instance.createdAt.toISOString(),
        updatedAt: instance.updatedAt.toISOString(),
    };
}
function toInstanceSettingsView(settings) {
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
function toInstanceRuntimeView(runtime) {
    return {
        id: runtime.id,
        qrCode: runtime.qrCode ?? null,
        qrExpiresAt: runtime.qrExpiresAt?.toISOString() ?? null,
        sessionBackend: runtime.sessionBackend,
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
function toInstanceTokenSummary(token) {
    return {
        id: token.id,
        name: token.name,
        prefix: token.prefix,
        createdAt: token.createdAt.toISOString(),
        revokedAt: token.revokedAt?.toISOString() ?? null,
        lastUsedAt: token.lastUsedAt?.toISOString() ?? null,
    };
}
function toAccountApiTokenSummary(token) {
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
function toAuditLogSummary(log) {
    return {
        id: log.id,
        workspaceId: log.workspaceId,
        workspaceName: log.workspace?.name ?? null,
        instanceId: log.instanceId,
        instancePublicId: log.instance?.publicId ?? null,
        actorType: log.actorType,
        actorId: log.actorId ?? null,
        entityType: log.entityType,
        entityId: log.entityId ?? null,
        action: log.action,
        summary: log.summary,
        metadata: log.metadata ?? null,
        createdAt: log.createdAt.toISOString(),
    };
}
function toInstanceOperationSummary(operation) {
    return {
        id: operation.id,
        action: operation.operationType,
        status: operation.status,
        targetWorkerId: operation.targetWorkerId ?? null,
        message: operation.message ?? null,
        errorMessage: operation.errorMessage ?? null,
        requestedByActorType: operation.requestedByActorType,
        requestedByActorId: operation.requestedByActorId ?? null,
        createdAt: operation.createdAt.toISOString(),
        startedAt: operation.startedAt?.toISOString() ?? null,
        completedAt: operation.completedAt?.toISOString() ?? null,
    };
}
function toLifecycleEvent(event) {
    return {
        id: event.id,
        eventType: event.eventType,
        actorType: event.actorType,
        actorId: event.actorId ?? null,
        message: event.message,
        fromStatus: event.fromStatus ?? null,
        toStatus: event.toStatus ?? null,
        createdAt: event.createdAt.toISOString(),
    };
}
function toOutboundMessageSummary(message) {
    return {
        id: message.id,
        publicMessageId: message.publicMessageId,
        instanceId: message.instanceId,
        instancePublicId: message.instance.publicId,
        messageType: message.messageType,
        recipient: message.recipient,
        body: message.body ?? null,
        mediaUrl: message.mediaUrl ?? null,
        caption: message.caption ?? null,
        referenceId: message.referenceId ?? null,
        priority: message.priority,
        status: message.status,
        ack: message.ack,
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
function toWebhookDeliverySummary(delivery) {
    return {
        id: delivery.id,
        instanceId: delivery.instanceId,
        instancePublicId: delivery.instance.publicId,
        messageId: delivery.messageId ?? null,
        publicMessageId: delivery.outboundMessage?.publicMessageId ?? null,
        eventType: delivery.eventType,
        status: delivery.status,
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
function toInboundMessageSummary(message) {
    return {
        id: message.id,
        publicMessageId: message.publicMessageId,
        instanceId: message.instanceId,
        instancePublicId: message.instance.publicId,
        providerMessageId: message.providerMessageId ?? null,
        chatId: message.chatId ?? null,
        sender: message.sender,
        pushName: message.pushName ?? null,
        kind: message.kind,
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
function toInstanceStatusPayload(input) {
    return {
        instanceId: input.instanceId,
        status: input.status,
        substatus: input.substatus ?? null,
        lastUpdatedAt: input.lastUpdatedAt.toISOString(),
    };
}
function toInstanceDetailResponse(input) {
    return {
        instance: toInstanceSummary(input.instance, input.assignedWorker),
        settings: toInstanceSettingsView(input.instance.settings),
        runtime: toInstanceRuntimeView(input.instance.runtimeState),
        assignedWorker: toAssignedWorkerSummary(input.assignedWorker),
        pendingOperation: input.instance.operations.find((operation) => operation.status === 'pending' || operation.status === 'running')
            ? toInstanceOperationSummary(input.instance.operations.find((operation) => operation.status === 'pending' || operation.status === 'running'))
            : null,
        operations: input.instance.operations.map((operation) => toInstanceOperationSummary(operation)),
        tokens: input.instance.apiTokens.map((token) => toInstanceTokenSummary(token)),
        events: input.instance.lifecycleEvents.map((event) => toLifecycleEvent(event)),
    };
}
//# sourceMappingURL=presenters.js.map