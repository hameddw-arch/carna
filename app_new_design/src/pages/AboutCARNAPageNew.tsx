import { useEffect, useRef, useState } from 'react'
import { usePageView } from '../hooks/useAnalytics'

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

export default function AboutCARNAPageNew() {
  usePageView('/about')
  const statsRef = useRef<HTMLElement>(null)
  const statsInView = useInView(statsRef)
  const [stats, setStats] = useState([
    { label: 'سيارة مدرجة', value: 0, final: 10000 },
    { label: 'ورشة صيانة مسجلة', value: 0, final: 500 },
    { label: 'مدينة سورية مغطاة', value: 0, final: 20 }
  ])

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

  useEffect(() => {
    if (!statsInView) return

    const timers = stats.map((stat, idx) => {
      let count = 0
      const increment = stat.final / 50
      const interval = setInterval(() => {
        count += increment
        if (count >= stat.final) {
          count = stat.final
          clearInterval(interval)
        }
        setStats(prev => {
          const updated = [...prev]
          updated[idx].value = Math.ceil(count)
          return updated
        })
      }, 20)
      return interval
    })

    return () => timers.forEach(t => clearInterval(t))
  }, [statsInView])

  return (
    <div dir="rtl" className="min-h-screen bg-surface-white dark:bg-background text-on-surface dark:text-on-surface overflow-x-hidden">
      {/* Hero Section */}
      <section
        className="relative h-96 md:h-[614px] flex items-center justify-center text-center px-4 md:px-8 pt-16 md:pt-20 dark:bg-background"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuCNgs-Y8DzWOIL5-dPUP4TnQw4uzxLfnsC7AJBgTUhT4cu1tFAypCAbye94j4gUwDQEioH9TL-VteiuhxcDzUKWwvexkyJqQa7LdV0MxGSHrckvIi1MlEMozj_6R8VcHeb18ZWOaEyqbDQkDPZwV9wdMzaToOl6l2akzZEzigxo-U4MWZI0QcxtpH6HsqQwRo_dzJS8mORQtUwdVSbhcKbzO-cjZwyeUVz2XqBxHLok7kJleLksa0z2QCa41r8qtcv8dmT_DPvbyTwR)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="z-10 max-w-3xl">
          <h1 className="text-white font-bold text-4xl md:text-5xl leading-tight mb-4">
            كارنا... سوق السيارات والورش الأول في سوريا
          </h1>
          <p className="text-yellow-400 font-bold text-lg md:text-xl tracking-widest mb-8">
            كارنا... والكار كارنا
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-accent-yellow text-black px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
              تصفح السوق
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors">
              دليل الورشات
            </button>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 md:py-24 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-yellow-400 mb-6">قصتنا</h2>
            <p className="text-on-surface-variant dark:text-on-surface-variant text-lg leading-relaxed mb-4">
              انطلقت منصة كارنا من قلب السوق السوري لتكون المرجع الأول والشامل لكل ما يخص عالم السيارات. نحن نؤمن بأن عملية بيع وشراء السيارات والبحث عن خدمات الصيانة يجب أن تكون تجربة سهلة، سريعة، وموثوقة.
            </p>
            <p className="text-on-surface-variant dark:text-on-surface-variant text-lg leading-relaxed">
              كارنا ليست مجرد موقع إعلانات، بل هي نظام متكامل يربط بين البائع والمشتري وبين صاحب السيارة وخبراء الصيانة، مع التركيز التام على تلبية احتياجات السوق المحلي بمعايير عالمية.
            </p>
          </div>
          <div className="md:order-1 rounded-xl overflow-hidden border border-border-light dark:border-border-light">
            <img
              alt="Modern car showroom"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzqf7rpKFJb9vq3vzgX74AL8TvbOB-M-bKVOQXr6-ZM-P4Uze8tD_lllkk05QwIDXw3FFaTP4V-43u6P1JdIHBwFcKGYimDaQqj8FaUHAqXdHTVJUCAWDg6XLEuegfFR0lvTWsIUH4oIQ9g0yg7vqb0uXwzHXYWmDZKqOzIIPMAOyuEfWLb5Ses8NopmoflHSXIP946kcjlpeWzMy_pn3FnSaW0aXh_FWnUH3UF4XtwnNkoSXxhQl3ofXlMKjicMkegmZX1lh_MmWq"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="bg-surface-container dark:bg-surface py-12 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-yellow-400 mb-12">مهمتنا</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-surface-white dark:bg-surface-white p-8 rounded-xl border border-border-light dark:border-border-light hover:shadow-lg dark:hover:shadow-xl transition-all">
              <span className="material-symbols-outlined text-5xl text-verification-blue dark:text-yellow-400 flex justify-center mb-4">verified</span>
              <h3 className="font-bold text-lg dark:text-white mb-3">الشفافية</h3>
              <p className="text-on-surface-variant dark:text-on-surface-variant">
                نسعى لترسيخ الصدق في التعامل من خلال أنظمة فحص وتوثيق دقيقة تضمن حقوق الجميع.
              </p>
            </div>
            <div className="bg-surface-white dark:bg-surface-white p-8 rounded-xl border border-border-light dark:border-border-light hover:shadow-lg dark:hover:shadow-xl transition-all">
              <span className="material-symbols-outlined text-5xl text-accent-yellow dark:text-yellow-400 flex justify-center mb-4">bolt</span>
              <h3 className="font-bold text-lg dark:text-white mb-3">السرعة</h3>
              <p className="text-on-surface-variant dark:text-on-surface-variant">
                منصة تقنية متطورة تتيح لك الوصول إلى ما تحتاجه في ثوانٍ معدودة، سواء كان سيارة أحلامك أو ورشة صيانة.
              </p>
            </div>
            <div className="bg-surface-white dark:bg-surface-white p-8 rounded-xl border border-border-light dark:border-border-light hover:shadow-lg dark:hover:shadow-xl transition-all">
              <span className="material-symbols-outlined text-5xl text-primary dark:text-yellow-400 flex justify-center mb-4">handshake</span>
              <h3 className="font-bold text-lg dark:text-white mb-3">الثقة</h3>
              <p className="text-on-surface-variant dark:text-on-surface-variant">
                بناء مجتمع آمن يجمع بين أفضل التجار والورشات الموثوقة في جميع أنحاء سوريا.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-12 md:py-24 px-4 md:px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-yellow-400 mb-12 text-center">خدماتنا الأساسية</h2>
        <div className="space-y-8">
          {/* Service 1 */}
          <div className="flex flex-col md:flex-row gap-8 items-center bg-surface-white dark:bg-surface border border-border-light dark:border-border-light p-8 rounded-xl">
            <div className="w-full md:w-1/3">
              <img
                alt="App marketplace screen"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1bJwRJY2SqPHQ7_-6xyiEFUP-fPjHctDJFoALFtNRHESzNgLwqi811DCs6fvUsXEIXVaqonOtMLbEbFa61XE4ArJ6zGGOpDLttLb-HF-cJKOXkc5Xxkqcn1kJK1UXzz0VnAjvu05SR9vnyuQK6DTwVZ19ZFEHUziGqCidCUvjt9HhUI3y-uv5ewtzKjs8NyLyvogCc0_pdcZg58HqWcAnB-hi_LFen0WU3dSBPUJaoFrLZGVgmc_VGrGsX68C5mLE8Nz6AAvwzH5n"
                className="rounded-lg object-cover h-48 w-full"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-accent-yellow dark:text-yellow-400">directions_car</span>
                سوق السيارات
              </h3>
              <p className="text-on-surface-variant dark:text-on-surface-variant text-lg">
                أكبر تجمع للسيارات المستعملة والجديدة في سوريا. تصفية ذكية، بحث متقدم، وإضافة إعلانات بسهولة تامة لتصل إلى آلاف المشترين المحتملين.
              </p>
            </div>
          </div>

          {/* Service 2 */}
          <div className="flex flex-col md:flex-row-reverse gap-8 items-center bg-surface-white dark:bg-surface border border-border-light dark:border-border-light p-8 rounded-xl">
            <div className="w-full md:w-1/3">
              <img
                alt="Car repair workshop"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNDwEqkjTXw2XOXH1ddOFeGWuHC7h58hL5jr2GZecQHKBQdW2Du6rx0eSWxBFG1bmgPZQ177iQXbsoz8tPluD_EZANwSuG2kVf3j6SSgj6oFXyas_qHMLZ0XEd2x6sSahSoIy4CDK0UIaQE8gQPezrIbqNz7sWmRlaG2NbMtbB2oC-mCYsCCKP0Pdfm6g0PElmDKuSSrkiQiqJS7hTxnz6vQUKY6xayOyainPCzS11eSVLMRK4HoPsRskc1npn62f7q8A7YkBjMT5t"
                className="rounded-lg object-cover h-48 w-full"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-accent-yellow dark:text-yellow-400">handyman</span>
                دليل الورشات
              </h3>
              <p className="text-on-surface-variant dark:text-on-surface-variant text-lg">
                لا مزيد من الحيرة عند تعطل سيارتك. ابحث عن أفضل مراكز الصيانة والورشات المتخصصة بالقرب منك، مع تقييمات حقيقية من المستخدمين.
              </p>
            </div>
          </div>

          {/* Service 3 */}
          <div className="flex flex-col md:flex-row gap-8 items-center bg-surface-white dark:bg-surface border border-border-light dark:border-border-light p-8 rounded-xl">
            <div className="w-full md:w-1/3">
              <img
                alt="Inspection document"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtiUf-sX-Tf2Op7uLkpd61Bu-Q82RL7bfMrk2NNTuD6QhUM4JeZ-_nUQWSI81E_3_SRpV9_QxRkJTIwcpW4DBO9101IxSYGsbw7T8gzOtyg2GptKdhsmG5OeT5qoDaqu2BUTBHBcYm92o6KK2JektlXrhy5CA2bhczmHNsO07McfvBO5hwX2jgMkE_wm2-AKzb3qcx5NuGCgFJ0-p0i_JhZt8iHtLs6r1cjOVoJ-9OacUYS2VKfzqfESFs4QhltUoB0CRuxBFYWpta"
                className="rounded-lg object-cover h-48 w-full"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-accent-yellow dark:text-yellow-400">description</span>
                الشفافية والتوثيق
              </h3>
              <p className="text-on-surface-variant dark:text-on-surface-variant text-lg">
                نقدم أنظمة فحص معتمدة تساعدك على معرفة الحالة الحقيقية للسيارة قبل الشراء، مما يقلل المخاطر ويضمن راحة بالك.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="bg-inverse-surface dark:bg-background text-white py-12 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <div className="text-5xl font-bold text-yellow-400 mb-4">+{stat.value.toLocaleString()}</div>
                <div className="text-lg dark:text-on-surface-variant">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 px-4 md:px-8">
        <div className="bg-primary-container dark:bg-yellow-600 p-8 md:p-12 rounded-2xl max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-on-primary-container dark:text-white mb-4">
            كن جزءاً من عالم كارنا اليوم
          </h2>
          <p className="text-on-primary-container dark:text-on-surface text-lg mb-8">
            سواء كنت بائعاً، مشترياً، أو صاحب ورشة صيانة، كارنا هي وجهتك الأفضل للنمو والنجاح.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-on-background dark:bg-surface text-white dark:text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
              أضف إعلانك الآن
            </button>
            <button className="bg-surface-white dark:bg-slate-100 text-on-background dark:text-black border border-on-background dark:border-slate-300 px-8 py-3 rounded-lg font-bold hover:bg-surface dark:hover:bg-slate-200 transition-colors">
              انضم كصاحب ورشة
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
