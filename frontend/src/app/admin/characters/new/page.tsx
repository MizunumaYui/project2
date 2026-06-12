'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// 💡 uploadCharacterImage を追加でインポート
import { createAdminCharacter, uploadCharacterImage } from '@/lib/shop-api';

export default function AdminCharacterCreatePage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('キャラクター名を入力してください。');
      return;
    }

    setIsLoading(true);

    try {
      // 1. まずキャラクターの枠組みだけを作成
      const newCharacter = await createAdminCharacter({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      // 2. 画像が選ばれている場合、作成したキャラクターのIDを使って別途アップロード
      if (imageFile) {
        // newCharacter.id は Rails のシリアライザーが返す形式に合わせて取得してください
        // （例: newCharacter.data.id や newCharacter.id など）
        const characterId = newCharacter.data?.id || newCharacter.id; 
        await uploadCharacterImage(characterId, imageFile);
      }

      router.push('/admin/characters');
    } catch (err) {
      console.error('キャラクター追加エラー:', err);
      setError('作成に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">キャラクター追加</h1>
        <Link href="/admin/characters" className="text-sm text-gray-600 hover:text-gray-900">
          一覧へ戻る
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-md space-y-5">
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
            キャラクターの名前
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="例: キャラクターA"
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

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
            キャラクターの説明
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-28 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="説明を入力"
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/admin/characters"
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