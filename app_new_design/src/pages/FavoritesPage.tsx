import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../contexts/AuthContext';

export default function FavoritesPage() {
  const { user } = useAuth();
  const { favorites, removeFavorite } = useFavorites();
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());

  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const clearCompare = () => setCompareIds(new Set());
  const compareCount = compareIds.size;

  return (
    <DashboardLayout>
      {/* Main Content Area */}
      <main className="flex-1 py-lg px-md lg:px-xl w-full">
        <header className="mb-lg flex justify-between items-center">
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface">سياراتي المفضلة</h1>
            <p className="text-body-md text-tertiary mt-base">
              لديك <span className="font-bold text-primary">{favorites.length}</span> سيارات في قائمة الرغبات
            </p>
          </div>
          <div className="flex gap-sm">
            <button className="flex items-center gap-xs px-md py-2 border border-border-light rounded-lg text-tertiary font-label-lg hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-[20px]">sort</span>
              ترتيب حسب
            </button>
          </div>
        </header>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-lg">
            {favorites.map((car) => (
              <article key={car.id} className="bg-surface-white border border-border-light rounded-lg overflow-hidden flex flex-col transition-all hover:border-primary-container relative">
                <div className="relative aspect-video">
                  <img alt={car.title} className="w-full h-full object-cover" src={car.image} />
                  <button 
                    onClick={() => removeFavorite(car.id)}
                    className="absolute top-3 left-3 w-10 h-10 bg-surface-white/90 rounded-full flex items-center justify-center text-error hover:bg-error hover:text-white transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                  {car.verified && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-verification-blue text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">موثوق</span>
                    </div>
                  )}
                </div>
                <div className="p-md flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-tight">{car.title}</h2>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-md">
                    <span className="bg-surface-container px-2 py-1 rounded text-body-sm text-tertiary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span> {car.year}
                    </span>
                    <span className="bg-surface-container px-2 py-1 rounded text-body-sm text-tertiary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">speed</span> {car.mileage}
                    </span>
                    <span className="bg-surface-container px-2 py-1 rounded text-body-sm text-tertiary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">location_on</span> {car.location}
                    </span>
                  </div>
                  <div className="mt-auto pt-md border-t border-border-light flex justify-between items-center">
                    <div>
                      <p className="text-label-sm text-tertiary">السعر</p>
                      <p className="font-headline-sm text-headline-sm font-bold text-on-surface">{Number(car.price).toLocaleString()} ل.س</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <span className="text-body-sm text-tertiary group-hover:text-primary transition-colors">مقارنة</span>
                      <input 
                        className="w-5 h-5 rounded border-border-light text-primary focus:ring-primary" 
                        type="checkbox"
                        checked={compareIds.has(car.id)}
                        onChange={() => toggleCompare(car.id)}
                      />
                    </label>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-xl text-center">
            <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-md">
              <span className="material-symbols-outlined text-[48px] text-tertiary">favorite_border</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">لا يوجد سيارات مفضلة</h3>
            <p className="text-body-md text-tertiary mt-2 max-w-[384px]">ابدأ بتصفح المعرض وأضف السيارات التي تعجبك إلى قائمة المفضلة للرجوع إليها لاحقاً.</p>
            <Link to="/" className="mt-lg bg-primary text-on-primary px-xl py-3 rounded-lg font-label-lg hover:brightness-110 transition-all inline-block">تصفح المعرض الآن</Link>
          </div>
        )}
      </main>

      {/* Comparison Floating Bar */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] transition-all duration-500 ease-in-out ${compareCount > 1 ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}
      >
        <div className="bg-on-surface text-white px-lg py-4 rounded-xl shadow-2xl flex items-center justify-between gap-md min-w-[300px] md:min-w-[500px]">
          <div className="flex items-center gap-sm md:gap-md">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-surface font-bold">
              {compareCount}
            </div>
            <p className="font-label-lg text-label-lg">سيارات مختارة للمقارنة</p>
          </div>
          <div className="flex-1 h-px bg-white/20 hidden md:block mx-4"></div>
          <div className="flex items-center gap-md">
            <Link to="/compare" className="bg-primary-container text-on-primary-container px-md py-2 rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all text-center">
              قارن الآن
            </Link>
            <button onClick={clearCompare} className="text-white/60 hover:text-white transition-colors">
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
