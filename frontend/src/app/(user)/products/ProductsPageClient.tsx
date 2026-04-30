'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchProducts } from '@/lib/shop-api';
import type { Product } from '@/types';

export default function ProductsPageClient() {
  const searchParams = useSearchParams();
  const categoryName = searchParams.get('category');
  const searchText = searchParams.get('search')?.trim().toLowerCase() ?? '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        if (isMounted) {
          setProducts(data);
        }
      } catch {
        if (isMounted) {
          setError('商品情報を読み込めませんでした。');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = categoryName ? product.category?.name === categoryName : true;
    const searchSource = [product.name, product.description, product.character?.name, product.category?.name]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const matchesSearch = searchText ? searchSource.includes(searchText) : true;

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Products</p>
          <h1 className="text-3xl font-black text-gray-900 md:text-4xl">商品一覧</h1>
        </div>
        {categoryName && <span className="rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">カテゴリ: {categoryName}</span>}
      </div>

      {loading ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500">
          商品を読み込み中...
        </p>
      ) : error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center text-red-700">
          {error}
        </p>
      ) : filteredProducts.length === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-gray-500">
          該当する商品が見つかりません。
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className="aspect-[4/5] bg-gradient-to-br from-pink-50 via-white to-blue-50 bg-cover bg-center"
                style={product.imageUrl ? { backgroundImage: `url("${product.imageUrl}")` } : undefined}
              />
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{product.category?.name || 'カテゴリ未設定'}</p>
                <h2 className="mt-1 line-clamp-2 text-base font-bold text-gray-900 group-hover:text-primary-600">{product.name}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                  {product.description || '説明文はまだ登録されていません。'}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-black text-primary-600">¥{product.price.toLocaleString()}</span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">在庫 {product.stock}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}