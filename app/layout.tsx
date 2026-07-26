import type { Metadata } from 'next';
import { allFontVariables } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clove & Cauldron | Ancient Echoes, Modern Paths',
  description:
    'Exploring the mythic heritage of Anatolia and the Turkic spirits through symbol and word.',
};

// Root layout stays minimal so /studio (the Sanity copy desk) can render
// without the site's header/footer wrapped around it. Site chrome lives in
// app/(site)/layout.tsx instead.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`light ${allFontVariables}`}>
      <head>
        {/* Material Symbols is an icon font only (shopping_bag, menu icons in
            the header) -- not a brand typeface, kept from the original file. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background font-body-md relative min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
