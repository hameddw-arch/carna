import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--dark)',
      color: 'rgba(255,255,255,.5)',
      padding: '48px 24px 28px',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 36, marginBottom: 40 }}>

          {/* Brand */}
          <div>
            <img src="/logo.svg" alt="CARNA" style={{ height: 34, marginBottom: 14, filter: 'brightness(0) invert(1)' }}/>
            <p style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 12 }}>
              سيارتك الجاية — هون.<br/>
              منصة إعلانات السيارات السورية.
            </p>
            <a href="mailto:info@carna.online" style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', textDecoration: 'none' }}>
              info@carna.online
            </a>
          </div>

          {/* Site */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 14 }}>الموقع</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['/', 'الرئيسية'],
                ['/services', 'الورشات'],
                ['/packages', 'الإعلانات المميزة'],
                ['/post', 'أضف إعلانك'],
              ].map(([to, label]) => (
                <Link key={to} to={to} style={{ color: 'rgba(255,255,255,.55)', textDecoration: 'none', fontSize: 14, transition: 'color 150ms' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.55)')}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 14 }}>قانوني</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['/terms',   'شروط الاستخدام'],
                ['/privacy', 'إخلاء المسؤولية والخصوصية'],
                ['/contact', 'اتصل بنا'],
              ].map(([to, label]) => (
                <Link key={to} to={to} style={{ color: 'rgba(255,255,255,.55)', textDecoration: 'none', fontSize: 14, transition: 'color 150ms' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.55)')}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* App */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 14 }}>التطبيق</h4>
            <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>
              أضف كارنا لشاشتك الرئيسية من متصفحك للوصول الأسرع
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)',
              borderRadius: 10, padding: '8px 14px', fontSize: 13, color: 'var(--yellow)',
            }}>
              📱 PWA — متاح الآن
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,.08)',
          paddingTop: 22,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontSize: 13 }}>كارنا... والكار كارنا 🚗</span>
          <span style={{ fontSize: 13 }}>© {new Date().getFullYear()} CARNA — جميع الحقوق محفوظة</span>
        </div>
      </div>
    </footer>
  )
}
