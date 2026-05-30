import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { insertService } from '../lib/queries';

export default function WorkshopRegistrationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTier = searchParams.get('tier') || 'عادي';
  const { user } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setError('يجب تسجيل الدخول لتسجيل ورشة');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const serviceData = {
      owner_id: user.id,
      name: formData.get('name'),
      description: formData.get('description'),
      city: formData.get('city'),
      location_text: formData.get('location_text'),
      phone: formData.get('phone'),
      working_hours: formData.get('working_hours'),
      subscription_tier: formData.get('tier'),
      status: 'pending', // Pending admin approval
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5fVlfPXk6j5YJDQLWM5i5oDQS3Nr86HJQiVdpr8uwlRw_bOooZLjHEaTWWov1FXiPZYAcHG3DQcrsRSFmS9vXok_ps0ZxuFlWgRUN7gge5Int4wmze7CHQI6bG86rMxeGkmJUKxqlilq_en2D7xhDUtXOo0NzJwrpSwtliRgPSVGLgV3x1X1Wp3F2fTElNZPlpEMhHDkTzOV44D3As7XGFsIIy4T2Z7TFBREMgwG3_UX0Wms13clbEdy1rozMPym6dhlwpEYriSnS',
      rating: 0,
      inspections_count: 0
    };

    try {
      await insertService(serviceData);
      setShowSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إرسال الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-background min-h-screen">
        <main className="mt-24 mb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-lg">
          <div className="bg-verification-blue/10 border border-verification-blue rounded-xl p-xl flex flex-col items-center justify-center text-center py-20">
            <span className="material-symbols-outlined text-[64px] text-verification-blue mb-md">check_circle</span>
            <h2 className="font-headline-md text-headline-md text-primary mb-sm font-bold">تم إرسال طلب تسجيل الورشة بنجاح!</h2>
            <p className="font-body-md text-body-md text-tertiary">سيقوم فريقنا بمراجعة طلبك والتواصل معك لتفعيل الورشة والاشتراك.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-on-surface rtl">
      <main className="py-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-lg">
        {/* Page Header */}
        <section className="flex flex-col gap-base">
          <h1 className="font-headline-lg text-headline-lg md:text-headline-lg text-primary">تسجيل ورشة جديدة</h1>
          <p className="font-body-md text-body-md text-tertiary">انضم إلى شبكة كارنا وابدأ في استقبال العملاء.</p>
          {error && <div className="bg-error/10 text-error p-sm rounded-lg font-bold">{error}</div>}
        </section>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
          {/* Form Body (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-lg">
            
            {/* Basic Info */}
            <div className="bg-surface-white border border-border-light rounded-xl p-lg flex flex-col gap-md">
              <div className="flex items-center gap-xs text-primary">
                <span className="material-symbols-outlined">storefront</span>
                <h2 className="font-headline-sm text-headline-sm">معلومات الورشة</h2>
              </div>
              <div className="grid grid-cols-1 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-lg text-label-lg text-on-surface-variant">اسم الورشة / المركز</label>
                  <input name="name" required className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all" placeholder="مثال: مركز العناية الملكي" type="text" />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-lg text-label-lg text-on-surface-variant">وصف الورشة والخدمات المقدمة</label>
                  <textarea name="description" required rows={4} className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all" placeholder="اكتب وصفاً جذاباً للورشة والخدمات التي تقدمونها..."></textarea>
                </div>
              </div>
            </div>

            {/* Location & Contact */}
            <div className="bg-surface-white border border-border-light rounded-xl p-lg flex flex-col gap-md">
              <div className="flex items-center gap-xs text-primary">
                <span className="material-symbols-outlined">location_on</span>
                <h2 className="font-headline-sm text-headline-sm">الموقع والتواصل</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-lg text-label-lg text-on-surface-variant">المحافظة</label>
                  <select name="city" required className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all">
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
                  <label className="font-label-lg text-label-lg text-on-surface-variant">العنوان التفصيلي</label>
                  <input name="location_text" required className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all" placeholder="المنطقة، الشارع، علامة مميزة" type="text" />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-lg text-label-lg text-on-surface-variant">رقم الهاتف للعملاء</label>
                  <input name="phone" required className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all" placeholder="مثال: 0912345678" type="tel" dir="ltr" />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-lg text-label-lg text-on-surface-variant">أوقات العمل</label>
                  <input name="working_hours" required className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all" placeholder="مثال: من 9 صباحاً حتى 6 مساءً" type="text" />
                </div>
                <div className="flex flex-col gap-xs md:col-span-2">
                  <label className="font-label-lg text-label-lg text-on-surface-variant flex justify-between">
                    <span>رابط الموقع على الخريطة (Google Maps)</span>
                    <span className="text-tertiary">اختياري</span>
                  </label>
                  <input name="google_maps_link" className="bg-surface border border-border-light rounded-lg p-sm font-body-md text-body-md focus:border-accent-yellow outline-none transition-all" placeholder="انسخ رابط الموقع من Google Maps وألصقه هنا" type="url" dir="ltr" />
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="bg-surface-white border border-border-light rounded-xl p-lg flex flex-col gap-md">
              <div className="flex items-center gap-xs text-primary">
                <span className="material-symbols-outlined">photo_camera</span>
                <h2 className="font-headline-sm text-headline-sm">صور الورشة</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
                <div className="md:col-span-2 aspect-video bg-surface-container-low border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent-yellow transition-all gap-xs">
                  <span className="material-symbols-outlined text-outline text-[48px]">add_a_photo</span>
                  <span className="font-label-lg text-label-lg text-tertiary">صورة الواجهة الرئيسية</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 md:col-span-2 gap-sm">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-surface border-2 border-dashed border-outline-variant rounded-lg flex items-center justify-center cursor-pointer hover:border-accent-yellow transition-all">
                      <span className="material-symbols-outlined text-outline">add</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-lg">
            <div className="bg-surface-white border border-border-light rounded-xl p-lg flex flex-col gap-md sticky top-24">
              <div className="flex items-center gap-xs text-primary">
                <span className="material-symbols-outlined">workspace_premium</span>
                <h2 className="font-headline-sm text-headline-sm">باقة الاشتراك</h2>
              </div>
              <div className="flex flex-col gap-md">
                <div className="flex flex-col gap-sm">
                  <label className="flex items-center justify-between p-sm border border-border-light rounded-lg cursor-pointer hover:bg-surface-container transition-all group has-[:checked]:bg-surface-container has-[:checked]:border-accent-yellow">
                    <div className="flex items-center">
                      <input defaultChecked={initialTier === 'عادي'} className="w-5 h-5 text-accent-yellow focus:ring-accent-yellow" name="tier" type="radio" value="عادي" />
                      <div className="mr-sm flex flex-col">
                        <span className="font-body-md text-body-md font-bold text-on-surface">الباقة العادية</span>
                        <span className="font-body-sm text-body-sm text-tertiary">ظهور في القوائم الأساسية</span>
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center justify-between p-sm border border-border-light rounded-lg cursor-pointer hover:bg-surface-container transition-all group has-[:checked]:bg-surface-container has-[:checked]:border-accent-yellow">
                    <div className="flex items-center">
                      <input defaultChecked={initialTier === 'مميز'} className="w-5 h-5 text-accent-yellow focus:ring-accent-yellow" name="tier" type="radio" value="مميز" />
                      <div className="mr-sm flex flex-col">
                        <span className="font-body-md text-body-md font-bold text-on-surface">الباقة المميزة</span>
                        <span className="font-body-sm text-body-sm text-tertiary">ظهور متقدم وإعلانات ممولة</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-accent-yellow">star</span>
                  </label>
                  <label className="flex items-center justify-between p-sm border border-border-light rounded-lg cursor-pointer hover:bg-surface-container transition-all group has-[:checked]:bg-surface-container has-[:checked]:border-accent-yellow">
                    <div className="flex items-center">
                      <input defaultChecked={initialTier === 'حصري'} className="w-5 h-5 text-accent-yellow focus:ring-accent-yellow" name="tier" type="radio" value="حصري" />
                      <div className="mr-sm flex flex-col">
                        <span className="font-body-md text-body-md font-bold text-on-surface">الباقة الحصرية</span>
                        <span className="font-body-sm text-body-sm text-tertiary">الظهور في الصفحة الرئيسية</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-accent-yellow">workspace_premium</span>
                  </label>
                </div>
              </div>
              
              <div className="pt-md border-t border-border-light mt-xs flex flex-col gap-sm">
                <button disabled={isSubmitting} className="w-full bg-accent-yellow text-black font-headline-sm text-headline-sm py-sm rounded-lg shadow-sm hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70" type="submit">
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                      جاري الإرسال...
                    </>
                  ) : (
                    'إرسال طلب التسجيل'
                  )}
                </button>
                <p className="text-[12px] text-tertiary text-center leading-relaxed">
                  بالضغط على إرسال، أنت توافق على شروط وأحكام كارنا لتسجيل الورشات. سيتم مراجعة الطلب خلال 24 ساعة.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
