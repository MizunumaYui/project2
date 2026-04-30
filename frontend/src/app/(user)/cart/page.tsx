'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchCart, updateCartItem, removeCartItem } from '@/lib/shop-api';
import type { CartDetails } from '@/lib/shop-api';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;

    const loadCart = async () => {
      try {
        const data = await fetchCart();
        if (isMounted) {
          setCart(data);
        }
      } catch {
        if (isMounted) {
          setError('カート情報を読み込めませんでした。');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(productId);
      return;
    }

    setUpdating((prev) => ({ ...prev, [productId]: true }));
    try {
      const updated = await updateCartItem(productId, newQuantity);
      setCart(updated);
    } catch {
      setError('数量の更新に失敗しました。');
    } finally {
      setUpdating((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setUpdating((prev) => ({ ...prev, [productId]: true }));
    try {
      const updated = await removeCartItem(productId);
      setCart(updated);
    } catch {
      setError('商品の削除に失敗しました。');
    } finally {
      setUpdating((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const items = cart?.items ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Cart</p>
        <h1 className="text-3xl font-black text-gray-900 md:text-4xl">ショッピングカート</h1>
      </div>

      {loading ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500">
          カート情報を読み込み中...
        </p>
      ) : error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center text-red-700">
          {error}
        </p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">カートは空です</p>
          <Link href="/products" className="mt-4 inline-flex rounded-lg bg-primary-600 px-5 py-2.5 font-semibold text-white hover:bg-primary-700">
            商品を見る
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            {items.map((item) => {
              const product = item.product;
              const subtotal = (product?.price ?? 0) * item.quantity;
              const isUpdating = updating[product?.id || ''];

              return (
                <div key={item.id} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div
                    className="h-24 w-20 shrink-0 rounded-xl bg-gray-100 bg-cover bg-center"
                    style={product?.imageUrl ? { backgroundImage: `url("${product.imageUrl}")` } : undefined}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{product?.category?.name || '商品'}</p>
                    <h2 className="truncate text-base font-bold text-gray-900">{product?.name || item.productId}</h2>
                    <p className="mt-1 text-sm text-gray-600">¥{(product?.price ?? 0).toLocaleString()}</p>
                    
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(product?.id || '', item.quantity - 1)}
                        disabled={isUpdating}
                        className="rounded bg-gray-100 px-2 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(product?.id || '', item.quantity + 1)}
                        disabled={isUpdating}
                        className="rounded bg-gray-100 px-2 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                      >
                        ＋
                      </button>
                      <button
                        onClick={() => handleRemoveItem(product?.id || '')}
                        disabled={isUpdating}
                        className="ml-auto rounded bg-red-100 px-3 py-1 text-sm font-semibold text-red-700 hover:bg-red-200 disabled:opacity-50"
                      >
                        削除
                      </button>
                    </div>
                    
                    <p className="mt-2 text-sm font-semibold text-primary-600">小計 ¥{subtotal.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">Summary</p>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>商品点数</span>
                <span className="font-semibold text-gray-900">{cart?.totalItems ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>合計金額</span>
                <span className="font-black text-lg text-primary-600">¥{(cart?.totalPrice ?? 0).toLocaleString()}</span>
              </div>
            </div>
            <Link href="/checkout" className="mt-6 inline-flex w-full justify-center rounded-lg bg-primary-600 px-5 py-3 font-semibold text-white hover:bg-primary-700">
              購入手続きへ
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
