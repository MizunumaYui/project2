'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { login } from '@/lib/shop-api';
import { useAuthStore } from '@/stores/authStore';
import { setAccessToken } from '@/lib/api';

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login: setAuthLogin } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ログインフォーム送信:', { email, password });
    setError(null);
    setIsLoading(true);

    try {
      console.log('ログイン API 呼び出し中...');
      const response = await login(email, password);
      console.log('ログイン成功:', response);
      setAccessToken(response.token);
      setAuthLogin(response.user, response.token);
      
      // 💡 管理者かどうかでリダイレクト先を分岐
      let redirect = searchParams.get('redirect');
      
      if (response.user && response.user.role === 'admin') {
        // 管理者の場合は強制的にダッシュボードへ（URLの指定を優先したい場合は条件を調整してください）
        redirect = '/admin';
      } else if (!redirect) {
        // 一般ユーザーでリダイレクト先の指定がなければトップページへ
        redirect = '/';
      }

      console.log('リダイレクト先:', redirect);
      router.push(redirect);
    } catch (error) {
      console.error('ログインエラー:', error);
      setError('メールアドレスまたはパスワードが正しくありません。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold text-center mb-6">ログイン</h1>
      
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          onClick={() => console.log('login button clicked')}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
        <p className="font-semibold mb-2">テストアカウント:</p>
        <p>メール: user@example.com</p>
        <p>パスワード: password123</p>
      </div>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        アカウントをお持ちでないですか？{' '}
        <Link href="/register" className="text-primary-600 hover:underline">
          新規登録
        </Link>
      </p>
    </div>
  );
}
