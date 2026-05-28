import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: '#1A1A1A',
      color: 'rgba(255,255,255,.6)',
      padding: '40px 20px 24px',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 32 }}>

          {/* Brand */}
          <div>
            <img src="/logo-white.svg" alt="CARNA" style={{ height: 32, marginBottom: 12 }} />
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>
              سيارتك الجاية — هون.<br />
              منصة إعلانات السيارات السورية.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>الموقع</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['/', 'الرئيسية'], ['/services', 'الورشات'], ['/post', 'أضف إعلانك']].map(([to, label]) => (
                <Link key={to} to={to} style={{ color: 'rgba(255,255,255,.6)', textDecoration: 'none', fontSize: 14 }}>{label}</Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>قانوني</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['#', 'شروط الاستخدام'], ['#', 'إخلاء المسؤولية'], ['#', 'سياسة الخصوصية']].map(([to, label]) => (
                <a key={label} href={to} style={{ color: 'rgba(255,255,255,.6)', textDecoration: 'none', fontSize: 14 }}>{label}</a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13 }}>كارنا... والكار كارنا</span>
          <span style={{ fontSize: 13 }}>© 2026 CARNA</span>
        </div>
      </div>
    </footer>
  )
}
