import { useState, useEffect } from 'react'
import { MapPin, Phone, Shield, ChevronDown, CheckCircle, Zap, Award, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchServices } from '../lib/queries'

const CITIES = ['كل المدن','دمشق','ريف دمشق','حلب','اللاذقية','طرطوس','حماة','حمص','دير الزور','الرقة','درعا','السويداء','إدلب','القنيطرة','الحسكة']
const CATEGORIES = ['الكل','فحص فني','ميكانيك','كهرباء وبرمجة','تجليس ودهان','عناية سريعة','تصليح هيكل']
const SORT_OPTIONS = [
  { val: 'rating',      label: 'الأعلى تقييماً' },
  { val: 'inspections', label: 'الأكثر فحصاً' },
  { val: 'newest',      label: 'الأحدث' },
]

const TIERS = [
  {
    key: 'free',
    name: 'مجاني',
    price: '0',
    color: '#6B7280',
    bg: '#F9FAFB',
    features: ['الاسم والعنوان', 'رقم الهاتف', 'المحافظة', 'ظهور في القائمة العامة'],
    cta: 'ابدأ مجاناً',
  },
  {
    key: 'basic',
    name: 'أساسي',
    price: 'تواصل معنا',
    color: '#0053FA',
    bg: '#EFF6FF',
    badge: '🔵 أساسي',
    features: ['كل المجاني +', 'شعار الورشة', 'قائمة الخدمات المفصّلة', 'ساعات العمل', 'واتساب مباشر', 'ظهور في نتائج البحث'],
    cta: 'اشترك الآن',
  },
  {
    key: 'premium',
    name: 'مميز',
    price: 'تواصل معنا',
    color: '#D97706',
    bg: '#FFFBEB',
    badge: '🏆 موصى به',
    highlight: true,
    features: ['كل الأساسي +', 'تصدّر القائمة دائماً', 'شارة "موصى به" ذهبية', 'إعلان بارز في صفحة الورشات', 'عداد الفحوصات المنجزة', 'تقرير أداء شهري'],
    cta: 'احصل على مميز',
  },
]

