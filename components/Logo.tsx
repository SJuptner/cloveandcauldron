'use client';

import Image from 'next/image';
import { useTheme } from './ThemeProvider';

type Variant = 'lockup' | 'wordmark' | 'icon' | 'stacked';

const VARIANTS: Record<Variant, { light: string; dark?: string; width: number; height: number }> = {
  // Full horizontal icon + wordmark lockup -- has dedicated light/dark ink assets.
  lockup: { light: '/logo/lockup-light.svg', dark: '/logo/lockup-dark.svg', width: 1864.3, height: 419.56 },
  // Text-only logotype -- has dedicated light/dark ink assets.
  wordmark: { light: '/logo/wordmark-black.svg', dark: '/logo/wordmark-white.svg', width: 1422.7, height: 160.92 },
  // Cauldron icon only -- has dedicated light/dark ink assets.
  icon: { light: '/logo/icon-black.svg', dark: '/logo/icon-white.svg', width: 297.69, height: 338.12 },
  // Stacked icon-over-wordmark mark -- only a single (black-ink, transparent)
  // asset was supplied, so dark mode is handled with a CSS invert filter
  // instead of a dedicated file (see `className` in Logo below).
  stacked: { light: '/logo/icon-detailed.svg', width: 713.78, height: 492.36 },
};

export default function Logo({
  variant = 'lockup',
  alt = 'Clove & Cauldron',
  className,
  priority,
}: {
  variant?: Variant;
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  const { theme } = useTheme();
  const asset = VARIANTS[variant];
  const src = theme === 'dark' && asset.dark ? asset.dark : asset.light;
  const needsInvertFallback = theme === 'dark' && !asset.dark;

  return (
    <Image
      src={src}
      alt={alt}
      width={asset.width}
      height={asset.height}
      priority={priority}
      className={`${className || ''}${needsInvertFallback ? ' invert' : ''}`.trim()}
    />
  );
}
