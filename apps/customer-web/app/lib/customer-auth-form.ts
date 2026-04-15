'use client';

import { useState, type FormEvent } from 'react';
import type { AuthResponse } from '@elite-message/contracts';
import { beginGoogleAuthorization } from './google-auth';
import { apiBaseUrl, writeStoredToken } from './session';
import {
  getPasswordStrength,
  validateCustomerDisplayName,
  validateCustomerEmail,
  validateCustomerLoginPassword,
  validateCustomerSignupPassword,
  validateCustomerWorkspaceName,
} from './auth-validation';
import type { CustomerLocale } from './customer-locale';

export type CustomerAuthMode = 'login' | 'signup';

type CustomerAuthTouchedState = {
  email: boolean;
  password: boolean;
  displayName: boolean;
  workspaceName: boolean;
};

type CustomerAuthCopy = {
  alreadyHaveAccess: string;
  continueWithGoogle: string;
  createAccount: string;
  creatingAccount: string;
  displayName: string;
  displayNameHint: string;
  emailAddress: string;
  existingAccount: string;
  fixHighlightedFields: string;
  needNewWorkspace: string;
  password: string;
  passwordHint: string;
  passwordHide: string;
  passwordHideAria: string;
  passwordShow: string;
  passwordShowAria: string;
  setCustomWorkspaceName: string;
  signin: string;
  signinFailed: string;
  signinGoogle: string;
  signinSubmitting: string;
  signinSuccess: (name: string) => string;
  signup: string;
  signupFailed: string;
  signupSuccess: (name: string) => string;
  signInAction: string;
  signInInstead: string;
  workspaceHint: string;
  workspaceName: string;
};

function parseAuthErrorMessage(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const value = (payload as { message?: string | string[] }).message;
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return typeof value === 'string' ? value : null;
}

export function redirectToCustomerRoute(pathname: string) {
  if (
    typeof window !== 'undefined' &&
    typeof (
      window as Window & {
        __eliteCustomerAuthRedirectHook?: (path: string) => void;
      }
    ).__eliteCustomerAuthRedirectHook === 'function'
  ) {
    (
      window as Window & {
        __eliteCustomerAuthRedirectHook?: (path: string) => void;
      }
    ).__eliteCustomerAuthRedirectHook?.(pathname);
    return;
  }

  window.location.assign(pathname);
}

function getCustomerAuthCopy(locale: CustomerLocale): CustomerAuthCopy {
  if (locale === 'ar') {
    return {
      alreadyHaveAccess: 'لديك حساب بالفعل؟',
      continueWithGoogle: 'تابع باستخدام Google',
      createAccount: 'إنشاء الحساب',
      creatingAccount: 'جارٍ إنشاء الحساب...',
      displayName: 'الاسم الظاهر',
      displayNameHint: 'يظهر هذا الاسم في لوحة التحكم وشاشات الدعم.',
      emailAddress: 'البريد الإلكتروني',
      existingAccount: 'يوجد حساب بهذا البريد الإلكتروني بالفعل.',
      fixHighlightedFields: 'أصلح الحقول المميزة ثم حاول مرة أخرى.',
      needNewWorkspace: 'ليس لديك حساب؟',
      password: 'كلمة المرور',
      passwordHint:
        'استخدم 8 أحرف على الأقل. كلما زاد الطول وتنوعت الأحرف كانت أقوى.',
      passwordHide: 'إخفاء',
      passwordHideAria: 'إخفاء كلمة المرور',
      passwordShow: 'إظهار',
      passwordShowAria: 'إظهار كلمة المرور',
      setCustomWorkspaceName: 'تعيين اسم مخصص لمساحة العمل (اختياري)',
      signin: 'تسجيل الدخول',
      signinFailed: 'فشل تسجيل الدخول',
      signinGoogle: 'تسجيل الدخول عبر Google',
      signinSubmitting: 'جارٍ تسجيل الدخول...',
      signinSuccess: (name) => `تم تسجيل الدخول باسم ${name}.`,
      signup: 'إنشاء حساب',
      signupFailed: 'فشل التسجيل',
      signupSuccess: (name) => `تم إنشاء الحساب للمستخدم ${name}.`,
      signInAction: 'تسجيل الدخول',
      signInInstead: 'سجّل الدخول بدلًا من ذلك',
      workspaceHint:
        'اترك هذا الحقل فارغًا لإنشاء اسم مساحة العمل من الاسم الظاهر.',
      workspaceName: 'اسم مساحة العمل',
    };
  }

  return {
    alreadyHaveAccess: 'Already have access?',
    continueWithGoogle: 'Continue with Google',
    createAccount: 'Create account',
    creatingAccount: 'Creating account...',
    displayName: 'Display name',
    displayNameHint: 'This name appears in the dashboard and support views.',
    emailAddress: 'Email address',
    existingAccount: 'An account with this email already exists.',
    fixHighlightedFields: 'Fix the highlighted fields and try again.',
    needNewWorkspace: 'Need a new workspace?',
    password: 'Password',
    passwordHint:
      'Use at least 8 characters. Longer passwords with mixed characters are stronger.',
    passwordHide: 'Hide',
    passwordHideAria: 'Hide password',
    passwordShow: 'Show',
    passwordShowAria: 'Show password',
    setCustomWorkspaceName: 'Set a custom workspace name (optional)',
    signin: 'Sign in',
    signinFailed: 'Signin failed',
    signinGoogle: 'Sign in with Google',
    signinSubmitting: 'Signing in...',
    signinSuccess: (name) => `Signed in as ${name}.`,
    signup: 'Sign up',
    signupFailed: 'Signup failed',
    signupSuccess: (name) => `Created account for ${name}.`,
    signInAction: 'Sign in',
    signInInstead: 'Sign in instead',
    workspaceHint:
      'Leave this empty to generate the workspace name from your display name.',
    workspaceName: 'Workspace name',
  };
}

