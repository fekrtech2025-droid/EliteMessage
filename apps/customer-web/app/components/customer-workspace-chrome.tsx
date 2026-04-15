'use client';

import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { AccountMeResponse } from '@elite-message/contracts';
import { useCustomerLocale } from './customer-localization';
import { CustomerThemeControl } from './customer-theme-control';
import { translateCustomerEnum } from '../lib/customer-locale';
import { announceCustomerNavigationStart } from '../lib/navigation-progress';
type CustomerWorkspaceChromeProps = {
  account: AccountMeResponse;
  workspaceId: string;
  onWorkspaceChange: (workspaceId: string) => void;
  onLogout: () => void;
};

type CustomerTopbarAnnouncementProps = {
  eyebrow: string;
  message: string;
  linkLabel: string;
  linkHref: string;
};

function resolveWorkspace(account: AccountMeResponse, workspaceId: string) {
  return (
    account.workspaces.find((workspace) => workspace.id === workspaceId) ??
    account.workspaces[0] ??
    null
  );
}

function closeDetailsMenu(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const details = target.closest('details');
  if (details instanceof HTMLDetailsElement) {
    details.open = false;
  }
}

function buildCustomerRoute(
  pathname: string,
  workspaceId: string,
  params: Record<string, string | undefined> = {},
) {
  const query = new URLSearchParams();

  if (workspaceId) {
    query.set('workspaceId', workspaceId);
  }

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      query.set(key, value);
    }
  }

  const search = query.toString();
  return search ? `${pathname}?${search}` : pathname;
}

function TopbarIcon({ children }: { children: ReactNode }) {
  return <span aria-hidden="true">{children}</span>;
}

function LanguageFlagIcon() {
  return (
    <svg viewBox="0 0 20 14" fill="none" aria-hidden="true">
      <path
        d="M0.75 1.25H19.25V12.75H0.75V1.25Z"
        fill="#ffffff"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path d="M0.75 2.65H19.25" stroke="#d72828" strokeWidth="1.05" />
      <path d="M0.75 5.1H19.25" stroke="#d72828" strokeWidth="1.05" />
      <path d="M0.75 7.55H19.25" stroke="#d72828" strokeWidth="1.05" />
      <path d="M0.75 10H19.25" stroke="#d72828" strokeWidth="1.05" />
      <path d="M0.75 1.25H10.3V6.7H0.75V1.25Z" fill="#2451a4" />
      <circle cx="2.4" cy="2.4" r="0.35" fill="#ffffff" />
      <circle cx="4.0" cy="2.4" r="0.35" fill="#ffffff" />
      <circle cx="5.6" cy="2.4" r="0.35" fill="#ffffff" />
      <circle cx="2.4" cy="3.7" r="0.35" fill="#ffffff" />
      <circle cx="4.0" cy="3.7" r="0.35" fill="#ffffff" />
      <circle cx="5.6" cy="3.7" r="0.35" fill="#ffffff" />
      <circle cx="2.4" cy="5.0" r="0.35" fill="#ffffff" />
      <circle cx="4.0" cy="5.0" r="0.35" fill="#ffffff" />
      <circle cx="5.6" cy="5.0" r="0.35" fill="#ffffff" />
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

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2.8 12.46 7.7 17.86 8.5 14.03 12.14 14.95 17.5 10 14.86 5.05 17.5 5.97 12.14 2.14 8.5 7.54 7.7 10 2.8Z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3.1 3.8H4.65L5.7 11.25H14.95L16.25 5.9H6.15" />
      <path d="M6.1 11.25 5.45 7.4H16" />
      <circle cx="8.2" cy="15.1" r="1.1" />
      <circle cx="13.55" cy="15.1" r="1.1" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5.2 13.1V9.1C5.2 6.4 7.3 4.25 10 4.25C12.7 4.25 14.8 6.4 14.8 9.1V13.1" />
      <path d="M4.1 13.1H15.9" />
      <path d="M8.1 15.05C8.5 15.85 9.2 16.35 10 16.35C10.8 16.35 11.5 15.85 11.9 15.05" />
    </svg>
  );
}

