export default function AboutPage() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      

      <main className="py-8 flex-grow rtl">
        {/* Hero Section: Platform Vision */}
        <section className="max-w-container-max mx-auto px-margin-desktop mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h1 className="font-display-lg text-display-lg mb-6 leading-tight">كارنا... <br /><span className="text-primary">والكار كارنا.</span></h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
                نحن لسنا مجرد منصة لبيع السيارات، بل نحن المركز العصبي لقطاع السيارات في سوريا. رؤيتنا هي ربط البائع بالمشتري، والمالك بورشة الصيانة، من خلال بيئة رقمية شفافة، سريعة، وموثوقة. نؤمن بأن "الكار" يتطلب خبرة، ونحن نضع خبرتنا التقنية في خدمة احتياجاتكم اليومية.
              </p>
              <div className="flex gap-4">
                <div className="flex flex-col items-center p-4 flat-card flex-1">
                  <span className="font-headline-md text-headline-md font-bold text-primary">+١٠٠٠</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">سيارة مدرجة</span>
                </div>
                <div className="flex flex-col items-center p-4 flat-card flex-1">
                  <span className="font-headline-md text-headline-md font-bold text-primary">+٢٥٠</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">ورشة عمل</span>
                </div>
                <div className="flex flex-col items-center p-4 flat-card flex-1">
                  <span className="font-headline-md text-headline-md font-bold text-primary">٢٤/٧</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">دعم فني</span>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="rounded-xl overflow-hidden aspect-video relative group">
                <img alt="Vision image" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="A professional, minimalist close-up of a high-end black sports car parked in a modern, brightly lit studio. The lighting is crisp and corporate, highlighting the sleek metallic curves and precision engineering. The background is a clean, neutral gray gradient that aligns with a high-trust, professional marketplace aesthetic. The mood is sophisticated and authoritative, embodying automotive mastery." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeJFL57Fuu-TyOosvOWjuLryXcscnbP9BQEP8zZgVX6rCX2TGxUA_TO4GWpJc_3YwW29sKw2Mcu3_Cw18pP9iE3Lc2SlinOIQoKQAC-uSP8RfW2DZfknU2qV12YOAxCUObZpaXfM12ifKHJUZ311Cv6bhEOOnTy-MR80RltVdnAVpZuHZe_i3W5QFLQ-GUZKTJ8iThET6O6dxb4ymC6YPu87ut5wmSRK42axWNQmaCJzg0eBcf73OFWUPWkHjnc8dtAcgAnlCM5XZO" />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form & Info Grid */}
        <section className="max-w-container-max mx-auto px-margin-desktop mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2 flat-card p-8">
              <h2 className="font-headline-lg text-headline-lg mb-8">تواصل معنا مباشرة</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <label className="block font-label-lg text-label-lg text-right group-focus-within:text-primary transition-colors">الاسم الكامل</label>
                    <input className="w-full p-3 border border-border-light rounded-lg focus:outline-none focus:border-primary bg-surface transition-colors" placeholder="مثال: أحمد المحمد" type="text" />
                  </div>
                  <div className="space-y-2 group">
                    <label className="block font-label-lg text-label-lg text-right group-focus-within:text-primary transition-colors">البريد الإلكتروني</label>
                    <input className="w-full p-3 border border-border-light rounded-lg focus:outline-none focus:border-primary bg-surface transition-colors" placeholder="name@example.com" type="email" />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="block font-label-lg text-label-lg text-right group-focus-within:text-primary transition-colors">الموضوع</label>
                  <select className="w-full p-3 border border-border-light rounded-lg focus:outline-none focus:border-primary bg-surface appearance-none transition-colors">
                    <option>استفسار عام</option>
                    <option>مشاكل تقنية في الحساب</option>
                    <option>تعاون تجاري للورش</option>
                    <option>شكوى أو اقتراح</option>
                  </select>
                </div>
                <div className="space-y-2 group">
                  <label className="block font-label-lg text-label-lg text-right group-focus-within:text-primary transition-colors">رسالتك</label>
                  <textarea className="w-full p-3 border border-border-light rounded-lg focus:outline-none focus:border-primary bg-surface transition-colors" placeholder="اكتب تفاصيل استفسارك هنا..." rows={5}></textarea>
                </div>
                <button className="w-full md:w-auto px-12 py-3 bg-primary-container text-on-primary-fixed font-bold rounded-lg hover:bg-accent-yellow transition-all active:scale-95" type="submit">إرسال الرسالة</button>
              </form>
            </div>

            {/* Office Locations */}
            <div className="space-y-6">
              <div className="flat-card p-6">
                <h3 className="font-headline-sm text-headline-sm mb-4">مكاتبنا الرئيسية</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <div>
                      <p className="font-label-lg text-label-lg font-bold">دمشق</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">المالكي، بناء برج دمشق، الطابق الرابع</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <div>
                      <p className="font-label-lg text-label-lg font-bold">حلب</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">الموكمبو، شارع البنوك، مجمع السلام</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <div>
                      <p className="font-label-lg text-label-lg font-bold">حمص</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">حي الحمراء، ساحة النهضة</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <div>
                      <p className="font-label-lg text-label-lg font-bold">اللاذقية</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">شارع الجمهورية، مقابل المرفأ</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="flat-card h-64 overflow-hidden relative group cursor-pointer">
                <img alt="Map location" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A stylized, clean topographical map fragment shown on a tablet screen. The map features minimal icons for business locations across a stylized urban landscape. The lighting is bright and even, reinforcing a tech-focused and reliable corporate brand identity. The color scheme is predominantly light grays with vibrant yellow accents to mark the office locations." data-location="Damascus" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmuKGKRUPgWqwig-Y1Q-b7taqRgBBgUBs63Dv7rv9WL4mYXjo3Pbg8nAhcCrlk7dLhUTGsm408FX-BNvTh6DGDGLVOjbiMnxqlqUVsJIDxFpO8BY4g-YmzISNr6rWnqVUKUrKYQYCA4a6RiPw_d0Nciro_FoxxuCkQukn9stE3XX0K52m-GazrsCSB87Dm2p3M07uRbhC5vczsv0mg3Xwbu2V7Zy0HrBlMgVwCCza4O5I0aT4faSNm9EfulF6sYTqFLreewUp-kwtB" />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-full text-label-sm border border-border-light shadow-sm">تفاعل مع الخريطة</div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-container-max mx-auto px-margin-desktop">
          <div className="text-center mb-12">
            <h2 className="font-headline-lg text-headline-lg mb-4">الأسئلة الشائعة</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">كل ما تحتاج لمعرفته عن استخدام منصة كارنا</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Buyers FAQ */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-secondary">shopping_cart</span>
                <h3 className="font-headline-sm text-headline-sm">للمشترين</h3>
              </div>
              <div className="p-4 flat-card">
                <p className="font-label-lg text-label-lg font-bold mb-2">كيف أتحقق من حالة السيارة؟</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">نوصي دائماً بحجز فحص فني لدى إحدى الورش المعتمدة على منصتنا قبل الشراء.</p>
              </div>
              <div className="p-4 flat-card">
                <p className="font-label-lg text-label-lg font-bold mb-2">هل أسعار السيارات نهائية؟</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">الأسعار يحددها البائعون، ويمكنك التفاوض معهم مباشرة عبر أرقام التواصل المدرجة.</p>
              </div>
            </div>
            {/* Sellers FAQ */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">sell</span>
                <h3 className="font-headline-sm text-headline-sm">للبائعين</h3>
              </div>
              <div className="p-4 flat-card">
                <p className="font-label-lg text-label-lg font-bold mb-2">كيف أنشر إعلاناً مجانياً؟</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">اضغط على زر "أضف إعلانك"، سجل دخولك، وارفع صور سيارتك مع التفاصيل الفنية.</p>
              </div>
              <div className="p-4 flat-card">
                <p className="font-label-lg text-label-lg font-bold mb-2">كيف أميز إعلاني؟</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">يمكنك اختيار باقات "الإعلان المميز" لضمان ظهور سيارتك في مقدمة نتائج البحث.</p>
              </div>
            </div>
            {/* Workshops FAQ */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-verification-blue">build</span>
                <h3 className="font-headline-sm text-headline-sm">للورش والفنيين</h3>
              </div>
              <div className="p-4 flat-card">
                <p className="font-label-lg text-label-lg font-bold mb-2">كيف أدرج ورشتي في الدليل؟</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">تواصل معنا عبر قسم "تعاون تجاري" وسيقوم فريقنا بزيارة ورشتك للتحقق والإدراج.</p>
              </div>
              <div className="p-4 flat-card">
                <p className="font-label-lg text-label-lg font-bold mb-2">هل هناك عمولة على الزبائن؟</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">لا نتقاضى أي عمولة على الخدمات، هدفنا هو توفير قاعدة زبائن أوسع لورشتك.</p>
              </div>
            </div>
          </div>
        </section>
      </main>


    </div>
  );
}
