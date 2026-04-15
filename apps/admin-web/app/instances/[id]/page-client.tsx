'use client';

import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { io } from 'socket.io-client';
import type {
  AuthResponse,
  InboundMessageSummary,
  InstanceAction,
  InstanceDetailResponse,
  ListInboundMessagesResponse,
  ListOutboundMessagesResponse,
  ListWebhookDeliveriesResponse,
  OutboundMessageSummary,
  RequestInstanceActionResponse,
  WebhookDeliverySummary,
  WebsocketEnvelope,
} from '@elite-message/contracts';
import { websocketEventNames } from '@elite-message/contracts';
import {
  ActionButton,
  AnchorNav,
  AppShell,
  DefinitionGrid,
  Field,
  InfoCard,
  MetricCard,
  MetricGrid,
  NoticeBanner,
  QrPayloadView,
  SectionGrid,
  StatusBadge,
  TextInput,
} from '@elite-message/ui';
import { AdminNav } from '../../components/admin-nav';
import { AdminTopbarControls } from '../../components/admin-topbar-controls';
import {
  apiBaseUrl,
  clearStoredToken,
  readStoredToken,
  writeStoredToken,
} from '../../lib/session';

type PageState = 'loading' | 'unauthenticated' | 'ready';

type AdminInstanceDetailPageProps = {
  instanceId: string;
};

function formatDate(value: string | null | undefined) {
  if (!value) {
    return 'Never';
  }

  return new Date(value).toLocaleString();
}

function formatSubstatus(value: string | null | undefined) {
  if (!value) {
    return 'None';
  }

  return value.replaceAll('_', ' ');
}

function formatMessagePreview(message: OutboundMessageSummary) {
  if (message.messageType === 'chat') {
    return message.body ?? 'No body';
  }

  return message.caption ?? message.mediaUrl ?? 'No media URL';
}

