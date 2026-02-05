import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">キャラクターEC</h3>
            <p className="text-gray-400 text-sm">
              お気に入りのキャラクターグッズを見つけよう
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">ショップ</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/characters" className="hover:text-white">
                  キャラクター
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white">
                  商品一覧
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">アカウント</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/login" className="hover:text-white">
                  ログイン
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white">
                  新規登録
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white">
                  注文履歴
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">サポート</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  お問い合わせ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  利用規約
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  プライバシーポリシー
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2026 キャラクターEC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
