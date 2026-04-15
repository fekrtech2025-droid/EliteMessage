'use client';

import Image, { type ImageProps } from 'next/image';
import { useThemePreference } from '@elite-message/ui';

type CustomerBrandMarkProps = Omit<ImageProps, 'src'> & {
  forceTheme?: 'light' | 'dark';
};

export function CustomerBrandMark({
  forceTheme,
  alt,
  ...props
}: CustomerBrandMarkProps) {
  const { effectiveTheme } = useThemePreference();
  const resolvedTheme = forceTheme ?? effectiveTheme;
  const src =
    resolvedTheme === 'dark'
      ? '/images/elite-message-icon-only-dark.png'
      : '/images/elite-message-icon-only.png';

  return <Image {...props} src={src} alt={alt} />;
}
