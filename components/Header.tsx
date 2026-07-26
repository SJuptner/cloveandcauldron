import Link from 'next/link';

const NAV_LINKS = [
  { href: '/archive', label: 'Myths' },
  { href: '/archive', label: 'Archive' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-sm border-b border-outline/20">
      <nav className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        <Link
          href="/"
          className="text-headline-md font-headline-md uppercase tracking-widest text-primary"
        >
          Clove &amp; Cauldron
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              className={
                i === 0
                  ? 'text-secondary border-b-2 border-secondary pb-1 font-label-lg text-label-lg'
                  : 'text-on-surface-variant hover:text-primary transition-colors font-label-lg text-label-lg'
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/shop"
            className="material-symbols-outlined text-primary p-2 hover:bg-surface-container-high transition-all"
          >
            shopping_bag
          </Link>
          <button className="material-symbols-outlined text-primary p-2 hover:bg-surface-container-high transition-all">
            menu
          </button>
        </div>
      </nav>
    </header>
  );
}
