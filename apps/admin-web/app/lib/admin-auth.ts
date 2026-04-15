'use client';

import type { AccountMeResponse, AuthResponse } from '@elite-message/contracts';
import { setGlobalThemePreference } from '@elite-message/ui';
import {
  apiBaseUrl,
  clearStoredToken,
  readStoredToken,
  writeStoredToken,
} from './session';

async function performAdminRequest(request: () => Promise<Response>) {
  try {
    return await request();
  } catch {
    return null;
  }
}

export async function refreshAdminAccessToken(
  onToken?: (token: string | null) => void,
) {
  const response = await performAdminRequest(() =>
    fetch(`${apiBaseUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    }),
  );

  if (!response) {
    const storedToken = readStoredToken();
    onToken?.(storedToken);
    return storedToken;
  }

  if (!response.ok) {
    clearStoredToken();
    onToken?.(null);
    return null;
  }

  const auth = (await response.json()) as AuthResponse;
  writeStoredToken(auth.accessToken);
  onToken?.(auth.accessToken);
  return auth.accessToken;
}

export async function requestWithAdminRefresh(
  currentToken: string | null,
  requestFactory: (token: string) => Promise<Response>,
  onToken?: (token: string | null) => void,
) {
  let token = currentToken ?? readStoredToken();
  if (!token) {
    token = await refreshAdminAccessToken(onToken);
  }

  if (!token) {
    return null;
  }

  const initialToken = token;
  let response = await performAdminRequest(() => requestFactory(initialToken));
  if (!response) {
    return null;
  }

  if (response.status === 401) {
    token = await refreshAdminAccessToken(onToken);
    if (!token) {
      return null;
    }

    const refreshedToken = token;
    response = await performAdminRequest(() => requestFactory(refreshedToken));
    if (!response) {
      return null;
    }
  }

  return response;
}

export async function loadAdminAccount(token: string) {
  const response = await performAdminRequest(() =>
    fetch(`${apiBaseUrl}/api/v1/account/me`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    }),
  );

  if (!response) {
    return null;
  }

  if (response.status === 401) {
    return null;
  }

  if (response.status === 403) {
    throw new Error('This account cannot open the admin console.');
  }

  if (!response.ok) {
    throw new Error('Could not load the admin account.');
  }

  const account = (await response.json()) as AccountMeResponse;
  setGlobalThemePreference(account.themePreference);
  return account;
}
