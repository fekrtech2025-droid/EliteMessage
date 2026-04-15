'use client';

import { useEffect, useState } from 'react';
import type {
  AccountMeResponse,
  AdminWorkerDetailResponse,
} from '@elite-message/contracts';
import {
  AnchorNav,
  AppShell,
  DefinitionGrid,
  InfoCard,
  NoticeBanner,
  SectionGrid,
  StatusBadge,
} from '@elite-message/ui';
import { AdminNav } from '../../components/admin-nav';
import { AdminTopbarControls } from '../../components/admin-topbar-controls';
import {
  loadAdminAccount,
  refreshAdminAccessToken,
  requestWithAdminRefresh,
} from '../../lib/admin-auth';
import { formatDate, formatText, statusTone } from '../../lib/admin-format';
import { apiBaseUrl } from '../../lib/session';

type PageState = 'loading' | 'unauthenticated' | 'ready';

type AdminWorkerDetailPageProps = {
  workerId: string;
};

export function AdminWorkerDetailPage({
  workerId,
}: AdminWorkerDetailPageProps) {
  const [pageState, setPageState] = useState<PageState>('loading');
  const [, setAccessToken] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountMeResponse | null>(null);
  const [workerDetail, setWorkerDetail] =
    useState<AdminWorkerDetailResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const token = await refreshAdminAccessToken(setAccessToken);
        if (!token) {
          setPageState('unauthenticated');
          return;
        }

        const [me, detailResponse] = await Promise.all([
          loadAdminAccount(token),
          requestWithAdminRefresh(
            token,
            (bearer) =>
              fetch(
                `${apiBaseUrl}/api/v1/admin/workers/${encodeURIComponent(workerId)}`,
                {
                  headers: {
                    authorization: `Bearer ${bearer}`,
                  },
                  credentials: 'include',
                },
              ),
            setAccessToken,
          ),
        ]);

        if (!me || !detailResponse) {
          setPageState('unauthenticated');
          return;
        }

        if (!detailResponse.ok) {
          throw new Error('Could not load the selected worker.');
        }

        setAccount(me);
        setWorkerDetail(
          (await detailResponse.json()) as AdminWorkerDetailResponse,
        );
        setPageState('ready');
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Could not load the selected worker.',
        );
        setPageState('unauthenticated');
      }
    })();
  }, [workerId]);

  return (
    <AppShell
      title="Worker Detail"
      subtitle="Inspect one worker’s heartbeat, current assignments, and recent operations without digging through the global overview."
      surface="admin"
      nav={
        pageState === 'ready' ? (
          <AdminNav current="worker-detail" account={account} />
        ) : undefined
      }
      headerActions={
        pageState === 'ready' && account ? (
          <AdminTopbarControls account={account} />
        ) : undefined
      }
      secondaryNav={
        pageState === 'ready' && workerDetail ? (
          <AnchorNav
            items={[
              { label: 'Summary', href: '#worker-summary' },
              { label: 'Assignments', href: '#worker-assignments' },
              { label: 'Operations', href: '#worker-operations' },
            ]}
          />
        ) : undefined
      }
      meta={
        workerDetail ? (
          <StatusBadge tone={statusTone(workerDetail.worker.status)}>
            {workerDetail.worker.workerId}
          </StatusBadge>
        ) : undefined
      }
      footer={<a href="/workers">Back to workers</a>}
    >
      {pageState === 'loading' ? (
        <InfoCard eyebrow="Worker" title="Loading worker detail">
          <p style={{ margin: 0 }}>
            Refreshing the admin session and loading the selected worker.
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

      {pageState === 'ready' && workerDetail ? (
        <>
          <InfoCard
            id="worker-summary"
            eyebrow="Worker"
            title={workerDetail.worker.workerId}
          >
            <DefinitionGrid
              items={[
                {
                  label: 'Status',
                  value: workerDetail.worker.status,
                  tone: statusTone(workerDetail.worker.status),
                },
                { label: 'Region', value: workerDetail.worker.region },
                {
                  label: 'Assigned instances',
                  value: workerDetail.worker.activeInstanceCount,
                },
                {
                  label: 'Uptime',
                  value: `${workerDetail.worker.uptimeSeconds}s`,
                },
                {
                  label: 'Last seen',
                  value: formatDate(workerDetail.worker.lastSeenAt),
                },
              ]}
            />
          </InfoCard>

          <SectionGrid minItemWidth={320}>
            <InfoCard
              id="worker-assignments"
              eyebrow="Assignments"
              title="Currently assigned instances"
            >
              {workerDetail.assignedInstances.length === 0 ? (
                <p style={{ margin: 0 }}>
                  This worker does not currently own any instances.
                </p>
              ) : (
                <ul className="elite-list">
                  {workerDetail.assignedInstances.map((instance) => (
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
                        <span>{instance.workspaceName}</span>
                        <span>Substatus {formatText(instance.substatus)}</span>
                        <span>Updated {formatDate(instance.updatedAt)}</span>
                      </div>
                      <div>
                        <a href={`/instances/${instance.id}`}>
                          Open instance detail
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </InfoCard>

            <InfoCard
              id="worker-operations"
              eyebrow="Operations"
              title="Recent worker operations"
            >
              {workerDetail.recentOperations.length === 0 ? (
                <p style={{ margin: 0 }}>
                  No operations were recorded for this worker yet.
                </p>
              ) : (
                <ul className="elite-list">
                  {workerDetail.recentOperations.map((operation) => (
                    <li key={operation.id} className="elite-list-item">
                      <div className="elite-list-title">
                        <span>
                          {operation.action} on {operation.instanceName}
                        </span>
                        <StatusBadge tone={statusTone(operation.status)}>
                          {operation.status}
                        </StatusBadge>
                      </div>
                      <div className="elite-list-meta">
                        <span>{operation.instancePublicId}</span>
                        <span>Created {formatDate(operation.createdAt)}</span>
                        <span>
                          Completed {formatDate(operation.completedAt)}
                        </span>
                      </div>
                      <div>
                        {operation.message ??
                          operation.errorMessage ??
                          'No additional operation message.'}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </InfoCard>
          </SectionGrid>
        </>
      ) : null}

      {errorMessage ? (
        <NoticeBanner title="Worker detail failed" tone="danger">
          <p style={{ margin: 0 }}>{errorMessage}</p>
        </NoticeBanner>
      ) : null}
    </AppShell>
  );
}
