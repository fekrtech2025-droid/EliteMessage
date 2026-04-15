export const themePreferenceStorageKey = 'elite-message.theme';
export const themePreferenceCookieName = 'elite-message.theme';

export const themePreferenceValues = ['system', 'light', 'dark'] as const;

export type ThemePreference = (typeof themePreferenceValues)[number];
export type EffectiveTheme = 'light' | 'dark';

export function resolveThemePreference(
  value: string | null | undefined,
): ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
    ? value
    : 'light';
}

export function getThemePreferenceLabel(preference: ThemePreference) {
  switch (preference) {
    case 'light':
      return 'Light';
    case 'dark':
      return 'Dark';
    default:
      return 'System';
  }
}

export function resolveEffectiveTheme(
  preference: ThemePreference,
  systemTheme: EffectiveTheme,
): EffectiveTheme {
  return preference === 'system' ? systemTheme : preference;
}
