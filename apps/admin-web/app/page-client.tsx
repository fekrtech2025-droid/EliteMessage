'use client';

import Image from 'next/image';
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from 'react';
import { io } from 'socket.io-client';
import type {
  AccountMeResponse,
  AdminMfaChallengeResponse,
  AdminMfaStatusResponse,
  AdminOverviewResponse,
  AuthResponse,
} from '@elite-message/contracts';
import { websocketEventNames } from '@elite-message/contracts';
import {
  ActionButton,
  AppShell,
  AuthSplitLayout,
  Field,
  InfoCard,
  MetricCard,
  MetricGrid,
  NoticeBanner,
  PasswordInput,
  QrPayloadView,
  SectionGrid,
  setGlobalThemePreference,
  StatusBadge,
  TextInput,
} from '@elite-message/ui';
import { AdminNav } from './components/admin-nav';
import { AdminThemeControl } from './components/admin-theme-control';
import { AdminTopbarControls } from './components/admin-topbar-controls';
import {
  apiBaseUrl,
  clearStoredToken,
  readStoredToken,
  writeStoredToken,
} from './lib/session';

type PageState = 'loading' | 'unauthenticated' | 'ready';

type AdminAuthTouchedState = {
  email: boolean;
  password: boolean;
  mfaCode: boolean;
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
    case 'standby':
    case 'stopped':
      return 'neutral' as const;
    default:
      return 'info' as const;
  }
}

function validateEmailAddress(email: string) {
  const normalized = email.trim();
  if (!normalized) {
    return 'Enter the admin account email address.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return 'Use a valid email address like admin@company.com.';
  }

  return null;
}

function validateAdminPassword(password: string) {
  if (!password) {
    return 'Enter your password.';
  }

  return null;
}

function validateAdminMfaCode(code: string) {
  const normalized = code.trim();
  if (!normalized) {
    return null;
  }

  if (!/^\d{6}$/.test(normalized)) {
    return 'Authenticator codes use 6 digits.';
  }

  return null;
}

