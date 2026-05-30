import { useState, useEffect } from 'react';
import CarCard, { type Car } from '../components/CarCard';
import { fetchListings, fetchAvailableTags } from '../lib/queries';
import SEO from '../components/SEO';

export default function BrowseCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [filters, setFilters] = useState<any>({
    condition: '',
    city: '',
    body_type: '',
    year: '',
    min_price: '',
    max_price: '',
    tag: ''
  });

  useEffect(() => {
    fetchAvailableTags().then(tags => setAvailableTags(tags)).catch(console.error);
  }, []);

  const loadCars = (currentFilters: any) => {
    // Convert currentFilters to the format fetchListings expects
    const dbFilters: any = {};
    if (currentFilters.condition) dbFilters.condition = currentFilters.condition;
    if (currentFilters.city && currentFilters.city !== 'كل المحافظات') dbFilters.city = currentFilters.city;
    if (currentFilters.body_type && currentFilters.body_type !== 'جميع الفئات') dbFilters.body_type = currentFilters.body_type;
    if (currentFilters.year && currentFilters.year !== 'الكل') dbFilters.year = parseInt(currentFilters.year);
    if (currentFilters.min_price) dbFilters.priceMin = parseInt(currentFilters.min_price);
    if (currentFilters.max_price) dbFilters.priceMax = parseInt(currentFilters.max_price);
    if (currentFilters.tag) dbFilters.tag = currentFilters.tag;

    fetchListings(dbFilters).then(data => {
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
      setCars(mapped);
    }).catch(console.error);
  };

  useEffect(() => {
    loadCars(filters);
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    loadCars(filters);
  };

  return (
    <>
      <SEO
        title="تصفح وابحث عن السيارات - كارنا"
        description="تصفح آلاف السيارات المستعملة والجديدة في سوريا. البحث المتقدم حسب الماركة، الموديل، السعر، الحالة، والموقع. شاهد صور كاملة وتفاصيل كل سيارة."
        image="/carna-logo.svg"
        url="/browse"
        type="website"
      />
      <section className="py-xl px-margin-desktop bg-surface-white border-b border-border-light">
        <div className="max-w-container-max mx-auto">
          <h2 className="font-headline-md text-headline-md text-text-primary mb-lg text-right">تصفح حسب نوع الهيكل</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-md">
            {/* Sedan */}
            <div className="bg-surface-white border border-border-light rounded-xl p-md flex flex-col items-center justify-center gap-sm cursor-pointer hover:border-accent-yellow transition-all group">
              <img alt="سيدان" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRe7Pmv-uausgCO9nVynpcVDrV1nvpTH9hX9k_Zlxkm3etuHtRPblF3Ne-3MpVf-rRsbGSj-uk8jdArl1JFPsEV_SdqL2nzQdf7DbXz68Xh7-x-GQ2jE9C1TdlU84D-iNF3RNeKFNT1aUsfCPcro4QByXeTaXiuakagbby-NoU1oeF1kUqQStZWoUKJCY0MgJ464tAVRK7G8098f9E7HbWOCnwRyH5vxPCJT0QfHBKgxvdiDAB6ZOBjaLzaZZWLK4-7LPy9OYPNMvE" />
              <span className="font-label-lg text-label-lg text-text-primary">سيدان</span>
            </div>
            {/* SUV */}
            <div className="bg-surface-white border border-border-light rounded-xl p-md flex flex-col items-center justify-center gap-sm cursor-pointer hover:border-accent-yellow transition-all group">
              <img alt="دفع رباعى" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDzLB_DdIsV0yI_jPKOOtDdHqr_4j6Qa0wgDZub-ZlXgruuS671MMfQBw2d6XLriTwavvJ2cpnJaO7JT6_N13vNq8Zk4kXdmo_WAQ-cQAmAHf4dBoKptevCpsUGiTOVVYZJEYTdfV2we_7AGGhrOVWQT3O4avebPt0UTenQL7J9_6aPUeOPh8PG5DLQtjN_EtPgcf2CX-fc9seJrkhAzVFdpv6doNulUF3EHHb5vgtdmhXo07eNUrYmFgglmJP7FCAIYfLSzbNFim1" />
              <span className="font-label-lg text-label-lg text-text-primary">دفع رباعى (SUV)</span>
            </div>
            {/* Pickup */}
            <div className="bg-surface-white border border-border-light rounded-xl p-md flex flex-col items-center justify-center gap-sm cursor-pointer hover:border-accent-yellow transition-all group">
              <img alt="بيكاب" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGXnaoi4LIdN540d-TrpwWf66L88-rmqZJSeAnuiTI3CekFwH5NFxk0s75eidTygb-yDhxS6gB9O_xsj4OKu8FI7-JJTY1kKc3llDaSP3Lb8AP40nIEZ0mr_iz0Y1DBejXUj8IxA2VVf5xQRSzlXgYPVE42hU1simn8QJjwtEyD0-9URZiL3tMlod6fLnqV7vZpfyCaZY3zK6Jkv3e7krHWchbPsQ2os8EdQOL68hlUywhTbjg-yPRaOeVXQnXinjNyMga954JS_w1" />
              <span className="font-label-lg text-label-lg text-text-primary">بيكاب</span>
            </div>
            {/* Van */}
            <div className="bg-surface-white border border-border-light rounded-xl p-md flex flex-col items-center justify-center gap-sm cursor-pointer hover:border-accent-yellow transition-all group">
              <img alt="فان" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPEsE-Jv_FTcfRGnLoipy2y16ya_75NJIMHMR7KuXCXRpOFjvKVFp3jg2OfrsUFG1hiGOkQTPekyjID7DEQK0Ni1nZle-LW4ZAv0ixhV-mrB6UyVar5RBstj9RNeMDCT3ke12X-RBaqKIC3HtAIzU8V_bBPTw6JZ4Fv_2eLNRmddQHeVD9fMmyI5Al_PjQqonXS8UmJuXLM7UAeeo1l3Ujao2r-TJcQ8-oMnE-rUjQTDEi3qKtReEV61lYvEEvXlI8vUa9ekpe6D1C" />
              <span className="font-label-lg text-label-lg text-text-primary">فان</span>
            </div>
            {/* Hatchback */}
            <div className="bg-surface-white border border-border-light rounded-xl p-md flex flex-col items-center justify-center gap-sm cursor-pointer hover:border-accent-yellow transition-all group">
              <img alt="هاتشباك" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADf9kt3gs-aOWpfXuu2cu58dcr4RRVanPtUv0MW6BODK2oMdODxRUzCwbmEb2g5yVuuEpsKz3_9fMNF03NQwsfDzK2pNIYrR1yadmfWP3TU-Dlsf2G-WRmwnysGutoUH0TtLy31n8XwQZyRvX8tpKc_-QQlC2EgprtfiYzyKKZiFDWwGfBg9JrTkd5zNPUXgmaZDSnw6ZIYwxnpooOC72X5zR4eQTO7Z00AAw34sVUhHsZFaruGfK-cTkKLloLaAa5qBaaRO9EVJ3V" />
              <span className="font-label-lg text-label-lg text-text-primary">هاتشباك</span>
            </div>
            {/* Coupe */}
            <div className="bg-surface-white border border-border-light rounded-xl p-md flex flex-col items-center justify-center gap-sm cursor-pointer hover:border-accent-yellow transition-all group">
              <img alt="كوبيه" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXNLZep3ROC_TvWHwtiv2q6fpj7icKPRMXlrUcSmPMpqE3tNXHLKofju06UVkSXkfpre-YeaMToUzfHHVdfA7TiAiyuQu7NpEBT-w9jvQYGan97-G1f_lCtlMBY6IGl6jWr2Qpls2iSzinBGSNWEk_EMMi7oxPYVmYJtrWp7WwK_Kf7r6CxBWUX-oxPjAFUG54rumex8IBpGY4YPO8juTvmUwyxip2ZnkE9tTZzAtm8uQa2Y8To3b0Bec9sxQgOijPKzSfpapQvFCC" />
              <span className="font-label-lg text-label-lg text-text-primary">كوبيه</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-xl px-margin-desktop bg-surface-container-low">
        <div className="max-w-container-max mx-auto">
          <div className="flex justify-between items-center mb-lg">
            <h2 className="font-headline-md text-headline-md text-text-primary">جميع السيارات المعروضة</h2>
            <div className="flex items-center gap-xs font-label-lg text-label-lg text-text-muted">
              <span className="">ترتيب حسب:</span>
              <select className="bg-transparent border-none focus:ring-0 font-bold text-primary">
                <option>الأحدث أولاً</option>
                <option>السعر: من الأقل للأعلى</option>
                <option>السعر: من الأعلى للأقل</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col md:flex-row-reverse gap-lg">
            <aside className="w-full md:w-1/4 flex flex-col gap-sm">
              <div className="bg-surface-white border border-border-light rounded-xl p-md">
                <h3 className="font-headline-sm text-headline-sm text-text-primary mb-md">الفلاتر</h3>
                <div className="space-y-md">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-sm text-label-sm text-text-muted">حالة السيارة</label>
                    <div className="flex gap-xs">
                      <button onClick={() => handleFilterChange('condition', '')} className={`flex-1 py-2 border ${!filters.condition ? 'border-primary bg-primary-container/10 text-primary' : 'border-border-light text-text-muted hover:border-primary'} rounded-lg font-label-lg transition-colors`}>الكل</button>
                      <button onClick={() => handleFilterChange('condition', 'جديد')} className={`flex-1 py-2 border ${filters.condition === 'جديد' ? 'border-primary bg-primary-container/10 text-primary' : 'border-border-light text-text-muted hover:border-primary'} rounded-lg font-label-lg transition-colors`}>جديد</button>
                      <button onClick={() => handleFilterChange('condition', 'مستعمل')} className={`flex-1 py-2 border ${filters.condition === 'مستعمل' ? 'border-primary bg-primary-container/10 text-primary' : 'border-border-light text-text-muted hover:border-primary'} rounded-lg font-label-lg transition-colors`}>مستعمل</button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-xs text-right">
                    <label className="font-label-sm text-label-sm text-text-muted">المحافظة</label>
                    <select value={filters.city} onChange={(e) => handleFilterChange('city', e.target.value)} className="border-border-light rounded-lg font-body-md text-body-md w-full focus:ring-accent-yellow">
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
                  <div className="flex flex-col gap-xs text-right">
                    <label className="font-label-sm text-label-sm text-text-muted">الفئة</label>
                    <select value={filters.body_type} onChange={(e) => handleFilterChange('body_type', e.target.value)} className="border-border-light rounded-lg font-body-md text-body-md w-full focus:ring-accent-yellow">
                      <option>جميع الفئات</option>
                      <option>سيدان</option>
                      <option>دفع رباعي (SUV)</option>
                      <option>بيك أب</option>
                      <option>هاتشباك</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-xs text-right">
                    <label className="font-label-sm text-label-sm text-text-muted">سنة الصنع</label>
                    <select value={filters.year} onChange={(e) => handleFilterChange('year', e.target.value)} className="border-border-light rounded-lg font-body-md text-body-md w-full focus:ring-accent-yellow">
                      <option>الكل</option>
                      <option>2024</option>
                      <option>2023</option>
                      <option>2022</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-xs text-right">
                    <label className="font-label-sm text-label-sm text-text-muted">السعر</label>
                    <div className="flex gap-xs">
                      <input value={filters.min_price} onChange={(e) => handleFilterChange('min_price', e.target.value)} className="w-1/2 border-border-light rounded-lg font-body-md text-body-md focus:ring-accent-yellow" placeholder="من" type="number" />
                      <input value={filters.max_price} onChange={(e) => handleFilterChange('max_price', e.target.value)} className="w-1/2 border-border-light rounded-lg font-body-md text-body-md focus:ring-accent-yellow" placeholder="إلى" type="number" />
                    </div>
                  </div>
                  {availableTags.length > 0 && (
                    <div className="flex flex-col gap-xs text-right">
                      <label className="font-label-sm text-label-sm text-text-muted">الوسوم</label>
                      <div className="flex flex-wrap gap-xs">
                        <button
                          onClick={() => handleFilterChange('tag', '')}
                          className={`px-md py-xs border rounded-full font-label-sm transition-colors ${
                            !filters.tag ? 'border-primary bg-primary-container/10 text-primary' : 'border-border-light text-text-muted hover:border-primary'
                          }`}
                        >
                          الكل
                        </button>
                        {availableTags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleFilterChange('tag', tag)}
                            className={`px-md py-xs border rounded-full font-label-sm transition-colors ${
                              filters.tag === tag ? 'border-primary bg-primary-container/10 text-primary' : 'border-border-light text-text-muted hover:border-primary'
                            }`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <button onClick={applyFilters} className="w-full bg-primary text-on-primary py-sm rounded-lg font-label-lg mt-md hover:brightness-110 transition-all">تطبيق الفلاتر</button>
                </div>
              </div>
            </aside>
            <main className="w-full md:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                {cars.map((car, idx) => (
                  <CarCard key={idx} car={car} urgent={car.urgent} />
                ))}
              </div>
              <div className="mt-xl flex justify-center">
                <button className="px-xl py-sm border border-primary text-primary rounded-lg font-label-lg hover:bg-primary-container/10 transition-all">مشاهدة المزيد من السيارات</button>
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
