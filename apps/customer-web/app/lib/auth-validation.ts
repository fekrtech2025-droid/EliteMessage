import type { CustomerLocale } from './customer-locale';

export type PasswordStrengthScore = 0 | 1 | 2 | 3;

export function validateCustomerEmail(
  email: string,
  locale: CustomerLocale = 'en',
) {
  const normalized = email.trim();
  if (!normalized) {
    return locale === 'ar'
      ? 'أدخل عنوان البريد الإلكتروني لهذا الحساب.'
      : 'Enter the email address for this account.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return locale === 'ar'
      ? 'استخدم عنوان بريد إلكتروني صالحًا مثل name@company.com.'
      : 'Use a valid email address like name@company.com.';
  }

  return null;
}

export function validateCustomerDisplayName(
  displayName: string,
  locale: CustomerLocale = 'en',
) {
  const normalized = displayName.trim();
  if (!normalized) {
    return locale === 'ar'
      ? 'أدخل الاسم الذي يجب أن يظهر في مساحة العمل.'
      : 'Enter the name that should appear across the workspace.';
  }

  if (normalized.length < 2) {
    return locale === 'ar'
      ? 'يجب أن يتكون الاسم الظاهر من حرفين على الأقل.'
      : 'Display name must be at least 2 characters.';
  }

  return null;
}

export function validateCustomerWorkspaceName(
  workspaceName: string,
  locale: CustomerLocale = 'en',
) {
  const normalized = workspaceName.trim();
  if (!normalized) {
    return null;
  }

  if (normalized.length < 2) {
    return locale === 'ar'
      ? 'يجب أن يتكون اسم مساحة العمل من حرفين على الأقل عند إدخاله.'
      : 'Workspace name must be at least 2 characters when provided.';
  }

  return null;
}

export function validateCustomerLoginPassword(
  password: string,
  locale: CustomerLocale = 'en',
) {
  if (!password) {
    return locale === 'ar' ? 'أدخل كلمة المرور.' : 'Enter your password.';
  }

  return null;
}

export function validateCustomerSignupPassword(
  password: string,
  locale: CustomerLocale = 'en',
) {
  if (!password || password.length < 8) {
    return locale === 'ar'
      ? 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.'
      : 'Password must be at least 8 characters.';
  }

  return null;
}

export function getPasswordStrength(
  password: string,
  locale: CustomerLocale = 'en',
): {
  score: PasswordStrengthScore;
  label: string;
  help: string;
} {
  if (!password) {
    return locale === 'ar'
      ? {
          score: 0,
          label: 'قوة كلمة المرور',
          help: 'استخدم 8 أحرف على الأقل. ويكون المزيج من الحروف والأرقام والرموز أقوى.',
        }
      : {
          score: 0,
          label: 'Password strength',
          help: 'Use at least 8 characters. A mix of letters, numbers, and symbols is stronger.',
        };
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const coverage = [hasLower, hasUpper, hasNumber, hasSymbol].filter(
    Boolean,
  ).length;

  if (password.length < 8 || coverage <= 1) {
    return locale === 'ar'
      ? {
          score: 1,
          label: 'ضعيفة',
          help: 'أضف طولاً أكبر ومزيجًا من أنواع الأحرف قبل استخدام كلمة المرور هذه.',
        }
      : {
          score: 1,
          label: 'Weak',
          help: 'Add length and a mix of character types before using this password.',
        };
  }

  if (password.length >= 12 && coverage >= 3) {
    return locale === 'ar'
      ? {
          score: 3,
          label: 'قوية',
          help: 'تغطية جيدة. هذه مناسبة لحساب مالك طويل الأمد.',
        }
      : {
          score: 3,
          label: 'Strong',
          help: 'Good coverage. This is appropriate for a long-lived owner account.',
        };
  }

  return locale === 'ar'
    ? {
        score: 2,
        label: 'جيدة',
        help: 'أضف طولًا أكبر أو نوعًا إضافيًا من الأحرف للحصول على كلمة مرور أقوى.',
      }
    : {
        score: 2,
        label: 'Good',
        help: 'Add either more length or one more character type for a stronger password.',
      };
}
