import { useState, useEffect } from 'react'
import { Search, ChevronDown, Loader2, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import ListingCard from '../components/ListingCard'
import { fetchListings, fetchDistinctMakes } from '../lib/queries'

const CITIES = ['كل المدن','دمشق','ريف دمشق','حلب','اللاذقية','طرطوس','حماة','حمص','دير الزور','الرقة','درعا','السويداء','إدلب','القنيطرة','الحسكة']
const TABS   = ['الكل','مستعملة','جديدة','قطع غيار']

// ── Brand data with real brand colors ──────────────────
const BRAND_DATA = [
  { name: 'تويوتا',  color: '#EB0A1E', bg: '#FFF0F0' },
  { name: 'كيا',     color: '#BB162B', bg: '#FFF0F0' },
  { name: 'هيونداي', color: '#002C5F', bg: '#EEF3FF' },
  { name: 'هوندا',   color: '#E40521', bg: '#FFF0F0' },
  { name: 'نيسان',   color: '#C40C3A', bg: '#FFF0F2' },
  { name: 'سوزوكي',  color: '#1A4B9A', bg: '#EEF3FF' },
  { name: 'BMW',     color: '#1C69D4', bg: '#EEF3FF' },
  { name: 'مرسيدس',  color: '#1F1F1F', bg: '#F5F5F5' },
  { name: 'شيفروليه',color: '#D4AF37', bg: '#FFFBEE' },
  { name: 'فورد',    color: '#003478', bg: '#EEF3FF' },
]

// ── Body type SVG icons (simple B&W line art) ──────────
function SedanIcon() {
  return (
    <svg width="64" height="32" viewBox="0 0 64 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="17" width="58" height="10" rx="3"/>
      <path d="M11 17 C13 8 20 6 30 6 L40 6 C49 6 52 10 54 17"/>
      <circle cx="15" cy="28" r="4"/>
      <circle cx="49" cy="28" r="4"/>
      <line x1="15" y1="17" x2="15" y2="24"/>
      <line x1="49" y1="17" x2="49" y2="24"/>
      <path d="M22 17 L22 8 M42 17 L42 8" strokeWidth="1"/>
    </svg>
  )
}
function SuvIcon() {
  return (
    <svg width="64" height="32" viewBox="0 0 64 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="15" width="58" height="12" rx="3"/>
      <path d="M10 15 L12 4 L52 4 L54 15"/>
      <circle cx="15" cy="28" r="4"/>
      <circle cx="49" cy="28" r="4"/>
      <line x1="12" y1="4" x2="12" y2="15"/>
      <line x1="52" y1="4" x2="52" y2="15"/>
      <line x1="12" y1="10" x2="52" y2="10" strokeWidth="1"/>
    </svg>
  )
}
function PickupIcon() {
  return (
    <svg width="72" height="32" viewBox="0 0 72 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="17" width="68" height="10" rx="3"/>
      <path d="M8 17 C10 8 18 6 26 6 L40 6 L40 17"/>
      <rect x="41" y="9" width="25" height="8" rx="2"/>
      <circle cx="15" cy="28" r="4"/>
      <circle cx="57" cy="28" r="4"/>
    </svg>
  )
}
function VanIcon() {
  return (
    <svg width="64" height="34" viewBox="0 0 64 34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="14" width="58" height="14" rx="3"/>
      <rect x="5" y="5" width="44" height="9" rx="2"/>
      <circle cx="14" cy="29" r="4"/>
      <circle cx="50" cy="29" r="4"/>
      <line x1="30" y1="5" x2="30" y2="14"/>
      <line x1="5" y1="14" x2="5" y2="5"/>
    </svg>
  )
}
function HatchbackIcon() {
  return (
    <svg width="60" height="30" viewBox="0 0 60 30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="15" width="54" height="10" rx="3"/>
      <path d="M11 15 C13 7 20 5 28 5 L42 5 C50 8 54 13 55 15"/>
      <circle cx="13" cy="26" r="4"/>
      <circle cx="47" cy="26" r="4"/>
      <line x1="13" y1="15" x2="13" y2="22"/>
      <line x1="47" y1="15" x2="47" y2="22"/>
    </svg>
  )
}
function CoupeIcon() {
  return (
    <svg width="66" height="28" viewBox="0 0 66 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="14" width="60" height="9" rx="2.5"/>
      <path d="M12 14 C15 4 22 3 33 3 L45 3 C54 3 58 9 61 14"/>
      <circle cx="15" cy="24" r="3.5"/>
      <circle cx="51" cy="24" r="3.5"/>
    </svg>
  )
}

const BODY_TYPES = [
  { name: 'سيدان',   icon: <SedanIcon /> },
  { name: 'SUV',     icon: <SuvIcon /> },
  { name: 'بيكاب',  icon: <PickupIcon /> },
  { name: 'فان',    icon: <VanIcon /> },
  { name: 'هاتشباك',icon: <HatchbackIcon /> },
  { name: 'كوبيه',  icon: <CoupeIcon /> },
]

const TOP_CITIES = ['دمشق','حلب','اللاذقية','حمص','طرطوس','حماة']

export default function Home() {
  const [activeTab,   setActiveTab]   = useState('الكل')
  const [listings,    setListings]    = useState<any[]>([])
  const [featured,    setFeatured]    = useState<any[]>([])
  const [brands,      setBrands]      = useState(BRAND_DATA)
  const [loading,     setLoading]     = useState(true)
  const [filters,     setFilters]     = useState({ city: '', make: '', yearFrom: '', yearTo: '', priceFrom: '', priceTo: '' })

  useEffect(() => {
    loadListings()
    fetchDistinctMakes().then(makes => {
      if (makes.length) {
        const updated = makes.map(name => BRAND_DATA.find(b => b.name === name) ?? { name, color: '#555', bg: '#f5f5f5' })
        setBrands(updated.length ? updated : BRAND_DATA)
      }
    })
  }, [])

  async function loadListings(extra?: object) {
    setLoading(true)
    try {
      const data = await fetchListings(extra)
      setListings(data)
      setFeatured(data.filter((l: any) => l.featured).slice(0, 4))
    } finally {
      setLoading(false)
    }
  }

  function applyFilters() {
    loadListings({
      city:      filters.city      || undefined,
      make:      filters.make      || undefined,
      yearFrom:  filters.yearFrom  ? Number(filters.yearFrom)  : undefined,
      yearTo:    filters.yearTo    ? Number(filters.yearTo)    : undefined,
      priceFrom: filters.priceFrom ? Number(filters.priceFrom) : undefined,
      priceTo:   filters.priceTo   ? Number(filters.priceTo)   : undefined,
    })
  }

  function filterByMake(make: string) {
    setFilters(f => ({ ...f, make }))
    loadListings({ make })
  }

  function filterByCity(city: string) {
    setFilters(f => ({ ...f, city }))
    loadListings({ city })
  }

  function filterByBodyType(bodyType: string) {
    loadListings({ make: '' })
  }

  return (
    <main style={{ flex: 1 }}>

      {/* ── HERO ────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 55%, #0f3460 100%)',
        padding: '56px 20px 44px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1 style={{ color: '#fff', fontSize: 'clamp(28px, 5vw, 50px)', fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
            سيارتك الجاية — هون
          </h1>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 16, marginBottom: 28 }}>
            آلاف الإعلانات من كل سوريا
          </p>

          {/* Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,.1)', borderRadius: 12, padding: 4, width: 'fit-content', margin: '0 auto 20px' }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '8px 22px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: 14, fontFamily: 'inherit',
                background: activeTab === tab ? '#fff' : 'transparent',
                color: activeTab === tab ? '#1a1a1a' : 'rgba(255,255,255,.8)',
                transition: 'all 150ms ease',
              }}>{tab}</button>
            ))}
          </div>

          {/* Search form */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, boxShadow: '0 20px 60px rgba(0,0,0,.35)' }} className="hero-form">
            <SelectField options={['كل الماركات', ...brands.map(b => b.name)]} value={filters.make} onChange={v => setFilters(f => ({ ...f, make: v === 'كل الماركات' ? '' : v }))} />
            <SelectField options={CITIES} value={filters.city} onChange={v => setFilters(f => ({ ...f, city: v === 'كل المدن' ? '' : v }))} />
            <div style={{ position: 'relative' }}>
              <select className="input" style={{ appearance: 'none', paddingLeft: 36 }} onChange={e => {
                const [from, to] = e.target.value.split('-').map(Number)
                setFilters(f => ({ ...f, priceFrom: from ? String(from) : '', priceTo: to ? String(to) : '' }))
              }}>
                <option value="">نطاق السعر</option>
                <option value="0-3000000">أقل من 3 مليون</option>
                <option value="3000000-7000000">3 – 7 مليون</option>
                <option value="7000000-15000000">7 – 15 مليون</option>
                <option value="15000000-999999999">أكثر من 15 مليون</option>
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>
            <button className="btn-primary" onClick={applyFilters} style={{ borderRadius: 10, gap: 8, whiteSpace: 'nowrap' }}>
              <Search size={16} /> دوّر
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 32 }}>
            {[['١٤', 'محافظة'], ['٢٤٠+', 'إعلان نشط'], ['٥٠٠+', 'مستخدم']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-yellow)' }}>{num}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>

        {/* ── BRANDS ──────────────────────────────────── */}
        <section style={{ padding: '36px 0 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>ابحث بالماركة</h2>
            <button onClick={() => { setFilters(f => ({ ...f, make: '' })); loadListings() }}
              style={{ background: 'none', border: 'none', color: 'var(--color-blue)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
              كل الماركات <ChevronLeft size={14} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(104px, 1fr))', gap: 10 }}>
            {brands.map(brand => {
              const isActive = filters.make === brand.name
              return (
                <button key={brand.name}
                  onClick={() => filterByMake(brand.name)}
                  style={{
                    background: isActive ? brand.color : '#fff',
                    border: `1.5px solid ${isActive ? brand.color : 'var(--border-light)'}`,
                    borderRadius: 12, padding: '14px 8px 12px', cursor: 'pointer', textAlign: 'center',
                    fontWeight: 700, fontSize: 13, color: isActive ? '#fff' : 'var(--text-primary)',
                    transition: 'all 150ms ease', fontFamily: 'inherit',
                    boxShadow: isActive ? `0 4px 14px ${brand.color}44` : '0 1px 3px rgba(0,0,0,.06)',
                  }}>
                  {/* Brand color dot */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, margin: '0 auto 8px',
                    background: isActive ? 'rgba(255,255,255,.2)' : brand.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `2px solid ${isActive ? 'rgba(255,255,255,.3)' : brand.color}22`,
                  }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: '50%',
                      background: isActive ? '#fff' : brand.color,
                    }} />
                  </div>
                  {brand.name}
                </button>
              )
            })}
          </div>
        </section>

        {/* ── BODY TYPE ───────────────────────────────── */}
        <section style={{ paddingBottom: 28, borderBottom: '1px solid var(--border-light)' }}>
          <h2 className="section-title" style={{ marginBottom: 16 }}>تصفح بنوع الهيكل</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
            {BODY_TYPES.map(bt => (
              <button key={bt.name} onClick={() => filterByBodyType(bt.name)}
                style={{
                  background: '#fff', border: '1.5px solid var(--border-light)',
                  borderRadius: 14, padding: '18px 8px 14px', cursor: 'pointer', textAlign: 'center',
                  color: 'var(--text-secondary)', transition: 'all 150ms ease', fontFamily: 'inherit',
                  boxShadow: '0 1px 4px rgba(0,0,0,.05)',
                }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10, opacity: 0.75 }}>
                  {bt.icon}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{bt.name}</div>
              </button>
            ))}
          </div>
        </section>

        {/* ── FEATURED ADS ────────────────────────────── */}
        {(featured.length > 0 || !loading) && (
          <section style={{ padding: '32px 0 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                <span style={{ background: 'var(--color-yellow)', borderRadius: 6, padding: '2px 10px', marginLeft: 8, fontSize: 12 }}>⭐ مميز</span>
                إعلانات مميزة
              </h2>
              <Link to="/?featured=1" style={{ color: 'var(--color-blue)', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                عرض الكل <ChevronLeft size={14} />
              </Link>
            </div>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-muted)' }} />
              </div>
            ) : featured.length === 0 ? (
              <div style={{ background: 'var(--bg-subtle)', borderRadius: 14, padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                لا توجد إعلانات مميزة حالياً — <Link to="/post" style={{ color: 'var(--color-blue)' }}>ميّز إعلانك</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
                {featured.map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
            )}
          </section>
        )}

        {/* ── BROWSE BY CITY ──────────────────────────── */}
        <section style={{ paddingBottom: 32, borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>تصفح بالمدينة</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
            {TOP_CITIES.map((city, i) => {
              const cityColors = ['#1a1a2e','#0f3460','#16213e','#1a2e1a','#2e1a1a','#1a1a1a']
              return (
                <button key={city} onClick={() => filterByCity(city)}
                  style={{
                    background: cityColors[i], color: '#fff', border: 'none',
                    borderRadius: 12, padding: '18px 10px', cursor: 'pointer', textAlign: 'center',
                    fontWeight: 700, fontSize: 15, fontFamily: 'inherit',
                    transition: 'all 150ms ease', position: 'relative', overflow: 'hidden',
                  }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>📍</div>
                  {city}
                </button>
              )
            })}
          </div>
        </section>

        {/* ── MAIN CONTENT: Sidebar (RIGHT in RTL) + Listings ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28, padding: '28px 0 60px' }} className="main-grid">

          {/* Sidebar — first in DOM = RIGHT in RTL ── */}
          <aside>
            <div style={{ background: '#fff', border: '1.5px solid var(--border-light)', borderRadius: 14, padding: 20, position: 'sticky', top: 80 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>الفلاتر</span>
                <button onClick={() => { setFilters({ city: '', make: '', yearFrom: '', yearTo: '', priceFrom: '', priceTo: '' }); loadListings() }}
                  style={{ color: 'var(--color-blue)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
                  مسح الكل
                </button>
              </div>
              <FilterGroup label="المدينة">
                <SelectField options={CITIES} value={filters.city} onChange={v => setFilters(f => ({ ...f, city: v === 'كل المدن' ? '' : v }))} />
              </FilterGroup>
              <FilterGroup label="الماركة">
                <SelectField options={['كل الماركات', ...brands.map(b => b.name)]} value={filters.make} onChange={v => setFilters(f => ({ ...f, make: v === 'كل الماركات' ? '' : v }))} />
              </FilterGroup>
              <FilterGroup label="سنة الصنع">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <input className="input" placeholder="من" style={{ fontSize: 14 }} value={filters.yearFrom} onChange={e => setFilters(f => ({ ...f, yearFrom: e.target.value }))} />
                  <input className="input" placeholder="إلى" style={{ fontSize: 14 }} value={filters.yearTo} onChange={e => setFilters(f => ({ ...f, yearTo: e.target.value }))} />
                </div>
              </FilterGroup>
              <FilterGroup label="السعر (مليون ل.س)" last>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <input className="input" placeholder="من" style={{ fontSize: 14 }} value={filters.priceFrom} onChange={e => setFilters(f => ({ ...f, priceFrom: e.target.value }))} />
                  <input className="input" placeholder="إلى" style={{ fontSize: 14 }} value={filters.priceTo} onChange={e => setFilters(f => ({ ...f, priceTo: e.target.value }))} />
                </div>
              </FilterGroup>
              <button className="btn-primary" onClick={applyFilters} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
                <Search size={15} /> تطبيق الفلاتر
              </button>
            </div>
          </aside>

          {/* Listings ── */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                أحدث الإعلانات
                <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)', marginRight: 8 }}>
                  ({listings.length} إعلان)
                </span>
              </h2>
              {/* Quick city filters */}
              <div style={{ display: 'flex', gap: 6 }}>
                {['دمشق','حلب','اللاذقية'].map(city => (
                  <button key={city} onClick={() => filterByCity(city)}
                    className="tag" style={{ fontSize: 12 }}>
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-muted)' }} />
              </div>
            ) : listings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                <p style={{ fontSize: 16 }}>ما لقينا شي — جرب بحثاً ثاني</p>
                <button onClick={() => { setFilters({ city: '', make: '', yearFrom: '', yearTo: '', priceFrom: '', priceTo: '' }); loadListings() }}
                  className="btn-primary" style={{ marginTop: 16 }}>
                  عرض كل الإعلانات
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 18 }}>
                {listings.map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
            )}
          </div>
        </div>

        {/* ── CTA BANNER ──────────────────────────────── */}
        <section style={{
          background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
          borderRadius: 20, padding: '36px 40px', marginBottom: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 20,
        }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
              عندك سيارة للبيع؟
            </h3>
            <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 15 }}>
              أضف إعلانك مجاناً وانتظر المشترين يتواصلوا معك
            </p>
          </div>
          <Link to="/post" className="btn-primary" style={{ fontSize: 16, padding: '12px 28px', flexShrink: 0 }}>
            + أضف إعلانك مجاناً
          </Link>
        </section>

      </div>
    </main>
  )
}

function SelectField({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ position: 'relative' }}>
      <select className="input" style={{ appearance: 'none', paddingLeft: 32 }} value={value || options[0]} onChange={e => onChange(e.target.value)}>
        {options.map(opt => <option key={opt}>{opt}</option>)}
      </select>
      <ChevronDown size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
    </div>
  )
}

function FilterGroup({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ marginBottom: 20, paddingBottom: last ? 0 : 20, borderBottom: last ? 'none' : '1px solid var(--border-light)' }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{label}</div>
      {children}
    </div>
  )
}
