import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import Logo from '@/components/Logo';
import NewsletterForm from '@/components/NewsletterForm';
import { getSiteSettings, getRecentArticles } from '@/lib/sanity.queries';
import { buildSiteJsonLd, serializeJsonLd } from '@/lib/seo';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Clove & Cauldron | Turkic & Anatolian Myth, Folklore, and Symbol',
  description:
    'A digital hearth exploring the mythic heritage of Anatolia and the Turkic spirits — original research, folklore, and symbolism behind the videos.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Clove & Cauldron | Turkic & Anatolian Myth, Folklore, and Symbol',
    description:
      'A digital hearth exploring the mythic heritage of Anatolia and the Turkic spirits — original research, folklore, and symbolism behind the videos.',
    url: '/',
  },
};

export default async function HomePage() {
  const [settings, articles] = await Promise.all([
    getSiteSettings().catch(() => null),
    getRecentArticles(3).catch(() => []),
  ]);
  const { website, organization } = buildSiteJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(organization) }}
      />
      {/* Hero Section */}
      <main className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto z-10">
        <div className="flex flex-col items-center text-center">
          <Logo
            variant="stacked"
            alt="Clove & Cauldron"
            className="w-full max-w-md mb-12 opacity-90 transition-opacity hover:opacity-100"
            priority
          />
          <h1 className="font-headline-lg text-headline-lg md:text-display-lg md:font-display-lg text-primary mb-6 tracking-tight max-w-3xl">
            {settings?.heroTitle || (
              <>
                Ancient Echoes, <br className="hidden md:block" />
                Modern Paths.
              </>
            )}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
            {settings?.heroBody ||
              'Exploring the mythic heritage of Anatolia and the Turkic spirits through woodblock and word. A curated sanctuary for the artisanal and the arcane.'}
          </p>
          <Link
            href="/embers"
            className="bg-primary text-on-primary px-10 py-4 uppercase tracking-[0.2em] font-label-lg text-label-lg ink-border cta-shadow transition-all duration-200"
          >
            Gather Around the Fire
          </Link>
        </div>
      </main>

      {/* Woodblock Divider */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-24">
        <div className="woodblock-divider" />
      </div>

      {/* The Latest Section */}
      <section className="mb-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div className="max-w-md">
            <span className="text-secondary font-label-lg text-label-lg uppercase tracking-widest mb-2 block">
              The Embers
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary">The Latest</h2>
          </div>
          <Link
            href="/embers"
            className="hidden md:flex items-center gap-2 font-label-lg text-label-lg text-on-surface-variant hover:text-secondary transition-colors"
          >
            <span className="underline underline-offset-8">Browse The Embers</span>
            <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
          </Link>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {articles.map((article: any) => (
              <article key={article.slug.current} className="group">
                <ArticleCard article={article} />
              </article>
            ))}
          </div>
        ) : (
          <p className="font-body-md text-body-md text-on-surface-variant italic">
            No embers published yet — add articles in the Sanity Studio copy desk at /studio.
          </p>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <h3 className="font-headline-md text-headline-md text-primary">Join the Inner Circle</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            New pieces are added to The Embers periodically. Leave your email
            and we&apos;ll send word the moment something new is live.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
