'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchProduct, addCartItem } from '@/lib/shop-api';
import type { Product } from '@/types';

export default function ProductDetailPage({
  params,
}: {
  params: { productId: string };
}) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        const data = await fetchProduct(decodeURIComponent(params.productId));
        if (isMounted) {
          setProduct(data);
        }
      } catch {
        if (isMounted) {
          setError('商品詳細を読み込めませんでした。');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [params.productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAdding(true);
    try {
      await addCartItem(product.id, quantity);
      router.push('/cart');
    } catch {
      setError('カートへの追加に失敗しました。');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="text-sm font-medium text-primary-600 hover:text-primary-700">
        ← 商品一覧へ戻る
      </Link>

      {loading ? (
        <p className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500">
          商品詳細を読み込み中...
        </p>
      ) : error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center text-red-700">
          {error}
        </p>
      ) : !product ? (
        <p className="mt-6 rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-gray-500">
          商品が見つかりません。
        </p>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[420px_minmax(0,1fr)]">
          <div
            className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-pink-50 via-white to-blue-50 bg-cover bg-center shadow-sm"
            style={product.imageUrl ? { backgroundImage: `url("${product.imageUrl}")` } : undefined}
          />
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Product Detail</p>
            <h1 className="mt-2 text-3xl font-black text-gray-900">{product.name}</h1>
            <p className="mt-4 text-gray-600 leading-7">
              {product.description || '説明文はまだ登録されていません。'}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-primary-50 px-4 py-2 font-semibold text-primary-700">¥{product.price.toLocaleString()}</span>
              <span className="rounded-full bg-gray-100 px-4 py-2 font-semibold text-gray-700">在庫 {product.stock}</span>
              {product.category?.name && <span className="rounded-full bg-blue-50 px-4 py-2 font-semibold text-blue-700">{product.category.name}</span>}
              {product.character?.name && <span className="rounded-full bg-pink-50 px-4 py-2 font-semibold text-pink-700">{product.character.name}</span>}
            </div>

            <div className="mt-6 grid gap-3 text-sm text-gray-500">
              <p>商品ID: {product.id}</p>
              <p>作成日時: {product.createdAt}</p>
              <p>更新日時: {product.updatedAt}</p>
            </div>

            <div className="mt-8 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">数量</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isAdding}
                    className="rounded bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    disabled={isAdding}
                    className="w-16 rounded border border-gray-300 px-3 py-2 text-center text-sm font-semibold"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isAdding}
                    className="rounded bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
                className="w-full rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
              >
                {isAdding ? 'カートに追加中...' : 'カートに追加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}