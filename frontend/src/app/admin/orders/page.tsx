export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">注文管理</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">注文ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">顧客名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金額</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">注文日</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                注文がありません
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
