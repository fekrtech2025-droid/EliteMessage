'use client';

import Link from 'next/link';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type {
  AccountMeResponse,
  ListInboundMessagesResponse,
  ListOutboundMessagesResponse,
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
  TextInput,
} from '@elite-message/ui';
import { useCustomerLocale } from '../components/customer-localization';
import { CustomerNav } from '../components/customer-nav';
import {
  CustomerTopbarAnnouncement,
  CustomerWorkspaceControls,
} from '../components/customer-workspace-chrome';
import {
  buildCustomerContacts,
  buildCustomerConversationEvents,
  buildCustomerConversations,
  getCustomerContactInitial,
  type CustomerContact,
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
import { apiBaseUrl, readStoredToken } from '../lib/session';

type PageState = 'loading' | 'unauthenticated' | 'ready';

function readContactFilterParam(key: string) {
  if (typeof window === 'undefined') {
    return '';
  }

  return new URLSearchParams(window.location.search).get(key) ?? '';
}

function filterContacts(contacts: CustomerContact[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return contacts;
  }

  return contacts.filter((contact) =>
    [
      contact.label,
      contact.address,
      contact.lastPreview,
      contact.instancePublicIds.join(' '),
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

function buildConversationHref(workspaceId: string, contact: CustomerContact) {
  const params = new URLSearchParams();
  if (workspaceId) {
    params.set('workspaceId', workspaceId);
  }
  params.set('to', contact.address);

  return `/messages?${params.toString()}`;
}

export function CustomerContactsPage() {
  const { locale } = useCustomerLocale();
  const mountedRef = useRef(true);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountMeResponse | null>(null);
  const [workspaceId, setWorkspaceId] = useState(() =>
    readContactFilterParam('workspaceId'),
  );
  const [search, setSearch] = useState(() => readContactFilterParam('q'));
  const [outboundMessages, setOutboundMessages] = useState<
    ListOutboundMessagesResponse['items']
  >([]);
  const [inboundMessages, setInboundMessages] = useState<
    ListInboundMessagesResponse['items']
  >([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const copy =
    locale === 'ar'
      ? {
          backToDashboard: 'العودة إلى لوحة التحكم',
          contacts: 'جهات الاتصال',
          contactDirectory: 'دليل جهات الاتصال',
          contactEmpty: 'لا توجد جهات اتصال ضمن هذا النطاق.',
          conversationCount: 'المحادثات',
          dashboardLogin: 'العودة إلى تسجيل الدخول في لوحة التحكم',
          discoveredFromTraffic:
            'جهات الاتصال هنا مكتشفة من آخر الرسائل الواردة والصادرة.',
          failedSends: 'إرسال فاشل',
          inbound: 'وارد',
          loading: 'جارٍ تحميل جهات الاتصال',
          loadingMessage:
            'يتم تحديث جلسة العميل وبناء دليل جهات الاتصال من المحادثات الأخيرة.',
          messageHistory: 'سجل المحادثة',
          noPreview: 'لا توجد معاينة',
          openConversation: 'فتح المحادثة',
          outbound: 'صادر',
          pageSubtitle:
            'دليل جهات اتصال شبيه بتلغرام يعرض الأشخاص والأرقام ومثيلات واتساب المرتبطة.',
          pageTitle: 'جهات اتصال العميل',
          refreshContacts: 'تحديث جهات الاتصال',
          returnSignin: 'يجب تسجيل الدخول',
          search: 'بحث جهات الاتصال',
          searchPlaceholder: 'ابحث برقم أو اسم أو آخر رسالة',
          sessionMissing: 'جلسة العميل مفقودة أو منتهية الصلاحية.',
          totalMessages: 'الرسائل',
          workspace: 'مساحة العمل',
        }
      : {
          backToDashboard: 'Back to dashboard',
          contacts: 'Contacts',
          contactDirectory: 'Contact directory',
          contactEmpty: 'No contacts were found inside this scope.',
          conversationCount: 'Conversations',
          dashboardLogin: 'Return to the dashboard login',
          discoveredFromTraffic:
            'Contacts are discovered from recent inbound and outbound traffic.',
          failedSends: 'Failed sends',
          inbound: 'Inbound',
          loading: 'Loading contacts',
          loadingMessage:
            'Refreshing the customer session and building the contact directory from recent conversations.',
          messageHistory: 'Conversation history',
          noPreview: 'No preview available',
          openConversation: 'Open conversation',
          outbound: 'Outbound',
          pageSubtitle:
            'A Telegram-style contact directory for people, numbers, and linked WhatsApp instances.',
          pageTitle: 'Customer Contacts',
          refreshContacts: 'Refresh contacts',
          returnSignin: 'Sign in required',
          search: 'Search contacts',
          searchPlaceholder: 'Search by number, name, or latest message',
          sessionMissing: 'The customer session is missing or expired.',
          totalMessages: 'Messages',
          workspace: 'Workspace',
        };

  function handleContactsLoadFailure(message: string) {
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
      handleContactsLoadFailure(
        locale === 'ar'
          ? 'تعذر الوصول إلى API الخاص بالعميل.'
          : 'Could not reach the customer API.',
      );
      return false;
    }

    if (!instanceResponse.ok) {
      handleContactsLoadFailure(
        locale === 'ar'
          ? 'تعذر تحميل جهات الاتصال.'
          : 'Could not load customer contacts.',
      );
      return false;
    }

    if (!mountedRef.current) {
      return false;
    }

    setAccessToken(token);
    setAccount(me);
    setWorkspaceId((current) =>
      current && me.workspaces.some((workspace) => workspace.id === current)
        ? current
        : (me.workspaces[0]?.id ?? ''),
    );
    setPageState('ready');
    return true;
  });

  const loadTraffic = useEffectEvent(async (tokenOverride?: string | null) => {
    if (mountedRef.current) {
      setErrorMessage(null);
    }

    const outboundQuery = new URLSearchParams();
    if (workspaceId) {
      outboundQuery.set('workspaceId', workspaceId);
    }
    outboundQuery.set('limit', '150');

    const inboundQuery = new URLSearchParams();
    if (workspaceId) {
      inboundQuery.set('workspaceId', workspaceId);
    }
    inboundQuery.set('limit', '150');

    const token = tokenOverride ?? accessToken;
    const [outboundResponse, inboundResponse] = await Promise.all([
      requestWithCustomerRefresh(
        token,
        (bearer) =>
          fetch(
            `${apiBaseUrl}/api/v1/customer/messages?${outboundQuery.toString()}`,
            {
              headers: {
                authorization: `Bearer ${bearer}`,
              },
              credentials: 'include',
            },
          ),
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
      handleContactsLoadFailure(
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
            ? 'تعذر تحميل جهات الاتصال.'
            : 'Could not load customer contacts.',
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
    setOutboundMessages([]);
    setInboundMessages([]);
    setSelectedContactId(null);
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
                ? 'تعذر تحميل جهات الاتصال.'
                : 'Could not load customer contacts.',
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

    void loadTraffic();
  }, [pageState, workspaceId]);

  useEffect(() => {
    if (pageState !== 'ready' || typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams();
    if (workspaceId) {
      params.set('workspaceId', workspaceId);
    }
    if (search.trim()) {
      params.set('q', search.trim());
    }

    const nextSearch = params.toString();
    const nextUrl = nextSearch
      ? `${window.location.pathname}?${nextSearch}`
      : window.location.pathname;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (nextUrl !== currentUrl) {
      window.history.replaceState({}, '', nextUrl);
    }
  }, [pageState, search, workspaceId]);

  const selectedWorkspace = account?.workspaces.find(
    (workspace) => workspace.id === workspaceId,
  );
  const events = buildCustomerConversationEvents({
    outboundMessages,
    inboundMessages,
    emptyPreviewLabel: copy.noPreview,
  });
  const conversations = buildCustomerConversations(events);
  const contacts = buildCustomerContacts(conversations);
  const filteredContacts = filterContacts(contacts, search);
  const activeContact =
    filteredContacts.find((contact) => contact.id === selectedContactId) ??
    filteredContacts[0] ??
    null;
  const filteredContactIdsKey = filteredContacts
    .map((contact) => contact.id)
    .join('|');
  const totalInbound = filteredContacts.reduce(
    (total, contact) => total + contact.inboundCount,
    0,
  );
  const totalOutbound = filteredContacts.reduce(
    (total, contact) => total + contact.outboundCount,
    0,
  );
  const totalFailed = filteredContacts.reduce(
    (total, contact) => total + contact.failedCount,
    0,
  );

  useEffect(() => {
    if (pageState !== 'ready') {
      return;
    }

    if (filteredContacts.length === 0) {
      if (selectedContactId) {
        setSelectedContactId(null);
      }
      return;
    }

    const firstContact = filteredContacts[0];
    if (!firstContact) {
      return;
    }

    if (
      !selectedContactId ||
      !filteredContacts.some((contact) => contact.id === selectedContactId)
    ) {
      setSelectedContactId(firstContact.id);
    }
  }, [filteredContactIdsKey, filteredContacts, pageState, selectedContactId]);

  return (
    <AppShell
      title={copy.pageTitle}
      subtitle={copy.pageSubtitle}
      breadcrumbLabel={copy.contacts}
      surface="customer"
      density="compact"
      labels={getCustomerShellLabels(locale)}
      nav={
        pageState === 'ready' ? (
          <CustomerNav
            current="contacts"
            account={account}
            workspaceId={workspaceId}
          />
        ) : undefined
      }
      meta={
        account ? (
          <CustomerTopbarAnnouncement
            eyebrow={copy.contactDirectory}
            message={copy.discoveredFromTraffic}
            linkLabel={copy.refreshContacts}
            linkHref="/contacts"
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
        <InfoCard eyebrow={copy.contacts} title={copy.loading}>
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
          <section className="elite-customer-contacts-hero">
            <div>
              <p className="elite-customer-conversations-kicker">
                {copy.contactDirectory}
              </p>
              <h2>{copy.pageTitle}</h2>
              <p>{copy.discoveredFromTraffic}</p>
            </div>
            <div className="elite-customer-contacts-search-card">
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
              <Field label={copy.search}>
                <TextInput
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={copy.searchPlaceholder}
                />
              </Field>
              <ActionButton
                type="button"
                tone="secondary"
                onClick={() => void loadTraffic()}
              >
                {copy.refreshContacts}
              </ActionButton>
            </div>
          </section>

          <MetricGrid minItemWidth={150}>
            <MetricCard
              label={copy.contacts}
              value={filteredContacts.length}
              hint={selectedWorkspace?.name ?? copy.workspace}
              tone="info"
              emphasis="strong"
            />
            <MetricCard
              label={copy.messageHistory}
              value={totalInbound + totalOutbound}
              hint={copy.totalMessages}
              tone="info"
            />
            <MetricCard
              label={copy.inbound}
              value={totalInbound}
              hint={copy.totalMessages}
              tone="success"
            />
            <MetricCard
              label={copy.outbound}
              value={totalOutbound}
              hint={copy.totalMessages}
              tone="info"
            />
            <MetricCard
              label={copy.failedSends}
              value={totalFailed}
              hint={copy.outbound}
              tone={totalFailed > 0 ? 'danger' : 'neutral'}
            />
          </MetricGrid>

          {errorMessage ? (
            <NoticeBanner title={copy.contacts} tone="danger">
              <p style={{ margin: 0 }}>{errorMessage}</p>
            </NoticeBanner>
          ) : null}

          <section className="elite-customer-contacts-shell">
            <aside
              className="elite-customer-contact-list"
              aria-label={copy.contacts}
            >
              {filteredContacts.length === 0 ? (
                <div className="elite-customer-conversations-empty">
                  <span aria-hidden="true">#</span>
                  <p>{copy.contactEmpty}</p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    type="button"
                    className="elite-customer-contact-item"
                    data-active={
                      activeContact?.id === contact.id ? 'true' : 'false'
                    }
                    onClick={() => setSelectedContactId(contact.id)}
                  >
                    <span
                      className="elite-customer-conversation-avatar"
                      aria-hidden="true"
                    >
                      {getCustomerContactInitial(contact.label)}
                    </span>
                    <span className="elite-customer-conversation-copy">
                      <strong>{contact.label}</strong>
                      <span>{contact.address}</span>
                    </span>
                    <span className="elite-customer-conversation-meta">
                      <time>
                        {formatCustomerDate(locale, contact.lastActivityAt)}
                      </time>
                    </span>
                  </button>
                ))
              )}
            </aside>

            <div className="elite-customer-contact-profile">
              {activeContact ? (
                <>
                  <div className="elite-customer-contact-profile-hero">
                    <span
                      className="elite-customer-contact-profile-avatar"
                      aria-hidden="true"
                    >
                      {getCustomerContactInitial(activeContact.label)}
                    </span>
                    <div>
                      <p>{copy.contacts}</p>
                      <h2>{activeContact.label}</h2>
                      <span>{activeContact.address}</span>
                    </div>
                  </div>
                  <div className="elite-customer-contact-profile-grid">
                    <div>
                      <span>{copy.inbound}</span>
                      <strong>{activeContact.inboundCount}</strong>
                    </div>
                    <div>
                      <span>{copy.outbound}</span>
                      <strong>{activeContact.outboundCount}</strong>
                    </div>
                    <div>
                      <span>{copy.conversationCount}</span>
                      <strong>{activeContact.conversationIds.length}</strong>
                    </div>
                    <div>
                      <span>{copy.failedSends}</span>
                      <strong>{activeContact.failedCount}</strong>
                    </div>
                  </div>
                  <div className="elite-customer-contact-profile-details">
                    <span>{activeContact.lastPreview}</span>
                    <span>
                      {formatCustomerDate(locale, activeContact.lastActivityAt)}
                    </span>
                    <span>{activeContact.instancePublicIds.join(', ')}</span>
                  </div>
                  <Link
                    className="elite-customer-contact-open-link"
                    href={buildConversationHref(workspaceId, activeContact)}
                  >
                    {copy.openConversation}
                  </Link>
                </>
              ) : (
                <div className="elite-customer-conversations-empty">
                  <span aria-hidden="true">...</span>
                  <p>{copy.contactEmpty}</p>
                </div>
              )}
            </div>
          </section>
        </>
      ) : null}
    </AppShell>
  );
}
