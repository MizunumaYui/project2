'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchAdminProducts, deleteAdminProduct } from '@/lib/shop-api';
import { placeholderDataUrl } from '@/lib/image-fallback';
import type { Product } from '@/types';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value);
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch {
      setError('商品情報を読み込めませんでした。');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`「${name}」を削除してもよろしいですか？`)) return;

    try {
      await deleteAdminProduct(id);
      alert('削除が完了しました。');
      loadProducts();
    } catch (err) {
      alert('削除に失敗しました。');
      console.error(err);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">商品管理</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          商品追加
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">価格</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">在庫</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  読み込み中...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  商品がありません
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-12 w-12 rounded-lg bg-gray-100 bg-cover bg-center shrink-0"
                        style={{
                          backgroundImage: `url("${product.imageUrl || placeholderDataUrl(product.name, 96, 96)}")`,
                        }}
                      />
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">
                          {product.character?.name ?? '—'} / {product.category?.name ?? '—'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{product.stock}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/products/edit?id=${product.id}`}
                        className="text-blue-600 hover:text-blue-900 font-medium cursor-pointer"
                      >
                        編集
                      </Link>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-red-600 hover:text-red-900 font-medium cursor-pointer"
                      >
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
