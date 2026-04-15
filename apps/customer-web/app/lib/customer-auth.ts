'use client';

import type { AccountMeResponse, AuthResponse } from '@elite-message/contracts';
import { setGlobalThemePreference } from '@elite-message/ui';
import {
  apiBaseUrl,
  clearStoredToken,
  readStoredToken,
  writeStoredToken,
} from './session';
import { redirectToCustomerRoute } from './customer-auth-form';

async function performCustomerRequest(request: () => Promise<Response>) {
  try {
    return await request();
  } catch {
    return null;
  }
}

export async function refreshCustomerAccessToken(
  onToken?: (token: string | null) => void,
) {
  const response = await performCustomerRequest(() =>
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

export async function requestWithCustomerRefresh(
  currentToken: string | null,
  requestFactory: (token: string) => Promise<Response>,
  onToken?: (token: string | null) => void,
) {
  let token = currentToken ?? readStoredToken();
  if (!token) {
    token = await refreshCustomerAccessToken(onToken);
  }

  if (!token) {
    return null;
  }

  const initialToken = token;
  let response = await performCustomerRequest(() =>
    requestFactory(initialToken),
  );
  if (!response) {
    return null;
  }

  if (response.status === 401) {
    token = await refreshCustomerAccessToken(onToken);
    if (!token) {
      return null;
    }

    const refreshedToken = token;
    response = await performCustomerRequest(() =>
      requestFactory(refreshedToken),
    );
    if (!response) {
      return null;
    }
  }

  return response;
}

export async function loadCustomerAccount(token: string) {
  const response = await performCustomerRequest(() =>
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

  if (!response.ok) {
    throw new Error('Could not load the customer account.');
  }

  const account = (await response.json()) as AccountMeResponse;
  setGlobalThemePreference(account.themePreference);
  return account;
}

export async function logoutCustomerSession() {
  await performCustomerRequest(() =>
    fetch(`${apiBaseUrl}/api/v1/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }),
  );

  clearStoredToken();
  redirectToCustomerRoute('/');
}
