import type { AuthHelpSection } from '@elite-message/ui';
import type { CustomerLocale } from './customer-locale';

export type CustomerAuthHelpContent = {
  title: string;
  intro: string;
  sections: AuthHelpSection[];
  footer?: {
    prefix: string;
    href: string;
    label: string;
  };
};

export function getCustomerSigninHelpContent(
  locale: CustomerLocale,
): CustomerAuthHelpContent {
  if (locale === 'ar') {
    return {
      title: 'مساعدة تسجيل الدخول',
      intro:
        'هذه الصفحة مختصرة عن قصد. استخدمها لتسجيل الدخول بسرعة، وافتح لوحة المساعدة فقط عند الحاجة إلى تفاصيل إضافية.',
      sections: [
        {
          title: 'ما الذي تفعله هذه الصفحة',
          description:
            'تسجيل الدخول يعيد جلسة العميل ويحمّل آخر حالة لمساحة العمل في لوحة التحكم.',
        },
        {
          title: 'كيف تعمل الجلسات',
          items: [
            'تسجل الدخول باستخدام بريد العميل وكلمة المرور.',
            'يبقيك التطبيق مسجلاً عبر جلسة مدعومة بالتحديث حتى تسجيل الخروج أو انتهاء الصلاحية.',
            'إذا انتهت الجلسة فستطلب منك لوحة التحكم تسجيل الدخول مرة أخرى.',
          ],
        },
        {
          title: 'قبل الإرسال',
          items: [
            'يظهر التحقق أثناء الكتابة أو عند مغادرة الحقل حتى ترى الأخطاء قبل فشل الطلب.',
            'يمكن إظهار كلمة المرور مؤقتًا من زر الإظهار أو الإخفاء إذا أردت التحقق مما كتبته.',
            'تبقى الروابط الثانوية أكثر هدوءًا من الزر الرئيسي حتى يظل التركيز على تسجيل الدخول.',
          ],
        },
      ],
      footer: {
        prefix: 'تحتاج إلى مساحة عمل جديدة؟',
        href: '/signup',
        label: 'انتقل إلى التسجيل',
      },
    };
  }

  return {
    title: 'Sign-in help',
    intro:
      'This page is intentionally short. Use it to sign in quickly, and open this help panel only when you need the extra context.',
    sections: [
      {
        title: 'What this page does',
        description:
          'Sign in restores your customer session and reloads the latest workspace state for the dashboard.',
      },
      {
        title: 'How sessions work',
        items: [
          'You sign in with your customer email and password.',
          'The app keeps you signed in through a refresh-backed session until logout or expiry.',
          'If the session expires, the dashboard will ask you to sign in again.',
        ],
      },
      {
        title: 'Before you submit',
        items: [
          'Validation appears while you type or leave a field so errors are visible before a failed request.',
          'The password can be shown briefly from the eye/help toggle area if you want to verify what you typed.',
          'Secondary links stay quieter than the main button so the page remains focused on sign-in.',
        ],
      },
    ],
    footer: {
      prefix: 'Need a new workspace?',
      href: '/signup',
      label: 'Open signup',
    },
  };
}

export function getCustomerSignupHelpContent(
  locale: CustomerLocale,
): CustomerAuthHelpContent {
  if (locale === 'ar') {
    return {
      title: 'مساعدة التسجيل',
      intro:
        'صفحة التسجيل مبسطة عن قصد. تعرض الصفحة الأساسية الأساسيات فقط، وبقية الشرح موجود هنا.',
      sections: [
        {
          title: 'ما الذي سيتم إنشاؤه',
          items: [
            'حساب مستخدم عميل جديد.',
            'أول مساحة عمل يملكها هذا الحساب.',
            'جلسة عميل جاهزة للاستخدام حتى تتابع مباشرة إلى لوحة التحكم.',
          ],
        },
        {
          title: 'ما الذي تحتاج إلى إدخاله',
          items: [
            'الاسم الظاهر والبريد الإلكتروني وكلمة المرور هي الحقول المطلوبة فقط.',
            'اسم مساحة العمل اختياري ويمكن أن يبقى مطويًا ما لم ترغب في تحديده بنفسك.',
            'التحقق الفوري يوضح بالضبط ما الذي يجب تغييره قبل الإرسال.',
          ],
        },
        {
          title: 'إرشادات كلمة المرور',
          items: [
            'استخدم 8 أحرف على الأقل.',
            'كلمات المرور الأطول مع مزيج من الحروف والأرقام والرموز تكون أقوى.',
            'يمكنك إظهار كلمة المرور مؤقتًا أثناء الكتابة ثم إخفاؤها مجددًا.',
          ],
        },
      ],
      footer: {
        prefix: 'لديك حساب بالفعل؟',
        href: '/signin',
        label: 'العودة إلى تسجيل الدخول',
      },
    };
  }

  return {
    title: 'Signup help',
    intro:
      'Signup stays minimal on purpose. The main page only shows the essentials, and the rest of the explanation lives here.',
    sections: [
      {
        title: 'What gets created',
        items: [
          'A new customer user account.',
          'A first workspace owned by that account.',
          'A ready-to-use customer session so you can continue directly into the dashboard.',
        ],
      },
      {
        title: 'What you need to enter',
        items: [
          'Display name, email address, and password are the only required fields.',
          'Workspace name is optional and can stay collapsed unless you want to control it explicitly.',
          'Inline validation explains exactly what needs to change before submit.',
        ],
      },
      {
        title: 'Password guidance',
        items: [
          'Use at least 8 characters.',
          'Longer passwords with a mix of letters, numbers, and symbols are stronger.',
          'You can temporarily show the password while typing, then hide it again.',
        ],
      },
    ],
    footer: {
      prefix: 'Already have access?',
      href: '/signin',
      label: 'Return to sign in',
    },
  };
}