export default function Services() {
  const [category, setCategory] = useState('الكل')
  const [city,     setCity]     = useState('كل المدن')
  const [sortBy,   setSortBy]   = useState<'rating'|'inspections'|'newest'>('rating')
  const [services, setServices] = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [showInspectionOnly, setShowInspectionOnly] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchServices({ category, city, sortBy })
      .then(data => {
        setServices(showInspectionOnly ? data.filter(s => s.inspection) : data)
        setLoading(false)
      })
  }, [category, city, sortBy, showInspectionOnly])

  const premiumServices  = services.filter(s => s.subscription_tier === 'premium')
  const regularServices  = services.filter(s => s.subscription_tier !== 'premium')

  return (
    <main style={{ flex: 1, background: 'var(--off-white)' }}>

      {/* ── HERO ─────────────────────────────────────── */}
      <div style={{ background: 'var(--dark)', padding: '48px 24px 40px' }}>
        <div className="container">
          <div style={{ maxWidth: 620 }}>
            <div style={{
              display: 'inline-flex', gap: 8, alignItems: 'center',
              color: 'var(--yellow)', fontSize: 11, fontWeight: 700,
              letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 14,
            }}>
              <Shield size={13}/> ورشات وخدمات معتمدة
            </div>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, color: '#fff', marginBottom: 10, lineHeight: 1.2 }}>
              ناس بتعرف شغلها
            </h1>
            <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 15, lineHeight: 1.7 }}>
              ورشات وخدمات معتمدة في كل المحافظات — فحص فني، صيانة، كهرباء، دهان والمزيد
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, marginTop: 28, flexWrap: 'wrap' }}>
            {[
              { n: `${services.length || '50'}+`, l: 'ورشة مسجّلة' },
              { n: '14',  l: 'محافظة' },
              { n: `${services.reduce((s,w) => s + (w.inspections_count || 0), 0) || '200'}+`, l: 'فحص منجز' },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--yellow)', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── INSPECTION BANNER ────────────────────────── */}
      <div style={{ background: 'linear-gradient(100deg, #0f2744, #1a3a6a)', borderBottom: '2px solid var(--yellow)' }}>
        <div className="container" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ fontSize: 32 }}>🔍</div>
            <div>
              <div style={{ color: '#fff', fontSize: 16, fontWeight: 800, marginBottom: 2 }}>
                فحص فني قبل الشراء
              </div>
              <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 13 }}>
                ما تشتري سيارة بدون فحص — مراكز معتمدة في كل المحافظات
              </div>
            </div>
          </div>
          <button
            className="btn btn-yellow"
            onClick={() => { setCategory('فحص فني'); setShowInspectionOnly(true) }}
            style={{ fontSize: 14, flexShrink: 0 }}>
            ابحث عن مركز فحص
          </button>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px 64px' }}>

        {/* ── SUBSCRIPTION TIERS ───────────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}>للورشات</div>
            <h2 className="section-title">سجّل ورشتك — اختر الباقة</h2>
            <p className="section-sub">اوصل لآلاف العملاء في منطقتك</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {TIERS.map(tier => (
              <div key={tier.key} style={{
                background: tier.highlight ? 'var(--dark)' : '#fff',
                border: `2px solid ${tier.highlight ? 'var(--yellow)' : 'var(--gray-200)'}`,
                borderRadius: 20, padding: '28px 24px',
                position: 'relative', overflow: 'hidden',
                boxShadow: tier.highlight ? 'var(--shadow-yellow)' : 'var(--shadow-sm)',
              }}>
                {tier.highlight && (
                  <div style={{
                    position: 'absolute', top: 16, left: 16,
                    background: 'var(--yellow)', color: 'var(--dark)',
                    fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 'var(--r-full)',
                  }}>الأكثر طلباً</div>
                )}
                <div style={{ fontSize: 13, fontWeight: 800, color: tier.highlight ? 'var(--yellow)' : tier.color, marginBottom: 6, marginTop: tier.highlight ? 24 : 0 }}>
                  {tier.name}
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: tier.highlight ? '#fff' : 'var(--text)', marginBottom: 20 }}>
                  {tier.price === '0' ? 'مجاني' : tier.price}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {tier.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <CheckCircle size={14} style={{ color: tier.highlight ? 'var(--yellow)' : tier.color, flexShrink: 0, marginTop: 2 }}/>
                      <span style={{ fontSize: 13, color: tier.highlight ? 'rgba(255,255,255,.75)' : 'var(--text-2)', lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button className={`btn ${tier.highlight ? 'btn-yellow' : 'btn-outline'}`}
                  style={{ width: '100%', fontSize: 14 }}>
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── FILTERS ──────────────────────────────────── */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: '16px 20px',
          border: '1px solid var(--gray-200)', marginBottom: 28,
          display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {/* Category chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
            {CATEGORIES.map(cat => (
              <button key={cat}
                onClick={() => setCategory(cat)}
                className={`tag ${category === cat ? 'active' : ''}`}
                style={{ fontSize: 13 }}>
                {cat === 'فحص فني' ? '🔍 فحص فني' : cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            {/* City filter */}
            <div style={{ position: 'relative' }}>
              <select className="input" style={{ appearance: 'none', paddingLeft: 28, fontSize: 13, width: 'auto', minWidth: 130 }}
                value={city} onChange={e => setCity(e.target.value)}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown size={12} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }}/>
            </div>

            {/* Sort */}
            <div style={{ position: 'relative' }}>
              <select className="input" style={{ appearance: 'none', paddingLeft: 28, fontSize: 13, width: 'auto', minWidth: 140 }}
                value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}>
                {SORT_OPTIONS.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
              </select>
              <ChevronDown size={12} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }}/>
            </div>

            {/* Inspection toggle */}
            <button
              onClick={() => setShowInspectionOnly(!showInspectionOnly)}
              className={`tag ${showInspectionOnly ? 'active' : ''}`}
              style={{ fontSize: 13, flexShrink: 0 }}>
              🔍 فحص فني فقط
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-4)' }}>جارٍ التحميل...</div>
        ) : (
          <>
            {/* ── PREMIUM WORKSHOPS ───────────────────── */}
            {premiumServices.length > 0 && (
              <div style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Award size={16} style={{ color: '#D97706' }}/>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#D97706' }}>ورشات مميزة</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--gray-200)' }}/>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                  {premiumServices.map(s => <WorkshopCard key={s.id} service={s} premium />)}
                </div>
              </div>
            )}

            {/* ── ALL WORKSHOPS ───────────────────────── */}
            {regularServices.length === 0 && premiumServices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-4)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔧</div>
                <p>ما في ورشات في هذه الفئة حالياً</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                {regularServices.map(s => <WorkshopCard key={s.id} service={s} />)}
              </div>
            )}
          </>
        )}

        {/* ── REGISTER CTA ─────────────────────────── */}
        <div style={{
          marginTop: 56, background: 'var(--dark)', borderRadius: 24,
          padding: '40px 36px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 24,
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: 'var(--yellow)', fontSize: 11, fontWeight: 700,
              letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10,
            }}>
              <Zap size={12}/> للورشات والمراكز
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 8 }}>
              عندك ورشة أو مركز خدمة؟
            </h3>
            <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 14, lineHeight: 1.7 }}>
              سجّل على كارنا واوصل لآلاف المشترين والبائعين في منطقتك — ابدأ مجاناً
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/register-workshop" className="btn btn-yellow" style={{ fontSize: 14, padding: '12px 24px' }}>
              سجّل ورشتك الآن
            </Link>
            <Link to="/contact" className="btn" style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', color: '#fff', fontSize: 14, padding: '12px 24px', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              تواصل معنا
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}

