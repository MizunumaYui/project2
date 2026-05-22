import Link from 'next/link';
import { fetchCharacters, fetchProducts } from '@/lib/shop-api';
import ProductsCarousel from '@/components/ProductsCarousel';
import SearchBar from '@/components/SearchBar';
import type { Character, Product } from '@/types';

function characterFallbackImage(name: string) {
  return `https://placehold.co/240x240/e5e7eb/374151?text=${encodeURIComponent(name)}`;
}

const heroBackgroundImage =
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#04111f" />
          <stop offset="55%" stop-color="#0a1b34" />
          <stop offset="100%" stop-color="#12284a" />
        </linearGradient>
        <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#93c5fd" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#f0abfc" stop-opacity="0.08" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#sky)" />
      <rect x="0" y="0" width="1600" height="900" fill="url(#glow)" />
      <g fill="#f8fafc" opacity="0.95">
        <rect x="90" y="110" width="10" height="10" />
        <rect x="170" y="220" width="8" height="8" />
        <rect x="260" y="80" width="9" height="9" />
        <rect x="360" y="180" width="7" height="7" />
        <rect x="440" y="130" width="10" height="10" />
        <rect x="520" y="240" width="8" height="8" />
        <rect x="620" y="100" width="7" height="7" />
        <rect x="760" y="160" width="10" height="10" />
        <rect x="910" y="120" width="8" height="8" />
        <rect x="1040" y="210" width="9" height="9" />
        <rect x="1160" y="90" width="8" height="8" />
        <rect x="1280" y="190" width="10" height="10" />
        <rect x="1410" y="140" width="7" height="7" />
        <rect x="1500" y="250" width="8" height="8" />
        <rect x="210" y="360" width="6" height="6" />
        <rect x="320" y="470" width="9" height="9" />
        <rect x="470" y="390" width="7" height="7" />
        <rect x="610" y="520" width="8" height="8" />
        <rect x="740" y="430" width="10" height="10" />
        <rect x="880" y="500" width="7" height="7" />
        <rect x="1010" y="360" width="8" height="8" />
        <rect x="1130" y="470" width="9" height="9" />
        <rect x="1260" y="410" width="7" height="7" />
        <rect x="1380" y="530" width="8" height="8" />
      </g>
      <g fill="#c4b5fd" opacity="0.9">
        <rect x="140" y="180" width="4" height="4" />
        <rect x="560" y="180" width="4" height="4" />
        <rect x="980" y="260" width="4" height="4" />
        <rect x="1320" y="320" width="4" height="4" />
        <rect x="220" y="640" width="4" height="4" />
        <rect x="760" y="680" width="4" height="4" />
        <rect x="1180" y="620" width="4" height="4" />
      </g>
      <g fill="#7dd3fc" opacity="0.9">
        <rect x="300" y="280" width="5" height="5" />
        <rect x="680" y="240" width="5" height="5" />
        <rect x="1180" y="210" width="5" height="5" />
        <rect x="430" y="620" width="5" height="5" />
        <rect x="980" y="580" width="5" height="5" />
      </g>
      <g fill="#fde68a">
        <rect x="1080" y="120" width="14" height="14" />
        <rect x="1085" y="108" width="4" height="4" />
        <rect x="1085" y="142" width="4" height="4" />
        <rect x="1070" y="125" width="4" height="4" />
        <rect x="1100" y="125" width="4" height="4" />
        <rect x="1450" y="430" width="12" height="12" />
        <rect x="1454" y="418" width="4" height="4" />
        <rect x="1454" y="446" width="4" height="4" />
        <rect x="1442" y="434" width="4" height="4" />
        <rect x="1466" y="434" width="4" height="4" />
      </g>
      <g opacity="0.28" fill="#38bdf8">
        <rect x="0" y="760" width="1600" height="140" />
      </g>
      <g opacity="0.35" fill="#1d4ed8">
        <rect x="0" y="820" width="1600" height="80" />
      </g>
    </svg>
  `)}`;

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
    }

    if (productsResult.status === 'fulfilled') {
      products = productsResult.value;
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }

  console.log('[Home] characters count:', characters.length);

  const topCharacters = characters.slice(0, 5);

  return (
    <div className="flex flex-1 flex-col items-center bg-gray-50">
      <div className="flex flex-col w-full max-w-7xl px-4 md:px-10 lg:px-20 py-5 gap-6">
        {/* 検索バー */}
        <div className="w-full">
          <SearchBar
            characters={characters}
            categories={categories.map((c) => c.name)}
          />
        </div>

        <div className="flex flex-col w-full gap-10">
        {/* ヒーローセクション */}
        <section className="w-full">
          <div
            className="relative flex min-h-[400px] w-full flex-col justify-end overflow-hidden rounded-xl bg-cover bg-center p-8 md:p-12 shadow-sm"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%), url("${heroBackgroundImage}")`
            }}
          >
            <div className="flex max-w-lg flex-col gap-4">
              <span className="inline-flex w-fit items-center rounded-full bg-primary/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                新シーズン
              </span>
              <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-lg">
                お気に入りの<span className="text-primary-300">キャラクターグッズ</span>を見つけよう
              </h1>
              <p className="text-base font-medium text-gray-100 md:text-lg drop-shadow-md max-w-md">
                人気アニメやゲームの公式グッズ、フィギュア、限定アクセサリーなど、魅力的なアイテムが勢揃い。
              </p>
              <Link
                href="/products"
                className="mt-4 w-fit rounded-lg bg-primary px-8 py-3 text-base font-bold text-white shadow-lg shadow-pink-500/30 transition-all hover:bg-primary-600 hover:scale-105"
              >
                今すぐ購入
              </Link>
            </div>
          </div>
        </section>

        {/* カテゴリセクション */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-900">カテゴリから探す</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md cursor-pointer"
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
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight relative">
            新着商品
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
