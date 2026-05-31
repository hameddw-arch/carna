interface WorkshopsTabContentProps {
  workshops: any[];
  onToggleWorkshop: (id: string, currentStatus: boolean) => void;
  onDeleteWorkshop: (id: string) => void;
  onAddLog: (action: string, type: string, color: string, icon: string) => void;
}

export function WorkshopsTabContent({
  workshops,
  onToggleWorkshop,
  onDeleteWorkshop,
  onAddLog
}: WorkshopsTabContentProps) {
  return (
    <div className="bg-surface-white border border-border-light rounded-xl overflow-hidden shadow-sm">
      <div className="p-md border-b border-border-light">
        <h2 className="font-headline-sm text-headline-sm">الورش ({workshops.length})</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-surface-container-low text-tertiary text-label-sm border-b border-border-light">
            <tr>
              <th className="p-md font-medium">اسم الورشة</th>
              <th className="p-md font-medium">المدرب</th>
              <th className="p-md font-medium">التاريخ</th>
              <th className="p-md font-medium text-center">الحالة</th>
              <th className="p-md font-medium text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light text-body-sm">
            {workshops.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-md text-center text-tertiary">لا توجد ورش</td>
              </tr>
            ) : (
              workshops.map(ws => (
                <tr key={ws.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="p-md font-bold">{ws.title}</td>
                  <td className="p-md">{ws.instructor_name}</td>
                  <td className="p-md text-tertiary">{new Date(ws.date).toLocaleDateString('ar-EG')}</td>
                  <td className="p-md text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold text-white
                      ${ws.is_active ? 'bg-green-500' : 'bg-gray-400'}`}>
                      {ws.is_active ? 'فعال' : 'معطل'}
                    </span>
                  </td>
                  <td className="p-md text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onToggleWorkshop(ws.id, ws.is_active)}
                        className="p-1 text-tertiary hover:text-primary transition-colors"
                        title={ws.is_active ? 'تعطيل' : 'تفعيل'}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {ws.is_active ? 'toggle_on' : 'toggle_off'}
                        </span>
                      </button>
                      <button
                        onClick={() => onDeleteWorkshop(ws.id)}
                        className="p-1 text-tertiary hover:text-error transition-colors"
                        title="حذف"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
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