// ── Workshop Card Component ────────────────────────────────────────────────────

function WorkshopCard({ service, premium = false }: { service: any; premium?: boolean }) {
  const tierColor: Record<string, string> = {
    premium: '#D97706',
    basic:   '#0053FA',
    free:    '#6B7280',
  }
  const tier = service.subscription_tier ?? 'free'

  return (
    <Link to={`/services/${service.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="card" style={{
        padding: '20px',
        border: premium ? '2px solid #F59E0B' : '1px solid var(--gray-200)',
        position: 'relative',
      }}>

        {/* Tier badge */}
        {tier !== 'free' && (
          <div style={{
            position: 'absolute', top: 14, left: 14,
            background: tier === 'premium' ? '#FEF3C7' : '#EFF6FF',
            color: tierColor[tier],
            padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
          }}>
            {tier === 'premium' ? '🏆 مميز' : '🔵 أساسي'}
          </div>
        )}

        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14, marginTop: tier !== 'free' ? 22 : 0 }}>
          {/* Logo / Avatar */}
          <div style={{
            width: 52, height: 52, borderRadius: 12, flexShrink: 0,
            background: service.logo_url ? '#fff' : tierColor[tier] + '18',
            border: `2px solid ${tierColor[tier]}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 800, color: tierColor[tier],
            overflow: 'hidden',
          }}>
            {service.logo_url
              ? <img src={service.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              : (service.name?.[0] ?? '🔧')
            }
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {service.name}
              </h3>
              {service.verified && <Shield size={13} style={{ color: 'var(--blue)', flexShrink: 0 }}/>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-3)' }}>
              <MapPin size={11}/> {service.city}
              {service.opening_hours && (
                <>
                  <span style={{ color: 'var(--gray-200)' }}>·</span>
                  <Clock size={11}/> {service.opening_hours}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Badges row */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {service.inspection && (
            <span style={{ background: '#ECFDF5', color: '#065F46', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 'var(--r-full)', border: '1px solid #A7F3D0' }}>
              🔍 فحص فني
            </span>
          )}
          {service.category && (
            <span style={{ background: 'var(--gray-100)', color: 'var(--text-2)', fontSize: 11, padding: '3px 9px', borderRadius: 'var(--r-full)' }}>
              {service.category}
            </span>
          )}
          {service.inspections_count > 0 && (
            <span style={{ background: 'var(--yellow-light)', color: 'var(--yellow-dark)', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 'var(--r-full)' }}>
              {service.inspections_count} فحص
            </span>
          )}
        </div>

        {/* Rating */}
        {service.rating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 1 }}>
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24"
                  fill={i <= Math.round(service.rating) ? '#FDB700' : '#E5E6EA'}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)' }}>{service.rating}</span>
            {service.reviews > 0 && <span style={{ fontSize: 12, color: 'var(--text-4)' }}>({service.reviews})</span>}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: service.whatsapp ? '1fr 1fr' : '1fr', gap: 8 }}>
          <a href={`tel:${service.phone}`} onClick={e => e.stopPropagation()}
            className="btn btn-dark" style={{ fontSize: 13, justifyContent: 'center', gap: 6 }}>
            <Phone size={13}/> اتصل
          </a>
          {service.whatsapp && (
            <a href={`https://wa.me/${service.whatsapp}`} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="btn" style={{
                background: '#25D366', color: '#fff', fontSize: 13,
                justifyContent: 'center', gap: 6, border: 'none',
              }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.198.592 4.255 1.623 6.02L0 24l6.168-1.601A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.374l-.36-.213-3.66.95.975-3.565-.233-.371A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/></svg>
              واتساب
            </a>
          )}
        </div>
      </div>
    </Link>
  )
}
