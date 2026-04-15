'use client';

import Link from 'next/link';
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { io } from 'socket.io-client';
import type {
  AuthResponse,
  InboundMessageSummary,
  InstanceAction,
  InstanceDetailResponse,
  ListInboundMessagesResponse,
  ListOutboundMessagesResponse,
  ListWebhookDeliveriesResponse,
  OutboundMessageSummary,
  RequestInstanceActionResponse,
  RotateInstanceTokenResponse,
  SendMessageResponse,
  UpdateInstanceSettingsResponse,
  WebhookDeliverySummary,
  WebsocketEnvelope,
} from '@elite-message/contracts';
import { websocketEventNames } from '@elite-message/contracts';
import {
  ActionButton,
  AnchorNav,
  AppShell,
  CheckboxField,
  DefinitionGrid,
  Field,
  InfoCard,
  MetricCard,
  MetricGrid,
  NoticeBanner,
  QrPayloadView,
  SectionGrid,
  StatusBadge,
  TextAreaInput,
  TextInput,
} from '@elite-message/ui';
import { useCustomerLocale } from '../../components/customer-localization';
import { InstanceApiAccessCard } from '../../components/instance-api-access-card';
import { CustomerTopbarAnnouncement } from '../../components/customer-workspace-chrome';
import { CustomerNav } from '../../components/customer-nav';
import {
  readInstanceCredentials,
  storeInstanceCredentials,
  type StoredInstanceCredentials,
} from '../../lib/instance-credentials';
import {
  formatCustomerDate,
  getCustomerShellLabels,
  translateCustomerBoolean,
  translateCustomerEnum,
} from '../../lib/customer-locale';
import {
  apiBaseUrl,
  clearStoredToken,
  readStoredToken,
  writeStoredToken,
} from '../../lib/session';

type PageState = 'loading' | 'unauthenticated' | 'ready';

type CustomerInstanceDetailPageProps = {
  instanceId: string;
};

type SettingsFormState = {
  sendDelay: number;
  sendDelayMax: number;
  webhookUrl: string;
  webhookMessageReceived: boolean;
  webhookMessageCreate: boolean;
  webhookMessageAck: boolean;
};

type ChatFormState = {
  to: string;
  body: string;
  referenceId: string;
  priority: number;
};

type ImageFormState = {
  to: string;
  caption: string;
  referenceId: string;
  priority: number;
};

type LoadPageDataResult =
  | 'ready'
  | 'unauthenticated'
  | 'network_error'
  | 'error';

type AuthenticatedRequestResult =
  | {
      kind: 'ok';
      response: Response;
    }
  | {
      kind: 'unauthenticated';
    }
  | {
      kind: 'network_error';
    };

function formatMessagePreview(
  message: OutboundMessageSummary,
  locale: 'en' | 'ar',
) {
  if (message.messageType === 'chat') {
    return message.body ?? (locale === 'ar' ? 'لا يوجد نص' : 'No body');
  }

  return (
    message.caption ??
    message.mediaUrl ??
    (locale === 'ar' ? 'لا يوجد رابط وسائط' : 'No media URL')
  );
}

