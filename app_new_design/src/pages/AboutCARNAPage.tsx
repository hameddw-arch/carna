import { useEffect } from 'react';
import Header from '../components/Header';
import logoDark from '../assets/carna logo.svg';

export default function AboutCARNAPage() {
  useEffect(() => {
    document.title = 'عن كارنا - منصة الإعلانات المبوبة للسيارات | CARNA';
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      'اعرف أكثر عن كارنا - منصة سورية موثوقة لبيع وشراء السيارات والتواصل مع الورش المتخصصة.'
    );
  }, []);

  const stats = [
    { label: 'إعلان مرتب', value: '2,847+' },
    { label: 'مستخدم نشط', value: '1,234+' },
    { label: 'ورشة موثوقة', value: '89+' }
  ];

  return (
    <div className="min-h-screen bg-surface-light">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary to-primary-dark text-white py-16 md:py-24 px-md md:px-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <img src={logoDark} alt="CARNA" className="h-24 md:h-32" />
          </div>
          <div className="text-center">
            <p className="text-body-lg md:text-headline-md font-light mb-4">
              كارنا... والكار كارنا
            </p>
            <h1 className="font-headline-lg text-headline-lg md:text-headline-xl mb-6">
              منصة سورية لبيع وشراء السيارات
            </h1>
            <p className="text-body-md md:text-body-lg max-w-2xl mx-auto opacity-90">
              موقع موثوق بيسهل عليك تلاقي سيارتك المناسبة أو تبيع سيارتك بسهولة وسرعة
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 px-md md:px-lg">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Mission */}
            <div className="bg-surface-white rounded-xl p-lg md:p-xl shadow-sm border border-border-light">
              <div className="flex items-center gap-md mb-6">
                <span className="material-symbols-outlined text-3xl text-primary">
                  target
                </span>
                <h2 className="text-headline-sm font-bold">رسالتنا</h2>
              </div>
              <p className="text-body-md text-tertiary leading-relaxed">
                نوفر منصة آمنة وموثوقة لبيع وشراء السيارات في سوريا، حيث يلتقي البائعون
                والمشترون بسهولة، ونربط السائقين بالورش المتخصصة لضمان صيانة آمنة وجودة عالية.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-surface-white rounded-xl p-lg md:p-xl shadow-sm border border-border-light">
              <div className="flex items-center gap-md mb-6">
                <span className="material-symbols-outlined text-3xl text-primary">
                  visibility
                </span>
                <h2 className="text-headline-sm font-bold">رؤيتنا</h2>
              </div>
              <p className="text-body-md text-tertiary leading-relaxed">
                أن نصير أكبر وأموثوق منصة في المنطقة لتجارة السيارات والخدمات الآلية، نبني
                ثقة بين المستخدمين ونساهم برفع مستوى قطاع السيارات في سوريا.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-lg md:p-xl border border-yellow-200">
            <h2 className="text-headline-sm font-bold mb-8 flex items-center gap-md">
              <span className="material-symbols-outlined text-primary">
                favorite
              </span>
              قيمنا الأساسية
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    shield_check
                  </span>
                  الأمان والموثوقية
                </h3>
                <p className="text-body-sm text-tertiary">
                  نتحقق من المستخدمين وننشر تقييمات حقيقية لضمان تعاملات آمنة
                </p>
              </div>
              <div>
                <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    handshake
                  </span>
                  الشفافية
                </h3>
                <p className="text-body-sm text-tertiary">
                  لا نخفي شي من المستخدم - أسعار واضحة ومحتوى صريح
                </p>
              </div>
              <div>
                <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    sentiment_satisfied
                  </span>
                  سهولة الاستخدام
                </h3>
                <p className="text-body-sm text-tertiary">
                  تطبيق بسيط وسهل - بلا تعقيدات أو عمليات معقدة
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-surface-white py-16 md:py-24 px-md md:px-lg border-t border-border-light">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-headline-md font-bold text-center mb-12">
            أرقامنا تتحدث
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-body-md text-tertiary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 px-md md:px-lg bg-surface-container-lowest">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-headline-md font-bold mb-12 text-center">
            كيف يشتغل نظامنا
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: '1',
                title: 'اختر أو انشر إعلان',
                desc: 'ابدأ دوّر عن سيارة أو انشر إعلان لبيع سيارتك'
              },
              {
                num: '2',
                title: 'تواصل بسهولة',
                desc: 'اكتب رسائل مباشرة أو اتصل بالبائع/المشتري'
              },
              {
                num: '3',
                title: 'تمام التمام',
                desc: 'اكمل العملية وقيّم التجربة علشان نحسن الخدمة'
              }
            ].map((step, idx) => (
              <div key={idx} className="bg-surface-white rounded-xl p-lg border border-border-light">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-body-lg mb-3">{step.title}</h3>
                <p className="text-body-sm text-tertiary">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 px-md md:px-lg">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl p-lg md:p-xl text-center">
            <span className="material-symbols-outlined text-5xl block mb-4 text-center">
              mail
            </span>
            <h2 className="text-headline-md font-bold mb-4">تحتاج تساعدة؟</h2>
            <p className="text-body-md opacity-90 mb-6">
              ما لقيت اللي تدور عليه أو عندك سؤال؟ أرسل لنا رسالة
            </p>
            <a
              href="mailto:hameddewihy@gmail.com"
              className="inline-block bg-white text-primary px-lg py-md rounded-lg font-bold hover:bg-yellow-50 transition-colors"
            >
              راسلنا الآن
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-white border-t border-border-light py-12 px-md md:px-lg">
        <div className="max-w-6xl mx-auto text-center text-body-sm text-tertiary">
          <p className="mb-4">
            © 2026 CARNA. كل الحقوق محفوظة.
          </p>
          <p>
            تم تصميم الموقع بـ ♥ للسوريين، من قبل فريق متحمس
          </p>
        </div>
      </footer>
    </div>
  );
}
