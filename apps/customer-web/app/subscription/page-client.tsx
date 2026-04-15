'use client';

import Link from 'next/link';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type {
  AccountMeResponse,
  GetWorkspaceSubscriptionResponse,
} from '@elite-message/contracts';
import {
  AppShell,
  DefinitionGrid,
  Field,
  InfoCard,
  NoticeBanner,
  SelectInput,
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

function readCustomerSubscriptionParam(key: string) {
  if (typeof window === 'undefined') {
    return '';
  }

  return new URLSearchParams(window.location.search).get(key) ?? '';
}

function tone(status: string) {
  switch (status) {
    case 'trialing':
      return 'warning' as const;
    case 'active':
      return 'success' as const;
    default:
      return 'neutral' as const;
  }
}

export function CustomerSubscriptionPage() {
  const { locale } = useCustomerLocale();
  const mountedRef = useRef(true);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountMeResponse | null>(null);
  const [workspaceId, setWorkspaceId] = useState(() =>
    readCustomerSubscriptionParam('workspaceId'),
  );
  const [subscription, setSubscription] =
    useState<GetWorkspaceSubscriptionResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const copy =
    locale === 'ar'
      ? {
          backToDashboard: 'العودة إلى لوحة التحكم',
          billingPosture: 'وضع الفوترة',
          dashboardLogin: 'العودة إلى تسجيل الدخول في لوحة التحكم',
          issue: 'مشكلة في الاشتراك',
          loadError: 'تعذر تحميل ملخص الاشتراك.',
          loading: 'جارٍ تحميل حالة خطة مساحة العمل',
          loadingMessage:
            'يتم تحديث جلسة العميل وتحميل ملخص اشتراك مساحة العمل المحددة.',
          notes: 'الملاحظات',
          planState: 'حالة الخطة',
          selectWorkspace: 'اختر مساحة عمل',
          sessionMissing: 'جلسة العميل مفقودة أو منتهية الصلاحية.',
          signInRequired: 'يجب تسجيل الدخول',
          subtitle:
            'اعرض حالة خطة مساحة العمل ووضع الفوترة في مساحة مخصصة حتى مع بقاء أتمتة الفوترة خفيفة في نسخة MVP.',
          title: 'اشتراك العميل',
          trackPlan: 'تابع اشتراك مساحة العمل المحددة وتوقيت الفترة التجريبية.',
          workspace: 'مساحة العمل',
        }
      : {
          backToDashboard: 'Back to dashboard',
          billingPosture: 'Billing posture',
          dashboardLogin: 'Return to the dashboard login',
          issue: 'Subscription issue',
          loadError: 'Could not load the subscription summary.',
          loading: 'Loading workspace plan state',
          loadingMessage:
            'Refreshing the customer session and loading the selected workspace subscription summary.',
          notes: 'Notes',
          planState: 'Plan state',
          selectWorkspace: 'Select a workspace',
          sessionMissing: 'The customer session is missing or expired.',
          signInRequired: 'Sign in required',
          subtitle:
            'Expose workspace plan state and billing posture in a dedicated area, even while billing automation is still intentionally lightweight in MVP mode.',
          title: 'Customer Subscription',
          trackPlan:
            'Track the selected workspace subscription and trial timing.',
          workspace: 'Workspace',
        };

  function handleSubscriptionLoadFailure(message: string) {
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
    const me = await loadCustomerAccount(token).catch(() => null);
    if (!me || !mountedRef.current) {
      if (mountedRef.current) {
        setPageState('unauthenticated');
      }
      return false;
    }

    const nextWorkspaceId = me.workspaces[0]?.id ?? '';
    setAccessToken(token);
    setAccount(me);
    setWorkspaceId((current) =>
      current && me.workspaces.some((workspace) => workspace.id === current)
        ? current
        : nextWorkspaceId,
    );
    setPageState('ready');
    return true;
  });

  const loadSubscription = useEffectEvent(
    async (workspace: string, tokenOverride?: string | null) => {
      const response = await requestWithCustomerRefresh(
        tokenOverride ?? accessToken,
        (token) =>
          fetch(
            `${apiBaseUrl}/api/v1/account/subscription?workspaceId=${encodeURIComponent(workspace)}`,
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
        handleSubscriptionLoadFailure(
          locale === 'ar'
            ? 'تعذر الوصول إلى API الخاص بالعميل.'
            : 'Could not reach the customer API.',
        );
        return;
      }

      if (!response.ok) {
        if (mountedRef.current) {
          setErrorMessage(copy.loadError);
        }
        return;
      }

      const payload =
        (await response.json()) as GetWorkspaceSubscriptionResponse;
      if (mountedRef.current) {
        setSubscription(payload);
      }
    },
  );

  async function logout() {
    await logoutCustomerSession();
    if (!mountedRef.current) {
      return;
    }

    setPageState('unauthenticated');
    setAccessToken(null);
    setAccount(null);
    setSubscription(null);
  }

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

    void loadSubscription(workspaceId);
  }, [pageState, workspaceId]);

  return (
    <AppShell
      title={copy.title}
      subtitle={copy.subtitle}
      breadcrumbLabel={locale === 'ar' ? 'الاشتراك' : 'Subscription'}
      surface="customer"
      labels={getCustomerShellLabels(locale)}
      nav={
        pageState === 'ready' ? (
          <CustomerNav
            current="subscription"
            account={account}
            workspaceId={workspaceId}
          />
        ) : undefined
      }
      meta={
        subscription ? (
          <CustomerTopbarAnnouncement
            eyebrow={copy.planState}
            message={copy.trackPlan}
            linkLabel={locale === 'ar' ? 'عرض الفوترة' : 'View billing'}
            linkHref="/subscription"
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
        <InfoCard
          eyebrow={locale === 'ar' ? 'الاشتراك' : 'Subscription'}
          title={copy.loading}
        >
          <p style={{ margin: 0 }}>{copy.loadingMessage}</p>
        </InfoCard>
      ) : null}

      {pageState === 'unauthenticated' ? (
        <InfoCard
          eyebrow={locale === 'ar' ? 'الجلسة' : 'Session'}
          title={copy.signInRequired}
        >
          <p style={{ marginTop: 0 }}>{copy.sessionMissing}</p>
          <p style={{ marginBottom: 0 }}>
            <Link href="/signin">{copy.dashboardLogin}</Link>
          </p>
        </InfoCard>
      ) : null}

      {pageState === 'ready' && account ? (
        <>
          <InfoCard eyebrow={copy.workspace} title={copy.selectWorkspace}>
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
          </InfoCard>

          {subscription ? (
            <>
              <InfoCard
                eyebrow={locale === 'ar' ? 'الخطة' : 'Plan'}
                title={
                  locale === 'ar'
                    ? `${subscription.planName} لـ ${subscription.workspace.name}`
                    : `${subscription.planName} for ${subscription.workspace.name}`
                }
              >
                <DefinitionGrid
                  minItemWidth={180}
                  items={[
                    {
                      label: locale === 'ar' ? 'الحالة' : 'Status',
                      value: translateCustomerEnum(locale, subscription.status),
                      tone: tone(subscription.status),
                    },
                    {
                      label: locale === 'ar' ? 'وضع الفوترة' : 'Billing mode',
                      value: subscription.billingMode,
                    },
                    {
                      label:
                        locale === 'ar'
                          ? 'بداية الفترة الحالية'
                          : 'Current period start',
                      value: formatCustomerDate(
                        locale,
                        subscription.currentPeriodStart,
                        locale === 'ar' ? 'لا يوجد' : 'None',
                      ),
                    },
                    {
                      label:
                        locale === 'ar'
                          ? 'نهاية الفترة الحالية'
                          : 'Current period end',
                      value: formatCustomerDate(
                        locale,
                        subscription.currentPeriodEnd,
                        locale === 'ar' ? 'لا يوجد' : 'None',
                      ),
                    },
                    {
                      label:
                        locale === 'ar'
                          ? 'انتهاء الفترة التجريبية'
                          : 'Trial ends',
                      value: formatCustomerDate(
                        locale,
                        subscription.trialEndsAt,
                        locale === 'ar' ? 'لا يوجد' : 'None',
                      ),
                      tone: subscription.trialEndsAt ? 'warning' : 'neutral',
                    },
                    {
                      label: locale === 'ar' ? 'المثيلات' : 'Instances',
                      value: String(subscription.instanceCount),
                    },
                    {
                      label:
                        locale === 'ar'
                          ? 'المثيلات المرتبطة'
                          : 'Linked instances',
                      value: String(subscription.linkedInstanceCount),
                      tone:
                        subscription.linkedInstanceCount > 0
                          ? 'success'
                          : 'neutral',
                    },
                    {
                      label:
                        locale === 'ar'
                          ? 'المثيلات المفعّل لها Webhook'
                          : 'Webhook-enabled instances',
                      value: String(subscription.webhookEnabledInstanceCount),
                      tone:
                        subscription.webhookEnabledInstanceCount > 0
                          ? 'info'
                          : 'neutral',
                    },
                  ]}
                />
              </InfoCard>

              <InfoCard eyebrow={copy.notes} title={copy.billingPosture}>
                <ul className="elite-list">
                  {subscription.notes.map((note) => (
                    <li key={note} className="elite-list-item">
                      {note}
                    </li>
                  ))}
                </ul>
              </InfoCard>
            </>
          ) : null}
        </>
      ) : null}

      {errorMessage ? (
        <NoticeBanner title={copy.issue} tone="danger">
          <p style={{ margin: 0 }}>{errorMessage}</p>
        </NoticeBanner>
      ) : null}
    </AppShell>
  );
}
