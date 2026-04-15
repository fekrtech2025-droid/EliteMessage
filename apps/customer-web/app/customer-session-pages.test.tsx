import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import type { AccountMeResponse } from '@elite-message/contracts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CustomerNav } from './components/customer-nav';
import { CustomerWorkspaceControls } from './components/customer-workspace-chrome';
import { CustomerMessagesPage } from './messages/page-client';
import { CustomerSettingsPage } from './settings/page-client';
import { CustomerSubscriptionPage } from './subscription/page-client';
import { CustomerApiDocumentsPage } from './api-documents/page-client';

const {
  pushMock,
  readStoredTokenMock,
  refreshCustomerAccessTokenMock,
  loadCustomerAccountMock,
  requestWithCustomerRefreshMock,
} = vi.hoisted(() => ({
  pushMock: vi.fn(),
  readStoredTokenMock: vi.fn(),
  refreshCustomerAccessTokenMock: vi.fn(),
  loadCustomerAccountMock: vi.fn(),
  requestWithCustomerRefreshMock: vi.fn(),
}));

vi.mock('./lib/session', () => ({
  apiBaseUrl: 'http://localhost:3002',
  clearStoredToken: vi.fn(),
  readStoredToken: readStoredTokenMock,
  writeStoredToken: vi.fn(),
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
  loadCustomerAccount: loadCustomerAccountMock,
  refreshCustomerAccessToken: refreshCustomerAccessTokenMock,
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

function jsonResponse(payload: unknown) {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}

async function waitForStableCustomerPage() {
  await waitFor(() => {
    expect(screen.queryByText('Sign in required')).toBeNull();
  });

  await new Promise((resolve) => {
    setTimeout(resolve, 50);
  });
}

describe('customer secondary pages', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
    window.localStorage.clear();
    readStoredTokenMock.mockReset();
    refreshCustomerAccessTokenMock.mockReset();
    loadCustomerAccountMock.mockReset();
    requestWithCustomerRefreshMock.mockReset();
    pushMock.mockReset();
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    delete document.documentElement.dataset.eliteCustomerLocale;
    delete document.documentElement.dataset.eliteTheme;
    delete document.documentElement.dataset.eliteThemePreference;
    document.cookie =
      'elite-message.theme=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    readStoredTokenMock.mockReturnValue('stored-token');
    refreshCustomerAccessTokenMock.mockResolvedValue(null);
    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      configurable: true,
      value: vi.fn(),
    });
    Object.defineProperty(document, 'exitFullscreen', {
      configurable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('keeps the messages page authenticated after the initial ready state', async () => {
    loadCustomerAccountMock
      .mockResolvedValueOnce(account)
      .mockResolvedValueOnce(null);
    requestWithCustomerRefreshMock
      .mockResolvedValueOnce(jsonResponse({ items: [] }))
      .mockResolvedValueOnce(jsonResponse({ items: [] }))
      .mockResolvedValueOnce(jsonResponse({ items: [] }))
      .mockResolvedValue(null);

    render(<CustomerMessagesPage />);

    expect(await screen.findByText('Message scope')).toBeTruthy();
    await waitForStableCustomerPage();

    expect(loadCustomerAccountMock).toHaveBeenCalledTimes(1);
    expect(refreshCustomerAccessTokenMock).not.toHaveBeenCalled();
    expect(requestWithCustomerRefreshMock).toHaveBeenCalledTimes(3);
  });

  it('keeps the settings page authenticated after the initial ready state', async () => {
    loadCustomerAccountMock
      .mockResolvedValueOnce(account)
      .mockResolvedValueOnce(null);
    requestWithCustomerRefreshMock
      .mockResolvedValueOnce(jsonResponse({ items: [] }))
      .mockResolvedValue(null);

    render(<CustomerSettingsPage />);

    expect(await screen.findByText('Customer profile')).toBeTruthy();
    await waitForStableCustomerPage();

    expect(loadCustomerAccountMock).toHaveBeenCalledTimes(1);
    expect(refreshCustomerAccessTokenMock).not.toHaveBeenCalled();
    expect(requestWithCustomerRefreshMock).toHaveBeenCalledTimes(1);
  });

  it('keeps the subscription page authenticated after the initial ready state', async () => {
    loadCustomerAccountMock
      .mockResolvedValueOnce(account)
      .mockResolvedValueOnce(null);
    requestWithCustomerRefreshMock
      .mockResolvedValueOnce(
        jsonResponse({
          planName: 'Starter',
          status: 'trialing',
          billingMode: 'manual',
          currentPeriodStart: '2026-04-01T00:00:00.000Z',
          currentPeriodEnd: '2026-05-01T00:00:00.000Z',
          trialEndsAt: '2026-05-10T00:00:00.000Z',
          instanceCount: 1,
          linkedInstanceCount: 1,
          webhookEnabledInstanceCount: 0,
          notes: ['Trial active'],
          workspace: {
            id: 'workspace-1',
            name: 'Primary Workspace',
          },
        }),
      )
      .mockResolvedValue(null);

    render(<CustomerSubscriptionPage />);

    expect(await screen.findByText('Select a workspace')).toBeTruthy();
    await waitForStableCustomerPage();

    expect(loadCustomerAccountMock).toHaveBeenCalledTimes(1);
    expect(refreshCustomerAccessTokenMock).not.toHaveBeenCalled();
    expect(requestWithCustomerRefreshMock).toHaveBeenCalledTimes(1);
  });

  it('keeps the API documents page authenticated after the initial ready state', async () => {
    loadCustomerAccountMock
      .mockResolvedValueOnce(account)
      .mockResolvedValueOnce(null);
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

    render(<CustomerApiDocumentsPage />);

    expect(
      await screen.findByText('From instance creation to API calls'),
    ).toBeTruthy();
    await waitForStableCustomerPage();

    expect(loadCustomerAccountMock).toHaveBeenCalledTimes(1);
    expect(refreshCustomerAccessTokenMock).not.toHaveBeenCalled();
    expect(requestWithCustomerRefreshMock).toHaveBeenCalledTimes(1);
  });

  it('syncs customer message filters from and back to the URL', async () => {
    window.history.replaceState(
      {},
      '',
      '/messages?workspaceId=workspace-1&instanceId=11111111-1111-4111-8111-111111111111&status=sent&to=963',
    );

    loadCustomerAccountMock.mockResolvedValue(account);
    requestWithCustomerRefreshMock.mockImplementationOnce(() =>
      Promise.resolve(
        jsonResponse({
          items: [
            {
              id: '11111111-1111-4111-8111-111111111111',
              publicId: 'cust-001',
              workspaceId: 'workspace-1',
              workspaceName: 'Primary Workspace',
              name: 'Primary Sender',
              status: 'standby',
              substatus: null,
              sendDelay: 1,
              sendDelayMax: 15,
              assignedWorkerId: null,
              assignedWorkerStatus: null,
              assignedWorkerRegion: null,
              latestEventAt: null,
              createdAt: '2026-04-10T00:00:00.000Z',
              updatedAt: '2026-04-10T00:00:00.000Z',
            },
          ],
        }),
      ),
    );
    requestWithCustomerRefreshMock.mockImplementation(() =>
      Promise.resolve(jsonResponse({ items: [] })),
    );

    render(<CustomerMessagesPage />);

    expect(await screen.findByText('Message scope')).toBeTruthy();
    await waitFor(() => {
      expect(
        (screen.getByLabelText('Workspace') as HTMLSelectElement).value,
      ).toBe('workspace-1');
      expect(
        (screen.getByLabelText('Instance') as HTMLSelectElement).value,
      ).toBe('11111111-1111-4111-8111-111111111111');
      expect(
        (screen.getByLabelText('Outbound status') as HTMLSelectElement).value,
      ).toBe('sent');
      expect(
        (screen.getByLabelText('Recipient contains') as HTMLInputElement).value,
      ).toBe('963');
    });

    fireEvent.change(screen.getByLabelText('Recipient contains'), {
      target: { value: '963999' },
    });

    await waitFor(() => {
      expect(window.location.search).toContain('to=963999');
    });
  });

  it('removes signup from the authenticated customer rail', () => {
    render(<CustomerNav current="dashboard" account={account} />);

    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.getByText('API Documents')).toBeTruthy();
    expect(screen.queryByText('Signup')).toBeNull();
  });

  it('wires the customer topbar icons to real actions', async () => {
    const onWorkspaceChange = vi.fn();
    const onLogout = vi.fn();

    render(
      <CustomerWorkspaceControls
        account={account}
        workspaceId="workspace-1"
        onWorkspaceChange={onWorkspaceChange}
        onLogout={onLogout}
      />,
    );

    fireEvent.click(
      screen.getByLabelText(/Language preference, English|تبديل اللغة/i),
    );
    await waitFor(() => {
      expect(document.documentElement.dataset.eliteCustomerLocale).toBe('ar');
      expect(window.localStorage.getItem('elite-message.customer.locale')).toBe(
        'ar',
      );
    });

    fireEvent.click(
      screen.getByLabelText(/Enter fullscreen|الدخول إلى وضع ملء الشاشة/i),
    );
    expect(document.documentElement.requestFullscreen).toHaveBeenCalledTimes(1);

    fireEvent.click(
      screen.getByLabelText(/Open message search|فتح صفحة الرسائل/i),
    );
    expect(pushMock).toHaveBeenLastCalledWith(
      '/messages?workspaceId=workspace-1&focus=recipient',
    );

    fireEvent.click(
      screen.getByLabelText(/Open account settings|فتح الإعدادات/i),
    );
    expect(pushMock).toHaveBeenLastCalledWith(
      '/settings?workspaceId=workspace-1&focus=tokens',
    );

    fireEvent.click(screen.getByLabelText(/Theme preference|المظهر/i));
    fireEvent.click(screen.getByRole('menuitemradio', { name: /Dark|داكن/i }));
    await waitFor(() => {
      expect(document.documentElement.dataset.eliteTheme).toBe('dark');
      expect(document.documentElement.dataset.eliteThemePreference).toBe(
        'dark',
      );
      expect(window.localStorage.getItem('elite-message.theme')).toBe('dark');
    });

    fireEvent.click(
      screen.getByLabelText(/Open subscription|فتح صفحة الاشتراك/i),
    );
    expect(pushMock).toHaveBeenLastCalledWith(
      '/subscription?workspaceId=workspace-1',
    );

    fireEvent.click(
      screen.getByLabelText(/Open queue messages|عرض الرسائل في الانتظار/i),
    );
    expect(pushMock).toHaveBeenLastCalledWith(
      '/messages?workspaceId=workspace-1&status=queue',
    );

    expect(onWorkspaceChange).not.toHaveBeenCalled();
    expect(onLogout).not.toHaveBeenCalled();
  });
});