export function CustomerWorkspaceSummary({
  account,
  workspaceId,
}: Pick<CustomerWorkspaceChromeProps, 'account' | 'workspaceId'>) {
  const { locale } = useCustomerLocale();
  const selectedWorkspace = resolveWorkspace(account, workspaceId);
  const copy =
    locale === 'ar'
      ? {
          accessibleWorkspaces: 'مساحات العمل المتاحة',
          chooseWorkspace: 'اختر مساحة العمل من قائمة الحساب',
          sessionSummary: 'ملخص جلسة العميل',
          workspace: 'مساحة العمل',
        }
      : {
          accessibleWorkspaces: 'accessible workspaces',
          chooseWorkspace: 'Choose a workspace from the profile menu',
          sessionSummary: 'Customer session summary',
          workspace: 'Workspace',
        };

  return (
    <div
      className="elite-customer-topbar-summary"
      aria-label={copy.sessionSummary}
    >
      <span className="elite-customer-topbar-summary-chip">
        {copy.workspace}
      </span>
      <span className="elite-customer-topbar-summary-line">
        <strong>
          {selectedWorkspace
            ? selectedWorkspace.name
            : `${account.workspaces.length} ${copy.accessibleWorkspaces}`}
        </strong>
        <span>
          {selectedWorkspace
            ? `${translateCustomerEnum(locale, selectedWorkspace.role)} · ${selectedWorkspace.slug}`
            : copy.chooseWorkspace}
        </span>
      </span>
    </div>
  );
}

export function CustomerTopbarAnnouncement({
  eyebrow,
  message,
  linkLabel,
  linkHref,
}: CustomerTopbarAnnouncementProps) {
  const { locale } = useCustomerLocale();
  return (
    <div
      className="elite-customer-topbar-announcement"
      aria-label={
        locale === 'ar'
          ? 'إعلان الشريط العلوي للعميل'
          : 'Customer topbar announcement'
      }
    >
      <span
        className="elite-customer-topbar-announcement-icon"
        aria-hidden="true"
      >
        🔥
      </span>
      <span className="elite-customer-topbar-announcement-copy">
        <strong>{eyebrow}</strong>
        <span>{message}</span>
      </span>
      <Link className="elite-customer-topbar-announcement-link" href={linkHref}>
        {linkLabel}
      </Link>
    </div>
  );
}

