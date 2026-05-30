import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchAdminStats, fetchAllListingsForAdmin, updateListingStatus, deleteListing, fetchPendingTransactions, approveTransaction } from '../lib/queries';
import logoDark from '../assets/carna logo.svg';


export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [pendingTxs, setPendingTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States for governorates and logs
  const [governorates, setGovernorates] = useState([
    { name: 'دمشق', count: 1500, active: true },
    { name: 'حلب', count: 850, active: false },
    { name: 'حمص', count: 420, active: true },
    { name: 'اللاذقية', count: 300, active: true }
  ]);

  const [activityLogs, setActivityLogs] = useState([
    { id: 1, action: 'تعديل إعدادات المستخدم', user: 'Admin Ahmad', time: '14:30', type: 'edit', color: 'blue', icon: 'tune' },
    { id: 2, action: 'إضافة محافظة جديدة', user: 'Admin Sarah', time: '10:15', type: 'add', color: 'green', icon: 'add_location' },
    { id: 3, action: 'حظر مستخدم', user: 'Admin Khalid', time: '09:00', type: 'delete', color: 'red', icon: 'delete' },
  ]);

  const addLog = (action: string, type: string, color: string, icon: string) => {
    const newLog = {
      id: Date.now(),
      action,
      user: user?.name || 'Admin',
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      type,
      color,
      icon
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const handleToggleListing = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateListingStatus(id, newStatus);
      setListings(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      addLog(`تغيير حالة إعلان إلى ${newStatus === 'active' ? 'مفعل' : 'معطل'}`, 'edit', 'blue', 'toggle_on');
    } catch (error) {
      console.error('Error toggling listing:', error);
      alert('حدث خطأ أثناء تحديث حالة الإعلان');
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الإعلان نهائياً؟')) return;
    try {
      await deleteListing(id);
      setListings(prev => prev.filter(l => l.id !== id));
      addLog('حذف إعلان', 'delete', 'red', 'delete');
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('حدث خطأ أثناء حذف الإعلان');
    }
  };

  const handleApproveTransaction = async (txId: string, userId: string, amount: number) => {
    if (!window.confirm('هل تريد تأكيد استلام الحوالة وإضافة الرصيد؟')) return;
    try {
      await approveTransaction(txId, userId, amount);
      setPendingTxs(prev => prev.filter(tx => tx.id !== txId));
      addLog(`تم شحن رصيد بقيمة ${amount} للمستخدم`, 'add', 'green', 'payments');
      alert('تم تأكيد الحوالة بنجاح وتحديث رصيد المستخدم');
    } catch (error) {
      console.error('Error approving transaction:', error);
      alert('حدث خطأ أثناء تأكيد العملية');
    }
  };

  const handleToggleGovernorate = (name: string) => {
    setGovernorates(prev => prev.map(g => {
      if (g.name === name) {
        addLog(`تغيير حالة محافظة ${name} إلى ${!g.active ? 'مفعلة' : 'معطلة'}`, 'edit', 'blue', 'map');
        return { ...g, active: !g.active };
      }
      return g;
    }));
  };

  const getColorClasses = (color: string, type: 'icon' | 'badge') => {
    if (type === 'icon') {
      switch (color) {
        case 'blue': return 'bg-blue-50 text-blue-500';
        case 'green': return 'bg-green-50 text-green-500';
        case 'red': return 'bg-red-50 text-red-500';
        default: return 'bg-gray-50 text-gray-500';
      }
    } else {
      switch (color) {
        case 'blue': return 'bg-blue-500 text-white';
        case 'green': return 'bg-green-500 text-white';
        case 'red': return 'bg-red-500 text-white';
        default: return 'bg-gray-500 text-white';
      }
    }
  };

  useEffect(() => {
    Promise.all([
      fetchAdminStats(),
      fetchAllListingsForAdmin(5),
      fetchPendingTransactions()
    ]).then(([s, l, txs]) => {
      setStats(s);
      setListings(l);
      setPendingTxs(txs);
    }).finally(() => setLoading(false));
  }, []);

  if (authLoading || loading) return <div className="p-xl text-center">جاري التحميل...</div>;
  if (!user || user.role !== 'admin') return <div className="p-xl text-center">غير مصرح لك بالدخول</div>;

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      
      {/* TopNavBar */}
      <nav className="bg-primary-container w-full sticky top-0 z-50 shadow-sm rtl">
        <div className="flex justify-between items-center h-16 px-gutter max-w-container-max mx-auto">
          <div className="flex items-center gap-md">
            <div className="h-10 flex items-center gap-2">
              <img src={logoDark} alt="CARNA" className="h-8 w-auto" />
            </div>
            <div className="hidden md:flex items-center gap-md mr-10">
              <a className="text-on-primary-container font-medium hover:opacity-80 active:scale-95 transition-transform" href="#">الرئيسية</a>
              <a className="text-on-primary-container font-medium hover:opacity-80 active:scale-95 transition-transform" href="#">سوق السيارات</a>
              <a className="text-on-primary-container font-medium hover:opacity-80 active:scale-95 transition-transform" href="#">ورشات الصيانة</a>
            </div>
          </div>
          <div className="flex items-center gap-sm">
            <div className="hidden md:flex items-center bg-white/20 px-sm py-1.5 rounded-lg border border-white/30 w-64 focus-within:border-white focus-within:ring-2 focus-within:ring-white/30 transition-all">
              <span className="material-symbols-outlined text-on-primary-container">search</span>
              <input className="bg-transparent border-none outline-none focus:ring-0 text-body-sm w-full px-xs placeholder-on-primary-container/70 text-on-primary-container" placeholder="البحث..." type="text" />
            </div>
            <button className="relative p-2 text-on-primary-container hover:bg-white/10 transition-colors rounded-full active:scale-95">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-primary-container"></span>
            </button>
            <div className="h-8 w-px bg-on-primary-container/20 mx-xs"></div>
            <div className="flex items-center gap-xs cursor-pointer group">
              <div className="text-left hidden md:block">
                <p className="font-label-lg text-label-lg text-on-primary-container text-right">أحمد الشامي</p>
                <p className="font-label-sm text-label-sm text-on-primary-container/70 text-right">دمشق، سوريا</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary font-bold overflow-hidden border-2 border-white/50">
                <img alt="Ahmed Al-Shami profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_pmCkdcVCZo6nXAKhq5QTyAmEwm26IwP6WypmDan8xsveZidY5JeMCjR4tYSY3N8VPf4kyJhkq5BnxiD0Jo84qq0l-HZZYiv9__EoL4yGO_hZrUtgw_FXI-or3MWLX6Kla4JrK_Pvun0nRlQi7iNKZ4KU1L3_91jGlTVQTPiW1BWy4V5a-dAP1EAunFt9KJ6tPZnFVjWCNj55zyDODpiGvjlW6dDZ3iCumTQfgF1FbXA1puhgAi9Ja7lvNgxQXiKpl0tnit9cZMFQ" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex max-w-container-max mx-auto min-h-[calc(100vh-64px)] w-full rtl">
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex flex-col p-4 gap-6 w-64 border-l border-border-light bg-inverse-surface text-white sticky top-16 h-[calc(100vh-64px)]">
          <div className="flex flex-col gap-2 flex-grow">
            <a className="flex items-center justify-between gap-xs px-sm py-3 text-white/70 hover:bg-white/10 rounded-lg transition-all active:scale-95" href="#">
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined">dashboard</span>
                <span className="font-label-lg text-label-lg">لوحة القيادة</span>
              </div>
            </a>
            <a className="flex items-center justify-between gap-xs px-sm py-3 text-on-primary-container bg-primary-container rounded-lg font-bold transition-all shadow-md active:scale-95" href="#">
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined">settings</span>
                <span className="font-label-lg text-label-lg">الإعدادات</span>
              </div>
            </a>
            <a className="flex items-center justify-between gap-xs px-sm py-3 text-white/70 hover:bg-white/10 rounded-lg transition-all active:scale-95" href="#">
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined">map</span>
                <span className="font-label-lg text-label-lg">إدارة المحافظات</span>
              </div>
            </a>
            <a className="flex items-center justify-between gap-xs px-sm py-3 text-white/70 hover:bg-white/10 rounded-lg transition-all active:scale-95" href="#">
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined">list_alt</span>
                <span className="font-label-lg text-label-lg">سجلات النشاط</span>
              </div>
            </a>
            <a className="flex items-center justify-between gap-xs px-sm py-3 text-white/70 hover:bg-white/10 rounded-lg transition-all active:scale-95" href="#">
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined">handyman</span>
                <span className="font-label-lg text-label-lg">الورشات</span>
              </div>
            </a>
          </div>
          <div className="border-t border-white/10 pt-4 flex flex-col gap-1">
            <a className="flex items-center gap-xs px-sm py-3 text-error/80 hover:bg-error/10 transition-all rounded-lg active:scale-95" href="#">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label-lg text-label-lg">تسجيل الخروج</span>
            </a>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow p-gutter md:p-lg bg-surface-container-low overflow-x-hidden">
          <header className="mb-lg text-center">
            <h1 className="font-headline-lg text-headline-lg mb-1">لوحة تحكم الإدارة الشاملة - V2</h1>
            <p className="text-body-md text-tertiary">لوحة تحكم الإدارة العامة للسيارات السوري</p>
          </header>

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

          {/* Grid for Main Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg mb-lg">
            {/* Recent Ads Table */}
            <div className="bg-surface-white border border-border-light rounded-xl overflow-hidden shadow-sm">
              <div className="p-md flex justify-between items-center border-b border-border-light">
                <h2 className="font-headline-sm text-headline-sm">أحدث الإعلانات</h2>
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
                          ) : (
                            <span className="bg-gray-400 text-white px-3 py-0.5 rounded text-[11px] font-bold">غير فعال</span>
                          )}
                        </td>
                        <td className="p-md text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleToggleListing(l.id, l.status)} className="p-1 text-tertiary hover:text-primary transition-colors" title="تغيير الحالة">
                              <span className="material-symbols-outlined text-sm">{l.status === 'active' ? 'block' : 'check_circle'}</span>
                            </button>
                            <button onClick={() => handleDeleteListing(l.id)} className="p-1 text-tertiary hover:text-error transition-colors" title="حذف">
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

            {/* Governorate Management Table */}
            <div className="bg-surface-white border border-border-light rounded-xl overflow-hidden shadow-sm">
              <div className="p-md flex justify-between items-center border-b border-border-light">
                <h2 className="font-headline-sm text-headline-sm">إدارة المحافظات</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-surface-container-low text-tertiary text-label-sm border-b border-border-light">
                    <tr>
                      <th className="p-md font-medium">المحافظة</th>
                      <th className="p-md font-medium text-center">عدد الإعلانات</th>
                      <th className="p-md font-medium text-center">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light text-body-sm">
                    {governorates.map((gov) => (
                      <tr key={gov.name} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="p-md font-bold">{gov.name}</td>
                        <td className="p-md text-center">{gov.count}</td>
                        <td className="p-md text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className={`text-xs font-bold ${gov.active ? 'text-on-surface' : 'text-tertiary'}`}>
                              {gov.active ? 'فعال' : 'غير فعال'}
                            </span>
                            <div 
                              onClick={() => handleToggleGovernorate(gov.name)}
                              className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${gov.active ? 'bg-on-surface' : 'bg-gray-300'}`}
                            >
                              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${gov.active ? 'right-0.5' : 'left-0.5'}`}></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Wallet Topups */}
            <div className="bg-surface-white border border-border-light rounded-xl overflow-hidden shadow-sm lg:col-span-2">
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
                            <button onClick={() => handleApproveTransaction(tx.id, tx.user_id, tx.amount)} className="bg-green-500 text-white px-md py-xs rounded hover:bg-green-600 transition-colors font-bold text-xs shadow-sm">
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
          </div>

          {/* Activity Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg mb-lg">
            {/* Activity History (تاريخ النشاط) */}
            <div className="bg-surface-white border border-border-light rounded-xl p-md shadow-sm">
              <h2 className="font-headline-sm text-headline-sm mb-md text-center">تاريخ النشاط</h2>
              <div className="space-y-4">
                {activityLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center justify-between pb-3 border-b border-border-light last:border-0">
                    <div className={`p-2 rounded-lg ${getColorClasses(log.color, 'icon')}`}>
                      <span className="material-symbols-outlined">{log.icon}</span>
                    </div>
                    <div className="flex-grow text-center">
                      <p className="text-body-sm font-bold">{log.action} - {log.user}</p>
                    </div>
                    <div className="text-tertiary text-xs">{log.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Logs (سجلات النشاط) */}
            <div className="bg-surface-white border border-border-light rounded-xl p-md shadow-sm">
              <h2 className="font-headline-sm text-headline-sm mb-md text-center">سجلات النشاط</h2>
              <div className="space-y-4">
                {activityLogs.slice(0, 5).map((log) => (
                  <div key={`log-${log.id}`} className="flex items-center justify-between pb-3 border-b border-border-light last:border-0">
                    <div className="flex-grow">
                      <p className="text-body-sm text-on-surface">{log.action} - {log.user}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-tertiary text-xs">{log.time}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getColorClasses(log.color, 'badge')}`}>
                        {log.type === 'edit' ? 'تعديل' : log.type === 'add' ? 'إضافة' : 'حذف/تعطيل'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Workshops Overview Section */}
          <div className="flex justify-end">
            <div className="bg-surface-white border border-border-light rounded-xl p-md shadow-sm min-w-[300px]">
              <h2 className="font-headline-sm text-headline-sm mb-2 text-center">نظرة عامة على الورشات</h2>
              <p className="text-body-md text-center">عدد الورشات النشطة: <span className="font-bold text-primary">{stats?.servicesCount || 0}</span></p>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom NavBar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-white border-t border-border-light flex justify-around items-center h-16 px-4 z-50">
        <a className="flex flex-col items-center text-primary active:scale-95 transition-transform" href="#">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px]">الرئيسية</span>
        </a>
        <a className="flex flex-col items-center text-tertiary active:scale-95 transition-transform" href="#">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px]">إعدادات</span>
        </a>
        <a className="flex flex-col items-center text-tertiary active:scale-95 transition-transform" href="#">
          <span className="material-symbols-outlined">map</span>
          <span className="text-[10px]">المحافظات</span>
        </a>
        <a className="flex flex-col items-center text-tertiary active:scale-95 transition-transform" href="#">
          <span className="material-symbols-outlined">handyman</span>
          <span className="text-[10px]">الورشات</span>
        </a>
      </nav>
    </div>
  );
}
