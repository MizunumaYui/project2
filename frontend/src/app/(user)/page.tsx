import Link from 'next/link';
import { fetchCharacters, fetchProducts } from '@/lib/shop-api';
import ProductsCarousel from '@/components/ProductsCarousel';
import SearchBar from '@/components/SearchBar';
import type { Character, Product } from '@/types';

export const dynamic = 'force-dynamic';


const heroBackgroundImage = '/home_bg.jpg';

// カテゴリデータ
const categories = [
  { name: 'フィギュア', href: '/products?category=フィギュア', icon: 'toys', bgColor: 'bg-blue-50', hoverBgColor: 'hover:bg-accent-blue', textColor: 'text-accent-blue' },
  { name: 'アクリルスタンド', href: '/products?category=アクリルスタンド', icon: 'image', bgColor: 'bg-pink-50', hoverBgColor: 'hover:bg-accent-pink', textColor: 'text-accent-pink' },
  { name: '缶バッジ', href: '/products?category=缶バッジ', icon: 'local_activity', bgColor: 'bg-purple-50', hoverBgColor: 'hover:bg-purple-600', textColor: 'text-purple-600' },
  { name: 'アパレル', href: '/products?category=アパレル', icon: 'checkroom', bgColor: 'bg-yellow-50', hoverBgColor: 'hover:bg-yellow-500', textColor: 'text-yellow-600' },
  { name: '書籍', href: '/products?category=書籍', icon: 'book', bgColor: 'bg-green-50', hoverBgColor: 'hover:bg-green-600', textColor: 'text-green-600' },
  { name: 'もっと見る', href: '/products', icon: 'more_horiz', bgColor: 'bg-gray-50', hoverBgColor: 'hover:bg-gray-600', textColor: 'text-gray-600' },
];

export default async function Home() {
  let characters: Character[] = [];
  let products: Product[] = [];

  try {
    // API からキャラクターと商品を取得
    const [charactersResult, productsResult] = await Promise.allSettled([
      fetchCharacters(),
      fetchProducts(),
    ]);

    if (charactersResult.status === 'fulfilled') {
      characters = charactersResult.value;
      console.log('[Home] characters fetched successfully:', characters.length);
    } else {
      console.error('[Home] characters fetch failed:', charactersResult.reason);
    }

    if (productsResult.status === 'fulfilled') {
      products = productsResult.value;
      console.log('[Home] products fetched successfully:', products.length);
    } else {
      console.error('[Home] products fetch failed:', productsResult.reason);
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }

  const categoryNames = categories.map((category) => category.name);

  return (
    <div className="flex flex-1 flex-col items-center bg-[#FDF9F3] text-[#4A3B32]">
      <div className="flex flex-col w-full max-w-7xl px-4 md:px-10 lg:px-20 py-5 gap-6">
        {/* 検索バー */}
        <div className="w-full">
          <SearchBar
            characters={characters}
            categories={categoryNames}
          />
        </div>

        <div className="flex flex-col w-full gap-10">
        {/* ヒーローセクション */}
        <section className="w-full">
          <div
            className="relative flex min-h-[400px] w-full flex-col justify-end overflow-hidden rounded-xl bg-cover bg-center p-8 md:p-12 shadow-sm"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%), url(${heroBackgroundImage})`
            }}
          >
            <div className="flex max-w-lg flex-col gap-4">
              <span className="inline-flex w-fit items-center rounded-full bg-primary/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                新シーズン
              </span>
              <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-lg">
                お気に入りの<span className="text-primary-300">キャラクター</span>といつでも一緒！
              </h1>
              <p className="text-base font-medium text-gray-100 md:text-lg drop-shadow-md max-w-md">
                限定フィギュアやアクセサリーなど魅力的なアイテムがたくさんあるよ～
              </p>
              <Link
                href="/products"
                className="mt-4 w-fit rounded-full bg-primary px-8 py-3 text-base font-bold text-white shadow-lg shadow-primary-300/40 transition-all hover:bg-primary-600 hover:scale-105"
              >
                今すぐ購入
              </Link>
            </div>
          </div>
        </section>

        {/* カテゴリセクション */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-[#4A3B32]">＊ カテゴリから探す ＊</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#EFE6DD] bg-[#FFFDF8] p-4 transition-all hover:border-primary hover:shadow-md cursor-pointer"
              >
                <div className={`flex size-12 items-center justify-center rounded-full ${category.bgColor} ${category.textColor} group-hover:bg-primary group-hover:text-white transition-colors`}>
                  <span className="material-symbols-outlined">{category.icon}</span>
                </div>
                <span className="text-sm font-bold text-gray-700">{category.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 人気キャラクターセクションは表示しない */}

        {/* 新着商品セクション */}
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-[#4A3B32] tracking-tight relative">
            ＊ 新着アイテム ＊
            <span className="absolute -bottom-[9px] left-0 h-1 w-12 bg-primary rounded-full"></span>
          </h2>
          {/* デバッグ用メッセージはクライアントフォールバックで商品が取得されるため削除しました */}
          <ProductsCarousel products={products} />
        </section>
        </div>
      </div>
    </div>
  );
}
