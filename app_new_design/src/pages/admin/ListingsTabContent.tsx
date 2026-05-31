import { deleteListing, updateListingStatus } from '../../lib/queries/index';

interface ListingsTabContentProps {
  listings: any[];
  setListings: (listings: any[]) => void;
  onAddLog: (action: string, type: string, color: string, icon: string) => void;
}

export function ListingsTabContent({ listings, setListings, onAddLog }: ListingsTabContentProps) {
  const handleToggleListing = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateListingStatus(id, newStatus);
      setListings(listings.map(l => l.id === id ? { ...l, status: newStatus } : l));
      onAddLog(`تغيير حالة إعلان إلى ${newStatus === 'active' ? 'مفعل' : 'معطل'}`, 'edit', 'blue', 'toggle_on');
    } catch (error) {
      console.error('Error toggling listing:', error);
      alert('حدث خطأ أثناء تحديث حالة الإعلان');
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الإعلان نهائياً؟')) return;
    try {
      await deleteListing(id);
      setListings(listings.filter(l => l.id !== id));
      onAddLog('حذف إعلان', 'delete', 'red', 'delete');
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('حدث خطأ أثناء حذف الإعلان');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">الإعلانات ({listings.length})</h3>

      {listings.length === 0 ? (
        <p className="text-gray-500">لا توجد إعلانات</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-right p-2">الاسم</th>
                <th className="text-right p-2">النوع</th>
                <th className="text-right p-2">السعر</th>
                <th className="text-right p-2">الحالة</th>
                <th className="text-center p-2">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {listings.map(listing => (
                <tr key={listing.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{listing.title}</td>
                  <td className="p-2">{listing.car_make}</td>
                  <td className="p-2">{listing.price} ل.س</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {listing.status === 'active' ? 'مفعل' : 'معطل'}
                    </span>
                  </td>
                  <td className="p-2 flex gap-2 justify-center">
                    <button
                      onClick={() => handleToggleListing(listing.id, listing.status)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      تبديل
                    </button>
                    <button
                      onClick={() => handleDeleteListing(listing.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
