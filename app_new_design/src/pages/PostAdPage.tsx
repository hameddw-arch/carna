import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { insertListing, uploadListingImages, fetchGovernorates } from '../lib/queries/index';
import ImageUploader from '../components/ImageUploader';
import SEO from '../components/SEO';

export default function PostAdPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageKeys, setImageKeys] = useState<string[]>([]);
  const [dbGovernorates, setDbGovernorates] = useState<string[]>([]);

  useEffect(() => {
    fetchGovernorates().then(data => {
      setDbGovernorates(data.filter(g => g.is_active).map(g => g.name));
    }).catch(console.error);
  }, []);

  const handleImageUpload = (url: string, key?: string) => {
    setImageUrls(prev => [...prev, url]);
    if (key) setImageKeys(prev => [...prev, key]);
  };

  const handleImageDelete = (url: string) => {
    setImageUrls(prev => prev.filter(u => u !== url));
    setImageKeys(prev => prev.filter((_, i) => imageUrls[i] !== url));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setError('يجب تسجيل الدخول لنشر إعلان');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const city = formData.get('city') as string;
    const subCity = formData.get('sub_city') as string;
    const fullCity = subCity ? `${city} - ${subCity}` : city;

    const listingData = {
      user_id: user.id,
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
      status: 'active',
      title: `${formData.get('make')} ${formData.get('model')} ${formData.get('year')}`
    };

    try {
      const newListing = await insertListing(listingData);

      if (imageUrls.length > 0 && newListing?.id) {
        await uploadListingImages(newListing.id, imageUrls, imageKeys);
      }

      setShowSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء نشر الإعلان');
    } finally {
      setIsSubmitting(false);
    }
  };

  const years = Array.from({ length: 2025 - 1980 + 1 }, (_, i) => 2025 - i);

  if (showSuccess) {
    return (
      <div className="bg-background min-h-screen">
        <main className="mt-24 mb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-lg">
          <div className="bg-verification-blue/10 border border-verification-blue rounded-xl p-xl flex flex-col items-center justify-center text-center py-20">
            <span className="material-symbols-outlined text-[64px] text-verification-blue mb-md">check_circle</span>
            <h2 className="font-headline-md text-headline-md text-primary mb-sm font-bold">تم نشر إعلانك بنجاح!</h2>
            <p className="font-body-md text-body-md text-tertiary">جاري توجيهك إلى لوحة التحكم...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-on-surface">
      <SEO
        title="أضف إعلان سيارة"
        description="أضف إعلان سيارتك على كارنا وابدأ البيع في دقائق. إعلانات سيارات مجانية لكل سوريا."
        url="/post-ad"
      />
      <main className="py-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-lg">
        {/* Page Header */}
        <section className="flex flex-col gap-base">
          <h1 className="font-headline-lg text-headline-lg md:text-headline-lg text-primary">إضافة إعلان جديد</h1>
          <p className="font-body-md text-body-md text-tertiary">قم بتعبئة تفاصيل سيارتك بدقة للوصول إلى أكبر عدد من المشترين المهتمين.</p>
          {error && <div className="bg-error/10 text-error p-sm rounded-lg font-bold">{error}</div>}
        </section>
        
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
                  <select name="make" required className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all">
                    <option value="">اختر الماركة</option>
                    <option>تويوتا</option>
                    <option>مرسيدس</option>
                    <option>هيونداي</option>
                  </select>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-lg text-label-lg text-on-surface-variant">الموديل</label>
                  <select name="model" required className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all">
                    <option value="">اختر الموديل</option>
                    <option>كامري</option>
                    <option>GLE</option>
                    <option>إلنترا</option>
                  </select>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-lg text-label-lg text-on-surface-variant">سنة الصنع</label>
                  <select name="year" required className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all">
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
                  <input name="price" required className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all" placeholder="مثال: 15,000,000" type="number" dir="ltr" />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-lg text-label-lg text-on-surface-variant">المسافة المقطوعة (كم)</label>
                  <input name="km" required className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all" placeholder="مثال: 50,000" type="number" dir="ltr" />
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
                    <label className="flex-1 flex items-center justify-center gap-xs border border-border-light p-sm rounded-lg cursor-pointer hover:bg-surface-container transition-all has-[:checked]:bg-surface-container has-[:checked]:border-accent-yellow text-text-muted has-[:checked]:text-primary">
                      <input required defaultChecked className="hidden" name="fuel" type="radio" value="بنزين" />
                      <span className="font-body-md text-body-md">بنزين</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-xs border border-border-light p-sm rounded-lg cursor-pointer hover:bg-surface-container transition-all has-[:checked]:bg-surface-container has-[:checked]:border-accent-yellow text-text-muted has-[:checked]:text-primary">
                      <input required className="hidden" name="fuel" type="radio" value="ديزل" />
                      <span className="font-body-md text-body-md">ديزل</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-xs border border-border-light p-sm rounded-lg cursor-pointer hover:bg-surface-container transition-all has-[:checked]:bg-surface-container has-[:checked]:border-accent-yellow text-text-muted has-[:checked]:text-primary">
                      <input required className="hidden" name="fuel" type="radio" value="هجين" />
                      <span className="font-body-md text-body-md">هجين</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-xs border border-border-light p-sm rounded-lg cursor-pointer hover:bg-surface-container transition-all has-[:checked]:bg-surface-container has-[:checked]:border-accent-yellow text-text-muted has-[:checked]:text-primary">
                      <input required className="hidden" name="fuel" type="radio" value="كهرباء" />
                      <span className="font-body-md text-body-md">كهرباء</span>
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-lg text-label-lg text-on-surface-variant">ناقل الحركة</label>
                  <div className="flex gap-sm">
                    <label className="flex-1 flex items-center justify-center gap-xs border border-border-light p-sm rounded-lg cursor-pointer hover:bg-surface-container transition-all has-[:checked]:bg-surface-container has-[:checked]:border-accent-yellow text-text-muted has-[:checked]:text-primary">
                      <input required defaultChecked className="hidden" name="transmission" type="radio" value="أوتوماتيك" />
                      <span className="font-body-md text-body-md">أوتوماتيك</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-xs border border-border-light p-sm rounded-lg cursor-pointer hover:bg-surface-container transition-all has-[:checked]:bg-surface-container has-[:checked]:border-accent-yellow text-text-muted has-[:checked]:text-primary">
                      <input required className="hidden" name="transmission" type="radio" value="عادي" />
                      <span className="font-body-md text-body-md">عادي</span>
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-xs md:col-span-2">
                  <label className="font-label-lg text-label-lg text-on-surface-variant">لون السيارة</label>
                  <select name="color" required className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all">
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
                  <textarea name="description" rows={4} className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all" placeholder="اكتب تفاصيل إضافية عن حالة السيارة، المواصفات، وأي إضافات..."></textarea>
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
                  <select name="city" required className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all">
                    <option value="">اختر المحافظة</option>
                    {dbGovernorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-lg text-label-lg text-on-surface-variant">المدينة / المنطقة (اختياري)</label>
                  <input name="sub_city" className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all" placeholder="مثال: جبلة، النبك، الخ..." type="text" />
                </div>
              </div>
            </div>

            {/* New Section: Contact Information */}
            <div className="bg-surface-white border border-border-light rounded-xl p-lg flex flex-col gap-md">
              <div className="flex items-center gap-xs text-primary">
                <span className="material-symbols-outlined">call</span>
                <h2 className="font-headline-sm text-headline-sm">معلومات التواصل</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-lg text-label-lg text-on-surface-variant">رقم الهاتف</label>
                  <input name="phone" required className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all" placeholder="مثال: 09xx xxx xxx" type="tel" dir="ltr" />
                  <label className="flex items-center gap-xs mt-xs cursor-pointer select-none">
                    <input name="whatsapp" className="w-4 h-4 rounded border-border-light text-accent-yellow focus:ring-accent-yellow" type="checkbox" />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">متوفر على واتساب</span>
                  </label>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-lg text-label-lg text-on-surface-variant">وسيلة تواصل بديلة (اختياري)</label>
                  <input name="contact_alt" className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all" placeholder="تيليجرام، بريد إلكتروني، إلخ" type="text" />
                </div>
              </div>
            </div>

            {/* Section 4: Photo Upload */}
            <ImageUploader
              onImageUpload={handleImageUpload}
              onImageDelete={handleImageDelete}
              maxImages={5}
            />
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
                    <input defaultChecked className="w-5 h-5 text-accent-yellow focus:ring-accent-yellow" name="seller_type" type="radio" value="individual" />
                    <div className="mr-sm flex flex-col">
                      <span className="font-body-md text-body-md font-bold text-on-surface">مالك شخصي</span>
                      <span className="font-body-sm text-body-sm text-tertiary">أقوم ببيع سيارتي الخاصة</span>
                    </div>
                  </label>
                  <label className="flex items-center p-sm border border-border-light rounded-lg cursor-pointer hover:bg-surface-container transition-all group has-[:checked]:bg-surface-container has-[:checked]:border-accent-yellow">
                    <input className="w-5 h-5 text-accent-yellow focus:ring-accent-yellow" name="seller_type" type="radio" value="dealer" />
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
                      جاري النشر...
                    </>
                  ) : (
                    'نشر الإعلان'
                  )}
                </button>
                <button type="button" onClick={() => navigate(-1)} className="w-full bg-surface border border-border-light text-tertiary font-body-md text-body-md py-sm rounded-lg hover:bg-surface-container transition-all">
                  إلغاء / حفظ كمسودة
                </button>
              </div>
              
              <div className="bg-primary-fixed p-sm rounded-lg flex gap-sm items-start mt-sm">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                <p className="font-label-sm text-label-sm text-on-primary-fixed-variant">بمجرد النقر على "نشر"، فإنك توافق على شروط وأحكام CARNA وسياسة الخصوصية.</p>
              </div>
            </div>

            {/* Visual Tip Card */}
            <div className="relative overflow-hidden bg-on-background rounded-xl aspect-[4/3] p-lg flex flex-col justify-end text-surface-white">
              <img alt="Car Photography" className="absolute inset-0 w-full h-full object-cover opacity-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5fVlfPXk6j5YJDQLWM5i5oDQS3Nr86HJQiVdpr8uwlRw_bOooZLjHEaTWWov1FXiPZYAcHG3DQcrsRSFmS9vXok_ps0ZxuFlWgRUN7gge5Int4wmze7CHQI6bG86rMxeGkmJUKxqlilq_en2D7xhDUtXOo0NzJwrpSwtliRgPSVGLgV3x1X1Wp3F2fTElNZPlpEMhHDkTzOV44D3As7XGFsIIy4T2Z7TFBREMgwG3_UX0Wms13clbEdy1rozMPym6dhlwpEYriSnS" />
              <div className="relative z-10">
                <h3 className="font-headline-sm text-headline-sm mb-xs">نصيحة CARNA</h3>
                <p className="font-body-sm text-body-sm opacity-90">الصور الواضحة في ضوء النهار تزيد من فرص بيع سيارتك بنسبة 60%. تأكد من تصوير السيارة من زوايا متعددة.</p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
