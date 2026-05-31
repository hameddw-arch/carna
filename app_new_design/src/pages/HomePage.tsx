import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CarCard from '../components/CarCard';
import { fetchListings, fetchGovernorates } from '../lib/queries/index';
import { usePageView } from '../hooks/useAnalytics';
import SEO from '../components/SEO';
import { organizationSchema, searchActionSchema } from '../lib/schemas';

export default function HomePage() {
  usePageView('/');

  const [dbGovernorates, setDbGovernorates] = useState<string[]>([]);
  const brands = [
    { name: 'تويوتا',   img: '/brands/toyota.svg',   color: '#EB0A1E' },
    { name: 'كيا',      img: '/brands/kia.svg',       color: '#BB162B' },
    { name: 'هيونداي',  img: '/brands/hyundai.svg',   color: '#002C5F' },
    { name: 'هوندا',    img: '/brands/honda.svg',     color: '#E40521' },
    { name: 'نيسان',    img: '/brands/nissan.svg',    color: '#C40C3A' },
    { name: 'سوزوكي',   img: '/brands/suzuki.svg',    color: '#1A4B9A' },
    { name: 'BMW',      img: '/brands/bmw.svg',        color: '#1C69D4' },
    { name: 'مرسيدس',   img: '/brands/mercedes.svg',  color: '#1F1F1F' },
    { name: 'شيفروليه', img: '/brands/chevrolet.svg', color: '#C8A200' },
    { name: 'فورد',     img: '/brands/ford.svg',       color: '#003478' },
  ];

  const [urgentCars, setUrgentCars] = useState<any[]>([]);
  // removed allCarsData state

  useEffect(() => {
    fetchGovernorates().then(data => {
      setDbGovernorates(data.filter(g => g.is_active).map(g => g.name));
    }).catch(console.error);

    fetchListings().then(data => {
      const mapped = data.map(car => ({
        id: car.id,
        title: `${car.make} ${car.model || ''} ${car.year}`,
        numericPrice: car.price,
        price: `$${car.price?.toLocaleString()}`,
        location: car.city,
        year: String(car.year),
        mileage: `${car.mileage} كم`,
        image: car.image,
        brand: car.make,
        bodyType: car.body_type || 'سيدان',
        condition: car.condition || 'مستعمل',
        fuelType: car.fuel_type || 'بنزين',
        transmission: car.transmission || 'أوتوماتيك',
        urgent: car.tags?.includes('عاجل')
      }));
      const urgent = mapped.filter(c => c.urgent).slice(0, 4);
      setUrgentCars(urgent.length ? urgent : mapped.slice(0, 4));
    }).catch(console.error);
  }, []);

  const [heroBrand, setHeroBrand] = useState('اختر الماركة');
  const [heroModel, setHeroModel] = useState('اختر الموديل');
  const [heroCity, setHeroCity] = useState('كل المدن');
  const [heroPrice, setHeroPrice] = useState('كل الأسعار');

  const [sortOrder, setSortOrder] = useState('الأحدث أولاً');
  const [conditionFilter, setConditionFilter] = useState('الكل');
  const [locationFilter, setLocationFilter] = useState('كل المحافظات');
  const [bodyTypeFilter, setBodyTypeFilter] = useState('جميع الفئات');
  const [yearFilter, setYearFilter] = useState('الكل');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [fuelTypeFilter, setFuelTypeFilter] = useState('الكل');
  const [transmissionFilter, setTransmissionFilter] = useState('الكل');

  const [filteredCars, setFilteredCars] = useState<any[]>([]);

  const applyFilters = () => {
    const dbFilters: any = {};
    if (conditionFilter && conditionFilter !== 'الكل') dbFilters.condition = conditionFilter;
    if (locationFilter && locationFilter !== 'كل المحافظات') dbFilters.city = locationFilter;
    if (bodyTypeFilter && bodyTypeFilter !== 'جميع الفئات') dbFilters.body_type = bodyTypeFilter;
    if (yearFilter && yearFilter !== 'الكل' && yearFilter !== 'أقدم') dbFilters.year = parseInt(yearFilter);
    if (minPrice) dbFilters.priceMin = parseInt(minPrice);
    if (maxPrice) dbFilters.priceMax = parseInt(maxPrice);
    
    // Apply Hero filters if they are not default
    if (heroBrand && heroBrand !== 'اختر الماركة') dbFilters.make = heroBrand;
    if (heroCity && heroCity !== 'كل المدن') dbFilters.city = heroCity;

    fetchListings(dbFilters).then(data => {
      let mapped = data.map(car => ({
        id: car.id,
        title: `${car.make} ${car.model || ''} ${car.year}`,
        numericPrice: car.price,
        price: `$${car.price?.toLocaleString()}`,
        location: car.city,
        year: String(car.year),
        mileage: `${car.mileage} كم`,
        image: car.image,
        brand: car.make,
        bodyType: car.body_type || 'سيدان',
        condition: car.condition || 'مستعمل',
        fuelType: car.fuel_type || 'بنزين',
        transmission: car.transmission || 'أوتوماتيك',
        urgent: car.tags?.includes('عاجل')
      }));

      // In-memory sort since supabase query doesn't handle all complex sorts directly yet
      if (sortOrder === 'السعر: من الأقل للأعلى') {
        mapped.sort((a, b) => a.numericPrice - b.numericPrice);
      } else if (sortOrder === 'السعر: من الأعلى للأقل') {
        mapped.sort((a, b) => b.numericPrice - a.numericPrice);
      }
      setFilteredCars(mapped);
    }).catch(console.error);
  };

  useEffect(() => {
    applyFilters();
  }, [sortOrder, bodyTypeFilter, heroBrand]); // Automatically re-fetch on quick filters


  return (
    <>
      <SEO
        title="كارنا - منصة بيع وشراء السيارات والورشات في سوريا"
        description="منصة كارنا للسيارات - ابحث عن السيارات المستعملة والجديدة من أفضل البائعين والموزعين في سوريا. اكتشف آلاف الإعلانات مع صور عالية الجودة وتفاصيل دقيقة."
        image="/carna-logo.svg"
        url="/"
        type="website"
        jsonLd={[organizationSchema(), searchActionSchema()]}
      />
      <section 
        className="relative py-24 px-margin-mobile md:px-margin-desktop overflow-hidden bg-surface-container-low"
        style={{
          backgroundImage: 'url("/images/hero-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80 z-0"></div>

        <div className="max-w-container-max mx-auto flex flex-col items-center text-center relative z-10">
          <h1 className="font-headline-lg text-[2.5rem] md:text-[3.5rem] font-black text-white mb-lg leading-tight drop-shadow-md">
            كارنا... والكار كارنا <br />
            <span className="text-accent-yellow drop-shadow-md">وجهتك الأولى للسيارات والورشات</span>
          </h1>
          <div className="w-full max-w-4xl bg-surface-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-md grid grid-cols-1 md:grid-cols-5 gap-sm items-end mt-2">
            <div className="flex flex-col gap-xs text-right">
              <label className="font-label-sm text-label-sm text-text-muted">الماركة</label>
              <select value={heroBrand} onChange={e => setHeroBrand(e.target.value)} className="border-border-light rounded-lg font-body-md text-body-md w-full focus:ring-accent-yellow focus:border-accent-yellow">
                <option>اختر الماركة</option>
                <option>تويوتا</option>
                <option>مرسيدس</option>
                <option>نيسان</option>
                <option>هيونداي</option>
                <option>كيا</option>
              </select>
            </div>
            <div className="flex flex-col gap-xs text-right">
              <label className="font-label-sm text-label-sm text-text-muted">الموديل</label>
              <select value={heroModel} onChange={e => setHeroModel(e.target.value)} className="border-border-light rounded-lg font-body-md text-body-md w-full focus:ring-accent-yellow focus:border-accent-yellow">
                <option>اختر الموديل</option>
              </select>
            </div>
            <div className="flex flex-col gap-xs text-right">
              <label className="font-label-sm text-label-sm text-text-muted">المدينة</label>
              <select value={heroCity} onChange={e => setHeroCity(e.target.value)} className="border-border-light rounded-lg font-body-md text-body-md w-full focus:ring-accent-yellow focus:border-accent-yellow">
                <option>كل المدن</option>
                {dbGovernorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-xs text-right">
              <label className="font-label-sm text-label-sm text-text-muted">السعر</label>
              <select value={heroPrice} onChange={e => setHeroPrice(e.target.value)} className="border-border-light rounded-lg font-body-md text-body-md w-full focus:ring-accent-yellow focus:border-accent-yellow">
                <option>كل الأسعار</option>
              </select>
            </div>
            <button 
               onClick={() => { applyFilters(); document.getElementById('all-cars-section')?.scrollIntoView({ behavior: 'smooth' }); }}
               className="bg-accent-yellow text-text-primary h-[42px] rounded-lg font-headline-sm text-headline-sm hover:brightness-95 transition-all">
              ابحث
            </button>
          </div>
        </div>
      </section>

      <section className="py-xl px-margin-desktop bg-surface-white">
        <div className="max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-lg">
            <div>
              <div className="font-label-lg text-label-lg text-primary mb-1">ابحث بالماركة</div>
              <h2 className="font-headline-md text-headline-md text-text-primary">كل الماركات، مكان واحد</h2>
            </div>
            <button 
              onClick={() => { setHeroBrand('اختر الماركة'); document.getElementById('all-cars-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="flex items-center gap-1 font-label-lg text-label-lg text-text-muted hover:text-primary transition-colors">
              كل الماركات <span className="material-symbols-outlined text-[16px]" style={{ transform: 'rotate(180deg)' }}>chevron_right</span>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-sm">
            {brands.map((b, i) => {
              const active = heroBrand === b.name;
              return (
                <div 
                  key={i} 
                  onClick={() => { setHeroBrand(b.name); document.getElementById('all-cars-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className={`border rounded-2xl p-sm cursor-pointer text-center transition-all flex flex-col items-center justify-center gap-xs
                    ${active ? 'text-white shadow-md' : 'bg-surface-white border-border-light text-text-primary hover:shadow-sm'}`}
                  style={{
                    backgroundColor: active ? b.color : undefined,
                    borderColor: active ? b.color : undefined,
                    boxShadow: active ? `0 6px 18px ${b.color}55` : undefined
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center p-2 mb-1 transition-colors"
                    style={{ backgroundColor: active ? 'rgba(255,255,255,0.18)' : b.color }}
                  >
                    <img className="w-full h-full object-contain" style={{ filter: 'brightness(0) invert(1)' }} alt={b.name} src={b.img} />
                  </div>
                  <span className="font-label-lg text-label-lg font-bold">{b.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-xl px-margin-desktop bg-surface-white border-b border-border-light">
        <div className="max-w-container-max mx-auto">
          <h2 className="font-headline-md text-headline-md text-text-primary mb-lg text-right">تصفح حسب نوع الهيكل</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-md">
            {/* Sedan */}
            <div onClick={() => { setBodyTypeFilter('سيدان'); document.getElementById('all-cars-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="bg-surface-white border border-border-light rounded-xl p-md flex flex-col items-center justify-center gap-sm cursor-pointer hover:border-accent-yellow transition-all group">
              <img alt="سيدان" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRe7Pmv-uausgCO9nVynpcVDrV1nvpTH9hX9k_Zlxkm3etuHtRPblF3Ne-3MpVf-rRsbGSj-uk8jdArl1JFPsEV_SdqL2nzQdf7DbXz68Xh7-x-GQ2jE9C1TdlU84D-iNF3RNeKFNT1aUsfCPcro4QByXeTaXiuakagbby-NoU1oeF1kUqQStZWoUKJCY0MgJ464tAVRK7G8098f9E7HbWOCnwRyH5vxPCJT0QfHBKgxvdiDAB6ZOBjaLzaZZWLK4-7LPy9OYPNMvE" />
              <span className="font-label-lg text-label-lg text-text-primary">سيدان</span>
            </div>
            {/* SUV */}
            <div onClick={() => { setBodyTypeFilter('دفع رباعي (SUV)'); document.getElementById('all-cars-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="bg-surface-white border border-border-light rounded-xl p-md flex flex-col items-center justify-center gap-sm cursor-pointer hover:border-accent-yellow transition-all group">
              <img alt="دفع رباعي" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDzLB_DdIsV0yI_jPKOOtDdHqr_4j6Qa0wgDZub-ZlXgruuS671MMfQBw2d6XLriTwavvJ2cpnJaO7JT6_N13vNq8Zk4kXdmo_WAQ-cQAmAHf4dBoKptevCpsUGiTOVVYZJEYTdfV2we_7AGGhrOVWQT3O4avebPt0UTenQL7J9_6aPUeOPh8PG5DLQtjN_EtPgcf2CX-fc9seJrkhAzVFdpv6doNulUF3EHHb5vgtdmhXo07eNUrYmFgglmJP7FCAIYfLSzbNFim1" />
              <span className="font-label-lg text-label-lg text-text-primary">دفع رباعي (SUV)</span>
            </div>
            {/* Pickup */}
            <div onClick={() => { setBodyTypeFilter('بيك أب'); document.getElementById('all-cars-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="bg-surface-white border border-border-light rounded-xl p-md flex flex-col items-center justify-center gap-sm cursor-pointer hover:border-accent-yellow transition-all group">
              <img alt="بيكاب" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGXnaoi4LIdN540d-TrpwWf66L88-rmqZJSeAnuiTI3CekFwH5NFxk0s75eidTygb-yDhxS6gB9O_xsj4OKu8FI7-JJTY1kKc3llDaSP3Lb8AP40nIEZ0mr_iz0Y1DBejXUj8IxA2VVf5xQRSzlXgYPVE42hU1simn8QJjwtEyD0-9URZiL3tMlod6fLnqV7vZpfyCaZY3zK6Jkv3e7krHWchbPsQ2os8EdQOL68hlUywhTbjg-yPRaOeVXQnXinjNyMga954JS_w1" />
              <span className="font-label-lg text-label-lg text-text-primary">بيكاب</span>
            </div>
            {/* Van */}
            <div onClick={() => { setBodyTypeFilter('فان'); document.getElementById('all-cars-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="bg-surface-white border border-border-light rounded-xl p-md flex flex-col items-center justify-center gap-sm cursor-pointer hover:border-accent-yellow transition-all group">
              <img alt="فان" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPEsE-Jv_FTcfRGnLoipy2y16ya_75NJIMHMR7KuXCXRpOFjvKVFp3jg2OfrsUFG1hiGOkQTPekyjID7DEQK0Ni1nZle-LW4ZAv0ixhV-mrB6UyVar5RBstj9RNeMDCT3ke12X-RBaqKIC3HtAIzU8V_bBPTw6JZ4Fv_2eLNRmddQHeVD9fMmyI5Al_PjQqonXS8UmJuXLM7UAeeo1l3Ujao2r-TJcQ8-oMnE-rUjQTDEi3qKtReEV61lYvEEvXlI8vUa9ekpe6D1C" />
              <span className="font-label-lg text-label-lg text-text-primary">فان</span>
            </div>
            {/* Hatchback */}
            <div onClick={() => { setBodyTypeFilter('هاتشباك'); document.getElementById('all-cars-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="bg-surface-white border border-border-light rounded-xl p-md flex flex-col items-center justify-center gap-sm cursor-pointer hover:border-accent-yellow transition-all group">
              <img alt="هاتشباك" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADf9kt3gs-aOWpfXuu2cu58dcr4RRVanPtUv0MW6BODK2oMdODxRUzCwbmEb2g5yVuuEpsKz3_9fMNF03NQwsfDzK2pNIYrR1yadmfWP3TU-Dlsf2G-WRmwnysGutoUH0TtLy31n8XwQZyRvX8tpKc_-QQlC2EgprtfiYzyKKZiFDWwGfBg9JrTkd5zNPUXgmaZDSnw6ZIYwxnpooOC72X5zR4eQTO7Z00AAw34sVUhHsZFaruGfK-cTkKLloLaAa5qBaaRO9EVJ3V" />
              <span className="font-label-lg text-label-lg text-text-primary">هاتشباك</span>
            </div>
            {/* Coupe */}
            <div onClick={() => { setBodyTypeFilter('كوبيه'); document.getElementById('all-cars-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="bg-surface-white border border-border-light rounded-xl p-md flex flex-col items-center justify-center gap-sm cursor-pointer hover:border-accent-yellow transition-all group">
              <img alt="كوبيه" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXNLZep3ROC_TvWHwtiv2q6fpj7icKPRMXlrUcSmPMpqE3tNXHLKofju06UVkSXkfpre-YeaMToUzfHHVdfA7TiAiyuQu7NpEBT-w9jvQYGan97-G1f_lCtlMBY6IGl6jWr2Qpls2iSzinBGSNWEk_EMMi7oxPYVmYJtrWp7WwK_Kf7r6CxBWUX-oxPjAFUG54rumex8IBpGY4YPO8juTvmUwyxip2ZnkE9tTZzAtm8uQa2Y8To3b0Bec9sxQgOijPKzSfpapQvFCC" />
              <span className="font-label-lg text-label-lg text-text-primary">كوبيه</span>
            </div>
          </div>
        </div>
      </section>

      <section id="all-cars-section" className="py-xl px-margin-desktop bg-surface-container-low">
        <div className="max-w-container-max mx-auto">
          <div className="flex justify-between items-center mb-lg">
            <h2 className="font-headline-md text-headline-md text-text-primary">جميع السيارات المعروضة</h2>
            <div className="flex items-center gap-xs font-label-lg text-label-lg text-text-muted">
              <span className="">ترتيب حسب:</span>
              <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="bg-transparent border-none focus:ring-0 font-bold text-primary">
                <option>الأحدث أولاً</option>
                <option>السعر: من الأقل للأعلى</option>
                <option>السعر: من الأعلى للأقل</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col md:flex-row-reverse gap-lg">
            {/* Sidebar Filters (Right) */}
            <aside className="w-full md:w-1/4 flex flex-col gap-sm">
              <div className="bg-surface-white border border-border-light rounded-xl p-md">
                <h3 className="font-headline-sm text-headline-sm text-text-primary mb-md">الفلاتر</h3>
                <div className="space-y-md">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-sm text-label-sm text-text-muted">حالة السيارة</label>
                    <div className="flex gap-xs">
                      <button onClick={() => setConditionFilter('الكل')} className={`flex-1 py-2 rounded-lg font-label-lg transition-colors ${conditionFilter === 'الكل' ? 'border border-primary bg-primary-container/10 text-primary' : 'border border-border-light text-text-muted hover:border-primary'}`}>الكل</button>
                      <button onClick={() => setConditionFilter('جديد')} className={`flex-1 py-2 rounded-lg font-label-lg transition-colors ${conditionFilter === 'جديد' ? 'border border-primary bg-primary-container/10 text-primary' : 'border border-border-light text-text-muted hover:border-primary'}`}>جديد</button>
                      <button onClick={() => setConditionFilter('مستعمل')} className={`flex-1 py-2 rounded-lg font-label-lg transition-colors ${conditionFilter === 'مستعمل' ? 'border border-primary bg-primary-container/10 text-primary' : 'border border-border-light text-text-muted hover:border-primary'}`}>مستعمل</button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-xs text-right">
                    <label className="font-label-sm text-label-sm text-text-muted">المحافظة</label>
                    <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="border-border-light rounded-lg font-body-md text-body-md w-full focus:ring-accent-yellow">
                      <option>كل المحافظات</option>
                      {dbGovernorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-xs text-right">
                    <label className="font-label-sm text-label-sm text-text-muted">الفئة</label>
                    <select value={bodyTypeFilter} onChange={e => setBodyTypeFilter(e.target.value)} className="border-border-light rounded-lg font-body-md text-body-md w-full focus:ring-accent-yellow">
                      <option>جميع الفئات</option>
                      <option>سيدان</option>
                      <option>دفع رباعي (SUV)</option>
                      <option>بيك أب</option>
                      <option>هاتشباك</option>
                      <option>كوبيه</option>
                      <option>فان</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-xs text-right">
                    <label className="font-label-sm text-label-sm text-text-muted">سنة الصنع</label>
                    <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="border-border-light rounded-lg font-body-md text-body-md w-full focus:ring-accent-yellow">
                      <option>الكل</option>
                      <option>2024</option>
                      <option>2023</option>
                      <option>2022</option>
                      <option>2021</option>
                      <option>2020</option>
                      <option>2019</option>
                      <option>أقدم</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-xs text-right">
                    <label className="font-label-sm text-label-sm text-text-muted">السعر</label>
                    <div className="flex gap-xs">
                      <input value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-1/2 border-border-light rounded-lg font-body-md text-body-md focus:ring-accent-yellow" placeholder="من" type="number" />
                      <input value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-1/2 border-border-light rounded-lg font-body-md text-body-md focus:ring-accent-yellow" placeholder="إلى" type="number" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-xs text-right">
                    <label className="font-label-sm text-label-sm text-text-muted">نوع الوقود</label>
                    <select value={fuelTypeFilter} onChange={e => setFuelTypeFilter(e.target.value)} className="border-border-light rounded-lg font-body-md text-body-md w-full focus:ring-accent-yellow">
                      <option>الكل</option>
                      <option>بنزين</option>
                      <option>ديزل</option>
                      <option>كهرباء</option>
                      <option>هجين (Hybrid)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-xs text-right">
                    <label className="font-label-sm text-label-sm text-text-muted">ناقل الحركة</label>
                    <select value={transmissionFilter} onChange={e => setTransmissionFilter(e.target.value)} className="border-border-light rounded-lg font-body-md text-body-md w-full focus:ring-accent-yellow">
                      <option>الكل</option>
                      <option>أوتوماتيك</option>
                      <option>يدوي (عادي)</option>
                    </select>
                  </div>
                  <button onClick={() => { applyFilters(); document.getElementById('all-cars-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-full bg-primary text-on-primary py-sm rounded-lg font-label-lg mt-md hover:brightness-110 transition-all">تطبيق الفلاتر</button>
                </div>
              </div>
            </aside>
            {/* Main Grid (Left) */}
            <main className="w-full md:w-3/4">
              {filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                  {filteredCars.map((car, idx) => (
                    <CarCard key={idx} car={car} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center bg-surface-white border border-border-light rounded-lg py-xl px-md h-full">
                  <span className="material-symbols-outlined text-[64px] text-text-muted opacity-50 mb-sm">search_off</span>
                  <h3 className="font-headline-md text-headline-md text-text-primary mb-xs">لا توجد سيارات مطابقة</h3>
                  <p className="font-body-md text-body-md text-text-muted text-center max-w-[384px] mb-md">
                    حاول تغيير خيارات الفلترة أو التوسّع في نطاق البحث لرؤية المزيد من النتائج.
                  </p>
                  <button 
                    onClick={() => {
                      setConditionFilter('الكل');
                      setLocationFilter('كل المحافظات');
                      setBodyTypeFilter('جميع الفئات');
                      setYearFilter('الكل');
                      setMinPrice('');
                      setMaxPrice('');
                      setFuelTypeFilter('الكل');
                      setTransmissionFilter('الكل');
                      setHeroBrand('اختر الماركة');
                      setHeroCity('كل المدن');
                      setTimeout(applyFilters, 0); // Apply after state updates
                    }}
                    className="bg-primary-container text-on-primary-container px-lg py-xs rounded-lg font-label-lg hover:bg-inverse-primary transition-all">
                    مسح جميع الفلاتر
                  </button>
                </div>
              )}
              <div className="mt-xl flex justify-center">
                <Link to="/browse" className="px-xl py-sm border border-primary text-primary rounded-lg font-label-lg hover:bg-primary-container/10 transition-all">مشاهدة المزيد من السيارات</Link>
              </div>
            </main>
          </div>
        </div>
      </section>

      <section className="py-xl px-margin-desktop bg-surface-white">
        <div className="max-w-container-max mx-auto">
          <div className="flex justify-between items-center mb-lg">
            <h2 className="font-headline-md text-headline-md text-text-primary">سيارات... على السريع</h2>
            <Link className="text-secondary font-label-lg text-label-lg hover:underline" to="/browse">عرض الكل</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
            {urgentCars.map((car, idx) => (
              <CarCard key={idx} car={car} urgent={car.urgent} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-container py-md">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="bg-secondary-container/10 border border-secondary-container/30 rounded-lg p-sm flex items-center justify-between text-secondary">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
              <p className="font-body-md text-body-md font-medium">سوق آمن وموثوق: جميع السيارات المستعجلة تخضع للفحص المبدئي</p>
            </div>
            <button className="bg-secondary text-on-secondary px-sm py-1 rounded-lg font-label-lg text-label-lg">اعرف المزيد</button>
          </div>
        </div>
      </section>

      {/* Sponsorship Banner */}
      <section className="py-lg px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <div className="w-full h-32 md:h-48 bg-surface-container-highest rounded-xl flex items-center justify-between px-lg overflow-hidden relative border border-border-light shadow-sm">
            <div className="z-10 text-right">
              <h3 className="font-headline-md text-headline-md text-text-primary mb-xs">إعلانك هنا يراه آلاف المهتمين</h3>
              <p className="font-body-md text-body-md text-tertiary">روّج لورشتك أو قطع غيارك بأقل التكاليف.</p>
            </div>
            <div className="hidden md:flex flex-col items-center justify-center bg-accent-yellow px-xl py-md transform rotate-12 -ml-20">
              <span className="font-headline-lg text-headline-lg font-black text-on-primary-container">AD SPACE</span>
            </div>
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      <section className="py-xl px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <div className="flex justify-between items-center mb-lg">
            <h2 className="font-headline-md text-headline-md text-text-primary">أبرز ورشات الصيانة</h2>
            <Link className="text-secondary font-label-lg text-label-lg hover:underline" to="/workshops">استكشف الورشات</Link>
          </div>
          <div className="flex gap-md overflow-x-auto pb-sm no-scrollbar">
            <div className="min-w-[300px] bg-surface-white border border-border-light rounded-lg p-sm flex items-center gap-sm hover:border-verification-blue transition-all">
              <div className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center overflow-hidden flex-shrink-0">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVVQkJJxTeMD1sbzbo4RghEqYS_PRNSnaTUDUaYogrnzkSH--C6yosPeO5lz442Um10NKrlXpH8kGa3YbF3EmBk2-3gqTWhdulXQzi9BnbIf7zrk8jeAujCGzQyB5AptccKpOd9knZ9wy4GR3k63iMlCqYlNinsyRKlRqd8SNr-qPICdxcvtvNpV5kuefNnkn6i35VLqe_Vv36-CVOYoWWi2Zg4alU4T0za1CUa1y4SzWPl58dJ84LsYJwP-A5PiBCdnZM8LTGs9mI" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <h4 className="font-headline-sm text-headline-sm text-text-primary">مركز التميز</h4>
                  <span className="material-symbols-outlined text-verification-blue text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <p className="font-body-sm text-body-sm text-text-muted mb-xs">صيانة المحركات والبرمجة</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-accent-yellow">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-label-sm text-label-sm text-text-primary mr-1">4.8</span>
                  </div>
                  <button className="text-secondary font-label-sm text-label-sm border border-secondary rounded px-2 py-0.5 hover:bg-secondary hover:text-white transition-all">عرض الخدمات</button>
                </div>
              </div>
            </div>
            {/* Workshop 2 */}
            <div className="min-w-[300px] bg-surface-white border border-border-light rounded-lg p-sm flex items-center gap-sm hover:border-verification-blue transition-all">
              <div className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center overflow-hidden flex-shrink-0">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYOhTTNVnEYR1jcyoaLhoMDCBAgwEfoAim2n677F6K-abIKwkqtlVHr2JPfwqYZ8fZIZGzPAdp6KUp5WfJwsrBAVTiIhVzbOQ_mghrNkmUkyn4kqc_qNyZkn-1CBCb_sEbkSEupakG1uI25WrRPboOUE7pT4DMj-Frgysa9WTRlHGwaNidP2kojM4io7WrIkA7k5UYNkkzsiYDx0xqivil9JQjZjOsv7I2FXqAO6Ty4g6xxQHKfTymg5kaIr9xI-VOYC7LANEIM0Hb" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <h4 className="font-headline-sm text-headline-sm text-text-primary">ورشة المحترف</h4>
                  <span className="material-symbols-outlined text-verification-blue text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <p className="font-body-sm text-body-sm text-text-muted mb-xs">كهرباء وتكييف سيارات</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-accent-yellow">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-label-sm text-label-sm text-text-primary mr-1">4.9</span>
                  </div>
                  <button className="text-secondary font-label-sm text-label-sm border border-secondary rounded px-2 py-0.5 hover:bg-secondary hover:text-white transition-all">عرض الخدمات</button>
                </div>
              </div>
            </div>
            {/* Workshop 3 */}
            <div className="min-w-[300px] bg-surface-white border border-border-light rounded-lg p-sm flex items-center gap-sm hover:border-verification-blue transition-all">
              <div className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center overflow-hidden flex-shrink-0">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9dc2AUftFJspg3YT0WlNALirbst_mtIeT67VLNAWjYBz-Jf1_rZTSSzprHHIzJj-cmBWItNS0u6mpMfIdIkWClvPDvdlsSdckKmDqft6jRRKQfLRhnBKq1fTu-CIDsyNizsBfmt4ORqoqpAnsEpekLFZRUJK1R2i-sYVPyuPuXjpUZWShEzWbFFb51zkd3YlXisxF_v1KlRWG7Qh5np7Vu9FdVhpcPSRR4zh-RPvQfluAr1_YCw84_hCCD5HB3uNQXCKOmTa7ib_N" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <h4 className="font-headline-sm text-headline-sm text-text-primary">الأمانة للأصباغ</h4>
                  <span className="material-symbols-outlined text-verification-blue text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <p className="font-body-sm text-body-sm text-text-muted mb-xs">حدادة وصبغ حراري</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-accent-yellow">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-label-sm text-label-sm text-text-primary mr-1">4.5</span>
                  </div>
                  <button className="text-secondary font-label-sm text-label-sm border border-secondary rounded px-2 py-0.5 hover:bg-secondary hover:text-white transition-all">عرض الخدمات</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xl px-margin-desktop bg-surface-container-low">
        <div className="max-w-container-max mx-auto text-center">
          <h2 className="font-headline-md text-headline-md text-text-primary mb-md">باقات اشتراك الورشات والمعارض</h2>
          <p className="font-body-lg text-body-lg text-text-muted mb-xl max-w-2xl mx-auto">انضم إلى أكبر منصة سيارات في المنطقة وعزز مبيعاتك وأعمالك عبر باقاتنا الاحترافية</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg max-w-5xl mx-auto">
            <div className="bg-surface-white border border-border-light rounded-xl p-lg flex flex-col items-center hover:border-text-muted transition-all">
              <h3 className="font-headline-sm text-headline-sm text-text-primary mb-xs">باقة مجانية</h3>
              <div className="text-display-lg font-display-lg text-text-primary mb-md">$0 <span className="text-body-sm font-body-sm text-text-muted">/شهرياً</span></div>
              <ul className="text-right w-full space-y-sm mb-lg">
                <li className="flex items-center gap-xs font-body-md text-body-md"><span className="material-symbols-outlined text-verification-blue">check</span> 3 إعلانات سيارات</li>
                <li className="flex items-center gap-xs font-body-md text-body-md"><span className="material-symbols-outlined text-verification-blue">check</span> ملف ورشة أساسي</li>
                <li className="flex items-center gap-xs font-body-md text-body-md opacity-40"><span className="material-symbols-outlined">close</span> ترويج الإعلانات</li>
              </ul>
              <button className="mt-auto w-full border border-border-light py-xs rounded-lg font-label-lg text-label-lg hover:bg-surface-container transition-all">ابدأ الآن</button>
            </div>
            <div className="bg-surface-white border-2 border-secondary rounded-xl p-lg flex flex-col items-center relative overflow-hidden scale-105 shadow-md">
              <div className="absolute top-4 left-[-35px] bg-secondary text-white py-1 px-10 -rotate-45 font-label-sm text-label-sm">رائجة</div>
              <h3 className="font-headline-sm text-headline-sm text-secondary mb-xs">باقة متوسطة</h3>
              <div className="text-display-lg font-display-lg text-text-primary mb-md">$49 <span className="text-body-sm font-body-sm text-text-muted">/شهرياً</span></div>
              <ul className="text-right w-full space-y-sm mb-lg">
                <li className="flex items-center gap-xs font-body-md text-body-md"><span className="material-symbols-outlined text-verification-blue">check</span> 15 إعلان سيارة</li>
                <li className="flex items-center gap-xs font-body-md text-body-md"><span className="material-symbols-outlined text-verification-blue">check</span> ملف ورشة موثق</li>
                <li className="flex items-center gap-xs font-body-md text-body-md"><span className="material-symbols-outlined text-verification-blue">check</span> 3 إعلانات مميزة</li>
              </ul>
              <button className="mt-auto w-full bg-secondary text-on-secondary py-xs rounded-lg font-label-lg text-label-lg hover:brightness-110 transition-all">اختر الباقة</button>
            </div>
            <div className="bg-surface-white border-2 border-accent-yellow rounded-xl p-lg flex flex-col items-center hover:shadow-lg transition-all">
              <div className="bg-accent-yellow text-text-primary px-3 py-1 rounded-full font-label-sm text-label-sm mb-sm">الأكثر طلباً</div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-xs font-bold">باقة مميزة</h3>
              <div className="text-display-lg font-display-lg text-text-primary mb-md">$99 <span className="text-body-sm font-body-sm text-text-muted">/شهرياً</span></div>
              <ul className="text-right w-full space-y-sm mb-lg">
                <li className="flex items-center gap-xs font-body-md text-body-md font-bold"><span className="material-symbols-outlined text-verification-blue">check</span> إعلانات غير محدودة</li>
                <li className="flex items-center gap-xs font-body-md text-body-md"><span className="material-symbols-outlined text-verification-blue">check</span> إدارة كاملة للمخزون</li>
                <li className="flex items-center gap-xs font-body-md text-body-md"><span className="material-symbols-outlined text-verification-blue">check</span> ترويج VIP دائم</li>
              </ul>
              <button className="mt-auto w-full bg-accent-yellow text-text-primary py-xs rounded-lg font-label-lg text-label-lg hover:brightness-95 transition-all">تواصل للمزيد</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
