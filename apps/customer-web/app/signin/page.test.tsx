import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemePreferenceProvider } from '@elite-message/ui';
import CustomerSigninRoute from './page';

const fetchMock = vi.fn();

function installThemeMatchMedia(matchesDark = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' ? matchesDark : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  installThemeMatchMedia(false);
});

afterEach(() => {
  cleanup();
  delete (
    window as Window & {
      __eliteCustomerAuthRedirectHook?: (path: string) => void;
    }
  ).__eliteCustomerAuthRedirectHook;
  delete document.documentElement.dataset.eliteTheme;
  delete document.documentElement.dataset.eliteThemePreference;
  document.documentElement.style.colorScheme = '';
  window.localStorage.clear();
  document.cookie =
    'elite-message.theme=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  vi.unstubAllGlobals();
  window.sessionStorage.clear();
});

function renderSigninRoute(
  initialPreference: 'light' | 'system' | 'dark' = 'light',
) {
  document.documentElement.dataset.eliteThemePreference = initialPreference;
  document.documentElement.dataset.eliteTheme =
    initialPreference === 'dark' ? 'dark' : 'light';
  document.documentElement.style.colorScheme =
    initialPreference === 'dark' ? 'dark' : 'light';

  return render(
    <ThemePreferenceProvider initialPreference={initialPreference}>
      <CustomerSigninRoute />
    </ThemePreferenceProvider>,
  );
}

describe('customer signin route', () => {
  it('renders dedicated signin route', async () => {
    renderSigninRoute();

    expect(screen.getAllByText('Sign in').length).toBeGreaterThan(0);
    expect(screen.getByText('Sign in with Google')).toBeTruthy();
    expect(screen.getByLabelText('Open sign-in help')).toBeTruthy();
    expect(screen.getByAltText('Elite Message brand logo.')).toBeTruthy();
    expect(
      decodeURIComponent(
        screen.getByAltText('Elite Message brand logo.').getAttribute('src') ??
          '',
      ),
    ).toContain('/images/elite-message-signin-logo.png');

    await waitFor(() => {
      expect(document.documentElement.dataset.eliteTheme).toBe('light');
    });
  }, 10000);

  it('uses the dark sign-in logo when the effective theme is dark', async () => {
    installThemeMatchMedia(true);
    renderSigninRoute('system');

    await waitFor(() => {
      expect(
        decodeURIComponent(
          screen
            .getByAltText('Elite Message brand logo.')
            .getAttribute('src') ?? '',
        ),
      ).toContain('/images/elite-message-icon-only-dark.png');
    });
  });

  it('updates the page theme when the user selects dark mode from the menu', async () => {
    renderSigninRoute();

    fireEvent.click(screen.getByRole('button', { name: /theme preference/i }));
    fireEvent.click(screen.getByRole('menuitemradio', { name: /dark/i }));

    await waitFor(() => {
      expect(document.documentElement.dataset.eliteThemePreference).toBe(
        'dark',
      );
      expect(document.documentElement.dataset.eliteTheme).toBe('dark');
    });
  }, 10000);

  it('opens the sign-in help dialog', async () => {
    renderSigninRoute();

    fireEvent.click(screen.getByLabelText('Open sign-in help'));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Sign-in help' })).toBeTruthy();
    });
  });

  it('signs in and redirects to /dashboard', async () => {
    const redirectSpy = vi.fn();
    (
      window as Window & {
        __eliteCustomerAuthRedirectHook?: (path: string) => void;
      }
    ).__eliteCustomerAuthRedirectHook = redirectSpy;
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          accessToken: 'customer-token',
          refreshToken: 'refresh-token',
          user: {
            id: 'user-1',
            email: 'owner@company.com',
            displayName: 'Owner',
            role: 'customer',
            createdAt: '2026-04-10T00:00:00.000Z',
          },
        }),
        {
          status: 200,
          headers: {
            'content-type': 'application/json',
          },
        },
      ),
    );

    renderSigninRoute();

    fireEvent.change(screen.getByPlaceholderText('owner@company.com'), {
      target: { value: 'owner@company.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'StrongPass123!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:3002/api/v1/auth/login',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        }),
      );
      expect(redirectSpy).toHaveBeenCalledWith('/dashboard');
    });

    expect(
      window.sessionStorage.getItem('elite-message.customer.access-token'),
    ).toBe('customer-token');
  }, 10000);
});
