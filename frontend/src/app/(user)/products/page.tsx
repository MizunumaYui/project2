export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">商品一覧</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* 商品カードをここに表示 */}
        <p className="text-gray-500 col-span-full text-center py-8">
          商品を読み込み中...
        </p>
      </div>
    </div>
  );
}
