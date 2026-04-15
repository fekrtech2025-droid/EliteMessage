import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import {
  ThemePreferenceProvider,
  resolveThemePreference,
  themePreferenceCookieName,
} from '@elite-message/ui';
import { CustomerNavigationProgress } from './components/navigation-progress';
import { CustomerLocaleProvider } from './components/customer-localization';
import {
  getCustomerDirection,
  getCustomerHtmlLang,
  resolveCustomerLocale,
} from './lib/customer-locale';
import './globals.css';

export const metadata: Metadata = {
  title: 'Elite Message Customer',
  description: 'Customer dashboard foundation for Elite Message.',
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const locale = resolveCustomerLocale(
    cookieStore.get('elite-message.customer.locale')?.value,
  );
  const themePreference = resolveThemePreference(
    cookieStore.get(themePreferenceCookieName)?.value,
  );
  const serverTheme = themePreference === 'dark' ? 'dark' : 'light';

  return (
    <html
      lang={getCustomerHtmlLang(locale)}
      dir={getCustomerDirection(locale)}
      data-elite-customer-locale={locale}
      data-elite-theme={serverTheme}
      data-elite-theme-preference={themePreference}
    >
      <body>
        <ThemePreferenceProvider initialPreference={themePreference}>
          <CustomerLocaleProvider initialLocale={locale}>
            <Suspense fallback={null}>
              <CustomerNavigationProgress />
            </Suspense>
            {children}
          </CustomerLocaleProvider>
        </ThemePreferenceProvider>
      </body>
    </html>
  );
}
