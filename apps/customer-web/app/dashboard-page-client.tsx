'use client';

import Link from 'next/link';
import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from 'react';
import { io } from 'socket.io-client';
import type {
  AccountApiTokenSummary,
  AccountMeResponse,
  CreateAccountApiTokenResponse,
  CreateInstanceResponse,
  InstanceSummary,
  ListAccountApiTokensResponse,
  ListCustomerInstancesResponse,
} from '@elite-message/contracts';
import { websocketEventNames } from '@elite-message/contracts';
import {
  ActionButton,
  AppShell,
  DefinitionGrid,
  Field,
  InfoCard,
  LoadingState,
  MetricCard,
  MetricGrid,
  NoticeBanner,
  SectionGrid,
  SelectInput,
  StatusBadge,
  TextInput,
} from '@elite-message/ui';
import { useCustomerLocale } from './components/customer-localization';
import { CustomerNav } from './components/customer-nav';
import { InstanceApiAccessCard } from './components/instance-api-access-card';
import {
  CustomerTopbarAnnouncement,
  CustomerWorkspaceControls,
} from './components/customer-workspace-chrome';
import {
  loadCustomerAccount,
  logoutCustomerSession,
  refreshCustomerAccessToken,
  requestWithCustomerRefresh,
} from './lib/customer-auth';
import {
  readInstanceCredentials,
  storeInstanceCredentials,
  type StoredInstanceCredentials,
} from './lib/instance-credentials';
import {
  formatCustomerDate,
  getCustomerShellLabels,
  translateCustomerEnum,
} from './lib/customer-locale';
import { apiBaseUrl, readStoredToken } from './lib/session';

type PageState = 'loading' | 'unauthenticated' | 'ready';

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
    case 'expired':
      return 'danger' as const;
    default:
      return 'neutral' as const;
  }
}

function buildWorkspaceRoute(pathname: string, workspaceId: string) {
  if (!workspaceId) {
    return pathname;
  }

  const query = new URLSearchParams();
  query.set('workspaceId', workspaceId);
  return `${pathname}?${query.toString()}`;
}

