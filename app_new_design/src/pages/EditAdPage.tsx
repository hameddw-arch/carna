import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchListing, updateListing } from '../lib/queries';

export default function EditAdPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchListing(id)
      .then(data => {
        // Prevent editing if the current user doesn't own the listing
        if (user && data.user_id !== user.id) {
          setError('ليس لديك صلاحية لتعديل هذا الإعلان');
        } else {
          setListing(data);
        }
      })
      .catch(err => {
        console.error(err);
        setError('تعذر تحميل بيانات الإعلان');
      })
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !id) {
      setError('يجب تسجيل الدخول لتعديل إعلان');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const city = formData.get('city') as string;
    const subCity = formData.get('sub_city') as string;
    const fullCity = subCity ? `${city} - ${subCity}` : city;

    const listingData = {
      make: formData.get('make'),
      model: formData.get('model'),
      year: parseInt(formData.get('year') as string, 10),
      price: parseInt(formData.get('price') as string, 10),
      km: parseInt(formData.get('km') as string, 10),
      fuel: formData.get('fuel'),
      transmission: formData.get('transmission'),
      color: formData.get('color'),
      city: fullCity,
      seller_type: formData.get('seller_type'),
      description: formData.get('description'),
      title: `${formData.get('make')} ${formData.get('model')} ${formData.get('year')}`
    };

    try {
      await updateListing(id, listingData);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تعديل الإعلان');
    } finally {
      setIsSubmitting(false);
    }
  };

  const years = Array.from({ length: 2025 - 1980 + 1 }, (_, i) => 2025 - i);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  if (showSuccess) {
    return (
      <div className="bg-background min-h-screen">
        <main className="mt-24 mb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-lg">
          <div className="bg-verification-blue/10 border border-verification-blue rounded-xl p-xl flex flex-col items-center justify-center text-center py-20">
            <span className="material-symbols-outlined text-[64px] text-verification-blue mb-md">check_circle</span>
            <h2 className="font-headline-md text-headline-md text-primary mb-sm font-bold">تم تعديل إعلانك بنجاح!</h2>
            <p className="font-body-md text-body-md text-tertiary">جاري توجيهك إلى لوحة التحكم...</p>
          </div>
        </main>
      </div>
    );
  }

  const [mainCity, ...subCityParts] = (listing?.city || '').split(' - ');
  const subCity = subCityParts.join(' - ');

  return (
    <div className="bg-background min-h-screen text-on-surface">
      <main className="py-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-lg">
        {/* Page Header */}
        <section className="flex flex-col gap-base">
          <h1 className="font-headline-lg text-headline-lg md:text-headline-lg text-primary">تعديل الإعلان</h1>
          <p className="font-body-md text-body-md text-tertiary">قم بتحديث تفاصيل سيارتك بدقة.</p>
          {error && <div className="bg-error/10 text-error p-sm rounded-lg font-bold">{error}</div>}
        </section>
        
        {listing && !error && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
            {/* Form Body (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-lg">
              
              {/* Section 1: Basic Information */}
              <div className="bg-surface-white border border-border-light rounded-xl p-lg flex flex-col gap-md">
                <div className="flex items-center gap-xs text-primary">
                  <span className="material-symbols-outlined">info</span>
                  <h2 className="font-headline-sm text-headline-sm">المعلومات الأساسية</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-lg text-label-lg text-on-surface-variant">الماركة</label>
                    <select name="make" defaultValue={listing.make} required className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all">
                      <option value="">اختر الماركة</option>
                      <option>تويوتا</option>
                      <option>مرسيدس</option>
                      <option>هيونداي</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-lg text-label-lg text-on-surface-variant">الموديل</label>
                    <select name="model" defaultValue={listing.model} required className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all">
                      <option value="">اختر الموديل</option>
                      <option>كامري</option>
                      <option>GLE</option>
                      <option>إلنترا</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-lg text-label-lg text-on-surface-variant">سنة الصنع</label>
                    <select name="year" defaultValue={listing.year} required className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all">
                      <option value="">اختر السنة</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-lg text-label-lg text-on-surface-variant">السعر (ل.س)</label>
                    <input name="price" defaultValue={listing.price} required className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all" placeholder="مثال: 15,000,000" type="number" dir="ltr" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-lg text-label-lg text-on-surface-variant">المسافة المقطوعة (كم)</label>
                    <input name="km" defaultValue={listing.km} required className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all" placeholder="مثال: 50,000" type="number" dir="ltr" />
                  </div>
                </div>
              </div>

              {/* Section 2: Car Details */}
              <div className="bg-surface-white border border-border-light rounded-xl p-lg flex flex-col gap-md">
                <div className="flex items-center gap-xs text-primary">
                  <span className="material-symbols-outlined">settings_suggest</span>
                  <h2 className="font-headline-sm text-headline-sm">تفاصيل السيارة</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-lg text-label-lg text-on-surface-variant">نوع الوقود</label>
                    <div className="flex flex-wrap gap-sm">
                      {['بنزين', 'ديزل', 'هجين', 'كهرباء'].map(fuelType => (
                        <label key={fuelType} className="flex-1 flex items-center justify-center gap-xs border border-border-light p-sm rounded-lg cursor-pointer hover:bg-surface-container transition-all has-[:checked]:bg-surface-container has-[:checked]:border-accent-yellow text-text-muted has-[:checked]:text-primary">
                          <input required defaultChecked={listing.fuel === fuelType} className="hidden" name="fuel" type="radio" value={fuelType} />
                          <span className="font-body-md text-body-md">{fuelType}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-lg text-label-lg text-on-surface-variant">ناقل الحركة</label>
                    <div className="flex gap-sm">
                      {['أوتوماتيك', 'عادي'].map(transmission => (
                        <label key={transmission} className="flex-1 flex items-center justify-center gap-xs border border-border-light p-sm rounded-lg cursor-pointer hover:bg-surface-container transition-all has-[:checked]:bg-surface-container has-[:checked]:border-accent-yellow text-text-muted has-[:checked]:text-primary">
                          <input required defaultChecked={listing.transmission === transmission} className="hidden" name="transmission" type="radio" value={transmission} />
                          <span className="font-body-md text-body-md">{transmission}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-xs md:col-span-2">
                    <label className="font-label-lg text-label-lg text-on-surface-variant">لون السيارة</label>
                    <select name="color" defaultValue={listing.color} required className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all">
                      <option value="">اختر اللون</option>
                      <option value="أبيض">أبيض</option>
                      <option value="أسود">أسود</option>
                      <option value="فضي">فضي</option>
                      <option value="رمادي">رمادي</option>
                      <option value="أحمر">أحمر</option>
                      <option value="أزرق">أزرق</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-xs md:col-span-2">
                    <label className="font-label-lg text-label-lg text-on-surface-variant">وصف السيارة</label>
                    <textarea name="description" defaultValue={listing.description} rows={4} className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all" placeholder="اكتب تفاصيل إضافية عن حالة السيارة، المواصفات، وأي إضافات..."></textarea>
                  </div>
                </div>
              </div>

              {/* Section 3: Location */}
              <div className="bg-surface-white border border-border-light rounded-xl p-lg flex flex-col gap-md">
                <div className="flex items-center gap-xs text-primary">
                  <span className="material-symbols-outlined">location_on</span>
                  <h2 className="font-headline-sm text-headline-sm">الموقع</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-lg text-label-lg text-on-surface-variant">المحافظة</label>
                    <select name="city" defaultValue={mainCity} required className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all">
                      <option value="">اختر المحافظة</option>
                      <option>دمشق</option>
                      <option>ريف دمشق</option>
                      <option>حلب</option>
                      <option>حمص</option>
                      <option>حماة</option>
                      <option>اللاذقية</option>
                      <option>طرطوس</option>
                      <option>السويداء</option>
                      <option>درعا</option>
                      <option>القنيطرة</option>
                      <option>دير الزور</option>
                      <option>الحسكة</option>
                      <option>الرقة</option>
                      <option>إدلب</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-lg text-label-lg text-on-surface-variant">المدينة / المنطقة (اختياري)</label>
                    <input name="sub_city" defaultValue={subCity} className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all" placeholder="مثال: جبلة، النبك، الخ..." type="text" />
                  </div>
                </div>
              </div>

            </div>

            {/* Sidebar (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-lg">
              {/* Seller Information */}
              <div className="bg-surface-white border border-border-light rounded-xl p-lg flex flex-col gap-md sticky top-24">
                <div className="flex items-center gap-xs text-primary">
                  <span className="material-symbols-outlined">badge</span>
                  <h2 className="font-headline-sm text-headline-sm">معلومات المعلن</h2>
                </div>
                <div className="flex flex-col gap-md">
                  <div className="flex flex-col gap-sm">
                    <label className="flex items-center p-sm border border-border-light rounded-lg cursor-pointer hover:bg-surface-container transition-all group has-[:checked]:bg-surface-container has-[:checked]:border-accent-yellow">
                      <input defaultChecked={listing.seller_type === 'individual' || !listing.seller_type} className="w-5 h-5 text-accent-yellow focus:ring-accent-yellow" name="seller_type" type="radio" value="individual" />
                      <div className="mr-sm flex flex-col">
                        <span className="font-body-md text-body-md font-bold text-on-surface">مالك شخصي</span>
                        <span className="font-body-sm text-body-sm text-tertiary">أقوم ببيع سيارتي الخاصة</span>
                      </div>
                    </label>
                    <label className="flex items-center p-sm border border-border-light rounded-lg cursor-pointer hover:bg-surface-container transition-all group has-[:checked]:bg-surface-container has-[:checked]:border-accent-yellow">
                      <input defaultChecked={listing.seller_type === 'dealer'} className="w-5 h-5 text-accent-yellow focus:ring-accent-yellow" name="seller_type" type="radio" value="dealer" />
                      <div className="mr-sm flex flex-col">
                        <span className="font-body-md text-body-md font-bold text-on-surface">وكيل / معرض</span>
                        <span className="font-body-sm text-body-sm text-tertiary">أقوم بالبيع بصفتي تجارية</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="pt-md border-t border-border-light mt-xs flex flex-col gap-sm">
                  <button disabled={isSubmitting} className="w-full bg-accent-yellow text-black font-headline-sm text-headline-sm py-sm rounded-lg shadow-sm hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70" type="submit">
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                        جاري الحفظ...
                      </>
                    ) : (
                      'حفظ التعديلات'
                    )}
                  </button>
                  <button type="button" onClick={() => navigate(-1)} className="w-full bg-surface border border-border-light text-tertiary font-body-md text-body-md py-sm rounded-lg hover:bg-surface-container transition-all">
                    إلغاء التعديلات
                  </button>
                </div>
              </div>

            </div>
          </form>
        )}
      </main>
    </div>
  );
}
