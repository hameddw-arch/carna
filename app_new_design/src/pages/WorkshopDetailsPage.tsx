import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchService } from '../lib/queries';

export default function WorkshopDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchService(id)
      .then(data => setService(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-xl text-center">
        <h2 className="text-xl font-bold">جاري تحميل تفاصيل الورشة...</h2>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-xl text-center">
        <h2 className="text-xl font-bold">الورشة غير موجودة</h2>
        <Link to="/workshops" className="text-primary mt-4 inline-block">العودة للورشات</Link>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-xs md:py-md mb-xl rtl text-on-surface">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-xs py-sm text-label-sm font-label-sm text-on-surface-variant mb-base">
        <Link className="hover:text-accent-yellow transition-colors" to="/">الرئيسية</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_left</span>
        <Link className="hover:text-accent-yellow transition-colors" to="/workshops">الورش</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_left</span>
        <span className="text-text-primary font-bold">{service.name}</span>
      </nav>

      {/* Hero Gallery Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-xs h-[300px] md:h-[500px] mb-md overflow-hidden rounded-xl">
        {/* Main Large Image */}
        <div className="md:col-span-8 h-full relative group cursor-pointer">
          <img 
            alt={service.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            src={service.image || '/placeholder-car.svg'} 
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all"></div>
        </div>
        
        {/* Stacked Sidebar Images */}
        <div className="hidden md:flex md:col-span-4 flex-col gap-xs h-full">
          <div className="h-1/2 relative group cursor-pointer overflow-hidden">
            <img 
              alt="تفاصيل الورشة 1" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              data-alt="A detailed shot of a specialized automotive technician using a digital scanner on a luxury vehicle's engine. The setting is a sterile, well-lit workshop with professional tools neatly arranged. The lighting focuses on the engine components, highlighting precision and technological mastery in a high-tech car maintenance environment." 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMF-bUMLKqEWgWHTNZD6tXg7opc9dJQxYR6MYO8ex0iVlQEFpjrcUmi3QVc2bZ9nY4fx0udAOj0pOSwt8gpZPwu2krb4Q8yx5GoVy9xavjub8gSTdbmJkEfYvwbxju-pZsKGDkZVaMeZh0iQuNxpqKlmrnER5zIJh2fNFTsyO4yGYYJARSEqAF8pWNJ-3PJzlmMFUm7cv0tZhCtPS-0tlo3SSsga4vCCu-wqgVt0EwCqQ7C8WGNljCJe_j3QGU1hE0mw-lSpdsz1-7" 
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all"></div>
          </div>
          <div className="h-1/2 relative group cursor-pointer overflow-hidden">
            <img 
              alt="تفاصيل الورشة 2" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              data-alt="An expansive view of multiple service bays in a high-capacity car workshop. Sleek cars are positioned on hydraulic lifts, and the flooring is polished concrete with yellow safety lines. The environment is orderly and professional, using bright overhead lighting to showcase a state-of-the-art facility for comprehensive automotive care." 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxctGR4ZRaVRfwKiNElvfFC9Ur0776vZaRXh5rkKbEO3aqcwMKJjcoEPSBlEEUoceIVKWzVF1bE0D8XXjVYoJKBMmAZKEgpUV-djyURhu3fvhqlhct70XZTC341EFaiZLLdU30pK4N2oQ4-nF9C4RH30TtreE7QZb_wUD8bq9XHAyZMgtN_ffVcOTJQErnhxSoBa8Cq-la4Jb4QEG0SMJDT5J8FjaScFGDil4r8IU0Nlf6M6PaDxh3jHT4WCUouJseKsHZQ1AkqknH" 
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all"></div>
            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-4 py-2 rounded-full text-label-sm flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
              عرض الكل
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Identity Header */}
      <div className="bg-surface-white border border-border-light p-md rounded-xl mb-md flex flex-col md:flex-row justify-between items-start md:items-center gap-sm">
        <div>
          <div className="flex items-center gap-xs mb-xs">
            <h1 className="text-headline-md font-headline-md font-bold text-text-primary">{service.name}</h1>
            {service.subscription_tier === 'premium' && (
              <span className="bg-[#E8F5E9] text-[#2E7D32] px-3 py-1 rounded-full text-label-sm font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                موثوق
              </span>
            )}
          </div>
          <div className="flex items-center gap-md text-on-surface-variant font-body-sm text-body-sm">
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px] text-accent-yellow">location_on</span>
              {service.city || 'غير محدد'}
            </div>
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px] text-accent-yellow" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-text-primary font-bold">{service.rating || 'جديد'}</span>
              <span>({service.inspections_count || 0} تقييم)</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-xs w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-surface-container-low hover:bg-surface-container border border-border-light text-text-primary font-label-lg text-label-lg px-xl py-3 rounded-lg transition-all active:scale-95 hover:opacity-70">مشاركة</button>
          <button className="flex-1 md:flex-none bg-accent-yellow hover:bg-primary-container text-black font-bold font-label-lg text-label-lg px-xl py-3 rounded-lg transition-all active:scale-95 hover:opacity-70">حجز موعد</button>
        </div>
      </div>

      {/* Split Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md items-start">
        {/* Main Content Column (Right) */}
        <div className="lg:col-span-2 space-y-md">
          {/* About Section */}
          <div className="bg-surface-white border border-border-light p-md rounded-xl">
            <h2 className="text-headline-sm font-headline-sm font-bold text-text-primary mb-sm">نبذة عن الورشة</h2>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
              {service.description || 'لا يوجد تفاصيل إضافية حول هذه الورشة.'}
            </p>
          </div>

          {/* Specializations Section */}
          <div className="bg-surface-white border border-border-light p-md rounded-xl">
            <h2 className="text-headline-sm font-headline-sm font-bold text-text-primary mb-sm">التخصصات</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-sm">
              <div className="flex items-center gap-xs p-sm border border-border-light rounded-lg hover:border-accent-yellow transition-colors group cursor-pointer">
                <span className="material-symbols-outlined text-accent-yellow">car_repair</span>
                <span className="text-label-md font-label-md group-hover:text-primary transition-colors">فحص فني</span>
              </div>
              <div className="flex items-center gap-xs p-sm border border-border-light rounded-lg hover:border-accent-yellow transition-colors group cursor-pointer">
                <span className="material-symbols-outlined text-accent-yellow">settings</span>
                <span className="text-label-md font-label-md group-hover:text-primary transition-colors">ميكانيك</span>
              </div>
              <div className="flex items-center gap-xs p-sm border border-border-light rounded-lg hover:border-accent-yellow transition-colors group cursor-pointer">
                <span className="material-symbols-outlined text-accent-yellow">bolt</span>
                <span className="text-label-md font-label-md group-hover:text-primary transition-colors">كهرباء وبرمجة</span>
              </div>
              <div className="flex items-center gap-xs p-sm border border-border-light rounded-lg hover:border-accent-yellow transition-colors group cursor-pointer">
                <span className="material-symbols-outlined text-accent-yellow">format_paint</span>
                <span className="text-label-md font-label-md group-hover:text-primary transition-colors">تجليس ودهان</span>
              </div>
              <div className="flex items-center gap-xs p-sm border border-border-light rounded-lg hover:border-accent-yellow transition-colors group cursor-pointer">
                <span className="material-symbols-outlined text-accent-yellow">build_circle</span>
                <span className="text-label-md font-label-md group-hover:text-primary transition-colors">تصليح هيكل</span>
              </div>
              <div className="flex items-center gap-xs p-sm border border-border-light rounded-lg hover:border-accent-yellow transition-colors group cursor-pointer">
                <span className="material-symbols-outlined text-accent-yellow">speed</span>
                <span className="text-label-md font-label-md group-hover:text-primary transition-colors">صيانة سريعة</span>
              </div>
            </div>
          </div>

          {/* Features Highlight (Added for Premium feel) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
            <div className="bg-primary-fixed p-sm rounded-xl flex items-center gap-md">
              <div className="w-12 h-12 bg-accent-yellow rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-black">verified_user</span>
              </div>
              <div>
                <div className="font-bold text-label-lg">ضمان الخدمة</div>
                <div className="text-body-sm opacity-80">نقدم ضماناً حقيقياً على كافة الخدمات</div>
              </div>
            </div>
            <div className="bg-secondary-fixed p-sm rounded-xl flex items-center gap-md">
              <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white">schedule</span>
              </div>
              <div>
                <div className="font-bold text-label-lg">التزام بالموعد</div>
                <div className="text-body-sm opacity-80">سرعة في التنفيذ وتسليم في الموعد</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column (Left) */}
        <aside className="space-y-md">
          {/* Contact Card */}
          <div className="bg-surface-white border border-border-light p-md rounded-xl">
            <h3 className="text-label-lg font-label-lg font-bold text-text-primary mb-md">معلومات التواصل</h3>
            <div className="flex flex-col gap-sm">
              <a className="flex items-center justify-between p-3 border border-border-light rounded-lg hover:bg-surface-container-low transition-all active:scale-[0.98] hover:opacity-70" href="tel:0912345678">
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-accent-yellow">call</span>
                  <span className="font-body-md text-body-md" dir="ltr">0912 345 678</span>
                </div>
                <span className="text-label-sm text-on-surface-variant">اتصل الآن</span>
              </a>
              <a className="flex items-center justify-center gap-xs p-3 bg-[#25D366] hover:bg-[#20bd5c] text-white rounded-lg transition-all font-bold active:scale-[0.98] hover:opacity-70" href="https://wa.me/963912345678">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.747-2.874-2.512-2.96-2.626-.088-.113-.716-.953-.716-1.819 0-.866.454-1.292.614-1.457.16-.165.352-.206.468-.206s.232.004.334.009c.106.005.25-.04.391.302.144.35.496 1.208.54 1.298.043.09.073.197.015.312-.059.116-.088.188-.175.288-.088.1-.183.224-.263.302-.089.085-.182.179-.079.356.103.178.458.755.981 1.22.673.598 1.239.784 1.417.873.178.089.283.076.388-.045.105-.121.454-.528.575-.708.121-.18.243-.151.409-.09.167.061 1.06.501 1.241.591.182.091.303.136.347.21.045.075.045.432-.099.837z"></path></svg>
                واتساب
              </a>
            </div>
          </div>

          {/* Hours Card */}
          <div className="bg-surface-white border border-border-light p-md rounded-xl">
            <h3 className="text-label-lg font-label-lg font-bold text-text-primary mb-md">ساعات العمل</h3>
            <div className="space-y-sm">
              <div className="flex justify-between items-center text-body-sm font-body-sm border-b border-surface-container-low pb-xs">
                <span className="text-on-surface-variant">السبت - الخميس</span>
                <span className="text-text-primary font-bold">09:00 ص - 08:00 م</span>
              </div>
              <div className="flex justify-between items-center text-body-sm font-body-sm pb-xs">
                <span className="text-on-surface-variant">الجمعة</span>
                <span className="text-error font-bold italic">مغلق</span>
              </div>
            </div>
          </div>

          {/* Map Card */}
          <div className="bg-surface-white border border-border-light p-md rounded-xl">
            <h3 className="text-label-lg font-label-lg font-bold text-text-primary mb-md">موقع الورشة</h3>
            <div className="w-full h-48 rounded-lg overflow-hidden bg-surface-container-high relative">
              <img 
                alt="خريطة الموقع" 
                className="w-full h-full object-cover" 
                data-location="Damascus" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiMRlLJapSNfCIvVTLOb7DoZzjAcsVlVSb8sfS_QlTLRQPf1pvMb4vwusQp12PWjK8seE0DkOyr0sgidtafkxIZmMxbjHASv5FTGrCbVYUCRDRFtqGQ1shM3ydY8FOjR28-MyFKcQn99VJ82sbHHyAwHt_shXLrU1Ks-JeRP6Kq7_TFNwr2PrxeHirJE71kKw2FpJN72HhpzXUamZuTUL-77qaRiVS_nfIsTnXL5lgOBQEiQCNxlPIGVYuZGr9G5rUUXywiBy5VfRI" 
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <div className="bg-surface-white p-3 rounded-full shadow-lg">
                  <span className="material-symbols-outlined text-accent-yellow text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-white/90 text-label-sm px-2 py-1 rounded text-primary font-bold">{service.city || 'غير محدد'}</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
