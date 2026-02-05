export default function CharactersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">キャラクター一覧</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* キャラクターカードをここに表示 */}
        <p className="text-gray-500 col-span-full text-center py-8">
          キャラクターを読み込み中...
        </p>
      </div>
    </div>
  );
}
