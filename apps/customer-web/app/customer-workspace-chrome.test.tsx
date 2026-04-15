import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import type { AccountMeResponse } from '@elite-message/contracts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CustomerWorkspaceControls } from './components/customer-workspace-chrome';

const { pushMock, requestWithCustomerRefreshMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  requestWithCustomerRefreshMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    push: pushMock,
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
}));

vi.mock('./lib/customer-auth', () => ({
  requestWithCustomerRefresh: requestWithCustomerRefreshMock,
}));

const account: AccountMeResponse = {
  themePreference: 'system',
  user: {
    id: 'user-1',
    email: 'owner121@elite.local',
    displayName: 'owner121@elite.local',
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
};

describe('CustomerWorkspaceControls', () => {
  beforeEach(() => {
    window.localStorage.clear();
    pushMock.mockReset();
    requestWithCustomerRefreshMock.mockReset();
    requestWithCustomerRefreshMock.mockResolvedValue(null);
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    delete document.documentElement.dataset.eliteCustomerLocale;
    delete document.documentElement.dataset.eliteTheme;
    delete document.documentElement.dataset.eliteThemePreference;
    document.cookie =
      'elite-message.theme=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  });

  afterEach(() => {
    cleanup();
  });

  it('routes the topbar shortcuts to real customer surfaces', () => {
    render(
      <CustomerWorkspaceControls
        account={account}
        workspaceId="workspace-1"
        onWorkspaceChange={vi.fn()}
        onLogout={vi.fn()}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: /open message search/i }),
    );
    fireEvent.click(
      screen.getByRole('button', { name: /open account settings/i }),
    );
    fireEvent.click(screen.getByRole('button', { name: /open subscription/i }));
    fireEvent.click(
      screen.getByRole('button', { name: /open queue messages/i }),
    );

    expect(pushMock).toHaveBeenNthCalledWith(
      1,
      '/messages?workspaceId=workspace-1&focus=recipient',
    );
    expect(pushMock).toHaveBeenNthCalledWith(
      2,
      '/settings?workspaceId=workspace-1&focus=tokens',
    );
    expect(pushMock).toHaveBeenNthCalledWith(
      3,
      '/subscription?workspaceId=workspace-1',
    );
    expect(pushMock).toHaveBeenNthCalledWith(
      4,
      '/messages?workspaceId=workspace-1&status=queue',
    );
  });

  it('persists locale and shared theme preference', async () => {
    render(
      <CustomerWorkspaceControls
        account={account}
        workspaceId="workspace-1"
        onWorkspaceChange={vi.fn()}
        onLogout={vi.fn()}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: /theme preference|المظهر/i }),
    );
    fireEvent.click(screen.getByRole('menuitemradio', { name: /dark|داكن/i }));
    fireEvent.click(
      screen.getByRole('button', { name: /language preference, english/i }),
    );

    await waitFor(() => {
      expect(document.documentElement.dataset.eliteCustomerLocale).toBe('ar');
    });

    expect(window.localStorage.getItem('elite-message.customer.locale')).toBe(
      'ar',
    );
    expect(window.localStorage.getItem('elite-message.theme')).toBe('dark');
    expect(document.documentElement.dataset.eliteCustomerLocale).toBe('ar');
    expect(document.documentElement.dataset.eliteTheme).toBe('dark');
    expect(document.documentElement.dataset.eliteThemePreference).toBe('dark');
    expect(
      screen
        .getByRole('button', { name: /language preference|تبديل اللغة/i })
        .getAttribute('aria-pressed'),
    ).toBe('true');
  });

  it('requests fullscreen from the browser', async () => {
    const requestFullscreenMock = vi.fn().mockResolvedValue(undefined);
    const exitFullscreenMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      configurable: true,
      value: requestFullscreenMock,
    });
    Object.defineProperty(document, 'exitFullscreen', {
      configurable: true,
      value: exitFullscreenMock,
    });

    render(
      <CustomerWorkspaceControls
        account={account}
        workspaceId="workspace-1"
        onWorkspaceChange={vi.fn()}
        onLogout={vi.fn()}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /enter fullscreen|الدخول إلى وضع ملء الشاشة/i,
      }),
    );

    await waitFor(() => {
      expect(requestFullscreenMock).toHaveBeenCalledTimes(1);
    });
  });
});
