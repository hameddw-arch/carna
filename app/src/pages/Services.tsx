import { useState, useEffect } from 'react'
import { MapPin, Star, Phone, Shield } from 'lucide-react'
import { fetchServices } from '../lib/queries'

const CATEGORIES = ['الكل', 'ميكانيك', 'كهرباء وبرمجة', 'تجليس ودهان', 'عناية سريعة', 'فحص فني']

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('الكل')
  const [services,       setServices]       = useState<any[]>([])

  useEffect(() => {
    fetchServices(activeCategory)
      .then(setServices)
  }, [activeCategory])

  const filtered = services

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px 60px' }}>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>ورشات وخدمات السيارات</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>ناس بتعرف شغلها</p>
      </div>

      {/* Inspection Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        borderRadius: 16, padding: '24px 28px', marginBottom: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ fontSize: 40 }}>🔍</div>
          <div>
            <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
              فحص فني قبل الشراء
            </h2>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 14 }}>
              تأكد قبل ما تدفع — مراكز معتمدة في كل المحافظات
            </p>
          </div>
        </div>
        <button className="btn-primary" style={{ fontSize: 14 }}>
          ابحث عن مركز فحص
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`tag ${activeCategory === cat ? 'active' : ''}`}
            style={{ fontSize: 14, padding: '7px 16px' }}
          >
            {cat === 'فحص فني' ? `${cat} 🔍` : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {services.map(service => (
          <div key={service.id} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>{service.name}</h3>
                  {service.verified && (
                    <Shield size={14} style={{ color: 'var(--color-blue)', flexShrink: 0 }} />
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                  <MapPin size={12} /> {service.city}
                </div>
              </div>
              {service.inspection && (
                <span style={{
                  background: 'var(--yellow-50)', color: '#92400e',
                  border: '1px solid var(--yellow-100)',
                  fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 9999,
                }}>
                  فحص فني ✓
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={13}
                  fill={s <= Math.round(service.rating) ? 'var(--color-yellow)' : 'none'}
                  color={s <= Math.round(service.rating) ? 'var(--color-yellow)' : 'var(--color-gray)'}
                />
              ))}
              <span style={{ fontSize: 13, fontWeight: 700, marginRight: 4 }}>{service.rating}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>({service.reviews} تقييم)</span>
            </div>

            <span style={{ display: 'inline-block', background: 'var(--bg-subtle)', fontSize: 12, padding: '3px 10px', borderRadius: 9999, marginBottom: 16 }}>
              {service.category}
            </span>

            <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: 14 }}>
              <Phone size={14} />
              اتصل الآن
            </button>
          </div>
        ))}
      </div>

      {/* Add workshop CTA */}
      <div style={{ textAlign: 'center', marginTop: 48, padding: '32px 20px', background: 'var(--bg-subtle)', borderRadius: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>عندك ورشة؟</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>سجّل ورشتك على كارنا واوصل لآلاف العملاء</p>
        <button className="btn-primary">سجّل ورشتك</button>
      </div>
    </main>
  )
}
