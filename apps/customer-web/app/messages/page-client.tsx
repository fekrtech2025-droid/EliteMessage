'use client';

import Link from 'next/link';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type {
  AccountMeResponse,
  ListCustomerInstancesResponse,
  ListInboundMessagesResponse,
  ListOutboundMessagesResponse,
  MessageStatus,
} from '@elite-message/contracts';
import {
  ActionButton,
  AppShell,
  Field,
  InfoCard,
  LoadingState,
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
  buildCustomerConversationEvents,
  buildCustomerConversations,
  buildCustomerContacts,
  filterCustomerConversations,
  getCustomerConversationEventDeliveryView,
  getCustomerContactInitial,
  type CustomerConversation,
  type CustomerConversationEvent,
} from '../lib/customer-conversations';
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
import { formatCustomerSafeRuntimeText } from '../lib/customer-runtime-errors';
import { apiBaseUrl, readStoredToken } from '../lib/session';

type PageState = 'loading' | 'unauthenticated' | 'ready';

const customerConversationStatuses: Array<MessageStatus | 'all'> = [
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
    case 'unsent':
      return 'danger' as const;
    default:
      return 'neutral' as const;
  }
}

function directionTone(direction: CustomerConversationEvent['direction']) {
  return direction === 'inbound' ? ('info' as const) : ('success' as const);
}

function countOutboundStatus(
  conversations: CustomerConversation[],
  status: MessageStatus,
) {
  return conversations.reduce(
    (total, conversation) =>
      total +
      conversation.events.filter(
        (event) => event.direction === 'outbound' && event.status === status,
      ).length,
    0,
  );
}

function readCustomerMessageFilterParam(key: string) {
  if (typeof window === 'undefined') {
    return '';
  }

  return new URLSearchParams(window.location.search).get(key) ?? '';
}

function readCustomerMessageStatusParam() {
  const status = readCustomerMessageFilterParam('status');
  return customerConversationStatuses.includes(status as MessageStatus | 'all')
    ? (status as MessageStatus | 'all')
    : 'all';
}

function readCustomerMessageFocusParam() {
  return readCustomerMessageFilterParam('focus');
}

function buildContactsHref(workspaceId: string, query: string) {
  const params = new URLSearchParams();
  if (workspaceId) {
    params.set('workspaceId', workspaceId);
  }
  if (query.trim()) {
    params.set('q', query.trim());
  }

  const search = params.toString();
  return search ? `/contacts?${search}` : '/contacts';
}

