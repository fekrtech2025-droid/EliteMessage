import type { CustomerLocale } from './customer-locale';

export type LandingTabId =
  | 'home'
  | 'features'
  | 'developer'
  | 'pricing'
  | 'faq';

export type LandingCardCopy = {
  eyebrow: string;
  title: string;
  body: string;
};

export type LandingFeatureIllustrationId =
  | 'workspace'
  | 'instance'
  | 'recovery'
  | 'developer';

export type LandingFeatureCardCopy = {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  caption: string;
  badgeLabel: string;
  illustrationAlt: string;
  illustration: LandingFeatureIllustrationId;
};

export type LandingFeaturesCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  cards: LandingFeatureCardCopy[];
};

export type LandingDeveloperIllustrationId =
  | 'credentials'
  | 'request'
  | 'events';

export type LandingDeveloperCardCopy = {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  caption: string;
  badgeLabel: string;
  illustrationAlt: string;
  illustration: LandingDeveloperIllustrationId;
};

export type LandingDeveloperCopy = {
  eyebrow: string;
  title: string;
  body: string;
  cards: LandingDeveloperCardCopy[];
  codeEyebrow: string;
  codeTitle: string;
  codeBody: string;
  codeHighlights: string[];
  checklistEyebrow: string;
  checklistTitle: string;
  checklistBody: string;
  checklist: string[];
  tabs: {
    curl: string;
    node: string;
    python: string;
  };
};

export type LandingPricingIllustrationId = 'launch' | 'scale' | 'command';

export type LandingPricingPlanCopy = {
  eyebrow: string;
  title: string;
  body: string;
  pricePrefix?: string;
  priceAmount?: number;
  priceText?: string;
  priceSuffix: string;
  priceNote: string;
  points: string[];
  caption: string;
  badgeLabel: string;
  illustrationAlt: string;
  illustration: LandingPricingIllustrationId;
  featuredLabel?: string;
};

export type LandingPricingCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  plans: LandingPricingPlanCopy[];
  assuranceEyebrow: string;
  assuranceTitle: string;
  assuranceBody: string;
  assurancePoints: string[];
  footnote: string;
};

export type LandingFaqCopy = {
  question: string;
  answer: string;
};

export type LandingHomeCopy = {
  eyebrow: string;
  titlePrefix: string;
  titleAccent: string;
  lead: string;
  englishLabel: string;
  englishBody: string;
  arabicLabel: string;
  arabicBody: string;
  playfulNote: string;
  chips: string[];
  cards: LandingCardCopy[];
  illustrationAlt: string;
  illustrationCaption: string;
};

export type LandingPageCopy = {
  loading: {
    title: string;
    body: string;
  };
  session: {
    title: string;
    staleMessage: string;
  };
  topbar: {
    navLabel: string;
    dashboard: string;
    signIn: string;
    createAccount: string;
    localeToggleAria: string;
    brandAlt: string;
  };
  tabs: Record<LandingTabId, string>;
  hero: {
    eyebrow: string;
    titlePrefix: string;
    titleAccent: string;
    lead: string;
    getStarted: string;
    signIn: string;
  };
  home: LandingHomeCopy;
  features: LandingFeaturesCopy;
  developer: LandingDeveloperCopy;
  pricing: LandingPricingCopy;
  faq: LandingFaqCopy[];
  footer: string;
};

