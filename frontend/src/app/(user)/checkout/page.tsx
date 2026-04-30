'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchCart, createOrder } from '@/lib/shop-api';
import { useAuthStore } from '@/stores/authStore';
import type { CartDetails } from '@/lib/shop-api';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [cart, setCart] = useState<CartDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    postalCode: '',
    prefecture: '',
    city: '',
    address1: '',
    address2: '',
    name: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }

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
  }, [isAuthenticated, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.postalCode || !formData.prefecture || !formData.city || !formData.address1 || !formData.name) {
      setError('すべての必須項目を入力してください。');
      return;
    }

    const shippingAddress = `${formData.postalCode} ${formData.prefecture}${formData.city}${formData.address1}${formData.address2 ? ' ' + formData.address2 : ''} ${formData.name}`;

    setIsSubmitting(true);
    try {
      const order = await createOrder(shippingAddress);
      // 注文成功後、注文詳細ページへリダイレクト
      router.push(`/orders/${order.id}`);
    } catch {
      setError('注文の作成に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const items = cart?.items ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/cart" className="text-sm font-medium text-primary-600 hover:text-primary-700">
        ← カートに戻る
      </Link>

      <div className="mt-6 mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Checkout</p>
        <h1 className="text-3xl font-black text-gray-900 md:text-4xl">注文確認</h1>
      </div>

      {loading ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500">
          読み込み中...
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
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* 左側: 注文内容と配送先 */}
          <div className="space-y-8">
            {/* 注文内容 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">注文内容</h2>
              <div className="mt-4 space-y-3">
                {items.map((item) => {
                  const product = item.product;
                  const subtotal = (product?.price ?? 0) * item.quantity;

                  return (
                    <div key={item.id} className="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-0">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{product?.name || item.productId}</p>
                        <p className="text-xs text-gray-500">¥{(product?.price ?? 0).toLocaleString()} × {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">¥{subtotal.toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 配送先 */}
            <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">配送先</h2>
              <div className="mt-4 grid gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">お名前 *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="山田太郎"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">郵便番号 *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    placeholder="100-0001"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">都道府県 *</label>
                    <input
                      type="text"
                      name="prefecture"
                      value={formData.prefecture}
                      onChange={handleInputChange}
                      required
                      placeholder="東京都"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">市区町村 *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="千代田区"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">住所1 *</label>
                  <input
                    type="text"
                    name="address1"
                    value={formData.address1}
                    onChange={handleInputChange}
                    required
                    placeholder="丸の内1-1-1"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">住所2</label>
                  <input
                    type="text"
                    name="address2"
                    value={formData.address2}
                    onChange={handleInputChange}
                    placeholder="ABCビル 5F"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 w-full rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
                >
                  {isSubmitting ? '注文中...' : '注文を確定'}
                </button>
              </div>
            </form>
          </div>

          {/* 右側: 注文サマリー */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">Order Summary</p>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span>商品点数</span>
                <span className="font-semibold text-gray-900">{cart?.totalItems ?? 0}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span>小計</span>
                <span className="font-semibold text-gray-900">¥{(cart?.totalPrice ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span>送料</span>
                <span className="font-semibold text-gray-900">¥0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold">合計</span>
                <span className="font-black text-lg text-primary-600">¥{(cart?.totalPrice ?? 0).toLocaleString()}</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
