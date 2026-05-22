'use client';

import Link from 'next/link';
// 使用するのは background-image の表示なので next/image は使わない
import { useEffect, useState } from 'react';
import { fetchCharacter } from '@/lib/shop-api';
import type { Character } from '@/types';

export default function CharacterDetailPage({
  params,
}: {
  params: { characterId: string };
}) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCharacter = async () => {
      try {
        const data = await fetchCharacter(decodeURIComponent(params.characterId));
        if (isMounted) {
          setCharacter(data);
        }
      } catch {
        if (isMounted) {
          setError('キャラクター詳細を読み込めませんでした。');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCharacter();

    return () => {
      isMounted = false;
    };
  }, [params.characterId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/characters" className="text-sm font-medium text-primary-600 hover:text-primary-700">
        ← キャラクター一覧へ戻る
      </Link>

      {loading ? (
        <p className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500">
          キャラクター詳細を読み込み中...
        </p>
      ) : error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center text-red-700">
          {error}
        </p>
      ) : !character ? (
        <p className="mt-6 rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-gray-500">
          キャラクターが見つかりません。
        </p>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          
          {/* 2. 画像表示部分の修正 */}
          <div
            className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-pink-50 via-white to-blue-50 shadow-sm bg-cover bg-center"
            style={{
              backgroundImage: `url("${character.imageUrl ?? `https://picsum.photos/seed/character-${character.id}/360/360`}")`,
            }}
          />

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Character Detail</p>
            <h1 className="mt-2 text-3xl font-black text-gray-900">{character.name}</h1>
            <p className="mt-4 text-gray-600 leading-7">
              {character.description || '説明文はまだ登録されていません。'}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href={`/products?character=${encodeURIComponent(character.id)}`}
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-600 transition"
              >
                商品を見る
              </Link>
              <Link href="/products" className="inline-flex items-center rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">商品一覧</Link>
            </div>
            <div className="mt-6 grid gap-3 text-sm text-gray-500">
              <p>キャラクターID: {character.id}</p>
              <p>作成日時: {character.createdAt}</p>
              <p>更新日時: {character.updatedAt}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}