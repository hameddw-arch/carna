import SEO from '../components/SEO'
import { Link } from 'react-router-dom';

export default function Privacy() {
  const privacyPoints = [
    { title: '1. جمع البيانات', body: 'نجمع فقط البيانات الضرورية لتشغيل المنصة: (الاسم، رقم الهاتف، والبريد الإلكتروني إن وجد). رقم هاتفك يظل محمياً ولا يظهر للعموم إلا عند موافقتك الصريحة أو من خلال قنوات تواصل آمنة.' },
    { title: '2. استخدام البيانات', body: 'تُستخدم بياناتك لتسهيل تواصلك مع المشترين/البائعين، ولتزويدك بإشعارات تخص إعلاناتك. لا نقوم ببيع بياناتك لأي طرف ثالث.' },
    { title: '3. حماية البيانات', body: 'نستخدم بروتوكولات تشفير قياسية لحماية بيانات حسابك وعمليات محفظتك من الوصول غير المصرح به.' },
    { title: '4. ملفات الارتباط (Cookies)', body: 'نستخدم الكوكيز فقط للحفاظ على تسجيل دخولك وتحسين تجربة التصفح وحفظ تفضيلاتك (مثل الوضع الداكن).' },
    { title: '5. حذف الحساب', body: 'يمكنك طلب حذف حسابك وكافة بياناتك وإعلاناتك في أي وقت عبر التواصل مع الدعم الفني، وسيتم الحذف خلال 7 أيام عمل.' }
  ];

  return (
    <main className="bg-background text-on-surface min-h-screen rtl flex flex-col">
      <SEO title="سياسة الخصوصية" url="/privacy"/>
      
      {/* Header Pattern Background */}
      <div className="bg-surface-bright border-b border-border-light relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-verification-blue/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-16 relative z-10 text-center">
          <h1 className="font-display-lg text-display-lg font-black text-text-primary mb-sm">سياسة الخصوصية</h1>
          <p className="font-body-lg text-body-lg text-text-muted">نحن في كارنا نلتزم بحماية بياناتك وخصوصيتك بأعلى المعايير.</p>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <div className="flat-card p-lg space-y-xl">
          {privacyPoints.map((point) => (
            <div key={point.title}>
              <h2 className="font-headline-sm text-headline-sm font-bold text-text-primary mb-sm border-r-4 border-verification-blue pr-sm">{point.title}</h2>
              <p className="font-body-md text-body-md text-text-muted leading-relaxed">{point.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-xl text-center pb-xl">
          <p className="font-body-md text-body-md text-text-muted mb-md">للمزيد من المعلومات حول كيفية معالجة بياناتك</p>
          <Link to="/contact" className="inline-block bg-surface-container-high text-on-surface px-lg py-sm rounded-lg font-label-lg transition-all hover:brightness-95 active:scale-95">الدعم الفني</Link>
        </div>
      </div>
    </main>
  );
}
