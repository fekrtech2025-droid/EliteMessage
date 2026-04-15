'use client';

export const storageKey = 'elite-message.admin.access-token';
export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3002';

export function readStoredToken() {
  return typeof window === 'undefined'
    ? null
    : window.sessionStorage.getItem(storageKey);
}

export function writeStoredToken(token: string) {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(storageKey, token);
  }
}

export function clearStoredToken() {
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(storageKey);
  }
}
