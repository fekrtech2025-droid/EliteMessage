'use client';

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import type {
  AccountMeResponse,
  AdminUserSummary,
  AdminWorkspaceSummary,
  CreateSupportCaseRequest,
  ListAdminUsersResponse,
  ListAdminWorkspacesResponse,
  ListSupportCasesResponse,
  SupportCasePriority,
  SupportCaseStatus,
  SupportCaseSummary,
  SupportCaseResponse,
} from '@elite-message/contracts';
import {
  ActionButton,
  AppShell,
  Field,
  InfoCard,
  NoticeBanner,
  SectionGrid,
  SelectInput,
  StatusBadge,
  TextAreaInput,
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

type CaseDraft = {
  status: SupportCaseStatus;
  priority: SupportCasePriority;
  internalNotes: string;
  assignedAdminUserId: string;
};

const supportStatuses: SupportCaseStatus[] = [
  'open',
  'in_progress',
  'waiting_on_customer',
  'resolved',
  'closed',
];
const supportPriorities: SupportCasePriority[] = [
  'low',
  'normal',
  'high',
  'urgent',
];

export function AdminSupportPage() {
  const [pageState, setPageState] = useState<PageState>('loading');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountMeResponse | null>(null);
  const [platformUsers, setPlatformUsers] = useState<AdminUserSummary[]>([]);
  const [workspaces, setWorkspaces] = useState<AdminWorkspaceSummary[]>([]);
  const [supportCases, setSupportCases] = useState<SupportCaseSummary[]>([]);
  const [statusFilter, setStatusFilter] = useState<SupportCaseStatus | 'all'>(
    'all',
  );
  const [priorityFilter, setPriorityFilter] = useState<
    SupportCasePriority | 'all'
  >('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [busyCaseId, setBusyCaseId] = useState<string | null>(null);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, CaseDraft>>({});
  const [createForm, setCreateForm] = useState<CreateSupportCaseRequest>({
    workspaceId: null,
    instanceId: null,
    requesterUserId: null,
    assignedAdminUserId: null,
    title: '',
    description: '',
    priority: 'normal',
    internalNotes: null,
  });

  function setDraft(caseItem: SupportCaseSummary, next?: Partial<CaseDraft>) {
    setDrafts((current) => ({
      ...current,
      [caseItem.id]: {
        status: caseItem.status,
        priority: caseItem.priority,
        internalNotes: caseItem.internalNotes ?? '',
        assignedAdminUserId: caseItem.assignedAdminUserId ?? '',
        ...(current[caseItem.id] ?? {}),
        ...(next ?? {}),
      },
    }));
  }

  async function loadReferenceData(tokenOverride?: string | null) {
    const [usersResponse, workspacesResponse] = await Promise.all([
      requestWithAdminRefresh(
        tokenOverride ?? accessToken,
        (token) =>
          fetch(`${apiBaseUrl}/api/v1/admin/users`, {
            headers: {
              authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          }),
        setAccessToken,
      ),
      requestWithAdminRefresh(
        tokenOverride ?? accessToken,
        (token) =>
          fetch(`${apiBaseUrl}/api/v1/admin/workspaces`, {
            headers: {
              authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          }),
        setAccessToken,
      ),
    ]);

    if (!usersResponse || !workspacesResponse) {
      setPageState('unauthenticated');
      return;
    }

    if (!usersResponse.ok || !workspacesResponse.ok) {
      throw new Error('Could not load support case reference data.');
    }

    const usersPayload = (await usersResponse.json()) as ListAdminUsersResponse;
    const workspacesPayload =
      (await workspacesResponse.json()) as ListAdminWorkspacesResponse;
    setPlatformUsers(usersPayload.items);
    setWorkspaces(workspacesPayload.items);
  }

  async function loadCases(tokenOverride?: string | null) {
    const query = new URLSearchParams();
    if (statusFilter !== 'all') {
      query.set('status', statusFilter);
    }
    if (priorityFilter !== 'all') {
      query.set('priority', priorityFilter);
    }
    query.set('limit', '80');

    const response = await requestWithAdminRefresh(
      tokenOverride ?? accessToken,
      (token) =>
        fetch(`${apiBaseUrl}/api/v1/admin/support-cases?${query.toString()}`, {
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
      throw new Error('Could not load support cases.');
    }

    const payload = (await response.json()) as ListSupportCasesResponse;
    setSupportCases(payload.items);
    setDrafts((current) => {
      const nextDrafts: Record<string, CaseDraft> = {};
      for (const item of payload.items) {
        nextDrafts[item.id] = current[item.id] ?? {
          status: item.status,
          priority: item.priority,
          internalNotes: item.internalNotes ?? '',
          assignedAdminUserId: item.assignedAdminUserId ?? '',
        };
      }
      return nextDrafts;
    });
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
        await loadReferenceData(token);
        await loadCases(token);
        setPageState('ready');
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Could not load the support case console.',
        );
        setPageState('unauthenticated');
      }
    })();
  }, []);

  useEffect(() => {
    if (pageState !== 'ready') {
      return;
    }

    void loadCases().catch((error) => {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not reload support cases.',
      );
    });
  }, [pageState, priorityFilter, statusFilter]);

  async function createCase() {
    setCreateSubmitting(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await requestWithAdminRefresh(
        accessToken,
        (token) =>
          fetch(`${apiBaseUrl}/api/v1/admin/support-cases`, {
            method: 'POST',
            headers: {
              authorization: `Bearer ${token}`,
              'content-type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              ...createForm,
              workspaceId: createForm.workspaceId || null,
              instanceId: createForm.instanceId || null,
              requesterUserId: createForm.requesterUserId || null,
              assignedAdminUserId: createForm.assignedAdminUserId || null,
              internalNotes: createForm.internalNotes || null,
            }),
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
          payload?.message ?? 'Could not create the support case.',
        );
      }

      const payload = (await response.json()) as SupportCaseResponse;
      setStatusMessage(`Created support case ${payload.case.publicId}.`);
      setCreateForm({
        workspaceId: null,
        instanceId: null,
        requesterUserId: null,
        assignedAdminUserId: null,
        title: '',
        description: '',
        priority: 'normal',
        internalNotes: null,
      });
      await loadCases();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not create the support case.',
      );
    } finally {
      setCreateSubmitting(false);
    }
  }

  async function saveCase(caseItem: SupportCaseSummary) {
    const draft = drafts[caseItem.id];
    if (!draft) {
      return;
    }

    setBusyCaseId(caseItem.id);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await requestWithAdminRefresh(
        accessToken,
        (token) =>
          fetch(`${apiBaseUrl}/api/v1/admin/support-cases/${caseItem.id}`, {
            method: 'PATCH',
            headers: {
              authorization: `Bearer ${token}`,
              'content-type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              status: draft.status,
              priority: draft.priority,
              internalNotes: draft.internalNotes || null,
              assignedAdminUserId: draft.assignedAdminUserId || null,
            }),
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
          payload?.message ?? 'Could not update the support case.',
        );
      }

      const payload = (await response.json()) as SupportCaseResponse;
      setStatusMessage(`Updated ${payload.case.publicId}.`);
      await loadCases();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not update the support case.',
      );
    } finally {
      setBusyCaseId(null);
    }
  }

  return (
    <AppShell
      title="Admin Support Cases"
      subtitle="Track platform incidents, assign ownership, and keep operator notes in one place instead of scattering support state across chat and audit logs."
      surface="admin"
      density="compact"
      nav={
        pageState === 'ready' ? (
          <AdminNav current="support" account={account} />
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
            {supportCases.length} visible cases
          </StatusBadge>
        ) : undefined
      }
      footer={<a href="/">Back to dashboard</a>}
    >
      {pageState === 'loading' ? (
        <InfoCard eyebrow="Support" title="Loading support cases">
          <p style={{ margin: 0 }}>
            Refreshing the admin session and loading support case records.
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
        <>
          <SectionGrid minItemWidth={320}>
            <InfoCard eyebrow="Create" title="Open a support case">
              <div style={{ display: 'grid', gap: 16 }}>
                <Field label="Title">
                  <TextInput
                    value={createForm.title}
                    onChange={(event) =>
                      setCreateForm((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Link failure for new QR pairings"
                  />
                </Field>
                <Field label="Description">
                  <TextAreaInput
                    value={createForm.description}
                    onChange={(event) =>
                      setCreateForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Summarize what the operator saw, what environment it occurred in, and what should be checked next."
                  />
                </Field>
                <Field label="Priority">
                  <SelectInput
                    value={createForm.priority}
                    onChange={(event) =>
                      setCreateForm((current) => ({
                        ...current,
                        priority: event.target.value as SupportCasePriority,
                      }))
                    }
                  >
                    {supportPriorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Workspace">
                  <SelectInput
                    value={createForm.workspaceId ?? ''}
                    onChange={(event) =>
                      setCreateForm((current) => ({
                        ...current,
                        workspaceId: event.target.value || null,
                      }))
                    }
                  >
                    <option value="">No workspace linked</option>
                    {workspaces.map((workspace) => (
                      <option key={workspace.id} value={workspace.id}>
                        {workspace.name}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Instance ID">
                  <TextInput
                    value={createForm.instanceId ?? ''}
                    onChange={(event) =>
                      setCreateForm((current) => ({
                        ...current,
                        instanceId: event.target.value || null,
                      }))
                    }
                    placeholder="Optional instance UUID"
                  />
                </Field>
                <Field label="Requester user">
                  <SelectInput
                    value={createForm.requesterUserId ?? ''}
                    onChange={(event) =>
                      setCreateForm((current) => ({
                        ...current,
                        requesterUserId: event.target.value || null,
                      }))
                    }
                  >
                    <option value="">No requester linked</option>
                    {platformUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.displayName} ({user.email})
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Assigned admin">
                  <SelectInput
                    value={createForm.assignedAdminUserId ?? ''}
                    onChange={(event) =>
                      setCreateForm((current) => ({
                        ...current,
                        assignedAdminUserId: event.target.value || null,
                      }))
                    }
                  >
                    <option value="">Unassigned</option>
                    {platformUsers
                      .filter((user) => user.role === 'platform_admin')
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.displayName}
                        </option>
                      ))}
                  </SelectInput>
                </Field>
                <Field label="Internal notes">
                  <TextAreaInput
                    value={createForm.internalNotes ?? ''}
                    onChange={(event) =>
                      setCreateForm((current) => ({
                        ...current,
                        internalNotes: event.target.value || null,
                      }))
                    }
                    placeholder="Optional internal notes for admins."
                  />
                </Field>
                <ActionButton
                  type="button"
                  disabled={createSubmitting}
                  onClick={() => void createCase()}
                >
                  {createSubmitting
                    ? 'Creating case...'
                    : 'Create support case'}
                </ActionButton>
              </div>
            </InfoCard>

            <InfoCard
              eyebrow="Filters"
              title="Support case scope"
              className="elite-sticky-panel"
            >
              <div style={{ display: 'grid', gap: 16 }}>
                <Field label="Status">
                  <SelectInput
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value as SupportCaseStatus | 'all',
                      )
                    }
                  >
                    <option value="all">All statuses</option>
                    {supportStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Priority">
                  <SelectInput
                    value={priorityFilter}
                    onChange={(event) =>
                      setPriorityFilter(
                        event.target.value as SupportCasePriority | 'all',
                      )
                    }
                  >
                    <option value="all">All priorities</option>
                    {supportPriorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <ActionButton
                  type="button"
                  tone="secondary"
                  onClick={() => void loadCases()}
                >
                  Refresh support queue
                </ActionButton>
              </div>
            </InfoCard>
          </SectionGrid>

          <InfoCard eyebrow="Cases" title="Support queue">
            {supportCases.length === 0 ? (
              <p style={{ margin: 0 }}>
                No support cases matched the selected scope.
              </p>
            ) : (
              <ul className="elite-list">
                {supportCases.map((caseItem) => {
                  const draft = drafts[caseItem.id] ?? {
                    status: caseItem.status,
                    priority: caseItem.priority,
                    internalNotes: caseItem.internalNotes ?? '',
                    assignedAdminUserId: caseItem.assignedAdminUserId ?? '',
                  };

                  return (
                    <li key={caseItem.id} className="elite-list-item">
                      <div className="elite-list-title">
                        <span>
                          {caseItem.publicId}: {caseItem.title}
                        </span>
                        <StatusBadge tone={statusTone(caseItem.status)}>
                          {caseItem.status}
                        </StatusBadge>
                        <StatusBadge tone={statusTone(caseItem.priority)}>
                          {caseItem.priority}
                        </StatusBadge>
                      </div>
                      <div>{caseItem.description}</div>
                      <div className="elite-list-meta">
                        <span>
                          Workspace {caseItem.workspaceName ?? 'None'}
                        </span>
                        <span>
                          Instance {caseItem.instancePublicId ?? 'None'}
                        </span>
                        <span>
                          Requester{' '}
                          {caseItem.requesterDisplayName ??
                            caseItem.requesterEmail ??
                            'None'}
                        </span>
                        <span>Created {formatDate(caseItem.createdAt)}</span>
                        <span>Resolved {formatDate(caseItem.resolvedAt)}</span>
                      </div>
                      <div
                        className="elite-section-grid"
                        style={{ '--elite-grid-min': '180px' } as CSSProperties}
                      >
                        <Field label="Status">
                          <SelectInput
                            value={draft.status}
                            onChange={(event) =>
                              setDraft(caseItem, {
                                status: event.target.value as SupportCaseStatus,
                              })
                            }
                          >
                            {supportStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </SelectInput>
                        </Field>
                        <Field label="Priority">
                          <SelectInput
                            value={draft.priority}
                            onChange={(event) =>
                              setDraft(caseItem, {
                                priority: event.target
                                  .value as SupportCasePriority,
                              })
                            }
                          >
                            {supportPriorities.map((priority) => (
                              <option key={priority} value={priority}>
                                {priority}
                              </option>
                            ))}
                          </SelectInput>
                        </Field>
                        <Field label="Assigned admin">
                          <SelectInput
                            value={draft.assignedAdminUserId}
                            onChange={(event) =>
                              setDraft(caseItem, {
                                assignedAdminUserId: event.target.value,
                              })
                            }
                          >
                            <option value="">Unassigned</option>
                            {platformUsers
                              .filter((user) => user.role === 'platform_admin')
                              .map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.displayName}
                                </option>
                              ))}
                          </SelectInput>
                        </Field>
                      </div>
                      <Field label="Internal notes">
                        <TextAreaInput
                          value={draft.internalNotes}
                          onChange={(event) =>
                            setDraft(caseItem, {
                              internalNotes: event.target.value,
                            })
                          }
                          placeholder="Resolution notes, current hypothesis, or next action."
                        />
                      </Field>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 10,
                          alignItems: 'center',
                        }}
                      >
                        <ActionButton
                          type="button"
                          disabled={busyCaseId === caseItem.id}
                          onClick={() => void saveCase(caseItem)}
                        >
                          {busyCaseId === caseItem.id
                            ? 'Saving...'
                            : 'Save support case'}
                        </ActionButton>
                        {caseItem.assignedAdminDisplayName ? (
                          <StatusBadge tone="info">
                            Assigned to {caseItem.assignedAdminDisplayName}
                          </StatusBadge>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </InfoCard>
        </>
      ) : null}

      {errorMessage ? (
        <NoticeBanner title="Support case action failed" tone="danger">
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
