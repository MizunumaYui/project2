import Link from 'next/link';

// カテゴリデータ
const categories = [
  { name: 'フィギュア', icon: 'toys', bgColor: 'bg-blue-50', hoverBgColor: 'hover:bg-accent-blue', textColor: 'text-accent-blue' },
  { name: 'アクリルスタンド', icon: 'image', bgColor: 'bg-pink-50', hoverBgColor: 'hover:bg-accent-pink', textColor: 'text-accent-pink' },
  { name: '缶バッジ', icon: 'local_activity', bgColor: 'bg-purple-50', hoverBgColor: 'hover:bg-purple-600', textColor: 'text-purple-600' },
  { name: 'アパレル', icon: 'checkroom', bgColor: 'bg-yellow-50', hoverBgColor: 'hover:bg-yellow-500', textColor: 'text-yellow-600' },
  { name: '書籍', icon: 'book', bgColor: 'bg-green-50', hoverBgColor: 'hover:bg-green-600', textColor: 'text-green-600' },
  { name: 'もっと見る', icon: 'more_horiz', bgColor: 'bg-gray-50', hoverBgColor: 'hover:bg-gray-600', textColor: 'text-gray-600' },
];

// 人気キャラクターデータ
const popularCharacters = [
  { name: '初音ミク', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjYifIkoe_ROgQF7DaXDiYg1EXRRV1yd5s26psGtwGtxb2LLoakZkG4wKCMFy2WQlA5WVGPMxr07t1rXbzeSk5nFNu_yJrXGKbrPFYnGo1EdAtv_qoH9e3Ht7EYkInACfZ9DjSMZAf2j-QI56LIDtVl5MegkunWbg-csIxe_mnThJntAlcDNNAvBCbe1Ue6__ZgwSLusAQl47p3tiTRaq_yW9Oc32rHRVe25Ue5OdcN5XcUuMbgSplOR0plW0EKUciteCTtgTnmYYK' },
  { name: 'ナルト', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrbKrEuIMgkM8hMfknD-kRwqFQZo1eSC_t_4uw20gjOw6c7h8Z1gC7yIJAZfISJgSBy0pl9nsCij7tuYxo1_Zbd_4MwcIM4nufw3SreMYQSdjeMUSiueu5-CIL4DeBm-Jaso4hyypoJks81IGpo1nP930noHTQfuYd2bFt0bfYuLvF8Ig3iNGyY5dMlrWzfw9m90zw4lO6LiNPFE5bPxqTIEujurLmFqSwv7_E2zuIrtTm_0uHYAUzgR3UzEHnQSAewPOJXuIwNz4f' },
  { name: 'ルフィ', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbFfVS6jmiAvIBTbAc-sy9Gn8Fp8MK1ja1mBBScZFxuqcWKvdI2BmQ0SIKL0BbkJ0UO8Ez6k2JvHya68_HXjbOx6zQZtCJcW1jPIoM9MJul39w6EYPvLrOFEuYhElBA5H3yM_iakNd-dy7-L1k_kBQuhgNwkKBjMxc4bwAFBo2b-_MuLJt5gkD1Ug4boVUKcF7cW7J5fG_sB1aPt62JXX5iEjiOAo7I4bE6fzCaF4QkIuCp3TdnEErgmnPjEnbeuxFMEJB8EWg2tiF' },
  { name: '悟空', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBREJEngMHggXsFDi7ikgIS-Y1DIFxBYDkt83HmsHf4gXA0xxeoBp0WLBrP3RYB_JXKJgwxqmJZePFDJpsUccpxIst49V6fefib4v6mS4t8sa04GP_AGp1qmICw_GGy0wKG6TaSSOuLLXTTd71KNmcpnnNbL-Sgc34YJ8t26Erj_oSw6M2EAhqazOwx1hcCTaf6hBnuYoFE9kjI5-ebzpuPmrS3WMQ4VwaQ45aMHJBz7TAnRN5zmM9yhai8uPkI3qMppHIfz-X4jOUH' },
  { name: 'セーラームーン', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn07ArWsovPiGkpmzXurEAzLoxEXp-ntx7SEoYbS8Xmg9LdZyaU36K_colTbYRnNoEeObMB8yJxlyqGk8B0nglBczvX3XzF4UtgYgCR6b7qBTo8G1Rn045JqNnc6kaBfuwe7VlJBz68U1N3LLWZKNiWWpEFs7uUGVT81kICCGVimhqyDKDW784IO6l_W4GM0vbNUG9cSEaMU-8fU9nsmhOGhoK-ZRgxn9dscDC5Fug-wsMq_kROM-1RU9i3KlKipWrwlkEQoRvnbao' },
];

// 新着商品データ
const newProducts = [
  {
    name: 'サイバーフューチャー・ウォリアー 1/7スケール',
    category: 'フィギュア',
    price: 15800,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYVqO9XkC4tHB4OYouFDCmUoSrixlH3-PEY-eZp2rJwgHpBv8Blxr-jsws03rUbs-YQXWL-qLPuGYlAS9hYpbMLrSuwFQqBD5_lwfo6EVoaeQ1Zqla5J3Yn0Y9JasBk8lUMwJVBXkDAbSkwA5Ha9p-OlH5LRg5yZYOJAN362TD10sR1Av1QWOniEudHxF-a2jBY7ex1QAaLzzIsGPYLWZkdIMpfEY-yajs8VNZ4qonEQZB-EB-HmOnpgedtW1oDU59MijyyVaklrjt',
    badge: '新着',
    badgeColor: 'bg-primary',
  },
  {
    name: 'ヒーローアカデミア限定アクリルスタンド',
    category: 'アクリルスタンド',
    price: 1500,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDw9vU59-Y7oUmK2sfC08IfbI1N-6TetiF7azKVNhRZXzpQen236Fahuj_XlNjXZZXsoxhxS7LC1ONvNAnwSxDh7f8U6FqlfwTTi58sanfPQhYKrEOPV3qh2iEJ-tfQvPWjV1CyWaQMSDe_Xk9vHhzD6syYbY66xcxb4KANltCXlQKpspaqlLFk8tX1CawoBoHe-RtaUClJpBsx9TjjR7s5CarjxkVoMgIEb831bFkLnx4fS5KtN1TsJLa9SrPdf3Bp_nhCipgmhyxI',
  },
  {
    name: '魔法少女マスコット特大ぬいぐるみ',
    category: 'ぬいぐるみ',
    price: 4200,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWLuuZgmPG_jO3VDYvfHK-Jx6cdrCTm0DYLdCDC3osmCR1XQZH1huwgH53uLIsdwuuXfBbO-24TPi_hzKm9KQawX8S8pW66VzlBwvYmZKaF_hPL7cbIzE__z3BL5FnWD3kEU5nR0B6HSn4le1SFUQ44mQhISYtYqDPLIxLzVPq9BNZlNa2SXGI_JFmVrFCkvzJn4MXKbVxJlG66iTVgPUY0FGZ1DOJQFHG_2wE_CNyHG5xij9V_xkSxfQXXsal9xuP1hJrL79JCJBf',
    badge: '予約商品',
    badgeColor: 'bg-accent-blue',
  },
  {
    name: 'アニバーサリーホログラム缶バッジセット',
    category: '缶バッジ',
    price: 800,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCvNaxCAAfnCsg8EOWFUsOEFlHOS3kA0LE1CcNyFNXc238GRRX0oS4KNoUDJVg25EgnGUEEKNt9115QAM9_IJ9XZERdKZydTHKhBfewJPC4oTGEPNdSSv9GNO-GhoWSFx7kaOT3XU79VeMGNmMQ5gT-L_NDn3myI4PEzEwQaY2Gu8qWC1AYyrGBeX8AoWdh5Tw1bzJrHaYkpnhbXB2ivALn-8rRInTPOjM6vI4ETEFea7oWwLxmnwDkcmQLZMeOpD1mseH7ifZbiMN',
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-gray-50">
      <div className="flex flex-col w-full max-w-7xl px-4 md:px-10 lg:px-20 py-5 gap-10">
        {/* ヒーローセクション */}
        <section className="w-full">
          <div
            className="relative flex min-h-[400px] w-full flex-col justify-end overflow-hidden rounded-xl bg-cover bg-center p-8 md:p-12 shadow-sm"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuD-fozXKEm779dRF5Exrdfe6jzw8a_riPw-EHQkJr2d-_BfDmtVELmrUT2XjcB7d4JzIR0Cv8S9zrab67kMCJmqfeyuivbZfBfj_vaTo0fyk_TsHO-gz-w2z8No71E36M1bcORVmiaWaOjV6MUYBtKIfd_JsR0G6iurVPaKyVjVuRmiRlB2TBj4cu2yD-TtsJU5T-srSvBTxrO13XP7uwVZK1cBMsJicZrZabBqfR7l9niX9gaHAhttDmKwfrxYhc6vBjCOVE253KTM")`
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
                href={`/products?category=${category.name}`}
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

        {/* 人気キャラクターセクション */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">人気キャラクター</h2>
            <Link href="/characters" className="text-sm font-medium text-accent-blue hover:text-blue-600">
              すべて見る
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {popularCharacters.map((character) => (
              <Link
                key={character.name}
                href={`/characters/${character.name}`}
                className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div
                  className="aspect-square w-24 rounded-full bg-cover bg-center border-2 border-transparent group-hover:border-primary transition-all"
                  style={{ backgroundImage: `url("${character.image}")` }}
                />
                <h3 className="text-base font-bold text-gray-900">{character.name}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* 新着商品セクション */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight relative">
              新着商品
              <span className="absolute -bottom-[9px] left-0 h-1 w-12 bg-primary rounded-full"></span>
            </h2>
            <div className="flex gap-2">
              <button className="flex size-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
              </button>
              <button className="flex size-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <Link
                key={product.name}
                href={`/products/${product.name}`}
                className="group flex flex-col rounded-xl bg-white shadow-sm border border-transparent hover:border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                  {product.badge && (
                    <span className={`absolute top-3 left-3 z-10 rounded ${product.badgeColor} px-2 py-1 text-[10px] font-bold uppercase text-white`}>
                      {product.badge}
                    </span>
                  )}
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url("${product.image}")` }}
                  />
                  <button className="absolute bottom-3 right-3 flex size-10 translate-y-12 items-center justify-center rounded-full bg-white text-primary shadow-lg transition-all duration-300 group-hover:translate-y-0 hover:bg-primary hover:text-white">
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                  </button>
                </div>
                <div className="flex flex-col p-4">
                  <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                  <h3 className="mb-2 text-base font-bold text-gray-900 line-clamp-2 min-h-[3rem]">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-primary">
                      ¥{product.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
