import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import {
  ThemePreferenceProvider,
  resolveThemePreference,
  themePreferenceCookieName,
} from '@elite-message/ui';
import './globals.css';

export const metadata: Metadata = {
  title: 'Elite Message Admin',
  description: 'Admin dashboard foundation for Elite Message.',
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const themePreference = resolveThemePreference(
    cookieStore.get(themePreferenceCookieName)?.value,
  );
  const serverTheme = themePreference === 'dark' ? 'dark' : 'light';

  return (
    <html
      lang="en"
      data-elite-theme={serverTheme}
      data-elite-theme-preference={themePreference}
    >
      <body>
        <ThemePreferenceProvider initialPreference={themePreference}>
          {children}
        </ThemePreferenceProvider>
      </body>
    </html>
  );
}
