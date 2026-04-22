'use client';

import Link from 'next/link';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type {
  AccountMeResponse,
  InboundMessageSummary,
  ListCustomerInstancesResponse,
  ListInboundMessagesResponse,
  ListOutboundMessagesResponse,
  MessageStatus,
  OutboundMessageSummary,
} from '@elite-message/contracts';
import {
  ActionButton,
  AppShell,
  Field,
  InfoCard,
  MetricCard,
  MetricGrid,
  NoticeBanner,
  SelectInput,
  StatusBadge,
  TextInput,
} from '@elite-message/ui';
import { useCustomerLocale } from '../components/customer-localization';
import { CustomerNav } from '../components/customer-nav';
import {
  CustomerTopbarAnnouncement,
  CustomerWorkspaceControls,
} from '../components/customer-workspace-chrome';
import {
  loadCustomerAccount,
  logoutCustomerSession,
  refreshCustomerAccessToken,
  requestWithCustomerRefresh,
} from '../lib/customer-auth';
import {
  formatCustomerDate,
  getCustomerShellLabels,
  translateCustomerEnum,
} from '../lib/customer-locale';
import { apiBaseUrl, readStoredToken } from '../lib/session';

type PageState = 'loading' | 'unauthenticated' | 'ready';

const customerMessageStatuses: Array<MessageStatus | 'all'> = [
  'all',
  'queue',
  'sent',
  'unsent',
  'invalid',
  'expired',
];

function messageTone(status: string) {
  switch (status) {
    case 'sent':
      return 'success' as const;
    case 'queue':
      return 'warning' as const;
    case 'invalid':
    case 'expired':
      return 'danger' as const;
    default:
      return 'neutral' as const;
  }
}

function getStatusProgress(status: MessageStatus) {
  switch (status) {
    case 'sent':
      return 100;
    case 'queue':
      return 42;
    case 'unsent':
      return 28;
    case 'invalid':
      return 14;
    case 'expired':
      return 6;
    default:
      return 0;
  }
}

function getMessageInitial(value: string) {
  return value.trim().charAt(0).toUpperCase() || '#';
}

function getOutboundPreview(message: OutboundMessageSummary, fallback: string) {
  const preview =
    message.body?.trim() ||
    message.caption?.trim() ||
    message.mediaUrl?.trim() ||
    '';

  return preview || fallback;
}

function getInboundPreview(message: InboundMessageSummary, fallback: string) {
  const preview = message.body?.trim() || message.mediaUrl?.trim() || '';

  return preview || fallback;
}

function countOutboundStatus(
  messages: OutboundMessageSummary[],
  status: MessageStatus,
) {
  return messages.filter((message) => message.status === status).length;
}

function readCustomerMessageFilterParam(key: string) {
  if (typeof window === 'undefined') {
    return '';
  }

  return new URLSearchParams(window.location.search).get(key) ?? '';
}

function readCustomerMessageStatusParam() {
  const status = readCustomerMessageFilterParam('status');
  return customerMessageStatuses.includes(status as MessageStatus | 'all')
    ? (status as MessageStatus | 'all')
    : 'all';
}

function readCustomerMessageFocusParam() {
  return readCustomerMessageFilterParam('focus');
}

