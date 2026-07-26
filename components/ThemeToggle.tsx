'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={
        className ||
        'material-symbols-outlined text-primary p-2.5 hover:bg-surface-container-high transition-all rounded-full'
      }
    >
      {theme === 'dark' ? 'light_mode' : 'dark_mode'}
    </button>
  );
}
