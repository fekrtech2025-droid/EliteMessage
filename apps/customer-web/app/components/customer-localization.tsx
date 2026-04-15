'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type PropsWithChildren,
} from 'react';
import {
  customerLocaleCookieName,
  customerLocaleStorageKey,
  getCustomerDirection,
  getCustomerHtmlLang,
  getCustomerIntlLocale,
  resolveCustomerLocale,
  type CustomerLocale,
} from '../lib/customer-locale';

type CustomerLocaleContextValue = {
  locale: CustomerLocale;
  direction: ReturnType<typeof getCustomerDirection>;
  intlLocale: ReturnType<typeof getCustomerIntlLocale>;
  isRtl: boolean;
  setLocale: (locale: CustomerLocale) => void;
  toggleLocale: () => void;
};

type CustomerLocaleProviderProps = PropsWithChildren<{
  initialLocale: CustomerLocale;
}>;

const CustomerLocaleContext = createContext<CustomerLocaleContextValue | null>(
  null,
);
const localeListeners = new Set<() => void>();

let fallbackLocale: CustomerLocale = 'en';
let fallbackInitialized = false;

function applyLocaleToDocument(locale: CustomerLocale) {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.lang = getCustomerHtmlLang(locale);
  document.documentElement.dir = getCustomerDirection(locale);
  document.documentElement.dataset.eliteCustomerLocale = locale;

  try {
    window.localStorage.setItem(customerLocaleStorageKey, locale);
  } catch {
    // Ignore storage failures in restricted browsing modes.
  }

  document.cookie = `${customerLocaleCookieName}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

function readClientLocale() {
  if (typeof document === 'undefined') {
    return 'en' as CustomerLocale;
  }

  const htmlLocale = resolveCustomerLocale(
    document.documentElement.dataset.eliteCustomerLocale ??
      document.documentElement.lang,
  );
  try {
    return resolveCustomerLocale(
      window.localStorage.getItem(customerLocaleStorageKey) ?? htmlLocale,
    );
  } catch {
    return htmlLocale;
  }
}

function ensureFallbackLocale() {
  if (typeof window === 'undefined') {
    return;
  }

  const nextLocale = readClientLocale();
  if (!fallbackInitialized || nextLocale !== fallbackLocale) {
    fallbackInitialized = true;
    fallbackLocale = nextLocale;
    applyLocaleToDocument(fallbackLocale);
  }
}

function setFallbackLocale(locale: CustomerLocale) {
  fallbackInitialized = true;
  fallbackLocale = locale;
  applyLocaleToDocument(locale);
  localeListeners.forEach((listener) => listener());
}

function subscribeToFallbackLocale(listener: () => void) {
  localeListeners.add(listener);
  return () => {
    localeListeners.delete(listener);
  };
}

function getFallbackLocaleSnapshot() {
  ensureFallbackLocale();
  return fallbackLocale;
}

function createLocaleContextValue(
  locale: CustomerLocale,
  setLocale: (locale: CustomerLocale) => void,
): CustomerLocaleContextValue {
  return {
    locale,
    direction: getCustomerDirection(locale),
    intlLocale: getCustomerIntlLocale(locale),
    isRtl: getCustomerDirection(locale) === 'rtl',
    setLocale,
    toggleLocale: () => {
      setLocale(locale === 'ar' ? 'en' : 'ar');
    },
  };
}

export function CustomerLocaleProvider({
  initialLocale,
  children,
}: CustomerLocaleProviderProps) {
  const [locale, setLocaleState] = useState<CustomerLocale>(
    resolveCustomerLocale(initialLocale),
  );

  useEffect(() => {
    setLocaleState(resolveCustomerLocale(initialLocale));
  }, [initialLocale]);

  useEffect(() => {
    setFallbackLocale(locale);
  }, [locale]);

  const value = useMemo(
    () => createLocaleContextValue(locale, setLocaleState),
    [locale],
  );

  return (
    <CustomerLocaleContext.Provider value={value}>
      {children}
    </CustomerLocaleContext.Provider>
  );
}

export function useCustomerLocale() {
  const providedLocale = useContext(CustomerLocaleContext);
  const fallbackSnapshot = useSyncExternalStore(
    subscribeToFallbackLocale,
    getFallbackLocaleSnapshot,
    () => 'en' as CustomerLocale,
  );

  return (
    providedLocale ??
    createLocaleContextValue(fallbackSnapshot, (locale) => {
      setFallbackLocale(locale);
    })
  );
}
