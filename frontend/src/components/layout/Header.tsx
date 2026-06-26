'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { setAccessToken } from '@/lib/api';
import { getCurrentUser } from '@/lib/shop-api';

const navigationItems = [
  { label: 'キャラクター', href: '/characters' },
  { label: '商品', href: '/products' },
  { label: 'カート', href: '/cart' },
  { label: '注文履歴', href: '/orders' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user, setUser, logout } = useAuthStore();

  const hydrated = useAuthStore.persist.hasHydrated();

      useEffect(() => {
    // 💡 完全にデータ復元（Hydration）が終わり、かつログインしている時だけシンプルにAPIを叩く
    if (hydrated && isAuthenticated) {
      getCurrentUser()
        .then((updatedUser) => {
          setUser(updatedUser);
        })
        .catch((err) => {
          // 401エラーが出ても、api.ts側で自動リフレッシュが走るため、
          // ここに到達したエラーは「完全に期限切れ」の場合のみになります。
          console.error('Failed to sync user session:', err);
        });
    }
    // 💡 依存配列から setUser と logout を除外し、画面遷移時の余計な再発火を防ぎます
  }, [hydrated, isAuthenticated]);



  const handleLogout = () => {
    setAccessToken(null);
    logout();
    router.push('/login');
  };

  if (!hydrated) {
    return <header className="bg-white shadow-md sticky top-0 z-50 h-16" />;
  }

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';
  const avatarStyle = user?.imageUrl
    ? { backgroundImage: `url("${user.imageUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary-600">
            キャラクターEC
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-primary-600"
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                href="/admin/dashboard"
                className="text-red-600 font-bold hover:text-red-800 transition-colors flex items-center gap-1"
              >
                📊 管理画面へ戻る
              </Link>
            )}
          </nav>

          {/* Auth Buttons / Avatar */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-800 overflow-hidden"
                  aria-label="ユーザーメニュー"
                  style={avatarStyle}
                >
                  {!user?.imageUrl && initial}
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg py-1 z-50">
                    {user?.role === 'admin' && (
                      <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-red-600 font-bold hover:bg-gray-100 border-b">
                        管理画面へ戻る
                      </Link>
                    )}
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      プロフィール設定
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      ログアウト
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-primary-600"
                >
                  ログイン
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                  新規登録
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 hover:text-primary-600"
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && user?.role === 'admin' && (
                <Link
                  href="/admin/dashboard"
                  className="text-red-600 font-bold hover:text-red-800 transition-colors"
                >
                  📊 管理画面へ戻る
                </Link>
              )}
              <hr />
              {isAuthenticated && user ? (
                <>
                  <Link href="/profile" className="text-gray-600 hover:text-primary-600">
                    プロフィール設定
                  </Link>
                  <button onClick={handleLogout} className="text-left text-gray-600 hover:text-primary-600">
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600 hover:text-primary-600">
                    ログイン
                  </Link>
                  <Link href="/register" className="text-primary-600 hover:text-primary-700">
                    新規登録
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
