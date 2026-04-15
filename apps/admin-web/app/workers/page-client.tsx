'use client';

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import type {
  AccountMeResponse,
  ListAdminWorkersResponse,
  WorkerHeartbeatRecord,
} from '@elite-message/contracts';
import {
  AppShell,
  DefinitionGrid,
  InfoCard,
  NoticeBanner,
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

export function AdminWorkersPage() {
  const [pageState, setPageState] = useState<PageState>('loading');
  const [, setAccessToken] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountMeResponse | null>(null);
  const [workers, setWorkers] = useState<WorkerHeartbeatRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const token = await refreshAdminAccessToken(setAccessToken);
        if (!token) {
          setPageState('unauthenticated');
          return;
        }

        const [me, workersResponse] = await Promise.all([
          loadAdminAccount(token),
          requestWithAdminRefresh(
            token,
            (bearer) =>
              fetch(`${apiBaseUrl}/api/v1/admin/workers`, {
                headers: {
                  authorization: `Bearer ${bearer}`,
                },
                credentials: 'include',
              }),
            setAccessToken,
          ),
        ]);

        if (!me || !workersResponse) {
          setPageState('unauthenticated');
          return;
        }

        if (!workersResponse.ok) {
          throw new Error('Could not load the admin worker explorer.');
        }

        const payload =
          (await workersResponse.json()) as ListAdminWorkersResponse;
        setAccount(me);
        setWorkers(payload.items);
        setPageState('ready');
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Could not load the admin worker explorer.',
        );
        setPageState('unauthenticated');
      }
    })();
  }, []);

  return (
    <AppShell
      title="Admin Workers"
      subtitle="Explore worker heartbeat health and jump into a dedicated worker detail page when you need assignment context or recent operations."
      surface="admin"
      density="compact"
      nav={
        pageState === 'ready' ? (
          <AdminNav current="workers" account={account} />
        ) : undefined
      }
      headerActions={
        pageState === 'ready' && account ? (
          <AdminTopbarControls account={account} />
        ) : undefined
      }
      meta={
        account ? (
          <StatusBadge tone="warning">{workers.length} workers</StatusBadge>
        ) : undefined
      }
      footer={<a href="/">Back to dashboard</a>}
    >
      {pageState === 'loading' ? (
        <InfoCard eyebrow="Workers" title="Loading worker explorer">
          <p style={{ margin: 0 }}>
            Refreshing the admin session and loading worker heartbeat data.
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
        <InfoCard eyebrow="Workers" title="Worker explorer">
          {workers.length === 0 ? (
            <p style={{ margin: 0 }}>
              No worker heartbeat has been persisted yet.
            </p>
          ) : (
            <div
              className="elite-section-grid"
              style={{ '--elite-grid-min': '260px' } as CSSProperties}
            >
              {workers.map((worker) => (
                <article key={worker.id} className="elite-list-item">
                  <div className="elite-list-title">
                    <span>{worker.workerId}</span>
                    <StatusBadge tone={statusTone(worker.status)}>
                      {worker.status}
                    </StatusBadge>
                  </div>
                  <div className="elite-list-meta">
                    <span>Region {worker.region}</span>
                    <span>Last seen {formatDate(worker.lastSeenAt)}</span>
                  </div>
                  <DefinitionGrid
                    minItemWidth={120}
                    items={[
                      { label: 'Uptime', value: `${worker.uptimeSeconds}s` },
                      { label: 'Assigned', value: worker.activeInstanceCount },
                      { label: 'Updated', value: formatDate(worker.updatedAt) },
                    ]}
                  />
                  <div>
                    <a href={`/workers/${encodeURIComponent(worker.workerId)}`}>
                      Open worker detail
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </InfoCard>
      ) : null}

      {errorMessage ? (
        <NoticeBanner title="Worker explorer failed" tone="danger">
          <p style={{ margin: 0 }}>{errorMessage}</p>
        </NoticeBanner>
      ) : null}
    </AppShell>
  );
}
