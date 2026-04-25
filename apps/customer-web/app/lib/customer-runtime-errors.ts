type CustomerLocale = 'en' | 'ar';

const recoverableBrowserFragments = [
  'detached frame',
  'execution context was destroyed',
  'target closed',
  'session closed',
  'page has been closed',
  'browser has disconnected',
  'cannot find context with specified id',
  'recoverable browser failure',
  'browser recovery did not reconnect',
  'whatsapp web browser recovery',
  'puppeteer',
];

function isRecoverableBrowserRuntimeText(value: string) {
  const normalized = value.toLowerCase();
  return recoverableBrowserFragments.some((fragment) =>
    normalized.includes(fragment),
  );
}

export function formatCustomerSafeRuntimeText(
  value: string | null | undefined,
  locale: CustomerLocale,
) {
  if (!value) {
    return null;
  }

  if (!isRecoverableBrowserRuntimeText(value)) {
    return value;
  }

  return locale === 'ar'
    ? 'يتم إعادة اتصال واتساب ويب. ستبقى الرسالة في الطابور وستتم إعادة المحاولة تلقائياً.'
    : 'WhatsApp Web is reconnecting. The message stays queued and will retry automatically.';
}

export function sanitizeCustomerDiagnostics(
  value: unknown,
  locale: CustomerLocale,
): unknown {
  if (typeof value === 'string') {
    return formatCustomerSafeRuntimeText(value, locale) ?? value;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeCustomerDiagnostics(entry, locale));
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      sanitizeCustomerDiagnostics(entry, locale),
    ]),
  );
}
