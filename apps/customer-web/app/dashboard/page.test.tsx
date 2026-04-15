import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CustomerDashboardRoute from './page';

const {
  readStoredTokenMock,
  refreshCustomerAccessTokenMock,
  loadCustomerAccountMock,
  requestWithCustomerRefreshMock,
  socketIoMock,
  socketInstances,
  useCustomerLocaleMock,
} = vi.hoisted(() => {
  const socketInstances: Array<{
    on: ReturnType<typeof vi.fn>;
    off: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
  }> = [];

  return {
    readStoredTokenMock: vi.fn(),
    refreshCustomerAccessTokenMock: vi.fn(),
    loadCustomerAccountMock: vi.fn(),
    requestWithCustomerRefreshMock: vi.fn(),
    socketIoMock: vi.fn(() => {
      const socket = {
        on: vi.fn(),
        off: vi.fn(),
        disconnect: vi.fn(),
      };
      socketInstances.push(socket);
      return socket;
    }),
    socketInstances,
    useCustomerLocaleMock: vi.fn(),
  };
});

vi.mock('../lib/session', () => ({
  apiBaseUrl: 'http://localhost:3002',
  readStoredToken: readStoredTokenMock,
}));

vi.mock('../lib/customer-auth', () => ({
  loadCustomerAccount: loadCustomerAccountMock,
  logoutCustomerSession: vi.fn(),
  refreshCustomerAccessToken: refreshCustomerAccessTokenMock,
  requestWithCustomerRefresh: requestWithCustomerRefreshMock,
}));

vi.mock('../components/customer-localization', () => ({
  useCustomerLocale: useCustomerLocaleMock,
}));

vi.mock('@elite-message/ui', async () => {
  const { createElement, Fragment } = await import('react');

  function ActionButton({ children, ...props }: any) {
    return createElement('button', props, children);
  }

  function AppShell({
    title,
    subtitle,
    breadcrumbLabel,
    nav,
    meta,
    headerActions,
    footer,
    children,
    ...props
  }: any) {
    return createElement(
      'main',
      props,
      breadcrumbLabel
        ? createElement('div', { 'data-breadcrumb': breadcrumbLabel })
        : null,
      title ? createElement('h1', null, title) : null,
      subtitle ? createElement('p', null, subtitle) : null,
      nav,
      meta,
      headerActions,
      children,
      footer,
    );
  }

  function DefinitionGrid({ items, ...props }: any) {
    return createElement(
      'dl',
      props,
      items.map((item: any, index: number) =>
        createElement(
          'div',
          { key: index, 'data-tone': item.tone ?? 'neutral' },
          createElement('dt', null, item.label),
          createElement('dd', null, item.value),
        ),
      ),
    );
  }

  function Field({ label, hint, children, ...props }: any) {
    return createElement(
      'label',
      props,
      label ? createElement('span', null, label) : null,
      children,
      hint ? createElement('span', null, hint) : null,
    );
  }

  function InfoCard({ eyebrow, title, action, children, ...props }: any) {
    return createElement(
      'section',
      props,
      eyebrow ? createElement('div', null, eyebrow) : null,
      title ? createElement('h2', null, title) : null,
      action ?? null,
      children,
    );
  }

  function MetricCard({ label, value, hint, ...props }: any) {
    return createElement(
      'div',
      props,
      label ? createElement('div', null, label) : null,
      value != null ? createElement('div', null, value) : null,
      hint ? createElement('div', null, hint) : null,
    );
  }

  function MetricGrid({ children, ...props }: any) {
    return createElement('div', props, children);
  }

  function NoticeBanner({ title, children, ...props }: any) {
    return createElement(
      'div',
      props,
      title ? createElement('strong', null, title) : null,
      children,
    );
  }

  function SectionGrid({ children, ...props }: any) {
    return createElement('div', props, children);
  }

  function SelectInput({ children, ...props }: any) {
    return createElement('select', props, children);
  }

  function StatusBadge({ children, ...props }: any) {
    return createElement('span', props, children);
  }

  function TextInput(props: any) {
    return createElement('input', props);
  }

  function ThemePreferenceMenuButton({
    labels,
    onPreferenceChange,
    ...props
  }: any) {
    return createElement(
      'button',
      {
        type: 'button',
        onClick: () => {
          if (onPreferenceChange) {
            onPreferenceChange('dark');
          }
        },
        ...props,
      },
      labels?.themeButtonLabel ?? 'Theme preference',
    );
  }

  function useThemePreference() {
    return {
      setThemePreference: vi.fn(),
      themePreference: 'system',
    };
  }

  return {
    ActionButton,
    AppShell,
    DefinitionGrid,
    Field,
    Fragment,
    InfoCard,
    MetricCard,
    MetricGrid,
    NoticeBanner,
    SectionGrid,
    SelectInput,
    StatusBadge,
    TextInput,
    ThemePreferenceMenuButton,
    useThemePreference,
  };
});

vi.mock('socket.io-client', () => ({
  io: socketIoMock,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    push: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
}));

function jsonResponse(payload: unknown) {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}

function createCustomerLocale(locale: 'en' | 'ar') {
  return {
    direction: 'ltr',
    intlLocale: locale === 'ar' ? 'ar-SY' : 'en-US',
    isRtl: false,
    locale,
    setLocale: vi.fn(),
    toggleLocale: vi.fn(),
  };
}

function renderDashboardRoute(locale: 'en' | 'ar' = 'en') {
  useCustomerLocaleMock.mockReturnValue(createCustomerLocale(locale));
  return render(<CustomerDashboardRoute />);
}

