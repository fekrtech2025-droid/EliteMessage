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
          allStatuses: 'كل الحالات',
          apiIssue: 'مشكلة في مستكشف الرسائل',
          backToDashboard: 'العودة إلى لوحة التحكم',
          dashboardLogin: 'العودة إلى تسجيل الدخول في لوحة التحكم',
          filters: 'الفلاتر',
          inbound: 'الواردة',
          inboundEmpty: 'لا توجد رسائل واردة تطابق النطاق المحدد.',
          instance: 'المثيل',
          loading: 'جارٍ تحميل مستكشف الرسائل',
          loadingMessage: 'يتم تحديث جلسة العميل وتحميل سجل الرسائل الأخير.',
          liveTraffic: 'الحركة المباشرة',
          messageScope: 'نطاق الرسائل',
          messages: 'الرسائل',
          pageSubtitle:
            'ابحث في أحدث الرسائل الصادرة والواردة عبر مساحة عمل العميل بدلًا من التقيد بصفحة تفاصيل مثيل واحدة.',
          pageTitle: 'رسائل العميل',
          recipientContains: 'المستلم يحتوي على',
          refreshExplorer: 'تحديث المستكشف',
          refreshTopbar: 'تحديث المستكشف',
          returnSignin: 'يجب تسجيل الدخول',
          sessionMissing: 'جلسة العميل مفقودة أو منتهية الصلاحية.',
          workspace: 'مساحة العمل',
        }
      : {
          allStatuses: 'All statuses',
          apiIssue: 'Message explorer issue',
          backToDashboard: 'Back to dashboard',
          dashboardLogin: 'Return to the dashboard login',
          filters: 'Filters',
          inbound: 'Inbound',
          inboundEmpty: 'No inbound messages matched the selected scope.',
          instance: 'Instance',
          loading: 'Loading message explorer',
          loadingMessage:
            'Refreshing the customer session and loading the recent message history.',
          liveTraffic: 'Live traffic',
          messageScope: 'Message scope',
          messages: 'Messages',
          pageSubtitle:
            'Search recent outbound and inbound traffic across the customer workspace instead of being locked into a single-instance detail page.',
          pageTitle: 'Customer Messages',
          recipientContains: 'Recipient contains',
          refreshExplorer: 'Refresh message explorer',
          refreshTopbar: 'Refresh explorer',
          returnSignin: 'Sign in required',
          sessionMissing: 'The customer session is missing or expired.',
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
          <InfoCard
            eyebrow={copy.filters}
            title={copy.messageScope}
            className="elite-sticky-panel"
          >
            <div style={{ display: 'grid', gap: 16 }}>
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
                  <option value="">
                    {locale === 'ar'
                      ? 'كل مثيلات مساحة العمل'
                      : 'All workspace instances'}
                  </option>
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
          </InfoCard>

          <InfoCard
            eyebrow={locale === 'ar' ? 'الصادرة' : 'Outbound'}
            title={
              locale === 'ar'
                ? 'أحدث الرسائل الصادرة'
                : 'Recent outbound messages'
            }
          >
            {outboundMessages.length === 0 ? (
              <p style={{ margin: 0 }}>
                {locale === 'ar'
                  ? 'لا توجد رسائل صادرة تطابق النطاق المحدد.'
                  : 'No outbound messages matched the selected scope.'}
              </p>
            ) : (
              <ul className="elite-list">
                {outboundMessages.map((message) => (
                  <li key={message.id} className="elite-list-item">
                    <div className="elite-list-title">
                      <span>
                        {locale === 'ar'
                          ? `${message.publicMessageId} إلى ${message.recipient}`
                          : `${message.publicMessageId} to ${message.recipient}`}
                      </span>
                      <StatusBadge tone={messageTone(message.status)}>
                        {translateCustomerEnum(locale, message.status)}
                      </StatusBadge>
                      <StatusBadge tone="info">
                        {message.instancePublicId}
                      </StatusBadge>
                    </div>
                    <div>
                      {message.body ??
                        message.caption ??
                        message.mediaUrl ??
                        (locale === 'ar' ? 'لا توجد معاينة' : 'No preview')}
                    </div>
                    <div className="elite-list-meta">
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
                          ? `أُدرجت في الطابور ${formatCustomerDate(locale, message.createdAt)}`
                          : `Queued ${formatCustomerDate(locale, message.createdAt)}`}
                      </span>
                      <span>
                        {locale === 'ar'
                          ? `مجدولة ${formatCustomerDate(locale, message.scheduledFor)}`
                          : `Scheduled ${formatCustomerDate(locale, message.scheduledFor)}`}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>

          <InfoCard
            eyebrow={copy.inbound}
            title={
              locale === 'ar'
                ? 'أحدث الرسائل الواردة'
                : 'Recent inbound messages'
            }
          >
            {inboundMessages.length === 0 ? (
              <p style={{ margin: 0 }}>{copy.inboundEmpty}</p>
            ) : (
              <ul className="elite-list">
                {inboundMessages.map((message) => (
                  <li key={message.id} className="elite-list-item">
                    <div className="elite-list-title">
                      <span>
                        {locale === 'ar'
                          ? `${message.publicMessageId} من ${message.sender}`
                          : `${message.publicMessageId} from ${message.sender}`}
                      </span>
                      <StatusBadge tone="info">
                        {message.instancePublicId}
                      </StatusBadge>
                      <StatusBadge tone="neutral">
                        {translateCustomerEnum(locale, message.kind)}
                      </StatusBadge>
                    </div>
                    <div>
                      {message.body ??
                        (locale === 'ar'
                          ? 'لا يوجد نص للرسالة'
                          : 'No text body')}
                    </div>
                    <div className="elite-list-meta">
                      <span>
                        {locale === 'ar'
                          ? `تم الاستلام ${formatCustomerDate(locale, message.receivedAt)}`
                          : `Received ${formatCustomerDate(locale, message.receivedAt)}`}
                      </span>
                      <span>
                        {locale === 'ar'
                          ? `اسم الظهور ${message.pushName ?? 'غير معروف'}`
                          : `Push name ${message.pushName ?? 'Unknown'}`}
                      </span>
                      <span>
                        {locale === 'ar'
                          ? `الوسائط ${message.mediaUrl ?? 'لا يوجد'}`
                          : `Media ${message.mediaUrl ?? 'None'}`}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>
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
