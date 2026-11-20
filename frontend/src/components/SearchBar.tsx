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
  const [selectedCharacterId, setSelectedCharacterId] = useState('');
  const [showCharacterSuggestions, setShowCharacterSuggestions] = useState(false);
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  const characterSuggestions = characters.filter((item) =>
    item.name.toLocaleLowerCase().includes(character.trim().toLocaleLowerCase()),
  );

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
    if (selectedCharacterId) {
      params.set('character', selectedCharacterId);
    } else if (character.trim() && !q.trim()) {
      const normalizedCharacterName = character.trim().toLocaleLowerCase();
      const matchedCharacter = characters.find(
        (item) => item.name.toLocaleLowerCase() === normalizedCharacterName,
      );

      if (matchedCharacter) {
        params.set('character', matchedCharacter.id);
      } else {
        // 部分一致やキャラクター一覧の再取得前でも、名前で検索できるようにする
        params.set('q', character.trim());
      }
    }
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
          className="w-full rounded-full border border-[#EFE6DD] bg-[#FFFDF8] px-4 py-3 text-sm text-[#4A3B32] shadow-sm focus:border-primary focus:outline-none"
        />

        <div className="relative w-full max-w-xs">
          <input
            aria-label="キャラクター名で検索"
            aria-autocomplete="list"
            aria-controls="character-suggestions"
            value={character}
            onFocus={() => setShowCharacterSuggestions(true)}
            onChange={(e) => {
              setCharacter(e.target.value);
              setSelectedCharacterId('');
              setShowCharacterSuggestions(true);
            }}
            placeholder="キャラクター名"
            className="w-full rounded-full border border-[#EFE6DD] bg-[#FFFDF8] px-3 py-3 text-sm text-[#4A3B32] shadow-sm focus:border-primary focus:outline-none"
          />
          {showCharacterSuggestions && character.trim() && characterSuggestions.length > 0 && (
            <ul
              id="character-suggestions"
              role="listbox"
              className="absolute z-10 mt-1 max-h-52 w-full overflow-y-auto rounded-2xl border border-[#EFE6DD] bg-[#FFFDF8] py-1 shadow-lg"
              onMouseDown={(e) => e.preventDefault()}
            >
              {characterSuggestions.map((item) => (
                <li key={item.id} role="option" aria-selected={selectedCharacterId === item.id}>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-primary-50"
                    onClick={() => {
                      setCharacter(item.name);
                      setSelectedCharacterId(item.id);
                      setShowCharacterSuggestions(false);
                    }}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full max-w-xs rounded-full border border-[#EFE6DD] bg-[#FFFDF8] px-3 py-3 text-sm text-[#4A3B32]"
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
          className="w-full max-w-xs rounded-full border border-[#EFE6DD] bg-[#FFFDF8] px-3 py-3 text-sm text-[#4A3B32]"
        >
          <option value="">価格</option>
          <option value="0-1000">〜1,000円</option>
          <option value="1000-5000">1,000〜5,000円</option>
          <option value="5000-10000">5,000〜10,000円</option>
          <option value="10000+">10,000円〜</option>
        </select>

        <button
          type="submit"
          className="w-full max-w-xs rounded-full bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-600"
        >
          検索
        </button>
      </div>
    </form>
  );
}