function formatDiagnostics(value: unknown, locale: 'en' | 'ar') {
  if (value === null || value === undefined) {
    return locale === 'ar'
      ? 'لم يتم نشر أي بيانات تشخيصية.'
      : 'No diagnostics published.';
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function readDiagnosticField(value: unknown, key: string) {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = (value as Record<string, unknown>)[key];
  if (candidate === undefined || candidate === null) {
    return null;
  }

  if (
    typeof candidate === 'string' ||
    typeof candidate === 'number' ||
    typeof candidate === 'boolean'
  ) {
    return String(candidate);
  }

  return JSON.stringify(candidate);
}

function statusTone(status: string) {
  switch (status) {
    case 'authenticated':
      return 'success' as const;
    case 'qr':
    case 'loading':
    case 'initialize':
    case 'booting':
    case 'retrying':
      return 'warning' as const;
    case 'disconnected':
    case 'stopped':
      return 'danger' as const;
    default:
      return 'neutral' as const;
  }
}

function webhookTone(status: string) {
  switch (status) {
    case 'delivered':
      return 'success' as const;
    case 'failed':
      return 'danger' as const;
    case 'retrying':
      return 'warning' as const;
    default:
      return 'neutral' as const;
  }
}

function operationTone(status: string) {
  switch (status) {
    case 'completed':
      return 'success' as const;
    case 'failed':
      return 'danger' as const;
    case 'running':
    case 'pending':
      return 'warning' as const;
    default:
      return 'neutral' as const;
  }
}

function ackTone(ack: string) {
  switch (ack) {
    case 'played':
    case 'read':
      return 'success' as const;
    case 'device':
    case 'server':
      return 'info' as const;
    default:
      return 'neutral' as const;
  }
}

function isInstanceEnvelope(envelope: unknown, instanceId: string) {
  if (!envelope || typeof envelope !== 'object') {
    return false;
  }

  const payload = (envelope as WebsocketEnvelope).payload;
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  return (
    'instanceId' in payload &&
    (payload as { instanceId?: string }).instanceId === instanceId
  );
}

async function performCustomerRequest(request: () => Promise<Response>) {
  try {
    return await request();
  } catch {
    return null;
  }
}

export function CustomerInstanceDetailPage({
  instanceId,
}: CustomerInstanceDetailPageProps) {
  const { locale } = useCustomerLocale();
  const mountedRef = useRef(true);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [detail, setDetail] = useState<InstanceDetailResponse | null>(null);
  const [messages, setMessages] = useState<OutboundMessageSummary[]>([]);
  const [inboundMessages, setInboundMessages] = useState<
    InboundMessageSummary[]
  >([]);
  const [webhookDeliveries, setWebhookDeliveries] = useState<
    WebhookDeliverySummary[]
  >([]);
  const [settingsForm, setSettingsForm] = useState<SettingsFormState>({
    sendDelay: 1,
    sendDelayMax: 15,
    webhookUrl: '',
    webhookMessageReceived: false,
    webhookMessageCreate: false,
    webhookMessageAck: false,
  });
  const [chatForm, setChatForm] = useState<ChatFormState>({
    to: '',
    body: '',
    referenceId: '',
    priority: 100,
  });
  const [imageForm, setImageForm] = useState<ImageFormState>({
    to: '',
    caption: '',
    referenceId: '',
    priority: 100,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [instanceAccess, setInstanceAccess] =
    useState<StoredInstanceCredentials | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [settingsSubmitting, setSettingsSubmitting] = useState(false);
  const [actionSubmitting, setActionSubmitting] =
    useState<InstanceAction | null>(null);
  const [screenshotOpening, setScreenshotOpening] = useState(false);
  const [tokenSubmitting, setTokenSubmitting] = useState(false);
  const [messageSubmitting, setMessageSubmitting] = useState<
    'chat' | 'image' | null
  >(null);
  const copy =
    locale === 'ar'
      ? {
          actionFailed: 'فشل الإجراء',
          actions: 'الإجراءات',
          backToDashboard: 'العودة إلى لوحة تحكم العميل',
          compose: 'التحرير',
          customerInstanceDetail: 'تفاصيل مثيل العميل',
          events: 'الأحداث',
          inbound: 'الواردة',
          latestAction: 'آخر إجراء',
          loadingDetail: 'جارٍ تحميل التفاصيل',
          messages: 'الرسائل',
          messageExplorer: 'مستكشف الرسائل',
          openLatestScreenshot: 'افتح آخر لقطة شاشة',
          openingScreenshot: 'جارٍ فتح لقطة الشاشة...',
          recentEvents: 'أحدث سجل دورة الحياة',
          recentInboundMessages: 'أحدث الرسائل الواردة',
          recentMessages: 'أحدث الرسائل الصادرة',
          recentOperations: 'أحدث سجل العمليات',
          recentWebhooks: 'أحدث محاولات تسليم Webhook',
          runtime: 'التشغيل',
          runtimeActions: 'ضع عمليات التشغيل في الطابور',
          runtimeSettings: 'إعدادات التشغيل',
          runtimeState: 'حالة تشغيل الجلسة',
          settings: 'الإعدادات',
          signInRequired: 'يجب تسجيل الدخول',
          sessionMissing: 'جلسة العميل مفقودة أو منتهية الصلاحية.',
          summary: 'الملخص',
          titleSubtitle:
            'شغّل وقت تنفيذ مرتبطًا بواتساب مع رؤية مباشرة للجلسة ونشاط الرسائل وفحص Webhook وعناصر الاسترداد من مكان واحد.',
          tokens: 'الرموز',
          webhooks: 'عمليات Webhook',
        }
      : {
          actionFailed: 'Action failed',
          actions: 'Actions',
          backToDashboard: 'Back to customer dashboard',
          compose: 'Compose',
          customerInstanceDetail: 'Customer Instance Detail',
          events: 'Events',
          inbound: 'Inbound',
          latestAction: 'Latest action',
          loadingDetail: 'Loading detail',
          messages: 'Messages',
          messageExplorer: 'Message explorer',
          openLatestScreenshot: 'Open latest screenshot',
          openingScreenshot: 'Opening screenshot...',
          recentEvents: 'Recent lifecycle history',
          recentInboundMessages: 'Recent inbound messages',
          recentMessages: 'Recent outbound messages',
          recentOperations: 'Recent operation history',
          recentWebhooks: 'Recent webhook deliveries',
          runtime: 'Runtime',
          runtimeActions: 'Queue runtime operations',
          runtimeSettings: 'Runtime settings',
          runtimeState: 'Session runtime state',
          settings: 'Settings',
          signInRequired: 'Sign in required',
          sessionMissing: 'The customer session is missing or expired.',
          summary: 'Summary',
          titleSubtitle:
            'Operate a single WhatsApp-linked runtime with live session visibility, message activity, webhook inspection, and recovery controls in one place.',
          tokens: 'Tokens',
          webhooks: 'Webhooks',
        };

  function handleCustomerApiReachabilityError() {
    if (!mountedRef.current) {
      return;
    }

    setErrorMessage(
      locale === 'ar'
        ? 'تعذر الوصول إلى API الخاص بالعميل.'
        : 'Could not reach the customer API.',
    );
    if (pageState === 'loading') {
      setPageState('unauthenticated');
    }
  }

  function handleAuthenticatedRequestFailure(
    result: Exclude<
      AuthenticatedRequestResult,
      { kind: 'ok'; response: Response }
    >,
  ) {
    if (!mountedRef.current) {
      return;
    }

    if (result.kind === 'unauthenticated') {
      setPageState('unauthenticated');
      return;
    }

    setErrorMessage(
      locale === 'ar'
        ? 'تعذر الوصول إلى API الخاص بالعميل.'
        : 'Could not reach the customer API.',
    );
  }

  useEffect(() => {
    mountedRef.current = true;
    if (process.env.NODE_ENV === 'test') {
      return () => {
        mountedRef.current = false;
      };
    }

    void initialize().catch(() => {
      if (!mountedRef.current) {
        return;
      }

      setPageState('unauthenticated');
      setErrorMessage(
        locale === 'ar'
          ? 'تعذر تحميل تفاصيل المثيل.'
          : 'Could not load the instance detail.',
      );
    });

    return () => {
      mountedRef.current = false;
    };
  }, [instanceId]);

  useEffect(() => {
    if (!detail) {
      return;
    }

    setSettingsForm({
      sendDelay: detail.settings.sendDelay,
      sendDelayMax: detail.settings.sendDelayMax,
      webhookUrl: detail.settings.webhookUrl ?? '',
      webhookMessageReceived: detail.settings.webhookMessageReceived,
      webhookMessageCreate: detail.settings.webhookMessageCreate,
      webhookMessageAck: detail.settings.webhookMessageAck,
    });
  }, [detail]);

  useEffect(() => {
    if (!detail) {
      setInstanceAccess(null);
      return;
    }

    setInstanceAccess(readInstanceCredentials(detail.instance.id));
  }, [detail]);

  const reloadDetail = useEffectEvent(async () => {
    const token = readStoredToken();
    if (!token) {
      return;
    }

    const loaded = await loadPageData(token);
    if (
      loaded === 'ready' ||
      loaded === 'network_error' ||
      loaded === 'error'
    ) {
      return;
    }

    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      if (!mountedRef.current) {
        return;
      }

      setPageState('unauthenticated');
      return;
    }

    const refreshedLoad = await loadPageData(refreshed);
    if (refreshedLoad === 'unauthenticated' && mountedRef.current) {
      setPageState('unauthenticated');
    }
  });

  useEffect(() => {
    if (pageState !== 'ready' || process.env.NODE_ENV === 'test') {
      return;
    }

    const socket = io(apiBaseUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    const scheduleRefresh = () => {
      if (refreshTimer) {
        return;
      }

      refreshTimer = setTimeout(() => {
        refreshTimer = null;
        void reloadDetail();
      }, 250);
    };

    const instanceEvents = [
      websocketEventNames.instanceStatusChanged,
      websocketEventNames.instanceQrUpdated,
      websocketEventNames.instanceRuntimeUpdated,
      websocketEventNames.instanceLifecycleUpdated,
      websocketEventNames.instanceOperationUpdated,
      websocketEventNames.instanceSettingsUpdated,
      websocketEventNames.instanceMessageUpdated,
      websocketEventNames.instanceInboundMessageUpdated,
      websocketEventNames.webhookDeliveryUpdated,
    ];

    instanceEvents.forEach((eventName) => {
      socket.on(eventName, (envelope: WebsocketEnvelope) => {
        if (isInstanceEnvelope(envelope, instanceId)) {
          scheduleRefresh();
        }
      });
    });

    socket.on(websocketEventNames.workerHealthUpdated, scheduleRefresh);

    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }

      instanceEvents.forEach((eventName) => {
        socket.removeAllListeners(eventName);
      });
      socket.off(websocketEventNames.workerHealthUpdated, scheduleRefresh);
      socket.disconnect();
    };
  }, [instanceId, pageState]);

  const hasPendingOperation =
    detail?.pendingOperation?.status === 'pending' ||
    detail?.pendingOperation?.status === 'running';
  const conflictActive = detail?.instance.substatus === 'conflict';

  async function initialize() {
    const storedAccessToken = readStoredToken();
    if (storedAccessToken) {
      const loaded = await loadPageData(storedAccessToken);
      if (
        loaded === 'ready' ||
        loaded === 'network_error' ||
        loaded === 'error'
      ) {
        return;
      }
    }

    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      setPageState('unauthenticated');
      return;
    }

    const loaded = await loadPageData(refreshed);
    if (loaded === 'unauthenticated') {
      setPageState('unauthenticated');
    }
  }

  async function refreshAccessToken() {
    const response = await performCustomerRequest(() =>
      fetch(`${apiBaseUrl}/api/v1/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      }),
    );

    if (!response) {
      handleCustomerApiReachabilityError();
      return null;
    }

    if (!response.ok) {
      clearStoredToken();
      if (mountedRef.current) {
        setAccessToken(null);
      }
      return null;
    }

    const auth = (await response.json()) as AuthResponse;
    writeStoredToken(auth.accessToken);
    if (mountedRef.current) {
      setAccessToken(auth.accessToken);
    }

    return auth.accessToken;
  }

  async function loadPageData(token: string): Promise<LoadPageDataResult> {
    const [detailResponse, messagesResponse, inboundResponse, webhookResponse] =
      await Promise.all([
        performCustomerRequest(() =>
          fetch(`${apiBaseUrl}/api/v1/customer/instances/${instanceId}`, {
            headers: {
              authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          }),
        ),
        performCustomerRequest(() =>
          fetch(
            `${apiBaseUrl}/api/v1/customer/instances/${instanceId}/messages?limit=20`,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
              credentials: 'include',
            },
          ),
        ),
        performCustomerRequest(() =>
          fetch(
            `${apiBaseUrl}/api/v1/customer/instances/${instanceId}/inbound-messages?limit=20`,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
              credentials: 'include',
            },
          ),
        ),
        performCustomerRequest(() =>
          fetch(
            `${apiBaseUrl}/api/v1/customer/instances/${instanceId}/webhook-deliveries?limit=20`,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
              credentials: 'include',
            },
          ),
        ),
      ]);

    if (
      !detailResponse ||
      !messagesResponse ||
      !inboundResponse ||
      !webhookResponse
    ) {
      handleCustomerApiReachabilityError();
      return 'network_error';
    }

    if (
      detailResponse.status === 401 ||
      messagesResponse.status === 401 ||
      inboundResponse.status === 401 ||
      webhookResponse.status === 401
    ) {
      return 'unauthenticated';
    }

    if (
      !detailResponse.ok ||
      !messagesResponse.ok ||
      !inboundResponse.ok ||
      !webhookResponse.ok
    ) {
      if (!mountedRef.current) {
        return 'error';
      }

      setErrorMessage(
        locale === 'ar'
          ? 'تعذر تحميل تفاصيل المثيل.'
          : 'Instance detail could not be loaded.',
      );
      if (pageState === 'loading') {
        setPageState('unauthenticated');
      }
      return 'error';
    }

    const detailPayload =
      (await detailResponse.json()) as InstanceDetailResponse;
    const messagesPayload =
      (await messagesResponse.json()) as ListOutboundMessagesResponse;
    const inboundPayload =
      (await inboundResponse.json()) as ListInboundMessagesResponse;
    const webhookPayload =
      (await webhookResponse.json()) as ListWebhookDeliveriesResponse;
    if (!mountedRef.current) {
      return 'error';
    }

    setErrorMessage(null);
    setAccessToken(token);
    setDetail(detailPayload);
    setMessages(messagesPayload.items);
    setInboundMessages(inboundPayload.items);
    setWebhookDeliveries(webhookPayload.items);
    setPageState('ready');
    return 'ready';
  }

  async function requestWithRefresh(
    requestFactory: (token: string) => Promise<Response>,
  ): Promise<AuthenticatedRequestResult> {
    let token = accessToken ?? readStoredToken();
    if (!token) {
      token = await refreshAccessToken();
    }

    if (!token) {
      return {
        kind: 'unauthenticated',
      };
    }

    const initialToken = token;
    let response = await performCustomerRequest(() =>
      requestFactory(initialToken),
    );
    if (!response) {
      return {
        kind: 'network_error',
      };
    }

    if (response.status === 401) {
      token = await refreshAccessToken();
      if (!token) {
        return {
          kind: 'unauthenticated',
        };
      }

      const refreshedToken = token;
      response = await performCustomerRequest(() =>
        requestFactory(refreshedToken),
      );
      if (!response) {
        return {
          kind: 'network_error',
        };
      }
    }

    return {
      kind: 'ok',
      response,
    };
  }

  async function updateSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (settingsForm.sendDelayMax < settingsForm.sendDelay) {
      setErrorMessage(
        locale === 'ar'
          ? 'يجب أن يكون sendDelayMax أكبر من أو يساوي sendDelay.'
          : 'sendDelayMax must be greater than or equal to sendDelay.',
      );
      return;
    }

    setSettingsSubmitting(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const result = await requestWithRefresh((token) =>
        fetch(
          `${apiBaseUrl}/api/v1/customer/instances/${instanceId}/settings`,
          {
            method: 'PATCH',
            headers: {
              authorization: `Bearer ${token}`,
              'content-type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              sendDelay: settingsForm.sendDelay,
              sendDelayMax: settingsForm.sendDelayMax,
              webhookUrl:
                settingsForm.webhookUrl.trim() === ''
                  ? null
                  : settingsForm.webhookUrl.trim(),
              webhookMessageReceived: settingsForm.webhookMessageReceived,
              webhookMessageCreate: settingsForm.webhookMessageCreate,
              webhookMessageAck: settingsForm.webhookMessageAck,
            }),
          },
        ),
      );

      if (result.kind !== 'ok') {
        handleAuthenticatedRequestFailure(result);
        return;
      }

      const response = result.response;
      if (!response.ok) {
        if (mountedRef.current) {
          setErrorMessage(
            locale === 'ar'
              ? 'فشل تحديث الإعدادات.'
              : 'Settings update failed.',
          );
        }
        return;
      }

      const payload = (await response.json()) as UpdateInstanceSettingsResponse;
      if (!mountedRef.current) {
        return;
      }

      setStatusMessage(
        locale === 'ar'
          ? `تم تحديث الإعدادات في ${formatCustomerDate(locale, payload.updatedAt)}.`
          : `Settings updated at ${formatCustomerDate(locale, payload.updatedAt)}.`,
      );
      await reloadDetail();
    } finally {
      setSettingsSubmitting(false);
    }
  }

  async function requestAction(action: InstanceAction) {
    setActionSubmitting(action);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const result = await requestWithRefresh((token) =>
        fetch(`${apiBaseUrl}/api/v1/customer/instances/${instanceId}/actions`, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${token}`,
            'content-type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ action }),
        }),
      );

      if (result.kind !== 'ok') {
        handleAuthenticatedRequestFailure(result);
        return;
      }

      const response = result.response;
      if (!response.ok) {
        if (mountedRef.current) {
          setErrorMessage(
            locale === 'ar'
              ? `تعذر وضع إجراء ${translateCustomerEnum(locale, action)} في الطابور.`
              : `Could not queue the ${action} action.`,
          );
        }
        return;
      }

      const payload = (await response.json()) as RequestInstanceActionResponse;
      if (!mountedRef.current) {
        return;
      }

      setStatusMessage(payload.message);
      await reloadDetail();
    } finally {
      setActionSubmitting(null);
    }
  }

  async function rotateToken() {
    setTokenSubmitting(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const result = await requestWithRefresh((token) =>
        fetch(
          `${apiBaseUrl}/api/v1/customer/instances/${instanceId}/rotate-token`,
          {
            method: 'POST',
            headers: {
              authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          },
        ),
      );

      if (result.kind !== 'ok') {
        handleAuthenticatedRequestFailure(result);
        return;
      }

      const response = result.response;
      if (!response.ok) {
        if (mountedRef.current) {
          setErrorMessage(
            locale === 'ar' ? 'فشل تدوير الرمز.' : 'Token rotation failed.',
          );
        }
        return;
      }

      const payload = (await response.json()) as RotateInstanceTokenResponse;
      if (!mountedRef.current) {
        return;
      }

      const nextInstanceAccess: StoredInstanceCredentials = {
        instanceId: payload.instanceId,
        publicId: detail?.instance.publicId ?? instanceId,
        instanceName: detail?.instance.name ?? 'Instance',
        token: payload.token,
        updatedAt: payload.createdAt,
        source: 'rotated',
      };
      storeInstanceCredentials(nextInstanceAccess);
      setInstanceAccess(nextInstanceAccess);
      setStatusMessage(
        locale === 'ar'
          ? `تم تدوير رمز API للمثيل بالبادئة ${payload.prefix}.`
          : `Rotated instance API token with prefix ${payload.prefix}.`,
      );
      await reloadDetail();
    } finally {
      setTokenSubmitting(false);
    }
  }

  async function openLatestScreenshot() {
    if (!detail?.runtime.lastScreenshotPath) {
      setErrorMessage(
        locale === 'ar'
          ? 'لا توجد لقطة شاشة متاحة لهذا المثيل بعد.'
          : 'No screenshot is available for this instance yet.',
      );
      return;
    }

    setScreenshotOpening(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const result = await requestWithRefresh((token) =>
        fetch(
          `${apiBaseUrl}/api/v1/customer/instances/${instanceId}/screenshot`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          },
        ),
      );

      if (result.kind !== 'ok') {
        handleAuthenticatedRequestFailure(result);
        return;
      }

      const response = result.response;
      if (!response.ok) {
        if (mountedRef.current) {
          setErrorMessage(
            locale === 'ar'
              ? 'تعذر تحميل أحدث لقطة شاشة.'
              : 'Could not load the latest screenshot.',
          );
        }
        return;
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, '_blank', 'noopener,noreferrer');
      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 60_000);

      if (mountedRef.current) {
        setStatusMessage(
          locale === 'ar'
            ? 'تم فتح أحدث لقطة شاشة للتشغيل في تبويب جديد.'
            : 'Opened the latest runtime screenshot in a new tab.',
        );
      }
    } finally {
      if (mountedRef.current) {
        setScreenshotOpening(false);
      }
    }
  }

  async function sendChatMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessageSubmitting('chat');
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const result = await requestWithRefresh((token) =>
        fetch(
          `${apiBaseUrl}/api/v1/customer/instances/${instanceId}/messages/chat`,
          {
            method: 'POST',
            headers: {
              authorization: `Bearer ${token}`,
              'content-type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              to: chatForm.to.trim(),
              body: chatForm.body,
              referenceId:
                chatForm.referenceId.trim() === ''
                  ? null
                  : chatForm.referenceId.trim(),
              priority: chatForm.priority,
            }),
          },
        ),
      );

      if (result.kind !== 'ok') {
        handleAuthenticatedRequestFailure(result);
        return;
      }

      const response = result.response;
      if (!response.ok) {
        if (mountedRef.current) {
          setErrorMessage(
            locale === 'ar'
              ? 'تعذر وضع الرسالة النصية في الطابور.'
              : 'Chat message could not be queued.',
          );
        }
        return;
      }

      const payload = (await response.json()) as SendMessageResponse;
      if (!mountedRef.current) {
        return;
      }

      setChatForm((current) => ({
        ...current,
        body: '',
        referenceId: '',
      }));
      setStatusMessage(
        locale === 'ar'
          ? `تم وضع الرسالة النصية ${payload.message.publicMessageId} في الطابور.`
          : `Queued chat message ${payload.message.publicMessageId}.`,
      );
      await reloadDetail();
    } finally {
      setMessageSubmitting(null);
    }
  }

  async function sendImageMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!imageFile) {
      setErrorMessage(
        locale === 'ar'
          ? 'اختر ملف صورة قبل وضع الرسالة في الطابور.'
          : 'Select an image file before queueing the message.',
      );
      return;
    }

    setMessageSubmitting('image');
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const result = await requestWithRefresh((token) =>
        fetch(
          `${apiBaseUrl}/api/v1/customer/instances/${instanceId}/messages/image-upload`,
          {
            method: 'POST',
            headers: {
              authorization: `Bearer ${token}`,
            },
            credentials: 'include',
            body: (() => {
              const formData = new FormData();
              formData.set('to', imageForm.to.trim());
              formData.set('caption', imageForm.caption.trim());
              formData.set('referenceId', imageForm.referenceId.trim());
              formData.set('priority', String(imageForm.priority));
              formData.set('file', imageFile);
              return formData;
            })(),
          },
        ),
      );

      if (result.kind !== 'ok') {
        handleAuthenticatedRequestFailure(result);
        return;
      }

      const response = result.response;
      if (!response.ok) {
        if (mountedRef.current) {
          setErrorMessage(
            locale === 'ar'
              ? 'تعذر وضع رسالة الصورة في الطابور.'
              : 'Image message could not be queued.',
          );
        }
        return;
      }

      const payload = (await response.json()) as SendMessageResponse;
      if (!mountedRef.current) {
        return;
      }

      setImageForm((current) => ({
        ...current,
        caption: '',
        referenceId: '',
      }));
      setImageFile(null);
      setStatusMessage(
        locale === 'ar'
          ? `تم وضع رسالة الصورة ${payload.message.publicMessageId} في الطابور.`
          : `Queued image message ${payload.message.publicMessageId}.`,
      );
      await reloadDetail();
    } finally {
      setMessageSubmitting(null);
    }
  }

  return (
    <AppShell
      title={copy.customerInstanceDetail}
      subtitle={copy.titleSubtitle}
      breadcrumbLabel={locale === 'ar' ? 'تفاصيل المثيل' : 'Instance Detail'}
      surface="customer"
      labels={getCustomerShellLabels(locale)}
      nav={
        pageState === 'ready' ? <CustomerNav current="instance" /> : undefined
      }
      secondaryNav={
        pageState === 'ready' && detail ? (
          <AnchorNav
            items={[
              { label: copy.summary, href: '#instance-summary' },
              { label: copy.runtime, href: '#instance-runtime' },
              { label: copy.actions, href: '#instance-actions' },
              { label: copy.settings, href: '#instance-settings' },
              { label: copy.compose, href: '#instance-compose' },
              { label: copy.messages, href: '#instance-messages' },
              { label: copy.webhooks, href: '#instance-webhooks' },
              { label: copy.events, href: '#instance-events' },
            ]}
          />
        ) : undefined
      }
      meta={
        detail ? (
          <CustomerTopbarAnnouncement
            eyebrow={locale === 'ar' ? 'عرض التشغيل' : 'Runtime view'}
            message={
              locale === 'ar'
                ? 'افحص حالة QR والإجراءات وعمليات Webhook وعناصر الاسترداد.'
                : 'Inspect QR status, actions, webhooks, and recovery controls.'
            }
            linkLabel={
              locale === 'ar' ? 'العودة إلى لوحة التحكم' : 'Back to dashboard'
            }
            linkHref="/"
          />
        ) : (
          <StatusBadge tone="neutral">
            {locale === 'ar' ? 'واجهة المثيل' : 'Instance Surface'}
          </StatusBadge>
        )
      }
      footer={
        <>
          <Link href="/dashboard">{copy.backToDashboard}</Link>
          <Link href="/messages">{copy.messageExplorer}</Link>
          <Link href="/settings">{copy.settings}</Link>
        </>
      }
    >
      {pageState === 'loading' ? (
        <InfoCard
          eyebrow={locale === 'ar' ? 'المثيل' : 'Instance'}
          title={copy.loadingDetail}
        >
          <p style={{ margin: 0 }}>
            {locale === 'ar'
              ? 'يتم تحميل حالة التشغيل وأحداث دورة الحياة والرموز والعمليات المعلقة.'
              : 'Loading runtime state, lifecycle events, tokens, and pending operations.'}
          </p>
        </InfoCard>
      ) : null}

      {pageState === 'unauthenticated' ? (
        <InfoCard
          eyebrow={locale === 'ar' ? 'الجلسة' : 'Session'}
          title={copy.signInRequired}
        >
          <p style={{ marginTop: 0 }}>{copy.sessionMissing}</p>
          <p style={{ marginBottom: 0 }}>
            <Link href="/signin">
              {locale === 'ar'
                ? 'العودة إلى تسجيل الدخول في لوحة التحكم'
                : 'Return to the dashboard login'}
            </Link>
          </p>
        </InfoCard>
      ) : null}

      {pageState === 'ready' && detail ? (
        <>
          <InfoCard
            id="instance-summary"
            eyebrow={locale === 'ar' ? 'المثيل' : 'Instance'}
            title={`${detail.instance.name} (${detail.instance.publicId})`}
          >
            <div style={{ display: 'grid', gap: 16 }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  alignItems: 'center',
                }}
              >
                <StatusBadge tone="neutral">
                  {detail.instance.workspaceName}
                </StatusBadge>
                <StatusBadge tone={detail.assignedWorker ? 'info' : 'warning'}>
                  {detail.assignedWorker
                    ? `${detail.assignedWorker.workerId} (${translateCustomerEnum(locale, detail.assignedWorker.status)})`
                    : locale === 'ar'
                      ? 'غير معيّن'
                      : 'Unassigned'}
                </StatusBadge>
                {detail.pendingOperation ? (
                  <StatusBadge
                    tone={operationTone(detail.pendingOperation.status)}
                  >
                    {translateCustomerEnum(
                      locale,
                      detail.pendingOperation.action,
                    )}{' '}
                    (
                    {translateCustomerEnum(
                      locale,
                      detail.pendingOperation.status,
                    )}
                    )
                  </StatusBadge>
                ) : null}
              </div>
              <MetricGrid minItemWidth={150}>
                <MetricCard
                  label={locale === 'ar' ? 'الصادرة' : 'Outbound'}
                  value={messages.length}
                  hint={
                    locale === 'ar'
                      ? 'أحدث الرسائل الموضوعة في الطابور'
                      : 'Recent queued messages'
                  }
                />
                <MetricCard
                  label={copy.inbound}
                  value={inboundMessages.length}
                  hint={
                    locale === 'ar'
                      ? 'أحدث الرسائل المستلمة'
                      : 'Recent received messages'
                  }
                  tone="info"
                />
                <MetricCard
                  label={copy.webhooks}
                  value={webhookDeliveries.length}
                  hint={
                    locale === 'ar'
                      ? 'أحدث محاولات التسليم'
                      : 'Recent delivery attempts'
                  }
                  tone={
                    webhookDeliveries.some(
                      (delivery) => delivery.status === 'failed',
                    )
                      ? 'warning'
                      : 'neutral'
                  }
                />
                <MetricCard
                  label={locale === 'ar' ? 'دورة الحياة' : 'Lifecycle'}
                  value={detail.events.length}
                  hint={
                    locale === 'ar'
                      ? `آخر حدث ${formatCustomerDate(locale, detail.instance.latestEventAt)}`
                      : `Last event ${formatCustomerDate(locale, detail.instance.latestEventAt)}`
                  }
                />
              </MetricGrid>
            </div>
          </InfoCard>

          <InstanceApiAccessCard
            instanceId={detail.instance.id}
            publicId={detail.instance.publicId}
            instanceName={detail.instance.name}
            token={instanceAccess?.token ?? null}
            tokenPrefix={
              detail.tokens.find((token) => token.revokedAt === null)?.prefix ??
              detail.tokens[0]?.prefix ??
              null
            }
            connected={detail.instance.status === 'authenticated'}
            lastAuthenticatedAt={detail.runtime.lastAuthenticatedAt}
            action={
              <ActionButton
                type="button"
                tone="secondary"
                onClick={rotateToken}
                disabled={tokenSubmitting}
              >
                {tokenSubmitting
                  ? locale === 'ar'
                    ? 'جارٍ التدوير...'
                    : 'Rotating...'
                  : locale === 'ar'
                    ? 'تدوير رمز API'
                    : 'Rotate API token'}
              </ActionButton>
            }
          />

          <InfoCard
            id="instance-runtime"
            eyebrow={copy.runtime}
            title={copy.runtimeState}
          >
            <div className="elite-toolbar" style={{ marginBottom: 16 }}>
              <ActionButton
                type="button"
                tone="ghost"
                disabled={
                  !detail.runtime.lastScreenshotPath || screenshotOpening
                }
                onClick={() => {
                  void openLatestScreenshot();
                }}
              >
                {screenshotOpening
                  ? copy.openingScreenshot
                  : copy.openLatestScreenshot}
              </ActionButton>
            </div>
            <SectionGrid minItemWidth={320}>
              <div style={{ display: 'grid', gap: 16 }}>
                <DefinitionGrid
                  minItemWidth={150}
                  items={[
                    {
                      label: locale === 'ar' ? 'الواجهة الخلفية' : 'Backend',
                      value: detail.runtime.sessionBackend,
                      tone: 'info',
                    },
                    {
                      label: locale === 'ar' ? 'اسم الجلسة' : 'Session label',
                      value:
                        detail.runtime.currentSessionLabel ??
                        (locale === 'ar' ? 'غير مرتبط' : 'Not linked'),
                    },
                    {
                      label: locale === 'ar' ? 'انتهاء QR' : 'QR expires',
                      value: formatCustomerDate(
                        locale,
                        detail.runtime.qrExpiresAt,
                      ),
                      tone: detail.runtime.qrCode ? 'warning' : 'neutral',
                    },
                    {
                      label: locale === 'ar' ? 'آخر تشغيل' : 'Last started',
                      value: formatCustomerDate(
                        locale,
                        detail.runtime.lastStartedAt,
                      ),
                    },
                    {
                      label: locale === 'ar' ? 'آخر مصادقة' : 'Last auth',
                      value: formatCustomerDate(
                        locale,
                        detail.runtime.lastAuthenticatedAt,
                      ),
                      tone: detail.runtime.lastAuthenticatedAt
                        ? 'success'
                        : 'neutral',
                    },
                    {
                      label: locale === 'ar' ? 'آخر انقطاع' : 'Last disconnect',
                      value: formatCustomerDate(
                        locale,
                        detail.runtime.lastDisconnectedAt,
                      ),
                    },
                    {
                      label:
                        locale === 'ar' ? 'آخر رسالة واردة' : 'Last inbound',
                      value: formatCustomerDate(
                        locale,
                        detail.runtime.lastInboundMessageAt,
                      ),
                    },
                    {
                      label: locale === 'ar' ? 'لقطة الشاشة' : 'Screenshot',
                      value:
                        detail.runtime.lastScreenshotPath ??
                        (locale === 'ar' ? 'لا يوجد' : 'None'),
                    },
                    {
                      label:
                        locale === 'ar' ? 'الحالة المطلوبة' : 'Desired state',
                      value:
                        readDiagnosticField(
                          detail.runtime.sessionDiagnostics,
                          'desiredState',
                        ) ?? (locale === 'ar' ? 'غير معروف' : 'Unknown'),
                    },
                    {
                      label:
                        locale === 'ar' ? 'محاولات البدء' : 'Startup attempts',
                      value:
                        readDiagnosticField(
                          detail.runtime.sessionDiagnostics,
                          'startupAttempts',
                        ) ?? '0',
                    },
                    {
                      label:
                        locale === 'ar'
                          ? 'محاولات الاسترداد'
                          : 'Recovery attempts',
                      value:
                        readDiagnosticField(
                          detail.runtime.sessionDiagnostics,
                          'recoveryAttempts',
                        ) ?? '0',
                    },
                    {
                      label:
                        locale === 'ar'
                          ? 'آخر حدث للعميل'
                          : 'Last client event',
                      value:
                        readDiagnosticField(
                          detail.runtime.sessionDiagnostics,
                          'lastClientEvent',
                        ) ?? (locale === 'ar' ? 'غير معروف' : 'Unknown'),
                    },
                    {
                      label:
                        locale === 'ar' ? 'الاسترداد بعد' : 'Recover after',
                      value:
                        readDiagnosticField(
                          detail.runtime.sessionDiagnostics,
                          'recoverAfterAt',
                        ) ?? (locale === 'ar' ? 'لا يوجد' : 'None'),
                    },
                    {
                      label: locale === 'ar' ? 'خطأ التشغيل' : 'Runtime error',
                      value:
                        readDiagnosticField(
                          detail.runtime.sessionDiagnostics,
                          'lastError',
                        ) ?? (locale === 'ar' ? 'لا يوجد' : 'None'),
                      tone: readDiagnosticField(
                        detail.runtime.sessionDiagnostics,
                        'lastError',
                      )
                        ? 'danger'
                        : 'neutral',
                    },
                    {
                      label:
                        locale === 'ar' ? 'سبب الانقطاع' : 'Disconnect reason',
                      value:
                        detail.runtime.disconnectReason ??
                        (locale === 'ar' ? 'لا يوجد' : 'None'),
                    },
                    {
                      label:
                        locale === 'ar'
                          ? 'العملية المعلقة'
                          : 'Pending operation',
                      value: detail.pendingOperation
                        ? `${translateCustomerEnum(locale, detail.pendingOperation.action)} (${translateCustomerEnum(locale, detail.pendingOperation.status)})`
                        : locale === 'ar'
                          ? 'لا يوجد'
                          : 'None',
                      tone: detail.pendingOperation
                        ? operationTone(detail.pendingOperation.status)
                        : 'neutral',
                    },
                  ]}
                />
                <pre className="elite-mono-panel">
                  {formatDiagnostics(detail.runtime.sessionDiagnostics, locale)}
                </pre>
              </div>
              <div style={{ display: 'grid', gap: 16 }}>
                {detail.runtime.sessionBackend === 'placeholder' &&
                detail.runtime.qrCode ? (
                  <NoticeBanner
                    title={
                      locale === 'ar' ? 'QR تجريبي فقط' : 'Simulated QR only'
                    }
                    tone="warning"
                  >
                    <p style={{ margin: 0 }}>
                      {locale === 'ar'
                        ? 'هذا المثيل يعمل على واجهة خلفية تجريبية. حمولة QR الخاصة به مخصصة للمحاكاة المحلية فقط ولا يمكن مسحها عبر واتساب.'
                        : 'This instance is running on the placeholder backend. Its QR payload is only for local simulation and cannot be scanned by WhatsApp.'}
                    </p>
                  </NoticeBanner>
                ) : null}
                {detail.runtime.qrCode ? (
                  <QrPayloadView
                    payload={detail.runtime.qrCode}
                    alt={`WhatsApp QR for ${detail.instance.publicId}`}
                    expiresAt={detail.runtime.qrExpiresAt}
                  />
                ) : (
                  <NoticeBanner
                    title={
                      locale === 'ar' ? 'لا يوجد QR منشور' : 'No QR published'
                    }
                    tone="neutral"
                  >
                    <p style={{ margin: 0 }}>
                      {locale === 'ar'
                        ? 'هذا المثيل مرتبط بالفعل أو لا ينتظر المسح حاليًا.'
                        : 'This instance is either already linked or not currently waiting for scan.'}
                    </p>
                  </NoticeBanner>
                )}
              </div>
            </SectionGrid>
          </InfoCard>

          <InfoCard
            id="instance-actions"
            eyebrow={copy.actions}
            title={copy.runtimeActions}
          >
            {conflictActive ? (
              <NoticeBanner
                title={
                  locale === 'ar'
                    ? 'تم اكتشاف تعارض في الجلسة'
                    : 'Session conflict detected'
                }
                tone="warning"
              >
                <p style={{ margin: 0 }}>
                  {locale === 'ar'
                    ? 'أبلغ واتساب عن جلسة أخرى لجهاز مرتبط. استخدم الاستحواذ لاسترداد هذا التشغيل.'
                    : 'WhatsApp reported another linked-device session. Use takeover to recover this runtime.'}
                </p>
              </NoticeBanner>
            ) : null}
            <div className="elite-toolbar">
              {(
                [
                  ...(conflictActive ? (['takeover'] as const) : []),
                  'start',
                  'restart',
                  'stop',
                  'logout',
                  'clear',
                ] as const
              ).map((action) => (
                <ActionButton
                  key={action}
                  type="button"
                  tone={
                    action === 'clear' || action === 'logout'
                      ? 'danger'
                      : action === 'stop'
                        ? 'ghost'
                        : action === 'takeover'
                          ? 'secondary'
                          : 'primary'
                  }
                  disabled={
                    Boolean(hasPendingOperation) ||
                    actionSubmitting !== null ||
                    settingsSubmitting
                  }
                  onClick={() => {
                    void requestAction(action);
                  }}
                >
                  {actionSubmitting === action
                    ? `${translateCustomerEnum(locale, action)}...`
                    : translateCustomerEnum(locale, action)}
                </ActionButton>
              ))}
            </div>
            <NoticeBanner
              title={locale === 'ar' ? 'طابور العمليات' : 'Operation queue'}
              tone={hasPendingOperation ? 'warning' : 'info'}
            >
              <p style={{ margin: 0 }}>
                {locale === 'ar'
                  ? 'يمكن أن تكون عملية واحدة فقط معلقة أو قيد التشغيل في الوقت نفسه.'
                  : 'Only one operation can be pending or running at a time.'}
              </p>
            </NoticeBanner>
          </InfoCard>

          <InfoCard
            id="instance-settings"
            eyebrow={copy.settings}
            title={copy.runtimeSettings}
          >
            <form
              onSubmit={updateSettings}
              style={{ display: 'grid', gap: 16 }}
            >
              <Field
                label="sendDelay"
                hint={
                  locale === 'ar'
                    ? 'فاصل الإرسال العادي بالثواني.'
                    : 'Normal send spacing in seconds.'
                }
              >
                <TextInput
                  value={settingsForm.sendDelay}
                  onChange={(event) =>
                    setSettingsForm((current) => ({
                      ...current,
                      sendDelay: Number(event.target.value),
                    }))
                  }
                  type="number"
                  min={0}
                  max={300}
                  required
                />
              </Field>
              <Field
                label="sendDelayMax"
                hint={
                  locale === 'ar'
                    ? 'يُطبّق عند ارتفاع ضغط الطابور.'
                    : 'Applied when queue pressure is high.'
                }
              >
                <TextInput
                  value={settingsForm.sendDelayMax}
                  onChange={(event) =>
                    setSettingsForm((current) => ({
                      ...current,
                      sendDelayMax: Number(event.target.value),
                    }))
                  }
                  type="number"
                  min={0}
                  max={300}
                  required
                />
              </Field>
              <Field
                label={locale === 'ar' ? 'رابط Webhook' : 'Webhook URL'}
                hint={
                  locale === 'ar'
                    ? 'نقطة نهاية اختيارية لأحداث الإنشاء والتأكيد والوارد.'
                    : 'Optional endpoint for create, ack, and inbound events.'
                }
              >
                <TextInput
                  value={settingsForm.webhookUrl}
                  onChange={(event) =>
                    setSettingsForm((current) => ({
                      ...current,
                      webhookUrl: event.target.value,
                    }))
                  }
                  placeholder="https://example.com/webhook"
                  type="url"
                />
              </Field>
              <Field
                label={
                  locale === 'ar'
                    ? 'سر توقيع Webhook'
                    : 'Webhook signing secret'
                }
                hint={
                  locale === 'ar'
                    ? 'تتضمن طلبات Webhook الصادرة الرؤوس x-elite-message-timestamp و x-elite-message-signature.'
                    : 'Outgoing webhooks include x-elite-message-timestamp and x-elite-message-signature headers.'
                }
              >
                <TextInput value={detail.settings.webhookSecret} readOnly />
              </Field>
              <CheckboxField
                checked={settingsForm.webhookMessageReceived}
                onChange={(event) =>
                  setSettingsForm((current) => ({
                    ...current,
                    webhookMessageReceived: event.target.checked,
                  }))
                }
                label={
                  locale === 'ar'
                    ? 'Webhook عند استلام الرسالة'
                    : 'Webhook on message received'
                }
              />
              <CheckboxField
                checked={settingsForm.webhookMessageCreate}
                onChange={(event) =>
                  setSettingsForm((current) => ({
                    ...current,
                    webhookMessageCreate: event.target.checked,
                  }))
                }
                label={
                  locale === 'ar'
                    ? 'Webhook عند إنشاء الرسالة'
                    : 'Webhook on message create'
                }
              />
              <CheckboxField
                checked={settingsForm.webhookMessageAck}
                onChange={(event) =>
                  setSettingsForm((current) => ({
                    ...current,
                    webhookMessageAck: event.target.checked,
                  }))
                }
                label={
                  locale === 'ar'
                    ? 'Webhook عند تأكيد الرسالة'
                    : 'Webhook on message ack'
                }
              />
              <ActionButton
                type="submit"
                disabled={settingsSubmitting || actionSubmitting !== null}
              >
                {settingsSubmitting
                  ? locale === 'ar'
                    ? 'جارٍ الحفظ...'
                    : 'Saving...'
                  : locale === 'ar'
                    ? 'حفظ الإعدادات'
                    : 'Save settings'}
              </ActionButton>
            </form>
          </InfoCard>

          <InfoCard
            id="instance-compose"
            eyebrow={locale === 'ar' ? 'إرسال' : 'Send'}
            title={
              locale === 'ar'
                ? 'ضع الرسائل الصادرة في الطابور'
                : 'Queue outbound messages'
            }
          >
            <SectionGrid minItemWidth={320}>
              <form
                onSubmit={sendChatMessage}
                style={{ display: 'grid', gap: 16 }}
              >
                <NoticeBanner
                  title={locale === 'ar' ? 'رسالة نصية' : 'Chat message'}
                  tone="info"
                >
                  <p style={{ margin: 0 }}>
                    {locale === 'ar'
                      ? 'ضع إرسال نص عادي عبر التشغيل النشط في الطابور.'
                      : 'Queue plain text delivery through the active runtime.'}
                  </p>
                </NoticeBanner>
                <Field label={locale === 'ar' ? 'المستلم' : 'Recipient'}>
                  <TextInput
                    value={chatForm.to}
                    onChange={(event) =>
                      setChatForm((current) => ({
                        ...current,
                        to: event.target.value,
                      }))
                    }
                    placeholder="9639..."
                    required
                  />
                </Field>
                <Field label={locale === 'ar' ? 'المحتوى' : 'Body'}>
                  <TextAreaInput
                    value={chatForm.body}
                    onChange={(event) =>
                      setChatForm((current) => ({
                        ...current,
                        body: event.target.value,
                      }))
                    }
                    rows={4}
                    required
                  />
                </Field>
                <Field
                  label={locale === 'ar' ? 'معرّف المرجع' : 'Reference ID'}
                >
                  <TextInput
                    value={chatForm.referenceId}
                    onChange={(event) =>
                      setChatForm((current) => ({
                        ...current,
                        referenceId: event.target.value,
                      }))
                    }
                    placeholder="optional-reference"
                  />
                </Field>
                <Field label={locale === 'ar' ? 'الأولوية' : 'Priority'}>
                  <TextInput
                    value={chatForm.priority}
                    onChange={(event) =>
                      setChatForm((current) => ({
                        ...current,
                        priority: Number(event.target.value) || 100,
                      }))
                    }
                    type="number"
                    min={1}
                    max={999}
                    required
                  />
                </Field>
                <ActionButton
                  type="submit"
                  disabled={messageSubmitting !== null}
                >
                  {messageSubmitting === 'chat'
                    ? locale === 'ar'
                      ? 'جارٍ وضع الرسالة النصية في الطابور...'
                      : 'Queueing chat...'
                    : locale === 'ar'
                      ? 'ضع الرسالة النصية في الطابور'
                      : 'Queue chat message'}
                </ActionButton>
              </form>

              <form
                onSubmit={sendImageMessage}
                style={{ display: 'grid', gap: 16 }}
              >
                <NoticeBanner
                  title={locale === 'ar' ? 'رسالة صورة' : 'Image message'}
                  tone="info"
                >
                  <p style={{ margin: 0 }}>
                    {locale === 'ar'
                      ? 'ارفع ملف صورة وضعه في الطابور عبر التشغيل النشط مع تعليق اختياري.'
                      : 'Upload an image file and queue it through the active runtime with an optional caption.'}
                  </p>
                </NoticeBanner>
                <Field label={locale === 'ar' ? 'المستلم' : 'Recipient'}>
                  <TextInput
                    value={imageForm.to}
                    onChange={(event) =>
                      setImageForm((current) => ({
                        ...current,
                        to: event.target.value,
                      }))
                    }
                    placeholder="9639..."
                    required
                  />
                </Field>
                <Field
                  label={locale === 'ar' ? 'ملف الصورة' : 'Image file'}
                  hint={
                    locale === 'ar'
                      ? 'يتم تخزين الرفع على تشغيل القرص الخارجي ويُعرض عبر رابط أصل عام يمكن للعامل الوصول إليه.'
                      : 'The upload is stored on the external-volume runtime and exposed through a worker-fetchable public asset URL.'
                  }
                >
                  <input
                    data-elite-control
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      setImageFile(event.target.files?.[0] ?? null);
                    }}
                    required
                  />
                  <span className="elite-field-hint">
                    {imageFile
                      ? locale === 'ar'
                        ? `تم اختيار ${imageFile.name}`
                        : `Selected ${imageFile.name}`
                      : locale === 'ar'
                        ? 'اختر ملف PNG أو JPG أو WEBP أو صورة مشابهة.'
                        : 'Choose a PNG, JPG, WEBP, or similar image file.'}
                  </span>
                </Field>
                <Field label={locale === 'ar' ? 'التعليق' : 'Caption'}>
                  <TextAreaInput
                    value={imageForm.caption}
                    onChange={(event) =>
                      setImageForm((current) => ({
                        ...current,
                        caption: event.target.value,
                      }))
                    }
                    rows={3}
                  />
                </Field>
                <Field
                  label={locale === 'ar' ? 'معرّف المرجع' : 'Reference ID'}
                >
                  <TextInput
                    value={imageForm.referenceId}
                    onChange={(event) =>
                      setImageForm((current) => ({
                        ...current,
                        referenceId: event.target.value,
                      }))
                    }
                    placeholder="optional-reference"
                  />
                </Field>
                <Field label={locale === 'ar' ? 'الأولوية' : 'Priority'}>
                  <TextInput
                    value={imageForm.priority}
                    onChange={(event) =>
                      setImageForm((current) => ({
                        ...current,
                        priority: Number(event.target.value) || 100,
                      }))
                    }
                    type="number"
                    min={1}
                    max={999}
                    required
                  />
                </Field>
                <ActionButton
                  type="submit"
                  disabled={messageSubmitting !== null}
                >
                  {messageSubmitting === 'image'
                    ? locale === 'ar'
                      ? 'جارٍ وضع الصورة في الطابور...'
                      : 'Queueing image...'
                    : locale === 'ar'
                      ? 'ضع رسالة الصورة في الطابور'
                      : 'Queue image message'}
                </ActionButton>
              </form>
            </SectionGrid>
          </InfoCard>

          <InfoCard
            id="instance-messages"
            eyebrow={copy.messages}
            title={copy.recentMessages}
          >
            {messages.length === 0 ? (
              <p style={{ margin: 0 }}>
                {locale === 'ar'
                  ? 'لم يتم وضع أي رسائل صادرة في الطابور بعد.'
                  : 'No outbound messages have been queued yet.'}
              </p>
            ) : (
              <ul className="elite-list">
                {messages.map((message) => (
                  <li key={message.id} className="elite-list-item">
                    <div className="elite-list-title">
                      <span>
                        {locale === 'ar'
                          ? `${message.publicMessageId} إلى ${message.recipient}`
                          : `${message.publicMessageId} to ${message.recipient}`}
                      </span>
                      <StatusBadge tone={statusTone(message.status)}>
                        {translateCustomerEnum(locale, message.status)}
                      </StatusBadge>
                      <StatusBadge tone={ackTone(message.ack)}>
                        {translateCustomerEnum(locale, message.ack)}
                      </StatusBadge>
                    </div>
                    <div>
                      {locale === 'ar' ? 'المعاينة: ' : 'Preview: '}
                      {formatMessagePreview(message, locale)}
                    </div>
                    <div className="elite-list-meta">
                      <span>
                        {locale === 'ar'
                          ? `النوع ${translateCustomerEnum(locale, message.messageType)}`
                          : `Type ${message.messageType}`}
                      </span>
                      <span>
                        {locale === 'ar'
                          ? `الأولوية ${message.priority}`
                          : `Priority ${message.priority}`}
                      </span>
                      <span>
                        {locale === 'ar'
                          ? `مجدولة ${formatCustomerDate(locale, message.scheduledFor)}`
                          : `Scheduled ${formatCustomerDate(locale, message.scheduledFor)}`}
                      </span>
                    </div>
                    <div className="elite-list-meta">
                      <span>
                        {locale === 'ar'
                          ? `العامل ${message.workerId ?? message.processingWorkerId ?? 'لم يُعيَّن بعد'}`
                          : `Worker ${message.workerId ?? message.processingWorkerId ?? 'Not assigned yet'}`}
                      </span>
                      <span>
                        {locale === 'ar'
                          ? `المرجع ${message.referenceId ?? 'لا يوجد'}`
                          : `Reference ${message.referenceId ?? 'None'}`}
                      </span>
                    </div>
                    <div>
                      {locale === 'ar' ? 'الخطأ: ' : 'Error: '}
                      {message.errorMessage ??
                        (locale === 'ar' ? 'لا يوجد' : 'None')}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>

          <InfoCard eyebrow={copy.inbound} title={copy.recentInboundMessages}>
            {inboundMessages.length === 0 ? (
              <p style={{ margin: 0 }}>
                {locale === 'ar'
                  ? 'لم يتم تسجيل أي رسائل واردة بعد.'
                  : 'No inbound messages have been recorded yet.'}
              </p>
            ) : (
              <ul className="elite-list">
                {inboundMessages.map((message) => (
                  <li key={message.id} className="elite-list-item">
                    <div className="elite-list-title">
                      <span>
                        {locale === 'ar'
                          ? `${message.publicMessageId} من ${message.sender}`
                          : `${message.publicMessageId} from ${message.sender}`}
                      </span>
                      <StatusBadge tone="info">
                        {translateCustomerEnum(locale, message.kind)}
                      </StatusBadge>
                    </div>
                    <div>
                      {locale === 'ar' ? 'المحتوى: ' : 'Body: '}
                      {message.body ??
                        (locale === 'ar' ? 'لا يوجد نص' : 'No text body')}
                    </div>
                    <div className="elite-list-meta">
                      <span>
                        {locale === 'ar'
                          ? `المحادثة ${message.chatId ?? 'غير معروف'}`
                          : `Chat ${message.chatId ?? 'Unknown'}`}
                      </span>
                      <span>
                        {locale === 'ar'
                          ? `الاسم الظاهر ${message.pushName ?? 'غير معروف'}`
                          : `Push ${message.pushName ?? 'Unknown'}`}
                      </span>
                      <span>
                        {locale === 'ar'
                          ? `من جهتي ${translateCustomerBoolean(locale, message.fromMe)}`
                          : `From me ${translateCustomerBoolean(locale, message.fromMe)}`}
                      </span>
                    </div>
                    <div className="elite-list-meta">
                      <span>
                        {locale === 'ar'
                          ? `تم الاستلام ${formatCustomerDate(locale, message.receivedAt)}`
                          : `Received ${formatCustomerDate(locale, message.receivedAt)}`}
                      </span>
                      <span>
                        {locale === 'ar'
                          ? `أُرسلت في ${formatCustomerDate(locale, message.sentAt)}`
                          : `Sent at ${formatCustomerDate(locale, message.sentAt)}`}
                      </span>
                      <span>
                        {locale === 'ar'
                          ? `المزوّد ${message.providerMessageId ?? 'لا يوجد'}`
                          : `Provider ${message.providerMessageId ?? 'None'}`}
                      </span>
                    </div>
                    <div>
                      {locale === 'ar' ? 'مسار الوسائط: ' : 'Media path: '}
                      {message.mediaUrl ??
                        (locale === 'ar' ? 'لا يوجد' : 'None')}{' '}
                      | MIME:{' '}
                      {message.mimeType ??
                        (locale === 'ar' ? 'غير معروف' : 'Unknown')}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>

          <InfoCard
            id="instance-webhooks"
            eyebrow={copy.webhooks}
            title={copy.recentWebhooks}
          >
            {webhookDeliveries.length === 0 ? (
              <p style={{ margin: 0 }}>
                {locale === 'ar'
                  ? 'لم يتم تسجيل أي عمليات تسليم Webhook بعد.'
                  : 'No webhook deliveries have been recorded yet.'}
              </p>
            ) : (
              <ul className="elite-list">
                {webhookDeliveries.map((delivery) => (
                  <li key={delivery.id} className="elite-list-item">
                    <div className="elite-list-title">
                      <span>{delivery.eventType}</span>
                      <StatusBadge tone={webhookTone(delivery.status)}>
                        {translateCustomerEnum(locale, delivery.status)}
                      </StatusBadge>
                    </div>
                    <div>
                      {locale === 'ar' ? 'الرابط الهدف: ' : 'Target URL: '}
                      {delivery.targetUrl}
                    </div>
                    <div className="elite-list-meta">
                      <span>
                        {locale === 'ar'
                          ? `الرسالة ${delivery.publicMessageId ?? 'لا توجد رسالة مرتبطة'}`
                          : `Message ${delivery.publicMessageId ?? 'No linked message'}`}
                      </span>
                      <span>
                        {locale === 'ar'
                          ? `المحاولات ${delivery.attemptCount}`
                          : `Attempts ${delivery.attemptCount}`}
                      </span>
                      <span>
                        {locale === 'ar'
                          ? `المحاولة التالية ${formatCustomerDate(locale, delivery.nextAttemptAt)}`
                          : `Next attempt ${formatCustomerDate(locale, delivery.nextAttemptAt)}`}
                      </span>
                    </div>
                    <div className="elite-list-meta">
                      <span>
                        {locale === 'ar'
                          ? `آخر استجابة ${delivery.responseStatusCode ?? 'لا يوجد'}`
                          : `Last response ${delivery.responseStatusCode ?? 'None'}`}
                      </span>
                      <span>
                        {locale === 'ar'
                          ? `الخطأ ${delivery.errorMessage ?? 'لا يوجد'}`
                          : `Error ${delivery.errorMessage ?? 'None'}`}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>

          <InfoCard
            eyebrow={locale === 'ar' ? 'العمليات' : 'Operations'}
            title={copy.recentOperations}
          >
            {detail.operations.length === 0 ? (
              <p style={{ margin: 0 }}>
                {locale === 'ar'
                  ? 'لم يتم تسجيل أي عمليات بعد.'
                  : 'No operations have been recorded yet.'}
              </p>
            ) : (
              <ul className="elite-list">
                {detail.operations.map((operation) => (
                  <li key={operation.id} className="elite-list-item">
                    <div className="elite-list-title">
                      <span>
                        {translateCustomerEnum(locale, operation.action)}
                      </span>
                      <StatusBadge tone={operationTone(operation.status)}>
                        {translateCustomerEnum(locale, operation.status)}
                      </StatusBadge>
                    </div>
                    <div className="elite-list-meta">
                      <span>
                        {locale === 'ar'
                          ? `طُلبت بواسطة ${operation.requestedByActorType}`
                          : `Requested by ${operation.requestedByActorType}`}
                      </span>
                      <span>
                        {locale === 'ar'
                          ? `العامل الهدف ${operation.targetWorkerId ?? 'تعيين تلقائي'}`
                          : `Target worker ${operation.targetWorkerId ?? 'Automatic assignment'}`}
                      </span>
                    </div>
                    <div className="elite-list-meta">
                      <span>
                        {locale === 'ar'
                          ? `بدأت ${formatCustomerDate(locale, operation.startedAt)}`
                          : `Started ${formatCustomerDate(locale, operation.startedAt)}`}
                      </span>
                      <span>
                        {locale === 'ar'
                          ? `اكتملت ${formatCustomerDate(locale, operation.completedAt)}`
                          : `Completed ${formatCustomerDate(locale, operation.completedAt)}`}
                      </span>
                    </div>
                    <div>
                      {locale === 'ar' ? 'الرسالة: ' : 'Message: '}
                      {operation.message ??
                        (locale === 'ar' ? 'لا يوجد' : 'None')}
                    </div>
                    <div>
                      {locale === 'ar' ? 'الخطأ: ' : 'Error: '}
                      {operation.errorMessage ??
                        (locale === 'ar' ? 'لا يوجد' : 'None')}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>

          <InfoCard
            eyebrow={copy.tokens}
            title={
              locale === 'ar'
                ? 'سجل رموز API للمثيل'
                : 'Instance API token history'
            }
          >
            {detail.tokens.length === 0 ? (
              <p style={{ margin: 0 }}>
                {locale === 'ar'
                  ? 'لم يتم إنشاء أي رموز API للمثيل.'
                  : 'No instance API tokens have been created.'}
              </p>
            ) : (
              <ul className="elite-list">
                {detail.tokens.map((token) => (
                  <li key={token.id} className="elite-list-item">
                    <div className="elite-list-title">
                      <span>{token.name}</span>
                      <StatusBadge
                        tone={token.revokedAt ? 'danger' : 'success'}
                      >
                        {translateCustomerEnum(
                          locale,
                          token.revokedAt ? 'revoked' : 'active',
                        )}
                      </StatusBadge>
                    </div>
                    <div>
                      {locale === 'ar' ? 'البادئة: ' : 'Prefix: '}
                      <code>{token.prefix}</code>
                    </div>
                    <div className="elite-list-meta">
                      <span>
                        {locale === 'ar'
                          ? `أُنشئ ${formatCustomerDate(locale, token.createdAt)}`
                          : `Created ${formatCustomerDate(locale, token.createdAt)}`}
                      </span>
                      <span>
                        {locale === 'ar'
                          ? `أُلغي ${formatCustomerDate(locale, token.revokedAt)}`
                          : `Revoked ${formatCustomerDate(locale, token.revokedAt)}`}
                      </span>
                      <span>
                        {locale === 'ar'
                          ? `آخر استخدام ${formatCustomerDate(locale, token.lastUsedAt)}`
                          : `Last used ${formatCustomerDate(locale, token.lastUsedAt)}`}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>

          <InfoCard
            id="instance-events"
            eyebrow={copy.events}
            title={copy.recentEvents}
          >
            {detail.events.length === 0 ? (
              <p style={{ margin: 0 }}>
                {locale === 'ar'
                  ? 'لم يتم تسجيل أي أحداث لدورة الحياة بعد.'
                  : 'No lifecycle events have been recorded yet.'}
              </p>
            ) : (
              <ul className="elite-list">
                {detail.events.map((event) => (
                  <li key={event.id} className="elite-list-item">
                    <div className="elite-list-title">
                      <span>{event.eventType}</span>
                      <StatusBadge tone="neutral">
                        {event.actorType}
                      </StatusBadge>
                    </div>
                    <div>{event.message}</div>
                    <div className="elite-list-meta">
                      <span>
                        {locale === 'ar'
                          ? `${event.fromStatus ?? 'غير متاح'} إلى ${event.toStatus ?? 'غير متاح'}`
                          : `${event.fromStatus ?? 'n/a'} to ${event.toStatus ?? 'n/a'}`}
                      </span>
                      <span>{formatCustomerDate(locale, event.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>
        </>
      ) : null}

      {errorMessage ? (
        <NoticeBanner title={copy.actionFailed} tone="danger">
          <p style={{ margin: 0 }}>{errorMessage}</p>
        </NoticeBanner>
      ) : null}

      {statusMessage ? (
        <NoticeBanner title={copy.latestAction} tone="success">
          <p style={{ margin: 0 }}>{statusMessage}</p>
        </NoticeBanner>
      ) : null}
    </AppShell>
  );
}
