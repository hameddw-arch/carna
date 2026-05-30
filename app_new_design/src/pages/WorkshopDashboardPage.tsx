import { useState, useEffect, useRef } from 'react';
// Removed unused Link import
import { useAuth } from '../contexts/AuthContext';
import { fetchUserService, updateService, uploadServiceImage, fetchServiceReviews, replyToReview } from '../lib/queries';
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
    
    try {
      const url = await uploadServiceImage(service.id, file);
      if (url) {
        // Assuming your services table has an 'image' column. If not, it can be updated in DB schema later.
        await updateService(service.id, { image: url });
        setService({ ...service, image: url });
        alert('تم تحديث الصورة بنجاح');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء رفع الصورة');
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
            <a className="flex items-center justify-between gap-xs px-sm py-3 text-white/70 hover:bg-white/10 rounded-lg transition-all active:scale-95" href="#">
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined">dashboard</span>
                <span className="font-label-lg text-label-lg">لوحة القيادة</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-[11px] font-bold">
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
              </div>
            </a>
            <a className="flex items-center gap-xs px-sm py-3 text-white/70 hover:bg-white/10 rounded-lg transition-all active:scale-95" href="#">
              <span className="material-symbols-outlined">campaign</span>
              <span className="font-label-lg text-label-lg">إعلاناتي</span>
            </a>
            <a className="flex items-center gap-xs px-sm py-3 text-white/70 hover:bg-white/10 rounded-lg transition-all active:scale-95" href="#">
              <span className="material-symbols-outlined">mail</span>
              <span className="font-label-lg text-label-lg">الرسائل</span>
            </a>
            <a className="flex items-center gap-xs px-sm py-3 text-white/70 hover:bg-white/10 rounded-lg transition-all active:scale-95" href="#">
              <span className="material-symbols-outlined">favorite</span>
              <span className="font-label-lg text-label-lg">المفضلة</span>
            </a>
            <a className="flex items-center gap-xs px-sm py-3 text-on-primary-container bg-primary-container rounded-lg font-bold transition-all shadow-md active:scale-95" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label-lg text-label-lg">الإعدادات</span>
            </a>
          </div>
          <div className="border-t border-white/10 pt-4">
            <a className="flex items-center gap-xs px-sm py-3 text-white/60 hover:text-white transition-all active:scale-95" href="#">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label-lg text-label-lg">تسجيل الخروج</span>
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-gutter md:p-lg">
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
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold font-label-sm text-label-sm">+١٢٪</span>
              </div>
              <p className="font-body-sm text-body-sm text-tertiary">إجمالي المشاهدات</p>
              <h2 className="font-headline-sm text-headline-sm font-bold">٢,٤٥٠</h2>
            </div>
            <div className="bg-surface-white border border-border-light p-md rounded-xl col-span-1 hover:shadow-sm hover:-translate-y-0.5 transition-all">
              <div className="flex justify-between items-start mb-base">
                <span className="material-symbols-outlined text-verification-blue">chat</span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold font-label-sm text-label-sm">+٨٪</span>
              </div>
              <p className="font-body-sm text-body-sm text-tertiary">نقرات واتساب</p>
              <h2 className="font-headline-sm text-headline-sm font-bold">١٨٤</h2>
            </div>
            <div className="bg-surface-white border border-border-light p-md rounded-xl col-span-1 hover:shadow-sm hover:-translate-y-0.5 transition-all">
              <div className="flex justify-between items-start mb-base">
                <span className="material-symbols-outlined text-accent-yellow fill">star</span>
                <span className="text-tertiary text-xs font-bold font-label-sm text-label-sm">من {service?.reviews_count || 45} تقييم</span>
              </div>
              <p className="font-body-sm text-body-sm text-tertiary">متوسط التقييم</p>
              <h2 className="font-headline-sm text-headline-sm font-bold">{service?.rating || 4.8}</h2>
            </div>
            <div className="bg-surface-white border border-border-light p-md rounded-xl col-span-1 hover:shadow-sm hover:-translate-y-0.5 transition-all">
              <div className="flex justify-between items-start mb-base">
                <span className="material-symbols-outlined text-error">share</span>
              </div>
              <p className="font-body-sm text-body-sm text-tertiary">عدد المشاركات</p>
              <h2 className="font-headline-sm text-headline-sm font-bold">٦٢</h2>
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
                    <label className="block font-label-lg text-label-lg mb-xs">صور الورشة (٣/٥)</label>
                    <div className="grid grid-cols-3 gap-sm">
                      <div className="aspect-square rounded-lg overflow-hidden relative group border border-border-light">
                        <img alt="Workshop 1" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMjF-yqbKUTzPil1ls_idy5-fIiaAQneeCH-wAIKXncRX6tAVRDsEpGUQuaGvD1mAf1zuk6gyS1K2W12rEzlwSVrLeyiyj9hpz7qY_5fHHhKofB9uw3iODZ76ubQeFZhFc05yEoXfQB-AGRS6wPjGXiqNwZwwuBwa1KCAFvKScpr54weJUKt0JKX9JIs_-NxPP4GfVLd2Ni8YOCIV5Oo-k65q8ReAtZfNeg-XaFatL0l7vccRnrV9wL8z0guEm7OU61WfQeUg7JbV0" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-sm">
                          <span className="material-symbols-outlined text-white cursor-pointer hover:scale-110 transition-transform">delete</span>
                          <span className="material-symbols-outlined text-white cursor-pointer hover:scale-110 transition-transform">edit</span>
                        </div>
                      </div>
                      <div className="aspect-square rounded-lg overflow-hidden relative group border border-border-light">
                        <img alt="Workshop 2" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApL9uE4Jfr7e5myhOBi5kPZdYn1lorkhO4LGa709HTRr_A3zmdZJ1uPqDL5F5IY_D9qvDb223zIaEak2HrtANmaBu5PTrDU23hGamLN9sGQ4E6lgS7eIxkut1uc_VHGPoZ7EwjJzFJxIMMIk5Bw7__VxOlWyb5GKz526TYGDfrEXqR4651Tmh0dUtwcUmc5ktStXihSZVnbshHyvnTCHARTxc-6Rtm2dbblXZtukHTa04sjUZbC-LRiKNQjz7U4rPKwuFtcHaI6vmm" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-sm">
                          <span className="material-symbols-outlined text-white cursor-pointer hover:scale-110 transition-transform">delete</span>
                          <span className="material-symbols-outlined text-white cursor-pointer hover:scale-110 transition-transform">edit</span>
                        </div>
                      </div>
                      <div onClick={() => fileInputRef.current?.click()} className="aspect-square border-2 border-dashed border-border-light rounded-lg flex flex-col items-center justify-center text-tertiary cursor-pointer hover:bg-surface-container-low transition-colors active:scale-95">
                        <span className="material-symbols-outlined text-[32px] mb-xs">add_a_photo</span>
                        <span className="font-label-sm text-label-sm">رفع صورة</span>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </div>
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
                  <button className="flex items-center gap-sm p-sm rounded-lg hover:bg-surface-container-low border border-border-light transition-colors group active:scale-95">
                    <span className="material-symbols-outlined p-2 rounded bg-surface-container text-primary group-hover:bg-primary group-hover:text-white transition-colors">campaign</span>
                    <div className="text-right">
                      <p className="font-label-lg text-label-lg font-bold">إنشاء إعلان ترويجي</p>
                      <p className="font-body-sm text-body-sm text-tertiary">زيادة ظهور ورشتك</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-sm p-sm rounded-lg hover:bg-surface-container-low border border-border-light transition-colors group active:scale-95">
                    <span className="material-symbols-outlined p-2 rounded bg-surface-container text-verification-blue group-hover:bg-verification-blue group-hover:text-white transition-colors">verified</span>
                    <div className="text-right">
                      <p className="font-label-lg text-label-lg font-bold">توثيق الحساب</p>
                      <p className="font-body-sm text-body-sm text-tertiary">احصل على شارة التوثيق</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-sm p-sm rounded-lg hover:bg-surface-container-low border border-border-light transition-colors group active:scale-95">
                    <span className="material-symbols-outlined p-2 rounded bg-surface-container text-error group-hover:bg-error group-hover:text-white transition-colors">analytics</span>
                    <div className="text-right">
                      <p className="font-label-lg text-label-lg font-bold">تقرير شهري</p>
                      <p className="font-body-sm text-body-sm text-tertiary">تحميل إحصائيات مفصلة</p>
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

      {/* Mobile Bottom NavBar (Simplified for Task Focus) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-white border-t border-border-light flex justify-around items-center py-xs z-50">
        <button className="flex flex-col items-center text-primary active:scale-95 transition-transform">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-label-sm">الرئيسية</span>
        </button>
        <button className="flex flex-col items-center text-tertiary active:scale-95 transition-transform">
          <span className="material-symbols-outlined">directions_car</span>
          <span className="text-[10px] font-label-sm">إعلاناتي</span>
        </button>
        <button className="flex flex-col items-center text-tertiary active:scale-95 transition-transform">
          <span className="material-symbols-outlined">chat</span>
          <span className="text-[10px] font-label-sm">الرسائل</span>
        </button>
        <button className="flex flex-col items-center text-tertiary active:scale-95 transition-transform">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-label-sm">الإعدادات</span>
        </button>
      </div>
    </div>
  );
}
