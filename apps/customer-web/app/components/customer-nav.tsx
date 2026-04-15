'use client';

import Link from 'next/link';
import type { AccountMeResponse } from '@elite-message/contracts';
import { StatusBadge } from '@elite-message/ui';
import { useCustomerLocale } from './customer-localization';
import { translateCustomerEnum } from '../lib/customer-locale';

type CustomerNavProps = {
  current:
    | 'dashboard'
    | 'settings'
    | 'messages'
    | 'subscription'
    | 'api-docs'
    | 'instance';
  account?: AccountMeResponse | null;
  workspaceId?: string;
};

const navItems = [
  {
    key: 'dashboard',
    href: '/dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
  },
  { key: 'messages', href: '/messages', label: 'Messages', icon: 'messages' },
  {
    key: 'api-docs',
    href: '/api-documents',
    label: 'API Documents',
    icon: 'api-docs',
  },
  { key: 'settings', href: '/settings', label: 'Settings', icon: 'settings' },
  {
    key: 'subscription',
    href: '/subscription',
    label: 'Subscription',
    icon: 'subscription',
  },
] as const;

type NavItem = (typeof navItems)[number];
type RenderableNavItem = Omit<NavItem, 'label'> & {
  label: string;
};
type NavIconKind = NavItem['icon'];

function NavGlyph({ kind }: { kind: NavIconKind }) {
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
    case 'api-docs':
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M6 3.8h6.5l3 3V16.2H6z" />
          <path d="M12.5 3.8V6.9h3" />
          <path d="M8 8.8h4.8" />
          <path d="M8 11.2h4.8" />
          <path d="M8 13.6h3.2" />
        </svg>
      );
    case 'settings':
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M4.2 6.2h11.6" />
          <circle cx="8.1" cy="6.2" r="1.35" />
          <path d="M4.2 10h11.6" />
          <circle cx="12" cy="10" r="1.35" />
          <path d="M4.2 13.8h11.6" />
          <circle cx="6.7" cy="13.8" r="1.35" />
        </svg>
      );
    case 'subscription':
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="3.6" y="5.1" width="12.8" height="9.8" rx="2.2" />
          <path d="M3.6 8.1h12.8" />
          <path d="M6.2 11.9h3.2" />
        </svg>
      );
    default:
      return null;
  }
}

function NavChevron() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m7.2 4.9 4.9 5.1-4.9 5.1" />
    </svg>
  );
}

function renderNavItem(
  item: RenderableNavItem,
  active: boolean,
  currentLabel: string,
) {
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
          <NavGlyph kind={item.icon} />
        </span>
        <span className="elite-rail-link-label">{item.label}</span>
      </span>
      <span className="elite-rail-link-trailing">
        {active ? (
          <StatusBadge tone="info">{currentLabel}</StatusBadge>
        ) : (
          <span className="elite-rail-link-chevron" aria-hidden="true">
            <NavChevron />
          </span>
        )}
      </span>
    </Link>
  );
}

export function CustomerNav({
  current,
  account,
  workspaceId,
}: CustomerNavProps) {
  const { locale } = useCustomerLocale();
  const selectedWorkspace =
    account?.workspaces.find((workspace) => workspace.id === workspaceId) ??
    account?.workspaces[0] ??
    null;
  const localizedNavItems = navItems.map((item) => ({
    ...item,
    label:
      locale === 'ar'
        ? (
            {
              'api-docs': 'وثائق API',
              dashboard: 'لوحة التحكم',
              messages: 'الرسائل',
              settings: 'الإعدادات',
              subscription: 'الاشتراك',
            } as const
          )[item.key]
        : item.label,
  }));
  const localizedPinnedItems = localizedNavItems.filter(
    (item) => item.key === 'dashboard',
  );
  const localizedGeneralItems = localizedNavItems.filter(
    (item) => item.key !== 'dashboard',
  );
  const copy =
    locale === 'ar'
      ? {
          activeWorkspace: 'مساحة العمل النشطة',
          current: 'الحالية',
          customerSurface: 'واجهة العميل',
          general: 'عام',
          navigation: 'تنقل العميل',
          pinned: 'مثبت',
        }
      : {
          activeWorkspace: 'Active workspace',
          current: 'Current',
          customerSurface: 'Customer surface',
          general: 'General',
          navigation: 'Customer navigation',
          pinned: 'Pinned',
        };

  return (
    <nav className="elite-rail" aria-label={copy.navigation}>
      <div className="elite-rail-header">
        {selectedWorkspace ? (
          <div className="elite-rail-workspace">
            <div className="elite-rail-workspace-label">
              {copy.activeWorkspace}
            </div>
            <div className="elite-rail-workspace-name">
              {selectedWorkspace.name}
            </div>
            <div className="elite-rail-workspace-meta">
              <span>
                {translateCustomerEnum(locale, selectedWorkspace.role)}
              </span>
              <span>{selectedWorkspace.slug}</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="elite-rail-section">
        <div className="elite-rail-section-label">{copy.pinned}</div>
        <div className="elite-rail-links">
          {localizedPinnedItems.map((item) =>
            renderNavItem(
              item,
              item.key === current ||
                (current === 'instance' && item.key === 'dashboard'),
              copy.current,
            ),
          )}
        </div>
      </div>

      <div className="elite-rail-section">
        <div className="elite-rail-section-label">{copy.general}</div>
        <div className="elite-rail-links">
          {localizedGeneralItems.map((item) =>
            renderNavItem(item, item.key === current, copy.current),
          )}
        </div>
      </div>

      <div className="elite-rail-meta">
        {account ? (
          <>
            <StatusBadge tone="info">{account.user.displayName}</StatusBadge>
            <StatusBadge tone="neutral">
              {locale === 'ar'
                ? `${account.workspaces.length} مساحات عمل`
                : `${account.workspaces.length} workspaces`}
            </StatusBadge>
          </>
        ) : (
          <StatusBadge tone="neutral">{copy.customerSurface}</StatusBadge>
        )}
      </div>
    </nav>
  );
}
