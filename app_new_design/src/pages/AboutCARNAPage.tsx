import { useEffect, useRef, useState } from 'react'
import { usePageView } from '../hooks/useAnalytics'
import { Eye, Users, TrendingUp, CheckCircle, Zap, Handshake, ShoppingCart, Wrench, FileCheck } from 'lucide-react'

function useInView(ref: React.RefObject<HTMLElement | null>, options = { threshold: 0.1 }) {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        observer.unobserve(entry.target)
      }
    }, options)

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref, options])

  return isInView
}

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
      icon: ShoppingCart
    },
    {
      title: 'دليل الورشات',
      desc: 'لا مزيد من الحيرة عند تعطل سيارتك. ابحث عن أفضل مراكز الصيانة والورشات المتخصصة بالقرب منك',
      icon: Wrench
    },
    {
      title: 'الشفافية والتوثيق',
      desc: 'نقدم أنظمة فحص معتمدة تساعدك على معرفة الحالة الحقيقية للسيارة قبل الشراء',
      icon: FileCheck
    }
  ]

  const storyRef = useRef<HTMLElement>(null)
  const missionRef = useRef<HTMLElement>(null)
  const servicesRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLElement>(null)

  const storyInView = useInView(storyRef)
  const missionInView = useInView(missionRef)
  const servicesInView = useInView(servicesRef)
  const statsInView = useInView(statsRef)

  return (
    <div dir="rtl" className="min-h-screen bg-surface dark:bg-slate-950 text-on-surface dark:text-slate-50 overflow-x-hidden transition-colors duration-300">

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-in {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>

      {/* Hero Section */}
      <section
        className="relative h-96 md:h-[614px] flex items-center justify-center text-center px-4 md:px-8 pt-16 md:pt-20 dark:bg-slate-900"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#1a1c1c'
        }}
      >
        <div className="z-10 max-w-3xl animate-fade-in">
          <h1 className="text-white font-bold text-4xl md:text-5xl leading-tight mb-4">
            كارنا... سوق السيارات والورش الأول في سوريا
          </h1>
          <p className="text-yellow-400 font-bold text-lg md:text-xl tracking-wider mb-8">
            كارنا... والكار كارنا
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/browse"
              className="bg-yellow-400 dark:bg-yellow-500 text-black px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
      <section ref={storyRef} className="py-16 md:py-24 px-4 md:px-8 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className={`grid md:grid-cols-2 gap-12 items-center ${storyInView ? 'animate-in' : 'opacity-0'}`}>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-yellow-400 mb-6">قصتنا</h2>
              <p className="text-on-surface-variant dark:text-slate-300 text-lg leading-relaxed mb-4">
                انطلقت منصة كارنا من قلب السوق السوري لتكون المرجع الأول والشامل لكل ما يخص عالم السيارات. نحن نؤمن بأن عملية بيع وشراء السيارات والبحث عن خدمات الصيانة يجب أن تكون تجربة سهلة، سريعة، وموثوقة.
              </p>
              <p className="text-on-surface-variant dark:text-slate-300 text-lg leading-relaxed">
                كارنا ليست مجرد موقع إعلانات، بل هي نظام متكامل يربط بين البائع والمشتري وبين صاحب السيارة وخبراء الصيانة، مع التركيز التام على تلبية احتياجات السوق المحلي بمعايير عالمية.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden border border-border-light dark:border-slate-700 h-80 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRe7Pmv-uausgCO9nVynpcVDrV1nvpTH9hX9k_Zlxkm3etuHtRPblF3Ne-3MpVf-rRsbGSj-uk8jdArl1JFPsEV_SdqL2nzQdf7DbXz68Xh7-x-GQ2jE9C1TdlU84D-iNF3RNeKFNT1aUsfCPcro4QByXeTaXiuakagbby-NoU1oeF1kUqQStZWoUKJCY0MgJ464tAVRK7G8098f9E7HbWOCnwRyH5vxPCJT0QfHBKgxvdiDAB6ZOBjaLzaZZWLK4-7LPy9OYPNMvE"
                alt="سيارة سيدان حديثة"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section ref={missionRef} className="bg-surface-container dark:bg-slate-800 py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-yellow-400 mb-12">مهمتنا</h2>
          <div className={`grid md:grid-cols-3 gap-8 ${missionInView ? 'animate-in' : 'opacity-0'}`}>
            {values.map((value, idx) => {
              const IconComponent = value.icon
              return (
                <div
                  key={idx}
                  className="bg-surface-white dark:bg-slate-700 p-8 rounded-xl border border-border-light dark:border-slate-600 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <IconComponent className="w-12 h-12 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
                  <h3 className="font-bold text-lg dark:text-white mb-3">{value.title}</h3>
                  <p className="text-on-surface-variant dark:text-slate-300">{value.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-16 md:py-24 px-4 md:px-8 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-yellow-400 mb-12 text-center">خدماتنا الأساسية</h2>
          <div className="space-y-8">
            {services.map((service, idx) => {
              const IconComponent = service.icon
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center bg-surface-white dark:bg-slate-800 border border-border-light dark:border-slate-700 p-8 rounded-xl ${
                    servicesInView ? 'animate-in' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="flex-shrink-0 md:w-1/4 flex justify-center">
                    <IconComponent className="w-16 h-16 text-primary dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold dark:text-white mb-4">{service.title}</h3>
                    <p className="text-on-surface-variant dark:text-slate-300 text-lg">{service.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section ref={statsRef} className="bg-inverse-surface dark:bg-slate-950 text-white py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 text-center ${statsInView ? 'animate-in' : 'opacity-0'}`}>
            {stats.map((stat, idx) => {
              const IconComponent = stat.icon
              return (
                <div key={idx} style={{ animationDelay: `${idx * 100}ms` }}>
                  <IconComponent className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <div className="text-5xl font-bold text-yellow-400 mb-2">{stat.value}</div>
                  <div className="text-lg dark:text-slate-300">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto bg-primary-container dark:bg-yellow-600 p-8 md:p-12 rounded-2xl text-center animate-in">
          <h2 className="text-3xl md:text-4xl font-bold text-on-primary-container dark:text-white mb-4">كن جزءاً من عالم كارنا اليوم</h2>
          <p className="text-on-primary-container dark:text-slate-100 text-lg mb-8">
            سواء كنت بائعاً، مشترياً، أو صاحب ورشة صيانة، كارنا هي وجهتك الأفضل للنمو والنجاح.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/post-ad" className="bg-on-background dark:bg-slate-800 text-white dark:text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
              أضف إعلانك الآن
            </a>
            <a href="/workshops" className="bg-surface-white dark:bg-slate-100 text-on-background dark:text-black border border-on-background dark:border-slate-300 px-8 py-3 rounded-lg font-bold hover:bg-surface dark:hover:bg-slate-200 transition-colors">
              انضم كصاحب ورشة
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container dark:bg-slate-900 border-t border-border-light dark:border-slate-700 mt-auto py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="hidden md:flex gap-8 justify-center mb-8 pb-8 border-b border-border-light dark:border-slate-700">
            <a href="/" className="text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-yellow-400 transition-colors">عن كارنا</a>
            <a href="/contact" className="text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-yellow-400 transition-colors">اتصل بنا</a>
            <a href="/privacy" className="text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-yellow-400 transition-colors">سياسة الخصوصية</a>
            <a href="/terms" className="text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-yellow-400 transition-colors">الشروط والأحكام</a>
          </div>
          <div className="text-center">
            <div className="font-bold text-primary dark:text-yellow-400 text-lg mb-2">CARNA</div>
            <p className="text-on-surface-variant dark:text-slate-400">© 2026 كارنا - كافة الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
