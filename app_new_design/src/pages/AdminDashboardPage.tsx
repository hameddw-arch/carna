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
  fetchPendingWorkshops,
  approveWorkshop,
  rejectWorkshop
} from '../lib/queries/index';
import logoDark from '../assets/carna logo.svg';
import { DashboardTabContent } from './admin/DashboardTabContent';
import { SettingsTabContent } from './admin/SettingsTabContent';
import { LogsTabContent } from './admin/LogsTabContent';
import { ReviewsTabContent } from './admin/ReviewsTabContent';
import { WorkshopsTabContent } from './admin/WorkshopsTabContent';
import { WorkshopApprovalsTabContent } from './admin/WorkshopApprovalsTabContent';
import { UsersTabContent } from './admin/UsersTabContent';
import { ServicesTabContent } from './admin/ServicesTabContent';


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

  const handleToggleService = async (id: string, currentStatus: string | boolean) => {
    try {
      const newStatus = (currentStatus === 'active' || currentStatus === true) ? 'inactive' : 'active';
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

  const handleToggleUserAdmin = async (userId: string, currentIsAdmin: boolean) => {
    try {
      const updated = await toggleUserAdmin(userId, !currentIsAdmin);
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, is_admin: updated.is_admin } : u));
      addLog(`${!currentIsAdmin ? 'منح' : 'سحب'} صلاحية الإدارة`, 'edit', 'blue', 'admin_panel_settings');
    } catch (error) {
      alert('حدث خطأ أثناء تحديث الصلاحيات');
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
            <DashboardTabContent
              stats={stats}
              listings={listings}
              pendingTxs={pendingTxs}
              onToggleListing={handleToggleListing}
              onDeleteListing={handleDeleteListing}
              onApproveTransaction={handleApproveTransaction}
              onAddLog={addLog}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTabContent
              systemSettings={systemSettings}
              governorates={governorates}
              newGovName={newGovName}
              onNewGovNameChange={setNewGovName}
              onAddGovernorate={handleAddGovernorate}
              onToggleGovStatus={handleToggleGovStatus}
              onDeleteGov={handleDeleteGov}
              onUpdateSetting={handleUpdateSetting}
              onAddLog={addLog}
            />
          )}

          {activeTab === 'logs' && (
            <LogsTabContent activityLogs={activityLogs} />
          )}

          {activeTab === 'workshops' && (
            <WorkshopsTabContent
              workshops={services}
              onToggleWorkshop={handleToggleService}
              onDeleteWorkshop={handleDeleteService}
              onAddLog={addLog}
            />
          )}

          {activeTab === 'reviews' && (
            <ReviewsTabContent
              reviews={reviews}
              onDeleteReview={async (id: string) => {
                if (window.confirm('هل أنت متأكد من حذف هذا التقييم المخالف؟')) {
                  try {
                    await deleteReview(id);
                    setReviews(prev => prev.filter(rev => rev.id !== id));
                    addLog('حذف تقييم مخالف', 'delete', 'red', 'delete');
                  } catch {
                    alert('فشل الحذف');
                  }
                }
              }}
            />
          )}

          {activeTab === 'workshop-approvals' && (
            <WorkshopApprovalsTabContent
              pendingWorkshops={pendingWorkshops}
              onApproveWorkshop={handleApproveWorkshop}
              onRejectWorkshop={handleRejectWorkshop}
              onAddLog={addLog}
            />
          )}

          {activeTab === 'users' && (
            <UsersTabContent
              allUsers={allUsers}
              userSearch={userSearch}
              onUserSearchChange={setUserSearch}
              onToggleUserAdmin={handleToggleUserAdmin}
              onAddLog={addLog}
            />
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
