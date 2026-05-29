import { useState, useEffect } from 'react'
import { MapPin, Phone, Shield, Clock, ChevronRight, CheckCircle, Loader2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { fetchService } from '../lib/queries'

export default function ServicePage() {
  const { id } = useParams()
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetchService(id).then(data => { setService(data); setLoading(false) })
  }, [id])

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
      <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-4)' }}/>
    </div>
  )
  if (!service) return null

  const tier = service.subscription_tier ?? 'free'
  const tierColor: Record<string, string> = { premium: '#D97706', basic: '#0053FA', free: '#6B7280' }
  const tColor = tierColor[tier]

  const serviceTypes: string[] = service.service_types ?? []

  return (
    <main style={{ flex: 1, background: 'var(--off-white)' }}>

      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--gray-200)', padding: '12px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-4)' }}>
          <Link to="/" style={{ color: 'var(--blue)', textDecoration: 'none' }}>الرئيسية</Link>
          <ChevronRight size={12}/>
          <Link to="/services" style={{ color: 'var(--blue)', textDecoration: 'none' }}>الورشات</Link>
          <ChevronRight size={12}/>
          <span style={{ color: 'var(--text)' }}>{service.name}</span>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' }} className="main-grid">

          {/* ── LEFT — main info ─────────────────────── */}
          <div>

            {/* Header card */}
            <div style={{
              background: '#fff', borderRadius: 20, padding: '28px',
              border: tier === 'premium' ? '2px solid #F59E0B' : '1px solid var(--gray-200)',
              marginBottom: 20, boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 20 }}>

                {/* Logo */}
                <div style={{
                  width: 72, height: 72, borderRadius: 16, flexShrink: 0,
                  background: service.logo_url ? '#fff' : tColor + '18',
                  border: `2px solid ${tColor}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 800, color: tColor, overflow: 'hidden',
                }}>
                  {service.logo_url
                    ? <img src={service.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    : (service.name?.[0] ?? '🔧')
                  }
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                    <h1 style={{ fontSize: 22, fontWeight: 900 }}>{service.name}</h1>
                    {service.verified && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#EFF6FF', color: '#0053FA', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--r-full)' }}>
                        <Shield size={12}/> معتمد
                      </span>
                    )}
                    {tier !== 'free' && (
                      <span style={{ background: tier === 'premium' ? '#FEF3C7' : '#EFF6FF', color: tColor, fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--r-full)' }}>
                        {tier === 'premium' ? '🏆 مميز' : '🔵 أساسي'}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 14, color: 'var(--text-3)' }}>
                    <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                      <MapPin size={13}/> {service.city}
                    </span>
                    {service.opening_hours && (
                      <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                        <Clock size={13}/> {service.opening_hours}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 24, padding: '16px 0', borderTop: '1px solid var(--gray-100)', borderBottom: '1px solid var(--gray-100)', marginBottom: 20 }}>
                <Stat label="التقييم" value={service.rating > 0 ? `${service.rating} ⭐` : 'لا يوجد'}/>
                <Stat label="عدد التقييمات" value={service.reviews > 0 ? service.reviews : '—'}/>
                <Stat label="فحوصات منجزة" value={service.inspections_count > 0 ? `${service.inspections_count}+` : '—'}/>
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {service.inspection && (
                  <span style={{ background: '#ECFDF5', color: '#065F46', fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 'var(--r-full)', border: '1px solid #A7F3D0' }}>
                    🔍 يقدّم فحص ما قبل الشراء
                  </span>
                )}
                {service.category && (
                  <span style={{ background: 'var(--gray-100)', color: 'var(--text-2)', fontSize: 12, padding: '5px 12px', borderRadius: 'var(--r-full)' }}>
                    {service.category}
                  </span>
                )}
              </div>
            </div>

            {/* Services offered */}
            {serviceTypes.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 20, padding: '24px', border: '1px solid var(--gray-200)', marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 18 }}>الخدمات المقدّمة</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                  {serviceTypes.map((s: string) => (
                    <div key={s} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 14px', background: 'var(--gray-100)', borderRadius: 10 }}>
                      <CheckCircle size={14} style={{ color: 'var(--yellow-dark)', flexShrink: 0 }}/>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {service.description && (
              <div style={{ background: '#fff', borderRadius: 20, padding: '24px', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 12 }}>عن الورشة</h2>
                <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.8 }}>{service.description}</p>
              </div>
            )}
          </div>

          {/* ── RIGHT — sticky contact card ──────────── */}
          <aside style={{ position: 'sticky', top: 80 }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: '24px', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-md)' }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 20 }}>تواصل مع الورشة</h3>

              {/* Phone */}
              {service.phone && (
                <a href={`tel:${service.phone}`} className="btn btn-dark"
                  style={{ width: '100%', justifyContent: 'center', fontSize: 15, marginBottom: 10, gap: 8 }}>
                  <Phone size={16}/> {service.phone}
                </a>
              )}

              {/* WhatsApp */}
              {service.whatsapp && (
                <a href={`https://wa.me/${service.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="btn" style={{
                    width: '100%', justifyContent: 'center', fontSize: 15,
                    background: '#25D366', color: '#fff', border: 'none', gap: 8,
                  }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.198.592 4.255 1.623 6.02L0 24l6.168-1.601A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.374l-.36-.213-3.66.95.975-3.565-.233-.371A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/></svg>
                  واتساب
                </a>
              )}

              <div style={{ height: 1, background: 'var(--gray-100)', margin: '18px 0' }}/>

              {/* Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {service.address && (
                  <div style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--text-2)' }}>
                    <MapPin size={14} style={{ flexShrink: 0, marginTop: 1, color: 'var(--text-4)' }}/>
                    {service.address}
                  </div>
                )}
                {service.opening_hours && (
                  <div style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--text-2)' }}>
                    <Clock size={14} style={{ flexShrink: 0, marginTop: 1, color: 'var(--text-4)' }}/>
                    {service.opening_hours}
                  </div>
                )}
              </div>

              {/* Inspection note */}
              {service.inspection && (
                <div style={{
                  marginTop: 18, background: '#ECFDF5', border: '1px solid #A7F3D0',
                  borderRadius: 12, padding: '12px 14px', fontSize: 13, color: '#065F46', lineHeight: 1.6,
                }}>
                  <strong>🔍 فحص ما قبل الشراء:</strong> هذه الورشة تقدّم خدمة الفحص الفني قبل شراء السيارة — تواصل معهم مباشرة لتحديد موعد.
                </div>
              )}
            </div>

            {/* Back link */}
            <Link to="/services" style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: 13, color: 'var(--text-4)', textDecoration: 'none' }}>
              ← العودة لقائمة الورشات
            </Link>
          </aside>
        </div>
      </div>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 2 }}>{label}</div>
    </div>
  )
}
