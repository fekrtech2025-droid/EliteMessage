import { beforeEach, describe, expect, it, vi } from 'vitest';
import { refreshAdminAccessToken, requestWithAdminRefresh } from './admin-auth';
import { readStoredToken, storageKey } from './session';

describe('admin auth helpers', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('falls back to the stored token when refresh fails at the network layer', async () => {
    window.sessionStorage.setItem(storageKey, 'cached-admin-token');
    const fetchMock = vi
      .fn()
      .mockRejectedValue(new TypeError('Failed to fetch'));
    vi.stubGlobal('fetch', fetchMock);
    const onToken = vi.fn();

    const token = await refreshAdminAccessToken(onToken);

    expect(token).toBe('cached-admin-token');
    expect(readStoredToken()).toBe('cached-admin-token');
    expect(onToken).toHaveBeenCalledWith('cached-admin-token');
  });

  it('returns null when an authenticated request fails before a response is created', async () => {
    const response = await requestWithAdminRefresh('admin-token', () =>
      Promise.reject(new TypeError('Failed to fetch')),
    );

    expect(response).toBeNull();
  });
});
