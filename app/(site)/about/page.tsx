import type { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import Logo from '@/components/Logo';
import { getSiteSettings } from '@/lib/sanity.queries';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'About | Clove & Cauldron',
  description:
    'Clove & Cauldron is an independent research project tracing the legends, folklore, and symbols of the Turkic worlds, from Central Asia to their living echoes in Anatolia today.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About | Clove & Cauldron',
    description:
      'Clove & Cauldron is an independent research project tracing the legends, folklore, and symbols of the Turkic worlds, from Central Asia to their living echoes in Anatolia today.',
    url: '/about',
  },
};

export default async function AboutPage() {
  const settings = await getSiteSettings().catch(() => null);

  return (
    <div className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-center gap-10 md:gap-16">
        <div className="shrink-0 flex justify-center">
          <Logo variant="icon" alt="Clove & Cauldron" className="w-28 md:w-40 h-auto" />
        </div>

        <div className="flex-1">
          {settings?.aboutText ? (
            <div className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed space-y-6">
              <PortableText value={settings.aboutText} />
            </div>
          ) : (
            <div className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed space-y-6">
              <p>
                Clove &amp; Cauldron is an independent research project
                tracing the legends, folklore, and symbols of the Turkic
                worlds, from the ancient traditions of Central Asia to their
                living echoes in Anatolia today. This site is the archive
                behind the videos: full citations, source notes, and original
                research.
              </p>
              <p>
                The site is run by Sarah Juptner, an American with a passion
                for Turkic culture, history and folklore. Sarah holds a
                master&apos;s in International Relations from Boğaziçi
                University and has called Istanbul home since 2012.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-4 mt-10">
            <a
              href="https://instagram.com/cloveandcauldron"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent text-primary px-8 py-3 uppercase tracking-widest font-label-lg text-label-lg border border-primary/20 hover:bg-surface-container-highest transition-all"
            >
              Instagram ↗
            </a>
            <a
              href="https://youtube.com/@cloveandcauldron"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent text-primary px-8 py-3 uppercase tracking-widest font-label-lg text-label-lg border border-primary/20 hover:bg-surface-container-highest transition-all"
            >
              YouTube ↗
            </a>
            <a
              href="https://tiktok.com/@cloveandcauldron"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent text-primary px-8 py-3 uppercase tracking-widest font-label-lg text-label-lg border border-primary/20 hover:bg-surface-container-highest transition-all"
            >
              TikTok ↗
            </a>
            <a
              href="mailto:info.cloveandcauldron@gmail.com"
              className="bg-transparent text-primary px-8 py-3 uppercase tracking-widest font-label-lg text-label-lg border border-primary/20 hover:bg-surface-container-highest transition-all"
            >
              Email ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
