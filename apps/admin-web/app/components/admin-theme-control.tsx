'use client';

import {
  ThemePreferenceMenuButton,
  type ThemePreference,
} from '@elite-message/ui';
import { requestWithAdminRefresh } from '../lib/admin-auth';
import { apiBaseUrl } from '../lib/session';

type AdminThemeControlProps = {
  syncAccount?: boolean;
};

export function AdminThemeControl({
  syncAccount = false,
}: AdminThemeControlProps) {
  async function handlePreferenceChange(preference: ThemePreference) {
    if (!syncAccount) {
      return;
    }

    const response = await requestWithAdminRefresh(null, (token) =>
      fetch(`${apiBaseUrl}/api/v1/account/me/theme`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          themePreference: preference,
        }),
      }),
    );

    if (!response || !response.ok) {
      return;
    }
  }

  return (
    <ThemePreferenceMenuButton
      onPreferenceChange={syncAccount ? handlePreferenceChange : undefined}
    />
  );
}
