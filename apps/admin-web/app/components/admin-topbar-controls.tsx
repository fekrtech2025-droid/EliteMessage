'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import type { AccountMeResponse } from '@elite-message/contracts';
import {
  adminNavItems,
  isAdminNavItemActive,
  resolveAdminNavCurrent,
} from './admin-nav';
import { AdminThemeControl } from './admin-theme-control';
import { apiBaseUrl, clearStoredToken } from '../lib/session';

type AdminTopbarControlsProps = {
  account?: AccountMeResponse | null;
};

function closeDetailsMenu(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const details = target.closest('details');
  if (details instanceof HTMLDetailsElement) {
    details.open = false;
  }
}

function TopbarIcon({ children }: { children: ReactNode }) {
  return <span aria-hidden="true">{children}</span>;
}

function OpsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2.9 16.2 5.2v4c0 3.6-2.15 6.55-6.2 8-4.05-1.45-6.2-4.4-6.2-8v-4z" />
      <path d="M8.2 9.8 9.45 11.05 12.1 8.4" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4.5 8V4.5H8" />
      <path d="M12 4.5H15.5V8" />
      <path d="M15.5 12V15.5H12" />
      <path d="M8 15.5H4.5V12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="4.25" />
      <path d="M12 12L16.25 16.25" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="7.1" cy="7.2" r="2.2" />
      <circle cx="13.25" cy="8" r="1.7" />
      <path d="M3.9 15c.55-2.15 2.35-3.45 5.05-3.45 2.7 0 4.5 1.3 5.05 3.45" />
      <path d="M12 14.95c.4-1.35 1.45-2.2 3.15-2.2.45 0 .85.05 1.2.15" />
    </svg>
  );
}

function WorkspacesIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3.8" y="4.1" width="5.6" height="5.6" rx="1.2" />
      <rect x="10.6" y="4.1" width="5.6" height="3.6" rx="1.2" />
      <rect x="10.6" y="9.9" width="5.6" height="6" rx="1.2" />
      <rect x="3.8" y="11.9" width="5.6" height="4" rx="1.2" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 15.9a5.9 5.9 0 1 0-5.9-5.9" />
      <path d="M4.1 10.05v2.75" />
      <path d="M15.9 10.05v2.75" />
      <path d="M6.25 15.15c.85.65 2.05 1.05 3.75 1.05s2.9-.4 3.75-1.05" />
    </svg>
  );
}

function AuditIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3.1 15.8 5.2V9c0 3.35-2 6.35-5.8 7.9C6.2 15.35 4.2 12.35 4.2 9V5.2z" />
      <path d="M8 9.8 9.35 11.15 12.2 8.3" />
    </svg>
  );
}

