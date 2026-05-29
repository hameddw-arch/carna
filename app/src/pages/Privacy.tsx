import SEO from '../components/SEO'

export default function Privacy() {
  return (
    <main style={{ flex: 1, background: 'var(--off-white)' }}>
      <SEO title="إخلاء المسؤولية والخصوصية" url="/privacy"/>
      <div className="container" style={{ padding: '48px 24px 80px', maxWidth: 760 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>إخلاء المسؤولية والخصوصية</h1>
        <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 36 }}>آخر تحديث: {new Date().toLocaleDateString('ar-SY')}</p>

        {[
          { title: 'إخلاء المسؤولية', body: 'كارنا منصة وسيطة للعرض فقط. لا تتحمل كارنا أي مسؤولية قانونية أو مالية عن أي صفقة تتم بين البائع والمشتري، أو عن أي خسارة ناجمة عن الاعتماد على المعلومات المنشورة في الإعلانات.' },
          { title: 'البيانات التي نجمعها', body: 'نجمع: رقم الهاتف عند التسجيل، الإعلانات التي تنشرها، عمليات البحث وتصفح الموقع (للإحصاء). لا نجمع أي بيانات دفع مباشرة.' },
          { title: 'استخدام البيانات', body: 'تُستخدم البيانات لتشغيل الموقع، وإرسال إشعارات تخص إعلاناتك، وتحسين تجربة الاستخدام. لا نبيع بياناتك لأي طرف ثالث.' },
          { title: 'حماية البيانات', body: 'تُخزَّن بياناتك بأمان على خوادم Supabase (PostgreSQL) مع تشفير كامل. الاتصال محمي بـ SSL/TLS عبر Cloudflare.' },
          { title: 'ملفات تعريف الارتباط (Cookies)', body: 'نستخدم Cookies الضرورية للجلسة فقط. لا نستخدم Cookies إعلانية أو تتبعية.' },
          { title: 'حقوق المستخدم', body: 'يحق لك طلب حذف حسابك وجميع بياناتك في أي وقت عبر التواصل معنا على: info@carna.online' },
        ].map(s => (
          <div key={s.title} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>{s.title}</h2>
            <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.8 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