const landingCopy = {
  en: {
    loading: {
      title: 'Checking customer session',
      body: 'Validating session before rendering the public landing page.',
    },
    session: {
      title: 'Session update',
      staleMessage: 'A stale session was found. Sign in to continue.',
    },
    topbar: {
      navLabel: 'Landing page sections',
      dashboard: 'Dashboard',
      signIn: 'Sign in',
      createAccount: 'Create account',
      localeToggleAria: 'Switch language to Arabic',
      brandAlt: 'Elite Message brand logo',
    },
    tabs: {
      home: 'Home',
      features: 'Features',
      developer: 'Developer',
      pricing: 'Pricing',
      faq: 'FAQ',
    },
    hero: {
      eyebrow: 'Bilingual messaging platform',
      titlePrefix: 'Run WhatsApp messaging, onboarding, and recovery',
      titleAccent: 'from one workspace.',
      lead: 'Elite Message gives teams a dashboard, an API route, worker visibility, and queue recovery so the system stays understandable from sign-up to delivery.',
      getStarted: 'Get started now',
      signIn: 'Sign in',
    },
    home: {
      eyebrow: 'What this is',
      titlePrefix: 'A bilingual control room for',
      titleAccent: 'WhatsApp messaging.',
      lead: 'Elite Message helps teams create a customer workspace, link an instance, send messages, and keep queues, workers, and recovery visible in one place.',
      englishLabel: 'In English',
      englishBody:
        'Open a workspace, claim an instance, and keep the API path clear from sign-up to first send.',
      arabicLabel: 'بالعربية',
      arabicBody:
        'أنشئ مساحة عمل، واربط النسخة، وأرسل أول رسالة عبر مسار API واضح من التسجيل حتى الإرسال الأول.',
      playfulNote:
        'A tiny courier with a queue badge keeps the whole thing moving.',
      chips: [
        'Dashboard / لوحة',
        'API / واجهة',
        'Workers / عمال',
        'Queues / طوابير',
        'Webhooks / إشعارات',
      ],
      cards: [
        {
          eyebrow: '01',
          title: 'Start with a clear story',
          body: 'The page explains the product as a guided path, not a pile of disconnected screens.',
        },
        {
          eyebrow: '02',
          title: 'Two languages, one brand',
          body: 'English and Arabic stay side by side so the message feels local and readable.',
        },
        {
          eyebrow: '03',
          title: 'Serious tools, friendly tone',
          body: 'The illustration keeps the platform warm without hiding the operational machinery.',
        },
      ],
      illustrationAlt:
        'A playful crowned message courier carrying message bubbles through a dashboard-style control room',
      illustrationCaption:
        'A tiny courier with a queue badge, because reliable messaging can still have personality.',
    },
    features: {
      eyebrow: 'Operational features',
      title: 'Four parts of the product that make WhatsApp work feel organized',
      lead: 'This tab is about capability, not slogans. Each card covers a real job inside Elite Message: run the workspace, connect the sending identity, watch the delivery path, and hand developers a route they can trust.',
      cards: [
        {
          eyebrow: 'Workspace control',
          title: 'Keep onboarding, sending, and follow-up in one workspace',
          body: 'Customer teams start in a workspace that holds account ownership, instance setup, message activity, and operational actions in one place. That removes scattered handoffs before the first real send.',
          points: [
            'Workspace-aware customer accounts and roles',
            'One surface for setup and day-to-day review',
            'Less context switching as the team grows',
          ],
          caption:
            'A multitasking desk captain who files messages before the coffee gets cold.',
          badgeLabel: 'Workspace',
          illustrationAlt:
            'A playful workspace captain sorting message cards on a desk with coffee and task badges',
          illustration: 'workspace',
        },
        {
          eyebrow: 'Instance identity',
          title: 'Every sending instance has a clear ID, token, and status',
          body: 'Teams can tell which instance is ready, which one is waiting for action, and which one needs recovery. The platform gives each sending identity a visible operational story instead of a mystery box.',
          points: [
            'Instance-specific credentials for public API use',
            'Visible lifecycle states for linking and recovery',
            'Safer handoff between operations and engineering',
          ],
          caption:
            'A phone, a key, and a QR badge agreeing to behave for once.',
          badgeLabel: 'Linked ready',
          illustrationAlt:
            'A cheerful phone linking with a key and QR badge while status lights confirm the instance connection',
          illustration: 'instance',
        },
        {
          eyebrow: 'Queues and recovery',
          title: 'Watch queues, workers, and retries before problems pile up',
          body: 'Elite Message surfaces delivery flow instead of hiding it. Operators can see backlog, worker activity, and retry signals early enough to act before customers feel the delay.',
          points: [
            'Visible backlog and delivery movement',
            'Worker-backed recovery cues and retry awareness',
            'Fewer surprises during busy sending windows',
          ],
          caption:
            'Our tiny mechanic keeps the conveyor belt moving and refuses dramatic outages.',
          badgeLabel: 'Queues live',
          illustrationAlt:
            'A playful mechanic tuning a message conveyor with retry arrows and worker indicators',
          illustration: 'recovery',
        },
        {
          eyebrow: 'Developer handoff',
          title: 'Give backend teams a clean route instead of tribal knowledge',
          body: 'When the workspace is ready, developers get the instance ID, token, and public route they need to integrate quickly. No scavenger hunt through screenshots, chat messages, or forgotten notes.',
          points: [
            'Credential generation inside the customer flow',
            'A predictable public instance endpoint',
            'A faster path to the first successful API call',
          ],
          caption: 'A cheerful bridge from dashboard land to terminal land.',
          badgeLabel: 'API handoff',
          illustrationAlt:
            'A playful bridge connecting a dashboard panel to a terminal window with a message rocket crossing over',
          illustration: 'developer',
        },
      ],
    },
    developer: {
      eyebrow: 'Developer handoff',
      title:
        'Give backend teams a clean integration path from dashboard to first request',
      body: 'Once the operator links an instance, the technical path should stay simple. This tab focuses on what engineering actually needs: the credential pack, the request shape, and the feedback loop after sending.',
      cards: [
        {
          eyebrow: 'Credential pack',
          title:
            'Start with a real instance ID and token, not scattered screenshots',
          body: 'Elite Message exposes the instance identity and bearer token inside the customer flow, so backend teams receive the exact sender context they should integrate against.',
          points: [
            'Use the public instance ID tied to the selected sender',
            'Rotate tokens from the dashboard instead of sharing old secrets',
            'Keep staging and production identities easy to separate',
          ],
          caption:
            'A clipboard, a key, and an ID badge having the most productive stand-up of the week.',
          badgeLabel: 'Credentials ready',
          illustrationAlt:
            'A playful clipboard holding instance credentials with a key and identity badge',
          illustration: 'credentials',
        },
        {
          eyebrow: 'Request shape',
          title: 'One public route makes the first send easy to reason about',
          body: 'Developers call a predictable instance route with a bearer token and an explicit JSON payload. That keeps integration logic straightforward whether the caller is a cron job, queue worker, or backend service.',
          points: [
            'Bearer auth stays scoped to the chosen instance',
            'Payloads remain explicit for text and media sends',
            'The route is stable enough for SDKs or internal wrappers',
          ],
          caption:
            'A paper plane carrying JSON through a very polite API gate.',
          badgeLabel: 'POST route',
          illustrationAlt:
            'A playful paper plane carrying a JSON payload toward a public API endpoint panel',
          illustration: 'request',
        },
        {
          eyebrow: 'Delivery feedback',
          title: 'Watch acknowledgements and webhook events without guessing',
          body: 'After the call, teams still need visibility. The platform gives operations and engineering shared language around message acknowledgement, inbound events, and delivery progress.',
          points: [
            'Track message lifecycle instead of assuming “200 OK” means done',
            'Use webhook events to connect backend actions with runtime results',
            'Debug with clearer signals when queues or devices need attention',
          ],
          caption:
            'A tiny event radar listening for pings so your backend does not have to panic.',
          badgeLabel: 'Events flowing',
          illustrationAlt:
            'A playful event radar listening to message acknowledgements and webhook signals',
          illustration: 'events',
        },
      ],
      codeEyebrow: 'Try the request',
      codeTitle: 'Use the same public route in cURL, Node.js, or Python',
      codeBody:
        'The sample below stays intentionally direct. It helps teams verify the route quickly before wrapping it in internal queues, background jobs, or service abstractions.',
      codeHighlights: [
        'Public instance route',
        'Bearer instance token',
        'Explicit JSON payload',
      ],
      checklistEyebrow: 'Implementation checklist',
      checklistTitle:
        'What the backend team should carry from dashboard to code',
      checklistBody:
        'If these four pieces are clear, the first integration is usually fast and the debugging story stays manageable afterward.',
      checklist: [
        'Use the selected instance public ID, not a workspace ID or display name.',
        'Treat the instance token as a real credential and rotate it when needed.',
        'Send a simple text request first before layering more automation around it.',
        'Verify acknowledgement and webhook flow end to end after the first successful send.',
      ],
      tabs: {
        curl: 'cURL',
        node: 'Node.js',
        python: 'Python',
      },
    },
    pricing: {
      eyebrow: 'Operational pricing',
      title:
        'Choose the plan that matches the sending stage, not just the smallest number',
      lead: 'Pricing should explain what changes as teams grow: workspace coverage, delivery visibility, operational control, and rollout support. This tab is built to make those differences easy to read in both languages.',
      plans: [
        {
          eyebrow: 'Launch lane',
          title: 'Starter',
          body: 'Built for a team that wants one clean workspace, a direct first-send path, and enough runtime clarity to launch without operational noise.',
          pricePrefix: '$',
          priceAmount: 49,
          priceSuffix: 'per month',
          priceNote:
            'Best when the goal is a disciplined first rollout, not a giant control room.',
          points: [
            'One active workspace with a straightforward setup path',
            'Clear instance onboarding and initial API handoff',
            'Baseline visibility for status, queues, and recovery',
          ],
          caption:
            'A tidy starter desk with one queue, one send button, and zero drama.',
          badgeLabel: 'First rollout',
          illustrationAlt:
            'A playful starter pricing scene with a message courier launching the first workspace from a tidy desk',
          illustration: 'launch',
        },
        {
          eyebrow: 'Growth lane',
          title: 'Scale',
          body: 'For teams already sending in production and needing more room for multiple workspaces, busier queues, and stronger day-to-day operational review.',
          pricePrefix: '$',
          priceAmount: 199,
          priceSuffix: 'per month',
          priceNote:
            'The right fit when messaging becomes an operating habit instead of a one-time setup.',
          points: [
            'Multi-workspace operations with clearer delivery flow',
            'Better visibility into queue movement and workload',
            'A stronger footing for active customer-facing teams',
          ],
          caption:
            'More message carts, more dashboards, still one organized floor manager.',
          badgeLabel: 'Most active teams',
          illustrationAlt:
            'A playful scale pricing scene with a manager balancing message carts and delivery dashboards',
          illustration: 'scale',
          featuredLabel: 'Recommended',
        },
        {
          eyebrow: 'Enterprise lane',
          title: 'Enterprise',
          body: 'Designed for organizations that need tighter governance, rollout coordination, and a deeper operating model across more stakeholders.',
          priceText: 'Custom',
          priceSuffix: 'tailored engagement',
          priceNote:
            'For launches where access control, operational depth, and closer support all matter.',
          points: [
            'Governance-ready operating model and clearer responsibilities',
            'Closer rollout coordination for sensitive launches',
            'Commercial scope matched to throughput, support, and complexity',
          ],
          caption:
            'A command bridge where compliance, support, and delivery finally use the same map.',
          badgeLabel: 'Governance + rollout',
          illustrationAlt:
            'A playful enterprise pricing scene with an operations command bridge, shields, and guided delivery routes',
          illustration: 'command',
        },
      ],
      assuranceEyebrow: 'Across every plan',
      assuranceTitle: 'The core product stays understandable at every tier',
      assuranceBody:
        'Upgrading should add scale, control, and support. It should not hide the basics behind a paywall. Elite Message keeps the core flow legible: workspace, instance, API path, and runtime visibility remain part of the product story at every level.',
      assurancePoints: [
        'A clear workspace and instance model',
        'A readable path from setup to first delivery',
        'Operational visibility that does not disappear as teams scale',
        'Commercial flexibility when rollout scope becomes more complex',
      ],
      footnote:
        'Illustrative landing-page pricing. Final commercial terms can be shaped around rollout scope, expected throughput, and support model.',
    },
    faq: [
      {
        question: 'How does onboarding start?',
        answer:
          'Create a customer account, open a workspace, create an instance, then use generated credentials in the public API flow.',
      },
      {
        question: 'Where do WhatsApp linking and recovery live?',
        answer:
          'Lifecycle and runtime details are surfaced through instance-level operational states and worker-backed flows.',
      },
      {
        question: 'How are tokens handled?',
        answer:
          'Account and instance tokens are created or rotated inside workspace-aware customer flows and returned only at generation time.',
      },
      {
        question: 'Can admins see customer operations?',
        answer:
          'Yes. Admin routes provide platform oversight for users, workspaces, and runtime-oriented operations.',
      },
    ],
    footer:
      'Elite Message customer surface: dashboard, API onboarding, messaging, and runtime operations.',
  },
  ar: {
    loading: {
      title: 'جارٍ التحقق من جلسة العميل',
      body: 'نتحقق من الجلسة قبل عرض الواجهة العامة للمنصة.',
    },
    session: {
      title: 'تحديث الجلسة',
      staleMessage: 'تم العثور على جلسة منتهية. سجّل الدخول للمتابعة.',
    },
    topbar: {
      navLabel: 'التنقل بين أقسام الصفحة',
      dashboard: 'لوحة التحكم',
      signIn: 'تسجيل الدخول',
      createAccount: 'إنشاء حساب',
      localeToggleAria: 'التبديل إلى الإنجليزية',
      brandAlt: 'شعار Elite Message',
    },
    tabs: {
      home: 'الرئيسية',
      features: 'المزايا',
      developer: 'للمطورين',
      pricing: 'الأسعار',
      faq: 'الأسئلة الشائعة',
    },
    hero: {
      eyebrow: 'منصة تشغيل ومراسلة ثنائية اللغة',
      titlePrefix: 'أدِر رسائل WhatsApp ودورة تشغيلها',
      titleAccent: 'من مساحة عمل واحدة.',
      lead: 'تمنح Elite Message فريقك لوحة قيادة واضحة، ومسار API مباشرًا، ورؤية لحالة العمال والطوابير، حتى يبقى الإعداد والإرسال والاستعادة تحت السيطرة من أول خطوة إلى آخر تسليم.',
      getStarted: 'ابدأ الآن',
      signIn: 'تسجيل الدخول',
    },
    home: {
      eyebrow: 'ما الذي تقدمه Elite Message؟',
      titlePrefix: 'منصة ثنائية اللغة لإدارة',
      titleAccent: 'WhatsApp.',
      lead: 'تجمع Elite Message بين مساحة العمل، وربط النسخ، وإرسال الرسائل، ومتابعة الطوابير، واستعادة التشغيل في واجهة واحدة يفهمها الفريق بسرعة.',
      englishLabel: 'بالإنجليزية',
      englishBody:
        'Create a workspace, connect an instance, and send your first message through a clean API path.',
      arabicLabel: 'بالعربية',
      arabicBody:
        'أنشئ مساحة عمل، واربط النسخة، وأرسل أول رسالة عبر مسار API واضح يبدأ من التسجيل وينتهي بأول إرسال.',
      playfulNote:
        'حتى رسولنا الصغير يعرف طريق الرسالة: من الطابور إلى التسليم بلا ارتباك.',
      chips: [
        'لوحة القيادة / Dashboard',
        'واجهة البرمجة / API',
        'عمال المعالجة / Workers',
        'الطوابير / Queues',
        'إشعارات الويب / Webhooks',
      ],
      cards: [
        {
          eyebrow: '01',
          title: 'تعريف واضح بالمنصة',
          body: 'تشرح الصفحة المنتج كمسار عمل متكامل، لا كمجموعة شاشات منفصلة.',
        },
        {
          eyebrow: '02',
          title: 'عربية وإنجليزية بصوت واحد',
          body: 'تبقى الرسالة متماسكة وواضحة في اللغتين من دون فقدان النبرة أو المعنى.',
        },
        {
          eyebrow: '03',
          title: 'نبرة ودودة ومنتج جاد',
          body: 'تحافظ الرسمة على روح خفيفة، فيما تبقى التفاصيل التشغيلية واضحة ومقنعة.',
        },
      ],
      illustrationAlt:
        'رسول مرح يرتدي تاجًا وينقل الرسائل داخل غرفة تحكم تعرض الطوابير وواجهة البرمجة',
      illustrationCaption:
        'رسول صغير يعرف طريق الرسالة جيدًا، لأن المنصة الواضحة لا تحتاج إلى تعقيد.',
    },
    features: {
      eyebrow: 'مزايا تشغيلية',
      title: 'أربع قدرات تجعل تشغيل WhatsApp منظمًا وواضحًا',
      lead: 'هذه الصفحة لا تكرر الشعار؛ بل تشرح ما ينجزه المنتج فعلًا. كل بطاقة تغطي وظيفة عملية داخل Elite Message: إدارة مساحة العمل، وربط هوية الإرسال، ومتابعة مسار التسليم، وتسليم المطورين مسارًا جاهزًا يمكن الاعتماد عليه.',
      cards: [
        {
          eyebrow: 'مركز العمل',
          title: 'مساحة عمل واحدة تجمع الإعداد والإرسال والمتابعة',
          body: 'يبدأ الفريق من مساحة عمل تحفظ الملكية، وإعداد النسخة، ونشاط الرسائل، والإجراءات التشغيلية في سياق واحد. بذلك يختفي التشتت بين التسجيل وأول إرسال فعلي.',
          points: [
            'حسابات عميل مرتبطة بمساحة العمل نفسها',
            'واجهة واحدة للإعداد والمتابعة اليومية',
            'تنقل أقل بين الأدوات عندما يكبر الفريق',
          ],
          caption: 'قائد مكتب نشيط يرتب الرسائل قبل أن يبرد فنجان القهوة.',
          badgeLabel: 'مساحة العمل',
          illustrationAlt:
            'شخصية مرحة ترتب بطاقات الرسائل على مكتب تشغيل مع قهوة وشارات مهام',
          illustration: 'workspace',
        },
        {
          eyebrow: 'هوية النسخة',
          title: 'لكل نسخة إرسال معرّف واضح ورمز وحالة مفهومة',
          body: 'يعرف الفريق أي نسخة جاهزة، وأي نسخة تنتظر إجراءً، وأي نسخة تحتاج إلى استعادة. هكذا تتحول هوية الإرسال من صندوق مبهم إلى حالة تشغيلية واضحة.',
          points: [
            'بيانات وصول مستقلة لكل نسخة عبر المسار العام',
            'حالات دورة حياة واضحة للربط والاستعادة',
            'تسليم أكثر أمانًا بين التشغيل والهندسة',
          ],
          caption: 'هاتف ومفتاح ورمز QR قرروا أخيرًا أن يعملوا بتناغم.',
          badgeLabel: 'نسخة جاهزة',
          illustrationAlt:
            'هاتف مرح يرتبط بمفتاح ورمز QR مع مؤشرات حالة تؤكد نجاح الربط',
          illustration: 'instance',
        },
        {
          eyebrow: 'الطوابير والاستعادة',
          title: 'تابع العمال والطوابير وإعادات المحاولة قبل أن تتراكم المشكلة',
          body: 'لا تخفي Elite Message مسار التسليم خلف ستار. تظهر الإشارات التشغيلية مبكرًا حتى يتصرف الفريق قبل أن يشعر العميل بالتأخير.',
          points: [
            'رؤية أوضح لحركة الطابور والتسليم',
            'إشارات مبكرة على الاستعادة وإعادة المحاولة',
            'مفاجآت أقل في فترات الإرسال المزدحمة',
          ],
          caption: 'ميكانيكي صغير يرفض الدراما ويحافظ على سير الحزام.',
          badgeLabel: 'الطوابير حيّة',
          illustrationAlt:
            'ميكانيكي مرح يضبط حزام رسائل مع أسهم إعادة المحاولة ومؤشرات العمال',
          illustration: 'recovery',
        },
        {
          eyebrow: 'تسليم المطورين',
          title: 'سلّم فريق الخلفية مسارًا نظيفًا بدل المعرفة المبعثرة',
          body: 'عندما تجهز مساحة العمل، يحصل المطورون على معرّف النسخة ورمزها والمسار العام اللازم للتكامل بسرعة. لا حاجة للبحث بين لقطات شاشة ورسائل جانبية وملاحظات ضائعة.',
          points: [
            'توليد بيانات الوصول داخل مسار العميل نفسه',
            'نقطة وصول عامة واضحة وثابتة للنسخة',
            'انطلاقة أسرع نحو أول استدعاء API ناجح',
          ],
          caption: 'جسر لطيف بين عالم لوحة التحكم وعالم الطرفية.',
          badgeLabel: 'تسليم API',
          illustrationAlt:
            'جسر مرح يصل بين لوحة تحكم ونافذة طرفية تعبر فوقه رسالة سريعة',
          illustration: 'developer',
        },
      ],
    },
    developer: {
      eyebrow: 'تسليم المطورين',
      title: 'امنح فريق الخلفية مسار تكامل واضحًا من لوحة التحكم حتى أول طلب',
      body: 'بعد أن يربط فريق التشغيل النسخة، يجب أن يبقى المسار التقني بسيطًا. يركّز هذا القسم على ما يحتاجه المطور فعلًا: حزمة بيانات الوصول، وشكل الطلب، وما بعد الإرسال من إشارات ومتابعة.',
      cards: [
        {
          eyebrow: 'حزمة الوصول',
          title: 'ابدأ بمعرّف نسخة ورمز واضحين، لا بلقطات شاشة ورسائل متفرقة',
          body: 'تعرض Elite Message هوية النسخة ورمزها داخل مسار العميل نفسه، فيتسلم فريق الخلفية بيانات الإرسال الصحيحة المرتبطة بالنسخة المقصودة مباشرة.',
          points: [
            'استخدم المعرّف العام للنسخة المرتبطة فعلًا بالإرسال',
            'حدّث الرموز من اللوحة بدل تداول أسرار قديمة',
            'افصل بين بيئات الاختبار والإنتاج بسهولة أكبر',
          ],
          caption:
            'لوح ملاحظات ومفتاح وشارة تعريف ينجزون عملاً أكثر من بعض الاجتماعات.',
          badgeLabel: 'بيانات جاهزة',
          illustrationAlt:
            'لوح مرح يعرض بيانات نسخة مع مفتاح وشارة تعريف بشكل واضح',
          illustration: 'credentials',
        },
        {
          eyebrow: 'شكل الطلب',
          title: 'مسار عام واحد يجعل أول إرسال مفهومًا وسهل التتبع',
          body: 'يستدعي المطور مسار النسخة العام باستخدام رمز Bearer وحمولة JSON صريحة. هكذا يبقى الدمج واضحًا سواء جاء الطلب من خدمة داخلية أو عامل في الخلفية أو مهمة مجدولة.',
          points: [
            'الرمز يبقى محصورًا بالنسخة المحددة',
            'الحمولة واضحة لرسائل النص والوسائط',
            'المسار ثابت بما يكفي لبناء غلاف داخلي أو SDK فوقه',
          ],
          caption: 'طائرة ورقية صغيرة تحمل JSON وتعبر بوابة API بكل ثقة.',
          badgeLabel: 'مسار POST',
          illustrationAlt:
            'طائرة ورقية مرحة تحمل حمولة JSON باتجاه لوحة تمثل نقطة API عامة',
          illustration: 'request',
        },
        {
          eyebrow: 'ما بعد الإرسال',
          title: 'تابع التأكيدات وإشارات الويب هوك بدل التخمين بعد الطلب',
          body: 'بعد تنفيذ الطلب، يحتاج الفريق إلى رؤية ما حدث فعلًا. تمنح المنصة فرق التشغيل والهندسة لغة مشتركة لفهم التأكيدات، والأحداث الواردة، ومسار التسليم.',
          points: [
            'تابع دورة الرسالة بدل اعتبار 200 OK نهاية القصة',
            'اربط أحداث الويب هوك بما جرى في الخلفية فعليًا',
            'افهم أسرع أين تتعثر الطوابير أو أين يحتاج الجهاز إلى تدخل',
          ],
          caption: 'رادار صغير يلتقط الإشارات قبل أن يبدأ فريق الخلفية بالقلق.',
          badgeLabel: 'الأحداث تصل',
          illustrationAlt:
            'رادار مرح يلتقط إشارات تأكيد الرسائل وأحداث الويب هوك',
          illustration: 'events',
        },
      ],
      codeEyebrow: 'جرّب الطلب',
      codeTitle: 'استخدم المسار العام نفسه في cURL أو Node.js أو Python',
      codeBody:
        'صُممت الأمثلة لتكون مباشرة وسهلة الاختبار. الهدف هو التحقق من المسار أولًا، ثم نقل الاستدعاء إلى خدماتك الداخلية أو الطوابير أو وظائف الخلفية بثقة أكبر.',
      codeHighlights: [
        'مسار النسخة العام',
        'رمز Bearer للنسخة',
        'حمولة JSON صريحة',
      ],
      checklistEyebrow: 'قائمة تنفيذ',
      checklistTitle: 'ما الذي يجب أن ينتقل من اللوحة إلى الكود',
      checklistBody:
        'إذا كانت هذه العناصر واضحة، يصبح الدمج الأول أسرع، وتبقى معالجة الأعطال أسهل بكثير بعد الإطلاق.',
      checklist: [
        'استخدم المعرّف العام للنسخة المحددة، لا اسم مساحة العمل ولا الاسم الظاهر.',
        'تعامل مع رمز النسخة كبيانات سرية حقيقية وقم بتدويره عند الحاجة.',
        'ابدأ بطلب نصي بسيط قبل إضافة طبقات أوسع من الأتمتة.',
        'تحقق من التأكيدات وأحداث الويب هوك من البداية حتى النهاية بعد أول إرسال ناجح.',
      ],
      tabs: {
        curl: 'cURL',
        node: 'Node.js',
        python: 'Python',
      },
    },
    pricing: {
      eyebrow: 'تسعير يواكب مرحلة التشغيل',
      title: 'اختر الباقة التي تناسب حجم العمل الحقيقي، لا مجرد الرقم الأقل',
      lead: 'الفارق بين الباقات هنا ليس شكليًا؛ بل في عدد مساحات العمل التي تديرها، ووضوح متابعة الإرسال، وعمق التحكم التشغيلي، ومستوى الدعم عند التوسع. لذلك صيغ هذا القسم ليشرح الفرق بوضوح بدل أن يكتفي بعناوين عامة.',
      plans: [
        {
          eyebrow: 'مسار البداية',
          title: 'الانطلاقة',
          body: 'مناسبة لفريق يريد مساحة عمل واحدة، ومسار إرسال أول واضح، وتجربة تشغيل مفهومة منذ اليوم الأول من دون تعقيد زائد.',
          pricePrefix: '$',
          priceAmount: 49,
          priceSuffix: 'شهريًا',
          priceNote:
            'الخيار الأنسب عندما يكون المطلوب إطلاقًا منظمًا لا غرفة عمليات كبيرة.',
          points: [
            'مساحة عمل واحدة مع إعداد مباشر وواضح',
            'تهيئة نسخة الإرسال ومسار API الأول بسهولة',
            'رؤية أساسية للحالة والطوابير وخطوات الاستعادة',
          ],
          caption:
            'مكتب انطلاق مرتب: طابور واحد، وزر إرسال واضح، وفوضى أقل بكثير.',
          badgeLabel: 'أول إطلاق',
          illustrationAlt:
            'مشهد تسعير مرح لباقة الانطلاقة مع رسول رسائل يطلق أول مساحة عمل من مكتب منظم',
          illustration: 'launch',
        },
        {
          eyebrow: 'مسار النمو',
          title: 'التوسع',
          body: 'للفرق التي أصبحت ترسل فعليًا وتحتاج إلى إدارة أكثر من مساحة عمل، ومتابعة أوضح للطوابير، وتحكم يومي أقوى في التشغيل.',
          pricePrefix: '$',
          priceAmount: 199,
          priceSuffix: 'شهريًا',
          priceNote:
            'الخيار المناسب عندما يتحول الإرسال من تجربة أولى إلى تشغيل يومي مستمر.',
          points: [
            'إدارة عدة مساحات عمل بسلاسة أكبر',
            'رؤية أوسع لحركة الطوابير وحالة التسليم',
            'قاعدة أقوى للفرق النشطة التي تعمل يوميًا على المنصة',
          ],
          caption:
            'عربات رسائل أكثر، ولوحات متابعة أكثر، لكن المشهد ما يزال منظمًا.',
          badgeLabel: 'الأنسب لمعظم الفرق النشطة',
          illustrationAlt:
            'مشهد تسعير مرح لباقة التوسع مع مدير يوازن بين عربات الرسائل ولوحات المتابعة',
          illustration: 'scale',
          featuredLabel: 'موصى بها',
        },
        {
          eyebrow: 'مسار المؤسسات',
          title: 'المؤسسات',
          body: 'مهيأة للجهات التي تحتاج إلى حوكمة أوضح، وتنسيق أقرب أثناء الإطلاق، ونموذج تشغيل أعمق يخدم عددًا أكبر من الأطراف المعنية.',
          priceText: 'تسعير مخصص',
          priceSuffix: 'بحسب نطاق العمل',
          priceNote:
            'مناسبة عندما تصبح الحوكمة، والصلاحيات، والدعم القريب عناصر حاسمة في الإطلاق.',
          points: [
            'نموذج تشغيل أكثر نضجًا مع مسؤوليات أوضح',
            'تنسيق أقرب للإطلاقات الحساسة أو واسعة النطاق',
            'تسعير مواءم لحجم الرسائل والدعم والتعقيد التشغيلي',
          ],
          caption:
            'غرفة قيادة واحدة ترى الحوكمة والدعم والتسليم على الخريطة نفسها.',
          badgeLabel: 'حوكمة + إطلاق',
          illustrationAlt:
            'مشهد تسعير مرح لباقة المؤسسات مع غرفة قيادة تشغيلية ودروع ومسارات تسليم موجهة',
          illustration: 'command',
        },
      ],
      assuranceEyebrow: 'في جميع الباقات',
      assuranceTitle: 'الأساس يبقى واضحًا مهما تغيّر مستوى الباقة',
      assuranceBody:
        'الترقية يجب أن تضيف سعة وتحكمًا ودعمًا، لا أن تخفي الأساسيات. في Elite Message يبقى مسار المنتج مفهومًا دائمًا: مساحة العمل، والنسخة، ومسار API، ورؤية التشغيل كلها عناصر واضحة في كل باقة.',
      assurancePoints: [
        'نموذج واضح لمساحة العمل والنسخة',
        'مسار مفهوم من الإعداد حتى أول تسليم',
        'رؤية تشغيلية لا تختفي عند التوسع',
        'مرونة تجارية عندما يصبح نطاق الإطلاق أكثر تعقيدًا',
      ],
      footnote:
        'الأسعار المعروضة هنا توضيحية لواجهة الهبوط، ويمكن مواءمتها بحسب نطاق الإطلاق، وحجم الرسائل المتوقع، ونموذج الدعم المطلوب.',
    },
    faq: [
      {
        question: 'كيف أبدأ الاستخدام؟',
        answer:
          'أنشئ حساب عميل، وافتح مساحة عمل، وأنشئ نسخة، ثم استخدم بيانات الوصول المولدة للبدء عبر المسار العام لـ API.',
      },
      {
        question: 'أين أتابع ربط WhatsApp والاستعادة؟',
        answer:
          'تظهر حالة الربط والاستعادة داخل تفاصيل النسخة، مع مؤشرات تشغيلية مدعومة بالعمال والطوابير.',
      },
      {
        question: 'كيف تُدار الرموز وبيانات الوصول؟',
        answer:
          'تُنشأ رموز الحساب والنسخة أو تُحدَّث من داخل مساحة العمل، وتُعرض مرة واحدة عند الإنشاء حفاظًا على الأمان.',
      },
      {
        question: 'هل يملك المسؤولون رؤية على عمليات العملاء؟',
        answer:
          'نعم. توفّر مسارات الإدارة إشرافًا على المستخدمين ومساحات العمل وحالة التشغيل على مستوى المنصة.',
      },
    ],
    footer:
      'واجهة Elite Message للعملاء: لوحة قيادة، ومسار API واضح، وتشغيل يمكن تتبعه من البداية إلى التسليم.',
  },
} satisfies Record<CustomerLocale, LandingPageCopy>;

export function getLandingPageCopy(locale: CustomerLocale): LandingPageCopy {
  return landingCopy[locale];
}
