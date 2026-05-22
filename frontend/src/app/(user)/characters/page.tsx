'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchCharacters } from '@/lib/shop-api';
import { placeholderDataUrl } from '@/lib/image-fallback';
import type { Character } from '@/types';

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCharacters = async () => {
      try {
        const data = await fetchCharacters();
        if (isMounted) {
          setCharacters(data);
        }
      } catch {
        if (isMounted) {
          setError('キャラクター情報を読み込めませんでした。');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCharacters();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Characters</p>
          <h1 className="text-3xl font-black text-gray-900 md:text-4xl">キャラクター一覧</h1>
        </div>
        <p className="text-sm text-gray-500">{characters.length} 件</p>
      </div>

      {loading ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500">
          キャラクターを読み込み中...
        </p>
      ) : error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center text-red-700">
          {error}
        </p>
      ) : characters.length === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-gray-500">
          キャラクターが見つかりません。
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {characters.map((character) => (
            <Link
              key={character.id}
              href={`/characters/${character.id}`}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className="aspect-square bg-gradient-to-br from-pink-50 via-white to-blue-50 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${character.imageUrl || placeholderDataUrl(character.name, 400, 400)}")`,
                }}
              />
              <div className="p-4">
                <h2 className="text-base font-bold text-gray-900 group-hover:text-primary-600">{character.name}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                  {character.description || '説明文はまだ登録されていません。'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
