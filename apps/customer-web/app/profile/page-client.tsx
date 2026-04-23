'use client';

import Link from 'next/link';
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import type {
  AccountMeResponse,
  UpdateAccountProfileResponse,
} from '@elite-message/contracts';
import {
  ActionButton,
  AppShell,
  Field,
  InfoCard,
  MetricCard,
  MetricGrid,
  NoticeBanner,
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

function readCustomerProfileParam(key: string) {
  if (typeof window === 'undefined') {
    return '';
  }

  return new URLSearchParams(window.location.search).get(key) ?? '';
}

function getProfileInitial(account: AccountMeResponse | null) {
  return (
    (account?.user.displayName || account?.user.email || 'U')
      .trim()
      .charAt(0)
      .toUpperCase() || 'U'
  );
}

function buildWorkspaceRoleSummary(account: AccountMeResponse | null) {
  if (!account) {
    return {
      adminCount: 0,
      ownerCount: 0,
      readonlyCount: 0,
    };
  }

  return account.workspaces.reduce(
    (summary, workspace) => {
      if (workspace.role === 'owner') {
        summary.ownerCount += 1;
      } else if (workspace.role === 'admin') {
        summary.adminCount += 1;
      } else {
        summary.readonlyCount += 1;
      }

      return summary;
    },
    {
      adminCount: 0,
      ownerCount: 0,
      readonlyCount: 0,
    },
  );
}

export function CustomerProfilePage() {
  const { locale } = useCustomerLocale();
  const mountedRef = useRef(true);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountMeResponse | null>(null);
  const [workspaceId, setWorkspaceId] = useState(() =>
    readCustomerProfileParam('workspaceId'),
  );
  const [displayName, setDisplayName] = useState('');
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const copy =
    locale === 'ar'
      ? {
          accountIdentity: 'هوية الحساب',
          accountRole: 'دور الحساب',
          activeWorkspace: 'مساحة العمل النشطة',
          adminWorkspaces: 'إدارة',
          backToDashboard: 'العودة إلى لوحة التحكم',
          created: 'تاريخ الإنشاء',
          dashboardLogin: 'العودة إلى تسجيل الدخول في لوحة التحكم',
          displayName: 'الاسم الظاهر',
          email: 'البريد الإلكتروني',
          loading: 'جارٍ تحميل الملف الشخصي',
          loadingMessage:
            'يتم تحديث جلسة العميل وتحميل بيانات الحساب ومساحات العمل.',
          manageApiTokens: 'إدارة رموز API',
          messageSearch: 'بحث الرسائل',
          ownerWorkspaces: 'ملكية',
          pageSubtitle:
            'مركز ملف شخصي واضح لتحديث الاسم ومراجعة مساحات العمل والوصول إلى إعدادات الحساب.',
          pageTitle: 'الملف الشخصي',
          profile: 'الملف الشخصي',
          profileSaved: 'تم تحديث الملف الشخصي',
          readonlyWorkspaces: 'قراءة فقط',
          returnSignin: 'يجب تسجيل الدخول',
          saveProfile: 'حفظ الملف الشخصي',
          savingProfile: 'جارٍ حفظ الملف الشخصي...',
          securityNote:
            'البريد الإلكتروني ودور الحساب تتم إدارتهما بواسطة المنصة ولا يمكن تعديلهما من هنا.',
          sessionMissing: 'جلسة العميل مفقودة أو منتهية الصلاحية.',
          themePreference: 'تفضيل المظهر',
          updateFailed: 'تعذر تحديث ملف العميل الشخصي.',
          workspaceMemberships: 'عضويات مساحات العمل',
          workspaces: 'مساحات العمل',
        }
      : {
          accountIdentity: 'Account identity',
          accountRole: 'Account role',
          activeWorkspace: 'Active workspace',
          adminWorkspaces: 'Admin',
          backToDashboard: 'Back to dashboard',
          created: 'Created',
          dashboardLogin: 'Return to the dashboard login',
          displayName: 'Display name',
          email: 'Email',
          loading: 'Loading profile',
          loadingMessage:
            'Refreshing the customer session and loading account and workspace details.',
          manageApiTokens: 'Manage API tokens',
          messageSearch: 'Message search',
          ownerWorkspaces: 'Owner',
          pageSubtitle:
            'A focused profile center for updating your name, reviewing workspace access, and reaching account settings.',
          pageTitle: 'User Profile',
          profile: 'Profile',
          profileSaved: 'Profile updated',
          readonlyWorkspaces: 'Read-only',
          returnSignin: 'Sign in required',
          saveProfile: 'Save profile',
          savingProfile: 'Saving profile...',
          securityNote:
            'Email and account role are managed by the platform and cannot be edited here.',
          sessionMissing: 'Your customer session is missing or expired.',
          themePreference: 'Theme preference',
          updateFailed: 'Could not update the customer profile.',
          workspaceMemberships: 'Workspace memberships',
          workspaces: 'Workspaces',
        };

  const loadPage = useEffectEvent(async (token: string) => {
    const me = await loadCustomerAccount(token).catch(() => null);
    if (!me) {
      if (mountedRef.current) {
        setPageState('unauthenticated');
      }
      return false;
    }

    if (!mountedRef.current) {
      return false;
    }

    const nextWorkspaceId = me.workspaces[0]?.id ?? '';
    setAccessToken(token);
    setAccount(me);
    setDisplayName(me.user.displayName);
    setWorkspaceId((current) =>
      current && me.workspaces.some((workspace) => workspace.id === current)
        ? current
        : nextWorkspaceId,
    );
    setPageState('ready');
    return true;
  });

  useEffect(() => {
    mountedRef.current = true;
    void (async () => {
      try {
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
            error instanceof Error ? error.message : copy.updateFailed,
          );
        }
      }
    })();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittingProfile(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await requestWithCustomerRefresh(
        accessToken,
        (token) =>
          fetch(`${apiBaseUrl}/api/v1/account/me`, {
            method: 'PATCH',
            headers: {
              authorization: `Bearer ${token}`,
              'content-type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              displayName,
            }),
          }),
        setAccessToken,
      );

      if (!response) {
        setPageState('unauthenticated');
        return;
      }

      if (!response.ok) {
        setErrorMessage(copy.updateFailed);
        return;
      }

      const payload = (await response.json()) as UpdateAccountProfileResponse;
      if (!mountedRef.current) {
        return;
      }

      setAccount((current) =>
        current ? { ...current, user: payload.user } : current,
      );
      setDisplayName(payload.user.displayName);
      setStatusMessage(
        locale === 'ar'
          ? `تم حفظ التغيير في ${formatCustomerDate(locale, payload.updatedAt)}.`
          : `Saved at ${formatCustomerDate(locale, payload.updatedAt)}.`,
      );
    } finally {
      if (mountedRef.current) {
        setSubmittingProfile(false);
      }
    }
  }

  async function logout() {
    await logoutCustomerSession();
    if (mountedRef.current) {
      setPageState('unauthenticated');
      setAccessToken(null);
      setAccount(null);
    }
  }

  const selectedWorkspace =
    account?.workspaces.find((workspace) => workspace.id === workspaceId) ??
    account?.workspaces[0] ??
    null;
  const roleSummary = buildWorkspaceRoleSummary(account);
  const settingsHref = workspaceId
    ? `/settings?workspaceId=${encodeURIComponent(workspaceId)}&focus=tokens`
    : '/settings?focus=tokens';
  const messagesHref = workspaceId
    ? `/messages?workspaceId=${encodeURIComponent(workspaceId)}&focus=recipient`
    : '/messages?focus=recipient';

  return (
    <AppShell
      title={copy.pageTitle}
      subtitle={copy.pageSubtitle}
      breadcrumbLabel={copy.profile}
      surface="customer"
      density="compact"
      labels={getCustomerShellLabels(locale)}
      nav={
        pageState === 'ready' ? (
          <CustomerNav
            current="settings"
            account={account}
            workspaceId={workspaceId}
          />
        ) : undefined
      }
      meta={
        account ? (
          <CustomerTopbarAnnouncement
            eyebrow={copy.accountIdentity}
            message={
              locale === 'ar'
                ? 'يمكن الوصول إلى هذه الصفحة من قائمة الحساب في الشريط العلوي.'
                : 'This page is opened from the account dropdown in the topbar.'
            }
            linkLabel={copy.manageApiTokens}
            linkHref={settingsHref}
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
        <InfoCard eyebrow={copy.profile} title={copy.loading}>
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
          <section className="elite-customer-profile-hero">
            <div className="elite-customer-profile-identity">
              <span
                className="elite-customer-profile-avatar"
                aria-hidden="true"
              >
                {getProfileInitial(account)}
              </span>
              <div>
                <p>{copy.accountIdentity}</p>
                <h2>{account.user.displayName}</h2>
                <span>{account.user.email}</span>
              </div>
            </div>
            <div className="elite-customer-profile-access-card">
              <span>{copy.activeWorkspace}</span>
              <strong>{selectedWorkspace?.name ?? copy.workspaces}</strong>
              <p>
                {selectedWorkspace
                  ? `${translateCustomerEnum(locale, selectedWorkspace.role)} · ${selectedWorkspace.slug}`
                  : copy.securityNote}
              </p>
              <div>
                <Link href={messagesHref}>{copy.messageSearch}</Link>
                <Link href={settingsHref}>{copy.manageApiTokens}</Link>
              </div>
            </div>
          </section>

          <MetricGrid minItemWidth={150}>
            <MetricCard
              label={copy.workspaces}
              value={account.workspaces.length}
              hint={copy.workspaceMemberships}
              tone="info"
              emphasis="strong"
            />
            <MetricCard
              label={copy.ownerWorkspaces}
              value={roleSummary.ownerCount}
              hint={copy.workspaceMemberships}
              tone={roleSummary.ownerCount > 0 ? 'success' : 'neutral'}
            />
            <MetricCard
              label={copy.adminWorkspaces}
              value={roleSummary.adminCount}
              hint={copy.workspaceMemberships}
              tone={roleSummary.adminCount > 0 ? 'warning' : 'neutral'}
            />
            <MetricCard
              label={copy.readonlyWorkspaces}
              value={roleSummary.readonlyCount}
              hint={copy.workspaceMemberships}
              tone="neutral"
            />
          </MetricGrid>

          <section className="elite-customer-profile-layout">
            <InfoCard
              eyebrow={copy.profile}
              title={copy.accountIdentity}
              className="elite-customer-profile-card"
            >
              <form
                className="elite-customer-profile-form"
                onSubmit={updateProfile}
              >
                <Field label={copy.displayName}>
                  <TextInput
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    minLength={2}
                    maxLength={80}
                    required
                  />
                </Field>
                <Field label={copy.email} hint={copy.securityNote}>
                  <TextInput value={account.user.email} readOnly />
                </Field>
                <div className="elite-customer-profile-readonly-grid">
                  <div>
                    <span>{copy.accountRole}</span>
                    <strong>
                      {translateCustomerEnum(locale, account.user.role)}
                    </strong>
                  </div>
                  <div>
                    <span>{copy.created}</span>
                    <strong>
                      {formatCustomerDate(locale, account.user.createdAt)}
                    </strong>
                  </div>
                  <div>
                    <span>{copy.themePreference}</span>
                    <strong>
                      {translateCustomerEnum(locale, account.themePreference)}
                    </strong>
                  </div>
                </div>
                <ActionButton type="submit" disabled={submittingProfile}>
                  {submittingProfile ? copy.savingProfile : copy.saveProfile}
                </ActionButton>
              </form>
            </InfoCard>

            <InfoCard
              eyebrow={copy.workspaces}
              title={copy.workspaceMemberships}
              className="elite-customer-profile-card"
            >
              <div className="elite-customer-profile-workspace-list">
                {account.workspaces.map((workspace) => (
                  <button
                    key={workspace.id}
                    type="button"
                    className="elite-customer-profile-workspace-item"
                    data-active={workspace.id === selectedWorkspace?.id}
                    onClick={() => setWorkspaceId(workspace.id)}
                  >
                    <span>
                      <strong>{workspace.name}</strong>
                      <small>{workspace.slug}</small>
                    </span>
                    <StatusBadge
                      tone={workspace.role === 'owner' ? 'success' : 'info'}
                    >
                      {translateCustomerEnum(locale, workspace.role)}
                    </StatusBadge>
                  </button>
                ))}
              </div>
            </InfoCard>
          </section>
        </>
      ) : null}

      {statusMessage ? (
        <NoticeBanner title={copy.profileSaved} tone="success">
          <p style={{ margin: 0 }}>{statusMessage}</p>
        </NoticeBanner>
      ) : null}

      {errorMessage ? (
        <NoticeBanner title={copy.profile} tone="danger">
          <p style={{ margin: 0 }}>{errorMessage}</p>
        </NoticeBanner>
      ) : null}
    </AppShell>
  );
}
