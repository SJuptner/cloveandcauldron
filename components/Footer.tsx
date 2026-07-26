export default function Footer() {
  return (
    <footer className="bg-surface-container-highest border-t border-outline/30 relative">
      <div className="parchment-grain opacity-5" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-12 max-w-container-max mx-auto relative z-10">
        <div className="md:col-span-1 space-y-6">
          <div className="text-headline-md font-headline-md text-on-surface">
            Clove &amp; <br />
            Cauldron
          </div>
          <p className="text-body-md font-body-md text-on-surface-variant max-w-xs">
            © {new Date().getFullYear()} Clove &amp; Cauldron. <br />
            Mythic Heritage &amp; Artisanal Craft.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-label-lg text-label-lg text-primary uppercase tracking-widest">
            Heritage
          </h4>
          <a
            className="text-on-surface-variant hover:text-secondary transition-colors underline decoration-secondary/30 underline-offset-4 font-body-md"
            href="/archive"
          >
            The Pantheon
          </a>
          <a
            className="text-on-surface-variant hover:text-secondary transition-colors underline decoration-secondary/30 underline-offset-4 font-body-md"
            href="/archive"
          >
            Spirits of Anatolia
          </a>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-label-lg text-label-lg text-primary uppercase tracking-widest">
            The Shop
          </h4>
          <a
            className="text-on-surface-variant hover:text-secondary transition-colors underline decoration-secondary/30 underline-offset-4 font-body-md"
            href="/shop"
          >
            Shipping &amp; Alchemy
          </a>
          <a
            className="text-on-surface-variant hover:text-secondary transition-colors underline decoration-secondary/30 underline-offset-4 font-body-md"
            href="#"
          >
            Privacy Scroll
          </a>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-label-lg text-label-lg text-primary uppercase tracking-widest">
            Connect
          </h4>
          <div className="flex gap-4">
            <a className="material-symbols-outlined text-primary hover:text-secondary transition-colors" href="#">
              public
            </a>
            <a className="material-symbols-outlined text-primary hover:text-secondary transition-colors" href="#">
              mail
            </a>
            <a className="material-symbols-outlined text-primary hover:text-secondary transition-colors" href="#">
              share
            </a>
          </div>
          <p className="text-label-sm text-label-sm text-on-surface-variant mt-2 italic">
            Follow the ink trail.
          </p>
        </div>
      </div>
    </footer>
  );
}
