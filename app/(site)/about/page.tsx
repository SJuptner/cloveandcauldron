import { PortableText } from '@portabletext/react';
import { getSiteSettings } from '@/lib/sanity.queries';

export const revalidate = 60;

export default async function AboutPage() {
  const settings = await getSiteSettings().catch(() => null);

  return (
    <div className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="max-w-2xl">
        <span className="text-secondary font-label-lg text-label-lg uppercase tracking-widest mb-2 block">
          About
        </span>
        <h1 className="font-headline-lg text-headline-lg text-primary mb-10">
          Clove &amp; Cauldron
        </h1>

        {settings?.aboutText ? (
          <div className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed space-y-6">
            <PortableText value={settings.aboutText} />
          </div>
        ) : (
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Clove &amp; Cauldron is an independent research project tracing the
            symbols, seals, and sacred forms of the Turkic and Alevi-Bektashi
            worlds — from the steppe tamgas of Central Asia to the living
            iconography of Anatolia&apos;s heterodox traditions. This site is
            the archive behind the videos: full citations, source notes, and
            original research.
            <br />
            <br />
            Add the full about text in the Sanity Studio under Site Settings
            (/studio).
          </p>
        )}

        <div className="flex gap-4 mt-10">
          {settings?.youtubeUrl && (
            <a
              href={settings.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent text-primary px-8 py-3 uppercase tracking-widest font-label-lg text-label-lg border border-primary/20 hover:bg-surface-container-highest transition-all"
            >
              YouTube ↗
            </a>
          )}
          {settings?.tiktokUrl && (
            <a
              href={settings.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent text-primary px-8 py-3 uppercase tracking-widest font-label-lg text-label-lg border border-primary/20 hover:bg-surface-container-highest transition-all"
            >
              TikTok ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
