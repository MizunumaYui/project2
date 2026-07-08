'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { updateProfile, uploadProfileImage } from '@/lib/shop-api';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [imageUrl, setImageUrl] = useState(user?.imageUrl ?? '');
  const [previewUrl, setPreviewUrl] = useState(user?.imageUrl ?? '');
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setImageUrl(user?.imageUrl ?? '');
    setPreviewUrl(user?.imageUrl ?? '');
  }, [user]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setMessage(null);
    setIsUploading(true);

    uploadProfileImage(file)
      .then(({ user: updatedUser, imageUrl: uploadedImageUrl }) => {
        setUser(updatedUser);
        setImageUrl(uploadedImageUrl);
        setPreviewUrl(uploadedImageUrl);
        setMessage('プロフィール画像をアップロードしました。');
      })
      .catch((err: any) => {
        console.error(err);
        setPreviewUrl(user?.imageUrl ?? '');
        setMessage(err?.response?.data?.errors?.join(', ') ?? err?.response?.data?.error ?? '画像のアップロードに失敗しました。');
      })
      .finally(() => {
        setIsUploading(false);
        URL.revokeObjectURL(objectUrl);
      });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const updated = await updateProfile({ name, email, image_url: imageUrl || null });
      setUser(updated);
      setMessage('プロフィールを保存しました。');
    } catch (err: any) {
      console.error(err);
      setMessage(err?.response?.data?.errors?.join(', ') ?? '保存に失敗しました。');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">プロフィール設定</h1>
      <div className="mb-6 flex items-center gap-4">
        <div
          className="h-20 w-20 rounded-full bg-gray-200 bg-cover bg-center border border-gray-200"
          style={previewUrl ? { backgroundImage: `url("${previewUrl}")` } : undefined}
        />
        <div className="text-sm text-gray-600">
          <p className="font-semibold text-gray-800">プロフィール画像</p>
        </div>
      </div>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">表示名</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">プロフィール画像URL</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="https://... もしくは data:image/..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">画像ファイルから選ぶ</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
            className="w-full px-3 py-2 border rounded"
          />
          {isUploading && <p className="mt-2 text-sm text-gray-500">アップロード中...</p>}
        </div>
        <div>
          <button className="bg-primary-600 text-white px-4 py-2 rounded">保存</button>
        </div>
        {message && <div className="text-sm text-green-600">{message}</div>}
      </form>
    </div>
  );
}
