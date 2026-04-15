'use client';

import Link from 'next/link';
import type { FormEvent } from 'react';
import {
  ActionButton,
  AuthSegmentedControl,
  Field,
  NoticeBanner,
  PasswordInput,
  PasswordStrengthMeter,
  TextInput,
} from '@elite-message/ui';
import { useCustomerLocale } from './customer-localization';
import {
  useCustomerAuthForm,
  type CustomerAuthMode,
} from '../lib/customer-auth-form';
import styles from './customer-auth-surface.module.css';

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

type CustomerAuthSurfaceProps = {
  initialMode?: CustomerAuthMode;
  showModeSwitch?: boolean;
  showToolbar?: boolean;
  className?: string;
};

export function CustomerAuthSurface({
  initialMode = 'login',
  showModeSwitch = false,
  showToolbar = false,
  className,
}: CustomerAuthSurfaceProps) {
  const { locale, toggleLocale } = useCustomerLocale();
  const auth = useCustomerAuthForm({ locale, initialMode });
  const isSignup = auth.mode === 'signup';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (isSignup) {
      void auth.submitSignup(event);
      return;
    }

    void auth.submitLogin(event);
  }

  return (
    <section className={`${styles.card} ${className ?? ''}`}>
      {showToolbar ? (
        <div className={styles.toolbar}>
          <ActionButton
            type="button"
            size="compact"
            tone="secondary"
            onClick={toggleLocale}
          >
            {locale === 'ar' ? 'English' : 'العربية'}
          </ActionButton>
        </div>
      ) : null}

      {showModeSwitch ? (
        <div className={styles.mode}>
          <AuthSegmentedControl
            ariaLabel={
              locale === 'ar' ? 'وضع مصادقة العميل' : 'Customer auth mode'
            }
            options={[
              {
                id: 'login',
                label: auth.copy.signin,
                active: auth.mode === 'login',
                onSelect: () => auth.setMode('login'),
              },
              {
                id: 'signup',
                label: auth.copy.signup,
                active: auth.mode === 'signup',
                onSelect: () => auth.setMode('signup'),
              },
            ]}
          />
        </div>
      ) : null}

      {auth.errorMessage ? (
        <div className={styles.banner}>
          <NoticeBanner
            title={isSignup ? auth.copy.signupFailed : auth.copy.signinFailed}
            tone="danger"
          >
            <p style={{ margin: 0 }}>{auth.errorMessage}</p>
          </NoticeBanner>
        </div>
      ) : null}

      {auth.statusMessage ? (
        <div className={styles.banner}>
          <NoticeBanner
            title={locale === 'ar' ? 'تمت المعالجة' : 'Processed'}
            tone="success"
          >
            <p style={{ margin: 0 }}>{auth.statusMessage}</p>
          </NoticeBanner>
        </div>
      ) : null}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {isSignup ? (
          <Field
            label={auth.copy.displayName}
            tone={auth.signupDisplayNameError ? 'danger' : 'neutral'}
            hint={auth.signupDisplayNameError ?? auth.copy.displayNameHint}
          >
            <TextInput
              value={auth.displayName}
              onChange={(event) => auth.setDisplayName(event.target.value)}
              onBlur={() => auth.markTouched('displayName')}
              minLength={2}
              maxLength={80}
              autoComplete="name"
              placeholder={locale === 'ar' ? 'جين أوبريتور' : 'Jane Operator'}
              aria-invalid={auth.signupDisplayNameError ? 'true' : undefined}
              required
            />
          </Field>
        ) : null}

        <Field
          label={auth.copy.emailAddress}
          tone={
            (isSignup ? auth.signupEmailError : auth.loginEmailError)
              ? 'danger'
              : 'neutral'
          }
          hint={isSignup ? auth.signupEmailError : auth.loginEmailError}
        >
          <TextInput
            value={auth.email}
            onChange={(event) => auth.setEmail(event.target.value)}
            onBlur={() => auth.markTouched('email')}
            type="email"
            autoComplete="email"
            placeholder="owner@company.com"
            aria-invalid={
              (isSignup ? auth.signupEmailError : auth.loginEmailError)
                ? 'true'
                : undefined
            }
            required
          />
        </Field>

        <Field
          label={auth.copy.password}
          tone={
            (isSignup ? auth.signupPasswordError : auth.loginPasswordError)
              ? 'danger'
              : 'neutral'
          }
          hint={
            (isSignup ? auth.signupPasswordError : auth.loginPasswordError) ??
            (isSignup ? auth.copy.passwordHint : undefined)
          }
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
            minLength={isSignup ? 8 : undefined}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            placeholder={
              locale === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'
            }
            aria-invalid={
              (isSignup ? auth.signupPasswordError : auth.loginPasswordError)
                ? 'true'
                : undefined
            }
            required
          />
        </Field>

        {isSignup ? (
          <>
            <PasswordStrengthMeter
              score={auth.signupPasswordStrength.score}
              label={auth.signupPasswordStrength.label}
              help={auth.signupPasswordStrength.help}
            />
            <details open={Boolean(auth.workspaceName)}>
              <summary>{auth.copy.setCustomWorkspaceName}</summary>
              <Field
                label={auth.copy.workspaceName}
                tone={auth.signupWorkspaceNameError ? 'danger' : 'neutral'}
                hint={auth.signupWorkspaceNameError ?? auth.copy.workspaceHint}
              >
                <TextInput
                  value={auth.workspaceName}
                  onChange={(event) =>
                    auth.setWorkspaceName(event.target.value)
                  }
                  onBlur={() => auth.markTouched('workspaceName')}
                  maxLength={80}
                  placeholder={
                    locale === 'ar'
                      ? 'دعم الشرق الأوسط'
                      : 'North America Support'
                  }
                  aria-invalid={
                    auth.signupWorkspaceNameError ? 'true' : undefined
                  }
                />
              </Field>
            </details>
          </>
        ) : null}

        <ActionButton
          type="submit"
          size="compact"
          stretch
          disabled={auth.submitting}
        >
          {auth.submitting
            ? isSignup
              ? auth.copy.creatingAccount
              : auth.copy.signinSubmitting
            : isSignup
              ? auth.copy.createAccount
              : auth.copy.signInAction}
        </ActionButton>

        <ActionButton
          type="button"
          size="compact"
          tone="secondary"
          stretch
          className={styles.google}
          onClick={() => auth.continueWithGoogle(isSignup ? 'signup' : 'login')}
        >
          <span className={styles.googleLabel}>
            <GoogleIcon />
            <span>
              {isSignup ? auth.copy.continueWithGoogle : auth.copy.signinGoogle}
            </span>
          </span>
        </ActionButton>
      </form>

      <div className={styles.footer}>
        {isSignup ? (
          <>
            <span>{auth.copy.alreadyHaveAccess}</span>
            {showModeSwitch ? (
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => auth.setMode('login')}
              >
                {auth.copy.signInInstead}
              </button>
            ) : (
              <Link href="/signin">{auth.copy.signInInstead}</Link>
            )}
          </>
        ) : (
          <>
            <span>{auth.copy.needNewWorkspace}</span>
            {showModeSwitch ? (
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => auth.setMode('signup')}
              >
                {auth.copy.createAccount}
              </button>
            ) : (
              <Link href="/signup">{auth.copy.createAccount}</Link>
            )}
          </>
        )}
      </div>
    </section>
  );
}
