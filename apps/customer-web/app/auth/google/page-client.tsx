'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell, InfoCard, NoticeBanner } from '@elite-message/ui';
import { CustomerThemeControl } from '../../components/customer-theme-control';
import { useCustomerLocale } from '../../components/customer-localization';
import { clearStoredToken, writeStoredToken } from '../../lib/session';
import {
  parseGoogleAuthCallbackHash,
  type ParsedGoogleAuthCallback,
} from '../../lib/google-auth';

type CallbackState =
  | {
      kind: 'processing';
    }
  | Extract<ParsedGoogleAuthCallback, { kind: 'error' }>;

export function CustomerGoogleAuthCallbackPage() {
  const { locale } = useCustomerLocale();
  const [state, setState] = useState<CallbackState>({
    kind: 'processing',
  });

  useEffect(() => {
    const parsed = parseGoogleAuthCallbackHash(window.location.hash);
    if (parsed.kind === 'success') {
      writeStoredToken(parsed.accessToken);
      window.location.replace('/dashboard');
      return;
    }

    clearStoredToken();
    setState(parsed);
  }, []);

  const copy =
    locale === 'ar'
      ? {
          accountInstead: 'أنشئ حسابًا بدلًا من ذلك',
          googleAuth: 'تسجيل الدخول عبر Google',
          processing: 'جارٍ إكمال تسجيل الدخول عبر Google',
          processingBanner: 'جارٍ المعالجة',
          processingSubtitle:
            'يجري الآن إكمال جلسة العميل ثم إعادتك إلى لوحة التحكم.',
          returnToSignin: 'العودة إلى تسجيل الدخول',
          returnToSignup: 'العودة إلى التسجيل',
          signinInstead: 'انتقل إلى تسجيل الدخول بدلًا من ذلك',
          waiting: 'جارٍ استعادة جلسة العميل.',
          failed: 'تعذر إكمال تسجيل الدخول عبر Google',
        }
      : {
          accountInstead: 'Create an account instead',
          googleAuth: 'Google auth',
          processing: 'Completing Google sign-in',
          processingBanner: 'Working',
          processingSubtitle:
            'Finalizing the customer session and returning to the dashboard.',
          returnToSignin: 'Return to sign in',
          returnToSignup: 'Return to signup',
          signinInstead: 'Try signing in instead',
          waiting: 'Waiting for the customer session to be restored.',
          failed: 'Google sign-in could not be completed',
        };

  const title = state.kind === 'processing' ? copy.processing : copy.failed;
  const subtitle =
    state.kind === 'processing' ? copy.processingSubtitle : state.errorMessage;

  return (
    <AppShell
      title=""
      subtitle=""
      surface="customer"
      contentWidth="narrow"
      headerMode="hidden"
    >
      <div className="elite-auth-centered-stage">
        <InfoCard
          className="elite-auth-centered-card"
          eyebrow={copy.googleAuth}
          title={title}
          subtitle={subtitle}
          action={
            <div className="elite-toolbar">
              <CustomerThemeControl />
            </div>
          }
          surface="customer"
        >
          {state.kind === 'processing' ? (
            <NoticeBanner title={copy.processingBanner} tone="info">
              <p style={{ margin: 0 }}>{copy.waiting}</p>
            </NoticeBanner>
          ) : (
            <div className="elite-auth-inline-actions">
              <Link href={state.mode === 'signup' ? '/signup' : '/signin'}>
                {state.mode === 'signup'
                  ? copy.returnToSignup
                  : copy.returnToSignin}
              </Link>
              {state.mode === 'login' ? (
                <Link href="/signup">{copy.accountInstead}</Link>
              ) : (
                <Link href="/signin">{copy.signinInstead}</Link>
              )}
            </div>
          )}
        </InfoCard>
      </div>
    </AppShell>
  );
}
