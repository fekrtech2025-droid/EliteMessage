import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import type { AccountMeResponse } from '@elite-message/contracts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminMessagesPage } from './page-client';

const {
  refreshAdminAccessTokenMock,
  loadAdminAccountMock,
  requestWithAdminRefreshMock,
} = vi.hoisted(() => ({
  refreshAdminAccessTokenMock: vi.fn(),
  loadAdminAccountMock: vi.fn(),
  requestWithAdminRefreshMock: vi.fn(),
}));

vi.mock('../lib/session', () => ({
  apiBaseUrl: 'http://localhost:3002',
  clearStoredToken: vi.fn(),
  readStoredToken: vi.fn(),
  writeStoredToken: vi.fn(),
}));

vi.mock('../lib/admin-auth', () => ({
  refreshAdminAccessToken: refreshAdminAccessTokenMock,
  loadAdminAccount: loadAdminAccountMock,
  requestWithAdminRefresh: requestWithAdminRefreshMock,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/messages',
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const account: AccountMeResponse = {
  themePreference: 'system',
  user: {
    id: 'admin-1',
    email: 'admin@elite.local',
    displayName: 'Admin User',
    role: 'platform_admin',
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

describe('admin message explorer', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
    refreshAdminAccessTokenMock.mockReset();
    loadAdminAccountMock.mockReset();
    requestWithAdminRefreshMock.mockReset();

    refreshAdminAccessTokenMock.mockResolvedValue('admin-token');
    loadAdminAccountMock.mockResolvedValue(account);
    requestWithAdminRefreshMock.mockImplementation(() =>
      Promise.resolve(jsonResponse({ items: [] })),
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('hydrates filters from the URL and syncs updates back to it', async () => {
    window.history.replaceState(
      {},
      '',
      '/messages?instanceId=instance-123&messageStatus=sent&webhookStatus=failed&eventType=message_create&recipient=963&referenceId=ref-1&sender=sender-1&limit=25',
    );

    render(<AdminMessagesPage />);

    expect(await screen.findByText('Global message filters')).toBeTruthy();
    expect(
      (screen.getByLabelText('Instance ID') as HTMLInputElement).value,
    ).toBe('instance-123');
    expect(
      (screen.getByLabelText('Outbound status') as HTMLSelectElement).value,
    ).toBe('sent');
    expect(
      (screen.getByLabelText('Webhook status') as HTMLSelectElement).value,
    ).toBe('failed');
    expect(
      (screen.getByLabelText('Webhook event') as HTMLSelectElement).value,
    ).toBe('message_create');
    expect(
      (screen.getByLabelText('Recipient contains') as HTMLInputElement).value,
    ).toBe('963');
    expect(
      (screen.getByLabelText('Reference ID contains') as HTMLInputElement)
        .value,
    ).toBe('ref-1');
    expect(
      (screen.getByLabelText('Inbound sender contains') as HTMLInputElement)
        .value,
    ).toBe('sender-1');
    expect((screen.getByLabelText('Limit') as HTMLInputElement).value).toBe(
      '25',
    );

    fireEvent.change(screen.getByLabelText('Limit'), {
      target: { value: '15' },
    });

    await waitFor(() => {
      expect(window.location.search).toContain('limit=15');
    });
  });
});
