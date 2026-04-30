'use client';

import { useEffect, useState } from 'react';
import { fetchOrders } from '@/lib/shop-api';
import type { OrderDetails } from '@/lib/shop-api';

const statusLabels: Record<string, string> = {
  pending: '支払い待ち',
  paid: '支払い完了',
  preparing: '発送準備中',
  shipped: '発送済み',
  delivered: '配達完了',
  cancelled: 'キャンセル',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        if (isMounted) {
          setOrders(data);
        }
      } catch {
        if (isMounted) {
          setError('注文履歴を読み込めませんでした。');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Orders</p>
        <h1 className="text-3xl font-black text-gray-900 md:text-4xl">注文履歴</h1>
      </div>

      {loading ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500">
          注文履歴を読み込み中...
        </p>
      ) : error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center text-red-700">
          {error}
        </p>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">注文履歴はありません</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Order</p>
                  <h2 className="mt-1 text-lg font-bold text-gray-900">注文ID: {order.id}</h2>
                  <p className="mt-1 text-sm text-gray-600">配送先: {order.shippingAddress}</p>
                </div>
                <div className="rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700">
                  {statusLabels[order.status] || order.status}
                </div>
              </div>

              <div className="mt-5 grid gap-3 border-t border-gray-100 pt-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">{item.product?.name || item.productId}</p>
                      <p className="text-gray-500">数量 {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-700">¥{item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500">{order.items.length} 点の商品</p>
                <p className="text-lg font-black text-primary-600">¥{order.totalAmount.toLocaleString()}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
