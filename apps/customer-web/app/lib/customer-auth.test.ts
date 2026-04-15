import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  loadCustomerAccount,
  logoutCustomerSession,
  refreshCustomerAccessToken,
  requestWithCustomerRefresh,
} from './customer-auth';
import { readStoredToken, storageKey } from './session';

describe('customer auth helpers', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    delete (
      window as Window & {
        __eliteCustomerAuthRedirectHook?: (path: string) => void;
      }
    ).__eliteCustomerAuthRedirectHook;
    vi.restoreAllMocks();
  });

  it('logs out and redirects to the landing page', async () => {
    const redirectSpy = vi.fn();
    (
      window as Window & {
        __eliteCustomerAuthRedirectHook?: (path: string) => void;
      }
    ).__eliteCustomerAuthRedirectHook = redirectSpy;
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    window.sessionStorage.setItem(storageKey, 'cached-customer-token');

    await logoutCustomerSession();

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3002/api/v1/auth/logout',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      }),
    );
    expect(readStoredToken()).toBeNull();
    expect(redirectSpy).toHaveBeenCalledWith('/');
  });

  it('falls back to the stored token when refresh fails at the network layer', async () => {
    window.sessionStorage.setItem(storageKey, 'cached-customer-token');
    const fetchMock = vi
      .fn()
      .mockRejectedValue(new TypeError('Failed to fetch'));
    vi.stubGlobal('fetch', fetchMock);
    const onToken = vi.fn();

    const token = await refreshCustomerAccessToken(onToken);

    expect(token).toBe('cached-customer-token');
    expect(readStoredToken()).toBe('cached-customer-token');
    expect(onToken).toHaveBeenCalledWith('cached-customer-token');
  });

  it('returns null when an authenticated request fails before a response is created', async () => {
    const response = await requestWithCustomerRefresh('customer-token', () =>
      Promise.reject(new TypeError('Failed to fetch')),
    );

    expect(response).toBeNull();
  });

  it('loads the customer account on browsers that only expose matchMedia.addListener', async () => {
    const addListener = vi.fn();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue({
        matches: false,
        addListener,
        removeListener: vi.fn(),
      }),
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            user: {
              id: 'user-1',
              email: 'owner@elite.local',
              displayName: 'Owner',
              role: 'customer',
              createdAt: '2026-04-10T00:00:00.000Z',
            },
            workspaces: [
              {
                id: 'workspace-1',
                name: 'Primary Workspace',
                slug: 'primary-workspace',
                role: 'owner',
                createdAt: '2026-04-10T00:00:00.000Z',
              },
            ],
            themePreference: 'system',
          }),
          {
            status: 200,
            headers: {
              'content-type': 'application/json',
            },
          },
        ),
      ),
    );

    const account = await loadCustomerAccount('customer-token');

    expect(account?.user.email).toBe('owner@elite.local');
    expect(addListener).toHaveBeenCalledTimes(1);
  });
});
