import type { Metadata } from 'next';
import { allFontVariables } from '@/lib/fonts';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clove & Cauldron | Ancient Echoes, Modern Paths',
  description:
    'Exploring the mythic heritage of Anatolia and the Turkic spirits through symbol and word.',
};

// Runs before hydration so the page never flashes the wrong theme. Reads the
// stored preference, falling back to the OS setting, and stamps `dark` on
// <html> synchronously. suppressHydrationWarning on <html> below is the
// documented way to tell React this one class list is expected to differ
// between server and client.
const themeBootstrapScript = `
  (function () {
    try {
      var stored = localStorage.getItem('theme');
      var isDark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) document.documentElement.classList.add('dark');
    } catch (e) {}
  })();
`;

// Root layout stays minimal so /studio (the Sanity copy desk) can render
// without the site's header/footer wrapped around it. Site chrome lives in
// app/(site)/layout.tsx instead.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={allFontVariables} suppressHydrationWarning>
      <head>
        {/* Material Symbols is an icon font only (shopping_bag, menu icons in
            the header) -- not a brand typeface, kept from the original file. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/logo/icon-black.svg" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/logo/icon-white.svg" media="(prefers-color-scheme: dark)" />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body className="bg-background text-on-background font-body-md relative min-h-screen overflow-x-hidden">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
