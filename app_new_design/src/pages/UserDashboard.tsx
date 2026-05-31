import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserListings, deleteListing, updateListingStatus } from '../lib/queries';

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState('الكل');
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const LIMIT = 10;

  const loadListings = async (currentOffset: number, reset = false) => {
    if (!user) return;
    try {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      const statusFilter = activeTab === 'الكل' ? 'all' : (activeTab === 'النشطة' ? 'active' : 'sold');
      const data = await fetchUserListings(user.id, currentOffset, LIMIT, statusFilter);
      
      if (reset) {
        setListings(data.listings);
      } else {
        setListings(prev => [...prev, ...data.listings]);
      }
      setTotalCount(data.count);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setOffset(0);
    loadListings(0, true);
  }, [user, activeTab]);

  const handleLoadMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    loadListings(newOffset, false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الإعلان نهائياً؟')) return;
    try {
      await deleteListing(id);
      setListings(prev => prev.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('حدث خطأ أثناء الحذف.');
    }
  };

  const handleToggleSold = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'sold' : 'active';
      await updateListingStatus(id, newStatus as any);
      setListings(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('حدث خطأ أثناء تحديث الحالة.');
    }
  };

  if (authLoading) return <div className="p-xl text-center">جاري التحميل...</div>;
  if (!user) return <div className="p-xl text-center">الرجاء تسجيل الدخول</div>;

  // For total count summary we rely on what's fetched or another query, but for now we'll use state count
  // Note: activeCount and soldCount may not be fully accurate if not all loaded, but for now we'll just show the totalCount for active tab
  const activeCount = activeTab === 'النشطة' ? totalCount : listings.filter(l => l.status === 'active').length;
  const soldCount = activeTab === 'المباعة' ? totalCount : listings.filter(l => l.status === 'sold').length;
  const totalViews = listings.reduce((acc, l) => acc + (l.views || 0), 0);
  
  const hasMore = listings.length < totalCount;
  
  return (
    <DashboardLayout>
      <main className="py-4 md:py-lg px-4 md:px-md lg:px-xl w-full">


        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md mb-lg">
          <div>
            <h1 className="font-headline-lg text-headline-lg font-black text-on-surface">إعلاناتي</h1>
            <p className="text-tertiary font-body-md">إدارة وتتبع أداء سياراتك المعروضة للبيع</p>
          </div>
          <Link to="/post-ad" className="flex items-center gap-xs bg-primary-container text-on-primary-container px-lg py-md rounded-lg font-label-lg font-bold transition-all active:scale-95 shadow-sm">
            <span className="material-symbols-outlined" data-icon="add_circle">add_circle</span>
            أضف إعلان جديد
          </Link>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
          <div className="bg-surface-white border border-border-light rounded-xl p-md flex items-center justify-between">
            <div>
              <p className="text-tertiary font-label-lg mb-xs">إعلانات نشطة</p>
              <h4 className="text-headline-md font-black text-on-surface">{activeCount}</h4>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <span className="material-symbols-outlined" data-icon="check_circle">check_circle</span>
            </div>
          </div>
          <div className="bg-surface-white border border-border-light rounded-xl p-md flex items-center justify-between">
            <div>
              <p className="text-tertiary font-label-lg mb-xs">إعلانات مباعة</p>
              <h4 className="text-headline-md font-black text-on-surface">{soldCount}</h4>
            </div>
            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined" data-icon="draft">draft</span>
            </div>
          </div>
          <div className="bg-surface-white border border-border-light rounded-xl p-md flex items-center justify-between">
            <div>
              <p className="text-tertiary font-label-lg mb-xs">إجمالي المشاهدات</p>
              <h4 className="text-headline-md font-black text-on-surface">{totalViews || 0}</h4>
            </div>
            <div className="w-12 h-12 rounded-lg bg-secondary-container/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined" data-icon="visibility">visibility</span>
            </div>
          </div>
        </div>

        {/* Filter & List Header */}
        <div className="flex justify-between items-center mb-md border-b border-border-light pb-sm">
          <div className="flex gap-md">
            <button 
              className={`font-label-lg pb-sm transition-colors ${activeTab === 'الكل' ? 'text-primary border-b-2 border-primary' : 'text-tertiary hover:text-primary'}`}
              onClick={() => setActiveTab('الكل')}
            >
              الكل ({activeTab === 'الكل' ? totalCount : listings.length})
            </button>
            <button 
              className={`font-label-lg pb-sm transition-colors ${activeTab === 'النشطة' ? 'text-primary border-b-2 border-primary' : 'text-tertiary hover:text-primary'}`}
              onClick={() => setActiveTab('النشطة')}
            >
              النشطة
            </button>
            <button 
              className={`font-label-lg pb-sm transition-colors ${activeTab === 'المباعة' ? 'text-primary border-b-2 border-primary' : 'text-tertiary hover:text-primary'}`}
              onClick={() => setActiveTab('المباعة')}
            >
              المباعة
            </button>
          </div>
          <div className="flex items-center gap-xs text-tertiary cursor-pointer hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[20px]" data-icon="filter_list">filter_list</span>
            <span className="font-label-sm">تصفية</span>
          </div>
        </div>

        {/* Ads List */}
        <div className="space-y-md">
          {loading ? (
            <div className="p-xl text-center">جاري تحميل الإعلانات...</div>
          ) : listings.length > 0 ? (
            <>
              {listings.map(listing => (
                <div key={listing.id} className={`bg-surface-white border border-border-light rounded-xl overflow-hidden hover:border-accent-yellow transition-all flex flex-col md:flex-row ${listing.status === 'sold' ? 'opacity-80 grayscale' : ''}`}>
                  <div className="md:w-64 h-48 md:h-auto relative overflow-hidden">
                    <img alt={listing.title} className="w-full h-full object-cover" src={listing.image} />
                    {listing.status === 'active' && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-xs py-[2px] rounded text-[12px] font-bold">نشط</div>
                    )}
                    {listing.status === 'sold' && (
                      <div className="absolute top-3 right-3 bg-tertiary text-white px-xs py-[2px] rounded text-[12px] font-bold">مباع</div>
                    )}
                  </div>
                  <div className="flex-1 p-md flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-xs">
                        <h3 className={`font-headline-sm text-headline-sm font-bold ${listing.status === 'sold' ? 'text-tertiary' : 'text-on-surface'}`}>
                          {listing.title || `${listing.make} ${listing.model} ${listing.year}`}
                        </h3>
                        <span className={`font-headline-sm text-headline-sm font-black ${listing.status === 'sold' ? 'text-tertiary' : 'text-on-surface'}`}>
                          {listing.price ? Number(listing.price).toLocaleString() : ''} ل.س
                        </span>
                      </div>
                      <div className={`flex items-center gap-md font-body-sm mb-md ${listing.status === 'sold' ? 'text-tertiary/60' : 'text-tertiary'}`}>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">calendar_today</span> {listing.year}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">speed</span> {listing.km ? Number(listing.km).toLocaleString() : ''} كم</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span> {listing.city}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-sm pt-md border-t border-border-light">
                      <span className={listing.status === 'sold' ? 'text-tertiary/60 font-body-sm' : 'text-tertiary font-body-sm'}>
                        نشر في: {listing.created_at ? new Date(listing.created_at).toLocaleDateString('ar-EG') : 'غير محدد'}
                      </span>
                      <div className="flex flex-wrap gap-xs mt-2 sm:mt-0">
                        <Link to={`/car/${listing.id}`} className="flex items-center gap-1 px-md py-xs border border-border-light rounded-lg hover:bg-surface-container transition-all">
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                          عرض التفاصيل
                        </Link>
                        {listing.status === 'active' && (
                          <Link to={`/edit-ad/${listing.id}`} className="flex items-center gap-1 px-md py-xs border border-border-light rounded-lg hover:bg-surface-container transition-all">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                            تعديل
                          </Link>
                        )}
                        <button 
                          onClick={() => handleToggleSold(listing.id, listing.status)}
                          className={`flex items-center gap-1 px-md py-xs border border-border-light rounded-lg transition-all ${listing.status === 'active' ? 'hover:bg-tertiary hover:text-white' : 'hover:bg-green-500 hover:text-white'}`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {listing.status === 'active' ? 'sell' : 'undo'}
                          </span>
                          {listing.status === 'active' ? 'تحديد كمباع' : 'تحديد كنشط'}
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(listing.id)}
                          className="flex items-center justify-center w-10 h-10 border border-border-light rounded-lg text-error hover:bg-error-container/20 transition-all"
                          title="حذف"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {hasMore && (
                <div className="flex justify-center pt-md">
                  <button 
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 px-xl py-sm bg-surface-container text-primary font-bold rounded-full hover:bg-primary-container transition-colors disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                        جاري التحميل...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                        عرض المزيد
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-xl text-center font-bold text-tertiary">لا توجد إعلانات مطابقة</div>
          )}
        </div>

      </main>
    </DashboardLayout>
  );
}
