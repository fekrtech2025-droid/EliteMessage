'use client';

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent as ReactMouseEvent,
  type PropsWithChildren,
} from 'react';
import {
  resolveEffectiveTheme,
  resolveThemePreference,
  themePreferenceCookieName,
  themePreferenceStorageKey,
  type EffectiveTheme,
  type ThemePreference,
} from '../theme-preference';

type ThemePreferenceProviderProps = PropsWithChildren<{
  initialPreference: ThemePreference;
}>;

type ThemeSnapshot = {
  effectiveTheme: EffectiveTheme;
  initialized: boolean;
  preference: ThemePreference;
  systemTheme: EffectiveTheme;
};

export type ThemePreferenceLabels = {
  darkLabel?: string;
  lightLabel?: string;
  menuLabel?: string;
  systemLabel?: string;
  themeButtonLabel?: string;
};

const defaultLabels: Required<ThemePreferenceLabels> = {
  darkLabel: 'Dark',
  lightLabel: 'Light',
  menuLabel: 'Theme menu',
  systemLabel: 'System',
  themeButtonLabel: 'Theme preference',
};

const themeListeners = new Set<() => void>();

let themeSnapshot: ThemeSnapshot = {
  effectiveTheme: 'light',
  initialized: false,
  preference: 'light',
  systemTheme: 'light',
};

let mediaQueryList: MediaQueryList | null = null;
let mediaListenerAttached = false;

function notifyThemeListeners() {
  themeListeners.forEach((listener) => listener());
}

