export const customerLocaleStorageKey = 'elite-message.customer.locale';
export const customerLocaleCookieName = 'elite-message.customer.locale';

export type CustomerLocale = 'en' | 'ar';
export type CustomerDirection = 'ltr' | 'rtl';

const enumTranslations = {
  en: {
    active: 'Active',
    admin: 'Admin',
    all: 'All',
    authenticated: 'Authenticated',
    booting: 'Booting',
    chat: 'Chat',
    clear: 'Clear',
    completed: 'Completed',
    conflict: 'Conflict',
    connected: 'Connected',
    customer: 'Customer',
    delayed: 'Delayed',
    delivered: 'Delivered',
    device: 'Device',
    disconnected: 'Disconnected',
    expired: 'Expired',
    failed: 'Failed',
    image: 'Image',
    initialize: 'Initializing',
    invalid: 'Invalid',
    loading: 'Loading',
    logout: 'Logout',
    member: 'Member',
    message_ack: 'Message acknowledged',
    message_create: 'Message created',
    message_received: 'Message received',
    none: 'None',
    owner: 'Owner',
    pending: 'Pending',
    placeholder: 'Placeholder',
    played: 'Played',
    qr: 'QR',
    queue: 'Queued',
    read: 'Read',
    restart: 'Restart',
    retrying: 'Retrying',
    revoked: 'Revoked',
    running: 'Running',
    sent: 'Sent',
    server: 'Server',
    standby: 'Standby',
    start: 'Start',
    stopped: 'Stopped',
    stop: 'Stop',
    takeover: 'Takeover',
    trialing: 'Trialing',
    unknown: 'Unknown',
    unsent: 'Unsent',
  },
  ar: {
    active: 'نشط',
    admin: 'مسؤول',
    all: 'الكل',
    authenticated: 'موثّق',
    booting: 'قيد البدء',
    chat: 'نصية',
    clear: 'مسح',
    completed: 'مكتملة',
    conflict: 'تعارض',
    connected: 'متصل',
    customer: 'عميل',
    delayed: 'متأخر',
    delivered: 'تم التسليم',
    device: 'الجهاز',
    disconnected: 'غير متصل',
    expired: 'منتهية',
    failed: 'فشلت',
    image: 'صورة',
    initialize: 'تهيئة',
    invalid: 'غير صالحة',
    loading: 'جارٍ التحميل',
    logout: 'تسجيل الخروج',
    member: 'عضو',
    message_ack: 'تأكيد الرسالة',
    message_create: 'إنشاء رسالة',
    message_received: 'استلام رسالة',
    none: 'لا يوجد',
    owner: 'مالك',
    pending: 'معلقة',
    placeholder: 'تجريبية',
    played: 'تم التشغيل',
    qr: 'رمز QR',
    queue: 'في الطابور',
    read: 'مقروءة',
    restart: 'إعادة التشغيل',
    retrying: 'إعادة المحاولة',
    revoked: 'ملغى',
    running: 'قيد التنفيذ',
    sent: 'مرسلة',
    server: 'الخادم',
    standby: 'استعداد',
    start: 'بدء',
    stopped: 'متوقف',
    stop: 'إيقاف',
    takeover: 'استحواذ',
    trialing: 'فترة تجريبية',
    unknown: 'غير معروف',
    unsent: 'غير مرسلة',
  },
} as const satisfies Record<CustomerLocale, Record<string, string>>;

const languageNames = {
  en: {
    en: 'English',
    ar: 'Arabic',
  },
  ar: {
    en: 'الإنجليزية',
    ar: 'العربية',
  },
} as const satisfies Record<CustomerLocale, Record<CustomerLocale, string>>;

export function resolveCustomerLocale(
  value: string | null | undefined,
): CustomerLocale {
  return value === 'ar' ? 'ar' : 'en';
}

export function getCustomerDirection(
  locale: CustomerLocale,
): CustomerDirection {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export function getCustomerHtmlLang(locale: CustomerLocale) {
  return locale === 'ar' ? 'ar' : 'en';
}

export function getCustomerIntlLocale(locale: CustomerLocale) {
  return locale === 'ar' ? 'ar-SY' : 'en-US';
}

export function getCustomerLanguageName(
  targetLocale: CustomerLocale,
  displayLocale: CustomerLocale,
) {
  return languageNames[displayLocale][targetLocale];
}

export function formatCustomerDate(
  locale: CustomerLocale,
  value: string | null | undefined,
  emptyLabel?: string,
) {
  if (!value) {
    return emptyLabel ?? (locale === 'ar' ? 'أبدًا' : 'Never');
  }

  return new Date(value).toLocaleString(getCustomerIntlLocale(locale));
}

export function translateCustomerBoolean(
  locale: CustomerLocale,
  value: boolean,
) {
  return locale === 'ar' ? (value ? 'نعم' : 'لا') : value ? 'Yes' : 'No';
}

export function humanizeCustomerValue(value: string) {
  return value
    .replaceAll(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function translateCustomerEnum(
  locale: CustomerLocale,
  value: string | null | undefined,
  fallback?: string,
) {
  if (!value) {
    return fallback ?? enumTranslations[locale].none;
  }

  const translated = (enumTranslations[locale] as Record<string, string>)[
    value
  ];
  return translated ?? fallback ?? humanizeCustomerValue(value);
}

export function getCustomerShellLabels(locale: CustomerLocale) {
  if (locale === 'ar') {
    return {
      breadcrumbAriaLabel: 'مسار التنقل',
      breadcrumbHomeLabel: 'لوحة التحكم',
      brandMarkAlt: 'شعار Elite Message',
      collapseSidebarLabel: 'طي القائمة الجانبية',
      customerTopbarLabel: 'الشريط العلوي للعميل',
      expandSidebarLabel: 'توسيع القائمة الجانبية',
      mobileNavigationLabel: 'التنقل',
      mobileNavigationOpenLabel: 'فتح',
      surfaceLabel: 'واجهة العميل',
    };
  }

  return {
    breadcrumbAriaLabel: 'Breadcrumb',
    breadcrumbHomeLabel: 'Dashboard',
    brandMarkAlt: 'Elite Message logo',
    collapseSidebarLabel: 'Collapse sidebar menu',
    customerTopbarLabel: 'Customer topbar',
    expandSidebarLabel: 'Expand sidebar menu',
    mobileNavigationLabel: 'Navigation',
    mobileNavigationOpenLabel: 'Open',
    surfaceLabel: 'Customer Surface',
  };
}
