'use client';

import {
  ThemePreferenceMenuButton,
  type ThemePreference,
} from '@elite-message/ui';
import { requestWithCustomerRefresh } from '../lib/customer-auth';
import { apiBaseUrl } from '../lib/session';
import { useCustomerLocale } from './customer-localization';

type CustomerThemeControlProps = {
  syncAccount?: boolean;
};

export function CustomerThemeControl({
  syncAccount = false,
}: CustomerThemeControlProps) {
  const { locale } = useCustomerLocale();
  const labels =
    locale === 'ar'
      ? {
          darkLabel: 'داكن',
          lightLabel: 'فاتح',
          menuLabel: 'خيارات المظهر',
          systemLabel: 'تلقائي',
          themeButtonLabel: 'المظهر',
        }
      : undefined;

  async function handlePreferenceChange(preference: ThemePreference) {
    if (!syncAccount) {
      return;
    }

    const response = await requestWithCustomerRefresh(null, (token) =>
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
      labels={labels}
      onPreferenceChange={syncAccount ? handlePreferenceChange : undefined}
    />
  );
}
