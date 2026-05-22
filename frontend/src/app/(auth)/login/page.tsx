import { Suspense } from 'react';
import LoginPageClient from './LoginPageClient';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-center text-gray-500">ログイン画面を読み込み中...</p>
        </div>
      }
    >
      <LoginPageClient />
    </Suspense>
  );
}
