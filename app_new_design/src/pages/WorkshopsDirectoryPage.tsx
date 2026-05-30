import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchServices } from '../lib/queries';

export default function WorkshopsDirectoryPage() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchServices()
      .then(data => setServices(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const scrollSlider = (distance: number) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-lg">
            
      {/* Subscription Plans Section */}
      <section className="mb-xl text-center">
        <h2 className="font-headline-lg text-headline-lg mb-md">اختر باقة التميز لورشتك</h2>
        <p className="font-body-md text-body-md text-tertiary mb-lg max-w-2xl mx-auto">زد من وصول عملائك واجعل ورشتك تتصدر نتائج البحث في منطقتك بضغطة زر واحدة.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {/* Free Plan */}
          <div className="bg-surface-white border border-border-light p-lg rounded-xl flex flex-col items-center">
            <span className="font-headline-sm text-headline-sm mb-base">مجاني</span>
            <div className="text-primary font-headline-md text-headline-md mb-md">0 ل.س <span className="text-body-sm text-tertiary">/شهرياً</span></div>
            <ul className="text-right space-y-sm mb-lg w-full">
              <li className="flex items-center gap-xs font-body-sm text-body-sm"><span className="material-symbols-outlined text-verification-blue">check</span> إدراج أساسي في الدليل</li>
              <li className="flex items-center gap-xs font-body-sm text-body-sm"><span className="material-symbols-outlined text-verification-blue">check</span> صورة واحدة للورشة</li>
              <li className="flex items-center gap-xs font-body-sm text-body-sm text-muted opacity-50"><span className="material-symbols-outlined">close</span> دعم فني مخصص</li>
            </ul>
            <button className="w-full py-sm border border-text-primary rounded-lg font-label-lg text-label-lg hover:bg-surface-container-low transition-all">ابدأ الآن</button>
          </div>
          
          {/* Premium Plan (Highlighted) */}
          <div className="bg-primary-container border-2 border-primary p-lg rounded-xl flex flex-col items-center relative transform md:scale-105 shadow-md">
            <div className="absolute -top-4 bg-primary text-on-primary px-md py-1 rounded-full font-label-sm text-label-sm">الأكثر طلباً</div>
            <span className="font-headline-sm text-headline-sm mb-base">مميز</span>
            <div className="text-on-primary-container font-headline-md text-headline-md mb-md">25,000 ل.س <span className="text-body-sm text-on-primary-container/70">/شهرياً</span></div>
            <ul className="text-right space-y-sm mb-lg w-full">
              <li className="flex items-center gap-xs font-body-sm text-body-sm font-bold"><span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> ظهور في القائمة الذهبية</li>
              <li className="flex items-center gap-xs font-body-sm text-body-sm font-bold"><span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> 10 صور عالية الجودة</li>
              <li className="flex items-center gap-xs font-body-sm text-body-sm font-bold"><span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> إحصائيات وصول الزوار</li>
              <li className="flex items-center gap-xs font-body-sm text-body-sm font-bold"><span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> دعم فني 24/7</li>
            </ul>
            <button className="w-full py-sm bg-text-primary text-surface-white rounded-lg font-label-lg text-label-lg hover:opacity-90 transition-all">اشترك الآن</button>
          </div>
          
          {/* Basic Plan */}
          <div className="bg-surface-white border border-border-light p-lg rounded-xl flex flex-col items-center">
            <span className="font-headline-sm text-headline-sm mb-base">أساسي</span>
            <div className="text-primary font-headline-md text-headline-md mb-md">10,000 ل.س <span className="text-body-sm text-tertiary">/شهرياً</span></div>
            <ul className="text-right space-y-sm mb-lg w-full">
              <li className="flex items-center gap-xs font-body-sm text-body-sm"><span className="material-symbols-outlined text-verification-blue">check</span> ظهور متوسط في البحث</li>
              <li className="flex items-center gap-xs font-body-sm text-body-sm"><span className="material-symbols-outlined text-verification-blue">check</span> 3 صور للورشة</li>
              <li className="flex items-center gap-xs font-body-sm text-body-sm text-muted opacity-50"><span className="material-symbols-outlined">close</span> إحصائيات وصول</li>
            </ul>
            <button className="w-full py-sm border border-text-primary rounded-lg font-label-lg text-label-lg hover:bg-surface-container-low transition-all">اختر الباقة</button>
          </div>
        </div>
      </section>

      {/* Featured Workshops Section */}
      <section className="mb-xl">
        <div className="flex justify-between items-center mb-md">
          <h3 className="font-headline-md text-headline-md">ورشات مميزة (Featured)</h3>
          <div className="flex gap-xs">
            <button className="p-2 border border-border-light rounded-full hover:bg-surface-container transition-all" onClick={() => scrollSlider(-300)}>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button className="p-2 border border-border-light rounded-full hover:bg-surface-container transition-all" onClick={() => scrollSlider(300)}>
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </div>
        </div>
        
        <div ref={sliderRef} className="flex gap-md overflow-x-auto scrollbar-hide scroll-smooth pb-md px-1">
          {loading ? (
            <div className="py-md text-center w-full">جاري تحميل الورشات المميزة...</div>
          ) : (
            services.filter(s => s.subscription_tier === 'premium').map(service => (
              <Link to={`/workshop/${service.id}`} key={service.id} className="min-w-[280px] md:min-w-[320px] bg-surface-white border border-border-light rounded-xl overflow-hidden cursor-pointer active:scale-95 transition-transform block">
                <div className="h-40 bg-surface-container relative">
                  <img className="w-full h-full object-cover" src={service.image || '/placeholder-car.svg'} alt={service.name} />
                  <span className="absolute top-sm right-sm bg-accent-yellow text-on-primary-container px-sm py-1 rounded font-label-sm text-label-sm font-bold">مميزة</span>
                </div>
                <div className="p-md">
                  <h4 className="font-headline-sm text-headline-sm mb-xs">{service.name}</h4>
                  <div className="flex items-center gap-xs text-tertiary mb-base">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    <span className="font-body-sm text-body-sm">{service.city || 'غير محدد'}</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-accent-yellow text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-label-lg text-label-lg">{service.rating || '4.5'}</span>
                    <span className="text-tertiary font-body-sm text-body-sm">({service.inspections_count || 0} تقييم)</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Sponsorship Banner */}
      <section className="mb-xl">
        <div className="w-full h-32 md:h-48 bg-surface-container-highest rounded-xl flex items-center justify-between px-lg overflow-hidden relative border border-border-light">
          <div className="z-10 text-right">
            <h3 className="font-headline-md text-headline-md text-text-primary mb-xs">إعلانك هنا يراه آلاف المهتمين</h3>
            <p className="font-body-md text-body-md text-tertiary">روّج لورشتك أو قطع غيارك بأقل التكاليف.</p>
          </div>
          <div className="hidden md:flex flex-col items-center justify-center bg-accent-yellow px-xl py-md transform rotate-12 -ml-20">
            <span className="font-headline-lg text-headline-lg font-black text-on-primary-container">AD SPACE</span>
          </div>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
        </div>
      </section>

      {/* Workshop Directory with Filters */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-lg">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-lg">
          <div className="bg-surface-white border border-border-light p-md rounded-lg">
            <h4 className="font-headline-sm text-headline-sm mb-md flex items-center gap-xs">
              <span className="material-symbols-outlined">filter_list</span> الفلترة
            </h4>
            <div className="mb-md">
              <label className="font-label-lg text-label-lg block mb-sm">المدينة (مدن سوريا)</label>
              <select className="w-full bg-surface-container-low border-border-light rounded-lg p-sm font-body-sm text-body-sm outline-none focus:border-primary">
                <option>كل المحافظات</option>
                <option>دمشق</option>
                <option>ريف دمشق</option>
                <option>حلب</option>
                <option>حمص</option>
                <option>حماة</option>
                <option>اللاذقية</option>
                <option>طرطوس</option>
                <option>درعا</option>
                <option>السويداء</option>
                <option>القنيطرة</option>
                <option>إدلب</option>
                <option>الرقة</option>
                <option>دير الزور</option>
                <option>الحسكة</option>
              </select>
            </div>
            <div className="mb-md">
              <label className="font-label-lg text-label-lg block mb-sm">نوع الورشة</label>
              <div className="space-y-sm">
                <label className="flex items-center gap-xs cursor-pointer group">
                  <input className="rounded text-primary focus:ring-primary h-4 w-4 border-border-light" type="checkbox" />
                  <span className="font-body-sm text-body-sm group-hover:text-primary transition-colors">فحص فني</span>
                </label>
                <label className="flex items-center gap-xs cursor-pointer group">
                  <input defaultChecked className="rounded text-primary focus:ring-primary h-4 w-4 border-border-light" type="checkbox" />
                  <span className="font-body-sm text-body-sm group-hover:text-primary transition-colors">ميكانيك</span>
                </label>
                <label className="flex items-center gap-xs cursor-pointer group">
                  <input className="rounded text-primary focus:ring-primary h-4 w-4 border-border-light" type="checkbox" />
                  <span className="font-body-sm text-body-sm group-hover:text-primary transition-colors">كهرباء وبرمجة</span>
                </label>
                <label className="flex items-center gap-xs cursor-pointer group">
                  <input className="rounded text-primary focus:ring-primary h-4 w-4 border-border-light" type="checkbox" />
                  <span className="font-body-sm text-body-sm group-hover:text-primary transition-colors">تجليس ودهان</span>
                </label>
                <label className="flex items-center gap-xs cursor-pointer group">
                  <input className="rounded text-primary focus:ring-primary h-4 w-4 border-border-light" type="checkbox" />
                  <span className="font-body-sm text-body-sm group-hover:text-primary transition-colors">تصليح هيكل</span>
                </label>
                <label className="flex items-center gap-xs cursor-pointer group">
                  <input className="rounded text-primary focus:ring-primary h-4 w-4 border-border-light" type="checkbox" />
                  <span className="font-body-sm text-body-sm group-hover:text-primary transition-colors">صيانة سريعة</span>
                </label>
              </div>
            </div>
            <button className="w-full py-sm bg-primary text-on-primary rounded-lg font-label-lg text-label-lg hover:opacity-90 transition-all">تطبيق الفلاتر</button>
          </div>
          <div className="bg-surface-container p-md rounded-lg">
            <p className="font-body-sm text-body-sm text-tertiary">هل أنت صاحب ورشة؟</p>
            <a className="text-primary font-bold font-label-lg text-label-lg hover:underline" href="#">سجل ورشتك اليوم مجاناً</a>
          </div>
        </aside>

        {/* Main List */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-headline-sm text-headline-sm">نتائج البحث ({services.length} ورشة)</h3>
            <div className="flex gap-xs">
              <span className="material-symbols-outlined cursor-pointer p-xs text-primary bg-primary-container/20 rounded">grid_view</span>
              <span className="material-symbols-outlined cursor-pointer p-xs text-tertiary hover:bg-surface-container rounded">list</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {loading ? (
              <div className="col-span-2 text-center py-xl text-tertiary font-body-md">جاري التحميل...</div>
            ) : services.length === 0 ? (
              <div className="col-span-2 text-center py-xl text-tertiary font-body-md">لم يتم العثور على ورشات.</div>
            ) : (
              services.map(service => (
                <Link to={`/workshop/${service.id}`} key={service.id} className="bg-surface-white border border-border-light rounded-lg flex overflow-hidden hover:border-primary transition-all group cursor-pointer h-24 block">
                  <div className="w-24 h-full bg-surface-container-high shrink-0 float-right">
                    <img className="w-full h-full object-cover" src={service.image || '/placeholder-car.svg'} alt={service.name} />
                  </div>
                  <div className="p-md flex-1">
                    <div className="flex justify-between items-start mb-base">
                      <h5 className="font-label-lg text-label-lg font-bold group-hover:text-primary transition-colors">{service.name}</h5>
                      {service.subscription_tier === 'premium' ? (
                        <span className="bg-verification-blue/10 text-verification-blue px-xs py-0.5 rounded-full text-[10px] font-bold">موثوق</span>
                      ) : (
                        <span className="bg-surface-container-highest text-tertiary px-xs py-0.5 rounded-full text-[10px] font-bold">نشط</span>
                      )}
                    </div>
                    <div className="flex gap-md mb-xs">
                      <span className="text-tertiary text-[12px] flex items-center gap-xs"><span className="material-symbols-outlined text-[14px]">location_on</span> {service.city || 'غير محدد'}</span>
                      <span className="text-tertiary text-[12px] flex items-center gap-xs"><span className="material-symbols-outlined text-[14px]">build</span> {service.category || 'صيانة عامة'}</span>
                    </div>
                    <div className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-accent-yellow text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-label-sm text-label-sm">{service.rating || '4.0'}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          
          <div className="mt-lg flex justify-center gap-sm">
            <button className="w-10 h-10 flex items-center justify-center bg-primary text-on-primary rounded font-bold">١</button>
            <button className="w-10 h-10 flex items-center justify-center bg-surface-white border border-border-light rounded hover:bg-surface-container">٢</button>
            <button className="w-10 h-10 flex items-center justify-center bg-surface-white border border-border-light rounded hover:bg-surface-container">٣</button>
            <span className="w-10 h-10 flex items-center justify-center">...</span>
            <button className="w-10 h-10 flex items-center justify-center bg-surface-white border border-border-light rounded hover:bg-surface-container"><span className="material-symbols-outlined">chevron_left</span></button>
          </div>
        </div>
      </section>


    </div>
  );
}
