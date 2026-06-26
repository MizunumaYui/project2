'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createAdminProduct, uploadProductImage, fetchAdminCharacters, fetchCategories } from '@/lib/shop-api';
import type { Character, Category } from '@/types';

export default function AdminProductCreatePage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [characterId, setCharacterId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFormOptions() {
      try {
        const [chars, cats] = await Promise.all([
          fetchAdminCharacters(),
          fetchCategories()
        ]);
        setCharacters(chars);
        setCategories(cats);
        if (chars.length > 0) {
          setCharacterId(chars[0].id);
        }
      } catch (err) {
        console.error('オプション取得エラー:', err);
        setError('キャラクターまたはカテゴリ情報の取得に失敗しました。');
      } finally {
        setIsFetching(false);
      }
    }
    loadFormOptions();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('商品名を入力してください。');
      return;
    }
    if (!characterId) {
      setError('キャラクターを選択してください。');
      return;
    }
    const priceNum = parseInt(price, 10);
    const stockNum = parseInt(stock, 10);

    if (isNaN(priceNum) || priceNum < 0) {
      setError('価格には0以上の数値を入力してください。');
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      setError('在庫には0以上の数値を入力してください。');
      return;
    }

    setIsLoading(true);

    try {
      const newProduct = await createAdminProduct({
        name: name.trim(),
        description: description.trim() || undefined,
        price: priceNum,
        stock: stockNum,
        character_id: characterId,
        category_id: categoryId || null,
      });

      if (imageFile) {
        const productId = newProduct.data?.id || newProduct.id;
        await uploadProductImage(productId, imageFile);
      }

      router.push('/admin/products');
    } catch (err) {
      console.error('商品追加エラー:', err);
      setError('作成に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return <div className="p-6 text-center text-gray-500">初期データを読み込み中...</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">商品追加</h1>
        <Link href="/admin/products" className="text-sm text-gray-600 hover:text-gray-900">
          一覧へ戻る
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-md space-y-5">
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
            商品名
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="例: アクリルキーホルダー"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="image" className="mb-1 block text-sm font-medium text-gray-700">
            画像アップロード (MinIO)
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium text-gray-700">
              価格 (円)
            </label>
            <input
              id="price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="例: 1200"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="stock" className="mb-1 block text-sm font-medium text-gray-700">
              在庫数
            </label>
            <input
              id="stock"
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="例: 50"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="characterId" className="mb-1 block text-sm font-medium text-gray-700">
              キャラクター
            </label>
            <select
              id="characterId"
              value={characterId}
              onChange={(e) => setCharacterId(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
              disabled={isLoading}
            >
              <option value="" disabled>キャラクターを選択してください</option>
              {characters.map((char) => (
                <option key={char.id} value={char.id}>
                  {char.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="categoryId" className="mb-1 block text-sm font-medium text-gray-700">
              商品カテゴリ
            </label>
            <select
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            >
              <option value="">選択なし (カテゴリなし)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
            商品説明
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-28 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="商品の説明文を入力"
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/admin/products"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? '作成中...' : '追加する'}
          </button>
        </div>
      </form>
    </div>
  );
}
