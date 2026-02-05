'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/admin/dashboard', label: 'ダッシュボード', icon: '📊' },
  { href: '/admin/characters', label: 'キャラクター', icon: '🎨' },
  { href: '/admin/products', label: '商品', icon: '📦' },
  { href: '/admin/orders', label: '注文', icon: '📋' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-6">
        <Link href="/admin/dashboard" className="text-xl font-bold">
          管理画面
        </Link>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 hover:bg-gray-700 transition-colors ${
                isActive ? 'bg-gray-700 border-l-4 border-primary-500' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-0 w-64 p-6 border-t border-gray-700">
        <Link href="/" className="text-gray-400 hover:text-white text-sm">
          ← ユーザーサイトへ
        </Link>
      </div>
    </aside>
  );
}
