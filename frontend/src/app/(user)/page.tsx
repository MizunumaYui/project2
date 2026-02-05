import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            キャラクターEC
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            お気に入りのキャラクターグッズを見つけよう
          </p>
          <Link
            href="/characters"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            キャラクターを見る
          </Link>
        </div>
      </section>

      {/* フィーチャーセクション */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">サービスの特徴</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">豊富なキャラクター</h3>
              <p className="text-gray-600">
                人気キャラクターのグッズを多数取り揃えています
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">迅速な配送</h3>
              <p className="text-gray-600">
                ご注文から最短翌日にお届けします
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">💝</div>
              <h3 className="text-xl font-semibold mb-2">安心のサポート</h3>
              <p className="text-gray-600">
                お問い合わせには迅速に対応いたします
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
