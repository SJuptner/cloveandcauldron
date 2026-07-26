import Image from 'next/image';
import { urlFor } from '@/lib/sanity.image';

interface MerchCardProps {
  product: {
    name: string;
    price?: string;
    image?: any;
    externalUrl?: string;
  };
}

export default function MerchCard({ product }: MerchCardProps) {
  const inner = (
    <>
      <div className="aspect-square bg-surface ink-border overflow-hidden group">
        {product.image ? (
          <Image
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            src={urlFor(product.image).width(500).url()}
            alt={product.name}
            width={500}
            height={500}
          />
        ) : (
          <div className="w-full h-full bg-surface-container-high" />
        )}
      </div>
      <div className="pt-3 space-y-1">
        <div className="font-body-md text-body-md text-on-surface">{product.name}</div>
        {product.price && (
          <div className="font-label-sm text-label-sm text-secondary">{product.price}</div>
        )}
      </div>
    </>
  );

  return product.externalUrl ? (
    <a href={product.externalUrl} target="_blank" rel="noopener noreferrer" className="block">
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  );
}
