"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchProducts } from '@/lib/shop-api';
import type { Product } from '@/types';

function productFallbackImage(name: string) {
  return `https://placehold.co/600x750/f3f4f6/374151?text=${encodeURIComponent(name)}`;
}

export default function ProductsCarousel({ products }: { products: Product[] }) {
  const perPage = 5;
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<Product[]>(products ?? []);
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));

  useEffect(() => {
    let mounted = true;
    if ((!products || products.length === 0) && mounted) {
      fetchProducts()
        .then((res) => {
          if (mounted) setItems(res);
        })
        .catch(() => {
          /* ignore */
        });
    } else {
      setItems(products);
    }

    return () => {
      mounted = false;
    };
  }, [products]);

  const start = page * perPage;
  const pageItems = items.slice(start, start + perPage);

  const prevDisabled = page <= 0;
  const nextDisabled = page >= totalPages - 1;

  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
        <div />
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={prevDisabled}
            className={`flex size-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition ${prevDisabled ? 'opacity-40 pointer-events-none' : ''}`}
            aria-label="前へ"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={nextDisabled}
            className={`flex size-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition ${nextDisabled ? 'opacity-40 pointer-events-none' : ''}`}
            aria-label="次へ"
          >
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {pageItems.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group flex flex-col rounded-xl bg-white shadow-sm border border-transparent hover:border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
              <div
                className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: `url("${product.imageUrl || productFallbackImage(product.name)}")`,
                  backgroundColor: '#f0f0f0',
                }}
              />
            </div>
            <div className="flex flex-col p-4">
              <h3 className="mb-2 text-base font-bold text-gray-900 line-clamp-2 min-h-[3rem]">{product.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
