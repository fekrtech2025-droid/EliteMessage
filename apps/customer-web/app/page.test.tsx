import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CustomerHomePage from './page';
import { getLandingPageCopy } from './lib/landing-content';
import { customerLocaleStorageKey } from './lib/customer-locale';

const { refreshCustomerAccessTokenMock, loadCustomerAccountMock } = vi.hoisted(
  () => ({
    refreshCustomerAccessTokenMock: vi.fn(),
    loadCustomerAccountMock: vi.fn(),
  }),
);

const englishCopy = getLandingPageCopy('en');
const arabicCopy = getLandingPageCopy('ar');

vi.mock('./lib/customer-auth', () => ({
  refreshCustomerAccessToken: refreshCustomerAccessTokenMock,
  loadCustomerAccount: loadCustomerAccountMock,
}));

function installMatchMedia(reduced = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: reduced,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
}

function installIntersectionObserver() {
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })),
  });
}

function installScrollIntoView() {
  Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
    writable: true,
    value: vi.fn(),
  });
}

function resetCustomerLocale() {
  document.documentElement.lang = 'en';
  document.documentElement.dir = 'ltr';
  document.documentElement.dataset.eliteCustomerLocale = 'en';
  window.localStorage.removeItem(customerLocaleStorageKey);
}

describe('customer home page', () => {
  afterEach(() => {
    cleanup();
    delete (window as Window & { __eliteRedirectHook?: () => void })
      .__eliteRedirectHook;
    resetCustomerLocale();
    window.history.replaceState(window.history.state, '', '/');
  });

  beforeEach(() => {
    refreshCustomerAccessTokenMock.mockReset();
    loadCustomerAccountMock.mockReset();
    resetCustomerLocale();
    installMatchMedia(false);
    installIntersectionObserver();
    installScrollIntoView();
    refreshCustomerAccessTokenMock.mockResolvedValue(null);
    loadCustomerAccountMock.mockResolvedValue(null);
  });

  it('renders landing content without inline auth for unauthenticated users', async () => {
    render(<CustomerHomePage />);

    await waitFor(() => {
      expect(screen.getByText(englishCopy.hero.titlePrefix)).toBeTruthy();
    });

    expect(
      screen.getAllByRole('link', { name: englishCopy.topbar.signIn }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('link', { name: englishCopy.topbar.createAccount })
        .length,
    ).toBeGreaterThan(0);
    expect(screen.getByAltText(englishCopy.topbar.brandAlt)).toBeTruthy();
    expect(screen.queryByPlaceholderText('owner@company.com')).toBeNull();
  });

  it('renders a bilingual story-driven home section with a custom illustration', async () => {
    render(<CustomerHomePage />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: `${englishCopy.home.titlePrefix} ${englishCopy.home.titleAccent}`,
        }),
      ).toBeTruthy();
    });

    expect(screen.getByText(englishCopy.home.lead)).toBeTruthy();
    expect(screen.getByText(englishCopy.home.englishBody)).toBeTruthy();
    expect(screen.getByText(englishCopy.home.arabicBody)).toBeTruthy();
    expect(
      screen.getByRole('img', { name: englishCopy.home.illustrationAlt }),
    ).toBeTruthy();
    expect(screen.getByText(englishCopy.home.cards[0]!.title)).toBeTruthy();
    expect(screen.getByText(englishCopy.home.cards[1]!.title)).toBeTruthy();
    expect(screen.getByText(englishCopy.home.cards[2]!.title)).toBeTruthy();
  });

  it('redirects authenticated users from / to /dashboard', async () => {
    const redirectSpy = vi.fn();
    (
      window as Window & { __eliteRedirectHook?: () => void }
    ).__eliteRedirectHook = redirectSpy;

    refreshCustomerAccessTokenMock.mockResolvedValue('customer-token');
    loadCustomerAccountMock.mockResolvedValue({
      user: { displayName: 'Owner' },
    });

    render(<CustomerHomePage />);

    await waitFor(() => {
      expect(redirectSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('routes landing auth CTAs to the dedicated signin and signup pages', async () => {
    render(<CustomerHomePage />);

    await waitFor(() => {
      expect(screen.getByRole('banner')).toBeTruthy();
    });

    expect(
      within(screen.getByRole('banner'))
        .getByRole('link', { name: englishCopy.topbar.signIn })
        .getAttribute('href'),
    ).toBe('/signin');
    expect(
      within(screen.getByRole('banner'))
        .getByRole('link', { name: englishCopy.topbar.createAccount })
        .getAttribute('href'),
    ).toBe('/signup');
    expect(
      screen
        .getByRole('link', { name: englishCopy.hero.getStarted })
        .getAttribute('href'),
    ).toBe('/signup');
  });

  it('applies reduced-motion fallback flag when user preference is set', async () => {
    installMatchMedia(true);
    render(<CustomerHomePage />);

    await waitFor(() => {
      expect(screen.getByRole('main').getAttribute('data-reduced-motion')).toBe(
        'true',
      );
    });
  });

  it('renders pricing cards and developer code showcase', async () => {
    render(<CustomerHomePage />);
    const [starterPlan, scalePlan, enterprisePlan] = englishCopy.pricing.plans;

    await waitFor(() => {
      expect(
        screen.getAllByText(englishCopy.developer.eyebrow).length,
      ).toBeGreaterThan(0);
    });

    expect(screen.getByText(starterPlan!.title)).toBeTruthy();
    expect(screen.getByText(scalePlan!.title)).toBeTruthy();
    expect(screen.getByText(enterprisePlan!.priceText ?? '')).toBeTruthy();
    expect(screen.getByText(englishCopy.pricing.assuranceTitle)).toBeTruthy();
  });

  it('renders section anchors and CTA routes for the landing page', async () => {
    render(<CustomerHomePage />);

    await waitFor(() => {
      expect(
        screen.getByRole('navigation', { name: englishCopy.topbar.navLabel }),
      ).toBeTruthy();
    });

    expect(
      screen.getByRole('tab', { name: englishCopy.tabs.home }),
    ).toBeTruthy();
    expect(
      screen.getByRole('tab', { name: englishCopy.tabs.features }),
    ).toBeTruthy();
    expect(
      screen.getByRole('tab', { name: englishCopy.tabs.developer }),
    ).toBeTruthy();
    expect(
      screen.getByRole('tab', { name: englishCopy.tabs.pricing }),
    ).toBeTruthy();
    expect(
      screen.getByRole('tab', { name: englishCopy.tabs.faq }),
    ).toBeTruthy();
  });

  it('switches landing tab panels and syncs the tab hash', async () => {
    render(<CustomerHomePage />);

    await waitFor(() => {
      expect(
        screen.getByRole('tab', { name: englishCopy.tabs.features }),
      ).toBeTruthy();
    });

    screen.getByRole('tab', { name: englishCopy.tabs.features }).click();

    await waitFor(() => {
      expect(
        screen.getByRole('tabpanel', { name: englishCopy.tabs.features }),
      ).toBeTruthy();
      expect(window.location.hash).toBe('#features');
    });

    expect(
      screen
        .getByText(englishCopy.hero.titlePrefix)
        .closest('[role="tabpanel"]')
        ?.hasAttribute('hidden'),
    ).toBe(true);
  });

  it('routes final landing CTAs to the dedicated auth pages', async () => {
    render(<CustomerHomePage />);

    await waitFor(() => {
      expect(screen.getByText(englishCopy.hero.titlePrefix)).toBeTruthy();
    });

    expect(
      screen
        .getByRole('link', { name: englishCopy.hero.getStarted })
        .getAttribute('href'),
    ).toBe('/signup');
    expect(
      screen
        .getAllByRole('link', { name: englishCopy.topbar.signIn })
        .some((link) => link.getAttribute('href') === '/signin'),
    ).toBe(true);
  });

  it('switches the landing page to Arabic when the locale toggle is used', async () => {
    render(<CustomerHomePage />);

    await waitFor(() => {
      expect(screen.getByText(englishCopy.hero.titlePrefix)).toBeTruthy();
    });

    screen
      .getByRole('button', { name: englishCopy.topbar.localeToggleAria })
      .click();

    await waitFor(() => {
      expect(document.documentElement.lang).toBe('ar');
      expect(document.documentElement.dir).toBe('rtl');
    });

    expect(
      screen.getByRole('navigation', { name: arabicCopy.topbar.navLabel }),
    ).toBeTruthy();
    expect(
      screen.getByRole('tab', { name: arabicCopy.tabs.home }),
    ).toBeTruthy();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: `${arabicCopy.home.titlePrefix} ${arabicCopy.home.titleAccent}`,
      }),
    ).toBeTruthy();
    expect(screen.getByText(arabicCopy.home.arabicBody)).toBeTruthy();
    expect(
      screen.getByRole('img', { name: arabicCopy.home.illustrationAlt }),
    ).toBeTruthy();
    expect(
      screen
        .getByRole('link', { name: arabicCopy.hero.getStarted })
        .getAttribute('href'),
    ).toBe('/signup');
    expect(screen.getByAltText(arabicCopy.topbar.brandAlt)).toBeTruthy();
  });
});
