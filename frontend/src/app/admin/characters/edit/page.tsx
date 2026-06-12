'use client';
import { FormEvent, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation'; // 💡 useSearchParams を追加
import { fetchAdminCharacters, updateAdminCharacter, uploadCharacterImage } from '@/lib/shop-api';

export default function AdminCharacterEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 💡 URLの ?id=xxxx からキャラクターのIDを抜き取ります
  const characterId = searchParams.get('id');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // 💡 初期データ読み込み中フラグ
  const [error, setError] = useState<string | null>(null);

  // 💡 画面を開いた瞬間に、該当するキャラクターの今のデータをRailsから持ってきてフォームにセットする
  useEffect(() => {
    if (!characterId) {
      setError('キャラクターIDが指定されていません。');
      setIsFetching(false);
      return;
    }

    async function loadInitialData() {
      try {
        const allCharacters = await fetchAdminCharacters();
        // 一覧データの中から、URLのIDと一致するキャラクターを探す
        const currentCharacter = allCharacters.find(c => c.id === characterId);
        
        if (currentCharacter) {
          setName(currentCharacter.name);
          setDescription(currentCharacter.description || '');
        } else {
          setError('該当するキャラクターが見つかりませんでした。');
        }
      } catch (err) {
        setError('キャラクター情報の取得に失敗しました。');
      } finally {
        setIsFetching(false);
      }
    }

    loadInitialData();
  }, [characterId]);

async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError(null);

  if (!name.trim()) {
    setError('キャラクター名を入力してください。');
    return;
  }
  if (!characterId) return;

  setIsLoading(true);

  try {
    // 1. まず名前と説明文を更新
    await updateAdminCharacter(characterId, {
      name: name.trim(),
      description: description.trim() || undefined,
    });

    // 2. 画像が新しく選択されている場合のみアップロード
    if (imageFile) {
      await uploadCharacterImage(characterId, imageFile);
    }

    alert('更新が完了しました！');
    router.push('/admin/characters');
  } catch (err) {
    console.error('キャラクター更新エラー:', err);
    setError('更新に失敗しました。');
  } finally {
    setIsLoading(false);
  }
}

  // 読み込み中の画面表示
  if (isFetching) {
    return <div className="p-6 text-center text-gray-500">既存のデータを読み込み中...</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">キャラクター編集</h1>
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
            画像を変更する場合のみアップロード (MinIO)
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
            {isLoading ? '更新中...' : '保存する'}
          </button>
        </div>
      </form>
    </div>
  );
}