function getSystemTheme(): EffectiveTheme {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function writeThemePreference(preference: ThemePreference) {
  if (typeof document === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(themePreferenceStorageKey, preference);
  } catch {
    // Ignore storage failures in restricted environments.
  }

  document.cookie = `${themePreferenceCookieName}=${preference}; path=/; max-age=31536000; samesite=lax`;
}

function readCookieThemePreference() {
  if (typeof document === 'undefined') {
    return 'light' as ThemePreference;
  }

  const cookieValue = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${themePreferenceCookieName}=`))
    ?.slice(themePreferenceCookieName.length + 1);

  return resolveThemePreference(cookieValue);
}

function readClientThemePreference(fallback: ThemePreference) {
  if (typeof document === 'undefined') {
    return fallback;
  }

  const htmlPreference = document.documentElement.dataset.eliteThemePreference;

  try {
    return resolveThemePreference(
      window.localStorage.getItem(themePreferenceStorageKey) ??
        htmlPreference ??
        readCookieThemePreference() ??
        fallback,
    );
  } catch {
    return resolveThemePreference(
      htmlPreference ?? readCookieThemePreference() ?? fallback,
    );
  }
}

function applyThemePreference(preference: ThemePreference, persist = true) {
  if (typeof document === 'undefined') {
    return;
  }

  const systemTheme = getSystemTheme();
  const effectiveTheme = resolveEffectiveTheme(preference, systemTheme);

  themeSnapshot = {
    effectiveTheme,
    initialized: true,
    preference,
    systemTheme,
  };

  document.documentElement.dataset.eliteTheme = effectiveTheme;
  document.documentElement.dataset.eliteThemePreference = preference;
  document.documentElement.style.colorScheme = effectiveTheme;

  if (persist) {
    writeThemePreference(preference);
  }
}

function handleSystemThemeChange() {
  if (!themeSnapshot.initialized) {
    return;
  }

  const nextSystemTheme = getSystemTheme();
  const nextEffectiveTheme = resolveEffectiveTheme(
    themeSnapshot.preference,
    nextSystemTheme,
  );
  if (
    themeSnapshot.systemTheme === nextSystemTheme &&
    themeSnapshot.effectiveTheme === nextEffectiveTheme
  ) {
    return;
  }

  themeSnapshot = {
    effectiveTheme: nextEffectiveTheme,
    initialized: true,
    preference: themeSnapshot.preference,
    systemTheme: nextSystemTheme,
  };

  if (typeof document !== 'undefined') {
    document.documentElement.dataset.eliteTheme = nextEffectiveTheme;
    document.documentElement.style.colorScheme = nextEffectiveTheme;
  }

  notifyThemeListeners();
}

function ensureSystemThemeListener() {
  if (
    typeof window === 'undefined' ||
    mediaListenerAttached ||
    typeof window.matchMedia !== 'function'
  ) {
    return;
  }

  mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
  if (typeof mediaQueryList.addEventListener === 'function') {
    mediaQueryList.addEventListener('change', handleSystemThemeChange);
  } else {
    mediaQueryList.addListener?.(handleSystemThemeChange);
  }
  mediaListenerAttached = true;
}

function ensureThemeSnapshot(initialPreference: ThemePreference) {
  ensureSystemThemeListener();

  const nextPreference = readClientThemePreference(initialPreference);
  if (
    !themeSnapshot.initialized ||
    themeSnapshot.preference !== nextPreference ||
    document.documentElement.dataset.eliteThemePreference !== nextPreference
  ) {
    applyThemePreference(nextPreference);
  }
}

function subscribeToTheme(listener: () => void) {
  ensureThemeSnapshot('light');
  themeListeners.add(listener);

  return () => {
    themeListeners.delete(listener);
  };
}

function getThemeSnapshot() {
  ensureThemeSnapshot('light');
  return themeSnapshot;
}

export function initializeThemePreference(preference: ThemePreference) {
  ensureThemeSnapshot(preference);
  notifyThemeListeners();
}

export function setGlobalThemePreference(preference: ThemePreference) {
  ensureSystemThemeListener();
  applyThemePreference(preference);
  notifyThemeListeners();
}

export function ThemePreferenceProvider({
  initialPreference,
  children,
}: ThemePreferenceProviderProps) {
  useEffect(() => {
    initializeThemePreference(resolveThemePreference(initialPreference));
  }, [initialPreference]);

  return children;
}

export function useThemePreference() {
  const snapshot = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => themeSnapshot,
  );

  return {
    effectiveTheme: snapshot.effectiveTheme,
    isDark: snapshot.effectiveTheme === 'dark',
    setThemePreference: setGlobalThemePreference,
    themePreference: snapshot.preference,
  };
}

function SystemThemeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3.2" y="4.1" width="13.6" height="9.8" rx="2.2" />
      <path d="M7.2 15.9h5.6" />
      <path d="M10 13.9v2" />
    </svg>
  );
}

function LightThemeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="3.1" />
      <path d="M10 1.9V3.9" />
      <path d="M10 16.1V18.1" />
      <path d="M1.9 10H3.9" />
      <path d="M16.1 10H18.1" />
      <path d="M4.2 4.2 5.65 5.65" />
      <path d="M14.35 14.35 15.8 15.8" />
      <path d="M14.35 5.65 15.8 4.2" />
      <path d="M4.2 15.8 5.65 14.35" />
    </svg>
  );
}

function DarkThemeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M13.9 2.9a6.85 6.85 0 1 0 3.2 12.9A7.35 7.35 0 1 1 13.9 2.9Z" />
    </svg>
  );
}

function ThemeIndicatorIcon({
  effectiveTheme,
  preference,
}: {
  effectiveTheme: EffectiveTheme;
  preference: ThemePreference;
}) {
  if (preference === 'system') {
    return <SystemThemeIcon />;
  }

  return effectiveTheme === 'dark' ? <DarkThemeIcon /> : <LightThemeIcon />;
}

function preferenceLabel(
  preference: ThemePreference,
  labels: Required<ThemePreferenceLabels>,
) {
  switch (preference) {
    case 'light':
      return labels.lightLabel;
    case 'dark':
      return labels.darkLabel;
    default:
      return labels.systemLabel;
  }
}

export function ThemePreferenceMenuButton({
  labels,
  onPreferenceChange,
}: {
  labels?: ThemePreferenceLabels;
  onPreferenceChange?: (preference: ThemePreference) => void | Promise<void>;
}) {
  const resolvedLabels = {
    ...defaultLabels,
    ...labels,
  };
  const { effectiveTheme, setThemePreference, themePreference } =
    useThemePreference();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const activeLabel = preferenceLabel(themePreference, resolvedLabels);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleDocumentClick(event: MouseEvent) {
      if (menuRef.current?.contains(event.target as Node)) {
        return;
      }

      setOpen(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  function handleSelect(
    event: ReactMouseEvent<HTMLButtonElement>,
    preference: ThemePreference,
  ) {
    setThemePreference(preference);
    setOpen(false);
    void onPreferenceChange?.(preference);

    if (!(event.currentTarget instanceof HTMLElement)) {
      return;
    }

    event.currentTarget.blur();
  }

  return (
    <div
      ref={menuRef}
      className="elite-theme-menu"
      data-open={open ? 'true' : 'false'}
    >
      <button
        type="button"
        data-unstyled-button
        className="elite-theme-menu-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${resolvedLabels.themeButtonLabel}, ${activeLabel}`}
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        <span className="elite-theme-menu-trigger-icon" aria-hidden="true">
          <ThemeIndicatorIcon
            effectiveTheme={effectiveTheme}
            preference={themePreference}
          />
        </span>
      </button>
      {open ? (
        <div
          className="elite-theme-menu-panel"
          role="menu"
          aria-label={resolvedLabels.menuLabel}
        >
          {(['system', 'light', 'dark'] as const).map((preference) => {
            const active = preference === themePreference;
            return (
              <button
                key={preference}
                type="button"
                data-unstyled-button
                role="menuitemradio"
                aria-checked={active}
                className="elite-theme-menu-item"
                data-active={active ? 'true' : 'false'}
                onClick={(event) => {
                  handleSelect(event, preference);
                }}
              >
                <span className="elite-theme-menu-item-icon" aria-hidden="true">
                  {preference === 'system' ? (
                    <SystemThemeIcon />
                  ) : preference === 'light' ? (
                    <LightThemeIcon />
                  ) : (
                    <DarkThemeIcon />
                  )}
                </span>
                <span className="elite-theme-menu-item-copy">
                  <strong>{preferenceLabel(preference, resolvedLabels)}</strong>
                  <span>
                    {preference === 'system'
                      ? preferenceLabel(effectiveTheme, resolvedLabels)
                      : preferenceLabel(preference, resolvedLabels)}
                  </span>
                </span>
                <span
                  className="elite-theme-menu-item-check"
                  aria-hidden="true"
                >
                  {active ? '●' : '○'}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