function buildInstanceHref(instanceId: string) {
  return `/instances/${instanceId}`;
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
    ListOutboundMessagesResponse['items']
  >([]);
  const [inboundMessages, setInboundMessages] = useState<
    ListInboundMessagesResponse['items']
  >([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const copy =
    locale === 'ar'
      ? {
          activeConversation: 'المحادثة النشطة',
          allStatuses: 'كل الحالات',
          backToDashboard: 'العودة إلى لوحة التحكم',
          clearFilters: 'مسح الفلاتر',
          contacts: 'جهات الاتصال',
          conversationEmpty: 'لا توجد محادثات تطابق النطاق المحدد.',
          conversationInbox: 'صندوق المحادثات',
          conversations: 'المحادثات',
          dashboardLogin: 'العودة إلى تسجيل الدخول في لوحة التحكم',
          discoveredContacts: 'جهات مكتشفة',
          failedSends: 'إرسال فاشل',
          filters: 'الفلاتر',
          inbound: 'وارد',
          instance: 'المثيل',
          loading: 'جارٍ تحميل المحادثات',
          loadingMessage:
            'يتم تحديث جلسة العميل وتحميل أحدث المحادثات وجهات الاتصال.',
          manageContacts: 'إدارة جهات الاتصال',
          messageScope: 'نطاق الرسائل',
          noPreview: 'لا توجد معاينة',
          openInstance: 'فتح المثيل',
          outbound: 'صادر',
          pageSubtitle:
            'تعامل مع الرسائل كخيوط محادثة شبيهة بتلغرام بدل قائمة سجلات منفصلة.',
          pageTitle: 'محادثات العميل',
          queued: 'في الطابور',
          recipientContains: 'المستلم يحتوي على',
          refreshExplorer: 'تحديث المحادثات',
          refreshTopbar: 'تحديث',
          returnSignin: 'يجب تسجيل الدخول',
          scopeAllInstances: 'كل مثيلات مساحة العمل',
          searchPlaceholder: 'ابحث برقم أو اسم أو آخر رسالة',
          sessionMissing: 'جلسة العميل مفقودة أو منتهية الصلاحية.',
          statusQuickFilter: 'فلتر الحالة السريع',
          threadReady:
            'اختر محادثة من القائمة لمراجعة السياق الكامل والرسائل الفاشلة.',
          workspace: 'مساحة العمل',
        }
      : {
          activeConversation: 'Active conversation',
          allStatuses: 'All statuses',
          backToDashboard: 'Back to dashboard',
          clearFilters: 'Clear filters',
          contacts: 'Contacts',
          conversationEmpty: 'No conversations matched the selected scope.',
          conversationInbox: 'Conversation inbox',
          conversations: 'Conversations',
          dashboardLogin: 'Return to the dashboard login',
          discoveredContacts: 'Discovered contacts',
          failedSends: 'Failed sends',
          filters: 'Filters',
          inbound: 'Inbound',
          instance: 'Instance',
          loading: 'Loading conversations',
          loadingMessage:
            'Refreshing the customer session and loading recent conversations and contacts.',
          manageContacts: 'Manage contacts',
          messageScope: 'Message scope',
          noPreview: 'No preview available',
          openInstance: 'Open instance',
          outbound: 'Outbound',
          pageSubtitle:
            'Manage customer traffic as Telegram-style conversation threads instead of separate message logs.',
          pageTitle: 'Customer Conversations',
          queued: 'Queued',
          recipientContains: 'Recipient contains',
          refreshExplorer: 'Refresh conversations',
          refreshTopbar: 'Refresh',
          returnSignin: 'Sign in required',
          scopeAllInstances: 'All workspace instances',
          searchPlaceholder: 'Search by number, name, or latest message',
          sessionMissing: 'The customer session is missing or expired.',
          statusQuickFilter: 'Quick status filter',
          threadReady:
            'Choose a conversation from the list to review context and failed sends.',
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
          ? 'تعذر تحميل محادثات العميل.'
          : 'Could not load the customer conversations.',
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
    query.set('limit', '100');

    const inboundQuery = new URLSearchParams();
    if (targetWorkspaceId) {
      inboundQuery.set('workspaceId', targetWorkspaceId);
    }
    if (targetInstanceId) {
      inboundQuery.set('instanceId', targetInstanceId);
    }
    inboundQuery.set('limit', '100');

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
            ? 'تعذر تحميل محادثات العميل.'
            : 'Could not load the customer conversations.',
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
    setSelectedConversationId(null);
    setErrorMessage(null);
  }

  function clearMessageFilters() {
    setInstanceId('');
    setStatusFilter('all');
    setRecipientFilter('');
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
                ? 'تعذر تحميل محادثات العميل.'
                : 'Could not load the customer conversations.',
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
  const allConversationEvents = buildCustomerConversationEvents({
    outboundMessages,
    inboundMessages,
    emptyPreviewLabel: copy.noPreview,
  });
  const allConversations = buildCustomerConversations(allConversationEvents);
  const conversations = filterCustomerConversations(allConversations, {
    query: recipientFilter,
    status: statusFilter,
  });
  const contacts = buildCustomerContacts(allConversations);
  const activeConversation =
    conversations.find(
      (conversation) => conversation.id === selectedConversationId,
    ) ??
    conversations[0] ??
    null;
  const conversationIdsKey = conversations
    .map((conversation) => conversation.id)
    .join('|');
  const activeFilterCount = [
    instanceId.trim(),
    statusFilter !== 'all' ? statusFilter : '',
    recipientFilter.trim(),
  ].filter(Boolean).length;
  const queuedCount = countOutboundStatus(allConversations, 'queue');
  const sentCount = countOutboundStatus(allConversations, 'sent');
  const failedCount =
    countOutboundStatus(allConversations, 'unsent') +
    countOutboundStatus(allConversations, 'invalid') +
    countOutboundStatus(allConversations, 'expired');

  useEffect(() => {
    if (pageState !== 'ready') {
      return;
    }

    if (conversations.length === 0) {
      if (selectedConversationId) {
        setSelectedConversationId(null);
      }
      return;
    }

    const firstConversation = conversations[0];
    if (!firstConversation) {
      return;
    }

    if (
      !selectedConversationId ||
      !conversations.some(
        (conversation) => conversation.id === selectedConversationId,
      )
    ) {
      setSelectedConversationId(firstConversation.id);
    }
  }, [conversationIdsKey, conversations, pageState, selectedConversationId]);

  return (
    <AppShell
      title={copy.pageTitle}
      subtitle={copy.pageSubtitle}
      breadcrumbLabel={copy.conversations}
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
            eyebrow={copy.conversationInbox}
            message={
              locale === 'ar'
                ? 'راجع المحادثات وجهات الاتصال من مكان واحد.'
                : 'Review conversations and contacts from one place.'
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
        <LoadingState title={copy.loading} description={copy.loadingMessage} />
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
            className="elite-customer-conversations-hero"
            aria-labelledby="customer-conversations-title"
          >
            <div>
              <p className="elite-customer-conversations-kicker">
                {copy.conversationInbox}
              </p>
              <h2 id="customer-conversations-title">{copy.pageTitle}</h2>
              <p>{copy.pageSubtitle}</p>
              <div className="elite-customer-conversations-scope">
                <span>{selectedWorkspaceLabel}</span>
                <span>{selectedInstanceLabel}</span>
                <span>{selectedStatusLabel}</span>
              </div>
            </div>
            <div className="elite-customer-conversations-hero-card">
              <strong>{conversations.length}</strong>
              <span>{copy.conversations}</span>
              <Link href={buildContactsHref(workspaceId, recipientFilter)}>
                {copy.manageContacts}
              </Link>
            </div>
          </section>

          <MetricGrid minItemWidth={150}>
            <MetricCard
              label={copy.conversations}
              value={conversations.length}
              hint={`${allConversationEvents.length} events`}
              tone="info"
              emphasis="strong"
            />
            <MetricCard
              label={copy.contacts}
              value={contacts.length}
              hint={copy.discoveredContacts}
              tone="info"
            />
            <MetricCard
              label={copy.queued}
              value={queuedCount}
              hint={copy.outbound}
              tone={queuedCount > 0 ? 'warning' : 'neutral'}
            />
            <MetricCard
              label={copy.outbound}
              value={sentCount}
              hint={translateCustomerEnum(locale, 'sent')}
              tone="success"
            />
            <MetricCard
              label={copy.failedSends}
              value={failedCount}
              hint={copy.outbound}
              tone={failedCount > 0 ? 'danger' : 'neutral'}
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
                  {customerConversationStatuses.map((status) => (
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
                  placeholder={copy.searchPlaceholder}
                />
              </Field>
              <div className="elite-customer-messages-filter-actions">
                <ActionButton
                  type="button"
                  tone="secondary"
                  onClick={() => void loadMessages()}
                >
                  {copy.refreshExplorer}
                </ActionButton>
                <ActionButton
                  type="button"
                  tone="ghost"
                  onClick={clearMessageFilters}
                  disabled={activeFilterCount === 0}
                >
                  {copy.clearFilters}
                </ActionButton>
              </div>
            </div>
            <div
              className="elite-customer-messages-quick-filter"
              role="group"
              aria-label={copy.statusQuickFilter}
            >
              <span>{copy.statusQuickFilter}</span>
              {customerConversationStatuses.map((status) => (
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

          {errorMessage ? (
            <NoticeBanner title={copy.conversationInbox} tone="danger">
              <p style={{ margin: 0 }}>{errorMessage}</p>
            </NoticeBanner>
          ) : null}

          <section className="elite-customer-conversations-shell">
            <aside
              className="elite-customer-conversations-list"
              aria-label={copy.conversations}
            >
              <div className="elite-customer-conversations-list-header">
                <div>
                  <span>{copy.conversations}</span>
                  <strong>{conversations.length}</strong>
                </div>
                <Link href={buildContactsHref(workspaceId, recipientFilter)}>
                  {copy.contacts}
                </Link>
              </div>
              {conversations.length === 0 ? (
                <div className="elite-customer-conversations-empty">
                  <span aria-hidden="true">#</span>
                  <p>{copy.conversationEmpty}</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    className="elite-customer-conversation-item"
                    data-active={
                      activeConversation?.id === conversation.id
                        ? 'true'
                        : 'false'
                    }
                    onClick={() => setSelectedConversationId(conversation.id)}
                  >
                    <span
                      className="elite-customer-conversation-avatar"
                      aria-hidden="true"
                    >
                      {getCustomerContactInitial(conversation.contactLabel)}
                    </span>
                    <span className="elite-customer-conversation-copy">
                      <strong>{conversation.contactLabel}</strong>
                      <span>{conversation.lastPreview}</span>
                    </span>
                    <span className="elite-customer-conversation-meta">
                      <time>
                        {formatCustomerDate(
                          locale,
                          conversation.lastActivityAt,
                        )}
                      </time>
                      {conversation.failedCount > 0 ? (
                        <StatusBadge tone="danger">
                          {conversation.failedCount}
                        </StatusBadge>
                      ) : conversation.queuedCount > 0 ? (
                        <StatusBadge tone="warning">
                          {conversation.queuedCount}
                        </StatusBadge>
                      ) : null}
                    </span>
                  </button>
                ))
              )}
            </aside>

            <div
              className="elite-customer-conversation-pane"
              aria-label={copy.activeConversation}
            >
              {activeConversation ? (
                <>
                  <header className="elite-customer-chat-header">
                    <span
                      className="elite-customer-chat-header-avatar"
                      aria-hidden="true"
                    >
                      {getCustomerContactInitial(
                        activeConversation.contactLabel,
                      )}
                    </span>
                    <div>
                      <strong>{activeConversation.contactLabel}</strong>
                      <span>
                        {activeConversation.contactId} ·{' '}
                        {activeConversation.instancePublicId}
                      </span>
                    </div>
                    <Link
                      href={buildInstanceHref(activeConversation.instanceId)}
                    >
                      {copy.openInstance}
                    </Link>
                  </header>

                  <div className="elite-customer-chat-thread">
                    {activeConversation.events.map((event) => {
                      const deliveryView =
                        getCustomerConversationEventDeliveryView(event, locale);

                      return (
                        <article
                          key={event.id}
                          className="elite-customer-chat-bubble"
                          data-direction={event.direction}
                          data-status={event.status ?? 'received'}
                        >
                          <p>{event.preview}</p>
                          {event.errorMessage ? (
                            <strong>
                              {formatCustomerSafeRuntimeText(
                                event.errorMessage,
                                locale,
                              )}
                            </strong>
                          ) : null}
                          <div className="elite-customer-chat-bubble-meta">
                            <StatusBadge
                              tone={
                                deliveryView?.tone ??
                                (event.status
                                  ? messageTone(event.status)
                                  : directionTone(event.direction))
                              }
                            >
                              {deliveryView?.label ??
                                (event.status
                                  ? translateCustomerEnum(locale, event.status)
                                  : event.direction === 'inbound'
                                    ? copy.inbound
                                    : copy.outbound)}
                            </StatusBadge>
                            <span>{event.kind}</span>
                            {deliveryView?.showAck && event.ack ? (
                              <span>
                                {translateCustomerEnum(locale, event.ack)}
                              </span>
                            ) : null}
                            <time>
                              {formatCustomerDate(locale, event.timestamp)}
                            </time>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="elite-customer-conversations-empty">
                  <span aria-hidden="true">...</span>
                  <p>{copy.threadReady}</p>
                </div>
              )}
            </div>
          </section>
        </>
      ) : null}
    </AppShell>
  );
}
