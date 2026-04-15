import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CustomerNavigationProgress } from './components/navigation-progress';
import {
  announceCustomerNavigationStart,
  customerPendingNavigationStorageKey,
} from './lib/navigation-progress';

const navigationState = vi.hoisted(() => ({
  pathname: '/',
  search: '',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
  useSearchParams: () => new URLSearchParams(navigationState.search),
}));

describe('CustomerNavigationProgress', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigationState.pathname = '/';
    navigationState.search = '';
    window.sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('shows progress for router-driven navigation and hides after the route settles', () => {
    const { container, rerender } = render(<CustomerNavigationProgress />);
    const progress = container.querySelector<HTMLElement>(
      '.elite-route-progress',
    );

    expect(progress?.dataset.state).toBe('idle');

    act(() => {
      announceCustomerNavigationStart('/messages');
    });

    expect(progress?.dataset.state).toBe('loading');

    navigationState.pathname = '/messages';
    rerender(<CustomerNavigationProgress />);

    act(() => {
      vi.advanceTimersByTime(140);
    });

    expect(progress?.dataset.state).toBe('completing');

    act(() => {
      vi.advanceTimersByTime(260);
    });

    expect(progress?.dataset.state).toBe('idle');
  });

  it('resumes a pending full-page navigation after the next route mounts', () => {
    window.sessionStorage.setItem(
      customerPendingNavigationStorageKey,
      JSON.stringify({
        href: '/settings',
        startedAt: Date.now(),
      }),
    );

    const { container } = render(<CustomerNavigationProgress />);
    const progress = container.querySelector<HTMLElement>(
      '.elite-route-progress',
    );

    expect(progress?.dataset.state).toBe('loading');

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(progress?.dataset.state).toBe('completing');
  });
});
