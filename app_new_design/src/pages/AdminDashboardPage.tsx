import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  fetchAdminStats, 
  fetchAllListingsForAdmin, 
  updateListingStatus, 
  deleteListing, 
  fetchPendingTransactions, 
  approveTransaction,
  fetchAllServicesForAdmin,
  updateServiceStatus,
  deleteService,
  fetchAdminLogs,
  insertAdminLog,
  fetchAllReviewsForAdmin,
  deleteReview,
  fetchGovernorates,
  addGovernorate,
  toggleGovernorate,
  deleteGovernorate,
  fetchSystemSettings,
  updateSystemSetting,
  fetchAllUsers,
  toggleUserAdmin,
  toggleUserBan,
  fetchPendingWorkshops,
  approveWorkshop,
  rejectWorkshop
} from '../lib/queries';
import logoDark from '../assets/carna logo.svg';


export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [pendingTxs, setPendingTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [governorates, setGovernorates] = useState<any[]>([]);
  const [systemSettings, setSystemSettings] = useState<any[]>([]);
  const [newGovName, setNewGovName] = useState('');

  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [pendingWorkshops, setPendingWorkshops] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');

  const addLog = async (action: string, type: string, color: string, icon: string) => {
    const newLog = {
      action,
      type,
      color,
      icon
    };
    
    // Optistic UI Update
    setActivityLogs(prev => [{
      id: Date.now(),
      ...newLog,
      users: { name: user?.name || 'Admin' },
      created_at: new Date().toISOString()
    }, ...prev]);

    await insertAdminLog(newLog);
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

  const handleToggleService = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateServiceStatus(id, newStatus);
      setServices(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
      addLog(`تغيير حالة ورشة إلى ${newStatus === 'active' ? 'مفعلة' : 'معطلة'}`, 'edit', 'blue', 'toggle_on');
    } catch (error) {
      console.error('Error toggling service:', error);
      alert('حدث خطأ أثناء تحديث حالة الورشة');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الورشة نهائياً؟')) return;
    try {
      await deleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
      addLog('حذف ورشة', 'delete', 'red', 'delete');
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('حدث خطأ أثناء حذف الورشة');
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

  const handleAddGovernorate = async () => {
    if (!newGovName.trim()) return;
    try {
      const added = await addGovernorate(newGovName.trim());
      setGovernorates(prev => [...prev, added]);
      setNewGovName('');
      addLog(`إضافة محافظة جديدة: ${newGovName}`, 'add', 'green', 'map');
    } catch (error) {
      console.error('Error adding governorate:', error);
      alert('خطأ في إضافة المحافظة. قد تكون موجودة مسبقاً.');
    }
  };

  const handleToggleGovStatus = async (id: string, currentState: boolean, name: string) => {
    try {
      const updated = await toggleGovernorate(id, !currentState);
      setGovernorates(prev => prev.map(g => g.id === id ? updated : g));
      addLog(`تغيير حالة محافظة ${name} إلى ${!currentState ? 'مفعلة' : 'معطلة'}`, 'edit', 'blue', 'map');
    } catch (error) {
      console.error('Error toggling governorate:', error);
      alert('حدث خطأ أثناء تحديث المحافظة');
    }
  };

  const handleDeleteGov = async (id: string, name: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف محافظة ${name}؟`)) return;
    try {
      await deleteGovernorate(id);
      setGovernorates(prev => prev.filter(g => g.id !== id));
      addLog(`حذف محافظة ${name}`, 'delete', 'red', 'delete');
    } catch (error) {
      console.error('Error deleting governorate:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const handleUpdateSetting = async (key: string, value: any, desc: string) => {
    try {
      const updated = await updateSystemSetting(key, value);
      setSystemSettings(prev => prev.map(s => s.key === key ? updated : s));
      addLog(`تحديث إعدادات: ${desc}`, 'edit', 'blue', 'settings');
    } catch (error) {
      console.error('Error updating setting:', error);
      alert('حدث خطأ أثناء تحديث الإعدادات');
    }
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

  const handleToggleUserAdmin = async (userId: string, currentIsAdmin: boolean) => {
    try {
      const updated = await toggleUserAdmin(userId, !currentIsAdmin);
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, is_admin: updated.is_admin } : u));
      addLog(`${!currentIsAdmin ? 'منح' : 'سحب'} صلاحية الإدارة`, 'edit', 'blue', 'admin_panel_settings');
    } catch (error) {
      alert('حدث خطأ أثناء تحديث الصلاحيات');
    }
  };

  const handleToggleUserBan = async (userId: string, currentIsBanned: boolean) => {
    const msg = currentIsBanned ? 'هل تريد رفع الحظر عن هذا المستخدم؟' : 'هل تريد حظر هذا المستخدم؟';
    if (!window.confirm(msg)) return;
    try {
      const updated = await toggleUserBan(userId, !currentIsBanned);
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, is_banned: updated.is_banned } : u));
      addLog(`${!currentIsBanned ? 'حظر' : 'رفع حظر'} مستخدم`, 'edit', !currentIsBanned ? 'red' : 'green', 'block');
    } catch (error) {
      alert('حدث خطأ أثناء تحديث حالة المستخدم');
    }
  };

  const handleApproveWorkshop = async (id: string) => {
    try {
      await approveWorkshop(id);
      setPendingWorkshops(prev => prev.filter(w => w.id !== id));
      addLog('قبول طلب تسجيل ورشة', 'add', 'green', 'handyman');
    } catch (error) {
      alert('حدث خطأ أثناء قبول الورشة');
    }
  };

  const handleRejectWorkshop = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من رفض طلب الورشة؟')) return;
    try {
      await rejectWorkshop(id);
      setPendingWorkshops(prev => prev.filter(w => w.id !== id));
      addLog('رفض طلب تسجيل ورشة', 'delete', 'red', 'cancel');
    } catch (error) {
      alert('حدث خطأ أثناء رفض الورشة');
    }
  };

  useEffect(() => {
    Promise.all([
      fetchAdminStats(),
      fetchAllListingsForAdmin(50),
      fetchPendingTransactions(),
      fetchAllServicesForAdmin(),
      fetchAdminLogs(20),
      fetchAllReviewsForAdmin(50),
      fetchGovernorates(),
      fetchSystemSettings(),
      fetchAllUsers(100),
      fetchPendingWorkshops(50)
    ]).then(([s, l, txs, servs, logs, revs, govs, sets, users, pendWs]) => {
      setStats(s);
      setListings(l);
      setPendingTxs(txs);
      setServices(servs);
      setActivityLogs(logs);
      setReviews(revs);
      setGovernorates(govs);
      setSystemSettings(sets);
      setAllUsers(users);
      setPendingWorkshops(pendWs);
    }).finally(() => setLoading(false));
  }, []);

  if (authLoading || loading) return <div className="p-xl text-center">جاري التحميل...</div>;
  if (!user || !user.is_admin) return <div className="p-xl text-center">غير مصرح لك بالدخول</div>;

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
            <button onClick={() => setActiveTab('dashboard')} className={`flex items-center justify-between gap-xs px-sm py-3 rounded-lg transition-all active:scale-95 ${activeTab === 'dashboard' ? 'text-on-primary-container bg-primary-container font-bold shadow-md' : 'text-white/70 hover:bg-white/10'}`}>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined">dashboard</span>
                <span className="font-label-lg text-label-lg">لوحة القيادة</span>
              </div>
            </button>
            <button onClick={() => setActiveTab('settings')} className={`flex items-center justify-between gap-xs px-sm py-3 rounded-lg transition-all active:scale-95 ${activeTab === 'settings' ? 'text-on-primary-container bg-primary-container font-bold shadow-md' : 'text-white/70 hover:bg-white/10'}`}>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined">settings</span>
                <span className="font-label-lg text-label-lg">الإعدادات</span>
              </div>
            </button>
            <button onClick={() => setActiveTab('governorates')} className={`flex items-center justify-between gap-xs px-sm py-3 rounded-lg transition-all active:scale-95 ${activeTab === 'governorates' ? 'text-on-primary-container bg-primary-container font-bold shadow-md' : 'text-white/70 hover:bg-white/10'}`}>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined">map</span>
                <span className="font-label-lg text-label-lg">إدارة المحافظات</span>
              </div>
            </button>
            <button onClick={() => setActiveTab('logs')} className={`flex items-center justify-between gap-xs px-sm py-3 rounded-lg transition-all active:scale-95 ${activeTab === 'logs' ? 'text-on-primary-container bg-primary-container font-bold shadow-md' : 'text-white/70 hover:bg-white/10'}`}>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined">list_alt</span>
                <span className="font-label-lg text-label-lg">سجلات النشاط</span>
              </div>
            </button>
            <button onClick={() => setActiveTab('reviews')} className={`flex items-center justify-between gap-xs px-sm py-3 rounded-lg transition-all active:scale-95 ${activeTab === 'reviews' ? 'text-on-primary-container bg-primary-container font-bold shadow-md' : 'text-white/70 hover:bg-white/10'}`}>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined">star_rate</span>
                <span className="font-label-lg text-label-lg">مراجعة التقييمات</span>
              </div>
            </button>
            <button onClick={() => setActiveTab('workshops')} className={`flex items-center justify-between gap-xs px-sm py-3 rounded-lg transition-all active:scale-95 ${activeTab === 'workshops' ? 'text-on-primary-container bg-primary-container font-bold shadow-md' : 'text-white/70 hover:bg-white/10'}`}>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined">handyman</span>
                <span className="font-label-lg text-label-lg">الورشات</span>
              </div>
            </button>
            <button onClick={() => setActiveTab('workshop-approvals')} className={`flex items-center justify-between gap-xs px-sm py-3 rounded-lg transition-all active:scale-95 ${activeTab === 'workshop-approvals' ? 'text-on-primary-container bg-primary-container font-bold shadow-md' : 'text-white/70 hover:bg-white/10'}`}>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined">pending_actions</span>
                <span className="font-label-lg text-label-lg">طلبات الورشات</span>
              </div>
              {pendingWorkshops.length > 0 && (
                <span className="bg-error text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingWorkshops.length}</span>
              )}
            </button>
            <button onClick={() => setActiveTab('users')} className={`flex items-center justify-between gap-xs px-sm py-3 rounded-lg transition-all active:scale-95 ${activeTab === 'users' ? 'text-on-primary-container bg-primary-container font-bold shadow-md' : 'text-white/70 hover:bg-white/10'}`}>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined">group</span>
                <span className="font-label-lg text-label-lg">إدارة المستخدمين</span>
              </div>
            </button>
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

          {activeTab === 'dashboard' && (
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
                                <button onClick={() => handleToggleListing(l.id, l.status)} className="bg-green-500 text-white px-2 py-1 rounded text-[10px] hover:bg-green-600 transition-colors" title="قبول الإعلان">
                                  قبول
                                </button>
                              ) : (
                                <button onClick={() => handleToggleListing(l.id, l.status)} className="p-1 text-tertiary hover:text-primary transition-colors" title="تغيير الحالة">
                                  <span className="material-symbols-outlined text-sm">{l.status === 'active' ? 'block' : 'check_circle'}</span>
                                </button>
                              )}
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
            </>
          )}

          {activeTab === 'settings' && (
            <div className="bg-surface-white border border-border-light rounded-xl overflow-hidden shadow-sm">
              <div className="p-md flex justify-between items-center border-b border-border-light">
                <h2 className="font-headline-sm text-headline-sm">إعدادات المنصة</h2>
              </div>
              <div className="p-md space-y-md">
                {systemSettings.map(setting => (
                  <div key={setting.id} className="flex flex-col gap-2 p-sm bg-surface-container-low rounded-lg">
                    <div className="flex justify-between items-center">
                      <label className="font-label-lg font-bold">{setting.description}</label>
                      {setting.value === 'true' || setting.value === 'false' ? (
                        <div 
                          onClick={() => handleUpdateSetting(setting.key, setting.value === 'true' ? 'false' : 'true', setting.description)}
                          className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${setting.value === 'true' ? 'bg-primary' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${setting.value === 'true' ? 'right-0.5' : 'left-0.5'}`}></div>
                        </div>
                      ) : (
                        <div className="flex gap-2 w-1/2">
                          <input 
                            type="text" 
                            defaultValue={setting.value}
                            onBlur={(e) => {
                              if (e.target.value !== setting.value) {
                                handleUpdateSetting(setting.key, e.target.value, setting.description);
                              }
                            }}
                            className="w-full bg-surface-white border border-border-light rounded-lg px-2 py-1 outline-none focus:border-primary text-left dir-ltr"
                          />
                        </div>
                      )}
                    </div>
                    <span className="text-body-sm text-tertiary">المفتاح: {setting.key}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'governorates' && (
            <div className="bg-surface-white border border-border-light rounded-xl overflow-hidden shadow-sm">
              <div className="p-md flex justify-between items-center border-b border-border-light bg-surface-container-low">
                <h2 className="font-headline-sm text-headline-sm">إدارة المحافظات</h2>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="اسم المحافظة" 
                    value={newGovName}
                    onChange={(e) => setNewGovName(e.target.value)}
                    className="bg-surface-white border border-border-light rounded-lg px-sm py-1 font-body-sm outline-none focus:ring-1 focus:ring-primary w-32 md:w-auto"
                  />
                  <button 
                    onClick={handleAddGovernorate}
                    disabled={!newGovName.trim()}
                    className="bg-primary text-white px-md py-1 rounded-lg font-bold font-label-sm active:scale-95 transition-transform disabled:opacity-50"
                  >
                    إضافة
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-surface-container-low text-tertiary text-label-sm border-b border-border-light">
                    <tr>
                      <th className="p-md font-medium">المحافظة</th>
                      <th className="p-md font-medium text-center">تاريخ الإضافة</th>
                      <th className="p-md font-medium text-center">الحالة</th>
                      <th className="p-md font-medium text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light text-body-sm">
                    {governorates.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-md text-center text-tertiary">لا توجد محافظات</td>
                      </tr>
                    ) : (
                      governorates.map((gov) => (
                        <tr key={gov.id} className="hover:bg-surface-container-lowest transition-colors">
                          <td className="p-md font-bold">{gov.name}</td>
                          <td className="p-md text-center text-tertiary">{new Date(gov.created_at).toLocaleDateString('ar-EG')}</td>
                          <td className="p-md text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className={`text-xs font-bold ${gov.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                                {gov.is_active ? 'فعالة' : 'معطلة'}
                              </span>
                              <div 
                                onClick={() => handleToggleGovStatus(gov.id, gov.is_active, gov.name)}
                                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${gov.is_active ? 'bg-primary' : 'bg-gray-300'}`}
                              >
                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${gov.is_active ? 'right-0.5' : 'left-0.5'}`}></div>
                              </div>
                            </div>
                          </td>
                          <td className="p-md text-center">
                            <button 
                              onClick={() => handleDeleteGov(gov.id, gov.name)}
                              className="p-1 text-tertiary hover:text-error transition-colors" title="حذف المحافظة"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
              <div className="bg-surface-white border border-border-light rounded-xl p-md shadow-sm">
                <h2 className="font-headline-sm text-headline-sm mb-md text-center">تاريخ النشاط</h2>
                <div className="space-y-4">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between pb-3 border-b border-border-light last:border-0">
                      <div className={`p-2 rounded-lg ${getColorClasses(log.color, 'icon')}`}>
                        <span className="material-symbols-outlined">{log.icon}</span>
                      </div>
                      <div className="flex-grow text-center">
                        <p className="text-body-sm font-bold">{log.action} - {log.users?.name || 'Admin'}</p>
                      </div>
                      <div className="text-tertiary text-xs">{new Date(log.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-surface-white border border-border-light rounded-xl p-md shadow-sm">
                <h2 className="font-headline-sm text-headline-sm mb-md text-center">سجلات النشاط التفصيلية</h2>
                <div className="space-y-4">
                  {activityLogs.map((log) => (
                    <div key={`log-${log.id}`} className="flex items-center justify-between pb-3 border-b border-border-light last:border-0">
                      <div className="flex-grow">
                        <p className="text-body-sm text-on-surface">{log.action} - {log.users?.name || 'Admin'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-tertiary text-xs">{new Date(log.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getColorClasses(log.color, 'badge')}`}>
                          {log.type === 'edit' ? 'تعديل' : log.type === 'add' ? 'إضافة' : 'حذف/تعطيل'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workshops' && (
            <div className="bg-surface-white border border-border-light rounded-xl overflow-hidden shadow-sm">
              <div className="p-md flex justify-between items-center border-b border-border-light">
                <h2 className="font-headline-sm text-headline-sm">إدارة الورشات</h2>
                <p className="text-body-sm text-tertiary font-bold">إجمالي الورشات: <span className="text-primary">{services.length}</span></p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-surface-container-low text-tertiary text-label-sm border-b border-border-light">
                    <tr>
                      <th className="p-md font-medium">اسم الورشة</th>
                      <th className="p-md font-medium">المدينة</th>
                      <th className="p-md font-medium">المالك</th>
                      <th className="p-md font-medium text-center">الحالة</th>
                      <th className="p-md font-medium text-center">إجراءات</th>
                      <th className="p-md font-medium">تاريخ الإضافة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light text-body-sm">
                    {services.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-md text-center text-tertiary font-bold">لا توجد ورشات مضافة حالياً</td>
                      </tr>
                    ) : (
                      services.map(s => (
                        <tr key={s.id} className="hover:bg-surface-container-lowest transition-colors">
                          <td className="p-md font-bold">{s.name}</td>
                          <td className="p-md">{s.city}</td>
                          <td className="p-md">
                            {s.users?.name || 'مستخدم غير معروف'}
                            <br/>
                            <span className="text-[11px] text-tertiary">{s.users?.phone}</span>
                          </td>
                          <td className="p-md text-center">
                            {s.status === 'active' ? (
                              <span className="bg-green-500 text-white px-3 py-0.5 rounded text-[11px] font-bold">فعال</span>
                            ) : (
                              <span className="bg-gray-400 text-white px-3 py-0.5 rounded text-[11px] font-bold">غير فعال</span>
                            )}
                          </td>
                          <td className="p-md text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => handleToggleService(s.id, s.status)} className="p-1 text-tertiary hover:text-primary transition-colors" title="تغيير الحالة">
                                <span className="material-symbols-outlined text-sm">{s.status === 'active' ? 'block' : 'check_circle'}</span>
                              </button>
                              <button onClick={() => handleDeleteService(s.id)} className="p-1 text-tertiary hover:text-error transition-colors" title="حذف">
                                <span className="material-symbols-outlined text-sm">delete</span>
                              </button>
                            </div>
                          </td>
                          <td className="p-md text-tertiary">{new Date(s.created_at).toLocaleDateString('ar-EG')}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-surface-white border border-border-light rounded-xl overflow-hidden shadow-sm">
              <div className="p-md flex justify-between items-center border-b border-border-light">
                <h2 className="font-headline-sm text-headline-sm">التقييمات والمراجعات</h2>
                <p className="text-body-sm text-tertiary font-bold">العدد: <span className="text-primary">{reviews.length}</span></p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-surface-container-low text-tertiary text-label-sm border-b border-border-light">
                    <tr>
                      <th className="p-md font-medium">المستخدم</th>
                      <th className="p-md font-medium">الورشة المقيمة</th>
                      <th className="p-md font-medium">التقييم</th>
                      <th className="p-md font-medium">التعليق</th>
                      <th className="p-md font-medium text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light text-body-sm">
                    {reviews.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-md text-center text-tertiary font-bold">لا توجد تقييمات حالياً</td>
                      </tr>
                    ) : (
                      reviews.map(r => (
                        <tr key={r.id} className="hover:bg-surface-container-lowest transition-colors">
                          <td className="p-md font-bold">{r.users?.name || 'مجهول'}</td>
                          <td className="p-md">{r.services?.name || 'غير معروف'}</td>
                          <td className="p-md text-orange-500 font-bold">
                            <div className="flex items-center">
                              {r.rating} <span className="material-symbols-outlined text-[14px]">star</span>
                            </div>
                          </td>
                          <td className="p-md max-w-xs truncate">{r.comment || 'بدون تعليق'}</td>
                          <td className="p-md text-center">
                            <button 
                              onClick={async () => {
                                if(window.confirm('هل أنت متأكد من حذف هذا التقييم المخالف؟')) {
                                  try {
                                    await deleteReview(r.id);
                                    setReviews(prev => prev.filter(rev => rev.id !== r.id));
                                    addLog('حذف تقييم مخالف', 'delete', 'red', 'delete');
                                  } catch (error) {
                                    alert('فشل الحذف');
                                  }
                                }
                              }} 
                              className="p-1 text-tertiary hover:text-error transition-colors" title="حذف التقييم">
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'workshop-approvals' && (
            <div className="bg-surface-white border border-border-light rounded-xl overflow-hidden shadow-sm">
              <div className="p-md flex justify-between items-center border-b border-border-light">
                <h2 className="font-headline-sm text-headline-sm">طلبات تسجيل ورشات جديدة</h2>
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
                  {pendingWorkshops.length} طلب معلق
                </span>
              </div>
              {pendingWorkshops.length === 0 ? (
                <div className="p-xl text-center">
                  <span className="material-symbols-outlined text-4xl text-tertiary">check_circle</span>
                  <p className="mt-2 text-tertiary font-label-lg">لا توجد طلبات معلقة حالياً</p>
                </div>
              ) : (
                <div className="divide-y divide-border-light">
                  {pendingWorkshops.map(w => (
                    <div key={w.id} className="p-md flex flex-col md:flex-row md:items-center justify-between gap-md hover:bg-surface-container-lowest transition-colors">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="material-symbols-outlined text-primary">handyman</span>
                          <p className="font-bold text-on-surface">{w.name}</p>
                          {w.is_inspection_center && (
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">مركز فحص</span>
                          )}
                        </div>
                        <p className="text-body-sm text-tertiary">{w.city} · {w.phone}</p>
                        <p className="text-body-sm text-tertiary">المالك: {w.users?.name} ({w.users?.phone})</p>
                        {w.description && (
                          <p className="text-body-sm text-on-surface/80 mt-1 line-clamp-2">{w.description}</p>
                        )}
                        <p className="text-[11px] text-tertiary mt-1">تاريخ الطلب: {new Date(w.created_at).toLocaleDateString('ar-EG')}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleApproveWorkshop(w.id)}
                          className="flex items-center gap-1 bg-green-500 text-white px-md py-xs rounded-lg hover:bg-green-600 transition-colors font-bold text-sm shadow-sm"
                        >
                          <span className="material-symbols-outlined text-sm">check</span>
                          قبول
                        </button>
                        <button
                          onClick={() => handleRejectWorkshop(w.id)}
                          className="flex items-center gap-1 bg-error text-white px-md py-xs rounded-lg hover:opacity-90 transition-colors font-bold text-sm shadow-sm"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                          رفض
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-surface-white border border-border-light rounded-xl overflow-hidden shadow-sm">
              <div className="p-md flex flex-col md:flex-row justify-between items-start md:items-center gap-sm border-b border-border-light">
                <div>
                  <h2 className="font-headline-sm text-headline-sm">إدارة المستخدمين</h2>
                  <p className="text-body-sm text-tertiary">إجمالي: <span className="text-primary font-bold">{allUsers.length}</span> مستخدم</p>
                </div>
                <div className="flex items-center bg-surface-container-low border border-border-light rounded-lg px-sm py-1.5 w-full md:w-64">
                  <span className="material-symbols-outlined text-tertiary text-sm">search</span>
                  <input
                    type="text"
                    placeholder="ابحث بالاسم أو الهاتف..."
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    className="bg-transparent border-none outline-none text-body-sm w-full px-xs"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-surface-container-low text-tertiary text-label-sm border-b border-border-light">
                    <tr>
                      <th className="p-md font-medium">المستخدم</th>
                      <th className="p-md font-medium">الهاتف / الإيميل</th>
                      <th className="p-md font-medium text-center">رصيد المحفظة</th>
                      <th className="p-md font-medium text-center">التقييم</th>
                      <th className="p-md font-medium text-center">الحالة</th>
                      <th className="p-md font-medium text-center">الإدارة</th>
                      <th className="p-md font-medium text-center">إجراءات</th>
                      <th className="p-md font-medium">تاريخ التسجيل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light text-body-sm">
                    {allUsers
                      .filter(u => {
                        if (!userSearch) return true;
                        const q = userSearch.toLowerCase();
                        return (
                          (u.name || '').toLowerCase().includes(q) ||
                          (u.phone || '').includes(q) ||
                          (u.email || '').toLowerCase().includes(q)
                        );
                      })
                      .map(u => (
                        <tr key={u.id} className={`hover:bg-surface-container-lowest transition-colors ${u.is_banned ? 'opacity-60' : ''}`}>
                          <td className="p-md">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-sm">
                                {(u.name || '?')[0]}
                              </div>
                              <span className="font-bold">{u.name || 'بدون اسم'}</span>
                            </div>
                          </td>
                          <td className="p-md text-tertiary">
                            <p>{u.phone}</p>
                            {u.email && <p className="text-[11px]">{u.email}</p>}
                          </td>
                          <td className="p-md text-center font-bold text-primary">
                            {(u.wallet_balance || 0).toLocaleString()} ل.س
                          </td>
                          <td className="p-md text-center">
                            {u.rating > 0 ? (
                              <span className="flex items-center justify-center gap-0.5 text-orange-500 font-bold">
                                {u.rating?.toFixed(1)} <span className="material-symbols-outlined text-[14px]">star</span>
                              </span>
                            ) : (
                              <span className="text-tertiary text-xs">—</span>
                            )}
                          </td>
                          <td className="p-md text-center">
                            {u.is_banned ? (
                              <span className="bg-error/10 text-error text-[11px] font-bold px-2 py-0.5 rounded">محظور</span>
                            ) : (
                              <span className="bg-green-100 text-green-700 text-[11px] font-bold px-2 py-0.5 rounded">نشط</span>
                            )}
                          </td>
                          <td className="p-md text-center">
                            {u.is_admin ? (
                              <span className="bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5 rounded">مدير</span>
                            ) : (
                              <span className="text-tertiary text-xs">—</span>
                            )}
                          </td>
                          <td className="p-md text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleToggleUserAdmin(u.id, u.is_admin)}
                                title={u.is_admin ? 'سحب صلاحية الإدارة' : 'منح صلاحية الإدارة'}
                                className="p-1 text-tertiary hover:text-primary transition-colors"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  {u.is_admin ? 'person_remove' : 'admin_panel_settings'}
                                </span>
                              </button>
                              <button
                                onClick={() => handleToggleUserBan(u.id, u.is_banned)}
                                title={u.is_banned ? 'رفع الحظر' : 'حظر المستخدم'}
                                className={`p-1 transition-colors ${u.is_banned ? 'text-green-600 hover:text-green-700' : 'text-tertiary hover:text-error'}`}
                              >
                                <span className="material-symbols-outlined text-sm">
                                  {u.is_banned ? 'lock_open' : 'block'}
                                </span>
                              </button>
                            </div>
                          </td>
                          <td className="p-md text-tertiary text-[12px]">{new Date(u.created_at).toLocaleDateString('ar-EG')}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Mobile Bottom NavBar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-white border-t border-border-light flex justify-around items-center h-16 px-4 z-50">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center active:scale-95 transition-transform ${activeTab === 'dashboard' ? 'text-primary' : 'text-tertiary'}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px]">الرئيسية</span>
        </button>
        <button onClick={() => setActiveTab('workshops')} className={`flex flex-col items-center active:scale-95 transition-transform ${activeTab === 'workshops' ? 'text-primary' : 'text-tertiary'}`}>
          <span className="material-symbols-outlined">handyman</span>
          <span className="text-[10px]">الورشات</span>
        </button>
        <button onClick={() => setActiveTab('workshop-approvals')} className={`relative flex flex-col items-center active:scale-95 transition-transform ${activeTab === 'workshop-approvals' ? 'text-primary' : 'text-tertiary'}`}>
          <span className="material-symbols-outlined">pending_actions</span>
          {pendingWorkshops.length > 0 && <span className="absolute -top-1 -right-1 bg-error text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{pendingWorkshops.length}</span>}
          <span className="text-[10px]">الطلبات</span>
        </button>
        <button onClick={() => setActiveTab('users')} className={`flex flex-col items-center active:scale-95 transition-transform ${activeTab === 'users' ? 'text-primary' : 'text-tertiary'}`}>
          <span className="material-symbols-outlined">group</span>
          <span className="text-[10px]">المستخدمون</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center active:scale-95 transition-transform ${activeTab === 'settings' ? 'text-primary' : 'text-tertiary'}`}>
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px]">إعدادات</span>
        </button>
      </nav>
    </div>
  );
}