export function AdminTopbarControls({ account }: AdminTopbarControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const current = resolveAdminNavCurrent(pathname ?? '/');
  const userDisplayName = account?.user.displayName ?? 'Admin Operator';
  const userRole = account?.user.role.replaceAll('_', ' ') ?? 'Admin console';
  const userInitial = (userDisplayName || account?.user.email || 'A')
    .trim()
    .charAt(0)
    .toUpperCase();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setIsFullscreen(Boolean(document.fullscreenElement));

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  function pushRoute(href: string) {
    router.push(href);
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      await document.documentElement.requestFullscreen();
    } catch {
      // Ignore fullscreen failures on browsers that block the request.
    }
  }

  async function logout() {
    try {
      await fetch(`${apiBaseUrl}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      clearStoredToken();
      window.location.assign('/');
    }
  }

  return (
    <div className="elite-customer-topbar-controls">
      <div
        className="elite-customer-topbar-utilities"
        aria-label="Admin topbar shortcuts"
      >
        <button
          type="button"
          data-unstyled-button
          className="elite-customer-topbar-language"
          aria-label="Open admin overview"
          data-active={current === 'dashboard' ? 'true' : 'false'}
          onClick={() => {
            pushRoute('/');
          }}
        >
          <span
            className="elite-customer-topbar-language-flag"
            aria-hidden="true"
          >
            <OpsIcon />
          </span>
          <span className="elite-customer-topbar-language-code">OPS</span>
        </button>
        <AdminThemeControl syncAccount />
        <button
          type="button"
          data-unstyled-button
          className="elite-customer-topbar-utility"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          aria-pressed={isFullscreen}
          data-active={isFullscreen ? 'true' : 'false'}
          onClick={() => {
            void toggleFullscreen();
          }}
        >
          <TopbarIcon>
            <ExpandIcon />
          </TopbarIcon>
        </button>
        <button
          type="button"
          data-unstyled-button
          className="elite-customer-topbar-utility"
          aria-label="Open message explorer"
          data-active={current === 'messages' ? 'true' : 'false'}
          onClick={() => {
            pushRoute('/messages');
          }}
        >
          <TopbarIcon>
            <SearchIcon />
          </TopbarIcon>
        </button>
        <button
          type="button"
          data-unstyled-button
          className="elite-customer-topbar-utility"
          aria-label="Open users explorer"
          data-active={current === 'users' ? 'true' : 'false'}
          onClick={() => {
            pushRoute('/users');
          }}
        >
          <TopbarIcon>
            <UsersIcon />
          </TopbarIcon>
        </button>
        <button
          type="button"
          data-unstyled-button
          className="elite-customer-topbar-utility"
          aria-label="Open workspaces explorer"
          data-active={current === 'workspaces' ? 'true' : 'false'}
          onClick={() => {
            pushRoute('/workspaces');
          }}
        >
          <TopbarIcon>
            <WorkspacesIcon />
          </TopbarIcon>
        </button>
        <button
          type="button"
          data-unstyled-button
          className="elite-customer-topbar-utility"
          aria-label="Open support cases"
          data-active={current === 'support' ? 'true' : 'false'}
          onClick={() => {
            pushRoute('/support');
          }}
        >
          <TopbarIcon>
            <SupportIcon />
          </TopbarIcon>
        </button>
        <button
          type="button"
          data-unstyled-button
          className="elite-customer-topbar-utility"
          aria-label="Open audit explorer"
          data-active={current === 'audit' ? 'true' : 'false'}
          onClick={() => {
            pushRoute('/audit');
          }}
        >
          <TopbarIcon>
            <AuditIcon />
          </TopbarIcon>
        </button>
      </div>

      <details className="elite-customer-topbar-menu">
        <summary
          className="elite-customer-topbar-user"
          aria-label="Admin account menu"
        >
          <span
            className="elite-customer-topbar-user-avatar"
            aria-hidden="true"
          >
            {userInitial}
          </span>
          <span className="elite-customer-topbar-user-copy">
            <strong>{userDisplayName}</strong>
            <span>{userRole}</span>
          </span>
          <span className="elite-customer-topbar-user-caret" aria-hidden="true">
            ▾
          </span>
        </summary>

        <div className="elite-customer-topbar-menu-panel">
          <div className="elite-customer-topbar-menu-eyebrow">
            Quick navigation
          </div>
          <div className="elite-customer-topbar-menu-list">
            {adminNavItems.map((item) => {
              const active = isAdminNavItemActive(item.key, current);

              return (
                <button
                  key={item.key}
                  type="button"
                  data-unstyled-button
                  className="elite-customer-topbar-menu-item"
                  data-active={active ? 'true' : 'false'}
                  onClick={(event) => {
                    closeDetailsMenu(event.currentTarget);
                    pushRoute(item.href);
                  }}
                >
                  <span className="elite-customer-topbar-menu-item-copy">
                    <strong>{item.label}</strong>
                    <span>
                      {item.href === '/'
                        ? 'Admin overview'
                        : `Open ${item.label.toLowerCase()}`}
                    </span>
                  </span>
                  <span
                    className="elite-customer-topbar-menu-item-state"
                    aria-hidden="true"
                  >
                    {active ? 'Active' : 'Open'}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            data-unstyled-button
            className="elite-customer-topbar-menu-logout"
            onClick={(event) => {
              closeDetailsMenu(event.currentTarget);
              void logout();
            }}
          >
            Log out
          </button>
        </div>
      </details>
    </div>
  );
}