export function CustomerWorkspaceControls({
  account,
  workspaceId,
  onWorkspaceChange,
  onLogout,
}: CustomerWorkspaceChromeProps) {
  const router = useRouter();
  const { locale, toggleLocale } = useCustomerLocale();
  const userInitial = (account.user.displayName || account.user.email || 'U')
    .trim()
    .charAt(0)
    .toUpperCase();
  const selectedWorkspace = resolveWorkspace(account, workspaceId);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const copy =
    locale === 'ar'
      ? {
          accountMenu: 'قائمة الحساب ومساحات العمل',
          active: 'الحالية',
          arabic: 'العربية',
          customer: 'حساب العميل',
          enterFullscreen: 'الدخول إلى وضع ملء الشاشة',
          exitFullscreen: 'الخروج من وضع ملء الشاشة',
          languagePreference: 'تبديل اللغة',
          logout: 'تسجيل الخروج',
          openMessages: 'فتح صفحة الرسائل',
          openQueueMessages: 'عرض الرسائل في الانتظار',
          openSettings: 'فتح الإعدادات',
          openSubscription: 'فتح صفحة الاشتراك',
          shortcuts: 'اختصارات الشريط العلوي',
          switch: 'اختيار',
          switchWorkspace: 'تبديل مساحة العمل',
        }
      : {
          accountMenu: 'Customer account and workspace menu',
          active: 'Active',
          arabic: 'Arabic',
          customer: 'Customer',
          enterFullscreen: 'Enter fullscreen',
          exitFullscreen: 'Exit fullscreen',
          languagePreference: 'Language preference',
          logout: 'Log out',
          openMessages: 'Open message search',
          openQueueMessages: 'Open queue messages',
          openSettings: 'Open account settings',
          openSubscription: 'Open subscription',
          shortcuts: 'Customer topbar shortcuts',
          switch: 'Switch',
          switchWorkspace: 'Switch workspace',
        };

  useEffect(() => {
    setIsFullscreen(Boolean(document.fullscreenElement));
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  function pushRoute(
    pathname: string,
    params: Record<string, string | undefined> = {},
  ) {
    const href = buildCustomerRoute(pathname, workspaceId, params);
    announceCustomerNavigationStart(href);
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
      // Keep the control resilient on browsers that block fullscreen.
    }
  }

  return (
    <div className="elite-customer-topbar-controls">
      <div
        className="elite-customer-topbar-utilities"
        aria-label={copy.shortcuts}
      >
        <button
          type="button"
          data-unstyled-button
          className="elite-customer-topbar-language"
          aria-label={`${copy.languagePreference}, ${locale === 'en' ? 'English' : copy.arabic}`}
          aria-pressed={locale === 'ar'}
          data-active={locale === 'ar' ? 'true' : 'false'}
          onClick={toggleLocale}
        >
          <span
            className="elite-customer-topbar-language-flag"
            aria-hidden="true"
          >
            <LanguageFlagIcon />
          </span>
          <span className="elite-customer-topbar-language-code">
            {locale.toUpperCase()}
          </span>
        </button>
        <button
          type="button"
          data-unstyled-button
          className="elite-customer-topbar-utility"
          aria-label={isFullscreen ? copy.exitFullscreen : copy.enterFullscreen}
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
          aria-label={copy.openMessages}
          onClick={() => {
            pushRoute('/messages', { focus: 'recipient' });
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
          aria-label={copy.openSettings}
          onClick={() => {
            pushRoute('/settings', { focus: 'tokens' });
          }}
        >
          <TopbarIcon>
            <StarIcon />
          </TopbarIcon>
        </button>
        <CustomerThemeControl syncAccount />
        <button
          type="button"
          data-unstyled-button
          className="elite-customer-topbar-utility"
          aria-label={copy.openSubscription}
          onClick={() => {
            pushRoute('/subscription');
          }}
        >
          <TopbarIcon>
            <CartIcon />
          </TopbarIcon>
          <span
            className="elite-customer-topbar-utility-badge"
            aria-hidden="true"
          >
            2
          </span>
        </button>
        <button
          type="button"
          data-unstyled-button
          className="elite-customer-topbar-utility"
          aria-label={copy.openQueueMessages}
          onClick={() => {
            pushRoute('/messages', { status: 'queue' });
          }}
        >
          <TopbarIcon>
            <BellIcon />
          </TopbarIcon>
          <span
            className="elite-customer-topbar-utility-badge"
            aria-hidden="true"
          >
            4
          </span>
        </button>
      </div>
      <details className="elite-customer-topbar-menu">
        <summary
          className="elite-customer-topbar-user"
          aria-label={copy.accountMenu}
        >
          <span
            className="elite-customer-topbar-user-avatar"
            aria-hidden="true"
          >
            {userInitial}
          </span>
          <span className="elite-customer-topbar-user-copy">
            <strong>{account.user.displayName}</strong>
            <span>
              {selectedWorkspace ? selectedWorkspace.name : copy.customer}
            </span>
          </span>
          <span className="elite-customer-topbar-user-caret" aria-hidden="true">
            ▾
          </span>
        </summary>
        <div className="elite-customer-topbar-menu-panel">
          <div className="elite-customer-topbar-menu-eyebrow">
            {copy.switchWorkspace}
          </div>
          <div className="elite-customer-topbar-menu-list">
            {account.workspaces.map((workspace) => {
              const active = workspace.id === workspaceId;

              return (
                <button
                  key={workspace.id}
                  type="button"
                  data-unstyled-button
                  className="elite-customer-topbar-menu-item"
                  data-active={active ? 'true' : 'false'}
                  onClick={(event) => {
                    onWorkspaceChange(workspace.id);
                    closeDetailsMenu(event.currentTarget);
                  }}
                >
                  <span className="elite-customer-topbar-menu-item-copy">
                    <strong>{workspace.name}</strong>
                    <span>
                      {translateCustomerEnum(locale, workspace.role)} ·{' '}
                      {workspace.slug}
                    </span>
                  </span>
                  <span
                    className="elite-customer-topbar-menu-item-state"
                    aria-hidden="true"
                  >
                    {active ? copy.active : copy.switch}
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
              onLogout();
            }}
          >
            {copy.logout}
          </button>
        </div>
      </details>
    </div>
  );
}