describe('customer dashboard route', () => {
  beforeEach(() => {
    readStoredTokenMock.mockReset();
    refreshCustomerAccessTokenMock.mockReset();
    loadCustomerAccountMock.mockReset();
    requestWithCustomerRefreshMock.mockReset();
    socketIoMock.mockReset();
    socketInstances.splice(0, socketInstances.length);
    useCustomerLocaleMock.mockReset();

    readStoredTokenMock.mockReturnValue(null);
    refreshCustomerAccessTokenMock.mockResolvedValue(null);
    loadCustomerAccountMock.mockResolvedValue(null);
    requestWithCustomerRefreshMock.mockResolvedValue(null);
    useCustomerLocaleMock.mockReturnValue(createCustomerLocale('en'));
  });

  afterEach(() => {
    cleanup();
  });

  it('requires a session instead of rendering inline auth on /dashboard', async () => {
    renderDashboardRoute();

    await waitFor(() => {
      expect(screen.getByText('Sign in required')).toBeTruthy();
    });

    expect(screen.queryByRole('button', { name: 'Create account' })).toBeNull();
    expect(
      screen
        .getByRole('link', { name: 'Return to sign in' })
        .getAttribute('href'),
    ).toBe('/signin');
  });

  it('keeps the dashboard visible when a background token fetch fails after the initial load', async () => {
    readStoredTokenMock.mockReturnValue('stored-token');
    loadCustomerAccountMock.mockResolvedValue({
      themePreference: 'system',
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
    });
    requestWithCustomerRefreshMock.mockResolvedValueOnce(
      jsonResponse({
        items: [
          {
            id: 'instance-1',
            publicId: 'inst_001',
            workspaceId: 'workspace-1',
            workspaceName: 'Primary Workspace',
            name: 'Primary Sender',
            status: 'authenticated',
            substatus: 'connected',
            sendDelay: 1,
            sendDelayMax: 15,
            assignedWorkerId: null,
            assignedWorkerStatus: null,
            assignedWorkerRegion: null,
            latestEventAt: '2026-04-10T00:00:00.000Z',
            createdAt: '2026-04-10T00:00:00.000Z',
            updatedAt: '2026-04-10T00:00:00.000Z',
          },
        ],
      }),
    );
    requestWithCustomerRefreshMock.mockResolvedValueOnce(null);

    renderDashboardRoute();

    expect(await screen.findByText('Workspace overview')).toBeTruthy();

    await waitFor(() => {
      expect(screen.queryByText('Sign in required')).toBeNull();
    });

    expect(screen.getByText('Workspace API tokens')).toBeTruthy();
    expect(screen.queryByText('Could not reach the customer API.')).toBeNull();
  });

  it('renders the dashboard copy in Arabic when the customer locale is ar', async () => {
    readStoredTokenMock.mockReturnValue('stored-token');
    loadCustomerAccountMock.mockResolvedValue({
      themePreference: 'system',
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
    });
    requestWithCustomerRefreshMock.mockResolvedValueOnce(
      jsonResponse({
        items: [
          {
            id: 'instance-1',
            publicId: 'inst_001',
            workspaceId: 'workspace-1',
            workspaceName: 'Primary Workspace',
            name: 'Primary Sender',
            status: 'authenticated',
            substatus: 'connected',
            sendDelay: 1,
            sendDelayMax: 15,
            assignedWorkerId: null,
            assignedWorkerStatus: null,
            assignedWorkerRegion: null,
            latestEventAt: '2026-04-10T00:00:00.000Z',
            createdAt: '2026-04-10T00:00:00.000Z',
            updatedAt: '2026-04-10T00:00:00.000Z',
          },
        ],
      }),
    );

    renderDashboardRoute('ar');

    expect(await screen.findByText('لوحة تحكم العميل')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'إنشاء مثيل' })).toBeTruthy();
    expect(screen.getByText('رموز API الخاصة بمساحة العمل')).toBeTruthy();
  });

  it('keeps the realtime socket and token refresh stable after the dashboard becomes ready', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    readStoredTokenMock.mockReturnValue('stored-token');
    loadCustomerAccountMock.mockResolvedValue({
      themePreference: 'system',
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
    });
    requestWithCustomerRefreshMock
      .mockResolvedValueOnce(
        jsonResponse({
          items: [
            {
              id: 'instance-1',
              publicId: 'inst_001',
              workspaceId: 'workspace-1',
              workspaceName: 'Primary Workspace',
              name: 'Primary Sender',
              status: 'authenticated',
              substatus: 'connected',
              sendDelay: 1,
              sendDelayMax: 15,
              assignedWorkerId: null,
              assignedWorkerStatus: null,
              assignedWorkerRegion: null,
              latestEventAt: '2026-04-10T00:00:00.000Z',
              createdAt: '2026-04-10T00:00:00.000Z',
              updatedAt: '2026-04-10T00:00:00.000Z',
            },
          ],
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          items: [],
        }),
      );

    renderDashboardRoute();

    try {
      expect(await screen.findByText('Workspace overview')).toBeTruthy();

      await waitFor(() => {
        expect(screen.queryByText('Sign in required')).toBeNull();
      });

      await new Promise((resolve) => {
        setTimeout(resolve, 75);
      });

      expect(socketIoMock).toHaveBeenCalledTimes(1);
      expect(socketInstances).toHaveLength(1);
      expect(socketInstances[0]!.disconnect).not.toHaveBeenCalled();
      expect(requestWithCustomerRefreshMock).toHaveBeenCalledTimes(2);
    } finally {
      process.env.NODE_ENV = originalNodeEnv;
    }
  });
});
