import { useState, useEffect, useRef } from 'react';
// Removed unused Link import
import { useAuth } from '../contexts/AuthContext';
import { fetchUserService, updateService, uploadServiceImage, deleteServiceImage, fetchServiceReviews, replyToReview } from '../lib/queries';
import logoDark from '../assets/carna logo.svg';

export default function WorkshopDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [service, setService] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: '',
    neighborhood: '',
    location_url: ''
  });
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reviews'>('dashboard');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchUserService(user.id)
        .then(data => {
          if (data) {
            setService(data);
            setFormData({
              name: data.name || '',
              description: data.description || '',
              city: data.city || '',
              neighborhood: data.neighborhood || '',
              location_url: data.location_url || ''
            });
            setSpecialties(data.specialties || ['ميكانيكا', 'كهرباء']);
            fetchServiceReviews(data.id).then(setReviews).catch(console.error);
          }
        })
        .catch(console.error);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!service) return;
    setIsSaving(true);
    try {
      const updates = {
        name: formData.name,
        description: formData.description,
        city: formData.city,
        neighborhood: formData.neighborhood,
        location_url: formData.location_url,
        specialties
      };
      const updated = await updateService(service.id, updates);
      setService({ ...service, ...updated });
      alert('تم حفظ البيانات بنجاح');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setIsSaving(false);
    }
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (spec: string) => {
    setSpecialties(specialties.filter(s => s !== spec));
  };

  const handleReplyChange = (reviewId: string, text: string) => {
    setReplyText({ ...replyText, [reviewId]: text });
  };

  const handleSendReply = async (reviewId: string) => {
    try {
      await replyToReview(reviewId, replyText[reviewId]);
      alert('تم إرسال الرد بنجاح');
      setReviews(reviews.map(r => r.id === reviewId ? { ...r, reply: replyText[reviewId] } : r));
    } catch (e) {
      console.error(e);
      alert('خطأ في إرسال الرد');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !service) return;
    
    // Check if we already have 5 images
    if (service.images && service.images.length >= 5) {
      alert('لا يمكنك رفع أكثر من 5 صور. يرجى حذف إحدى الصور أولاً.');
      return;
    }
    
    setIsSaving(true);
    try {
      const order = service.images ? service.images.length : 0;
      const newImage = await uploadServiceImage(service.id, file, order);
      if (newImage) {
        setService({ 
          ...service, 
          images: [...(service.images || []), newImage] 
        });
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء رفع الصورة');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageDelete = async (imageId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;
    setIsSaving(true);
    try {
      await deleteServiceImage(imageId);
      setService({
        ...service,
        images: service.images.filter((img: any) => img.id !== imageId)
      });
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حذف الصورة');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) return <div className="p-xl text-center">جاري التحميل...</div>;
  if (!user) return <div className="p-xl text-center">الرجاء تسجيل الدخول</div>;

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col overflow-x-hidden">
      
      {/* TopNavBar */}
      <nav className="bg-surface-white w-full sticky top-0 z-50 border-b border-border-light rtl">
        <div className="flex justify-between items-center h-16 px-gutter max-w-container-max mx-auto">
          <div className="flex items-center gap-sm">
            <div className="flex items-center gap-xs cursor-pointer group">
              <div className="text-left hidden md:block">
                <p className="font-label-lg text-label-lg text-on-surface font-bold text-right">{user.name || 'أحمد الشامي'}</p>
                <p className="font-label-sm text-label-sm text-tertiary text-right">{service?.city || 'دمشق، سوريا'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary font-bold overflow-hidden border-2 border-border-light">
                <img alt={user.name || "صورة"} className="w-full h-full object-cover" src={service?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuC_pmCkdcVCZo6nXAKhq5QTyAmEwm26IwP6WypmDan8xsveZidY5JeMCjR4tYSY3N8VPf4kyJhkq5BnxiD0Jo84qq0l-HZZYiv9__EoL4yGO_hZrUtgw_FXI-or3MWLX6Kla4JrK_Pvun0nRlQi7iNKZ4KU1L3_91jGlTVQTPiW1BWy4V5a-dAP1EAunFt9KJ6tPZnFVjWCNj55zyDODpiGvjlW6dDZ3iCumTQfgF1FbXA1puhgAi9Ja7lvNgxQXiKpl0tnit9cZMFQ"} />
              </div>
            </div>
            <div className="h-8 w-px bg-border-light mx-xs"></div>
            <button className="relative p-2 text-on-surface-variant hover:bg-surface-container transition-colors rounded-full active:scale-95">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <button className="relative p-2 text-on-surface-variant hover:bg-surface-container transition-colors rounded-full active:scale-95">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
          <div className="flex items-center gap-md">
            <div className="hidden md:flex items-center gap-md ml-10">
              <a className="text-on-surface-variant font-medium hover:text-primary transition-colors active:scale-95" href="#">الرئيسية</a>
              <a className="text-on-surface-variant font-medium hover:text-primary transition-colors font-bold border-b-2 border-primary pb-1 active:scale-95" href="#">ورشات الصيانة</a>
              <a className="text-on-surface-variant font-medium hover:text-primary transition-colors active:scale-95" href="#">سوق السيارات</a>
            </div>
            <div className="h-10 flex items-center gap-2">
              <img src={logoDark} alt="CARNA" className="h-8 w-auto" />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex max-w-container-max mx-auto rtl w-full flex-grow">
        {/* SideNavBar */}
        <aside className="w-64 h-[calc(100vh-80px)] sticky top-20 border-l border-border-light flex flex-col py-md hidden md:flex bg-inverse-surface">
          <div className="flex flex-col gap-2 flex-grow">
            <a onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }} className={`flex items-center gap-xs px-sm py-3 rounded-lg transition-all active:scale-95 cursor-pointer ${activeTab === 'dashboard' ? 'bg-white/10 text-white font-bold border-r-2 border-accent-yellow' : 'text-white/70 hover:bg-white/10'}`}>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">storefront</span>
                <span className="font-label-lg text-label-lg">لوحة الورشة</span>
              </div>
            </a>
            <a onClick={(e) => { e.preventDefault(); setActiveTab('reviews'); }} className={`flex items-center gap-xs px-sm py-3 rounded-lg transition-all active:scale-95 cursor-pointer ${activeTab === 'reviews' ? 'bg-white/10 text-white font-bold border-r-2 border-accent-yellow' : 'text-white/70 hover:bg-white/10'}`}>
              <span className="material-symbols-outlined">star_rate</span>
              <span className="font-label-lg text-label-lg">التقييمات</span>
            </a>
            <a href="/subscription-plans" className="flex items-center gap-xs px-sm py-3 text-white/70 hover:bg-white/10 rounded-lg transition-all active:scale-95">
              <span className="material-symbols-outlined">workspace_premium</span>
              <span className="font-label-lg text-label-lg">الباقات والاشتراكات</span>
            </a>
            <a href="/account-settings" className="flex items-center gap-xs px-sm py-3 text-white/70 hover:bg-white/10 rounded-lg transition-all active:scale-95">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label-lg text-label-lg">إعدادات الحساب</span>
            </a>
          </div>
          <div className="border-t border-white/10 pt-4">
            <a className="flex items-center gap-xs px-sm py-3 text-white/60 hover:text-white transition-all active:scale-95" href="#">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label-lg text-label-lg">تسجيل الخروج</span>
            </a>
          </div>
        </aside>

        <main className="flex-grow p-gutter md:p-lg">
          {activeTab === 'dashboard' ? (
            <>
              {/* Header Section */}
              <div className="mb-lg">
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">لوحة تحكم الورشة</h1>
            <p className="font-body-md text-body-md text-tertiary">إدارة بيانات ورشة "{service?.name || 'النجم الذهبي'}" وتحليلات الأداء</p>
          </div>

          {/* Analytics Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-sm mb-lg">
            <div className="bg-surface-white border border-border-light p-md rounded-xl col-span-1 hover:shadow-sm hover:-translate-y-0.5 transition-all">
              <div className="flex justify-between items-start mb-base">
                <span className="material-symbols-outlined text-secondary">visibility</span>
              </div>
              <p className="font-body-sm text-body-sm text-tertiary">إجمالي المشاهدات</p>
              <h2 className="font-headline-sm text-headline-sm font-bold">{service?.views_count || 0}</h2>
            </div>
            <div className="bg-surface-white border border-border-light p-md rounded-xl col-span-1 hover:shadow-sm hover:-translate-y-0.5 transition-all">
              <div className="flex justify-between items-start mb-base">
                <span className="material-symbols-outlined text-verification-blue">chat</span>
              </div>
              <p className="font-body-sm text-body-sm text-tertiary">نقرات واتساب</p>
              <h2 className="font-headline-sm text-headline-sm font-bold">{service?.whatsapp_clicks || 0}</h2>
            </div>
            <div className="bg-surface-white border border-border-light p-md rounded-xl col-span-1 hover:shadow-sm hover:-translate-y-0.5 transition-all">
              <div className="flex justify-between items-start mb-base">
                <span className="material-symbols-outlined text-accent-yellow fill">star</span>
                <span className="text-tertiary text-xs font-bold font-label-sm text-label-sm">من {service?.reviews_count || 0} تقييم</span>
              </div>
              <p className="font-body-sm text-body-sm text-tertiary">متوسط التقييم</p>
              <h2 className="font-headline-sm text-headline-sm font-bold">{service?.rating || 0}</h2>
            </div>
            <div className="bg-surface-white border border-border-light p-md rounded-xl col-span-1 hover:shadow-sm hover:-translate-y-0.5 transition-all">
              <div className="flex justify-between items-start mb-base">
                <span className="material-symbols-outlined text-error">share</span>
              </div>
              <p className="font-body-sm text-body-sm text-tertiary">عدد المشاركات</p>
              <h2 className="font-headline-sm text-headline-sm font-bold">{service?.shares_count || 0}</h2>
            </div>
          </div>

          {/* Content Split Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            {/* Details & Specialities Column */}
            <div className="lg:col-span-2 space-y-lg">
              {/* Edit Workshop Details */}
              <section className="bg-surface-white border border-border-light p-lg rounded-xl">
                <div className="flex justify-between items-center mb-md">
                  <h2 className="font-headline-sm text-headline-sm">بيانات الورشة</h2>
                  <button onClick={handleSave} disabled={isSaving} className="text-primary font-bold font-label-lg text-label-lg hover:underline transition-all active:scale-95 disabled:opacity-50">
                    {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </button>
                </div>
                <div className="space-y-md">
                  <div>
                    <label className="block font-label-lg text-label-lg mb-base">اسم الورشة</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-surface-container-low border border-border-light rounded-lg px-md py-xs font-body-md text-body-md focus:ring-1 focus:ring-primary outline-none" type="text" placeholder="مثال: ورشة النجم الذهبي لصيانة السيارات" />
                  </div>
                  <div>
                    <label className="block font-label-lg text-label-lg mb-base">الوصف</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full bg-surface-container-low border border-border-light rounded-lg px-md py-xs font-body-md text-body-md focus:ring-1 focus:ring-primary outline-none" rows={3} placeholder="اكتب وصفاً جذاباً لورشتك..."></textarea>
                  </div>
                  
                  {/* Specialty Chips */}
                  <div>
                    <label className="block font-label-lg text-label-lg mb-xs">التخصصات</label>
                    <div className="flex flex-wrap gap-xs mb-sm">
                      {specialties.map(spec => (
                        <span key={spec} className="bg-primary-container text-on-primary-container px-sm py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 hover:opacity-80 transition-opacity">
                          {spec} 
                          <span onClick={() => removeSpecialty(spec)} className="material-symbols-outlined text-[14px] cursor-pointer">close</span>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={newSpecialty} onChange={(e) => setNewSpecialty(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSpecialty()} placeholder="إضافة تخصص جديد..." className="bg-surface-container-low border border-border-light rounded-lg px-md py-1 font-body-sm text-body-sm focus:ring-1 focus:ring-primary outline-none" />
                      <button onClick={addSpecialty} className="bg-surface-container text-tertiary border border-border-light px-sm py-1 rounded-full font-label-sm text-label-sm cursor-pointer hover:bg-surface-container-high active:scale-95 transition-all">إضافة</button>
                    </div>
                  </div>

                  {/* Photos Section */}
                  <div>
                    <div className="flex justify-between items-end mb-xs">
                      <label className="block font-label-lg text-label-lg">صور الورشة ({service?.images?.length || 0}/5)</label>
                      {service?.images?.length > 0 && <span className="text-tertiary text-xs">الصورة الأولى هي الغلاف</span>}
                    </div>
                    <div className="grid grid-cols-3 gap-sm">
                      {service?.images?.map((img: any, index: number) => (
                        <div key={img.id} className="aspect-square rounded-lg overflow-hidden relative group border border-border-light">
                          <img alt={`Workshop ${index + 1}`} className="w-full h-full object-cover" src={img.url} />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-sm">
                            <button onClick={() => handleImageDelete(img.id)} className="w-8 h-8 rounded-full bg-error text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                          {index === 0 && (
                            <div className="absolute top-1 right-1 bg-primary text-white text-[10px] px-2 py-0.5 rounded shadow">
                              الرئيسية
                            </div>
                          )}
                        </div>
                      ))}
                      {(!service?.images || service.images.length < 5) && (
                        <div onClick={() => !isSaving && fileInputRef.current?.click()} className={`aspect-square border-2 border-dashed border-border-light rounded-lg flex flex-col items-center justify-center text-tertiary cursor-pointer hover:bg-surface-container-low transition-colors ${isSaving ? 'opacity-50 pointer-events-none' : 'active:scale-95'}`}>
                          <span className="material-symbols-outlined text-[32px] mb-xs">add_a_photo</span>
                          <span className="font-label-sm text-label-sm">رفع صورة</span>
                          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isSaving} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Reviews Management */}
              <section className="bg-surface-white border border-border-light p-lg rounded-xl">
                <div className="flex justify-between items-center mb-md">
                  <h2 className="font-headline-sm text-headline-sm">آخر التقييمات</h2>
                  <a className="text-tertiary font-label-lg text-label-lg hover:text-primary transition-colors" href="#">مشاهدة الكل</a>
                </div>
                <div className="space-y-md">
                  {reviews.length === 0 ? (
                    <p className="text-tertiary font-body-sm">لا توجد تقييمات حتى الآن.</p>
                  ) : (
                    reviews.map(review => (
                      <div key={review.id} className="border-b border-border-light pb-md">
                        <div className="flex justify-between mb-xs">
                          <div className="flex items-center gap-sm">
                            <div className="w-8 h-8 bg-surface-container rounded-full flex items-center justify-center font-bold text-primary font-label-lg text-label-lg">
                              {review.users?.name?.charAt(0) || 'م'}
                            </div>
                            <span className="font-label-lg text-label-lg font-bold">{review.users?.name || 'مستخدم'}</span>
                          </div>
                          <div className="flex text-accent-yellow">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`material-symbols-outlined text-sm ${i < review.rating ? 'fill' : ''}`}>star</span>
                            ))}
                          </div>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface mb-sm">{review.content}</p>
                        
                        {review.reply ? (
                          <div className="bg-surface-container-low p-sm rounded-lg border-r-2 border-primary">
                            <p className="font-body-sm text-body-sm font-bold text-primary mb-1">ردك:</p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant italic">"{review.reply}"</p>
                          </div>
                        ) : (
                          <div className="relative">
                            <input 
                              value={replyText[review.id] || ''}
                              onChange={(e) => handleReplyChange(review.id, e.target.value)}
                              className="w-full bg-surface-container-low border border-border-light rounded-lg pr-md pl-12 py-2 font-body-sm text-body-sm outline-none focus:ring-1 focus:ring-primary" 
                              placeholder="اكتب رداً..." 
                              type="text" 
                              onKeyDown={(e) => e.key === 'Enter' && handleSendReply(review.id)}
                            />
                            <button onClick={() => handleSendReply(review.id)} className="absolute left-2 top-1/2 -translate-y-1/2 text-primary font-bold font-label-sm text-label-sm hover:underline active:scale-95 transition-transform">إرسال</button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            {/* Secondary Info Column */}
            <div className="space-y-lg">
              {/* Quick Actions */}
              <div className="bg-surface-white border border-border-light p-lg rounded-xl">
                <h2 className="font-headline-sm text-headline-sm mb-md">إجراءات سريعة</h2>
                <div className="grid grid-cols-1 gap-sm">
                  <button onClick={() => alert('هذه الميزة قيد التطوير وقريباً سيتم إطلاقها')} className="flex items-center gap-sm p-sm rounded-lg hover:bg-surface-container-low border border-border-light transition-colors group active:scale-95 text-right w-full">
                    <span className="material-symbols-outlined p-2 rounded bg-surface-container text-primary group-hover:bg-primary group-hover:text-white transition-colors">campaign</span>
                    <div>
                      <p className="font-label-lg text-label-lg font-bold">إنشاء إعلان ترويجي</p>
                      <p className="font-body-sm text-body-sm text-tertiary">زيادة ظهور ورشتك (قريباً)</p>
                    </div>
                  </button>
                  <button onClick={() => alert('هذه الميزة قيد التطوير وقريباً سيتم إطلاقها')} className="flex items-center gap-sm p-sm rounded-lg hover:bg-surface-container-low border border-border-light transition-colors group active:scale-95 text-right w-full">
                    <span className="material-symbols-outlined p-2 rounded bg-surface-container text-verification-blue group-hover:bg-verification-blue group-hover:text-white transition-colors">verified</span>
                    <div>
                      <p className="font-label-lg text-label-lg font-bold">توثيق الحساب</p>
                      <p className="font-body-sm text-body-sm text-tertiary">احصل على شارة التوثيق (قريباً)</p>
                    </div>
                  </button>
                  <button onClick={() => alert('هذه الميزة قيد التطوير وقريباً سيتم إطلاقها')} className="flex items-center gap-sm p-sm rounded-lg hover:bg-surface-container-low border border-border-light transition-colors group active:scale-95 text-right w-full">
                    <span className="material-symbols-outlined p-2 rounded bg-surface-container text-error group-hover:bg-error group-hover:text-white transition-colors">analytics</span>
                    <div>
                      <p className="font-label-lg text-label-lg font-bold">تقرير شهري</p>
                      <p className="font-body-sm text-body-sm text-tertiary">تحميل إحصائيات مفصلة (قريباً)</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Location Card */}
              <div className="bg-surface-white border border-border-light p-lg rounded-xl flex flex-col gap-md">
                <div className="flex justify-between items-center">
                  <h2 className="font-headline-sm text-headline-sm">الموقع الجغرافي</h2>
                  <button className="text-primary font-bold font-label-sm hover:underline transition-all">تحديث الموقع</button>
                </div>
                
                <div className="flex flex-col gap-sm">
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">المحافظة</label>
                    <select name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-surface-container-low border border-border-light rounded-lg px-md py-xs font-body-md text-body-md focus:ring-1 focus:ring-primary outline-none">
                      <option value="">اختر المحافظة</option>
                      <option value="دمشق">دمشق</option>
                      <option value="ريف دمشق">ريف دمشق</option>
                      <option value="حلب">حلب</option>
                      <option value="حمص">حمص</option>
                      <option value="حماة">حماة</option>
                      <option value="اللاذقية">اللاذقية</option>
                      <option value="طرطوس">طرطوس</option>
                      <option value="السويداء">السويداء</option>
                      <option value="درعا">درعا</option>
                      <option value="القنيطرة">القنيطرة</option>
                      <option value="دير الزور">دير الزور</option>
                      <option value="الحسكة">الحسكة</option>
                      <option value="الرقة">الرقة</option>
                      <option value="إدلب">إدلب</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">المدينة / المنطقة</label>
                    <input type="text" name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} placeholder="مثال: جرمانا، المزة، الخ..." className="w-full bg-surface-container-low border border-border-light rounded-lg px-md py-xs font-body-md text-body-md focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">رابط خرائط جوجل (Google Maps)</label>
                    <div className="flex gap-2">
                      <input type="url" name="location_url" value={formData.location_url} onChange={handleInputChange} placeholder="https://maps.google.com/..." className="flex-grow bg-surface-container-low border border-border-light rounded-lg px-md py-xs font-body-md text-body-md focus:ring-1 focus:ring-primary outline-none" dir="ltr" />
                      <a href="https://www.google.com/maps" target="_blank" rel="noreferrer" className="flex items-center justify-center bg-surface-container border border-border-light rounded-lg px-sm hover:bg-surface-container-high transition-colors text-primary" title="افتح الخرائط لتحديد الموقع">
                        <span className="material-symbols-outlined text-[20px]">map</span>
                      </a>
                    </div>
                    <p className="font-body-sm text-body-sm text-tertiary mt-1">يساعد هذا الرابط الزبائن في الوصول إلى ورشتك مباشرة باستخدام خرائط جوجل.</p>
                  </div>
                </div>

                <div className="aspect-video bg-surface-container rounded-lg overflow-hidden border border-border-light mt-sm relative group">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4845wM0wDKkn2mFekboN6ym7hub6mA7-hQVN_cgKnb2WgBmDTSyZeemTnyUJ9YUv0kGUJMbZYH8utm-tVrXkZKBF2__3gy0na0n93rGgCt9lcRiRy_eJOdIz12x_zRZ1iqwVbMsiUwQRis88oqJNd41ciSj514lttSjEnfJxkePOOztCw3SFM8B6cW48s2HFXJtIwCkGbA5r91h031tKveVHcTfrqbAntxpfVUKO2dogcelLVoACLJVLE6aDmO_21HYMDvjoohWL8" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-surface-white text-primary px-sm py-1 rounded font-bold font-label-sm text-label-sm cursor-pointer shadow-sm">تغيير صورة الخريطة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
            <div className="mb-lg">
              <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">التقييمات والمراجعات</h1>
              <p className="font-body-md text-body-md text-tertiary">شاهد آراء عملائك ورد عليها لزيادة ثقتهم</p>
              
              <div className="mt-md space-y-md">
                {reviews.length === 0 ? (
                  <div className="bg-surface-white border border-border-light p-xl rounded-xl text-center">
                    <span className="material-symbols-outlined text-[48px] text-tertiary mb-sm">star_rate</span>
                    <h3 className="font-headline-sm text-headline-sm text-text-primary">لا توجد تقييمات حتى الآن</h3>
                    <p className="text-body-md text-tertiary mt-2">ستظهر هنا تقييمات العملاء فور إضافتها.</p>
                  </div>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="bg-surface-white border border-border-light p-md rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-bold font-label-lg text-text-primary block">{review.users?.name || 'مستخدم'}</span>
                          <span className="text-label-sm text-tertiary block mt-1">{new Date(review.created_at).toLocaleDateString('ar-SA')}</span>
                        </div>
                        <div className="flex text-accent-yellow">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`material-symbols-outlined text-[16px] ${i < review.rating ? 'fill' : ''}`}>star</span>
                          ))}
                        </div>
                      </div>
                      <p className="font-body-md text-on-surface mb-md bg-surface-container-low p-sm rounded-lg">{review.content}</p>
                      
                      {review.reply ? (
                        <div className="bg-primary-container/20 p-sm rounded-lg border-r-2 border-primary mr-4">
                          <p className="font-body-sm font-bold text-primary mb-1">ردك:</p>
                          <p className="font-body-sm text-on-surface">{review.reply}</p>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={replyText[review.id] || ''}
                            onChange={(e) => setReplyText({...replyText, [review.id]: e.target.value})}
                            placeholder="اكتب ردك هنا..." 
                            className="flex-grow bg-surface-container-low border border-border-light rounded-lg px-sm py-2 font-body-sm outline-none focus:ring-1 focus:ring-primary"
                          />
                          <button 
                            onClick={() => handleSendReply(review.id)}
                            disabled={!replyText[review.id]?.trim()}
                            className="bg-primary text-white px-md py-2 rounded-lg font-bold font-label-sm active:scale-95 transition-all disabled:opacity-50"
                          >
                            إضافة رد
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-surface-container-highest w-full mt-auto border-t border-border-light py-lg px-margin-desktop flex flex-col items-center gap-sm rtl">
        <div className="flex gap-md flex-wrap justify-center">
          <a className="text-tertiary hover:text-primary transition-opacity duration-200 hover:underline font-body-sm text-body-sm" href="#">عن كارنا</a>
          <a className="text-tertiary hover:text-primary transition-opacity duration-200 hover:underline font-body-sm text-body-sm" href="#">الشروط والأحكام</a>
          <a className="text-tertiary hover:text-primary transition-opacity duration-200 hover:underline font-body-sm text-body-sm" href="#">سياسة الخصوصية</a>
          <a className="text-tertiary hover:text-primary transition-opacity duration-200 hover:underline font-body-sm text-body-sm" href="#">الأسئلة الشائعة</a>
        </div>
        <p className="text-on-surface font-body-sm text-body-sm">© ٢٠٢٤ كارنا. جميع الحقوق محفوظة.</p>
      </footer>

      {/* Mobile Bottom NavBar (Workshop Specific) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-white border-t border-border-light flex justify-around items-center py-xs z-50">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center active:scale-95 transition-transform ${activeTab === 'dashboard' ? 'text-primary' : 'text-tertiary'}`}>
          <span className="material-symbols-outlined">storefront</span>
          <span className="text-[10px] font-label-sm">الورشة</span>
        </button>
        <button onClick={() => setActiveTab('reviews')} className={`flex flex-col items-center active:scale-95 transition-transform ${activeTab === 'reviews' ? 'text-primary' : 'text-tertiary'}`}>
          <span className="material-symbols-outlined">star_rate</span>
          <span className="text-[10px] font-label-sm">التقييمات</span>
        </button>
        <button onClick={() => window.location.href = '/subscription-plans'} className="flex flex-col items-center text-tertiary active:scale-95 transition-transform">
          <span className="material-symbols-outlined">workspace_premium</span>
          <span className="text-[10px] font-label-sm">الباقات</span>
        </button>
        <button onClick={() => window.location.href = '/account-settings'} className="flex flex-col items-center text-tertiary active:scale-95 transition-transform">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-label-sm">الإعدادات</span>
        </button>
      </div>
    </div>
  );
}
