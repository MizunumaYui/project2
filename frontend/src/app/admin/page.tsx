import { redirect } from 'next/navigation';

export default function AdminRootPage() {
  // 💡 /admin に来たら、即座にサイドバーの一番上にある '/admin/dashboard' へ転送する
  redirect('/admin/dashboard');
}