function formatDiagnostics(value: unknown) {
  if (value === null || value === undefined) {
    return 'No diagnostics published.';
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function readDiagnosticField(value: unknown, key: string) {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = (value as Record<string, unknown>)[key];
  if (candidate === undefined || candidate === null) {
    return null;
  }

  if (
    typeof candidate === 'string' ||
    typeof candidate === 'number' ||
    typeof candidate === 'boolean'
  ) {
    return String(candidate);
  }

  return JSON.stringify(candidate);
}

function statusTone(status: string) {
  switch (status) {
    case 'authenticated':
      return 'success' as const;
    case 'qr':
    case 'loading':
    case 'initialize':
    case 'booting':
    case 'retrying':
      return 'warning' as const;
    case 'disconnected':
    case 'stopped':
      return 'danger' as const;
    default:
      return 'neutral' as const;
  }
}

function operationTone(status: string) {
  switch (status) {
    case 'completed':
      return 'success' as const;
    case 'failed':
      return 'danger' as const;
    case 'running':
    case 'pending':
      return 'warning' as const;
    default:
      return 'neutral' as const;
  }
}

function webhookTone(status: string) {
  switch (status) {
    case 'delivered':
      return 'success' as const;
    case 'failed':
      return 'danger' as const;
    case 'retrying':
      return 'warning' as const;
    default:
      return 'neutral' as const;
  }
}

function isInstanceEnvelope(envelope: unknown, instanceId: string) {
  if (!envelope || typeof envelope !== 'object') {
    return false;
  }

  const payload = (envelope as WebsocketEnvelope).payload;
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  return (
    'instanceId' in payload &&
    (payload as { instanceId?: string }).instanceId === instanceId
  );
}

export function AdminInstanceDetailPage({
  instanceId,
}: AdminInstanceDetailPageProps) {
  const mountedRef = useRef(true);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [detail, setDetail] = useState<InstanceDetailResponse | null>(null);
  const [messages, setMessages] = useState<OutboundMessageSummary[]>([]);
  const [inboundMessages, setInboundMessages] = useState<
    InboundMessageSummary[]
  >([]);
  const [webhookDeliveries, setWebhookDeliveries] = useState<
    WebhookDeliverySummary[]
  >([]);
  const [targetWorkerId, setTargetWorkerId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [actionSubmitting, setActionSubmitting] =
    useState<InstanceAction | null>(null);
  const [screenshotOpening, setScreenshotOpening] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    if (process.env.NODE_ENV === 'test') {
      return () => {
        mountedRef.current = false;
      };
    }

    void initialize().catch(() => {
      if (!mountedRef.current) {
        return;
      }

      setPageState('unauthenticated');
      setErrorMessage('Could not load the admin instance detail.');
    });

    return () => {
      mountedRef.current = false;
    };
  }, [instanceId]);

  useEffect(() => {
    if (!detail?.assignedWorker?.workerId) {
      return;
    }

    if (targetWorkerId === '') {
      setTargetWorkerId(detail.assignedWorker.workerId);
    }
  }, [detail, targetWorkerId]);

  const reloadDetail = useEffectEvent(async () => {
    const token = readStoredToken();
    if (!token) {
      return;
    }

    const loaded = await loadPageData(token);
    if (loaded) {
      return;
    }

    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      if (!mountedRef.current) {
        return;
      }

      setPageState('unauthenticated');
      return;
    }

    await loadPageData(refreshed);
  });

  useEffect(() => {
    if (pageState !== 'ready' || process.env.NODE_ENV === 'test') {
      return;
    }

    const socket = io(apiBaseUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    const scheduleRefresh = () => {
      if (refreshTimer) {
        return;
      }

      refreshTimer = setTimeout(() => {
        refreshTimer = null;
        void reloadDetail();
      }, 250);
    };

    const instanceEvents = [
      websocketEventNames.instanceStatusChanged,
      websocketEventNames.instanceQrUpdated,
      websocketEventNames.instanceRuntimeUpdated,
      websocketEventNames.instanceLifecycleUpdated,
      websocketEventNames.instanceOperationUpdated,
      websocketEventNames.instanceSettingsUpdated,
      websocketEventNames.instanceMessageUpdated,
      websocketEventNames.instanceInboundMessageUpdated,
      websocketEventNames.webhookDeliveryUpdated,
    ];

    instanceEvents.forEach((eventName) => {
      socket.on(eventName, (envelope: WebsocketEnvelope) => {
        if (isInstanceEnvelope(envelope, instanceId)) {
          scheduleRefresh();
        }
      });
    });

    socket.on(websocketEventNames.workerHealthUpdated, scheduleRefresh);

    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }

      instanceEvents.forEach((eventName) => {
        socket.removeAllListeners(eventName);
      });
      socket.off(websocketEventNames.workerHealthUpdated, scheduleRefresh);
      socket.disconnect();
    };
  }, [instanceId, pageState]);

  const hasPendingOperation =
    detail?.pendingOperation?.status === 'pending' ||
    detail?.pendingOperation?.status === 'running';
  const conflictActive = detail?.instance.substatus === 'conflict';

  async function initialize() {
    const storedAccessToken = readStoredToken();
    if (storedAccessToken) {
      const loaded = await loadPageData(storedAccessToken);
      if (loaded) {
        return;
      }
    }

    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      setPageState('unauthenticated');
      return;
    }

    const loaded = await loadPageData(refreshed);
    if (!loaded) {
      setPageState('unauthenticated');
    }
  }

  async function refreshAccessToken() {
    const response = await fetch(`${apiBaseUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      clearStoredToken();
      if (mountedRef.current) {
        setAccessToken(null);
      }
      return null;
    }

    const auth = (await response.json()) as AuthResponse;
    writeStoredToken(auth.accessToken);
    if (mountedRef.current) {
      setAccessToken(auth.accessToken);
    }

    return auth.accessToken;
  }

  async function loadPageData(token: string) {
    const [detailResponse, messagesResponse, inboundResponse, webhookResponse] =
      await Promise.all([
        fetch(`${apiBaseUrl}/api/v1/admin/instances/${instanceId}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        }),
        fetch(
          `${apiBaseUrl}/api/v1/admin/messages?instanceId=${encodeURIComponent(instanceId)}&limit=25`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          },
        ),
        fetch(
          `${apiBaseUrl}/api/v1/admin/inbound-messages?instanceId=${encodeURIComponent(instanceId)}&limit=25`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          },
        ),
        fetch(
          `${apiBaseUrl}/api/v1/admin/webhook-deliveries?instanceId=${encodeURIComponent(instanceId)}&limit=25`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          },
        ),
      ]);

    if (
      detailResponse.status === 401 ||
      detailResponse.status === 403 ||
      messagesResponse.status === 401 ||
      inboundResponse.status === 401 ||
      webhookResponse.status === 401
    ) {
      return false;
    }

    if (
      !detailResponse.ok ||
      !messagesResponse.ok ||
      !inboundResponse.ok ||
      !webhookResponse.ok
    ) {
      if (!mountedRef.current) {
        return false;
      }

      setErrorMessage('The admin detail endpoint returned an error.');
      setPageState('unauthenticated');
      return false;
    }

    const payload = (await detailResponse.json()) as InstanceDetailResponse;
    const messagesPayload =
      (await messagesResponse.json()) as ListOutboundMessagesResponse;
    const inboundPayload =
      (await inboundResponse.json()) as ListInboundMessagesResponse;
    const webhookPayload =
      (await webhookResponse.json()) as ListWebhookDeliveriesResponse;
    if (!mountedRef.current) {
      return false;
    }

    setAccessToken(token);
    setDetail(payload);
    setMessages(messagesPayload.items);
    setInboundMessages(inboundPayload.items);
    setWebhookDeliveries(webhookPayload.items);
    setPageState('ready');
    return true;
  }

  async function requestWithRefresh(
    requestFactory: (token: string) => Promise<Response>,
  ) {
    let token = accessToken ?? readStoredToken();
    if (!token) {
      token = await refreshAccessToken();
    }

    if (!token) {
      return null;
    }

    let response = await requestFactory(token);
    if (response.status === 401) {
      token = await refreshAccessToken();
      if (!token) {
        return null;
      }

      response = await requestFactory(token);
    }

    return response;
  }

  async function requestAction(
    action: InstanceAction,
    requestedTargetWorkerId?: string,
  ) {
    setActionSubmitting(action);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await requestWithRefresh((token) =>
        fetch(`${apiBaseUrl}/api/v1/admin/instances/${instanceId}/actions`, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${token}`,
            'content-type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            action,
            targetWorkerId: requestedTargetWorkerId,
          }),
        }),
      );

      if (!response) {
        if (mountedRef.current) {
          setPageState('unauthenticated');
        }
        return;
      }

      if (!response.ok) {
        if (mountedRef.current) {
          setErrorMessage(`Could not process the ${action} action.`);
        }
        return;
      }

      const payload = (await response.json()) as RequestInstanceActionResponse;
      if (!mountedRef.current) {
        return;
      }

      setStatusMessage(payload.message);
      await reloadDetail();
    } finally {
      setActionSubmitting(null);
    }
  }

  async function handleReassign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (targetWorkerId.trim() === '') {
      setErrorMessage('Enter a worker id before reassigning.');
      return;
    }

    await requestAction('reassign', targetWorkerId.trim());
  }

  async function openLatestScreenshot() {
    if (!detail?.runtime.lastScreenshotPath) {
      setErrorMessage('No screenshot is available for this instance yet.');
      return;
    }

    setScreenshotOpening(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await requestWithRefresh((token) =>
        fetch(`${apiBaseUrl}/api/v1/admin/instances/${instanceId}/screenshot`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        }),
      );

      if (!response) {
        if (mountedRef.current) {
          setPageState('unauthenticated');
        }
        return;
      }

      if (!response.ok) {
        if (mountedRef.current) {
          setErrorMessage('Could not load the latest screenshot.');
        }
        return;
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, '_blank', 'noopener,noreferrer');
      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 60_000);

      if (mountedRef.current) {
        setStatusMessage('Opened the latest runtime screenshot in a new tab.');
      }
    } finally {
      if (mountedRef.current) {
        setScreenshotOpening(false);
      }
    }
  }

  return (
    <AppShell
      title="Admin Instance Detail"
      subtitle="Inspect one runtime in depth, verify worker placement, and intervene on live session problems without losing sight of the message trail."
      surface="admin"
      nav={pageState === 'ready' ? <AdminNav current="instance" /> : undefined}
      headerActions={
        pageState === 'ready' ? <AdminTopbarControls /> : undefined
      }
      secondaryNav={
        pageState === 'ready' && detail ? (
          <AnchorNav
            items={[
              { label: 'Summary', href: '#admin-instance-summary' },
              { label: 'Runtime', href: '#admin-instance-runtime' },
              { label: 'Actions', href: '#admin-instance-actions' },
              { label: 'Settings', href: '#admin-instance-settings' },
              { label: 'Messages', href: '#admin-instance-messages' },
              { label: 'Webhooks', href: '#admin-instance-webhooks' },
              { label: 'Operations', href: '#admin-instance-operations' },
              { label: 'Events', href: '#admin-instance-events' },
            ]}
          />
        ) : undefined
      }
      meta={
        detail ? (
          <StatusBadge tone={statusTone(detail.instance.status)}>
            {detail.instance.status} /{' '}
            {formatSubstatus(detail.instance.substatus)}
          </StatusBadge>
        ) : (
          <StatusBadge tone="neutral">Admin Detail</StatusBadge>
        )
      }
      footer={
        <>
          <a href="/">Back to admin dashboard</a>
        </>
      }
    >
      {pageState === 'loading' ? (
        <InfoCard eyebrow="Instance" title="Loading detail">
          <p style={{ margin: 0 }}>
            Fetching the instance record, runtime state, and worker assignment.
          </p>
        </InfoCard>
      ) : null}

      {pageState === 'unauthenticated' ? (
        <InfoCard eyebrow="Session" title="Admin session required">
          <p style={{ marginTop: 0 }}>
            The admin session is missing, expired, or does not have access.
          </p>
          <p style={{ marginBottom: 0 }}>
            <a href="/">Return to the admin login</a>
          </p>
        </InfoCard>
      ) : null}

      {pageState === 'ready' && detail ? (
        <>
          <InfoCard
            id="admin-instance-summary"
            eyebrow="Instance"
            title={`${detail.instance.name} (${detail.instance.publicId})`}
          >
            <div style={{ display: 'grid', gap: 16 }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  alignItems: 'center',
                }}
              >
                <StatusBadge tone="neutral">
                  {detail.instance.workspaceName}
                </StatusBadge>
                <StatusBadge tone={detail.assignedWorker ? 'info' : 'warning'}>
                  {detail.assignedWorker
                    ? `${detail.assignedWorker.workerId} (${detail.assignedWorker.status})`
                    : 'Unassigned'}
                </StatusBadge>
                {detail.pendingOperation ? (
                  <StatusBadge
                    tone={operationTone(detail.pendingOperation.status)}
                  >
                    {detail.pendingOperation.action} (
                    {detail.pendingOperation.status})
                  </StatusBadge>
                ) : null}
              </div>
              <MetricGrid minItemWidth={150}>
                <MetricCard
                  label="Outbound"
                  value={messages.length}
                  hint="Recent queued messages"
                />
                <MetricCard
                  label="Inbound"
                  value={inboundMessages.length}
                  hint="Recent inbound messages"
                  tone="info"
                />
                <MetricCard
                  label="Webhooks"
                  value={webhookDeliveries.length}
                  hint="Recent delivery attempts"
                />
                <MetricCard
                  label="Events"
                  value={detail.events.length}
                  hint={`Last event ${formatDate(detail.instance.latestEventAt)}`}
                />
              </MetricGrid>
            </div>
          </InfoCard>

          <InfoCard
            id="admin-instance-runtime"
            eyebrow="Runtime"
            title="Session runtime state"
          >
            <div className="elite-toolbar" style={{ marginBottom: 16 }}>
              <ActionButton
                type="button"
                tone="ghost"
                disabled={
                  !detail.runtime.lastScreenshotPath || screenshotOpening
                }
                onClick={() => {
                  void openLatestScreenshot();
                }}
              >
                {screenshotOpening
                  ? 'Opening screenshot...'
                  : 'Open latest screenshot'}
              </ActionButton>
            </div>
            <SectionGrid minItemWidth={320}>
              <div style={{ display: 'grid', gap: 16 }}>
                <DefinitionGrid
                  minItemWidth={150}
                  items={[
                    {
                      label: 'Backend',
                      value: detail.runtime.sessionBackend,
                      tone: 'info',
                    },
                    {
                      label: 'Session label',
                      value: detail.runtime.currentSessionLabel ?? 'Not linked',
                    },
                    {
                      label: 'QR expires',
                      value: formatDate(detail.runtime.qrExpiresAt),
                      tone: detail.runtime.qrCode ? 'warning' : 'neutral',
                    },
                    {
                      label: 'Last started',
                      value: formatDate(detail.runtime.lastStartedAt),
                    },
                    {
                      label: 'Last auth',
                      value: formatDate(detail.runtime.lastAuthenticatedAt),
                      tone: detail.runtime.lastAuthenticatedAt
                        ? 'success'
                        : 'neutral',
                    },
                    {
                      label: 'Last disconnect',
                      value: formatDate(detail.runtime.lastDisconnectedAt),
                    },
                    {
                      label: 'Last inbound',
                      value: formatDate(detail.runtime.lastInboundMessageAt),
                    },
                    {
                      label: 'Screenshot',
                      value: detail.runtime.lastScreenshotPath ?? 'None',
                    },
                    {
                      label: 'Desired state',
                      value:
                        readDiagnosticField(
                          detail.runtime.sessionDiagnostics,
                          'desiredState',
                        ) ?? 'Unknown',
                    },
                    {
                      label: 'Startup attempts',
                      value:
                        readDiagnosticField(
                          detail.runtime.sessionDiagnostics,
                          'startupAttempts',
                        ) ?? '0',
                    },
                    {
                      label: 'Recovery attempts',
                      value:
                        readDiagnosticField(
                          detail.runtime.sessionDiagnostics,
                          'recoveryAttempts',
                        ) ?? '0',
                    },
                    {
                      label: 'Last client event',
                      value:
                        readDiagnosticField(
                          detail.runtime.sessionDiagnostics,
                          'lastClientEvent',
                        ) ?? 'Unknown',
                    },
                    {
                      label: 'Recover after',
                      value:
                        readDiagnosticField(
                          detail.runtime.sessionDiagnostics,
                          'recoverAfterAt',
                        ) ?? 'None',
                    },
                    {
                      label: 'Runtime error',
                      value:
                        readDiagnosticField(
                          detail.runtime.sessionDiagnostics,
                          'lastError',
                        ) ?? 'None',
                      tone: readDiagnosticField(
                        detail.runtime.sessionDiagnostics,
                        'lastError',
                      )
                        ? 'danger'
                        : 'neutral',
                    },
                    {
                      label: 'Disconnect reason',
                      value: detail.runtime.disconnectReason ?? 'None',
                    },
                    {
                      label: 'Pending operation',
                      value: detail.pendingOperation
                        ? `${detail.pendingOperation.action} (${detail.pendingOperation.status})`
                        : 'None',
                      tone: detail.pendingOperation
                        ? operationTone(detail.pendingOperation.status)
                        : 'neutral',
                    },
                  ]}
                />
                <pre className="elite-mono-panel">
                  {formatDiagnostics(detail.runtime.sessionDiagnostics)}
                </pre>
              </div>
              <div style={{ display: 'grid', gap: 16 }}>
                {detail.runtime.sessionBackend === 'placeholder' &&
                detail.runtime.qrCode ? (
                  <NoticeBanner title="Simulated QR only" tone="warning">
                    <p style={{ margin: 0 }}>
                      This instance is running on the placeholder backend. Its
                      QR payload is only for local simulation and cannot be
                      scanned by WhatsApp.
                    </p>
                  </NoticeBanner>
                ) : null}
                {detail.runtime.qrCode ? (
                  <QrPayloadView
                    payload={detail.runtime.qrCode}
                    alt={`WhatsApp QR for ${detail.instance.publicId}`}
                    expiresAt={detail.runtime.qrExpiresAt}
                  />
                ) : (
                  <NoticeBanner title="No QR published" tone="neutral">
                    <p style={{ margin: 0 }}>
                      This instance is not currently waiting for scan.
                    </p>
                  </NoticeBanner>
                )}
              </div>
            </SectionGrid>
          </InfoCard>

          <InfoCard
            id="admin-instance-actions"
            eyebrow="Actions"
            title="Admin runtime controls"
          >
            {conflictActive ? (
              <NoticeBanner title="Session conflict detected" tone="warning">
                <p style={{ margin: 0 }}>
                  This worker reported a linked-device conflict. Use takeover
                  before forcing a restart.
                </p>
              </NoticeBanner>
            ) : null}
            <div className="elite-toolbar">
              {(
                [
                  ...(conflictActive ? (['takeover'] as const) : []),
                  'start',
                  'restart',
                  'stop',
                  'logout',
                  'clear',
                ] as const
              ).map((action) => (
                <ActionButton
                  key={action}
                  type="button"
                  tone={
                    action === 'clear' || action === 'logout'
                      ? 'danger'
                      : action === 'stop'
                        ? 'ghost'
                        : action === 'takeover'
                          ? 'secondary'
                          : 'primary'
                  }
                  disabled={
                    Boolean(hasPendingOperation) || actionSubmitting !== null
                  }
                  onClick={() => {
                    void requestAction(action);
                  }}
                >
                  {actionSubmitting === action ? `${action}...` : action}
                </ActionButton>
              ))}
            </div>
            <form
              onSubmit={handleReassign}
              style={{ display: 'grid', gap: 16, marginTop: 16 }}
            >
              <Field
                label="Target worker id"
                hint="Use this when you need to force placement to a specific worker."
              >
                <TextInput
                  value={targetWorkerId}
                  onChange={(event) => setTargetWorkerId(event.target.value)}
                  type="text"
                  required
                />
              </Field>
              <ActionButton type="submit" disabled={actionSubmitting !== null}>
                {actionSubmitting === 'reassign'
                  ? 'Reassigning...'
                  : 'Reassign instance'}
              </ActionButton>
            </form>
          </InfoCard>

          <InfoCard
            id="admin-instance-settings"
            eyebrow="Settings"
            title="Runtime settings snapshot"
          >
            <DefinitionGrid
              minItemWidth={150}
              items={[
                { label: 'sendDelay', value: detail.settings.sendDelay },
                { label: 'sendDelayMax', value: detail.settings.sendDelayMax },
                {
                  label: 'webhookUrl',
                  value: detail.settings.webhookUrl ?? 'Not configured',
                },
                {
                  label: 'message received',
                  value: detail.settings.webhookMessageReceived
                    ? 'Enabled'
                    : 'Disabled',
                  tone: detail.settings.webhookMessageReceived
                    ? 'success'
                    : 'neutral',
                },
                {
                  label: 'message create',
                  value: detail.settings.webhookMessageCreate
                    ? 'Enabled'
                    : 'Disabled',
                  tone: detail.settings.webhookMessageCreate
                    ? 'success'
                    : 'neutral',
                },
                {
                  label: 'message ack',
                  value: detail.settings.webhookMessageAck
                    ? 'Enabled'
                    : 'Disabled',
                  tone: detail.settings.webhookMessageAck
                    ? 'success'
                    : 'neutral',
                },
              ]}
            />
          </InfoCard>

          <InfoCard
            id="admin-instance-messages"
            eyebrow="Messages"
            title="Recent outbound messages"
          >
            {messages.length === 0 ? (
              <p style={{ margin: 0 }}>
                No outbound messages recorded for this instance.
              </p>
            ) : (
              <ul className="elite-list">
                {messages.map((message) => (
                  <li key={message.id} className="elite-list-item">
                    <div className="elite-list-title">
                      <span>
                        {message.publicMessageId} to {message.recipient}
                      </span>
                      <StatusBadge tone={statusTone(message.status)}>
                        {message.status}
                      </StatusBadge>
                      <StatusBadge tone="info">{message.ack}</StatusBadge>
                    </div>
                    <div>Preview: {formatMessagePreview(message)}</div>
                    <div className="elite-list-meta">
                      <span>Type {message.messageType}</span>
                      <span>Scheduled {formatDate(message.scheduledFor)}</span>
                    </div>
                    <div className="elite-list-meta">
                      <span>
                        Worker{' '}
                        {message.workerId ??
                          message.processingWorkerId ??
                          'Not assigned yet'}
                      </span>
                      <span>
                        Provider {message.providerMessageId ?? 'None'}
                      </span>
                      <span>Reference {message.referenceId ?? 'None'}</span>
                    </div>
                    <div>Error: {message.errorMessage ?? 'None'}</div>
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>

          <InfoCard eyebrow="Inbound" title="Recent inbound messages">
            {inboundMessages.length === 0 ? (
              <p style={{ margin: 0 }}>
                No inbound messages recorded for this instance.
              </p>
            ) : (
              <ul className="elite-list">
                {inboundMessages.map((message) => (
                  <li key={message.id} className="elite-list-item">
                    <div className="elite-list-title">
                      <span>
                        {message.publicMessageId} from {message.sender}
                      </span>
                      <StatusBadge tone="info">{message.kind}</StatusBadge>
                    </div>
                    <div>Body: {message.body ?? 'No text body'}</div>
                    <div className="elite-list-meta">
                      <span>Chat {message.chatId ?? 'Unknown'}</span>
                      <span>Push {message.pushName ?? 'Unknown'}</span>
                      <span>From me {message.fromMe ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="elite-list-meta">
                      <span>Received {formatDate(message.receivedAt)}</span>
                      <span>Sent at {formatDate(message.sentAt)}</span>
                      <span>
                        Provider {message.providerMessageId ?? 'None'}
                      </span>
                    </div>
                    <div>
                      Media path: {message.mediaUrl ?? 'None'} | MIME:{' '}
                      {message.mimeType ?? 'Unknown'}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>

          <InfoCard
            id="admin-instance-webhooks"
            eyebrow="Webhooks"
            title="Recent webhook deliveries"
          >
            {webhookDeliveries.length === 0 ? (
              <p style={{ margin: 0 }}>No webhook deliveries recorded.</p>
            ) : (
              <ul className="elite-list">
                {webhookDeliveries.map((delivery) => (
                  <li key={delivery.id} className="elite-list-item">
                    <div className="elite-list-title">
                      <span>{delivery.eventType}</span>
                      <StatusBadge tone={webhookTone(delivery.status)}>
                        {delivery.status}
                      </StatusBadge>
                    </div>
                    <div>Target URL: {delivery.targetUrl}</div>
                    <div className="elite-list-meta">
                      <span>
                        Message{' '}
                        {delivery.publicMessageId ?? 'No linked message'}
                      </span>
                      <span>Attempts {delivery.attemptCount}</span>
                      <span>
                        Next attempt {formatDate(delivery.nextAttemptAt)}
                      </span>
                    </div>
                    <div className="elite-list-meta">
                      <span>Delivered {formatDate(delivery.deliveredAt)}</span>
                      <span>
                        Last response {delivery.responseStatusCode ?? 'None'}
                      </span>
                      <span>Error {delivery.errorMessage ?? 'None'}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>

          <InfoCard
            id="admin-instance-operations"
            eyebrow="Operations"
            title="Recent operation history"
          >
            {detail.operations.length === 0 ? (
              <p style={{ margin: 0 }}>No operations have been recorded yet.</p>
            ) : (
              <ul className="elite-list">
                {detail.operations.map((operation) => (
                  <li key={operation.id} className="elite-list-item">
                    <div className="elite-list-title">
                      <span>{operation.action}</span>
                      <StatusBadge tone={operationTone(operation.status)}>
                        {operation.status}
                      </StatusBadge>
                    </div>
                    <div className="elite-list-meta">
                      <span>Requested by {operation.requestedByActorType}</span>
                      <span>
                        Target worker{' '}
                        {operation.targetWorkerId ?? 'Automatic assignment'}
                      </span>
                    </div>
                    <div className="elite-list-meta">
                      <span>Started {formatDate(operation.startedAt)}</span>
                      <span>Completed {formatDate(operation.completedAt)}</span>
                    </div>
                    <div>Message: {operation.message ?? 'None'}</div>
                    <div>Error: {operation.errorMessage ?? 'None'}</div>
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>

          <InfoCard eyebrow="Tokens" title="Instance API token history">
            {detail.tokens.length === 0 ? (
              <p style={{ margin: 0 }}>No instance tokens recorded.</p>
            ) : (
              <ul className="elite-list">
                {detail.tokens.map((token) => (
                  <li key={token.id} className="elite-list-item">
                    <div className="elite-list-title">
                      <span>{token.name}</span>
                      <StatusBadge
                        tone={token.revokedAt ? 'danger' : 'success'}
                      >
                        {token.revokedAt ? 'revoked' : 'active'}
                      </StatusBadge>
                    </div>
                    <div>
                      Prefix: <code>{token.prefix}</code>
                    </div>
                    <div className="elite-list-meta">
                      <span>Created {formatDate(token.createdAt)}</span>
                      <span>Revoked {formatDate(token.revokedAt)}</span>
                      <span>Last used {formatDate(token.lastUsedAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>

          <InfoCard
            id="admin-instance-events"
            eyebrow="Events"
            title="Recent lifecycle history"
          >
            {detail.events.length === 0 ? (
              <p style={{ margin: 0 }}>No lifecycle events recorded.</p>
            ) : (
              <ul className="elite-list">
                {detail.events.map((event) => (
                  <li key={event.id} className="elite-list-item">
                    <div className="elite-list-title">
                      <span>{event.eventType}</span>
                      <StatusBadge tone="neutral">
                        {event.actorType}
                      </StatusBadge>
                    </div>
                    <div>{event.message}</div>
                    <div className="elite-list-meta">
                      <span>
                        {event.fromStatus ?? 'n/a'} to {event.toStatus ?? 'n/a'}
                      </span>
                      <span>{formatDate(event.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>
        </>
      ) : null}

      {errorMessage ? (
        <NoticeBanner title="Action failed" tone="danger">
          <p style={{ margin: 0 }}>{errorMessage}</p>
        </NoticeBanner>
      ) : null}

      {statusMessage ? (
        <NoticeBanner title="Latest action" tone="success">
          <p style={{ margin: 0 }}>{statusMessage}</p>
        </NoticeBanner>
      ) : null}
    </AppShell>
  );
}
