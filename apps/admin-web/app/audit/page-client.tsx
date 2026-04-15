'use client';

import { useEffect, useState } from 'react';
import type {
  AccountMeResponse,
  AuditActorType,
  AuditEntityType,
  AuditLogSummary,
  ListAuditLogsResponse,
} from '@elite-message/contracts';
import {
  ActionButton,
  AppShell,
  Field,
  InfoCard,
  NoticeBanner,
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
import { formatDate } from '../lib/admin-format';
import { apiBaseUrl } from '../lib/session';

type PageState = 'loading' | 'unauthenticated' | 'ready';

const actorTypes: Array<AuditActorType | 'all'> = [
  'all',
  'anonymous',
  'customer_user',
  'platform_admin',
  'worker',
  'system',
];
const entityTypes: Array<AuditEntityType | 'all'> = [
  'all',
  'auth_session',
  'user',
  'workspace',
  'account_api_token',
  'instance',
  'instance_settings',
  'instance_api_token',
  'instance_operation',
  'outbound_message',
  'inbound_message',
  'webhook_delivery',
  'worker',
  'support_case',
];

export function AdminAuditPage() {
  const [pageState, setPageState] = useState<PageState>('loading');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountMeResponse | null>(null);
  const [logs, setLogs] = useState<AuditLogSummary[]>([]);
  const [workspaceId, setWorkspaceId] = useState('');
  const [instanceId, setInstanceId] = useState('');
  const [actorType, setActorType] = useState<AuditActorType | 'all'>('all');
  const [entityType, setEntityType] = useState<AuditEntityType | 'all'>('all');
  const [actionFilter, setActionFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadLogs(tokenOverride?: string | null) {
    const query = new URLSearchParams();
    if (workspaceId.trim()) {
      query.set('workspaceId', workspaceId.trim());
    }
    if (instanceId.trim()) {
      query.set('instanceId', instanceId.trim());
    }
    if (actorType !== 'all') {
      query.set('actorType', actorType);
    }
    if (entityType !== 'all') {
      query.set('entityType', entityType);
    }
    if (actionFilter.trim()) {
      query.set('action', actionFilter.trim());
    }
    query.set('limit', '80');

    const response = await requestWithAdminRefresh(
      tokenOverride ?? accessToken,
      (token) =>
        fetch(`${apiBaseUrl}/api/v1/admin/audit-logs?${query.toString()}`, {
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
      throw new Error('Could not load admin audit logs.');
    }

    const payload = (await response.json()) as ListAuditLogsResponse;
    setLogs(payload.items);
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
        await loadLogs(token);
        setPageState('ready');
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Could not load the audit explorer.',
        );
        setPageState('unauthenticated');
      }
    })();
  }, []);

  useEffect(() => {
    if (pageState !== 'ready') {
      return;
    }

    void loadLogs().catch((error) => {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not reload admin audit logs.',
      );
    });
  }, [actionFilter, actorType, entityType, instanceId, pageState, workspaceId]);

  return (
    <AppShell
      title="Admin Audit Explorer"
      subtitle="Search global audit history by actor, entity, or action so operational and security changes stay visible."
      surface="admin"
      density="compact"
      nav={
        pageState === 'ready' ? (
          <AdminNav current="audit" account={account} />
        ) : undefined
      }
      headerActions={
        pageState === 'ready' && account ? (
          <AdminTopbarControls account={account} />
        ) : undefined
      }
      meta={
        account ? (
          <StatusBadge tone="warning">{logs.length} audit records</StatusBadge>
        ) : undefined
      }
      footer={<a href="/">Back to dashboard</a>}
    >
      {pageState === 'loading' ? (
        <InfoCard eyebrow="Audit" title="Loading audit explorer">
          <p style={{ margin: 0 }}>
            Refreshing the admin session and loading recent audit records.
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
          <InfoCard
            eyebrow="Filters"
            title="Audit log scope"
            className="elite-sticky-panel"
          >
            <div style={{ display: 'grid', gap: 16 }}>
              <Field label="Workspace ID">
                <TextInput
                  value={workspaceId}
                  onChange={(event) => setWorkspaceId(event.target.value)}
                  placeholder="Optional workspace UUID"
                />
              </Field>
              <Field label="Instance ID">
                <TextInput
                  value={instanceId}
                  onChange={(event) => setInstanceId(event.target.value)}
                  placeholder="Optional instance UUID"
                />
              </Field>
              <Field label="Actor type">
                <SelectInput
                  value={actorType}
                  onChange={(event) =>
                    setActorType(event.target.value as AuditActorType | 'all')
                  }
                >
                  {actorTypes.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Entity type">
                <SelectInput
                  value={entityType}
                  onChange={(event) =>
                    setEntityType(event.target.value as AuditEntityType | 'all')
                  }
                >
                  {entityTypes.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Action contains">
                <TextInput
                  value={actionFilter}
                  onChange={(event) => setActionFilter(event.target.value)}
                  placeholder="admin.support_case"
                />
              </Field>
              <ActionButton
                type="button"
                tone="secondary"
                onClick={() => void loadLogs()}
              >
                Refresh audit results
              </ActionButton>
            </div>
          </InfoCard>

          <InfoCard eyebrow="Audit" title="Recent audit records">
            {logs.length === 0 ? (
              <p style={{ margin: 0 }}>
                No audit records matched the current filters.
              </p>
            ) : (
              <ul className="elite-list">
                {logs.map((log) => (
                  <li key={log.id} className="elite-list-item">
                    <div className="elite-list-title">
                      <span>{log.action}</span>
                      <StatusBadge tone="info">{log.actorType}</StatusBadge>
                      <StatusBadge tone="neutral">{log.entityType}</StatusBadge>
                    </div>
                    <div>{log.summary}</div>
                    <div className="elite-list-meta">
                      <span>
                        Workspace{' '}
                        {log.workspaceName ?? log.workspaceId ?? 'None'}
                      </span>
                      <span>
                        Instance{' '}
                        {log.instancePublicId ?? log.instanceId ?? 'None'}
                      </span>
                      <span>Actor {log.actorId ?? 'system'}</span>
                      <span>Recorded {formatDate(log.createdAt)}</span>
                    </div>
                    {log.metadata ? (
                      <Field label="Metadata">
                        <TextAreaInput
                          value={JSON.stringify(log.metadata, null, 2)}
                          readOnly
                        />
                      </Field>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>
        </>
      ) : null}

      {errorMessage ? (
        <NoticeBanner title="Audit explorer failed" tone="danger">
          <p style={{ margin: 0 }}>{errorMessage}</p>
        </NoticeBanner>
      ) : null}
    </AppShell>
  );
}
