'use client';

import type { GoogleAuthMode } from '@elite-message/contracts';
import { apiBaseUrl } from './session';

export type ParsedGoogleAuthCallback =
  | {
      kind: 'success';
      mode: GoogleAuthMode;
      accessToken: string;
    }
  | {
      kind: 'error';
      mode: GoogleAuthMode;
      errorCode: string;
      errorMessage: string;
    };

export function buildGoogleAuthorizationUrl(mode: GoogleAuthMode) {
  return `${apiBaseUrl}/api/v1/auth/google/authorize?mode=${encodeURIComponent(mode)}`;
}

export function beginGoogleAuthorization(mode: GoogleAuthMode) {
  window.location.assign(buildGoogleAuthorizationUrl(mode));
}

export function parseGoogleAuthCallbackHash(
  hash: string,
): ParsedGoogleAuthCallback {
  const fragment = hash.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(fragment);
  const mode = params.get('mode') === 'signup' ? 'signup' : 'login';
  const accessToken = params.get('access_token');

  if (accessToken) {
    return {
      kind: 'success',
      mode,
      accessToken,
    };
  }

  return {
    kind: 'error',
    mode,
    errorCode: params.get('error_code') ?? 'google_callback_invalid',
    errorMessage:
      params.get('error_message') ??
      'Google authentication could not be completed.',
  };
}
