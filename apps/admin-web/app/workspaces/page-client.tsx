'use client';

import { useEffect, useState } from 'react';
import type {
  AccountMeResponse,
  AdminWorkspaceDetailResponse,
  AdminWorkspaceSummary,
  ExtendAdminWorkspaceTrialResponse,
  ListAdminWorkspacesResponse,
  UpdateAdminWorkspaceStatusResponse,
} from '@elite-message/contracts';
import {
  ActionButton,
  AppShell,
  DefinitionGrid,
  Field,
  InfoCard,
  NoticeBanner,
  SectionGrid,
  StatusBadge,
  TextInput,
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

export function AdminWorkspacesPage() {
  const [pageState, setPageState] = useState<PageState>('loading');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountMeResponse | null>(null);
  const [workspaces, setWorkspaces] = useState<AdminWorkspaceSummary[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<AdminWorkspaceDetailResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [busyWorkspaceId, setBusyWorkspaceId] = useState<string | null>(null);
  const [extendTrialDays, setExtendTrialDays] = useState('7');

  async function loadWorkspaces(tokenOverride?: string | null) {
    const response = await requestWithAdminRefresh(
      tokenOverride ?? accessToken,
      (token) =>
        fetch(`${apiBaseUrl}/api/v1/admin/workspaces`, {
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
      throw new Error('Could not load workspaces.');
    }

    const payload = (await response.json()) as ListAdminWorkspacesResponse;
    setWorkspaces(payload.items);
    if (!selectedWorkspaceId && payload.items[0]) {
      setSelectedWorkspaceId(payload.items[0].id);
    }
  }

  async function loadWorkspaceDetail(
    workspaceId: string,
    tokenOverride?: string | null,
  ) {
    if (!workspaceId) {
      setSelectedWorkspace(null);
      return;
    }

    const response = await requestWithAdminRefresh(
      tokenOverride ?? accessToken,
      (token) =>
        fetch(`${apiBaseUrl}/api/v1/admin/workspaces/${workspaceId}`, {
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
      throw new Error('Could not load the selected workspace.');
    }

    setSelectedWorkspace(
      (await response.json()) as AdminWorkspaceDetailResponse,
    );
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
        await loadWorkspaces(token);
        setPageState('ready');
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Could not load the admin workspace explorer.',
        );
        setPageState('unauthenticated');
      }
    })();
  }, []);

  useEffect(() => {
    if (pageState !== 'ready' || !selectedWorkspaceId) {
      return;
    }

    void loadWorkspaceDetail(selectedWorkspaceId).catch((error) => {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not load the selected workspace.',
      );
    });
  }, [pageState, selectedWorkspaceId]);

  async function updateStatus(
    workspaceId: string,
    status: 'active' | 'suspended',
  ) {
    setBusyWorkspaceId(workspaceId);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await requestWithAdminRefresh(
        accessToken,
        (token) =>
          fetch(`${apiBaseUrl}/api/v1/admin/workspaces/${workspaceId}/status`, {
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
          payload?.message ?? 'Could not update the workspace status.',
        );
      }

      const payload =
        (await response.json()) as UpdateAdminWorkspaceStatusResponse;
      setStatusMessage(
        `Updated ${payload.workspace.name} to ${payload.workspace.status}.`,
      );
      await loadWorkspaces();
      await loadWorkspaceDetail(workspaceId);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not update the workspace status.',
      );
    } finally {
      setBusyWorkspaceId(null);
    }
  }

  async function extendTrial(workspaceId: string) {
    setBusyWorkspaceId(workspaceId);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await requestWithAdminRefresh(
        accessToken,
        (token) =>
          fetch(
            `${apiBaseUrl}/api/v1/admin/workspaces/${workspaceId}/extend-trial`,
            {
              method: 'POST',
              headers: {
                authorization: `Bearer ${token}`,
                'content-type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                days: Number.parseInt(extendTrialDays, 10) || 7,
              }),
            },
          ),
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
          payload?.message ?? 'Could not extend the workspace trial.',
        );
      }

      const payload =
        (await response.json()) as ExtendAdminWorkspaceTrialResponse;
      setStatusMessage(
        `Extended ${payload.workspace.name} through ${formatDate(payload.subscription.trialEndsAt ?? payload.updatedAt)}.`,
      );
      await loadWorkspaces();
      await loadWorkspaceDetail(workspaceId);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not extend the workspace trial.',
      );
    } finally {
      setBusyWorkspaceId(null);
    }
  }

  return (
    <AppShell
      title="Admin Workspaces"
      subtitle="Inspect tenant health, suspend problematic workspaces, and trace how members and instances are distributed across the platform."
      surface="admin"
      density="compact"
      nav={
        pageState === 'ready' ? (
          <AdminNav current="workspaces" account={account} />
        ) : undefined
      }
      headerActions={
        pageState === 'ready' && account ? (
          <AdminTopbarControls account={account} />
        ) : undefined
      }
      meta={
        account ? (
          <StatusBadge tone="warning">
            {workspaces.length} workspaces
          </StatusBadge>
        ) : undefined
      }
      footer={<a href="/">Back to dashboard</a>}
    >
      {pageState === 'loading' ? (
        <InfoCard eyebrow="Workspaces" title="Loading tenant explorer">
          <p style={{ margin: 0 }}>
            Refreshing the admin session and loading workspace records.
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
          <InfoCard eyebrow="Directory" title="Workspace management">
            {workspaces.length === 0 ? (
              <p style={{ margin: 0 }}>No workspaces are available yet.</p>
            ) : (
              <ul className="elite-list">
                {workspaces.map((workspace) => (
                  <li key={workspace.id} className="elite-list-item">
                    <div className="elite-list-title">
                      <button
                        type="button"
                        data-unstyled-button
                        onClick={() => setSelectedWorkspaceId(workspace.id)}
                        style={{
                          border: 0,
                          padding: 0,
                          background: 'transparent',
                          fontWeight: 800,
                          color:
                            workspace.id === selectedWorkspaceId
                              ? 'var(--elite-accent-2)'
                              : 'var(--elite-ink)',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        {workspace.name}
                      </button>
                      <StatusBadge tone={statusTone(workspace.status)}>
                        {workspace.status}
                      </StatusBadge>
                      <StatusBadge
                        tone={
                          workspace.subscriptionStatus === 'trialing'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {workspace.subscriptionStatus}
                      </StatusBadge>
                    </div>
                    <div className="elite-list-meta">
                      <span>{workspace.slug}</span>
                      <span>Updated {formatDate(workspace.updatedAt)}</span>
                      <span>
                        Trial ends {formatDate(workspace.trialEndsAt)}
                      </span>
                    </div>
                    <DefinitionGrid
                      minItemWidth={120}
                      items={[
                        { label: 'Members', value: workspace.memberCount },
                        { label: 'Instances', value: workspace.instanceCount },
                        {
                          label: 'Created',
                          value: formatDate(workspace.createdAt),
                        },
                      ]}
                    />
                    <ActionButton
                      type="button"
                      tone={
                        workspace.status === 'active' ? 'danger' : 'secondary'
                      }
                      disabled={busyWorkspaceId === workspace.id}
                      onClick={() =>
                        void updateStatus(
                          workspace.id,
                          workspace.status === 'active'
                            ? 'suspended'
                            : 'active',
                        )
                      }
                    >
                      {busyWorkspaceId === workspace.id
                        ? 'Updating...'
                        : workspace.status === 'active'
                          ? 'Suspend workspace'
                          : 'Reactivate workspace'}
                    </ActionButton>
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>

          <InfoCard
            eyebrow="Detail"
            title={
              selectedWorkspace
                ? `Workspace detail: ${selectedWorkspace.workspace.name}`
                : 'Workspace detail'
            }
          >
            {!selectedWorkspace ? (
              <p style={{ margin: 0 }}>
                Select a workspace to inspect members and attached instances.
              </p>
            ) : (
              <div style={{ display: 'grid', gap: 18 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <StatusBadge
                    tone={statusTone(selectedWorkspace.workspace.status)}
                  >
                    {selectedWorkspace.workspace.status}
                  </StatusBadge>
                  <StatusBadge tone="info">
                    {selectedWorkspace.workspace.slug}
                  </StatusBadge>
                  <StatusBadge
                    tone={
                      selectedWorkspace.workspace.subscriptionStatus ===
                      'trialing'
                        ? 'warning'
                        : 'neutral'
                    }
                  >
                    {selectedWorkspace.workspace.subscriptionStatus}
                  </StatusBadge>
                </div>
                <DefinitionGrid
                  items={[
                    {
                      label: 'Members',
                      value: selectedWorkspace.workspace.memberCount,
                    },
                    {
                      label: 'Instances',
                      value: selectedWorkspace.workspace.instanceCount,
                    },
                    {
                      label: 'Updated',
                      value: formatDate(selectedWorkspace.workspace.updatedAt),
                    },
                    {
                      label: 'Trial ends',
                      value: formatDate(
                        selectedWorkspace.subscription.trialEndsAt,
                      ),
                    },
                    {
                      label: 'Plan',
                      value: selectedWorkspace.subscription.planName,
                    },
                    {
                      label: 'Linked instances',
                      value: selectedWorkspace.subscription.linkedInstanceCount,
                    },
                  ]}
                />
                <div
                  style={{
                    display: 'grid',
                    gap: 12,
                    padding: 16,
                    borderRadius: 18,
                    background: 'var(--elite-card)',
                  }}
                >
                  <div className="elite-field-label">Trial controls</div>
                  <p style={{ margin: 0, color: 'var(--elite-muted)' }}>
                    Extend the manual MVP trial window without changing the
                    workspace operational status.
                  </p>
                  <Field label="Extend by days">
                    <TextInput
                      type="number"
                      min={1}
                      max={90}
                      value={extendTrialDays}
                      onChange={(event) =>
                        setExtendTrialDays(event.target.value)
                      }
                    />
                  </Field>
                  <ActionButton
                    type="button"
                    tone="secondary"
                    disabled={
                      busyWorkspaceId === selectedWorkspace.workspace.id
                    }
                    onClick={() =>
                      void extendTrial(selectedWorkspace.workspace.id)
                    }
                  >
                    {busyWorkspaceId === selectedWorkspace.workspace.id
                      ? 'Extending...'
                      : 'Extend trial'}
                  </ActionButton>
                </div>
                <div>
                  <div
                    className="elite-field-label"
                    style={{ marginBottom: 10 }}
                  >
                    Members
                  </div>
                  {selectedWorkspace.members.length === 0 ? (
                    <p style={{ margin: 0 }}>
                      No memberships exist for this workspace.
                    </p>
                  ) : (
                    <ul className="elite-list">
                      {selectedWorkspace.members.map((member) => (
                        <li key={member.userId} className="elite-list-item">
                          <div className="elite-list-title">
                            <span>{member.displayName}</span>
                            <StatusBadge
                              tone={
                                member.userRole === 'platform_admin'
                                  ? 'warning'
                                  : 'neutral'
                              }
                            >
                              {member.userRole}
                            </StatusBadge>
                            <StatusBadge tone={statusTone(member.userStatus)}>
                              {member.userStatus}
                            </StatusBadge>
                            <StatusBadge tone="neutral">
                              {member.membershipRole}
                            </StatusBadge>
                          </div>
                          <div className="elite-list-meta">
                            <span>{member.email}</span>
                            <span>Joined {formatDate(member.joinedAt)}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <div
                    className="elite-field-label"
                    style={{ marginBottom: 10 }}
                  >
                    Instances
                  </div>
                  {selectedWorkspace.instances.length === 0 ? (
                    <p style={{ margin: 0 }}>
                      No instances have been created inside this workspace.
                    </p>
                  ) : (
                    <ul className="elite-list">
                      {selectedWorkspace.instances.map((instance) => (
                        <li key={instance.id} className="elite-list-item">
                          <div className="elite-list-title">
                            <span>
                              {instance.name} ({instance.publicId})
                            </span>
                            <StatusBadge tone={statusTone(instance.status)}>
                              {instance.status}
                            </StatusBadge>
                          </div>
                          <div className="elite-list-meta">
                            <span>
                              Worker {instance.assignedWorkerId ?? 'Unassigned'}
                            </span>
                            <span>
                              Updated {formatDate(instance.updatedAt)}
                            </span>
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
