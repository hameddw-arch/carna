interface ServicesTabContentProps {
  services: any[];
  onToggleService: (id: string, currentStatus: boolean) => void;
  onDeleteService: (id: string) => void;
  onAddLog: (action: string, type: string, color: string, icon: string) => void;
}

export function ServicesTabContent({
  services,
  onToggleService,
  onDeleteService,
  onAddLog
}: ServicesTabContentProps) {
  return (
    <div className="bg-surface-white border border-border-light rounded-xl overflow-hidden shadow-sm">
      <div className="p-md border-b border-border-light">
        <h2 className="font-headline-sm text-headline-sm">الخدمات ({services.length})</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-surface-container-low text-tertiary text-label-sm border-b border-border-light">
            <tr>
              <th className="p-md font-medium">اسم الخدمة</th>
              <th className="p-md font-medium">نوع المستخدم</th>
              <th className="p-md font-medium">السعر</th>
              <th className="p-md font-medium text-center">الحالة</th>
              <th className="p-md font-medium text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light text-body-sm">
            {services.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-md text-center text-tertiary">لا توجد خدمات</td>
              </tr>
            ) : (
              services.map(svc => (
                <tr key={svc.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="p-md font-bold">{svc.name}</td>
                  <td className="p-md">{svc.user_type === 'seller' ? 'بائع' : 'مشتري'}</td>
                  <td className="p-md text-tertiary">{svc.price} ل.س</td>
                  <td className="p-md text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold text-white
                      ${svc.is_active ? 'bg-green-500' : 'bg-gray-400'}`}>
                      {svc.is_active ? 'فعال' : 'معطل'}
                    </span>
                  </td>
                  <td className="p-md text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onToggleService(svc.id, svc.is_active)}
                        className="p-1 text-tertiary hover:text-primary transition-colors"
                        title={svc.is_active ? 'تعطيل' : 'تفعيل'}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {svc.is_active ? 'visibility' : 'visibility_off'}
                        </span>
                      </button>
                      <button
                        onClick={() => onDeleteService(svc.id)}
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
