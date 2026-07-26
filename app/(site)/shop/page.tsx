import Link from 'next/link';
import ShopGrid from '@/components/ShopGrid';
import { getShopProducts, getSiteSettings } from '@/lib/sanity.queries';

export const revalidate = 60;

export default async function ShopPage() {
  const [products, settings] = await Promise.all([
    getShopProducts().catch(() => []),
    getSiteSettings().catch(() => null),
  ]);

  return (
    <div>
      {/* Hero Header */}
      <section className="pt-32 pb-16 md:pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center">
        <span className="text-secondary font-label-lg text-label-lg uppercase tracking-widest mb-2 block">
          The Atelye
        </span>
        <h1 className="font-headline-lg text-headline-lg md:font-display-lg md:text-display-lg mb-4">
          The Artisan&apos;s Exchange
        </h1>
        <p className="text-body-lg font-body-lg max-w-2xl mx-auto text-on-surface-variant italic">
          Curated artifacts that bridge the boundary between the ancient spirits and the modern
          touch. Each piece is a myth whispered into reality.
        </p>
        <div className="hand-carved-divider mt-12 max-w-md mx-auto opacity-30" />

        {settings?.shopUrl && (
          <a
            href={settings.shopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-on-primary px-8 py-3 uppercase tracking-widest font-label-lg text-label-lg ink-border cta-shadow transition-all mt-12"
          >
            Visit full shop ↗
          </a>
        )}
      </section>

      {/* Product Grid Section */}
      <section className="pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {products.length > 0 ? (
          <ShopGrid products={products} />
        ) : (
          <p className="font-body-md text-body-md text-on-surface-variant italic text-center">
            Shop items coming soon — add products in the Sanity Studio at /studio.
          </p>
        )}
      </section>

      {/* Artisanal CTA */}
      <section className="py-16 md:py-24 bg-surface-container-low border-t border-b border-outline/10">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-headline-lg font-headline-lg mb-4">A Legacy in Every Knot</h2>
            <p className="text-body-lg font-body-lg text-on-surface-variant">
              We partner with generational artisans in Anatolia to preserve traditional
              techniques that are at risk of being lost to time. Your purchase supports
              heritage and high-craft.
            </p>
          </div>
          <Link
            href="/about"
            className="inline-block px-8 py-4 md:px-12 md:py-5 bg-primary text-on-primary text-label-lg font-label-lg ink-border woodblock-shadow hover:bg-secondary transition-colors uppercase tracking-widest text-center"
          >
            Our Heritage Story
          </Link>
        </div>
      </section>
    </div>
  );
}
