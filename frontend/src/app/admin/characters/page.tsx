'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
// 💡 deleteAdminCharacter も shop-api からインポート
import { fetchAdminCharacters, deleteAdminCharacter } from '@/lib/shop-api';
import { placeholderDataUrl } from '@/lib/image-fallback';
import type { Character } from '@/types';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value));
}

export default function AdminCharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 💡 キャラクター一覧を取得・再読込するための関数を共通化
  async function loadCharacters() {
    try {
      setLoading(true);
      const data = await fetchAdminCharacters();
      setCharacters(data);
    } catch {
      setError('キャラクター情報を読み込めませんでした。');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCharacters();
  }, []);

  // 💡 削除ボタンがクリックされた時の本物の通信処理
  async function handleDelete(id: string, name: string) {
    if (!confirm(`「${name}」を削除してもよろしいですか？`)) return;

    try {
      // 1. shop-api を通じて Rails に DELETE リクエストを送信
      await deleteAdminCharacter(id);
      
      // 2. 成功したらトースト（アラート）を出して一覧を再読込
      alert('削除が完了しました。');
      loadCharacters(); 
    } catch (err) {
      alert('削除に失敗しました。');
      console.error(err);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">キャラクター管理</h1>
        <Link
          href="/admin/characters/new"
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          キャラクター追加
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名前</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">説明</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">作成日</th>
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
            ) : characters.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  キャラクターがありません
                </td>
              </tr>
            ) : (
              characters.map((character) => (
                <tr key={character.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-12 w-12 rounded-full bg-gray-100 bg-cover bg-center"
                        style={{
                          backgroundImage: `url("${character.image_url || placeholderDataUrl(character.name, 96, 96)}")`,
                        }}
                      />
                      <span className="font-medium">{character.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{character.description || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{formatDate(character.createdAt)}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      {/* 💡 編集ボタン：クリックで [id]/edit ページへ遷移 */}
                      <Link
                        href={`/admin/characters/edit?id=${character.id}`}
                        className="text-blue-600 hover:text-blue-900 font-medium cursor-pointer"
                      >
                        編集
                      </Link>
                      
                      <span className="text-gray-300">|</span>
                      
                      {/* 💡 削除ボタン：作成した handleDelete を実行 */}
                      <button
                        onClick={() => handleDelete(character.id, character.name)}
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