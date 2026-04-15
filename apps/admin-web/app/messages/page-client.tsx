'use client';

import { useEffect, useState } from 'react';
import type {
  AccountMeResponse,
  InboundMessageSummary,
  ListInboundMessagesResponse,
  ListOutboundMessagesResponse,
  ListWebhookDeliveriesResponse,
  MessageStatus,
  OutboundMessageSummary,
  ReplayWebhookDeliveryResponse,
  WebhookDeliveryStatus,
  WebhookDeliverySummary,
  WebhookEventType,
} from '@elite-message/contracts';
import {
  ActionButton,
  AppShell,
  Field,
  InfoCard,
  MetricCard,
  MetricGrid,
  NoticeBanner,
  SectionGrid,
  SelectInput,
  StatusBadge,
  TextInput,
} from '@elite-message/ui';
import { AdminNav } from '../components/admin-nav';
import { AdminTopbarControls } from '../components/admin-topbar-controls';
import {
  loadAdminAccount,
  refreshAdminAccessToken,
  requestWithAdminRefresh,
} from '../lib/admin-auth';
import { formatDate, formatText, statusTone } from '../lib/admin-format';
import { apiBaseUrl } from '../lib/session';

type PageState = 'loading' | 'unauthenticated' | 'ready';

type ExplorerFilters = {
  instanceId: string;
  messageStatus: MessageStatus | 'all';
  webhookStatus: WebhookDeliveryStatus | 'all';
  eventType: WebhookEventType | 'all';
  recipient: string;
  referenceId: string;
  sender: string;
  limit: string;
};

const messageStatuses: Array<MessageStatus | 'all'> = [
  'all',
  'queue',
  'sent',
  'unsent',
  'invalid',
  'expired',
];
const webhookStatuses: Array<WebhookDeliveryStatus | 'all'> = [
  'all',
  'pending',
  'failed',
  'delivered',
  'exhausted',
];
const webhookEvents: Array<WebhookEventType | 'all'> = [
  'all',
  'message_create',
  'message_ack',
  'message_received',
];

function formatPreview(message: OutboundMessageSummary) {
  if (message.messageType === 'chat') {
    return message.body ?? 'No message body';
  }

  return message.caption ?? message.mediaUrl ?? 'No media URL';
}

function formatInboundPreview(message: InboundMessageSummary) {
  return message.body ?? message.mediaUrl ?? message.kind;
}

function readAdminMessageFilterParam(key: keyof ExplorerFilters) {
  if (typeof window === 'undefined') {
    return '';
  }

  return new URLSearchParams(window.location.search).get(key) ?? '';
}

function readInitialExplorerFilters(): ExplorerFilters {
  const messageStatus = readAdminMessageFilterParam('messageStatus');
  const webhookStatus = readAdminMessageFilterParam('webhookStatus');
  const eventType = readAdminMessageFilterParam('eventType');

  return {
    instanceId: readAdminMessageFilterParam('instanceId'),
    messageStatus: messageStatuses.includes(
      messageStatus as ExplorerFilters['messageStatus'],
    )
      ? (messageStatus as ExplorerFilters['messageStatus'])
      : 'all',
    webhookStatus: webhookStatuses.includes(
      webhookStatus as ExplorerFilters['webhookStatus'],
    )
      ? (webhookStatus as ExplorerFilters['webhookStatus'])
      : 'all',
    eventType: webhookEvents.includes(eventType as ExplorerFilters['eventType'])
      ? (eventType as ExplorerFilters['eventType'])
      : 'all',
    recipient: readAdminMessageFilterParam('recipient'),
    referenceId: readAdminMessageFilterParam('referenceId'),
    sender: readAdminMessageFilterParam('sender'),
    limit: readAdminMessageFilterParam('limit') || '40',
  };
}