const dashboardArabicCopy = {
  pageTitle: 'لوحة تحكم العميل',
  pageSubtitle:
    'أدر تهيئة مساحة العمل وبيانات اعتماد API ورؤية التشغيل من شِلّ العميل الموثق.',
  breadcrumbLabel: 'لوحة التحكم',
  heroEyebrow: 'مركز التحكم',
  heroTitle: 'ابدأ المحادثات بثقة أسرع',
  heroBody:
    'تابع اتصال واتساب، افتح المحادثات، أدر جهات الاتصال، وأنشئ بيانات اعتماد API من لوحة واحدة واضحة.',
  heroPrimaryAction: 'افتح المحادثات',
  heroSecondaryAction: 'إدارة جهات الاتصال',
  heroTertiaryAction: 'مستندات API',
  nextActionEyebrow: 'أفضل خطوة الآن',
  nextActionNoInstanceTitle: 'أنشئ أول مثيل واتساب',
  nextActionNoInstanceBody: 'ابدأ بتسمية المثيل ثم افتح صفحة التشغيل لمسح QR.',
  nextActionAttentionTitle: 'راجع المثيل الذي يحتاج انتباهًا',
  nextActionAttentionBody:
    'هناك حالة تشغيل تحتاج متابعة قبل إرسال الرسائل بثبات.',
  nextActionConnectedTitle: 'ابدأ إدارة المحادثات',
  nextActionConnectedBody:
    'لديك مثيل متصل. انتقل إلى صندوق المحادثات وجهات الاتصال.',
  nextActionConnectTitle: 'أكمل ربط واتساب',
  nextActionConnectBody: 'افتح تفاصيل التشغيل وامسح QR لتفعيل الإرسال.',
  nextActionOpen: 'تنفيذ الخطوة',
  setupPathTitle: 'مسار التجهيز',
  setupWorkspace: 'مساحة العمل',
  setupWorkspaceDetail: 'تم اختيار السياق',
  setupInstance: 'المثيل',
  setupInstanceDetail: 'قناة واتساب',
  setupConnect: 'الربط',
  setupConnectDetail: 'QR أو جلسة نشطة',
  setupSend: 'الإرسال',
  setupSendDetail: 'المحادثات والرسائل',
  quickActionsEyebrow: 'اختصارات',
  quickActionsTitle: 'الأعمال اليومية',
  quickConversationsTitle: 'المحادثات',
  quickConversationsBody: 'اعرض المحادثات الأخيرة بأسلوب قريب من تيليجرام.',
  quickContactsTitle: 'جهات الاتصال',
  quickContactsBody: 'ابحث في العملاء واربطهم بالمحادثات بسرعة.',
  quickRuntimeTitle: 'تشغيل واتساب',
  quickRuntimeBody: 'افتح QR والحالة والعمليات الخاصة بالمثيل.',
  quickApiTitle: 'واجهة API',
  quickApiBody: 'راجع المسارات والرموز اللازمة للتكامل.',
  quickOpen: 'فتح',
  topbarEyebrow: 'تهيئة API',
  topbarMessage:
    'أنشئ بيانات اعتماد المثيل هنا، ثم انتقل مباشرة إلى مستندات API العامة وصفحات تفاصيل التشغيل.',
  topbarLinkLabel: 'افتح مستندات API',
  footerLinkLabel: 'افتح مستكشف الرسائل',
  sessionEyebrow: 'الجلسة',
  loadingTitle: 'جارٍ تحميل لوحة تحكم العميل',
  loadingMessage: 'يتم تحديث جلسة العميل وتحميل حالة مساحة العمل الحالية.',
  signInRequiredTitle: 'يجب تسجيل الدخول',
  signInRequiredBody: 'جلسة العميل مفقودة أو منتهية الصلاحية.',
  signInRequiredLink: 'العودة إلى تسجيل الدخول',
  actionFailed: 'فشل الإجراء',
  latestAction: 'آخر إجراء',
  workspaceOverviewEyebrow: 'نظرة عامة على مساحة العمل',
  customerWorkspaceFallback: 'مساحة عمل العميل',
  realtimeActive: 'مزامنة فورية نشطة',
  realtimeReconnecting: 'إعادة الاتصال بالمزامنة الفورية',
  refreshingWorkspace: 'جارٍ التحديث...',
  refreshWorkspace: 'تحديث مساحة العمل',
  workspacesBadgeSuffix: 'مساحات عمل',
  metricInstancesLabel: 'المثيلات',
  metricInstancesHint: 'البصمة الحالية لمساحة العمل',
  metricLinkedLabel: 'الموثقة',
  metricLinkedHint: 'موثّقة وجاهزة',
  metricAttentionLabel: 'تحتاج انتباهًا',
  metricAttentionHint: 'حالات QR أو إعادة المحاولة أو الانقطاع أو الانتهاء',
  metricWorkersLabel: 'العمال',
  metricWorkersHint: 'مثيلات مع توزيع على العمال',
  metricDisconnectedLabel: 'غير متصلة',
  metricDisconnectedHint: 'مثيلات متوقفة أو منقطعة',
  workspaceSlugLabel: 'المعرّف المختصر لمساحة العمل',
  roleLabel: 'الدور',
  activeAccountTokensLabel: 'رموز الحساب النشطة',
  latestWorkspaceEventLabel: 'آخر حدث في مساحة العمل',
  unavailable: 'غير متاح',
  createSectionEyebrow: 'إنشاء',
  createSectionTitle: 'إنشاء غلاف مثيل جديد',
  workspaceLabel: 'مساحة العمل',
  workspaceHint:
    'ينتمي كل مثيل إلى مساحة عمل واحدة ويحصل على بيانات اعتماده العامة الخاصة به.',
  instanceNameLabel: 'اسم المثيل',
  instanceNameHint:
    'استخدم اسمًا ثابتًا للمشغلين ومستندات API والدعم التشغيلي.',
  creatingInstance: 'جارٍ إنشاء المثيل...',
  createInstance: 'إنشاء مثيل',
  accountApiEyebrow: 'واجهة API للحساب',
  accountApiTitle: 'رموز API الخاصة بمساحة العمل',
  tokenWorkspaceHint: 'تبقى رموز API الخاصة بالحساب ضمن مساحة العمل المحددة.',
  tokenNameLabel: 'اسم الرمز',
  creatingToken: 'جارٍ إنشاء الرمز...',
  createAccountApiToken: 'إنشاء رمز API للحساب',
  readonlyWorkspaceTitle: 'مساحة عمل للقراءة فقط',
  readonlyWorkspaceBody:
    'لا يمكن إنشاء رموز API للحساب أو تدويرها إلا للمالك أو المسؤولين.',
  latestAccountTokenTitle: 'آخر رمز API للحساب',
  latestAccountTokenBody:
    'احفظ هذا الرمز الآن. لا يعاد كاملًا إلا عند إنشائه أو تدويره.',
  noAccountTokens: 'لم يتم إنشاء أي رموز API للحساب في هذه المساحة بعد.',
  revoked: 'ملغى',
  active: 'نشط',
  prefixLabel: 'البادئة',
  createdLabel: 'أُنشئ',
  lastUsedLabel: 'آخر استخدام',
  workspaceRowLabel: 'مساحة العمل',
  rotating: 'جارٍ التدوير...',
  rotate: 'تدوير',
  developerApiEyebrow: 'واجهة API للمطور',
  selectedInstanceAccessTitle: 'وصول المثيل المحدد',
  latestEventLabel: 'آخر حدث',
  openRuntimeDetail: 'افتح تفاصيل التشغيل',
  openConversations: 'افتح المحادثات',
  scanQr: 'مسح QR',
  noInstanceSelectedTitle: 'لم يتم تحديد مثيل',
  noInstanceSelectedBody:
    'أنشئ مثيلًا لإظهار بيانات الاعتماد العامة وعناصر التحكم التشغيلية من شِلّ العميل.',
  runtimeEyebrow: 'التشغيل',
  operationalModelTitle: 'النموذج التشغيلي',
  queueAwareStatesLabel: 'حالات تراعي الطابور',
  queueAwareStatesValue: (count: number) =>
    `عدد المثيلات التي تحتاج انتباهًا: ${count}`,
  queueAwareStatesEmpty: 'لا توجد حالات تحتاج إلى انتباه الآن',
  workerPlacementLabel: 'توزيع العمال',
  workerPlacementValue: (count: number) =>
    `عدد التعيينات النشطة للعمال: ${count}`,
  workerPlacementEmpty: 'لا توجد تعيينات للعمال بعد',
  instanceDetailRouteLabel: 'مسار تفاصيل المثيل',
  selectInstance: 'اختر مثيلًا',
  apiDocsRouteLabel: 'مسار مستندات API',
  runtimeParagraph:
    'استخدم لوحة التحكم للإنشاء وتدفق بيانات الاعتماد، ثم انتقل إلى صفحات تفاصيل التشغيل لإجراءات دورة الحياة واستعادة الطابور وفحص Webhook.',
  instancesEyebrow: 'المثيلات',
  workspaceInstancesTitle: (count: number) => `مثيلات مساحة العمل (${count})`,
  noInstances: 'لم يتم إنشاء أي مثيلات في هذه المساحة بعد.',
  workerLabel: 'العامل:',
  unassigned: 'غير مخصص',
  latestEventRowLabel: 'آخر حدث',
  normalDelayLabel: 'التأخير العادي',
  highQueueDelayLabel: 'تأخير الطابور العالي',
  selected: 'محدد',
  select: 'اختيار',
  couldNotReachApi: 'تعذر الوصول إلى واجهة برمجة تطبيقات العميل.',
  couldNotLoadDashboard: 'تعذر تحميل لوحة تحكم العميل.',
  couldNotLoadWorkspaceTokens:
    'تعذر تحميل رموز API للحساب لمساحة العمل المحددة.',
  selectWorkspaceBeforeInstance: 'اختر مساحة عمل قبل إنشاء مثيل.',
  instanceCreationFailed: 'فشل إنشاء المثيل.',
  createdInstanceMessage: (name: string) =>
    `تم إنشاء ${name} وإصدار رمز API جديد للمثيل.`,
  selectWorkspaceBeforeToken: 'اختر مساحة عمل قبل إنشاء رمز API للحساب.',
  accountTokenCreationFailed: 'فشل إنشاء رمز API للحساب.',
  createdAccountTokenMessage: (prefix: string) =>
    `تم إنشاء رمز API للحساب ${prefix}.`,
  accountTokenRotationFailed: 'فشل تدوير رمز API للحساب.',
  rotatedAccountTokenMessage: (prefix: string) =>
    `تم تدوير رمز API للحساب ${prefix}.`,
  customerSessionMissing: 'جلسة العميل مفقودة أو منتهية الصلاحية.',
  defaultAccountTokenName: 'رمز مساحة العمل الأساسي',
} as const;

