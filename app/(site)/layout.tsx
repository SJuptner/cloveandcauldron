'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import Analytics from '@/components/Analytics';

// The Long Road is a full-viewport interactive tool (its own internal scroll
// region + a toolbar pinned to the bottom of the screen), not a scrolling
// content page -- a footer glued on after it, or scroll-reveal animations
// meant for article content, would both fight that layout.
const FULL_VIEWPORT_ROUTES = ['/the-long-road'];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullViewport = FULL_VIEWPORT_ROUTES.includes(pathname);

  return (
    <>
      {!isFullViewport && <div className="parchment-grain" />}
      <Header />
      {children}
      {!isFullViewport && <Footer />}
      {!isFullViewport && <ScrollReveal />}
      <Analytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
    </>
  );
}
