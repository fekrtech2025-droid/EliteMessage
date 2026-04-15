'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import {
  ActionButton,
  DefinitionGrid,
  InfoCard,
  NoticeBanner,
} from '@elite-message/ui';
import { useCustomerLocale } from './customer-localization';
import { apiBaseUrl } from '../lib/session';
import { formatCustomerDate } from '../lib/customer-locale';

type InstanceApiAccessCardProps = {
  eyebrow?: string;
  title?: string;
  instanceId: string;
  publicId: string;
  instanceName: string;
  token: string | null;
  tokenPrefix?: string | null;
  connected: boolean;
  lastAuthenticatedAt?: string | null;
  lastStatusLabel?: string;
  detailHref?: string;
  action?: ReactNode;
};

function buildSendExample(publicId: string, token: string) {
  return [
    `curl -X POST "${apiBaseUrl}/instance/${publicId}/messages/chat" \\`,
    `  -H "Authorization: Bearer ${token}" \\`,
    '  -H "content-type: application/json" \\',
    `  -d '{"to":"9639...","body":"Hello from Elite Message","referenceId":"demo-001","priority":1}'`,
  ].join('\n');
}

export function InstanceApiAccessCard({
  eyebrow = 'Developer API',
  title = 'Instance API access',
  instanceId,
  publicId,
  instanceName,
  token,
  tokenPrefix,
  connected,
  lastAuthenticatedAt,
  lastStatusLabel = 'Last authenticated',
  detailHref,
  action,
}: InstanceApiAccessCardProps) {
  const { locale } = useCustomerLocale();
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const resolvedEyebrow =
    locale === 'ar' && eyebrow === 'Developer API'
      ? 'واجهة API للمطور'
      : eyebrow;
  const resolvedTitle =
    locale === 'ar' && title === 'Instance API access'
      ? 'وصول API للمثيل'
      : title;
  const resolvedLastStatusLabel =
    locale === 'ar' && lastStatusLabel === 'Last authenticated'
      ? 'آخر مصادقة'
      : lastStatusLabel;
  const copy =
    locale === 'ar'
      ? {
          activePrefix: 'البادئة النشطة',
          apiInstanceId: 'معرّف مثيل API',
          authentication: 'المصادقة',
          authenticationValue: 'Bearer أو ?token=',
          basePath: 'المسار الأساسي',
          copyFailed: 'تعذر نسخ',
          copyInstanceId: 'نسخ UUID المثيل',
          copyInstanceToken: 'نسخ رمز API',
          copyPublicId: 'نسخ معرّف مثيل API',
          copied: 'تم نسخ',
          currentFullToken: 'الرمز الكامل الحالي',
          fullTokenUnavailable: 'الرمز الكامل غير متاح في هذه الصفحة',
          instanceUuid: 'UUID المثيل',
          linkWhatsApp: 'اربط واتساب قبل الإرسال',
          openRuntimeDetail: 'افتح تفاصيل التشغيل',
          readyToSend: 'جاهز للإرسال عبر API',
          unavailable: 'غير متاح',
        }
      : {
          activePrefix: 'Active prefix',
          apiInstanceId: 'API instance ID',
          authentication: 'Authentication',
          authenticationValue: 'Bearer or ?token=',
          basePath: 'Base path',
          copyFailed: 'Could not copy',
          copyInstanceId: 'Copy instance UUID',
          copyInstanceToken: 'Copy API token',
          copyPublicId: 'Copy API instance ID',
          copied: 'copied',
          currentFullToken: 'Current full token',
          fullTokenUnavailable: 'Full token not available in this view',
          instanceUuid: 'Instance UUID',
          linkWhatsApp: 'Link WhatsApp before sending',
          openRuntimeDetail: 'Open runtime detail',
          readyToSend: 'Ready to send through the API',
          unavailable: 'Unavailable',
        };

  async function copyValue(label: string, value: string) {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      setCopyStatus(
        locale === 'ar'
          ? `تعذر نسخ ${label} تلقائيًا.`
          : `Could not copy ${label.toLowerCase()} automatically.`,
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus(
        locale === 'ar' ? `تم نسخ ${label}.` : `${label} ${copy.copied}.`,
      );
    } catch {
      setCopyStatus(
        locale === 'ar'
          ? `تعذر نسخ ${label} تلقائيًا.`
          : `Could not copy ${label.toLowerCase()} automatically.`,
      );
    }
  }

  return (
    <InfoCard
      id="instance-api-access"
      eyebrow={resolvedEyebrow}
      title={resolvedTitle}
      action={action}
    >
      <div style={{ display: 'grid', gap: 16 }}>
        <NoticeBanner
          title={connected ? copy.readyToSend : copy.linkWhatsApp}
          tone={connected ? 'success' : 'warning'}
        >
          <p style={{ marginTop: 0 }}>
            {connected
              ? locale === 'ar'
                ? `${instanceName} مرتبط وموثّق. استخدم معرّف مثيل API أدناه في مساراتك العامة الخاصة بكل مثيل.`
                : `${instanceName} is linked and authenticated. Use the API instance ID below in your public per-instance routes.`
              : locale === 'ar'
                ? `${instanceName} لديه بيانات اعتماد API بالفعل. أكمل ربط واتساب أولاً، ثم استخدم البيانات نفسها لإرسال الرسائل.`
                : `${instanceName} already has API credentials. Finish the WhatsApp link first, then use the same credentials to send messages.`}
          </p>
          <p style={{ marginBottom: 0 }}>
            {resolvedLastStatusLabel}:{' '}
            {formatCustomerDate(locale, lastAuthenticatedAt)}
          </p>
        </NoticeBanner>

        <DefinitionGrid
          minItemWidth={190}
          items={[
            { label: copy.instanceUuid, value: instanceId },
            { label: copy.apiInstanceId, value: publicId, tone: 'info' },
            {
              label: copy.authentication,
              value: copy.authenticationValue,
              tone: 'neutral',
            },
            {
              label: copy.basePath,
              value: `/instance/${publicId}`,
              tone: 'neutral',
            },
          ]}
        />

        <div className="elite-toolbar">
          <ActionButton
            type="button"
            tone="secondary"
            size="compact"
            onClick={() => void copyValue(copy.instanceUuid, instanceId)}
          >
            {copy.copyInstanceId}
          </ActionButton>
          <ActionButton
            type="button"
            tone="secondary"
            size="compact"
            onClick={() => void copyValue(copy.apiInstanceId, publicId)}
          >
            {copy.copyPublicId}
          </ActionButton>
          {token ? (
            <ActionButton
              type="button"
              tone="secondary"
              size="compact"
              onClick={() =>
                void copyValue(locale === 'ar' ? 'رمز API' : 'API token', token)
              }
            >
              {copy.copyInstanceToken}
            </ActionButton>
          ) : null}
          {detailHref ? (
            <Link href={detailHref}>{copy.openRuntimeDetail}</Link>
          ) : null}
        </div>

        {copyStatus ? (
          <p style={{ margin: 0, color: 'var(--elite-muted)' }}>{copyStatus}</p>
        ) : null}

        {token ? (
          <>
            <NoticeBanner title={copy.currentFullToken} tone="success">
              <p style={{ marginTop: 0 }}>
                {locale === 'ar'
                  ? 'احفظ هذا الرمز الآن. لا يتم إرجاعه كاملاً إلا عند إنشاء رمز المثيل أو تدويره.'
                  : 'Store this token now. It is only returned in full when the instance token is created or rotated.'}
              </p>
              <p style={{ marginBottom: 0, overflowWrap: 'anywhere' }}>
                <code>{token}</code>
              </p>
            </NoticeBanner>
            <pre className="elite-mono-panel">
              {buildSendExample(publicId, token)}
            </pre>
          </>
        ) : (
          <NoticeBanner title={copy.fullTokenUnavailable} tone="neutral">
            <p style={{ marginTop: 0 }}>
              {locale === 'ar'
                ? 'يعيد الخادم الخلفي الرمز الكامل للمثيل فقط عند الإنشاء أو التدوير. استخدم إجراء التدوير لإظهار رمز كامل جديد.'
                : 'The backend only returns the full instance token on creation or rotation. Use the rotate action to reveal a fresh full token.'}
            </p>
            <p style={{ marginBottom: 0 }}>
              {copy.activePrefix}:{' '}
              <code>{tokenPrefix ?? copy.unavailable}</code>
            </p>
          </NoticeBanner>
        )}
      </div>
    </InfoCard>
  );
}
