interface DashboardTabContentProps {
  stats: any;
  listings: any[];
  pendingTxs: any[];
  onToggleListing: (id: string, currentStatus: string) => void;
  onDeleteListing: (id: string) => void;
  onApproveTransaction: (txId: string, userId: string, amount: number) => void;
  onAddLog: (action: string, type: string, color: string, icon: string) => void;
}

export function DashboardTabContent({
  stats,
  listings,
  pendingTxs,
  onToggleListing,
  onDeleteListing,
  onApproveTransaction,
  onAddLog
}: DashboardTabContentProps) {
  return (
    <>
      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md mb-xl">
        <div className="bg-surface-white border border-border-light p-lg rounded-xl shadow-sm relative overflow-hidden flex justify-between items-center">
          <div>
            <p className="text-tertiary font-label-lg text-label-lg mb-1">إجمالي الإعلانات</p>
            <p className="font-headline-md text-headline-md text-on-surface">{stats?.listingsCount || 0}</p>
          </div>
          <div className="bg-green-50 p-2 rounded-lg text-green-600">
            <span className="material-symbols-outlined">trending_up</span>
          </div>
        </div>
        <div className="bg-surface-white border border-border-light p-lg rounded-xl shadow-sm relative overflow-hidden flex justify-between items-center">
          <div>
            <p className="text-tertiary font-label-lg text-label-lg mb-1">المستخدمون</p>
            <p className="font-headline-md text-headline-md text-on-surface">{stats?.usersCount || 0}</p>
          </div>
          <div className="bg-green-50 p-2 rounded-lg text-green-600">
            <span className="material-symbols-outlined">trending_up</span>
          </div>
        </div>
        <div className="bg-surface-white border border-border-light p-lg rounded-xl shadow-sm relative overflow-hidden flex justify-between items-center">
          <div>
            <p className="text-tertiary font-label-lg text-label-lg mb-1">الإيرادات</p>
            <p className="font-headline-md text-headline-md text-on-surface">{stats?.revenue?.toLocaleString() || 0} ل.س</p>
          </div>
          <div className="bg-primary-container/20 p-2 rounded-lg text-primary">
            <span className="material-symbols-outlined">trending_up</span>
          </div>
        </div>
      </div>

      {/* Pending / Active Ads Table */}
      <div className="bg-surface-white border border-border-light rounded-xl overflow-hidden shadow-sm mb-lg">
        <div className="p-md flex justify-between items-center border-b border-border-light">
          <h2 className="font-headline-sm text-headline-sm">إدارة الإعلانات (الأحدث)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-surface-container-low text-tertiary text-label-sm border-b border-border-light">
              <tr>
                <th className="p-md font-medium">اسم الإعلان</th>
                <th className="p-md font-medium">الفئة</th>
                <th className="p-md font-medium text-center">الحالة</th>
                <th className="p-md font-medium text-center">إجراءات</th>
                <th className="p-md font-medium">تاريخ النشر</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light text-body-sm">
              {listings.map(l => (
                <tr key={l.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="p-md font-bold">{l.title || `${l.make} ${l.model}`}</td>
                  <td className="p-md">{l.body_type || 'سيدان'}</td>
                  <td className="p-md text-center">
                    {l.status === 'active' ? (
                      <span className="bg-green-500 text-white px-3 py-0.5 rounded text-[11px] font-bold">فعال</span>
                    ) : l.status === 'pending' ? (
                      <span className="bg-orange-500 text-white px-3 py-0.5 rounded text-[11px] font-bold">بانتظار الموافقة</span>
                    ) : (
                      <span className="bg-gray-400 text-white px-3 py-0.5 rounded text-[11px] font-bold">غير فعال</span>
                    )}
                  </td>
                  <td className="p-md text-center">
                    <div className="flex items-center justify-center gap-2">
                      {l.status === 'pending' ? (
                        <button onClick={() => onToggleListing(l.id, l.status)} className="bg-green-500 text-white px-2 py-1 rounded text-[10px] hover:bg-green-600 transition-colors" title="قبول الإعلان">
                          قبول
                        </button>
                      ) : (
                        <button onClick={() => onToggleListing(l.id, l.status)} className="p-1 text-tertiary hover:text-primary transition-colors" title="تغيير الحالة">
                          <span className="material-symbols-outlined text-sm">{l.status === 'active' ? 'block' : 'check_circle'}</span>
                        </button>
                      )}
                      <button onClick={() => onDeleteListing(l.id)} className="p-1 text-tertiary hover:text-error transition-colors" title="حذف">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                  <td className="p-md text-tertiary">{new Date(l.created_at).toLocaleDateString('ar-EG')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Wallet Topups */}
      <div className="bg-surface-white border border-border-light rounded-xl overflow-hidden shadow-sm">
        <div className="p-md flex justify-between items-center border-b border-border-light">
          <h2 className="font-headline-sm text-headline-sm">طلبات شحن المحفظة المعلقة</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-surface-container-low text-tertiary text-label-sm border-b border-border-light">
              <tr>
                <th className="p-md font-medium">المستخدم</th>
                <th className="p-md font-medium">المبلغ</th>
                <th className="p-md font-medium">طريقة الدفع</th>
                <th className="p-md font-medium">تاريخ الطلب</th>
                <th className="p-md font-medium text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light text-body-sm">
              {pendingTxs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-md text-center text-tertiary">لا توجد طلبات معلقة</td>
                </tr>
              ) : (
                pendingTxs.map(tx => (
                  <tr key={tx.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="p-md font-bold">{tx.users?.name || 'مستخدم غير معروف'} <br/><span className="text-[11px] text-tertiary">{tx.users?.phone}</span></td>
                    <td className="p-md text-orange-500 font-bold">{tx.amount.toLocaleString()} ل.س</td>
                    <td className="p-md">{tx.method}</td>
                    <td className="p-md text-tertiary">{new Date(tx.created_at).toLocaleDateString('ar-EG')}</td>
                    <td className="p-md text-center">
                      <button onClick={() => onApproveTransaction(tx.id, tx.user_id, tx.amount)} className="bg-green-500 text-white px-md py-xs rounded hover:bg-green-600 transition-colors font-bold text-xs shadow-sm">
                        تأكيد الشحن
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