export function CustomerDashboardPage() {
  const { locale } = useCustomerLocale();
  const text = (english: string, arabic: string) =>
    locale === 'ar' ? arabic : english;
  const mountedRef = useRef(true);
  const hasLoadedDashboardRef = useRef(false);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountMeResponse | null>(null);
  const [instances, setInstances] = useState<
    ListCustomerInstancesResponse['items']
  >([]);
  const [workspaceId, setWorkspaceId] = useState('');
  const [selectedInstanceId, setSelectedInstanceId] = useState('');
  const [accountApiTokens, setAccountApiTokens] = useState<
    AccountApiTokenSummary[]
  >([]);
  const [instanceName, setInstanceName] = useState('');
  const [accountTokenName, setAccountTokenName] = useState(() =>
    text(
      'Primary workspace token',
      dashboardArabicCopy.defaultAccountTokenName,
    ),
  );
  const [createdInstanceAccess, setCreatedInstanceAccess] =
    useState<StoredInstanceCredentials | null>(null);
  const [createdAccountToken, setCreatedAccountToken] = useState<string | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [instanceSubmitting, setInstanceSubmitting] = useState(false);
  const [accountTokenSubmitting, setAccountTokenSubmitting] = useState<
    string | null
  >(null);
  const [refreshingWorkspace, setRefreshingWorkspace] = useState(false);
  const [realtimeConnected, setRealtimeConnected] = useState(false);

  const selectedWorkspace =
    account?.workspaces.find((workspace) => workspace.id === workspaceId) ??
    account?.workspaces[0] ??
    null;
  const workspaceInstances = useMemo(
    () =>
      instances.filter((instance) =>
        workspaceId ? instance.workspaceId === workspaceId : true,
      ),
    [instances, workspaceId],
  );
  const selectedInstance =
    workspaceInstances.find((instance) => instance.id === selectedInstanceId) ??
    workspaceInstances[0] ??
    null;
  const selectedInstanceAccess =
    selectedInstance &&
    createdInstanceAccess?.instanceId === selectedInstance.id
      ? createdInstanceAccess
      : selectedInstance
        ? readInstanceCredentials(selectedInstance.id)
        : null;
  const authenticatedCount = workspaceInstances.filter(
    (instance) => instance.status === 'authenticated',
  ).length;
  const attentionCount = workspaceInstances.filter((instance) =>
    ['qr', 'retrying', 'disconnected', 'expired'].includes(instance.status),
  ).length;
  const disconnectedCount = workspaceInstances.filter((instance) =>
    ['disconnected', 'stopped', 'expired'].includes(instance.status),
  ).length;
  const assignedWorkerCount = workspaceInstances.filter((instance) =>
    Boolean(instance.assignedWorkerId),
  ).length;
  const activeAccountTokenCount = accountApiTokens.filter(
    (token) => !token.revokedAt,
  ).length;
  const canManageAccountTokens = selectedWorkspace
    ? ['owner', 'admin'].includes(selectedWorkspace.role)
    : false;
  const attentionInstance =
    workspaceInstances.find((instance) =>
      ['qr', 'retrying', 'disconnected', 'expired'].includes(instance.status),
    ) ?? selectedInstance;
  const selectedInstanceHref = selectedInstance
    ? `/instances/${selectedInstance.id}`
    : '#create-instance';
  const nextDashboardAction = !workspaceInstances.length
    ? {
        href: '#create-instance',
        title: text(
          'Create your first WhatsApp instance',
          dashboardArabicCopy.nextActionNoInstanceTitle,
        ),
        body: text(
          'Name the instance first, then open runtime detail to scan the QR code.',
          dashboardArabicCopy.nextActionNoInstanceBody,
        ),
      }
    : attentionCount > 0 && attentionInstance
      ? {
          href: `/instances/${attentionInstance.id}`,
          title: text(
            'Review the instance that needs attention',
            dashboardArabicCopy.nextActionAttentionTitle,
          ),
          body: text(
            'A runtime state needs attention before messaging stays reliable.',
            dashboardArabicCopy.nextActionAttentionBody,
          ),
        }
      : authenticatedCount > 0
        ? {
            href: buildWorkspaceRoute('/messages', workspaceId),
            title: text(
              'Start managing conversations',
              dashboardArabicCopy.nextActionConnectedTitle,
            ),
            body: text(
              'You have a connected instance. Move into conversations and contacts.',
              dashboardArabicCopy.nextActionConnectedBody,
            ),
          }
        : {
            href: selectedInstanceHref,
            title: text(
              'Finish connecting WhatsApp',
              dashboardArabicCopy.nextActionConnectTitle,
            ),
            body: text(
              'Open runtime detail and scan QR to activate sending.',
              dashboardArabicCopy.nextActionConnectBody,
            ),
          };
  const setupSteps = [
    {
      label: text('Workspace', dashboardArabicCopy.setupWorkspace),
      detail: text(
        'Context selected',
        dashboardArabicCopy.setupWorkspaceDetail,
      ),
      state: selectedWorkspace ? 'done' : 'current',
    },
    {
      label: text('Instance', dashboardArabicCopy.setupInstance),
      detail: text('WhatsApp channel', dashboardArabicCopy.setupInstanceDetail),
      state: workspaceInstances.length > 0 ? 'done' : 'current',
    },
    {
      label: text('Connect', dashboardArabicCopy.setupConnect),
      detail: text(
        'QR or active session',
        dashboardArabicCopy.setupConnectDetail,
      ),
      state:
        authenticatedCount > 0
          ? 'done'
          : workspaceInstances.length > 0
            ? 'current'
            : 'next',
    },
    {
      label: text('Send', dashboardArabicCopy.setupSend),
      detail: text('Chats and messages', dashboardArabicCopy.setupSendDetail),
      state: authenticatedCount > 0 ? 'current' : 'next',
    },
  ];

  function handleLoadFailure(message: string) {
    if (!mountedRef.current) {
      return;
    }

    if (pageState === 'ready' || hasLoadedDashboardRef.current || account) {
      setErrorMessage(message);
      return;
    }

    setPageState('unauthenticated');
    setErrorMessage(message);
  }

  function handleBackgroundApiFailure(message: string) {
    if (!mountedRef.current) {
      return;
    }

    if (pageState === 'ready' || hasLoadedDashboardRef.current || account) {
      return;
    }

    setPageState('unauthenticated');
    setErrorMessage(message);
  }

  const loadDashboard = useEffectEvent(async (token: string) => {
    const [me, instancesResponse] = await Promise.all([
      loadCustomerAccount(token).catch(() => null),
      requestWithCustomerRefresh(
        token,
        (bearer) =>
          fetch(`${apiBaseUrl}/api/v1/customer/instances`, {
            headers: {
              authorization: `Bearer ${bearer}`,
            },
            credentials: 'include',
          }),
        setAccessToken,
      ),
    ]);

    if (!me || !instancesResponse) {
      handleBackgroundApiFailure(
        text(
          'Could not reach the customer API.',
          dashboardArabicCopy.couldNotReachApi,
        ),
      );
      return false;
    }

    if (!instancesResponse.ok) {
      handleLoadFailure(
        text(
          'Could not load the customer dashboard.',
          dashboardArabicCopy.couldNotLoadDashboard,
        ),
      );
      return false;
    }

    const payload =
      (await instancesResponse.json()) as ListCustomerInstancesResponse;
    if (!mountedRef.current) {
      return false;
    }

    hasLoadedDashboardRef.current = true;
    setAccessToken(token);
    setAccount(me);
    setInstances(payload.items);
    setWorkspaceId((current) =>
      current && me.workspaces.some((workspace) => workspace.id === current)
        ? current
        : (me.workspaces[0]?.id ?? ''),
    );
    setPageState('ready');
    return true;
  });

  const loadWorkspaceTokens = useEffectEvent(
    async (targetWorkspaceId: string, tokenOverride?: string | null) => {
      if (!targetWorkspaceId) {
        if (mountedRef.current) {
          setAccountApiTokens([]);
        }
        return;
      }

      const response = await requestWithCustomerRefresh(
        tokenOverride ?? accessToken,
        (bearer) =>
          fetch(
            `${apiBaseUrl}/api/v1/account/api-tokens?workspaceId=${encodeURIComponent(targetWorkspaceId)}`,
            {
              headers: {
                authorization: `Bearer ${bearer}`,
              },
              credentials: 'include',
            },
          ),
        setAccessToken,
      );

      if (!response) {
        handleBackgroundApiFailure(
          text(
            'Could not reach the customer API.',
            dashboardArabicCopy.couldNotReachApi,
          ),
        );
        return;
      }

      if (!response.ok) {
        if (mountedRef.current) {
          setErrorMessage(
            text(
              'Could not load account API tokens for the selected workspace.',
              dashboardArabicCopy.couldNotLoadWorkspaceTokens,
            ),
          );
        }
        return;
      }

      const payload = (await response.json()) as ListAccountApiTokensResponse;
      if (mountedRef.current) {
        setAccountApiTokens(payload.items);
      }
    },
  );

  const reloadDashboard = useEffectEvent(async () => {
    if (!mountedRef.current) {
      return;
    }

    setRefreshingWorkspace(true);
    try {
      const storedToken = accessToken ?? readStoredToken();
      if (storedToken) {
        const loaded = await loadDashboard(storedToken);
        if (loaded) {
          return;
        }

        if (hasLoadedDashboardRef.current) {
          return;
        }
      }

      const refreshed = await refreshCustomerAccessToken(setAccessToken);
      if (!refreshed) {
        handleBackgroundApiFailure(
          text(
            'The customer session is missing or expired.',
            dashboardArabicCopy.customerSessionMissing,
          ),
        );
        return;
      }

      await loadDashboard(refreshed);
    } finally {
      if (mountedRef.current) {
        setRefreshingWorkspace(false);
      }
    }
  });

  useEffect(() => {
    mountedRef.current = true;
    void (async () => {
      setErrorMessage(null);

      const storedToken = readStoredToken();
      if (storedToken) {
        const loaded = await loadDashboard(storedToken);
        if (loaded) {
          return;
        }

        if (hasLoadedDashboardRef.current) {
          return;
        }
      }

      const refreshed = await refreshCustomerAccessToken(setAccessToken);
      if (!refreshed) {
        if (mountedRef.current) {
          setPageState('unauthenticated');
        }
        return;
      }

      await loadDashboard(refreshed);
    })();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!workspaceInstances.length) {
      setSelectedInstanceId('');
      return;
    }

    if (
      workspaceInstances.some((instance) => instance.id === selectedInstanceId)
    ) {
      return;
    }

    setSelectedInstanceId(workspaceInstances[0]!.id);
  }, [selectedInstanceId, workspaceInstances]);

  useEffect(() => {
    if (pageState !== 'ready' || !workspaceId) {
      return;
    }

    void loadWorkspaceTokens(workspaceId);
  }, [pageState, workspaceId]);

  useEffect(() => {
    if (pageState !== 'ready' || process.env.NODE_ENV === 'test') {
      return;
    }

    const socket = io(apiBaseUrl, {
      path: '/socket.io',
      transports: ['polling'],
      withCredentials: true,
    });

    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    const scheduleRefresh = () => {
      if (refreshTimer) {
        return;
      }

      refreshTimer = setTimeout(() => {
        refreshTimer = null;
        void reloadDashboard();
      }, 250);
    };

    socket.on('connect', () => {
      setRealtimeConnected(true);
    });
    socket.on('disconnect', () => {
      setRealtimeConnected(false);
    });
    Object.values(websocketEventNames).forEach((eventName) => {
      socket.on(eventName, scheduleRefresh);
    });

    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }

      Object.values(websocketEventNames).forEach((eventName) => {
        socket.off(eventName, scheduleRefresh);
      });
      socket.disconnect();
      setRealtimeConnected(false);
    };
  }, [pageState]);

  async function logout() {
    await logoutCustomerSession();
    if (!mountedRef.current) {
      return;
    }

    setPageState('unauthenticated');
    setAccessToken(null);
    setAccount(null);
    setInstances([]);
    setAccountApiTokens([]);
    setWorkspaceId('');
    setSelectedInstanceId('');
    setCreatedInstanceAccess(null);
    setCreatedAccountToken(null);
    setStatusMessage(null);
    setErrorMessage(null);
    hasLoadedDashboardRef.current = false;
  }

  async function createInstance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!workspaceId) {
      setErrorMessage(
        text(
          'Select a workspace before creating an instance.',
          dashboardArabicCopy.selectWorkspaceBeforeInstance,
        ),
      );
      return;
    }

    setInstanceSubmitting(true);
    setErrorMessage(null);
    setStatusMessage(null);
    setCreatedAccountToken(null);

    try {
      const response = await requestWithCustomerRefresh(
        accessToken,
        (bearer) =>
          fetch(`${apiBaseUrl}/api/v1/customer/instances`, {
            method: 'POST',
            headers: {
              authorization: `Bearer ${bearer}`,
              'content-type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              workspaceId,
              name: instanceName.trim(),
            }),
          }),
        setAccessToken,
      );

      if (!response) {
        handleLoadFailure(
          text(
            'Could not reach the customer API.',
            dashboardArabicCopy.couldNotReachApi,
          ),
        );
        return;
      }

      if (!response.ok) {
        setErrorMessage(
          text(
            'Instance creation failed.',
            dashboardArabicCopy.instanceCreationFailed,
          ),
        );
        return;
      }

      const payload = (await response.json()) as CreateInstanceResponse;
      const nextAccess: StoredInstanceCredentials = {
        instanceId: payload.instance.id,
        publicId: payload.instance.publicId,
        instanceName: payload.instance.name,
        token: payload.instanceApiToken,
        updatedAt: new Date().toISOString(),
        source: 'created',
      };

      storeInstanceCredentials(nextAccess);
      if (!mountedRef.current) {
        return;
      }

      setCreatedInstanceAccess(nextAccess);
      setSelectedInstanceId(payload.instance.id);
      setInstanceName('');
      setStatusMessage(
        dashboardArabicCopy.createdInstanceMessage(payload.instance.name),
      );
      await reloadDashboard();
    } finally {
      if (mountedRef.current) {
        setInstanceSubmitting(false);
      }
    }
  }

  async function createAccountToken(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!workspaceId) {
      setErrorMessage(
        text(
          'Select a workspace before creating an account API token.',
          dashboardArabicCopy.selectWorkspaceBeforeToken,
        ),
      );
      return;
    }

    setAccountTokenSubmitting('create');
    setErrorMessage(null);
    setStatusMessage(null);
    setCreatedInstanceAccess(null);

    try {
      const response = await requestWithCustomerRefresh(
        accessToken,
        (bearer) =>
          fetch(`${apiBaseUrl}/api/v1/account/api-tokens`, {
            method: 'POST',
            headers: {
              authorization: `Bearer ${bearer}`,
              'content-type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              workspaceId,
              name: accountTokenName.trim(),
            }),
          }),
        setAccessToken,
      );

      if (!response) {
        handleLoadFailure(
          text(
            'Could not reach the customer API.',
            dashboardArabicCopy.couldNotReachApi,
          ),
        );
        return;
      }

      if (!response.ok) {
        setErrorMessage(
          text(
            'Account API token creation failed.',
            dashboardArabicCopy.accountTokenCreationFailed,
          ),
        );
        return;
      }

      const payload = (await response.json()) as CreateAccountApiTokenResponse;
      if (!mountedRef.current) {
        return;
      }

      setCreatedAccountToken(payload.token);
      setStatusMessage(
        dashboardArabicCopy.createdAccountTokenMessage(payload.summary.prefix),
      );
      await loadWorkspaceTokens(workspaceId);
    } finally {
      if (mountedRef.current) {
        setAccountTokenSubmitting(null);
      }
    }
  }

  async function rotateAccountToken(tokenId: string) {
    setAccountTokenSubmitting(`rotate:${tokenId}`);
    setErrorMessage(null);
    setStatusMessage(null);
    setCreatedInstanceAccess(null);

    try {
      const response = await requestWithCustomerRefresh(
        accessToken,
        (bearer) =>
          fetch(`${apiBaseUrl}/api/v1/account/api-tokens/${tokenId}/rotate`, {
            method: 'POST',
            headers: {
              authorization: `Bearer ${bearer}`,
            },
            credentials: 'include',
          }),
        setAccessToken,
      );

      if (!response) {
        handleLoadFailure(
          text(
            'Could not reach the customer API.',
            dashboardArabicCopy.couldNotReachApi,
          ),
        );
        return;
      }

      if (!response.ok) {
        setErrorMessage(
          text(
            'Account API token rotation failed.',
            dashboardArabicCopy.accountTokenRotationFailed,
          ),
        );
        return;
      }

      const payload = (await response.json()) as CreateAccountApiTokenResponse;
      if (!mountedRef.current) {
        return;
      }

      setCreatedAccountToken(payload.token);
      setStatusMessage(
        dashboardArabicCopy.rotatedAccountTokenMessage(payload.summary.prefix),
      );
      await loadWorkspaceTokens(workspaceId);
    } finally {
      if (mountedRef.current) {
        setAccountTokenSubmitting(null);
      }
    }
  }

  return (
    <AppShell
      title={text('Customer Dashboard', dashboardArabicCopy.pageTitle)}
      subtitle={text(
        'Operate workspace onboarding, API credentials, and runtime visibility from the authenticated customer shell.',
        dashboardArabicCopy.pageSubtitle,
      )}
      breadcrumbLabel={text('Dashboard', dashboardArabicCopy.breadcrumbLabel)}
      surface="customer"
      labels={getCustomerShellLabels(locale)}
      nav={
        pageState === 'ready' && account ? (
          <CustomerNav
            current="dashboard"
            account={account}
            workspaceId={workspaceId}
          />
        ) : undefined
      }
      meta={
        pageState === 'ready' && account ? (
          <CustomerTopbarAnnouncement
            eyebrow={text('API onboarding', dashboardArabicCopy.topbarEyebrow)}
            message={text(
              'Create instance credentials here, then move straight into the public API documents and runtime detail routes.',
              dashboardArabicCopy.topbarMessage,
            )}
            linkLabel={text(
              'Open API documents',
              dashboardArabicCopy.topbarLinkLabel,
            )}
            linkHref={buildWorkspaceRoute('/api-documents', workspaceId)}
          />
        ) : undefined
      }
      headerActions={
        pageState === 'ready' && account ? (
          <CustomerWorkspaceControls
            account={account}
            workspaceId={workspaceId}
            onWorkspaceChange={setWorkspaceId}
            onLogout={logout}
          />
        ) : undefined
      }
      footer={
        <Link href={buildWorkspaceRoute('/messages', workspaceId)}>
          {text('Open message explorer', dashboardArabicCopy.footerLinkLabel)}
        </Link>
      }
    >
      {pageState === 'loading' ? (
        <LoadingState
          title={text(
            'Loading customer dashboard',
            dashboardArabicCopy.loadingTitle,
          )}
          description={text(
            'Refreshing the customer session and loading the current workspace state.',
            dashboardArabicCopy.loadingMessage,
          )}
        />
      ) : null}

      {pageState === 'unauthenticated' ? (
        <InfoCard
          eyebrow={text('Session', dashboardArabicCopy.sessionEyebrow)}
          title={text(
            'Sign in required',
            dashboardArabicCopy.signInRequiredTitle,
          )}
        >
          <p style={{ marginTop: 0 }}>
            {text(
              'The customer session is missing or expired.',
              dashboardArabicCopy.signInRequiredBody,
            )}
          </p>
          <p style={{ marginBottom: 0 }}>
            <Link href="/signin">
              {text(
                'Return to sign in',
                dashboardArabicCopy.signInRequiredLink,
              )}
            </Link>
          </p>
        </InfoCard>
      ) : null}

      {pageState === 'ready' && account ? (
        <>
          {errorMessage ? (
            <NoticeBanner
              title={text('Action failed', dashboardArabicCopy.actionFailed)}
              tone="danger"
            >
              <p style={{ margin: 0 }}>{errorMessage}</p>
            </NoticeBanner>
          ) : null}

          {statusMessage ? (
            <NoticeBanner
              title={text('Latest action', dashboardArabicCopy.latestAction)}
              tone="success"
            >
              <p style={{ margin: 0 }}>{statusMessage}</p>
            </NoticeBanner>
          ) : null}

          <section className="elite-customer-dashboard-hero">
            <div className="elite-customer-dashboard-hero-copy">
              <p className="elite-customer-dashboard-kicker">
                {text('Command center', dashboardArabicCopy.heroEyebrow)}
              </p>
              <h2>
                {text(
                  'Start conversations with confidence faster',
                  dashboardArabicCopy.heroTitle,
                )}
              </h2>
              <p>
                {text(
                  'Track WhatsApp connection, open conversations, manage contacts, and create API credentials from one clear workspace view.',
                  dashboardArabicCopy.heroBody,
                )}
              </p>
              <div className="elite-customer-dashboard-hero-actions">
                <Link
                  className="elite-customer-dashboard-action"
                  data-variant="primary"
                  href={buildWorkspaceRoute('/messages', workspaceId)}
                >
                  {text(
                    'Open conversations',
                    dashboardArabicCopy.heroPrimaryAction,
                  )}
                </Link>
                <Link
                  className="elite-customer-dashboard-action"
                  href={buildWorkspaceRoute('/contacts', workspaceId)}
                >
                  {text(
                    'Manage contacts',
                    dashboardArabicCopy.heroSecondaryAction,
                  )}
                </Link>
                <Link
                  className="elite-customer-dashboard-action"
                  href={buildWorkspaceRoute('/api-documents', workspaceId)}
                >
                  {text('API docs', dashboardArabicCopy.heroTertiaryAction)}
                </Link>
              </div>
              <div className="elite-customer-dashboard-metric-strip">
                <div>
                  <span>
                    {text(
                      'Instances',
                      dashboardArabicCopy.metricInstancesLabel,
                    )}
                  </span>
                  <strong>{workspaceInstances.length}</strong>
                </div>
                <div>
                  <span>
                    {text('Linked', dashboardArabicCopy.metricLinkedLabel)}
                  </span>
                  <strong>{authenticatedCount}</strong>
                </div>
                <div>
                  <span>
                    {text(
                      'Attention',
                      dashboardArabicCopy.metricAttentionLabel,
                    )}
                  </span>
                  <strong>{attentionCount}</strong>
                </div>
                <div>
                  <span>
                    {text(
                      'Active tokens',
                      dashboardArabicCopy.activeAccountTokensLabel,
                    )}
                  </span>
                  <strong>{activeAccountTokenCount}</strong>
                </div>
              </div>
            </div>

            <aside className="elite-customer-dashboard-next">
              <div>
                <span>
                  {text(
                    'Best next step',
                    dashboardArabicCopy.nextActionEyebrow,
                  )}
                </span>
                <h3>{nextDashboardAction.title}</h3>
                <p>{nextDashboardAction.body}</p>
                <Link href={nextDashboardAction.href}>
                  {text('Do this step', dashboardArabicCopy.nextActionOpen)}
                </Link>
              </div>
              <div className="elite-customer-dashboard-setup">
                <strong>
                  {text('Setup path', dashboardArabicCopy.setupPathTitle)}
                </strong>
                <ol>
                  {setupSteps.map((step) => (
                    <li key={step.label} data-state={step.state}>
                      <span>{step.label}</span>
                      <small>{step.detail}</small>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </section>

          <InfoCard
            className="elite-customer-dashboard-quick-card"
            eyebrow={text('Shortcuts', dashboardArabicCopy.quickActionsEyebrow)}
            title={text('Daily work', dashboardArabicCopy.quickActionsTitle)}
            density="compact"
          >
            <div className="elite-customer-dashboard-quick-grid">
              <Link href={buildWorkspaceRoute('/messages', workspaceId)}>
                <span>01</span>
                <strong>
                  {text(
                    'Conversations',
                    dashboardArabicCopy.quickConversationsTitle,
                  )}
                </strong>
                <p>
                  {text(
                    'Review recent conversations in the Telegram-style inbox.',
                    dashboardArabicCopy.quickConversationsBody,
                  )}
                </p>
                <small>{text('Open', dashboardArabicCopy.quickOpen)}</small>
              </Link>
              <Link href={buildWorkspaceRoute('/contacts', workspaceId)}>
                <span>02</span>
                <strong>
                  {text('Contacts', dashboardArabicCopy.quickContactsTitle)}
                </strong>
                <p>
                  {text(
                    'Search customers and connect them to conversations quickly.',
                    dashboardArabicCopy.quickContactsBody,
                  )}
                </p>
                <small>{text('Open', dashboardArabicCopy.quickOpen)}</small>
              </Link>
              <Link href={selectedInstanceHref}>
                <span>03</span>
                <strong>
                  {text(
                    'WhatsApp runtime',
                    dashboardArabicCopy.quickRuntimeTitle,
                  )}
                </strong>
                <p>
                  {text(
                    'Open QR, connection state, and instance operations.',
                    dashboardArabicCopy.quickRuntimeBody,
                  )}
                </p>
                <small>{text('Open', dashboardArabicCopy.quickOpen)}</small>
              </Link>
              <Link href={buildWorkspaceRoute('/api-documents', workspaceId)}>
                <span>04</span>
                <strong>
                  {text('API', dashboardArabicCopy.quickApiTitle)}
                </strong>
                <p>
                  {text(
                    'Review endpoints and credentials needed for integration.',
                    dashboardArabicCopy.quickApiBody,
                  )}
                </p>
                <small>{text('Open', dashboardArabicCopy.quickOpen)}</small>
              </Link>
            </div>
          </InfoCard>

          <InfoCard
            className="elite-customer-dashboard-overview"
            eyebrow={text(
              'Workspace overview',
              dashboardArabicCopy.workspaceOverviewEyebrow,
            )}
            title={
              selectedWorkspace
                ? selectedWorkspace.name
                : text(
                    'Customer workspace',
                    dashboardArabicCopy.customerWorkspaceFallback,
                  )
            }
            action={
              <div className="elite-toolbar">
                <StatusBadge tone={realtimeConnected ? 'success' : 'neutral'}>
                  {realtimeConnected
                    ? text(
                        'Realtime sync active',
                        dashboardArabicCopy.realtimeActive,
                      )
                    : text(
                        'Realtime sync reconnecting',
                        dashboardArabicCopy.realtimeReconnecting,
                      )}
                </StatusBadge>
                <ActionButton
                  type="button"
                  tone="secondary"
                  size="compact"
                  onClick={() => void reloadDashboard()}
                  disabled={refreshingWorkspace}
                >
                  {refreshingWorkspace
                    ? text(
                        'Refreshing...',
                        dashboardArabicCopy.refreshingWorkspace,
                      )
                    : text(
                        'Refresh workspace',
                        dashboardArabicCopy.refreshWorkspace,
                      )}
                </ActionButton>
              </div>
            }
          >
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <StatusBadge tone="info">
                  {account.user.displayName}
                </StatusBadge>
                <StatusBadge tone="neutral">{account.user.email}</StatusBadge>
                <StatusBadge tone="neutral">
                  {locale === 'ar'
                    ? `${account.workspaces.length} ${dashboardArabicCopy.workspacesBadgeSuffix}`
                    : `${account.workspaces.length} workspaces`}
                </StatusBadge>
                {selectedWorkspace ? (
                  <StatusBadge tone="neutral">
                    {translateCustomerEnum(locale, selectedWorkspace.role)}
                  </StatusBadge>
                ) : null}
              </div>

              <MetricGrid minItemWidth={170}>
                <MetricCard
                  label={text(
                    'Instances',
                    dashboardArabicCopy.metricInstancesLabel,
                  )}
                  value={workspaceInstances.length}
                  hint={text(
                    'Current workspace footprint',
                    dashboardArabicCopy.metricInstancesHint,
                  )}
                />
                <MetricCard
                  label={text('Linked', dashboardArabicCopy.metricLinkedLabel)}
                  value={authenticatedCount}
                  hint={text(
                    'Authenticated and ready',
                    dashboardArabicCopy.metricLinkedHint,
                  )}
                  tone="success"
                />
                <MetricCard
                  label={text(
                    'Attention',
                    dashboardArabicCopy.metricAttentionLabel,
                  )}
                  value={attentionCount}
                  hint={text(
                    'QR, retry, disconnect, or expiry',
                    dashboardArabicCopy.metricAttentionHint,
                  )}
                  tone={attentionCount > 0 ? 'warning' : 'neutral'}
                />
                <MetricCard
                  label={text(
                    'Disconnected',
                    dashboardArabicCopy.metricDisconnectedLabel,
                  )}
                  value={disconnectedCount}
                  hint={text(
                    'Stopped or disconnected instances',
                    dashboardArabicCopy.metricDisconnectedHint,
                  )}
                  tone={disconnectedCount > 0 ? 'danger' : 'neutral'}
                />
                <MetricCard
                  label={text(
                    'Workers',
                    dashboardArabicCopy.metricWorkersLabel,
                  )}
                  value={assignedWorkerCount}
                  hint={text(
                    'Instances with worker placement',
                    dashboardArabicCopy.metricWorkersHint,
                  )}
                />
              </MetricGrid>

              <DefinitionGrid
                minItemWidth={180}
                items={[
                  {
                    label: text(
                      'Workspace slug',
                      dashboardArabicCopy.workspaceSlugLabel,
                    ),
                    value:
                      selectedWorkspace?.slug ??
                      text('Unavailable', dashboardArabicCopy.unavailable),
                  },
                  {
                    label: text('Role', dashboardArabicCopy.roleLabel),
                    value: selectedWorkspace
                      ? translateCustomerEnum(locale, selectedWorkspace.role)
                      : text('Unavailable', dashboardArabicCopy.unavailable),
                  },
                  {
                    label: text(
                      'Active account tokens',
                      dashboardArabicCopy.activeAccountTokensLabel,
                    ),
                    value: String(activeAccountTokenCount),
                  },
                  {
                    label: text(
                      'Latest workspace event',
                      dashboardArabicCopy.latestWorkspaceEventLabel,
                    ),
                    value: formatCustomerDate(
                      locale,
                      workspaceInstances[0]?.latestEventAt ?? null,
                    ),
                  },
                ]}
              />
            </div>
          </InfoCard>

          <SectionGrid minItemWidth={340}>
            <InfoCard
              id="create-instance"
              className="elite-customer-dashboard-create-card"
              eyebrow={text('Create', dashboardArabicCopy.createSectionEyebrow)}
              title={text(
                'Create a new instance shell',
                dashboardArabicCopy.createSectionTitle,
              )}
            >
              <form
                onSubmit={createInstance}
                style={{ display: 'grid', gap: 16 }}
              >
                <Field
                  label={text('Workspace', dashboardArabicCopy.workspaceLabel)}
                  hint={text(
                    'Each instance belongs to one workspace and receives its own public credentials.',
                    dashboardArabicCopy.workspaceHint,
                  )}
                >
                  <SelectInput
                    value={workspaceId}
                    onChange={(event) => setWorkspaceId(event.target.value)}
                    required
                  >
                    {account.workspaces.map((workspace) => (
                      <option key={workspace.id} value={workspace.id}>
                        {workspace.name} (
                        {translateCustomerEnum(locale, workspace.role)})
                      </option>
                    ))}
                  </SelectInput>
                </Field>

                <Field
                  label={text(
                    'Instance name',
                    dashboardArabicCopy.instanceNameLabel,
                  )}
                  hint={text(
                    'Use a stable name for operators, API docs, and runtime support.',
                    dashboardArabicCopy.instanceNameHint,
                  )}
                >
                  <TextInput
                    value={instanceName}
                    onChange={(event) => setInstanceName(event.target.value)}
                    minLength={2}
                    maxLength={80}
                    required
                  />
                </Field>

                <ActionButton type="submit" disabled={instanceSubmitting}>
                  {instanceSubmitting
                    ? text(
                        'Creating instance...',
                        dashboardArabicCopy.creatingInstance,
                      )
                    : text(
                        'Create instance',
                        dashboardArabicCopy.createInstance,
                      )}
                </ActionButton>
              </form>
            </InfoCard>

            <InfoCard
              className="elite-customer-dashboard-token-card"
              eyebrow={text(
                'Account API',
                dashboardArabicCopy.accountApiEyebrow,
              )}
              title={text(
                'Workspace API tokens',
                dashboardArabicCopy.accountApiTitle,
              )}
            >
              <form
                onSubmit={createAccountToken}
                style={{ display: 'grid', gap: 16 }}
              >
                <Field
                  label={text('Workspace', dashboardArabicCopy.workspaceLabel)}
                  hint={text(
                    'Account API tokens remain scoped to the selected workspace.',
                    dashboardArabicCopy.tokenWorkspaceHint,
                  )}
                >
                  <SelectInput
                    value={workspaceId}
                    onChange={(event) => setWorkspaceId(event.target.value)}
                    required
                  >
                    {account.workspaces.map((workspace) => (
                      <option key={workspace.id} value={workspace.id}>
                        {workspace.name} (
                        {translateCustomerEnum(locale, workspace.role)})
                      </option>
                    ))}
                  </SelectInput>
                </Field>

                <Field
                  label={text('Token name', dashboardArabicCopy.tokenNameLabel)}
                >
                  <TextInput
                    value={accountTokenName}
                    onChange={(event) =>
                      setAccountTokenName(event.target.value)
                    }
                    minLength={2}
                    maxLength={80}
                    required
                  />
                </Field>

                <ActionButton
                  type="submit"
                  disabled={
                    accountTokenSubmitting !== null || !canManageAccountTokens
                  }
                >
                  {accountTokenSubmitting === 'create'
                    ? text(
                        'Creating token...',
                        dashboardArabicCopy.creatingToken,
                      )
                    : text(
                        'Create account API token',
                        dashboardArabicCopy.createAccountApiToken,
                      )}
                </ActionButton>
              </form>

              {!canManageAccountTokens ? (
                <NoticeBanner
                  title={text(
                    'Read-only workspace',
                    dashboardArabicCopy.readonlyWorkspaceTitle,
                  )}
                  tone="warning"
                >
                  <p style={{ margin: 0 }}>
                    {text(
                      'Only owner or admin memberships can create or rotate account API tokens.',
                      dashboardArabicCopy.readonlyWorkspaceBody,
                    )}
                  </p>
                </NoticeBanner>
              ) : null}

              {createdAccountToken ? (
                <NoticeBanner
                  title={text(
                    'Latest account API token',
                    dashboardArabicCopy.latestAccountTokenTitle,
                  )}
                  tone="success"
                >
                  <p style={{ marginTop: 0 }}>
                    {text(
                      'Store this token now. It is only returned in full when created or rotated.',
                      dashboardArabicCopy.latestAccountTokenBody,
                    )}
                  </p>
                  <p style={{ marginBottom: 0, overflowWrap: 'anywhere' }}>
                    <code>{createdAccountToken}</code>
                  </p>
                </NoticeBanner>
              ) : null}

              {accountApiTokens.length === 0 ? (
                <p style={{ margin: 0 }}>
                  {text(
                    'No account API tokens have been created for this workspace yet.',
                    dashboardArabicCopy.noAccountTokens,
                  )}
                </p>
              ) : (
                <ul className="elite-list">
                  {accountApiTokens.map((token) => {
                    const rotateState = `rotate:${token.id}`;
                    return (
                      <li key={token.id} className="elite-list-item">
                        <div className="elite-list-title">
                          <span>{token.name}</span>
                          <StatusBadge
                            tone={token.revokedAt ? 'neutral' : 'success'}
                          >
                            {token.revokedAt
                              ? text('Revoked', dashboardArabicCopy.revoked)
                              : text('Active', dashboardArabicCopy.active)}
                          </StatusBadge>
                        </div>
                        <div className="elite-list-meta">
                          <span>
                            {text('Prefix', dashboardArabicCopy.prefixLabel)}{' '}
                            {token.prefix}
                          </span>
                          <span>
                            {text('Created', dashboardArabicCopy.createdLabel)}{' '}
                            {formatCustomerDate(locale, token.createdAt)}
                          </span>
                          <span>
                            {text(
                              'Last used',
                              dashboardArabicCopy.lastUsedLabel,
                            )}{' '}
                            {formatCustomerDate(locale, token.lastUsedAt)}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 12,
                            alignItems: 'center',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span>
                            {text(
                              'Workspace',
                              dashboardArabicCopy.workspaceRowLabel,
                            )}{' '}
                            {selectedWorkspace?.name ?? token.workspaceId}
                          </span>
                          <ActionButton
                            type="button"
                            tone="secondary"
                            size="compact"
                            disabled={
                              Boolean(token.revokedAt) ||
                              !canManageAccountTokens ||
                              accountTokenSubmitting !== null
                            }
                            onClick={() => {
                              void rotateAccountToken(token.id);
                            }}
                          >
                            {accountTokenSubmitting === rotateState
                              ? text(
                                  'Rotating...',
                                  dashboardArabicCopy.rotating,
                                )
                              : text('Rotate', dashboardArabicCopy.rotate)}
                          </ActionButton>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </InfoCard>
          </SectionGrid>

          <SectionGrid minItemWidth={340}>
            {selectedInstance ? (
              <InstanceApiAccessCard
                eyebrow={text(
                  'Developer API',
                  dashboardArabicCopy.developerApiEyebrow,
                )}
                title={text(
                  'Selected instance access',
                  dashboardArabicCopy.selectedInstanceAccessTitle,
                )}
                instanceId={selectedInstance.id}
                publicId={selectedInstance.publicId}
                instanceName={selectedInstance.name}
                token={selectedInstanceAccess?.token ?? null}
                connected={selectedInstance.status === 'authenticated'}
                lastAuthenticatedAt={selectedInstance.latestEventAt}
                lastStatusLabel={text(
                  'Latest event',
                  dashboardArabicCopy.latestEventLabel,
                )}
                detailHref={`/instances/${selectedInstance.id}`}
                action={
                  <Link href={`/instances/${selectedInstance.id}`}>
                    <ActionButton type="button" tone="secondary" size="compact">
                      {text(
                        'Open runtime detail',
                        dashboardArabicCopy.openRuntimeDetail,
                      )}
                    </ActionButton>
                  </Link>
                }
              />
            ) : (
              <InfoCard
                eyebrow={text(
                  'Developer API',
                  dashboardArabicCopy.developerApiEyebrow,
                )}
                title={text(
                  'No instance selected',
                  dashboardArabicCopy.noInstanceSelectedTitle,
                )}
              >
                <p style={{ margin: 0 }}>
                  {text(
                    'Create an instance to expose public credentials and runtime controls from the customer shell.',
                    dashboardArabicCopy.noInstanceSelectedBody,
                  )}
                </p>
              </InfoCard>
            )}

            <InfoCard
              eyebrow={text('Runtime', dashboardArabicCopy.runtimeEyebrow)}
              title={text(
                'Operational model',
                dashboardArabicCopy.operationalModelTitle,
              )}
            >
              <DefinitionGrid
                minItemWidth={180}
                items={[
                  {
                    label: text(
                      'Queue-aware states',
                      dashboardArabicCopy.queueAwareStatesLabel,
                    ),
                    value:
                      attentionCount > 0
                        ? dashboardArabicCopy.queueAwareStatesValue(
                            attentionCount,
                          )
                        : dashboardArabicCopy.queueAwareStatesEmpty,
                  },
                  {
                    label: text(
                      'Worker placement',
                      dashboardArabicCopy.workerPlacementLabel,
                    ),
                    value:
                      assignedWorkerCount > 0
                        ? dashboardArabicCopy.workerPlacementValue(
                            assignedWorkerCount,
                          )
                        : dashboardArabicCopy.workerPlacementEmpty,
                  },
                  {
                    label: text(
                      'Instance detail route',
                      dashboardArabicCopy.instanceDetailRouteLabel,
                    ),
                    value: selectedInstance
                      ? `/instances/${selectedInstance.id}`
                      : text(
                          'Select an instance',
                          dashboardArabicCopy.selectInstance,
                        ),
                  },
                  {
                    label: text(
                      'API docs route',
                      dashboardArabicCopy.apiDocsRouteLabel,
                    ),
                    value: buildWorkspaceRoute('/api-documents', workspaceId),
                  },
                ]}
              />
              <p style={{ marginBottom: 0 }}>
                {text(
                  'Use the dashboard for creation and credential flow, then move into runtime detail pages for lifecycle actions, queue recovery, and webhook inspection.',
                  dashboardArabicCopy.runtimeParagraph,
                )}
              </p>
            </InfoCard>
          </SectionGrid>

          <InfoCard
            className="elite-customer-dashboard-instances-card"
            eyebrow={text('Instances', dashboardArabicCopy.instancesEyebrow)}
            title={dashboardArabicCopy.workspaceInstancesTitle(
              workspaceInstances.length,
            )}
          >
            {workspaceInstances.length === 0 ? (
              <p style={{ margin: 0 }}>
                {text(
                  'No instances have been created in this workspace yet.',
                  dashboardArabicCopy.noInstances,
                )}
              </p>
            ) : (
              <div
                className="elite-customer-dashboard-instance-grid"
                style={{ '--elite-grid-min': '260px' } as CSSProperties}
              >
                {workspaceInstances.map((instance: InstanceSummary) => (
                  <article
                    key={instance.id}
                    className="elite-customer-dashboard-instance-card"
                    data-status={instance.status}
                    data-selected={
                      selectedInstanceId === instance.id ? 'true' : 'false'
                    }
                  >
                    <div className="elite-customer-dashboard-instance-header">
                      <div className="elite-customer-dashboard-instance-avatar">
                        {instance.name.trim().charAt(0).toUpperCase() || 'W'}
                      </div>
                      <div className="elite-customer-dashboard-instance-title">
                        <strong>{instance.name}</strong>
                        <span>{instance.publicId}</span>
                      </div>
                      <div className="elite-customer-dashboard-instance-status">
                        <StatusBadge tone={statusTone(instance.status)}>
                          {translateCustomerEnum(locale, instance.status)}
                          {instance.substatus
                            ? ` · ${translateCustomerEnum(locale, instance.substatus)}`
                            : ''}
                        </StatusBadge>
                      </div>
                    </div>

                    <div className="elite-customer-dashboard-instance-meta">
                      <span>
                        {text('Worker:', dashboardArabicCopy.workerLabel)}{' '}
                        {instance.assignedWorkerId
                          ? `${instance.assignedWorkerId}${instance.assignedWorkerRegion ? ` (${instance.assignedWorkerRegion})` : ''}`
                          : text('Unassigned', dashboardArabicCopy.unassigned)}
                      </span>
                      <span>
                        {text(
                          'Latest event',
                          dashboardArabicCopy.latestEventRowLabel,
                        )}{' '}
                        {formatCustomerDate(locale, instance.latestEventAt)}
                      </span>
                    </div>

                    <div
                      className="elite-customer-dashboard-instance-timing"
                      style={{ '--elite-grid-min': '120px' } as CSSProperties}
                    >
                      <div>
                        <span>
                          {text(
                            'Normal delay',
                            dashboardArabicCopy.normalDelayLabel,
                          )}
                        </span>
                        <strong>{instance.sendDelay}s</strong>
                      </div>
                      <div>
                        <span>
                          {text(
                            'High queue delay',
                            dashboardArabicCopy.highQueueDelayLabel,
                          )}
                        </span>
                        <strong>{instance.sendDelayMax}s</strong>
                      </div>
                    </div>

                    <div className="elite-customer-dashboard-instance-actions">
                      <ActionButton
                        type="button"
                        tone={
                          selectedInstanceId === instance.id
                            ? 'primary'
                            : 'secondary'
                        }
                        size="compact"
                        onClick={() => setSelectedInstanceId(instance.id)}
                      >
                        {selectedInstanceId === instance.id
                          ? text('Selected', dashboardArabicCopy.selected)
                          : text('Select', dashboardArabicCopy.select)}
                      </ActionButton>
                      <Link
                        className="elite-customer-dashboard-instance-link"
                        href={`/instances/${instance.id}`}
                      >
                        {text(
                          instance.status === 'authenticated'
                            ? 'Open runtime detail'
                            : 'Scan QR',
                          instance.status === 'authenticated'
                            ? dashboardArabicCopy.openRuntimeDetail
                            : dashboardArabicCopy.scanQr,
                        )}
                      </Link>
                      {instance.status === 'authenticated' ? (
                        <Link
                          className="elite-customer-dashboard-instance-link"
                          data-variant="soft"
                          href={buildWorkspaceRoute('/messages', workspaceId)}
                        >
                          {text(
                            'Open conversations',
                            dashboardArabicCopy.openConversations,
                          )}
                        </Link>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </InfoCard>
        </>
      ) : null}
    </AppShell>
  );
}
