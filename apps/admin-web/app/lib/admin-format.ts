'use client';

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return 'Never';
  }

  return new Date(value).toLocaleString();
}

export function formatText(
  value: string | null | undefined,
  fallback = 'None',
) {
  if (!value) {
    return fallback;
  }

  return value.replaceAll('_', ' ');
}

export function statusTone(status: string) {
  switch (status) {
    case 'authenticated':
    case 'active':
    case 'online':
    case 'resolved':
    case 'closed':
    case 'delivered':
      return 'success' as const;
    case 'qr':
    case 'loading':
    case 'initialize':
    case 'booting':
    case 'retrying':
    case 'warning':
    case 'high':
    case 'urgent':
    case 'in_progress':
    case 'waiting_on_customer':
      return 'warning' as const;
    case 'suspended':
    case 'disconnected':
    case 'stopped':
    case 'failed':
    case 'offline':
      return 'danger' as const;
    default:
      return 'neutral' as const;
  }
}
