'use client';

export type StoredInstanceCredentials = {
  instanceId: string;
  publicId: string;
  instanceName: string;
  token: string;
  updatedAt: string;
  source: 'created' | 'rotated';
};

const instanceCredentialStoragePrefix =
  'elite-message.customer.instance-credentials.';

function isStoredInstanceCredentials(
  value: unknown,
): value is StoredInstanceCredentials {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<StoredInstanceCredentials>;
  return (
    typeof candidate.instanceId === 'string' &&
    typeof candidate.publicId === 'string' &&
    typeof candidate.instanceName === 'string' &&
    typeof candidate.token === 'string' &&
    typeof candidate.updatedAt === 'string' &&
    (candidate.source === 'created' || candidate.source === 'rotated')
  );
}

function storageKey(instanceId: string) {
  return `${instanceCredentialStoragePrefix}${instanceId}`;
}

export function storeInstanceCredentials(
  credentials: StoredInstanceCredentials,
) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.setItem(
      storageKey(credentials.instanceId),
      JSON.stringify(credentials),
    );
  } catch {
    // Ignore browser storage failures in restricted contexts.
  }
}

export function readInstanceCredentials(instanceId: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.sessionStorage.getItem(storageKey(instanceId));
    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue);
    return isStoredInstanceCredentials(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function listStoredInstanceCredentials() {
  if (typeof window === 'undefined') {
    return [] as StoredInstanceCredentials[];
  }

  const items: StoredInstanceCredentials[] = [];

  try {
    for (let index = 0; index < window.sessionStorage.length; index += 1) {
      const key = window.sessionStorage.key(index);
      if (!key || !key.startsWith(instanceCredentialStoragePrefix)) {
        continue;
      }

      const rawValue = window.sessionStorage.getItem(key);
      if (!rawValue) {
        continue;
      }

      const parsed = JSON.parse(rawValue);
      if (isStoredInstanceCredentials(parsed)) {
        items.push(parsed);
      }
    }
  } catch {
    return [];
  }

  return items.sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt),
  );
}

export function clearStoredInstanceCredentials(instanceId?: string) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (instanceId) {
      window.sessionStorage.removeItem(storageKey(instanceId));
      return;
    }

    const keysToRemove: string[] = [];
    for (let index = 0; index < window.sessionStorage.length; index += 1) {
      const key = window.sessionStorage.key(index);
      if (key?.startsWith(instanceCredentialStoragePrefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      window.sessionStorage.removeItem(key);
    });
  } catch {
    // Ignore browser storage failures in restricted contexts.
  }
}
