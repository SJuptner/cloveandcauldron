import { InstagramIcon, YouTubeIcon, TikTokIcon } from './SocialIcons';

export default function Footer() {
  return (
    <footer className="bg-surface-container-highest border-t border-outline/30 relative">
      <div className="parchment-grain opacity-5" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter px-margin-mobile md:px-margin-desktop py-12 max-w-container-max mx-auto relative z-10">
        <div className="md:col-span-1 space-y-6">
          <div className="text-headline-md font-headline-md text-on-surface">
            Clove &amp; <br />
            Cauldron
          </div>
          <p className="text-body-md font-body-md text-on-surface-variant max-w-xs">
            © {new Date().getFullYear()} Clove &amp; Cauldron
            <br />
            Ancient Echoes, Modern Paths.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <a
            className="text-on-surface-variant hover:text-secondary transition-colors underline decoration-secondary/30 underline-offset-4 font-body-md"
            href="/embers"
          >
            The Embers
          </a>
          <a
            className="text-on-surface-variant hover:text-secondary transition-colors underline decoration-secondary/30 underline-offset-4 font-body-md"
            href="/about"
          >
            About C&amp;C
          </a>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-label-lg text-label-lg text-primary uppercase tracking-widest">
            Connect
          </h4>
          <div className="flex gap-4">
            <a
              href="https://instagram.com/cloveandcauldron"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram: cloveandcauldron"
              className="text-primary hover:text-secondary transition-colors"
            >
              <InstagramIcon className="w-6 h-6" />
            </a>
            <a
              href="https://youtube.com/@cloveandcauldron"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube: @cloveandcauldron"
              className="text-primary hover:text-secondary transition-colors"
            >
              <YouTubeIcon className="w-6 h-6" />
            </a>
            <a
              href="https://tiktok.com/@cloveandcauldron"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok: cloveandcauldron"
              className="text-primary hover:text-secondary transition-colors"
            >
              <TikTokIcon className="w-6 h-6" />
            </a>
            <a
              href="mailto:info.cloveandcauldron@gmail.com"
              aria-label="Email: info.cloveandcauldron@gmail.com"
              className="material-symbols-outlined text-primary hover:text-secondary transition-colors"
            >
              mail
            </a>
          </div>
          <a
            className="text-on-surface-variant hover:text-secondary transition-colors underline decoration-secondary/30 underline-offset-4 font-body-md text-label-sm text-label-sm mt-2"
            href="/privacy"
          >
            Privacy Scroll
          </a>
        </div>
      </div>
    </footer>
  );
}
