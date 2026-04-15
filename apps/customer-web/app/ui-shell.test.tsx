import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppShell } from '@elite-message/ui';

describe('shared app shell', () => {
  it('renders the customer surface rail shell contract', () => {
    const { container } = render(
      <AppShell
        title="Shell Title"
        subtitle="Shell subtitle"
        breadcrumbLabel="Section"
        surface="customer"
        nav={
          <nav>
            <a href="/dashboard">Dashboard</a>
          </nav>
        }
        headerActions={<button type="button">Primary action</button>}
        secondaryNav={<div>Section links</div>}
      >
        <div>Shell body</div>
      </AppShell>,
    );

    expect(screen.getByText('Customer Surface')).toBeTruthy();
    expect(
      container.querySelector('img[src="/images/EliteMessage_Icon_Only.png"]'),
    ).toBeTruthy();
    expect(screen.getByText('Navigation')).toBeTruthy();
    expect(screen.getByText('Primary action')).toBeTruthy();
    expect(screen.getByText('Section links')).toBeTruthy();
    expect(screen.getAllByText('Dashboard')).toHaveLength(3);
    expect(
      within(screen.getByLabelText('Breadcrumb')).getByText('Section'),
    ).toBeTruthy();
  });

  it('renders a topbar launcher control for the customer sidebar', () => {
    const { container } = render(
      <AppShell
        title="Shell Title"
        subtitle="Shell subtitle"
        breadcrumbLabel="Section"
        surface="customer"
        nav={
          <nav>
            <a href="/dashboard">Dashboard</a>
          </nav>
        }
      >
        <div>Shell body</div>
      </AppShell>,
    );

    const launcher = container.querySelector<HTMLButtonElement>(
      '.elite-shell-topbar-brand-launcher',
    );
    const shell = container.querySelector('main[data-elite-shell]');
    const aside = container.querySelector('.elite-shell-aside');

    expect(launcher).toBeTruthy();
    expect(shell?.getAttribute('data-nav-collapsed')).toBeNull();
    expect(aside?.hasAttribute('hidden')).toBe(false);
    expect(launcher?.getAttribute('aria-expanded')).toBe('true');
    expect(launcher?.getAttribute('aria-label')).toBe('Collapse sidebar menu');
    expect(launcher?.getAttribute('aria-controls')).toBe(aside?.id);
  });

  it('renders a topbar launcher control for the admin sidebar', () => {
    const { container } = render(
      <AppShell
        title="Admin shell"
        subtitle="Admin subtitle"
        surface="admin"
        nav={
          <nav>
            <a href="/users">Users</a>
          </nav>
        }
        headerActions={<button type="button">Admin action</button>}
      >
        <div>Admin body</div>
      </AppShell>,
    );

    const launcher = container.querySelector<HTMLButtonElement>(
      '.elite-shell-topbar-brand-launcher',
    );
    const shell = container.querySelector('main[data-elite-shell]');
    const aside = container.querySelector('.elite-shell-aside');

    expect(screen.getByText('Admin action')).toBeTruthy();
    expect(launcher).toBeTruthy();
    expect(shell?.getAttribute('data-nav-collapsed')).toBeNull();
    expect(aside?.hasAttribute('hidden')).toBe(false);
    expect(launcher?.getAttribute('aria-expanded')).toBe('true');
    expect(launcher?.getAttribute('aria-label')).toBe('Collapse sidebar menu');
    expect(launcher?.getAttribute('aria-controls')).toBe(aside?.id);
  });

  it('renders the admin surface label', () => {
    render(
      <AppShell title="Admin shell" subtitle="Admin subtitle" surface="admin">
        <div>Admin body</div>
      </AppShell>,
    );

    expect(screen.getAllByText('Admin Console').length).toBeGreaterThan(0);
  });
});
