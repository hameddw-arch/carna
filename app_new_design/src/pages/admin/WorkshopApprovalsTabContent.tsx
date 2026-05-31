interface WorkshopApprovalsTabContentProps {
  pendingWorkshops: any[];
  onApproveWorkshop: (id: string) => void;
  onRejectWorkshop: (id: string) => void;
  onAddLog: (action: string, type: string, color: string, icon: string) => void;
}

export function WorkshopApprovalsTabContent({
  pendingWorkshops,
  onApproveWorkshop,
  onRejectWorkshop,
  onAddLog
}: WorkshopApprovalsTabContentProps) {
  return (
    <div className="bg-surface-white border border-border-light rounded-xl overflow-hidden shadow-sm">
      <div className="p-md border-b border-border-light">
        <h2 className="font-headline-sm text-headline-sm">موافقات الورش ({pendingWorkshops.length})</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-surface-container-low text-tertiary text-label-sm border-b border-border-light">
            <tr>
              <th className="p-md font-medium">اسم الورشة</th>
              <th className="p-md font-medium">المدرب</th>
              <th className="p-md font-medium">التاريخ</th>
              <th className="p-md font-medium">الوصف</th>
              <th className="p-md font-medium text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light text-body-sm">
            {pendingWorkshops.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-md text-center text-tertiary">لا توجد ورش بانتظار الموافقة</td>
              </tr>
            ) : (
              pendingWorkshops.map(ws => (
                <tr key={ws.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="p-md font-bold">{ws.title}</td>
                  <td className="p-md">{ws.instructor_name}</td>
                  <td className="p-md text-tertiary">{new Date(ws.date).toLocaleDateString('ar-EG')}</td>
                  <td className="p-md truncate max-w-xs">{ws.description}</td>
                  <td className="p-md text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onApproveWorkshop(ws.id)}
                        className="bg-green-500 text-white px-md py-xs rounded hover:bg-green-600 transition-colors font-bold text-xs"
                        title="قبول"
                      >
                        قبول
                      </button>
                      <button
                        onClick={() => onRejectWorkshop(ws.id)}
                        className="bg-red-500 text-white px-md py-xs rounded hover:bg-red-600 transition-colors font-bold text-xs"
                        title="رفض"
                      >
                        رفض
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