export function CustomerMessagesPage() {
  const { locale } = useCustomerLocale();
  const mountedRef = useRef(true);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountMeResponse | null>(null);
  const [instances, setInstances] = useState<
    ListCustomerInstancesResponse['items']
  >([]);
  const [workspaceId, setWorkspaceId] = useState(() =>
    readCustomerMessageFilterParam('workspaceId'),
  );
  const [instanceId, setInstanceId] = useState(() =>
    readCustomerMessageFilterParam('instanceId'),
  );
  const [statusFilter, setStatusFilter] = useState<MessageStatus | 'all'>(() =>
    readCustomerMessageStatusParam(),
  );
  const [focusTarget] = useState(() => readCustomerMessageFocusParam());
  const [recipientFilter, setRecipientFilter] = useState(() =>
    readCustomerMessageFilterParam('to'),
  );
  const [outboundMessages, setOutboundMessages] = useState<
    OutboundMessageSummary[]
  >([]);
  const [inboundMessages, setInboundMessages] = useState<
    InboundMessageSummary[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const copy =
    locale === 'ar'
      ? {
          activeFilters: 'الفلاتر النشطة',
          allStatuses: 'كل الحالات',
          apiIssue: 'مشكلة في مستكشف الرسائل',
          attention: 'تحتاج متابعة',
          backToDashboard: 'العودة إلى لوحة التحكم',
          dashboardLogin: 'العودة إلى تسجيل الدخول في لوحة التحكم',
          delivered: 'تم التسليم',
          deliveryHealth: 'صحة التسليم',
          filters: 'الفلاتر',
          inbound: 'الواردة',
          inboundEmpty: 'لا توجد رسائل واردة تطابق النطاق المحدد.',
          inboundSubtitle: 'ردود العملاء والوسائط المستلمة ضمن النطاق المحدد.',
          instance: 'المثيل',
          loading: 'جارٍ تحميل مستكشف الرسائل',
          loadingMessage: 'يتم تحديث جلسة العميل وتحميل سجل الرسائل الأخير.',
          liveTraffic: 'الحركة المباشرة',
          messageCenter: 'مركز قيادة الرسائل',
          messageCenterSubtitle:
            'راقب ضغط الطابور ونتائج التسليم والردود الواردة من واجهة واحدة.',
          messageScope: 'نطاق الرسائل',
          messages: 'الرسائل',
          noDelivered: 'لا توجد رسائل مسلّمة',
          noInboundActivity: 'لا يوجد نشاط وارد',
          noQueued: 'لا توجد رسائل في الطابور',
          noPreview: 'لا توجد معاينة',
          outbound: 'الصادرة',
          outboundEmpty: 'لا توجد رسائل صادرة تطابق النطاق المحدد.',
          outboundSubtitle:
            'تفاصيل الطابور والتسليم والتأكيد لآخر الرسائل المرسلة.',
          pageSubtitle:
            'ابحث في أحدث الرسائل الصادرة والواردة عبر مساحة عمل العميل بدلًا من التقيد بصفحة تفاصيل مثيل واحدة.',
          pageTitle: 'رسائل العميل',
          queued: 'في الطابور',
          recipientContains: 'المستلم يحتوي على',
          refreshExplorer: 'تحديث المستكشف',
          refreshTopbar: 'تحديث المستكشف',
          returnSignin: 'يجب تسجيل الدخول',
          scopeAllInstances: 'كل مثيلات مساحة العمل',
          sessionMissing: 'جلسة العميل مفقودة أو منتهية الصلاحية.',
          showing: 'عرض',
          statusQuickFilter: 'فلتر الحالة السريع',
          totalOutbound: 'الصادرة',
          workspace: 'مساحة العمل',
        }
      : {
          activeFilters: 'Active filters',
          allStatuses: 'All statuses',
          apiIssue: 'Message explorer issue',
          attention: 'Needs attention',
          backToDashboard: 'Back to dashboard',
          dashboardLogin: 'Return to the dashboard login',
          delivered: 'Delivered',
          deliveryHealth: 'Delivery health',
          filters: 'Filters',
          inbound: 'Inbound',
          inboundEmpty: 'No inbound messages matched the selected scope.',
          inboundSubtitle:
            'Customer replies and received media inside the selected scope.',
          instance: 'Instance',
          loading: 'Loading message explorer',
          loadingMessage:
            'Refreshing the customer session and loading the recent message history.',
          liveTraffic: 'Live traffic',
          messageCenter: 'Message command center',
          messageCenterSubtitle:
            'Track queue pressure, delivery outcomes, and inbound replies without leaving the operator view.',
          messageScope: 'Message scope',
          messages: 'Messages',
          noDelivered: 'No delivered sends',
          noInboundActivity: 'No inbound activity',
          noQueued: 'No queued sends',
          noPreview: 'No preview available',
          outbound: 'Outbound',
          outboundEmpty: 'No outbound messages matched the selected scope.',
          outboundSubtitle:
            'Queue, delivery, and acknowledgement details for recent sends.',
          pageSubtitle:
            'Search recent outbound and inbound traffic across the customer workspace instead of being locked into a single-instance detail page.',
          pageTitle: 'Customer Messages',
          queued: 'Queued',
          recipientContains: 'Recipient contains',
          refreshExplorer: 'Refresh message explorer',
          refreshTopbar: 'Refresh explorer',
          returnSignin: 'Sign in required',
          scopeAllInstances: 'All workspace instances',
          sessionMissing: 'The customer session is missing or expired.',
          showing: 'Showing',
          statusQuickFilter: 'Quick status filter',
          totalOutbound: 'Outbound',
          workspace: 'Workspace',
        };

  function handleMessageLoadFailure(message: string) {
    if (!mountedRef.current) {
      return;
    }

    if (pageState === 'ready' && account) {
      setErrorMessage(message);
      return;
    }

    setPageState('unauthenticated');
    setErrorMessage(message);
  }

  const loadPage = useEffectEvent(async (token: string) => {
    const [me, instanceResponse] = await Promise.all([
      loadCustomerAccount(token),
      requestWithCustomerRefresh(
        token,
        (bearer) =>
          fetch(`${apiBaseUrl}/api/v1/customer/instances`, {
            headers: {
              authorization: `Bearer ${bearer}`,
            },
            credentials: 'include',
          }),
        setAccessToken,
      ),
    ]);

    if (!me || !instanceResponse) {
      handleMessageLoadFailure(
        locale === 'ar'
          ? 'تعذر الوصول إلى API الخاص بالعميل.'
          : 'Could not reach the customer API.',
      );
      return false;
    }

    if (!instanceResponse.ok) {
      handleMessageLoadFailure(
        locale === 'ar'
          ? 'تعذر تحميل مستكشف رسائل العميل.'
          : 'Could not load the customer message explorer.',
      );
      return false;
    }

    const instancePayload =
      (await instanceResponse.json()) as ListCustomerInstancesResponse;
    if (!mountedRef.current) {
      return false;
    }

    setAccessToken(token);
    setAccount(me);
    setInstances(instancePayload.items);
    setWorkspaceId((current) =>
      current && me.workspaces.some((workspace) => workspace.id === current)
        ? current
        : (me.workspaces[0]?.id ?? ''),
    );
    setPageState('ready');
    return true;
  });

  const loadMessages = useEffectEvent(async (tokenOverride?: string | null) => {
    if (mountedRef.current) {
      setErrorMessage(null);
    }

    const targetWorkspaceId = workspaceId;
    const targetInstanceId = instanceId.trim();

    const query = new URLSearchParams();
    if (targetWorkspaceId) {
      query.set('workspaceId', targetWorkspaceId);
    }
    if (targetInstanceId) {
      query.set('instanceId', targetInstanceId);
    }
    if (statusFilter !== 'all') {
      query.set('status', statusFilter);
    }
    if (recipientFilter.trim()) {
      query.set('to', recipientFilter.trim());
    }
    query.set('limit', '40');

    const inboundQuery = new URLSearchParams();
    if (targetWorkspaceId) {
      inboundQuery.set('workspaceId', targetWorkspaceId);
    }
    if (targetInstanceId) {
      inboundQuery.set('instanceId', targetInstanceId);
    }
    inboundQuery.set('limit', '25');

    const token = tokenOverride ?? accessToken;
    const [outboundResponse, inboundResponse] = await Promise.all([
      requestWithCustomerRefresh(
        token,
        (bearer) =>
          fetch(`${apiBaseUrl}/api/v1/customer/messages?${query.toString()}`, {
            headers: {
              authorization: `Bearer ${bearer}`,
            },
            credentials: 'include',
          }),
        setAccessToken,
      ),
      requestWithCustomerRefresh(
        token,
        (bearer) =>
          fetch(
            `${apiBaseUrl}/api/v1/customer/inbound-messages?${inboundQuery.toString()}`,
            {
              headers: {
                authorization: `Bearer ${bearer}`,
              },
              credentials: 'include',
            },
          ),
        setAccessToken,
      ),
    ]);

    if (!outboundResponse || !inboundResponse) {
      handleMessageLoadFailure(
        locale === 'ar'
          ? 'تعذر الوصول إلى API الخاص بالعميل.'
          : 'Could not reach the customer API.',
      );
      return;
    }

    if (!outboundResponse.ok || !inboundResponse.ok) {
      if (mountedRef.current) {
        setErrorMessage(
          locale === 'ar'
            ? 'تعذر تحميل مستكشف رسائل العميل.'
            : 'Could not load the customer message explorer.',
        );
      }
      return;
    }

    const outboundPayload =
      (await outboundResponse.json()) as ListOutboundMessagesResponse;
    const inboundPayload =
      (await inboundResponse.json()) as ListInboundMessagesResponse;
    if (mountedRef.current) {
      setOutboundMessages(outboundPayload.items);
      setInboundMessages(inboundPayload.items);
    }
  });

  async function logout() {
    await logoutCustomerSession();
    if (!mountedRef.current) {
      return;
    }

    setPageState('unauthenticated');
    setAccessToken(null);
    setAccount(null);
    setInstances([]);
    setOutboundMessages([]);
    setInboundMessages([]);
    setErrorMessage(null);
  }

  useEffect(() => {
    mountedRef.current = true;
    void (async () => {
      try {
        setErrorMessage(null);

        const storedToken = readStoredToken();
        if (storedToken) {
          const loaded = await loadPage(storedToken);
          if (loaded) {
            return;
          }
        }

        const token = await refreshCustomerAccessToken(setAccessToken);
        if (!token) {
          if (mountedRef.current) {
            setPageState('unauthenticated');
          }
          return;
        }

        await loadPage(token);
      } catch (error) {
        if (mountedRef.current) {
          setPageState('unauthenticated');
          setErrorMessage(
            error instanceof Error
              ? error.message
              : locale === 'ar'
                ? 'تعذر تحميل مستكشف رسائل العميل.'
                : 'Could not load the customer message explorer.',
          );
        }
      }
    })();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (pageState !== 'ready') {
      return;
    }

    void loadMessages();
  }, [instanceId, pageState, recipientFilter, statusFilter, workspaceId]);

  useEffect(() => {
    if (pageState !== 'ready' || !instanceId) {
      return;
    }

    if (
      instances.some(
        (instance) =>
          instance.id === instanceId &&
          (!workspaceId || instance.workspaceId === workspaceId),
      )
    ) {
      return;
    }

    setInstanceId('');
  }, [instanceId, instances, pageState, workspaceId]);

  useEffect(() => {
    if (pageState !== 'ready' || typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams();
    if (workspaceId) {
      params.set('workspaceId', workspaceId);
    }
    if (instanceId.trim()) {
      params.set('instanceId', instanceId.trim());
    }
    if (statusFilter !== 'all') {
      params.set('status', statusFilter);
    }
    if (recipientFilter.trim()) {
      params.set('to', recipientFilter.trim());
    }

    const nextSearch = params.toString();
    const nextUrl = nextSearch
      ? `${window.location.pathname}?${nextSearch}`
      : window.location.pathname;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (nextUrl !== currentUrl) {
      window.history.replaceState({}, '', nextUrl);
    }
  }, [instanceId, pageState, recipientFilter, statusFilter, workspaceId]);

  useEffect(() => {
    if (pageState !== 'ready' || focusTarget !== 'recipient') {
      return;
    }

    const recipientInput = document.getElementById(
      'customer-message-recipient-filter',
    );
    if (recipientInput instanceof HTMLElement) {
      recipientInput.focus();
    }
  }, [focusTarget, pageState]);

  const workspaceInstances = instances.filter(
    (instance) => !workspaceId || instance.workspaceId === workspaceId,
  );
  const selectedWorkspace = account?.workspaces.find(
    (workspace) => workspace.id === workspaceId,
  );
  const selectedInstance = workspaceInstances.find(
    (instance) => instance.id === instanceId,
  );
  const selectedWorkspaceLabel = selectedWorkspace
    ? `${selectedWorkspace.name} (${translateCustomerEnum(locale, selectedWorkspace.role)})`
    : copy.workspace;
  const selectedInstanceLabel = selectedInstance
    ? `${selectedInstance.name} (${selectedInstance.publicId})`
    : copy.scopeAllInstances;
  const selectedStatusLabel =
    statusFilter === 'all'
      ? copy.allStatuses
      : translateCustomerEnum(locale, statusFilter);
  const activeFilterCount = [
    workspaceId,
    instanceId.trim(),
    statusFilter !== 'all' ? statusFilter : '',
    recipientFilter.trim(),
  ].filter(Boolean).length;
  const queuedCount = countOutboundStatus(outboundMessages, 'queue');
  const deliveredCount = countOutboundStatus(outboundMessages, 'sent');
  const attentionCount =
    countOutboundStatus(outboundMessages, 'unsent') +
    countOutboundStatus(outboundMessages, 'invalid') +
    countOutboundStatus(outboundMessages, 'expired');
  const latestQueued = outboundMessages.find(
    (message) => message.status === 'queue',
  );
  const latestDelivered = outboundMessages.find(
    (message) => message.status === 'sent',
  );
  const latestInbound = inboundMessages[0] ?? null;

  return (
    <AppShell
      title={copy.pageTitle}
      subtitle={copy.pageSubtitle}
      breadcrumbLabel={copy.messages}
      surface="customer"
      density="compact"
      labels={getCustomerShellLabels(locale)}
      nav={
        pageState === 'ready' ? (
          <CustomerNav
            current="messages"
            account={account}
            workspaceId={workspaceId}
          />
        ) : undefined
      }
      meta={
        account ? (
          <CustomerTopbarAnnouncement
            eyebrow={copy.liveTraffic}
            message={
              locale === 'ar'
                ? 'راجع النشاط الصادر والوارد عبر مساحة العمل.'
                : 'Review outbound and inbound activity across the workspace.'
            }
            linkLabel={copy.refreshTopbar}
            linkHref="/messages"
          />
        ) : undefined
      }
      headerActions={
        pageState === 'ready' && account ? (
          <CustomerWorkspaceControls
            account={account}
            workspaceId={workspaceId}
            onWorkspaceChange={setWorkspaceId}
            onLogout={logout}
          />
        ) : undefined
      }
      footer={<Link href="/dashboard">{copy.backToDashboard}</Link>}
    >
      {pageState === 'loading' ? (
        <InfoCard eyebrow={copy.messages} title={copy.loading}>
          <p style={{ margin: 0 }}>{copy.loadingMessage}</p>
        </InfoCard>
      ) : null}

      {pageState === 'unauthenticated' ? (
        <InfoCard
          eyebrow={locale === 'ar' ? 'الجلسة' : 'Session'}
          title={copy.returnSignin}
        >
          <p style={{ marginTop: 0 }}>{copy.sessionMissing}</p>
          <p style={{ marginBottom: 0 }}>
            <Link href="/signin">{copy.dashboardLogin}</Link>
          </p>
        </InfoCard>
      ) : null}

      {pageState === 'ready' && account ? (
        <>
          <section
            className="elite-customer-messages-hero"
            aria-labelledby="customer-messages-command-center"
          >
            <div className="elite-customer-messages-hero-copy">
              <p className="elite-customer-messages-kicker">
                {copy.deliveryHealth}
              </p>
              <h2 id="customer-messages-command-center">
                {copy.messageCenter}
              </h2>
              <p>{copy.messageCenterSubtitle}</p>
              <div className="elite-customer-messages-scope-row">
                <span>{selectedWorkspaceLabel}</span>
                <span>{selectedInstanceLabel}</span>
                <span>{selectedStatusLabel}</span>
              </div>
            </div>
            <div
              className="elite-customer-messages-hero-panel"
              aria-label={copy.deliveryHealth}
            >
              <div>
                <span>{copy.activeFilters}</span>
                <strong>{activeFilterCount}</strong>
              </div>
              <div>
                <span>{copy.queued}</span>
                <strong>{queuedCount}</strong>
              </div>
              <div>
                <span>{copy.attention}</span>
                <strong>{attentionCount}</strong>
              </div>
            </div>
          </section>

          <MetricGrid minItemWidth={150}>
            <MetricCard
              label={copy.totalOutbound}
              value={outboundMessages.length}
              hint={`${copy.showing} ${outboundMessages.length}`}
              tone="info"
              emphasis="strong"
            />
            <MetricCard
              label={copy.queued}
              value={queuedCount}
              hint={
                latestQueued
                  ? formatCustomerDate(locale, latestQueued.createdAt)
                  : copy.noQueued
              }
              tone={queuedCount > 0 ? 'warning' : 'neutral'}
            />
            <MetricCard
              label={copy.delivered}
              value={deliveredCount}
              hint={
                latestDelivered?.sentAt
                  ? formatCustomerDate(locale, latestDelivered.sentAt)
                  : copy.noDelivered
              }
              tone="success"
            />
            <MetricCard
              label={copy.inbound}
              value={inboundMessages.length}
              hint={
                latestInbound
                  ? formatCustomerDate(locale, latestInbound.receivedAt)
                  : copy.noInboundActivity
              }
              tone="info"
            />
            <MetricCard
              label={copy.attention}
              value={attentionCount}
              hint={copy.deliveryHealth}
              tone={attentionCount > 0 ? 'danger' : 'neutral'}
            />
          </MetricGrid>

          <InfoCard
            eyebrow={copy.filters}
            title={copy.messageScope}
            className="elite-sticky-panel elite-customer-messages-scope-card"
          >
            <div className="elite-customer-messages-filter-grid">
              <Field label={copy.workspace}>
                <SelectInput
                  value={workspaceId}
                  onChange={(event) => setWorkspaceId(event.target.value)}
                >
                  {account.workspaces.map((workspace) => (
                    <option key={workspace.id} value={workspace.id}>
                      {workspace.name} (
                      {translateCustomerEnum(locale, workspace.role)})
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label={copy.instance}>
                <SelectInput
                  value={instanceId}
                  onChange={(event) => setInstanceId(event.target.value)}
                >
                  <option value="">{copy.scopeAllInstances}</option>
                  {workspaceInstances.map((instance) => (
                    <option key={instance.id} value={instance.id}>
                      {instance.name} ({instance.publicId})
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field
                label={
                  locale === 'ar' ? 'حالة الرسائل الصادرة' : 'Outbound status'
                }
              >
                <SelectInput
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as MessageStatus | 'all')
                  }
                >
                  {customerMessageStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status === 'all'
                        ? copy.allStatuses
                        : translateCustomerEnum(locale, status)}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label={copy.recipientContains}>
                <TextInput
                  id="customer-message-recipient-filter"
                  value={recipientFilter}
                  onChange={(event) => setRecipientFilter(event.target.value)}
                  placeholder="9639..."
                />
              </Field>
              <ActionButton
                type="button"
                tone="secondary"
                onClick={() => void loadMessages()}
              >
                {copy.refreshExplorer}
              </ActionButton>
            </div>
            <div
              className="elite-customer-messages-quick-filter"
              role="group"
              aria-label={copy.statusQuickFilter}
            >
              <span>{copy.statusQuickFilter}</span>
              {customerMessageStatuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  data-active={statusFilter === status ? 'true' : 'false'}
                  onClick={() => setStatusFilter(status)}
                >
                  {status === 'all'
                    ? copy.allStatuses
                    : translateCustomerEnum(locale, status)}
                </button>
              ))}
            </div>
          </InfoCard>

          <div className="elite-customer-messages-board">
            <InfoCard
              eyebrow={copy.outbound}
              title={
                locale === 'ar'
                  ? 'أحدث الرسائل الصادرة'
                  : 'Recent outbound messages'
              }
              subtitle={copy.outboundSubtitle}
              className="elite-customer-messages-stream"
            >
              {outboundMessages.length === 0 ? (
                <div className="elite-customer-messages-empty">
                  <span aria-hidden="true">↗</span>
                  <p>{copy.outboundEmpty}</p>
                </div>
              ) : (
                <div className="elite-customer-messages-stack">
                  {outboundMessages.map((message) => (
                    <article
                      key={message.id}
                      className="elite-customer-message-card"
                      data-status={message.status}
                    >
                      <div className="elite-customer-message-card-header">
                        <div
                          className="elite-customer-message-avatar"
                          aria-hidden="true"
                        >
                          {getMessageInitial(message.recipient)}
                        </div>
                        <div className="elite-customer-message-thread">
                          <span>{message.publicMessageId}</span>
                          <strong>
                            {locale === 'ar'
                              ? `إلى ${message.recipient}`
                              : `to ${message.recipient}`}
                          </strong>
                        </div>
                        <div className="elite-customer-message-badges">
                          <StatusBadge tone={messageTone(message.status)}>
                            {translateCustomerEnum(locale, message.status)}
                          </StatusBadge>
                          <StatusBadge tone="info">
                            {message.instancePublicId}
                          </StatusBadge>
                        </div>
                      </div>
                      <p className="elite-customer-message-preview">
                        {getOutboundPreview(message, copy.noPreview)}
                      </p>
                      <div
                        className="elite-customer-message-progress"
                        aria-hidden="true"
                      >
                        <span
                          style={{
                            width: `${getStatusProgress(message.status)}%`,
                          }}
                        />
                      </div>
                      <div className="elite-customer-message-meta">
                        <span>
                          {locale === 'ar'
                            ? `النوع ${translateCustomerEnum(locale, message.messageType)}`
                            : `Type ${message.messageType}`}
                        </span>
                        <span>
                          {locale === 'ar'
                            ? `التأكيد ${translateCustomerEnum(locale, message.ack)}`
                            : `Ack ${message.ack}`}
                        </span>
                        <span>
                          {locale === 'ar'
                            ? `أُدرجت ${formatCustomerDate(locale, message.createdAt)}`
                            : `Queued ${formatCustomerDate(locale, message.createdAt)}`}
                        </span>
                        <span>
                          {locale === 'ar'
                            ? `مجدولة ${formatCustomerDate(locale, message.scheduledFor)}`
                            : `Scheduled ${formatCustomerDate(locale, message.scheduledFor)}`}
                        </span>
                        {message.sentAt ? (
                          <span>
                            {locale === 'ar'
                              ? `أُرسلت ${formatCustomerDate(locale, message.sentAt)}`
                              : `Sent ${formatCustomerDate(locale, message.sentAt)}`}
                          </span>
                        ) : null}
                        {message.acknowledgedAt ? (
                          <span>
                            {locale === 'ar'
                              ? `تم التأكيد ${formatCustomerDate(locale, message.acknowledgedAt)}`
                              : `Acked ${formatCustomerDate(locale, message.acknowledgedAt)}`}
                          </span>
                        ) : null}
                      </div>
                      {message.referenceId || message.errorMessage ? (
                        <div className="elite-customer-message-note">
                          {message.referenceId ? (
                            <span>
                              {locale === 'ar'
                                ? `المرجع ${message.referenceId}`
                                : `Reference ${message.referenceId}`}
                            </span>
                          ) : null}
                          {message.errorMessage ? (
                            <strong>{message.errorMessage}</strong>
                          ) : null}
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              )}
            </InfoCard>

            <InfoCard
              eyebrow={copy.inbound}
              title={
                locale === 'ar'
                  ? 'أحدث الرسائل الواردة'
                  : 'Recent inbound messages'
              }
              subtitle={copy.inboundSubtitle}
              className="elite-customer-messages-stream"
            >
              {inboundMessages.length === 0 ? (
                <div className="elite-customer-messages-empty">
                  <span aria-hidden="true">↙</span>
                  <p>{copy.inboundEmpty}</p>
                </div>
              ) : (
                <div className="elite-customer-messages-stack">
                  {inboundMessages.map((message) => (
                    <article
                      key={message.id}
                      className="elite-customer-message-card"
                      data-direction="inbound"
                    >
                      <div className="elite-customer-message-card-header">
                        <div
                          className="elite-customer-message-avatar"
                          aria-hidden="true"
                        >
                          {getMessageInitial(
                            message.pushName ?? message.sender,
                          )}
                        </div>
                        <div className="elite-customer-message-thread">
                          <span>{message.publicMessageId}</span>
                          <strong>
                            {locale === 'ar'
                              ? `من ${message.sender}`
                              : `from ${message.sender}`}
                          </strong>
                        </div>
                        <div className="elite-customer-message-badges">
                          <StatusBadge tone="info">
                            {message.instancePublicId}
                          </StatusBadge>
                          <StatusBadge tone="neutral">
                            {translateCustomerEnum(locale, message.kind)}
                          </StatusBadge>
                        </div>
                      </div>
                      <p className="elite-customer-message-preview">
                        {getInboundPreview(message, copy.noPreview)}
                      </p>
                      <div className="elite-customer-message-meta">
                        <span>
                          {locale === 'ar'
                            ? `تم الاستلام ${formatCustomerDate(locale, message.receivedAt)}`
                            : `Received ${formatCustomerDate(locale, message.receivedAt)}`}
                        </span>
                        {message.sentAt ? (
                          <span>
                            {locale === 'ar'
                              ? `أُرسلت ${formatCustomerDate(locale, message.sentAt)}`
                              : `Sent ${formatCustomerDate(locale, message.sentAt)}`}
                          </span>
                        ) : null}
                        <span>
                          {locale === 'ar'
                            ? `اسم الظهور ${message.pushName ?? 'غير معروف'}`
                            : `Push name ${message.pushName ?? 'Unknown'}`}
                        </span>
                        <span>
                          {locale === 'ar'
                            ? `المحادثة ${message.chatId ?? 'غير معروف'}`
                            : `Chat ${message.chatId ?? 'Unknown'}`}
                        </span>
                      </div>
                      {message.mediaUrl || message.mimeType ? (
                        <div className="elite-customer-message-note">
                          {message.mediaUrl ? (
                            <span>
                              {locale === 'ar'
                                ? `الوسائط ${message.mediaUrl}`
                                : `Media ${message.mediaUrl}`}
                            </span>
                          ) : null}
                          {message.mimeType ? (
                            <strong>{message.mimeType}</strong>
                          ) : null}
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              )}
            </InfoCard>
          </div>
        </>
      ) : null}

      {errorMessage ? (
        <NoticeBanner title={copy.apiIssue} tone="danger">
          <p style={{ margin: 0 }}>{errorMessage}</p>
        </NoticeBanner>
      ) : null}
    </AppShell>
  );
}
