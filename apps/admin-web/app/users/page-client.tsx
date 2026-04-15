'use client';

import { useEffect, useState } from 'react';
import type {
  AccountMeResponse,
  AdminUserDetailResponse,
  AdminUserSummary,
  ListAdminUsersResponse,
  UpdateAdminUserStatusResponse,
} from '@elite-message/contracts';
import {
  ActionButton,
  AppShell,
  DefinitionGrid,
  InfoCard,
  NoticeBanner,
  SectionGrid,
  StatusBadge,
} from '@elite-message/ui';
import { AdminNav } from '../components/admin-nav';
import { AdminTopbarControls } from '../components/admin-topbar-controls';
import {
  loadAdminAccount,
  refreshAdminAccessToken,
  requestWithAdminRefresh,
} from '../lib/admin-auth';
import { formatDate, statusTone } from '../lib/admin-format';
import { apiBaseUrl } from '../lib/session';

type PageState = 'loading' | 'unauthenticated' | 'ready';

export function AdminUsersPage() {
  const [pageState, setPageState] = useState<PageState>('loading');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountMeResponse | null>(null);
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedUser, setSelectedUser] =
    useState<AdminUserDetailResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  async function loadUsers(tokenOverride?: string | null) {
    const response = await requestWithAdminRefresh(
      tokenOverride ?? accessToken,
      (token) =>
        fetch(`${apiBaseUrl}/api/v1/admin/users`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        }),
      setAccessToken,
    );

    if (!response) {
      setPageState('unauthenticated');
      return;
    }

    if (!response.ok) {
      throw new Error('Could not load admin users.');
    }

    const payload = (await response.json()) as ListAdminUsersResponse;
    setUsers(payload.items);
    if (!selectedUserId && payload.items[0]) {
      setSelectedUserId(payload.items[0].id);
    }
  }

  async function loadUserDetail(userId: string, tokenOverride?: string | null) {
    if (!userId) {
      setSelectedUser(null);
      return;
    }

    const response = await requestWithAdminRefresh(
      tokenOverride ?? accessToken,
      (token) =>
        fetch(`${apiBaseUrl}/api/v1/admin/users/${userId}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        }),
      setAccessToken,
    );

    if (!response) {
      setPageState('unauthenticated');
      return;
    }

    if (!response.ok) {
      throw new Error('Could not load the selected admin user.');
    }

    setSelectedUser((await response.json()) as AdminUserDetailResponse);
  }

  useEffect(() => {
    void (async () => {
      try {
        const token = await refreshAdminAccessToken(setAccessToken);
        if (!token) {
          setPageState('unauthenticated');
          return;
        }

        const me = await loadAdminAccount(token);
        if (!me) {
          setPageState('unauthenticated');
          return;
        }

        setAccount(me);
        await loadUsers(token);
        setPageState('ready');
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Could not load the admin users page.',
        );
        setPageState('unauthenticated');
      }
    })();
  }, []);

  useEffect(() => {
    if (pageState !== 'ready' || !selectedUserId) {
      return;
    }

    void loadUserDetail(selectedUserId).catch((error) => {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not load the selected admin user.',
      );
    });
  }, [pageState, selectedUserId]);

  async function updateStatus(userId: string, status: 'active' | 'suspended') {
    setBusyUserId(userId);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await requestWithAdminRefresh(
        accessToken,
        (token) =>
          fetch(`${apiBaseUrl}/api/v1/admin/users/${userId}/status`, {
            method: 'PATCH',
            headers: {
              authorization: `Bearer ${token}`,
              'content-type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ status }),
          }),
        setAccessToken,
      );

      if (!response) {
        setPageState('unauthenticated');
        return;
      }

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(
          payload?.message ?? 'Could not update the user status.',
        );
      }

      const payload = (await response.json()) as UpdateAdminUserStatusResponse;
      setStatusMessage(
        `Updated ${payload.user.displayName} to ${payload.user.status}.`,
      );
      await loadUsers();
      await loadUserDetail(userId);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not update the user status.',
      );
    } finally {
      setBusyUserId(null);
    }
  }

  return (
    <AppShell
      title="Admin Users"
      subtitle="Manage operator access, inspect active sessions, and suspend customer accounts without leaving the admin console."
      surface="admin"
      density="compact"
      nav={
        pageState === 'ready' ? (
          <AdminNav current="users" account={account} />
        ) : undefined
      }
      headerActions={
        pageState === 'ready' && account ? (
          <AdminTopbarControls account={account} />
        ) : undefined
      }
      meta={
        account ? (
          <StatusBadge tone="warning">{users.length} user records</StatusBadge>
        ) : undefined
      }
      footer={<a href="/">Back to dashboard</a>}
    >
      {pageState === 'loading' ? (
        <InfoCard eyebrow="Users" title="Loading admin users">
          <p style={{ margin: 0 }}>
            Refreshing the admin session and loading user records.
          </p>
        </InfoCard>
      ) : null}

      {pageState === 'unauthenticated' ? (
        <InfoCard eyebrow="Session" title="Admin sign-in required">
          <p style={{ marginTop: 0 }}>
            The admin session is missing or expired.
          </p>
          <p style={{ marginBottom: 0 }}>
            <a href="/">Return to the admin dashboard login</a>
          </p>
        </InfoCard>
      ) : null}

      {pageState === 'ready' ? (
        <SectionGrid minItemWidth={320}>
          <InfoCard eyebrow="Directory" title="All platform users">
            {users.length === 0 ? (
              <p style={{ margin: 0 }}>No user records were found.</p>
            ) : (
              <ul className="elite-list">
                {users.map((user) => (
                  <li key={user.id} className="elite-list-item">
                    <div className="elite-list-title">
                      <button
                        type="button"
                        data-unstyled-button
                        onClick={() => setSelectedUserId(user.id)}
                        style={{
                          border: 0,
                          padding: 0,
                          background: 'transparent',
                          fontWeight: 800,
                          color:
                            user.id === selectedUserId
                              ? 'var(--elite-accent-2)'
                              : 'var(--elite-ink)',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        {user.displayName}
                      </button>
                      <StatusBadge tone={statusTone(user.status)}>
                        {user.status}
                      </StatusBadge>
                      <StatusBadge
                        tone={
                          user.role === 'platform_admin' ? 'warning' : 'neutral'
                        }
                      >
                        {user.role}
                      </StatusBadge>
                    </div>
                    <div className="elite-list-meta">
                      <span>{user.email}</span>
                      <span>Created {formatDate(user.createdAt)}</span>
                      <span>Last refresh {formatDate(user.lastRefreshAt)}</span>
                    </div>
                    <DefinitionGrid
                      minItemWidth={120}
                      items={[
                        { label: 'Workspaces', value: user.workspaceCount },
                        { label: 'Instances', value: user.instanceCount },
                        {
                          label: 'Sessions',
                          value: user.activeRefreshSessionCount,
                        },
                      ]}
                    />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                      <ActionButton
                        type="button"
                        tone={user.status === 'active' ? 'danger' : 'secondary'}
                        disabled={busyUserId === user.id}
                        onClick={() =>
                          void updateStatus(
                            user.id,
                            user.status === 'active' ? 'suspended' : 'active',
                          )
                        }
                      >
                        {busyUserId === user.id
                          ? 'Updating...'
                          : user.status === 'active'
                            ? 'Suspend user'
                            : 'Reactivate user'}
                      </ActionButton>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>

          <InfoCard
            eyebrow="Detail"
            title={
              selectedUser
                ? `User detail: ${selectedUser.user.displayName}`
                : 'User detail'
            }
          >
            {!selectedUser ? (
              <p style={{ margin: 0 }}>
                Select a user from the directory to inspect workspace
                memberships and session activity.
              </p>
            ) : (
              <div style={{ display: 'grid', gap: 18 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <StatusBadge tone={statusTone(selectedUser.user.status)}>
                    {selectedUser.user.status}
                  </StatusBadge>
                  <StatusBadge
                    tone={
                      selectedUser.user.role === 'platform_admin'
                        ? 'warning'
                        : 'neutral'
                    }
                  >
                    {selectedUser.user.role}
                  </StatusBadge>
                  <StatusBadge tone="info">
                    {selectedUser.user.email}
                  </StatusBadge>
                </div>
                <DefinitionGrid
                  items={[
                    {
                      label: 'Active sessions',
                      value: selectedUser.user.activeRefreshSessionCount,
                    },
                    {
                      label: 'Created instances',
                      value: selectedUser.user.instanceCount,
                    },
                    {
                      label: 'Last refresh',
                      value: formatDate(selectedUser.user.lastRefreshAt),
                    },
                  ]}
                />
                <div>
                  <div
                    className="elite-field-label"
                    style={{ marginBottom: 10 }}
                  >
                    Workspace memberships
                  </div>
                  {selectedUser.workspaces.length === 0 ? (
                    <p style={{ margin: 0 }}>
                      This user does not belong to any workspace.
                    </p>
                  ) : (
                    <ul className="elite-list">
                      {selectedUser.workspaces.map((workspace) => (
                        <li
                          key={workspace.workspaceId}
                          className="elite-list-item"
                        >
                          <div className="elite-list-title">
                            <span>{workspace.workspaceName}</span>
                            <StatusBadge
                              tone={statusTone(workspace.workspaceStatus)}
                            >
                              {workspace.workspaceStatus}
                            </StatusBadge>
                            <StatusBadge tone="neutral">
                              {workspace.membershipRole}
                            </StatusBadge>
                          </div>
                          <div className="elite-list-meta">
                            <span>{workspace.workspaceSlug}</span>
                            <span>Joined {formatDate(workspace.joinedAt)}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </InfoCard>
        </SectionGrid>
      ) : null}

      {errorMessage ? (
        <NoticeBanner title="Admin action failed" tone="danger">
          <p style={{ margin: 0 }}>{errorMessage}</p>
        </NoticeBanner>
      ) : null}

      {statusMessage ? (
        <NoticeBanner title="Latest update" tone="success">
          <p style={{ margin: 0 }}>{statusMessage}</p>
        </NoticeBanner>
      ) : null}
    </AppShell>
  );
}
