'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
  { href: '/', label: 'Myths' },
  { href: '/archive', label: 'Archive' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
];

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-sm border-b border-outline/20">
      <nav className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        <Link href="/" className="shrink-0" onClick={() => setMenuOpen(false)}>
          <Logo variant="lockup" className="h-8 sm:h-10 w-auto" priority />
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={
                isActive(pathname, link.href)
                  ? 'text-secondary border-b-2 border-secondary pb-1 font-label-lg text-label-lg'
                  : 'text-on-surface-variant hover:text-primary transition-colors font-label-lg text-label-lg'
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Link
            href="/shop"
            aria-label="Shop"
            className="material-symbols-outlined text-primary p-2.5 hover:bg-surface-container-high transition-all rounded-full"
          >
            shopping_bag
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="material-symbols-outlined text-primary p-2.5 hover:bg-surface-container-high transition-all rounded-full md:hidden"
          >
            {menuOpen ? 'close' : 'menu'}
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-outline/20 bg-surface px-margin-mobile py-6">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={
                  isActive(pathname, link.href)
                    ? 'text-secondary font-label-lg text-label-lg uppercase tracking-widest py-3 border-b border-outline/10'
                    : 'text-on-surface-variant hover:text-primary transition-colors font-label-lg text-label-lg uppercase tracking-widest py-3 border-b border-outline/10'
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