export function AdminDashboardPage() {
  const mountedRef = useRef(true);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [, setAccessToken] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountMeResponse | null>(null);
  const [overview, setOverview] = useState<AdminOverviewResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaStatus, setMfaStatus] = useState<AdminMfaStatusResponse | null>(
    null,
  );
  const [mfaChallenge, setMfaChallenge] =
    useState<AdminMfaChallengeResponse | null>(null);
  const [mfaVerifyCode, setMfaVerifyCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [mfaSubmitting, setMfaSubmitting] = useState<
    'challenge' | 'verify' | null
  >(null);
  const [authTouched, setAuthTouched] = useState<AdminAuthTouchedState>({
    email: false,
    password: false,
    mfaCode: false,
  });

  const loginEmailError =
    authTouched.email || email.length > 0 ? validateEmailAddress(email) : null;
  const loginPasswordError =
    authTouched.password || password.length > 0
      ? validateAdminPassword(password)
      : null;
  const loginMfaError =
    authTouched.mfaCode || mfaCode.length > 0
      ? validateAdminMfaCode(mfaCode)
      : null;
  const useCustomerLoginDesign = pageState === 'unauthenticated';
  const inlineAuthFeedback =
    pageState === 'unauthenticated' ? (
      errorMessage ? (
        <NoticeBanner title="Sign in failed" tone="danger">
          <p style={{ margin: 0 }}>{errorMessage}</p>
        </NoticeBanner>
      ) : statusMessage ? (
        <NoticeBanner title="Latest action" tone="success">
          <p style={{ margin: 0 }}>{statusMessage}</p>
        </NoticeBanner>
      ) : null
    ) : null;

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
      setErrorMessage('Could not reach the API.');
    });

    return () => {
      mountedRef.current = false;
    };
  }, []);

  function markAuthTouched(field: keyof AdminAuthTouchedState) {
    setAuthTouched((current) =>
      current[field] ? current : { ...current, [field]: true },
    );
  }

  function resetAuthTouched() {
    setAuthTouched({
      email: false,
      password: false,
      mfaCode: false,
    });
  }

  const reloadState = useEffectEvent(async () => {
    const token = readStoredToken();
    if (!token) {
      return;
    }

    const loaded = await loadAdminState(token);
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

    await loadAdminState(refreshed);
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
        void reloadState();
      }, 250);
    };

    Object.values(websocketEventNames).forEach((eventName) => {
      socket.on(eventName, scheduleRefresh);
    });

    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }

      Object.values(websocketEventNames).forEach((eventName) => {
        socket.off(eventName, scheduleRefresh);
      });
      socket.disconnect();
    };
  }, [pageState]);

  async function initialize() {
    const storedAccessToken = readStoredToken();
    if (storedAccessToken) {
      const loaded = await loadAdminState(storedAccessToken);
      if (loaded) {
        return;
      }
    }

    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      setPageState('unauthenticated');
      return;
    }

    const loaded = await loadAdminState(refreshed);
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

  async function loadAdminState(token: string) {
    const [meResponse, overviewResponse, mfaResponse] = await Promise.all([
      fetch(`${apiBaseUrl}/api/v1/account/me`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      }),
      fetch(`${apiBaseUrl}/api/v1/admin/overview`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      }),
      fetch(`${apiBaseUrl}/api/v1/auth/admin/mfa`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      }),
    ]);

    if (
      meResponse.status === 401 ||
      overviewResponse.status === 401 ||
      mfaResponse.status === 401
    ) {
      return false;
    }

    if (overviewResponse.status === 403) {
      if (mountedRef.current) {
        setErrorMessage(
          'This account is not allowed to open the admin console.',
        );
        setPageState('unauthenticated');
      }
      return false;
    }

    if (!meResponse.ok || !overviewResponse.ok || !mfaResponse.ok) {
      if (!mountedRef.current) {
        return false;
      }

      setErrorMessage('Could not load the admin overview.');
      setPageState('unauthenticated');
      return false;
    }

    const me = (await meResponse.json()) as AccountMeResponse;
    const adminOverview =
      (await overviewResponse.json()) as AdminOverviewResponse;
    const adminMfaStatus = (await mfaResponse.json()) as AdminMfaStatusResponse;

    if (!mountedRef.current) {
      return false;
    }

    setGlobalThemePreference(me.themePreference);
    setAccessToken(token);
    setAccount(me);
    setOverview(adminOverview);
    setMfaStatus(adminMfaStatus);
    setPageState('ready');
    return true;
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);
    setAuthTouched({
      email: true,
      password: true,
      mfaCode: Boolean(mfaCode.trim()),
    });

    const nextEmailError = validateEmailAddress(email);
    const nextPasswordError = validateAdminPassword(password);
    const nextMfaError = validateAdminMfaCode(mfaCode);

    if (nextEmailError || nextPasswordError || nextMfaError) {
      setErrorMessage('Fix the highlighted fields and try again.');
      setPageState('unauthenticated');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          mfaCode: mfaCode.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        if (mountedRef.current) {
          setErrorMessage(
            payload?.message ??
              'Login failed. Use the bootstrap admin account.',
          );
          setPageState('unauthenticated');
        }
        return;
      }

      const auth = (await response.json()) as AuthResponse;
      writeStoredToken(auth.accessToken);
      if (!mountedRef.current) {
        return;
      }

      setAccessToken(auth.accessToken);
      const loaded = await loadAdminState(auth.accessToken);
      if (loaded) {
        setPasswordVisible(false);
        resetAuthTouched();
        setStatusMessage(`Signed in as ${auth.user.displayName}.`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function logout() {
    await fetch(`${apiBaseUrl}/api/v1/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    clearStoredToken();
    if (!mountedRef.current) {
      return;
    }

    setAccessToken(null);
    setAccount(null);
    setOverview(null);
    setMfaStatus(null);
    setMfaChallenge(null);
    setMfaCode('');
    setMfaVerifyCode('');
    setPasswordVisible(false);
    resetAuthTouched();
    setStatusMessage(null);
    setErrorMessage(null);
    setPageState('unauthenticated');
  }

  async function startMfaSetup() {
    const token = readStoredToken();
    if (!token) {
      setPageState('unauthenticated');
      return;
    }

    setMfaSubmitting('challenge');
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/v1/auth/admin/mfa/challenge`,
        {
          method: 'POST',
          headers: {
            authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        },
      );

      if (response.status === 401) {
        setPageState('unauthenticated');
        return;
      }

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(payload?.message ?? 'Could not start admin MFA setup.');
      }

      const payload = (await response.json()) as AdminMfaChallengeResponse;
      setMfaChallenge(payload);
      setStatusMessage(
        'Scan the QR code in your authenticator app, then verify with a six-digit code.',
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not start admin MFA setup.',
      );
    } finally {
      setMfaSubmitting(null);
    }
  }

  async function verifyMfaSetup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = readStoredToken();
    if (!token) {
      setPageState('unauthenticated');
      return;
    }

    setMfaSubmitting('verify');
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/v1/auth/admin/mfa/verify`,
        {
          method: 'POST',
          headers: {
            authorization: `Bearer ${token}`,
            'content-type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ code: mfaVerifyCode.trim() }),
        },
      );

      if (response.status === 401) {
        setPageState('unauthenticated');
        return;
      }

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(
          payload?.message ?? 'Could not verify the admin MFA code.',
        );
      }

      const payload = (await response.json()) as AdminMfaStatusResponse;
      setMfaStatus(payload);
      setMfaChallenge(null);
      setMfaVerifyCode('');
      setStatusMessage('Admin MFA is now enabled for this account.');
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not verify the admin MFA code.',
      );
    } finally {
      setMfaSubmitting(null);
    }
  }

  return (
    <AppShell
      title="Admin Operations Console"
      subtitle="Monitor worker health, track platform-wide runtime state, and intervene on problem sessions from an operations console designed for continuous oversight."
      surface={useCustomerLoginDesign ? 'customer' : 'admin'}
      contentWidth={useCustomerLoginDesign ? 'full' : 'wide'}
      headerMode={useCustomerLoginDesign ? 'hidden' : 'default'}
      nav={
        pageState === 'ready' && account ? (
          <AdminNav current="dashboard" account={account} />
        ) : undefined
      }
      headerActions={
        pageState === 'ready' && account ? (
          <AdminTopbarControls account={account} />
        ) : undefined
      }
      meta={
        pageState === 'ready' && account ? (
          <StatusBadge tone="warning">
            {account.user.role.replaceAll('_', ' ')}
          </StatusBadge>
        ) : (
          <StatusBadge tone="neutral">Admin Surface</StatusBadge>
        )
      }
      footer={
        pageState === 'ready'
          ? 'Admin actions still stay controlled in this phase, but the dashboard now reflects runtime and worker changes as they happen.'
          : undefined
      }
    >
      {pageState === 'loading' ? (
        <InfoCard eyebrow="Session" title="Connecting to the admin API">
          <p style={{ margin: 0 }}>
            Checking for a refresh session and loading the current overview
            snapshot.
          </p>
        </InfoCard>
      ) : null}

      {pageState === 'unauthenticated' ? (
        <AuthSplitLayout
          surface="customer"
          variant="spotlight"
          heroMediaOnly
          heroMedia={
            <div className="elite-login-brand-stage">
              <Image
                src="/images/EliteMessage_Logo_Full_Gold_Text.png"
                alt="Elite Message brand logo."
                width={1200}
                height={1200}
                priority
                sizes="(max-width: 720px) 0px, (max-width: 1024px) 48vw, 50vw"
                className="elite-login-brand-image"
              />
            </div>
          }
          panelEyebrow="Admin login"
          panelTitle="Sign in to continue"
          panelAction={
            <div className="elite-toolbar">
              <AdminThemeControl />
            </div>
          }
        >
          <form className="elite-auth-form" onSubmit={login} noValidate>
            {inlineAuthFeedback}
            <Field
              label="Email address"
              tone={loginEmailError ? 'danger' : 'neutral'}
              hint={
                loginEmailError ??
                'Use the email bound to your platform admin account.'
              }
            >
              <TextInput
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => markAuthTouched('email')}
                type="email"
                autoComplete="email"
                placeholder="admin@company.com"
                aria-invalid={loginEmailError ? 'true' : undefined}
                required
              />
            </Field>
            <Field
              label="Password"
              tone={loginPasswordError ? 'danger' : 'neutral'}
              hint={
                loginPasswordError ??
                'Use the current password for this admin account.'
              }
            >
              <PasswordInput
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onBlur={() => markAuthTouched('password')}
                revealed={passwordVisible}
                onToggleVisibility={() =>
                  setPasswordVisible((current) => !current)
                }
                autoComplete="current-password"
                placeholder="Enter your password"
                aria-invalid={loginPasswordError ? 'true' : undefined}
                required
              />
            </Field>
            <Field
              label="Authenticator code"
              tone={loginMfaError ? 'danger' : 'neutral'}
              hint={
                loginMfaError ??
                'Optional until MFA is enabled. When used, it must be a 6-digit TOTP code.'
              }
            >
              <TextInput
                value={mfaCode}
                onChange={(event) => setMfaCode(event.target.value)}
                onBlur={() => markAuthTouched('mfaCode')}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="123456"
                aria-invalid={loginMfaError ? 'true' : undefined}
              />
            </Field>
          <ActionButton
            type="submit"
            size="compact"
            stretch
            disabled={submitting}
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </ActionButton>
          </form>
        </AuthSplitLayout>
      ) : null}

      {pageState === 'ready' && account && overview ? (
        <>
          <InfoCard
            eyebrow="Operator"
            title={`${account.user.displayName} (${account.user.role})`}
            action={
              <ActionButton type="button" tone="secondary" onClick={logout}>
                Log out
              </ActionButton>
            }
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
                <StatusBadge tone="warning">{account.user.email}</StatusBadge>
                <StatusBadge tone="neutral">Global view</StatusBadge>
                <StatusBadge
                  tone={
                    mfaStatus?.enabled
                      ? 'success'
                      : mfaStatus?.pending
                        ? 'warning'
                        : 'danger'
                  }
                >
                  MFA{' '}
                  {mfaStatus?.enabled
                    ? 'enabled'
                    : mfaStatus?.pending
                      ? 'pending'
                      : 'disabled'}
                </StatusBadge>
              </div>
              <MetricGrid minItemWidth={160}>
                <MetricCard
                  label="Users"
                  value={overview.counts.users}
                  hint="Operator accounts"
                />
                <MetricCard
                  label="Workspaces"
                  value={overview.counts.workspaces}
                  hint="Tenant containers"
                />
                <MetricCard
                  label="Instances"
                  value={overview.counts.instances}
                  hint="Runtime records"
                />
                <MetricCard
                  label="Workers"
                  value={overview.counts.workers}
                  hint="Active heartbeat sources"
                  tone="info"
                />
              </MetricGrid>
            </div>
          </InfoCard>

          <InfoCard
            eyebrow="Security"
            title="Admin MFA"
            action={
              <ActionButton
                type="button"
                tone="secondary"
                onClick={startMfaSetup}
                disabled={mfaSubmitting === 'challenge'}
              >
                {mfaSubmitting === 'challenge'
                  ? 'Preparing...'
                  : mfaStatus?.enabled
                    ? 'Rotate MFA'
                    : 'Set up MFA'}
              </ActionButton>
            }
          >
            <div style={{ display: 'grid', gap: 16 }}>
              <p style={{ margin: 0, color: 'var(--elite-muted)' }}>
                Platform admins can protect dashboard access with TOTP-based
                MFA. Once enabled, login requires the six-digit code.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <StatusBadge tone={mfaStatus?.enabled ? 'success' : 'warning'}>
                  {mfaStatus?.enabled ? 'Enabled' : 'Not enabled'}
                </StatusBadge>
                {mfaStatus?.configuredAt ? (
                  <StatusBadge tone="neutral">
                    Configured {formatDate(mfaStatus.configuredAt)}
                  </StatusBadge>
                ) : null}
              </div>
              {mfaChallenge ? (
                <div style={{ display: 'grid', gap: 16 }}>
                  <QrPayloadView
                    payload={mfaChallenge.otpauthUrl}
                    alt="Admin MFA setup QR code"
                  />
                  <Field label="Shared secret">
                    <TextInput value={mfaChallenge.secret} readOnly />
                  </Field>
                  <form
                    onSubmit={verifyMfaSetup}
                    style={{ display: 'grid', gap: 14 }}
                  >
                    <Field label="Verification code">
                      <TextInput
                        value={mfaVerifyCode}
                        onChange={(event) =>
                          setMfaVerifyCode(event.target.value)
                        }
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                      />
                    </Field>
                    <ActionButton
                      type="submit"
                      disabled={mfaSubmitting === 'verify'}
                    >
                      {mfaSubmitting === 'verify'
                        ? 'Verifying...'
                        : 'Enable MFA'}
                    </ActionButton>
                  </form>
                </div>
              ) : null}
            </div>
          </InfoCard>

          <SectionGrid minItemWidth={320}>
            <InfoCard eyebrow="Workers" title="Heartbeat and capacity">
              {overview.workers.length === 0 ? (
                <p style={{ margin: 0 }}>
                  No worker heartbeat has been persisted yet.
                </p>
              ) : (
                <ul className="elite-list">
                  {overview.workers.map((worker) => (
                    <li key={worker.id} className="elite-list-item">
                      <div className="elite-list-title">
                        <span>{worker.workerId}</span>
                        <StatusBadge
                          tone={
                            worker.status === 'online' ? 'success' : 'warning'
                          }
                        >
                          {worker.status}
                        </StatusBadge>
                      </div>
                      <div className="elite-list-meta">
                        <span>Region {worker.region}</span>
                        <span>Last seen {formatDate(worker.lastSeenAt)}</span>
                      </div>
                      <div
                        className="elite-definition-grid"
                        style={{ '--elite-grid-min': '120px' } as CSSProperties}
                      >
                        <div className="elite-definition-item">
                          <div className="elite-definition-label">Uptime</div>
                          <div className="elite-definition-value">
                            {worker.uptimeSeconds}s
                          </div>
                        </div>
                        <div className="elite-definition-item">
                          <div className="elite-definition-label">Assigned</div>
                          <div className="elite-definition-value">
                            {worker.activeInstanceCount}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </InfoCard>

            <InfoCard eyebrow="Users" title="Account summary">
              <ul className="elite-list">
                {overview.users.map((user) => (
                  <li key={user.id} className="elite-list-item">
                    <div className="elite-list-title">
                      <span>{user.displayName}</span>
                      <StatusBadge
                        tone={
                          user.role === 'platform_admin' ? 'warning' : 'neutral'
                        }
                      >
                        {user.role}
                      </StatusBadge>
                    </div>
                    <div className="elite-list-meta">
                      <span>{user.email}</span>
                      <span>Created {formatDate(user.createdAt)}</span>
                    </div>
                    <div
                      className="elite-definition-grid"
                      style={{ '--elite-grid-min': '120px' } as CSSProperties}
                    >
                      <div className="elite-definition-item">
                        <div className="elite-definition-label">Workspaces</div>
                        <div className="elite-definition-value">
                          {user.workspaceCount}
                        </div>
                      </div>
                      <div className="elite-definition-item">
                        <div className="elite-definition-label">Instances</div>
                        <div className="elite-definition-value">
                          {user.instanceCount}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </InfoCard>
          </SectionGrid>

          <InfoCard eyebrow="Instances" title="Global instance view">
            {overview.instances.length === 0 ? (
              <p style={{ margin: 0 }}>No instances have been created yet.</p>
            ) : (
              <div
                className="elite-section-grid"
                style={{ '--elite-grid-min': '260px' } as CSSProperties}
              >
                {overview.instances.map((instance) => (
                  <article key={instance.id} className="elite-list-item">
                    <div className="elite-list-title">
                      <span>
                        {instance.name} ({instance.publicId})
                      </span>
                      <StatusBadge tone={statusTone(instance.status)}>
                        {instance.status} /{' '}
                        {formatSubstatus(instance.substatus)}
                      </StatusBadge>
                    </div>
                    <div className="elite-list-meta">
                      <span>{instance.workspaceName}</span>
                      <span>
                        Last lifecycle event{' '}
                        {formatDate(instance.latestEventAt)}
                      </span>
                    </div>
                    <div
                      className="elite-definition-grid"
                      style={{ '--elite-grid-min': '130px' } as CSSProperties}
                    >
                      <div className="elite-definition-item">
                        <div className="elite-definition-label">Worker</div>
                        <div className="elite-definition-value">
                          {instance.assignedWorkerId
                            ? `${instance.assignedWorkerId}${instance.assignedWorkerRegion ? ` (${instance.assignedWorkerRegion})` : ''}`
                            : 'Unassigned'}
                        </div>
                      </div>
                    </div>
                    <div>
                      <a href={`/instances/${instance.id}`}>
                        Open admin detail
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </InfoCard>
        </>
      ) : null}

      {pageState !== 'unauthenticated' && errorMessage ? (
        <NoticeBanner title="Action failed" tone="danger">
          <p style={{ margin: 0 }}>{errorMessage}</p>
        </NoticeBanner>
      ) : null}

      {pageState !== 'unauthenticated' && statusMessage ? (
        <NoticeBanner title="Latest action" tone="success">
          <p style={{ margin: 0 }}>{statusMessage}</p>
        </NoticeBanner>
      ) : null}
    </AppShell>
  );
}
