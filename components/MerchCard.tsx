import Image from 'next/image';
import { resolveImageSrc } from '@/lib/sanity.image';

interface MerchCardProps {
  product: {
    name: string;
    price?: string;
    category?: string;
    description?: string;
    image?: any;
    externalUrl?: string;
  };
  /** Simple product tile used on the homepage teaser (no price/description/hover button). */
  compact?: boolean;
  className?: string;
}

export default function MerchCard({ product, compact = false, className }: MerchCardProps) {
  if (compact) {
    const inner = (
      <div className="aspect-square bg-surface ink-border overflow-hidden group">
        <Image
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={resolveImageSrc(product.image, 500)}
          alt={product.name}
          width={500}
          height={500}
        />
      </div>
    );
    return product.externalUrl ? (
      <a href={product.externalUrl} target="_blank" rel="noopener noreferrer" className="block">
        {inner}
      </a>
    ) : (
      inner
    );
  }

  const inner = (
    <>
      <div className="relative overflow-hidden aspect-[4/5] bg-surface-container mb-6 ink-border transition-all duration-500 group-hover:woodblock-shadow">
        <Image
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={resolveImageSrc(product.image, 700)}
          alt={product.name}
          width={700}
          height={875}
        />
        <span className="absolute bottom-4 right-4 w-12 h-12 bg-primary text-on-primary flex items-center justify-center ink-border opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300">
          <span className="material-symbols-outlined" aria-hidden="true">shopping_bag</span>
        </span>
      </div>
      <div className="flex justify-between items-start gap-4">
        <div>
          {product.category && (
            <span className="text-label-sm font-label-sm uppercase tracking-widest text-secondary mb-1 block">
              {product.category}
            </span>
          )}
          <h3 className="text-headline-sm font-headline-sm">{product.name}</h3>
        </div>
        {product.price && <span className="text-body-md font-body-md shrink-0">{product.price}</span>}
      </div>
      {product.description && (
        <p className="text-body-md font-body-md text-on-surface-variant mt-2 line-clamp-2">
          {product.description}
        </p>
      )}
    </>
  );

  return (
    <article className={`group${className ? ` ${className}` : ''}`}>
      {product.externalUrl ? (
        <a href={product.externalUrl} target="_blank" rel="noopener noreferrer">
          {inner}
        </a>
      ) : (
        inner
      )}
    </article>
  );
}
