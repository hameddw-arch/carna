import { Mail, MessageCircle } from 'lucide-react'
import SEO from '../components/SEO'

export default function Contact() {
  return (
    <main style={{ flex: 1, background: 'var(--off-white)' }}>
      <SEO title="اتصل بنا" url="/contact"/>
      <div className="container" style={{ padding: '48px 24px 80px', maxWidth: 640 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>اتصل بنا</h1>
        <p style={{ color: 'var(--text-3)', fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
          فريق كارنا جاهز للمساعدة — سواء كان لديك استفسار أو مشكلة تقنية أو تريد تسجيل ورشتك.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ContactCard
            icon={<Mail size={20}/>}
            title="البريد الإلكتروني"
            value="info@carna.online"
            href="mailto:info@carna.online"
            color="#2196F3"
          />
          <ContactCard
            icon={<MessageCircle size={20}/>}
            title="واتساب (للورشات والاستفسارات التجارية)"
            value="تواصل عبر واتساب"
            href="https://wa.me/963000000000"
            color="#25D366"
          />
        </div>

        <div style={{ marginTop: 40, background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid var(--gray-200)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>أوقات الدعم</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, color: 'var(--text-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>السبت — الخميس</span>
              <span style={{ fontWeight: 700 }}>9:00 ص — 9:00 م</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>الجمعة</span>
              <span style={{ fontWeight: 700, color: 'var(--text-4)' }}>مغلق</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, background: 'var(--yellow-light)', borderRadius: 16, padding: '20px 24px', border: '1px solid var(--yellow)' }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>تسجيل ورشة أو مركز خدمة؟</div>
          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>
            أرسل بريداً على info@carna.online باسم الورشة، المدينة، ورقم التواصل — وسيتم التواصل معك خلال 24 ساعة.
          </p>
        </div>
      </div>
    </main>
  )
}

function ContactCard({ icon, title, value, href, color }: { icon: React.ReactNode; title: string; value: string; href: string; color: string }) {
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        background: '#fff', borderRadius: 16, padding: '16px 20px',
        border: '1.5px solid var(--gray-200)', textDecoration: 'none',
        transition: 'all 200ms ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 4px 16px ${color}20` }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 12, color: 'var(--text-4)', marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{value}</div>
      </div>
    </a>
  )
}
