export const customerNavigationStartEvent =
  'elite-message:customer-navigation-start';
export const customerPendingNavigationStorageKey =
  'elite-message.customer.pending-navigation';

const pendingNavigationMaxAgeMs = 10_000;

type PendingNavigation = {
  href: string;
  startedAt: number;
};

function normalizeHref(href: string) {
  if (typeof window === 'undefined') {
    return href;
  }

  try {
    const url = new URL(href, window.location.href);
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return href;
  }
}

export function isInternalCustomerNavigationTarget(href: string) {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) {
      return false;
    }

    const current = new URL(window.location.href);
    const isHashOnlyNavigation =
      url.pathname === current.pathname &&
      url.search === current.search &&
      url.hash !== current.hash;
    if (isHashOnlyNavigation) {
      return false;
    }

    return (
      `${url.pathname}${url.search}${url.hash}` !==
      `${current.pathname}${current.search}${current.hash}`
    );
  } catch {
    return false;
  }
}

export function announceCustomerNavigationStart(href: string) {
  if (typeof window === 'undefined') {
    return;
  }

  const pendingNavigation: PendingNavigation = {
    href: normalizeHref(href),
    startedAt: Date.now(),
  };

  try {
    window.sessionStorage.setItem(
      customerPendingNavigationStorageKey,
      JSON.stringify(pendingNavigation),
    );
  } catch {
    // Ignore persistence failures in private browsing or restricted contexts.
  }

  window.dispatchEvent(
    new CustomEvent(customerNavigationStartEvent, {
      detail: pendingNavigation,
    }),
  );
}

export function readPendingCustomerNavigation(): PendingNavigation | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(
      customerPendingNavigationStorageKey,
    );
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<PendingNavigation>;
    if (
      typeof parsed.href !== 'string' ||
      typeof parsed.startedAt !== 'number'
    ) {
      window.sessionStorage.removeItem(customerPendingNavigationStorageKey);
      return null;
    }

    if (Date.now() - parsed.startedAt > pendingNavigationMaxAgeMs) {
      window.sessionStorage.removeItem(customerPendingNavigationStorageKey);
      return null;
    }

    return {
      href: parsed.href,
      startedAt: parsed.startedAt,
    };
  } catch {
    return null;
  }
}

export function clearPendingCustomerNavigation() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.removeItem(customerPendingNavigationStorageKey);
  } catch {
    // Ignore persistence failures in private browsing or restricted contexts.
  }
}
