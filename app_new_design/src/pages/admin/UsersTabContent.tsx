interface UsersTabContentProps {
  allUsers: any[];
  userSearch: string;
  onUserSearchChange: (search: string) => void;
  onToggleUserAdmin: (userId: string, currentIsAdmin: boolean) => void;
  onAddLog: (action: string, type: string, color: string, icon: string) => void;
}

export function UsersTabContent({
  allUsers,
  userSearch,
  onUserSearchChange,
  onToggleUserAdmin,
  onAddLog
}: UsersTabContentProps) {
  const filteredUsers = allUsers.filter(u =>
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.name?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="bg-surface-white border border-border-light rounded-xl overflow-hidden shadow-sm">
      <div className="p-md border-b border-border-light space-y-md">
        <h2 className="font-headline-sm text-headline-sm">المستخدمون ({allUsers.length})</h2>
        <input
          type="text"
          placeholder="ابحث عن مستخدم..."
          value={userSearch}
          onChange={(e) => onUserSearchChange(e.target.value)}
          className="w-full px-md py-sm rounded border border-border-light text-body-sm"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-surface-container-low text-tertiary text-label-sm border-b border-border-light">
            <tr>
              <th className="p-md font-medium">الاسم</th>
              <th className="p-md font-medium">البريد الإلكتروني</th>
              <th className="p-md font-medium">رقم الهاتف</th>
              <th className="p-md font-medium">الدور</th>
              <th className="p-md font-medium text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light text-body-sm">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-md text-center text-tertiary">لا توجد مستخدمون</td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="p-md font-bold">{user.name || 'بدون اسم'}</td>
                  <td className="p-md">{user.email}</td>
                  <td className="p-md text-tertiary">{user.phone || '-'}</td>
                  <td className="p-md">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold text-white
                      ${user.is_admin ? 'bg-primary' : 'bg-gray-400'}`}>
                      {user.is_admin ? 'مدير' : 'مستخدم عادي'}
                    </span>
                  </td>
                  <td className="p-md text-center">
                    <button
                      onClick={() => onToggleUserAdmin(user.id, user.is_admin)}
                      className="p-1 text-tertiary hover:text-primary transition-colors"
                      title={user.is_admin ? 'إزالة صلاحيات مسؤول' : 'جعله مسؤول'}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {user.is_admin ? 'admin_panel_settings' : 'person'}
                      </span>
                    </button>
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
