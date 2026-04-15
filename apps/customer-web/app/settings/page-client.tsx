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
  AccountApiTokenSummary,
  AccountMeResponse,
  CreateAccountApiTokenResponse,
  ListAccountApiTokensResponse,
  UpdateAccountProfileResponse,
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

function readCustomerSettingsParam(key: string) {
  if (typeof window === 'undefined') {
    return '';
  }

  return new URLSearchParams(window.location.search).get(key) ?? '';
}

type PageState = 'loading' | 'unauthenticated' | 'ready';

export function CustomerSettingsPage() {
  const { locale } = useCustomerLocale();
  const mountedRef = useRef(true);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountMeResponse | null>(null);
  const [workspaceId, setWorkspaceId] = useState(() =>
    readCustomerSettingsParam('workspaceId'),
  );
  const [focusTarget] = useState(() => readCustomerSettingsParam('focus'));
  const [displayName, setDisplayName] = useState('');
  const [accountTokenName, setAccountTokenName] = useState(() =>
    locale === 'ar' ? 'رمز مساحة العمل الأساسي' : 'Primary workspace token',
  );
  const [accountApiTokens, setAccountApiTokens] = useState<
    AccountApiTokenSummary[]
  >([]);
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [tokenSubmitting, setTokenSubmitting] = useState<string | null>(null);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const copy =
    locale === 'ar'
      ? {
          accountApiTokens: 'رموز API الخاصة بالحساب',
          backToDashboard: 'العودة إلى لوحة التحكم',
          createAccountApiToken: 'إنشاء رمز API للحساب',
          creatingToken: 'جارٍ إنشاء الرمز...',
          dashboardLogin: 'العودة إلى تسجيل الدخول في لوحة التحكم',
          displayName: 'الاسم الظاهر',
          email: 'البريد الإلكتروني',
          loadingAccount: 'جارٍ تحميل حساب العميل',
          loadingMessage:
            'يتم تحديث الجلسة وتحميل الإعدادات الخاصة بمساحة العمل.',
          noTokens: 'لم يتم إنشاء أي رموز API لهذا الحساب في مساحة العمل بعد.',
          openTokens: 'افتح الرموز',
          plainTokenTitle: 'قيمة الرمز الكاملة',
          plainTokenMessage:
            'تظهر هذه القيمة مرة واحدة فقط. قم بالتدوير إذا فقدتها.',
          profile: 'الملف الشخصي',
          readonlyWorkspace: 'مساحة عمل للقراءة فقط',
          returnSignin: 'يجب تسجيل الدخول',
          rotate: 'تدوير',
          rotating: 'جارٍ التدوير...',
          saveProfile: 'حفظ الملف الشخصي',
          savingProfile: 'جارٍ حفظ الملف الشخصي...',
          settings: 'الإعدادات',
          settingsIssue: 'مشكلة في الإعدادات',
          settingsUpdated: 'تم تحديث الإعدادات',
          sessionMissing: 'جلسة العميل مفقودة أو منتهية الصلاحية.',
          subtitle:
            'أدر بيانات الملف الشخصي ورموز API المرتبطة بمساحة العمل والإعدادات التشغيلية التي لا مكان لها في الصفحة الرئيسية للوحة التحكم.',
          title: 'إعدادات العميل',
          defaultAccountTokenName: 'رمز مساحة العمل الأساسي',
          tokenName: 'اسم الرمز',
          workspace: 'مساحة العمل',
          workspaceApi: 'واجهة API لمساحة العمل',
          workspaceSettings: 'إعدادات مساحة العمل',
        }
      : {
          accountApiTokens: 'Account API tokens',
          backToDashboard: 'Back to dashboard',
          createAccountApiToken: 'Create account API token',
          creatingToken: 'Creating token...',
          dashboardLogin: 'Return to the dashboard login',
          displayName: 'Display name',
          email: 'Email',
          loadingAccount: 'Loading customer account',
          loadingMessage:
            'Refreshing the session and loading workspace-scoped settings.',
          noTokens:
            'No account API tokens have been created for this workspace yet.',
          openTokens: 'Open tokens',
          plainTokenTitle: 'Plain token value',
          plainTokenMessage:
            'This value is only shown once. Rotate if it is lost.',
          profile: 'Customer profile',
          readonlyWorkspace: 'Read-only workspace',
          returnSignin: 'Sign in required',
          rotate: 'Rotate',
          rotating: 'Rotating...',
          saveProfile: 'Save profile',
          savingProfile: 'Saving profile...',
          settings: 'Settings',
          settingsIssue: 'Settings issue',
          settingsUpdated: 'Settings updated',
          sessionMissing: 'Your customer session is missing or expired.',
          subtitle:
            'Manage profile metadata, workspace-scoped account API tokens, and the operational settings that do not belong on the dashboard home.',
          title: 'Customer Settings',
          defaultAccountTokenName: 'Primary workspace token',
          tokenName: 'Token name',
          workspace: 'Workspace',
          workspaceApi: 'Workspace API',
          workspaceSettings: 'Workspace settings',
        };

  function handleSettingsLoadFailure(message: string) {
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

  const loadTokens = useEffectEvent(
    async (targetWorkspaceId: string, tokenOverride?: string | null) => {
      const response = await requestWithCustomerRefresh(
        tokenOverride ?? accessToken,
        (token) =>
          fetch(
            `${apiBaseUrl}/api/v1/account/api-tokens?workspaceId=${encodeURIComponent(targetWorkspaceId)}`,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
              credentials: 'include',
            },
          ),
        setAccessToken,
      );

      if (!response) {
        handleSettingsLoadFailure(
          locale === 'ar'
            ? 'تعذر الوصول إلى API الخاص بالعميل.'
            : 'Could not reach the customer API.',
        );
        return;
      }

      if (!response.ok) {
        if (mountedRef.current) {
          setErrorMessage(
            locale === 'ar'
              ? 'تعذر تحميل رموز API الخاصة بالحساب.'
              : 'Could not load account API tokens.',
          );
        }
        return;
      }

      const payload = (await response.json()) as ListAccountApiTokensResponse;
      if (mountedRef.current) {
        setAccountApiTokens(payload.items);
      }
    },
  );

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
    })();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (pageState !== 'ready' || !workspaceId) {
      return;
    }

    void loadTokens(workspaceId);
  }, [pageState, workspaceId]);

  useEffect(() => {
    if (pageState !== 'ready' || focusTarget !== 'tokens') {
      return;
    }

    const tokenNameInput = document.getElementById(
      'customer-account-token-name',
    );
    if (tokenNameInput instanceof HTMLElement) {
      tokenNameInput.focus();
    }
  }, [focusTarget, pageState]);

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
        setErrorMessage(
          locale === 'ar'
            ? 'تعذر تحديث ملف العميل الشخصي.'
            : 'Could not update the customer profile.',
        );
        return;
      }

      const payload = (await response.json()) as UpdateAccountProfileResponse;
      if (!mountedRef.current) {
        return;
      }

      setAccount((current) =>
        current ? { ...current, user: payload.user } : current,
      );
      setStatusMessage(
        locale === 'ar'
          ? `تم تحديث الملف الشخصي في ${formatCustomerDate(locale, payload.updatedAt)}.`
          : `Profile updated at ${formatCustomerDate(locale, payload.updatedAt)}.`,
      );
    } finally {
      setSubmittingProfile(false);
    }
  }

  async function createToken(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!workspaceId) {
      setErrorMessage(
        locale === 'ar' ? 'اختر مساحة عمل أولاً.' : 'Select a workspace first.',
      );
      return;
    }

    setTokenSubmitting('create');
    setCreatedToken(null);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await requestWithCustomerRefresh(
        accessToken,
        (token) =>
          fetch(`${apiBaseUrl}/api/v1/account/api-tokens`, {
            method: 'POST',
            headers: {
              authorization: `Bearer ${token}`,
              'content-type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              workspaceId,
              name: accountTokenName,
            }),
          }),
        setAccessToken,
      );

      if (!response) {
        setPageState('unauthenticated');
        return;
      }

      if (!response.ok) {
        setErrorMessage(
          locale === 'ar'
            ? 'تعذر إنشاء رمز API الخاص بالحساب.'
            : 'Could not create the account API token.',
        );
        return;
      }

      const payload = (await response.json()) as CreateAccountApiTokenResponse;
      if (!mountedRef.current) {
        return;
      }

      setCreatedToken(payload.token);
      setStatusMessage(
        locale === 'ar'
          ? `تم إنشاء رمز مساحة العمل ${payload.summary.prefix}.`
          : `Created workspace token ${payload.summary.prefix}.`,
      );
      await loadTokens(workspaceId);
    } finally {
      setTokenSubmitting(null);
    }
  }

  async function rotateToken(tokenId: string) {
    setTokenSubmitting(`rotate:${tokenId}`);
    setCreatedToken(null);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await requestWithCustomerRefresh(
        accessToken,
        (token) =>
          fetch(`${apiBaseUrl}/api/v1/account/api-tokens/${tokenId}/rotate`, {
            method: 'POST',
            headers: {
              authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          }),
        setAccessToken,
      );

      if (!response) {
        setPageState('unauthenticated');
        return;
      }

      if (!response.ok) {
        setErrorMessage(
          locale === 'ar'
            ? 'تعذر تدوير رمز API الخاص بالحساب.'
            : 'Could not rotate the account API token.',
        );
        return;
      }

      const payload = (await response.json()) as CreateAccountApiTokenResponse;
      if (!mountedRef.current) {
        return;
      }

      setCreatedToken(payload.token);
      setStatusMessage(
        locale === 'ar'
          ? `تم تدوير رمز مساحة العمل ${payload.summary.prefix}.`
          : `Rotated workspace token ${payload.summary.prefix}.`,
      );
      await loadTokens(workspaceId);
    } finally {
      setTokenSubmitting(null);
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
    null;
  const canManageTokens = selectedWorkspace
    ? ['owner', 'admin'].includes(selectedWorkspace.role)
    : false;

  return (
    <AppShell
      title={copy.title}
      subtitle={copy.subtitle}
      breadcrumbLabel={copy.settings}
      surface="customer"
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
            eyebrow={copy.workspaceSettings}
            message={
              locale === 'ar'
                ? 'تُطبَّق تغييرات الملف الشخصي والرموز على مساحة العمل النشطة.'
                : 'Profile and token changes apply to the active workspace.'
            }
            linkLabel={copy.openTokens}
            linkHref="/settings"
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
        <InfoCard eyebrow={copy.settings} title={copy.loadingAccount}>
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
            eyebrow={locale === 'ar' ? 'الملف الشخصي' : 'Profile'}
            title={copy.profile}
          >
            <form onSubmit={updateProfile} style={{ display: 'grid', gap: 16 }}>
              <Field label={copy.displayName}>
                <TextInput
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  minLength={2}
                  maxLength={80}
                  required
                />
              </Field>
              <Field label={copy.email}>
                <TextInput value={account.user.email} readOnly />
              </Field>
              <ActionButton type="submit" disabled={submittingProfile}>
                {submittingProfile ? copy.savingProfile : copy.saveProfile}
              </ActionButton>
            </form>
          </InfoCard>

          <InfoCard eyebrow={copy.workspaceApi} title={copy.accountApiTokens}>
            <form onSubmit={createToken} style={{ display: 'grid', gap: 16 }}>
              <Field label={copy.workspace}>
                <SelectInput
                  value={workspaceId}
                  onChange={(event) => setWorkspaceId(event.target.value)}
                  required
                >
                  {account.workspaces.map((workspace) => (
                    <option key={workspace.id} value={workspace.id}>
                      {workspace.name} (
                      {translateCustomerEnum(locale, workspace.role)})
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label={copy.tokenName}>
                <TextInput
                  id="customer-account-token-name"
                  value={accountTokenName}
                  onChange={(event) => setAccountTokenName(event.target.value)}
                  minLength={2}
                  maxLength={80}
                  required
                />
              </Field>
              <ActionButton
                type="submit"
                disabled={!canManageTokens || tokenSubmitting !== null}
              >
                {tokenSubmitting === 'create'
                  ? copy.creatingToken
                  : copy.createAccountApiToken}
              </ActionButton>
            </form>

            {!canManageTokens ? (
              <NoticeBanner title={copy.readonlyWorkspace} tone="warning">
                <p style={{ margin: 0 }}>
                  {locale === 'ar'
                    ? 'يمكن فقط لعضويات المالك أو المسؤول إنشاء رموز API الخاصة بمساحة العمل أو تدويرها.'
                    : 'Only owner or admin memberships can create or rotate workspace API tokens.'}
                </p>
              </NoticeBanner>
            ) : null}

            {accountApiTokens.length === 0 ? (
              <p style={{ margin: 0 }}>{copy.noTokens}</p>
            ) : (
              <ul className="elite-list">
                {accountApiTokens.map((token) => (
                  <li key={token.id} className="elite-list-item">
                    <div className="elite-list-title">
                      <span>{token.name}</span>
                      <StatusBadge
                        tone={token.revokedAt ? 'danger' : 'success'}
                      >
                        {translateCustomerEnum(
                          locale,
                          token.revokedAt ? 'revoked' : 'active',
                        )}
                      </StatusBadge>
                    </div>
                    <div className="elite-list-meta">
                      <span>
                        {locale === 'ar'
                          ? `البادئة ${token.prefix}`
                          : `Prefix ${token.prefix}`}
                      </span>
                      <span>
                        {locale === 'ar'
                          ? `أُنشئ ${formatCustomerDate(locale, token.createdAt)}`
                          : `Created ${formatCustomerDate(locale, token.createdAt)}`}
                      </span>
                      <span>
                        {locale === 'ar'
                          ? `آخر استخدام ${formatCustomerDate(locale, token.lastUsedAt)}`
                          : `Last used ${formatCustomerDate(locale, token.lastUsedAt)}`}
                      </span>
                    </div>
                    <ActionButton
                      type="button"
                      tone="secondary"
                      disabled={
                        !canManageTokens ||
                        Boolean(token.revokedAt) ||
                        tokenSubmitting !== null
                      }
                      onClick={() => {
                        void rotateToken(token.id);
                      }}
                    >
                      {tokenSubmitting === `rotate:${token.id}`
                        ? copy.rotating
                        : copy.rotate}
                    </ActionButton>
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>
        </>
      ) : null}

      {createdToken ? (
        <NoticeBanner title={copy.plainTokenTitle} tone="success">
          <p style={{ marginTop: 0 }}>{copy.plainTokenMessage}</p>
          <code>{createdToken}</code>
        </NoticeBanner>
      ) : null}

      {statusMessage ? (
        <NoticeBanner title={copy.settingsUpdated} tone="success">
          <p style={{ margin: 0 }}>{statusMessage}</p>
        </NoticeBanner>
      ) : null}

      {errorMessage ? (
        <NoticeBanner title={copy.settingsIssue} tone="danger">
          <p style={{ margin: 0 }}>{errorMessage}</p>
        </NoticeBanner>
      ) : null}
    </AppShell>
  );
}
