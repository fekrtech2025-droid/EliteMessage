'use client';

import Image from 'next/image';
import type { FormEvent } from 'react';
import { useState } from 'react';
import {
  ActionButton,
  AppShell,
  AuthHelpDialog,
  AuthSplitLayout,
  Field,
  HelpIconButton,
  NoticeBanner,
  PasswordInput,
  TextInput,
  useThemePreference,
} from '@elite-message/ui';
import { CustomerThemeControl } from '../components/customer-theme-control';
import { useCustomerLocale } from '../components/customer-localization';
import { getCustomerSigninHelpContent } from '../lib/auth-help';
import { useCustomerAuthForm } from '../lib/customer-auth-form';
import styles from './signin.module.css';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M16.2 9.2c0-.58-.05-1.01-.17-1.47H9.18v2.66h4.02c-.08.66-.51 1.66-1.47 2.33l-.01.09 2.14 1.63.15.02c1.38-1.25 2.19-3.09 2.19-5.26Z"
        fill="#4285F4"
      />
      <path
        d="M9.18 16.15c1.97 0 3.63-.64 4.84-1.74l-2.3-1.74c-.62.42-1.45.72-2.54.72-1.93 0-3.57-1.25-4.15-2.98l-.09.01-2.23 1.69-.03.08c1.2 2.32 3.65 3.96 6.5 3.96Z"
        fill="#34A853"
      />
      <path
        d="M5.03 10.41a4.81 4.81 0 0 1-.24-1.49c0-.52.09-1.03.23-1.49l-.01-.1-2.26-1.71-.07.03A7.04 7.04 0 0 0 2 8.92c0 1.14.28 2.22.78 3.18l2.25-1.69Z"
        fill="#FBBC05"
      />
      <path
        d="M9.18 4.45c1.37 0 2.3.58 2.82 1.07l2.06-1.98C12.8 2.4 11.15 1.7 9.18 1.7c-2.85 0-5.3 1.63-6.5 3.96l2.34 1.78c.58-1.73 2.22-2.99 4.16-2.99Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function CustomerSigninPage() {
  const { locale, toggleLocale } = useCustomerLocale();
  const { effectiveTheme } = useThemePreference();
  const auth = useCustomerAuthForm({ locale, initialMode: 'login' });
  const [helpOpen, setHelpOpen] = useState(false);
  const help = getCustomerSigninHelpContent(locale);
  const brandSrc =
    effectiveTheme === 'dark'
      ? '/images/elite-message-icon-only-dark.png'
      : '/images/elite-message-signin-logo.png';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    void auth.submitLogin(event);
  }

  return (
    <AppShell
      title=""
      subtitle=""
      surface="customer"
      contentWidth="full"
      headerMode="hidden"
    >
      <div className={styles.stage}>
        <AuthSplitLayout
          className={`${styles.layout} elite-auth-layout-login`}
          surface="customer"
          variant="spotlight"
          heroMediaOnly
          heroMedia={
            <div className="elite-login-brand-stage">
              <Image
                src={brandSrc}
                alt="Elite Message brand logo."
                width={1024}
                height={1024}
                priority
                sizes="(max-width: 720px) 0px, (max-width: 1024px) 48vw, 50vw"
                className="elite-login-brand-image"
              />
            </div>
          }
          panelEyebrow={auth.copy.signin}
          panelTitle={auth.copy.signin}
          panelAction={
            <div className="elite-auth-panel-tools">
              <ActionButton
                type="button"
                size="compact"
                tone="secondary"
                onClick={toggleLocale}
              >
                {locale === 'ar' ? 'English' : 'العربية'}
              </ActionButton>
              <CustomerThemeControl />
              <HelpIconButton
                label={
                  locale === 'ar'
                    ? 'افتح مساعدة تسجيل الدخول'
                    : 'Open sign-in help'
                }
                onClick={() => setHelpOpen(true)}
              />
            </div>
          }
        >
          <form className="elite-auth-form" onSubmit={handleSubmit} noValidate>
            {auth.errorMessage ? (
              <NoticeBanner title={auth.copy.signinFailed} tone="danger">
                <p style={{ margin: 0 }}>{auth.errorMessage}</p>
              </NoticeBanner>
            ) : null}

            {auth.statusMessage ? (
              <NoticeBanner
                title={locale === 'ar' ? 'تمت المعالجة' : 'Processed'}
                tone="success"
              >
                <p style={{ margin: 0 }}>{auth.statusMessage}</p>
              </NoticeBanner>
            ) : null}

            <Field
              label={auth.copy.emailAddress}
              tone={auth.loginEmailError ? 'danger' : 'neutral'}
              hint={auth.loginEmailError}
            >
              <TextInput
                value={auth.email}
                onChange={(event) => auth.setEmail(event.target.value)}
                onBlur={() => auth.markTouched('email')}
                type="email"
                autoComplete="email"
                placeholder="owner@company.com"
                aria-invalid={auth.loginEmailError ? 'true' : undefined}
                required
              />
            </Field>

            <Field
              label={auth.copy.password}
              tone={auth.loginPasswordError ? 'danger' : 'neutral'}
              hint={auth.loginPasswordError}
            >
              <PasswordInput
                value={auth.password}
                onChange={(event) => auth.setPassword(event.target.value)}
                onBlur={() => auth.markTouched('password')}
                revealed={auth.passwordVisible}
                onToggleVisibility={() =>
                  auth.setPasswordVisible((current) => !current)
                }
                showLabel={auth.copy.passwordShow}
                hideLabel={auth.copy.passwordHide}
                showAriaLabel={auth.copy.passwordShowAria}
                hideAriaLabel={auth.copy.passwordHideAria}
                autoComplete="current-password"
                placeholder={
                  locale === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'
                }
                aria-invalid={auth.loginPasswordError ? 'true' : undefined}
                required
              />
            </Field>

            <ActionButton
              type="submit"
              size="compact"
              stretch
              disabled={auth.submitting}
            >
              {auth.submitting
                ? auth.copy.signinSubmitting
                : auth.copy.signInAction}
            </ActionButton>

            <ActionButton
              type="button"
              size="compact"
              tone="secondary"
              stretch
              onClick={() => auth.continueWithGoogle('login')}
            >
              <span className="elite-auth-oauth-label">
                <GoogleIcon />
                <span>{auth.copy.signinGoogle}</span>
              </span>
            </ActionButton>
          </form>

          <div className="elite-auth-inline-actions">
            <span>{auth.copy.needNewWorkspace}</span>
            <button
              type="button"
              data-unstyled-button
              onClick={() => {
                window.location.assign('/signup');
              }}
            >
              {auth.copy.createAccount}
            </button>
          </div>

          <AuthHelpDialog
            open={helpOpen}
            title={help.title}
            intro={help.intro}
            sections={help.sections}
            footer={
              help.footer ? (
                <div className="elite-auth-inline-actions">
                  <span>{help.footer.prefix}</span>
                  <a href={help.footer.href}>{help.footer.label}</a>
                </div>
              ) : undefined
            }
            closeLabel={locale === 'ar' ? 'إغلاق المساعدة' : 'Close help'}
            onClose={() => setHelpOpen(false)}
          />
        </AuthSplitLayout>
      </div>
    </AppShell>
  );
}
