'use client';

import Link from 'next/link';
import type { AccountMeResponse } from '@elite-message/contracts';
import { StatusBadge } from '@elite-message/ui';

export type AdminNavCurrent =
  | 'dashboard'
  | 'users'
  | 'workspaces'
  | 'workers'
  | 'worker-detail'
  | 'support'
  | 'audit'
  | 'messages'
  | 'instance';

type AdminNavProps = {
  current: AdminNavCurrent;
  account?: AccountMeResponse | null;
};

type AdminNavSection = 'pinned' | 'operations' | 'directory';

export const adminNavItems = [
  {
    key: 'dashboard',
    href: '/',
    label: 'Overview',
    icon: 'dashboard',
    section: 'pinned',
  },
  {
    key: 'messages',
    href: '/messages',
    label: 'Messages',
    icon: 'messages',
    section: 'operations',
  },
  {
    key: 'workers',
    href: '/workers',
    label: 'Workers',
    icon: 'workers',
    section: 'operations',
  },
  {
    key: 'support',
    href: '/support',
    label: 'Support',
    icon: 'support',
    section: 'operations',
  },
  {
    key: 'audit',
    href: '/audit',
    label: 'Audit',
    icon: 'audit',
    section: 'operations',
  },
  {
    key: 'users',
    href: '/users',
    label: 'Users',
    icon: 'users',
    section: 'directory',
  },
  {
    key: 'workspaces',
    href: '/workspaces',
    label: 'Workspaces',
    icon: 'workspaces',
    section: 'directory',
  },
] as const;

type AdminNavItem = (typeof adminNavItems)[number];
type AdminNavItemKey = AdminNavItem['key'];
type AdminNavIconKind = AdminNavItem['icon'];

export function resolveAdminNavCurrent(pathname: string): AdminNavCurrent {
  if (pathname.startsWith('/users')) {
    return 'users';
  }

  if (pathname.startsWith('/workspaces')) {
    return 'workspaces';
  }

  if (pathname.startsWith('/messages')) {
    return 'messages';
  }

  if (pathname.startsWith('/workers/')) {
    return 'worker-detail';
  }

  if (pathname.startsWith('/workers')) {
    return 'workers';
  }

  if (pathname.startsWith('/support')) {
    return 'support';
  }

  if (pathname.startsWith('/audit')) {
    return 'audit';
  }

  if (pathname.startsWith('/instances/')) {
    return 'instance';
  }

  return 'dashboard';
}

export function isAdminNavItemActive(
  itemKey: AdminNavItemKey,
  current: AdminNavCurrent,
) {
  if (itemKey === current) {
    return true;
  }

  if (current === 'worker-detail' && itemKey === 'workers') {
    return true;
  }

  if (current === 'instance' && itemKey === 'dashboard') {
    return true;
  }

  return false;
}

function AdminNavGlyph({ kind }: { kind: AdminNavIconKind }) {
  switch (kind) {
    case 'dashboard':
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3.6 9.35 10 4.15l6.4 5.2" />
          <path d="M5.2 8.85V16h4.1v-4.4h1.4V16h4.1V8.85" />
        </svg>
      );
    case 'messages':
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M4.2 5.6h11.6v7.1H9.7L6.2 15.5v-2.8H4.2z" />
          <path d="M6.3 8.1h7.4" />
          <path d="M6.3 10.2h4.8" />
        </svg>
      );
    case 'workers':
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="3.9" y="4.2" width="4.2" height="4.2" rx="1" />
          <rect x="11.9" y="4.2" width="4.2" height="4.2" rx="1" />
          <rect x="3.9" y="11.6" width="4.2" height="4.2" rx="1" />
          <path d="M10 6.3H11.9" />
          <path d="M6 8.4v3.2" />
          <path d="M8.1 13.7H11.9" />
          <path d="M14 8.4v5.3" />
        </svg>
      );
    case 'support':
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 15.9a5.9 5.9 0 1 0-5.9-5.9" />
          <path d="M4.1 10.05v2.75" />
          <path d="M15.9 10.05v2.75" />
          <path d="M6.25 15.15c.85.65 2.05 1.05 3.75 1.05s2.9-.4 3.75-1.05" />
        </svg>
      );
    case 'audit':
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 3.1 15.8 5.2V9c0 3.35-2 6.35-5.8 7.9C6.2 15.35 4.2 12.35 4.2 9V5.2z" />
          <path d="M8 9.8 9.35 11.15 12.2 8.3" />
        </svg>
      );
    case 'users':
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="7.1" cy="7.2" r="2.2" />
          <circle cx="13.25" cy="8" r="1.7" />
          <path d="M3.9 15c.55-2.15 2.35-3.45 5.05-3.45 2.7 0 4.5 1.3 5.05 3.45" />
          <path d="M12 14.95c.4-1.35 1.45-2.2 3.15-2.2.45 0 .85.05 1.2.15" />
        </svg>
      );
    case 'workspaces':
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="3.8" y="4.1" width="5.6" height="5.6" rx="1.2" />
          <rect x="10.6" y="4.1" width="5.6" height="3.6" rx="1.2" />
          <rect x="10.6" y="9.9" width="5.6" height="6" rx="1.2" />
          <rect x="3.8" y="11.9" width="5.6" height="4" rx="1.2" />
        </svg>
      );
    default:
      return null;
  }
}

