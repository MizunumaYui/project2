"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Character } from '@/types';
import { fetchCharacters } from '@/lib/shop-api';

export default function SearchBar({
  characters: initialCharacters = [],
  categories = [],
}: {
  characters?: Character[];
  categories?: string[];
}) {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const router = useRouter();
  const [q, setQ] = useState('');
  const [character, setCharacter] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    // デバッグ: クライアントで受け取った characters を確認
    console.debug('[SearchBar] initial characters:', initialCharacters);
    console.debug('[SearchBar] initial characters length:', initialCharacters.length);

    // サーバーサイドでキャラクターが取得できなかった場合、クライアントから再取得
    if (initialCharacters.length === 0) {
      console.log('[SearchBar] No characters from server, fetching from client...');
      fetchCharacters()
        .then((data) => {
          console.log('[SearchBar] Fetched characters from client:', data.length);
          setCharacters(data);
        })
        .catch((error) => {
          console.error('[SearchBar] Failed to fetch characters:', error);
        });
    } else {
      setCharacters(initialCharacters);
    }
  }, [initialCharacters]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (character) params.set('character', character);
    if (category) params.set('category', category);
    if (price) params.set('price', price);

    router.push(`/products?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <label className="sr-only">商品を探す</label>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <input
          aria-label="商品を探す"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="商品名で検索"
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none"
        />

        <select
          value={character}
          onChange={(e) => setCharacter(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm"
        >
          <option value="">キャラクター</option>
          {characters && characters.length > 0 ? (
            characters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))
          ) : (
            <option value="" disabled>
              キャラクターなし
            </option>
          )}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm"
        >
          <option value="">カテゴリ</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm"
        >
          <option value="">価格</option>
          <option value="0-1000">〜1,000円</option>
          <option value="1000-5000">1,000〜5,000円</option>
          <option value="5000-10000">5,000〜10,000円</option>
          <option value="10000+">10,000円〜</option>
        </select>

        <button
          type="submit"
          className="w-full max-w-xs rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-600"
        >
          検索
        </button>
      </div>
    </form>
  );
}
