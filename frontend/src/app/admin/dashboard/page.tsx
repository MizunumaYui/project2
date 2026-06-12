'use client';

import { useEffect, useState } from 'react';
import { fetchAdminDashboard, type AdminDashboardStats } from '@/lib/shop-api';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function DashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await fetchAdminDashboard();
        if (isMounted) {
          setStats(data);
        }
      } catch {
        if (isMounted) {
          setError('ダッシュボード情報を読み込めませんでした。');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">ダッシュボード</h1>

      {loading ? (
        <p className="rounded-lg bg-white p-6 text-gray-500 shadow-md">ダッシュボードを読み込み中...</p>
      ) : error ? (
        <p className="rounded-lg bg-red-50 p-6 text-red-700 shadow-md">{error}</p>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="text-sm text-gray-500">総売上</h3>
              <p className="text-3xl font-bold">{formatCurrency(stats.total_revenue)}</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="text-sm text-gray-500">注文数</h3>
              <p className="text-3xl font-bold">{stats.total_orders}</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="text-sm text-gray-500">商品数</h3>
              <p className="text-3xl font-bold">{stats.total_products}</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="text-sm text-gray-500">ユーザー数</h3>
              <p className="text-3xl font-bold">{stats.total_users}</p>
            </div>
          </div>

          <div className="mt-8 rounded-lg bg-white shadow-md overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-bold">最近の注文</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">注文ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">顧客名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">金額</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">ステータス</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">注文日</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recent_orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      最近の注文はありません
                    </td>
                  </tr>
                ) : (
                  stats.recent_orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.user?.name ?? '未設定'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatCurrency(order.total_amount)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.status}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatDate(order.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}
