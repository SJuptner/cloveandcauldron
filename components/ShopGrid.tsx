'use client';

import { useMemo, useState } from 'react';
import MerchCard from './MerchCard';

interface Product {
  name: string;
  price?: string;
  category?: string;
  description?: string;
  image?: any;
  externalUrl?: string;
}

export default function ShopGrid({ products }: { products: Product[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.category && set.add(p.category));
    return Array.from(set).sort();
  }, [products]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  return (
    <>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          <FilterPill label="All Treasures" active={activeCategory === null} onClick={() => setActiveCategory(null)} />
          {categories.map((category) => (
            <FilterPill
              key={category}
              label={category}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-gutter gap-y-16 items-start">
        {filtered.map((product, i) => (
          <MerchCard
            key={product.name}
            product={product}
            className={i % 3 === 2 ? 'lg:translate-y-12' : undefined}
          />
        ))}
      </div>
    </>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? 'px-6 py-2 ink-border woodblock-shadow bg-primary text-on-primary text-label-lg font-label-lg transition-all'
          : 'px-6 py-2 ink-border hover:bg-surface-container-high transition-all text-label-lg font-label-lg'
      }
    >
      {label}
    </button>
  );
}
