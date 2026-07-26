import MerchCard from '@/components/MerchCard';
import { getShopProducts, getSiteSettings } from '@/lib/sanity.queries';

export const revalidate = 60;

export default async function ShopPage() {
  const [products, settings] = await Promise.all([
    getShopProducts().catch(() => []),
    getSiteSettings().catch(() => null),
  ]);

  return (
    <div className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <span className="text-secondary font-label-lg text-label-lg uppercase tracking-widest mb-2 block">
        The Atelye
      </span>
      <h1 className="font-headline-lg text-headline-lg text-primary mb-4">Shop</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
        Limited-run archival prints and artisanal pieces, drawn from original
        symbol research.
      </p>

      {settings?.shopUrl && (
        <a
          href={settings.shopUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary text-on-primary px-8 py-3 uppercase tracking-widest font-label-lg text-label-lg ink-border cta-shadow transition-all mb-12"
        >
          Visit full shop ↗
        </a>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter">
          {products.map((product: any) => (
            <MerchCard key={product.name} product={product} />
          ))}
        </div>
      ) : (
        <p className="font-body-md text-body-md text-on-surface-variant italic">
          Shop items coming soon — add products in the Sanity Studio at /studio.
        </p>
      )}
    </div>
  );
}
