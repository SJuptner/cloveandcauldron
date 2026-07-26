'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Deterministic default so the server render and the client's first render
  // agree (no hydration mismatch). The bootstrap script in app/layout.tsx's
  // head already set the real `dark` class on <html> before paint -- this
  // effect just syncs that same preference into React state once mounted,
  // without touching the DOM/localStorage itself (they're already correct).
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const stored = window.localStorage.getItem('theme');
    const initial: Theme =
      stored === 'dark' || stored === 'light'
        ? stored
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    setTheme(initial);
  }, []);

  // Imperative, not a `useEffect` keyed on `theme` -- that would also fire on
  // the initial mount render (still holding the 'light' default) and briefly
  // clobber the class the bootstrap script had already set correctly.
  const applyTheme = (next: Theme) => {
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    window.localStorage.setItem('theme', next);
  };

  const toggle = () => applyTheme(theme === 'dark' ? 'light' : 'dark');

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