export function useCustomerAuthForm({
  locale,
  initialMode = 'login',
  redirectTo = '/dashboard',
}: {
  locale: CustomerLocale;
  initialMode?: CustomerAuthMode;
  redirectTo?: string;
}) {
  const copy = getCustomerAuthCopy(locale);
  const [mode, setModeState] = useState<CustomerAuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [touched, setTouched] = useState<CustomerAuthTouchedState>({
    email: false,
    password: false,
    displayName: false,
    workspaceName: false,
  });

  const loginEmailError =
    touched.email || email.length > 0
      ? validateCustomerEmail(email, locale)
      : null;
  const loginPasswordError =
    touched.password || password.length > 0
      ? validateCustomerLoginPassword(password, locale)
      : null;
  const signupEmailError =
    touched.email || email.length > 0
      ? validateCustomerEmail(email, locale)
      : null;
  const signupPasswordError =
    touched.password || password.length > 0
      ? validateCustomerSignupPassword(password, locale)
      : null;
  const signupDisplayNameError =
    touched.displayName || displayName.length > 0
      ? validateCustomerDisplayName(displayName, locale)
      : null;
  const signupWorkspaceNameError =
    touched.workspaceName || workspaceName.length > 0
      ? validateCustomerWorkspaceName(workspaceName, locale)
      : null;
  const signupPasswordStrength = getPasswordStrength(password, locale);

  function resetTouched() {
    setTouched({
      email: false,
      password: false,
      displayName: false,
      workspaceName: false,
    });
  }

  function setMode(nextMode: CustomerAuthMode) {
    setModeState(nextMode);
    setErrorMessage(null);
    setStatusMessage(null);
    setPasswordVisible(false);
  }

  function markTouched(field: keyof CustomerAuthTouchedState) {
    setTouched((current) =>
      current[field] ? current : { ...current, [field]: true },
    );
  }

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);
    setTouched((current) => ({ ...current, email: true, password: true }));

    if (
      validateCustomerEmail(email, locale) ||
      validateCustomerLoginPassword(password, locale)
    ) {
      setErrorMessage(copy.fixHighlightedFields);
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
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as unknown;
        setErrorMessage(parseAuthErrorMessage(payload) ?? copy.signinFailed);
        return;
      }

      const auth = (await response.json()) as AuthResponse;
      writeStoredToken(auth.accessToken);
      setStatusMessage(copy.signinSuccess(auth.user.displayName));
      redirectToCustomerRoute(redirectTo);
    } finally {
      setSubmitting(false);
    }
  }

  async function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);
    setTouched({
      email: true,
      password: true,
      displayName: true,
      workspaceName: true,
    });

    if (
      validateCustomerDisplayName(displayName, locale) ||
      validateCustomerWorkspaceName(workspaceName, locale) ||
      validateCustomerEmail(email, locale) ||
      validateCustomerSignupPassword(password, locale)
    ) {
      setErrorMessage(copy.fixHighlightedFields);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          displayName,
          workspaceName: workspaceName.trim() || undefined,
        }),
      });

      if (!response.ok) {
        setErrorMessage(
          response.status === 409 ? copy.existingAccount : copy.signupFailed,
        );
        return;
      }

      const auth = (await response.json()) as AuthResponse;
      writeStoredToken(auth.accessToken);
      setStatusMessage(copy.signupSuccess(auth.user.displayName));
      resetTouched();
      redirectToCustomerRoute(redirectTo);
    } finally {
      setSubmitting(false);
    }
  }

  function continueWithGoogle(nextMode: CustomerAuthMode) {
    setErrorMessage(null);
    setStatusMessage(null);
    beginGoogleAuthorization(nextMode);
  }

  return {
    mode,
    setMode,
    copy,
    email,
    setEmail,
    password,
    setPassword,
    displayName,
    setDisplayName,
    workspaceName,
    setWorkspaceName,
    passwordVisible,
    setPasswordVisible,
    touched,
    markTouched,
    resetTouched,
    loginEmailError,
    loginPasswordError,
    signupEmailError,
    signupPasswordError,
    signupDisplayNameError,
    signupWorkspaceNameError,
    signupPasswordStrength,
    submitting,
    errorMessage,
    statusMessage,
    submitLogin,
    submitSignup,
    continueWithGoogle,
  };
}