export function AdminMessagesPage() {
  const [pageState, setPageState] = useState<PageState>('loading');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountMeResponse | null>(null);
  const [messages, setMessages] = useState<OutboundMessageSummary[]>([]);
  const [webhookDeliveries, setWebhookDeliveries] = useState<
    WebhookDeliverySummary[]
  >([]);
  const [inboundMessages, setInboundMessages] = useState<
    InboundMessageSummary[]
  >([]);
  const [busyDeliveryId, setBusyDeliveryId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExplorerFilters>(() =>
    readInitialExplorerFilters(),
  );

  async function loadExplorer(tokenOverride?: string | null) {
    const sharedParams = new URLSearchParams({
      limit: filters.limit || '40',
    });

    if (filters.instanceId.trim()) {
      sharedParams.set('instanceId', filters.instanceId.trim());
    }

    const messageParams = new URLSearchParams(sharedParams);
    if (filters.messageStatus !== 'all') {
      messageParams.set('status', filters.messageStatus);
    }
    if (filters.recipient.trim()) {
      messageParams.set('to', filters.recipient.trim());
    }
    if (filters.referenceId.trim()) {
      messageParams.set('referenceId', filters.referenceId.trim());
    }

    const webhookParams = new URLSearchParams(sharedParams);
    if (filters.webhookStatus !== 'all') {
      webhookParams.set('status', filters.webhookStatus);
    }
    if (filters.eventType !== 'all') {
      webhookParams.set('eventType', filters.eventType);
    }

    const inboundParams = new URLSearchParams(sharedParams);
    if (filters.sender.trim()) {
      inboundParams.set('from', filters.sender.trim());
    }

    const [messagesResponse, webhooksResponse, inboundResponse] =
      await Promise.all([
        requestWithAdminRefresh(
          tokenOverride ?? accessToken,
          (token) =>
            fetch(
              `${apiBaseUrl}/api/v1/admin/messages?${messageParams.toString()}`,
              {
                headers: {
                  authorization: `Bearer ${token}`,
                },
                credentials: 'include',
              },
            ),
          setAccessToken,
        ),
        requestWithAdminRefresh(
          tokenOverride ?? accessToken,
          (token) =>
            fetch(
              `${apiBaseUrl}/api/v1/admin/webhook-deliveries?${webhookParams.toString()}`,
              {
                headers: {
                  authorization: `Bearer ${token}`,
                },
                credentials: 'include',
              },
            ),
          setAccessToken,
        ),
        requestWithAdminRefresh(
          tokenOverride ?? accessToken,
          (token) =>
            fetch(
              `${apiBaseUrl}/api/v1/admin/inbound-messages?${inboundParams.toString()}`,
              {
                headers: {
                  authorization: `Bearer ${token}`,
                },
                credentials: 'include',
              },
            ),
          setAccessToken,
        ),
      ]);

    if (!messagesResponse || !webhooksResponse || !inboundResponse) {
      setPageState('unauthenticated');
      return;
    }

    if (!messagesResponse.ok || !webhooksResponse.ok || !inboundResponse.ok) {
      throw new Error('Could not load the admin message explorer.');
    }

    const messagesPayload =
      (await messagesResponse.json()) as ListOutboundMessagesResponse;
    const webhooksPayload =
      (await webhooksResponse.json()) as ListWebhookDeliveriesResponse;
    const inboundPayload =
      (await inboundResponse.json()) as ListInboundMessagesResponse;

    setMessages(messagesPayload.items);
    setWebhookDeliveries(webhooksPayload.items);
    setInboundMessages(inboundPayload.items);
  }

  useEffect(() => {
    void (async () => {
      try {
        const token = await refreshAdminAccessToken(setAccessToken);
        if (!token) {
          setPageState('unauthenticated');
          return;
        }

        const me = await loadAdminAccount(token);
        if (!me) {
          setPageState('unauthenticated');
          return;
        }

        setAccount(me);
        await loadExplorer(token);
        setPageState('ready');
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Could not load the admin message explorer.',
        );
        setPageState('unauthenticated');
      }
    })();
  }, []);

  useEffect(() => {
    if (pageState !== 'ready') {
      return;
    }

    void loadExplorer().catch((error) => {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not reload the admin message explorer.',
      );
    });
  }, [filters, pageState]);

  useEffect(() => {
    if (pageState !== 'ready' || typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams();
    if (filters.instanceId.trim()) {
      params.set('instanceId', filters.instanceId.trim());
    }
    if (filters.messageStatus !== 'all') {
      params.set('messageStatus', filters.messageStatus);
    }
    if (filters.webhookStatus !== 'all') {
      params.set('webhookStatus', filters.webhookStatus);
    }
    if (filters.eventType !== 'all') {
      params.set('eventType', filters.eventType);
    }
    if (filters.recipient.trim()) {
      params.set('recipient', filters.recipient.trim());
    }
    if (filters.referenceId.trim()) {
      params.set('referenceId', filters.referenceId.trim());
    }
    if (filters.sender.trim()) {
      params.set('sender', filters.sender.trim());
    }
    if (filters.limit.trim() && filters.limit.trim() !== '40') {
      params.set('limit', filters.limit.trim());
    }

    const nextSearch = params.toString();
    const nextUrl = nextSearch
      ? `${window.location.pathname}?${nextSearch}`
      : window.location.pathname;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (nextUrl !== currentUrl) {
      window.history.replaceState({}, '', nextUrl);
    }
  }, [filters, pageState]);

  async function replayWebhook(deliveryId: string) {
    setBusyDeliveryId(deliveryId);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await requestWithAdminRefresh(
        accessToken,
        (token) =>
          fetch(
            `${apiBaseUrl}/api/v1/admin/webhook-deliveries/${deliveryId}/replay`,
            {
              method: 'POST',
              headers: {
                authorization: `Bearer ${token}`,
              },
              credentials: 'include',
            },
          ),
        setAccessToken,
      );

      if (!response) {
        setPageState('unauthenticated');
        return;
      }

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(
          payload?.message ?? 'Could not replay the webhook delivery.',
        );
      }

      const payload = (await response.json()) as ReplayWebhookDeliveryResponse;
      setStatusMessage(
        `Webhook ${payload.delivery.id.slice(0, 8)} replayed with status ${payload.delivery.status}.`,
      );
      await loadExplorer();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not replay the webhook delivery.',
      );
    } finally {
      setBusyDeliveryId(null);
    }
  }

  const deadLetterCount = webhookDeliveries.filter(
    (delivery) => delivery.status === 'exhausted',
  ).length;
  const failedWebhookCount = webhookDeliveries.filter(
    (delivery) => delivery.status === 'failed',
  ).length;

  return (
    <AppShell
      title="Admin Message Explorer"
      subtitle="Inspect outbound traffic, dead-lettered webhook deliveries, and inbound activity across every tenant from one dedicated operations surface."
      surface="admin"
      density="compact"
      nav={
        pageState === 'ready' ? (
          <AdminNav current="messages" account={account} />
        ) : undefined
      }
      headerActions={
        pageState === 'ready' && account ? (
          <AdminTopbarControls account={account} />
        ) : undefined
      }
      meta={
        account ? (
          <StatusBadge tone="warning">
            {messages.length} outbound records
          </StatusBadge>
        ) : undefined
      }
      footer={<a href="/">Back to dashboard</a>}
    >
      {pageState === 'loading' ? (
        <InfoCard eyebrow="Messages" title="Loading message explorer">
          <p style={{ margin: 0 }}>
            Refreshing the admin session and loading global message data.
          </p>
        </InfoCard>
      ) : null}

      {pageState === 'unauthenticated' ? (
        <InfoCard eyebrow="Session" title="Admin sign-in required">
          <p style={{ marginTop: 0 }}>
            The admin session is missing or expired.
          </p>
          <p style={{ marginBottom: 0 }}>
            <a href="/">Return to the admin dashboard login</a>
          </p>
        </InfoCard>
      ) : null}

      {pageState === 'ready' ? (
        <>
          <MetricGrid>
            <MetricCard
              label="Outbound rows"
              value={messages.length}
              tone="info"
            />
            <MetricCard
              label="Webhook failures"
              value={failedWebhookCount}
              tone="warning"
            />
            <MetricCard
              label="Dead letters"
              value={deadLetterCount}
              tone="danger"
            />
            <MetricCard
              label="Inbound rows"
              value={inboundMessages.length}
              tone="neutral"
            />
          </MetricGrid>

          <InfoCard
            eyebrow="Filters"
            title="Global message filters"
            className="elite-sticky-panel"
          >
            <div
              style={{
                display: 'grid',
                gap: 14,
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              }}
            >
              <Field label="Instance ID">
                <TextInput
                  value={filters.instanceId}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      instanceId: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Outbound status">
                <SelectInput
                  value={filters.messageStatus}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      messageStatus: event.target
                        .value as ExplorerFilters['messageStatus'],
                    }))
                  }
                >
                  {messageStatuses.map((status) => (
                    <option key={status} value={status}>
                      {formatText(status)}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Webhook status">
                <SelectInput
                  value={filters.webhookStatus}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      webhookStatus: event.target
                        .value as ExplorerFilters['webhookStatus'],
                    }))
                  }
                >
                  {webhookStatuses.map((status) => (
                    <option key={status} value={status}>
                      {formatText(status)}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Webhook event">
                <SelectInput
                  value={filters.eventType}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      eventType: event.target
                        .value as ExplorerFilters['eventType'],
                    }))
                  }
                >
                  {webhookEvents.map((eventType) => (
                    <option key={eventType} value={eventType}>
                      {formatText(eventType)}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Recipient contains">
                <TextInput
                  value={filters.recipient}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      recipient: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Reference ID contains">
                <TextInput
                  value={filters.referenceId}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      referenceId: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Inbound sender contains">
                <TextInput
                  value={filters.sender}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      sender: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Limit">
                <TextInput
                  value={filters.limit}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      limit: event.target.value,
                    }))
                  }
                />
              </Field>
            </div>
          </InfoCard>

          <SectionGrid minItemWidth={340}>
            <InfoCard eyebrow="Outbound" title="Global outbound messages">
              {messages.length === 0 ? (
                <p style={{ margin: 0 }}>
                  No outbound messages matched the current filters.
                </p>
              ) : (
                <ul className="elite-list">
                  {messages.map((message) => (
                    <li key={message.id} className="elite-list-item">
                      <div className="elite-list-title">
                        <span>{message.publicMessageId}</span>
                        <StatusBadge tone={statusTone(message.status)}>
                          {message.status}
                        </StatusBadge>
                        <StatusBadge tone={statusTone(message.ack)}>
                          {message.ack}
                        </StatusBadge>
                      </div>
                      <div className="elite-list-meta">
                        <span>{message.instancePublicId}</span>
                        <span>{message.recipient}</span>
                        <span>Updated {formatDate(message.updatedAt)}</span>
                      </div>
                      <p
                        style={{
                          margin: '8px 0 0',
                          color: 'var(--elite-ink-soft)',
                        }}
                      >
                        {formatPreview(message)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </InfoCard>

            <InfoCard eyebrow="Webhooks" title="Global webhook deliveries">
              {webhookDeliveries.length === 0 ? (
                <p style={{ margin: 0 }}>
                  No webhook deliveries matched the current filters.
                </p>
              ) : (
                <ul className="elite-list">
                  {webhookDeliveries.map((delivery) => (
                    <li key={delivery.id} className="elite-list-item">
                      <div className="elite-list-title">
                        <span>{delivery.id.slice(0, 8)}</span>
                        <StatusBadge tone={statusTone(delivery.status)}>
                          {delivery.status}
                        </StatusBadge>
                        <StatusBadge tone="info">
                          {formatText(delivery.eventType)}
                        </StatusBadge>
                      </div>
                      <div className="elite-list-meta">
                        <span>{delivery.instancePublicId}</span>
                        <span>{delivery.targetUrl}</span>
                        <span>Attempts {delivery.attemptCount}</span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 8,
                          marginTop: 10,
                        }}
                      >
                        <StatusBadge tone="neutral">
                          Next {formatDate(delivery.nextAttemptAt)}
                        </StatusBadge>
                        {delivery.errorMessage ? (
                          <StatusBadge tone="danger">
                            {delivery.errorMessage}
                          </StatusBadge>
                        ) : null}
                        {(delivery.status === 'failed' ||
                          delivery.status === 'exhausted') && (
                          <ActionButton
                            type="button"
                            tone="secondary"
                            disabled={busyDeliveryId === delivery.id}
                            onClick={() => void replayWebhook(delivery.id)}
                          >
                            {busyDeliveryId === delivery.id
                              ? 'Replaying...'
                              : delivery.status === 'exhausted'
                                ? 'Replay dead letter'
                                : 'Replay'}
                          </ActionButton>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </InfoCard>

            <InfoCard eyebrow="Inbound" title="Global inbound messages">
              {inboundMessages.length === 0 ? (
                <p style={{ margin: 0 }}>
                  No inbound messages matched the current filters.
                </p>
              ) : (
                <ul className="elite-list">
                  {inboundMessages.map((message) => (
                    <li key={message.id} className="elite-list-item">
                      <div className="elite-list-title">
                        <span>{message.publicMessageId}</span>
                        <StatusBadge tone="info">{message.kind}</StatusBadge>
                      </div>
                      <div className="elite-list-meta">
                        <span>{message.instancePublicId}</span>
                        <span>{message.sender}</span>
                        <span>Received {formatDate(message.receivedAt)}</span>
                      </div>
                      <p
                        style={{
                          margin: '8px 0 0',
                          color: 'var(--elite-ink-soft)',
                        }}
                      >
                        {formatInboundPreview(message)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </InfoCard>
          </SectionGrid>
        </>
      ) : null}

      {errorMessage ? (
        <NoticeBanner title="Admin action failed" tone="danger">
          <p style={{ margin: 0 }}>{errorMessage}</p>
        </NoticeBanner>
      ) : null}

      {statusMessage ? (
        <NoticeBanner title="Latest update" tone="success">
          <p style={{ margin: 0 }}>{statusMessage}</p>
        </NoticeBanner>
      ) : null}
    </AppShell>
  );
}
