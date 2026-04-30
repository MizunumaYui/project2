import { Suspense } from 'react';
import ProductsPageClient from './ProductsPageClient';

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <p className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500">
            商品を読み込み中...
          </p>
        </div>
      }
    >
      <ProductsPageClient />
    </Suspense>
  );
}
