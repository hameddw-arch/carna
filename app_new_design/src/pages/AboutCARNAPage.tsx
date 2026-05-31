import { useEffect } from 'react'
import Header from '../components/Header'
import { usePageView } from '../hooks/useAnalytics'
import { Eye, Users, TrendingUp, CheckCircle, Zap, Handshake } from 'lucide-react'

export default function AboutCARNAPage() {
  usePageView('/about')

  useEffect(() => {
    document.title = 'عن كارنا - منصة الإعلانات المبوبة للسيارات | CARNA'
    const descTag = document.querySelector('meta[name="description"]')
    if (descTag) {
      descTag.setAttribute(
        'content',
        'اعرف أكثر عن كارنا - منصة سورية موثوقة لبيع وشراء السيارات والتواصل مع الورش المتخصصة.'
      )
    }
  }, [])

  const stats = [
    { label: 'سيارة مدرجة', value: '+10,000', icon: Users },
    { label: 'ورشة صيانة', value: '+500', icon: TrendingUp },
    { label: 'مدينة سورية', value: '+20', icon: Eye }
  ]

  const values = [
    { icon: CheckCircle, title: 'الشفافية', desc: 'نسعى لترسيخ الصدق في التعامل من خلال أنظمة فحص وتوثيق دقيقة' },
    { icon: Zap, title: 'السرعة', desc: 'منصة تقنية متطورة تتيح لك الوصول إلى ما تحتاجه في ثوانٍ معدودة' },
    { icon: Handshake, title: 'الثقة', desc: 'بناء مجتمع آمن يجمع بين أفضل التجار والورشات الموثوقة' }
  ]

  const services = [
    {
      title: 'سوق السيارات',
      desc: 'أكبر تجمع للسيارات المستعملة والجديدة في سوريا. تصفية ذكية، بحث متقدم، وإضافة إعلانات بسهولة تامة',
      icon: '🚗'
    },
    {
      title: 'دليل الورشات',
      desc: 'لا مزيد من الحيرة عند تعطل سيارتك. ابحث عن أفضل مراكز الصيانة والورشات المتخصصة بالقرب منك',
      icon: '🔧'
    },
    {
      title: 'الشفافية والتوثيق',
      desc: 'نقدم أنظمة فحص معتمدة تساعدك على معرفة الحالة الحقيقية للسيارة قبل الشراء',
      icon: '📋'
    }
  ]

  return (
    <div dir="rtl" className="min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section
        className="relative h-96 md:h-[614px] flex items-center justify-center text-center px-4 md:px-8 pt-16 md:pt-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#1a1c1c'
        }}
      >
        <div className="z-10 max-w-3xl">
          <h1 className="text-white font-bold text-4xl md:text-5xl leading-tight mb-4">
            كارنا... سوق السيارات والورش الأول في سوريا
          </h1>
          <p className="text-yellow-400 font-bold text-lg md:text-xl tracking-wider mb-8">
            كارنا... والكار كارنا
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/browse"
              className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              تصفح السوق
            </a>
            <a
              href="/workshops"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
            >
              دليل الورشات
            </a>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">قصتنا</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-4">
                انطلقت منصة كارنا من قلب السوق السوري لتكون المرجع الأول والشامل لكل ما يخص عالم السيارات. نحن نؤمن بأن عملية بيع وشراء السيارات والبحث عن خدمات الصيانة يجب أن تكون تجربة سهلة، سريعة، وموثوقة.
              </p>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                كارنا ليست مجرد موقع إعلانات، بل هي نظام متكامل يربط بين البائع والمشتري وبين صاحب السيارة وخبراء الصيانة، مع التركيز التام على تلبية احتياجات السوق المحلي بمعايير عالمية.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden border border-border-light h-80 bg-surface-container">
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                <span>صورة القصة</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-surface-container py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12">مهمتنا</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, idx) => {
              const IconComponent = value.icon
              return (
                <div key={idx} className="bg-surface-white p-8 rounded-xl border border-border-light hover:shadow-lg transition-shadow">
                  <IconComponent className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-3">{value.title}</h3>
                  <p className="text-on-surface-variant">{value.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">خدماتنا الأساسية</h2>
          <div className="space-y-8">
            {services.map((service, idx) => (
              <div key={idx} className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center bg-surface-white border border-border-light p-8 rounded-xl`}>
                <div className="w-full md:w-1/3 text-5xl text-center">{service.icon}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-on-surface-variant text-lg">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-inverse-surface text-white py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, idx) => {
              const IconComponent = stat.icon
              return (
                <div key={idx}>
                  <IconComponent className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <div className="text-5xl font-bold text-yellow-400 mb-2">{stat.value}</div>
                  <div className="text-lg">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto bg-primary-container p-8 md:p-12 rounded-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-on-primary-container mb-4">كن جزءاً من عالم كارنا اليوم</h2>
          <p className="text-on-primary-container text-lg mb-8">
            سواء كنت بائعاً، مشترياً، أو صاحب ورشة صيانة، كارنا هي وجهتك الأفضل للنمو والنجاح.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/post-ad" className="bg-on-background text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
              أضف إعلانك الآن
            </a>
            <a href="/workshops" className="bg-surface-white text-on-background border border-on-background px-8 py-3 rounded-lg font-bold hover:bg-surface transition-colors">
              انضم كصاحب ورشة
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container border-t border-border-light mt-auto py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="hidden md:flex gap-8 justify-center mb-8 pb-8 border-b border-border-light">
            <a href="/" className="text-on-surface-variant hover:text-primary transition-colors">عن كارنا</a>
            <a href="/contact" className="text-on-surface-variant hover:text-primary transition-colors">اتصل بنا</a>
            <a href="/privacy" className="text-on-surface-variant hover:text-primary transition-colors">سياسة الخصوصية</a>
            <a href="/terms" className="text-on-surface-variant hover:text-primary transition-colors">الشروط والأحكام</a>
          </div>
          <div className="text-center">
            <div className="font-bold text-primary text-lg mb-2">CARNA</div>
            <p className="text-on-surface-variant">© 2026 كارنا - كافة الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
