import Image from 'next/image';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import MerchCard from '@/components/MerchCard';
import { getSiteSettings, getFeaturedArticles, getShopProducts } from '@/lib/sanity.queries';

export const revalidate = 60;

export default async function HomePage() {
  const [settings, articles, products] = await Promise.all([
    getSiteSettings().catch(() => null),
    getFeaturedArticles().catch(() => []),
    getShopProducts().catch(() => []),
  ]);

  return (
    <>
      {/* Hero Section */}
      <main className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto z-10">
        <div className="flex flex-col items-center text-center">
          <Image
            alt="Clove & Cauldron Primary Logo"
            className="w-full max-w-2xl mb-12 opacity-90 transition-opacity hover:opacity-100"
            src="/logo/lockup-light.svg"
            width={1864}
            height={420}
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
            href="/archive"
            className="bg-primary text-on-primary px-10 py-4 uppercase tracking-[0.2em] font-label-lg text-label-lg ink-border cta-shadow transition-all duration-200"
          >
            Enter the Pantheon
          </Link>
        </div>
      </main>

      {/* Woodblock Divider */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-24">
        <div className="woodblock-divider" />
      </div>

      {/* Latest Myths Section */}
      <section className="mb-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div className="max-w-md">
            <span className="text-secondary font-label-lg text-label-lg uppercase tracking-widest mb-2 block">
              The Chronicles
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary">Latest Myths</h2>
          </div>
          <Link
            href="/archive"
            className="hidden md:flex items-center gap-2 font-label-lg text-label-lg text-on-surface-variant hover:text-secondary transition-colors underline underline-offset-8"
          >
            Browse Archive
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
            No myths published yet — add articles in the Sanity Studio copy desk at /studio.
          </p>
        )}
      </section>

      {/* Shop Teaser Section */}
      <section className="bg-surface-container-high py-24 mb-0 relative overflow-hidden">
        <div className="parchment-grain" />
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="text-secondary font-label-lg text-label-lg uppercase tracking-widest block">
                The Atelye
              </span>
              <h2 className="font-headline-lg text-headline-lg md:text-headline-lg text-primary leading-tight">
                Artisanal Craft <br />
                for the Ritual of Living
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                From hand-carved boxwood spoons to hand-loomed Anatolian
                textiles, each piece is a physical echo of the heritage we
                celebrate.
              </p>
              <div className="flex gap-4 pt-4">
                <Link
                  href="/shop"
                  className="bg-primary text-on-primary px-8 py-3 uppercase tracking-widest font-label-lg text-label-lg ink-border cta-shadow transition-all"
                >
                  Shop Collection
                </Link>
                <Link
                  href="/about"
                  className="bg-transparent text-primary px-8 py-3 uppercase tracking-widest font-label-lg text-label-lg border border-primary/20 hover:bg-surface-container-highest transition-all"
                >
                  Our Process
                </Link>
              </div>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6 pt-12">
                  {products[0] && <MerchCard product={products[0]} />}
                  {products[1] && <MerchCard product={products[1]} />}
                </div>
                <div className="space-y-6">{products[2] && <MerchCard product={products[2]} />}</div>
              </div>
            ) : (
              <p className="font-body-md text-body-md text-on-surface-variant italic">
                Shop items coming soon — add products in the Studio.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <h3 className="font-headline-md text-headline-md text-primary">Join the Inner Circle</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Receive seasonal scrolls containing new myths, artisan spotlights,
            and early access to shop drops.
          </p>
          <form className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full text-left">
              <label className="font-label-sm text-label-sm uppercase tracking-widest mb-2 block opacity-60">
                Parchment Address
              </label>
              <input
                className="w-full bg-transparent border-0 border-b border-primary/20 focus:ring-0 focus:border-primary py-3 px-0 font-body-md placeholder:text-outline/40"
                placeholder="you@alchemy.com"
                type="email"
              />
            </div>
            <button className="bg-primary text-on-primary px-8 py-3 uppercase tracking-widest font-label-lg text-label-lg ink-border w-full md:w-auto hover:bg-secondary transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
