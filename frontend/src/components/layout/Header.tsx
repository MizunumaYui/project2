'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <Link href="/characters" className="text-gray-600 hover:text-primary-600">
              キャラクター
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-primary-600">
              商品
            </Link>
            <Link href="/cart" className="text-gray-600 hover:text-primary-600">
              カート
            </Link>
            <Link href="/orders" className="text-gray-600 hover:text-primary-600">
              注文履歴
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link href="/characters" className="text-gray-600 hover:text-primary-600">
                キャラクター
              </Link>
              <Link href="/products" className="text-gray-600 hover:text-primary-600">
                商品
              </Link>
              <Link href="/cart" className="text-gray-600 hover:text-primary-600">
                カート
              </Link>
              <Link href="/orders" className="text-gray-600 hover:text-primary-600">
                注文履歴
              </Link>
              <hr />
              <Link href="/login" className="text-gray-600 hover:text-primary-600">
                ログイン
              </Link>
              <Link href="/register" className="text-primary-600 hover:text-primary-700">
                新規登録
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