function AdminNavChevron() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m7.2 4.9 4.9 5.1-4.9 5.1" />
    </svg>
  );
}

function renderAdminNavItem(item: AdminNavItem, active: boolean) {
  return (
    <Link
      key={item.key}
      href={item.href}
      className="elite-rail-link"
      data-key={item.key}
      data-active={active ? 'true' : 'false'}
      data-tooltip={item.label}
      aria-current={active ? 'page' : undefined}
      title={item.label}
    >
      <span className="elite-rail-link-main">
        <span className="elite-rail-link-icon" aria-hidden="true">
          <AdminNavGlyph kind={item.icon} />
        </span>
        <span className="elite-rail-link-label">{item.label}</span>
      </span>
      <span className="elite-rail-link-trailing">
        {active ? (
          <StatusBadge tone="warning">Current</StatusBadge>
        ) : (
          <span className="elite-rail-link-chevron" aria-hidden="true">
            <AdminNavChevron />
          </span>
        )}
      </span>
    </Link>
  );
}

function renderSection(section: AdminNavSection, current: AdminNavCurrent) {
  const copy =
    section === 'pinned'
      ? 'Pinned'
      : section === 'operations'
        ? 'Operations'
        : 'Directory';

  const items = adminNavItems.filter((item) => item.section === section);
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="elite-rail-section">
      <div className="elite-rail-section-label">{copy}</div>
      <div className="elite-rail-links">
        {items.map((item) =>
          renderAdminNavItem(item, isAdminNavItemActive(item.key, current)),
        )}
      </div>
    </div>
  );
}

export function AdminNav({ current, account }: AdminNavProps) {
  const headerCopy = account
    ? {
        label: 'Active operator',
        name: account.user.displayName,
        metaPrimary: account.user.role.replaceAll('_', ' '),
        metaSecondary: account.user.email,
      }
    : {
        label: 'Admin surface',
        name: 'Operations Console',
        metaPrimary: 'Platform admin',
        metaSecondary: 'Global access',
      };

  return (
    <nav className="elite-rail" aria-label="Admin navigation">
      <div className="elite-rail-header">
        <div className="elite-rail-workspace">
          <div className="elite-rail-workspace-label">{headerCopy.label}</div>
          <div className="elite-rail-workspace-name">{headerCopy.name}</div>
          <div className="elite-rail-workspace-meta">
            <span>{headerCopy.metaPrimary}</span>
            <span>{headerCopy.metaSecondary}</span>
          </div>
        </div>
      </div>

      {renderSection('pinned', current)}
      {renderSection('operations', current)}
      {renderSection('directory', current)}

      <div className="elite-rail-meta">
        {account ? (
          <>
            <StatusBadge tone="warning">{account.user.displayName}</StatusBadge>
            <StatusBadge tone="neutral">
              {account.workspaces.length} workspaces
            </StatusBadge>
          </>
        ) : (
          <StatusBadge tone="neutral">Admin surface</StatusBadge>
        )}
      </div>
    </nav>
  );
}
