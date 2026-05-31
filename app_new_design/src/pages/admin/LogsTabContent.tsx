interface LogsTabContentProps {
  activityLogs: any[];
}

export function LogsTabContent({ activityLogs }: LogsTabContentProps) {
  return (
    <div className="bg-surface-white border border-border-light rounded-xl overflow-hidden shadow-sm">
      <div className="p-md border-b border-border-light">
        <h2 className="font-headline-sm text-headline-sm">سجل الأنشطة ({activityLogs.length})</h2>
      </div>
      <div className="divide-y divide-border-light">
        {activityLogs.length === 0 ? (
          <div className="p-md text-center text-tertiary">لا توجد أنشطة مسجلة</div>
        ) : (
          activityLogs.map(log => {
            const bgColor = log.color === 'blue' ? 'bg-blue-50' : log.color === 'green' ? 'bg-green-50' : 'bg-red-50';
            const iconColor = log.color === 'blue' ? 'text-blue-500' : log.color === 'green' ? 'text-green-500' : 'text-red-500';

            return (
              <div key={log.id} className={`p-md flex gap-md ${bgColor}`}>
                <div className={`p-2 rounded-lg ${iconColor}`}>
                  <span className="material-symbols-outlined text-lg">{log.icon}</span>
                </div>
                <div className="flex-grow">
                  <p className="font-label-lg font-bold">{log.action}</p>
                  <p className="text-body-sm text-tertiary">
                    {log.users?.name || 'Admin'} • {new Date(log.created_at).toLocaleDateString('ar-EG')}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold text-white
                  ${log.type === 'create' ? 'bg-green-500' : log.type === 'edit' ? 'bg-blue-500' : 'bg-red-500'}`}>
                  {log.type === 'create' ? 'إضافة' : log.type === 'edit' ? 'تعديل' : 'حذف'}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
