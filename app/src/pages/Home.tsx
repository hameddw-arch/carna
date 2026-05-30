import { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown, Loader2, ChevronLeft, CheckCircle, Shield, Zap, Users, Phone, Star, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import ListingCard from '../components/ListingCard'
import { fetchListings, fetchDistinctMakes } from '../lib/queries'
import { supabase } from '../lib/supabase'

// ── Constants ─────────────────────────────────────────────────────────────────

const CITIES = ['كل المدن','دمشق','ريف دمشق','حلب','اللاذقية','طرطوس','حماة','حمص','دير الزور','الرقة','درعا','السويداء','إدلب','القنيطرة','الحسكة']
const TABS   = ['الكل','مستعملة','جديدة','قطع غيار']

const BRAND_DATA = [
  { name: 'تويوتا',   logo: '/brands/toyota.svg',   color: '#EB0A1E' },
  { name: 'كيا',      logo: '/brands/kia.svg',       color: '#BB162B' },
  { name: 'هيونداي',  logo: '/brands/hyundai.svg',   color: '#002C5F' },
  { name: 'هوندا',    logo: '/brands/honda.svg',     color: '#E40521' },
  { name: 'نيسان',    logo: '/brands/nissan.svg',    color: '#C40C3A' },
  { name: 'سوزوكي',   logo: '/brands/suzuki.svg',    color: '#1A4B9A' },
  { name: 'BMW',      logo: '/brands/bmw.svg',        color: '#1C69D4' },
  { name: 'مرسيدس',   logo: '/brands/mercedes.svg',  color: '#1F1F1F' },
  { name: 'شيفروليه', logo: '/brands/chevrolet.svg', color: '#C8A200' },
  { name: 'فورد',     logo: '/brands/ford.svg',       color: '#003478' },
]

const BODY_TYPES = [
  { name: 'سيدان',    icon: <BodySvg d="M6 22 L6 27 Q6 30 9 30 L13 30 Q13 24 19 24 Q25 24 25 30 L55 30 Q55 24 61 24 Q67 24 67 30 L71 30 Q74 30 74 27 L74 22 L70 14 Q68 11 64 11 L46 8 Q40 5 34 5 L22 5 Q16 5 13 9 Z" w={80} h={36} /> },
  { name: 'SUV',      icon: <BodySvg d="M6 20 L6 27 Q6 30 9 30 L13 30 Q13 24 19 24 Q25 24 25 30 L55 30 Q55 24 61 24 Q67 24 67 30 L71 30 Q74 30 74 27 L74 20 L72 12 Q70 8 66 8 L14 8 Q10 8 8 12 Z" w={80} h={36} />},
  { name: 'بيكاب',   icon: <BodySvg d="M6 22 L6 27 Q6 30 9 30 L13 30 Q13 24 19 24 Q25 24 25 30 L45 30 L45 18 L42 18 L42 10 Q42 7 39 7 L22 7 Q16 7 13 11 Z M45 15 L72 15 L72 27 Q72 30 69 30 L65 30 Q65 24 59 24 Q53 24 53 30 L47 30 L47 15" w={90} h={36} />},
  { name: 'فان',      icon: <BodySvg d="M8 22 L8 29 Q8 32 11 32 L14 32 Q14 26 20 26 Q26 26 26 32 L54 32 Q54 26 60 26 Q66 26 66 32 L69 32 Q72 32 72 29 L72 18 L70 10 Q68 6 64 6 L18 6 Q10 6 9 14 Z" w={80} h={38} />},
  { name: 'هاتشباك',  icon: <BodySvg d="M6 22 L6 27 Q6 30 9 30 L13 30 Q13 24 19 24 Q25 24 25 30 L51 30 Q51 24 57 24 Q63 24 63 30 L67 30 Q70 30 70 27 L70 22 L68 16 Q64 10 56 8 L32 5 Q20 5 16 10 Z" w={76} h={36} />},
  { name: 'كوبيه',    icon: <BodySvg d="M4 20 L4 25 Q4 28 7 28 L12 28 Q12 22 18 22 Q24 22 24 28 L58 28 Q58 22 64 22 Q70 22 70 28 L74 28 Q77 28 77 25 L77 20 L75 14 Q70 7 60 6 L36 4 Q24 4 18 8 Q10 12 6 17 Z" w={82} h={32} />},
]

const WHY_ITEMS = [
  { icon: <CheckCircle size={24}/>, title: 'شفافية كاملة', desc: 'كل تفاصيل السيارة واضحة — لا مفاجآت بعد الشراء' },
  { icon: <Users size={24}/>,       title: 'تواصل مباشر',  desc: 'اتصل بالبائع مباشرة بدون وسيط أو عمولة' },
  { icon: <Shield size={24}/>,      title: 'ورشات معتمدة', desc: 'مراكز فحص فني في كل المحافظات قبل ما تشتري' },
  { icon: <Zap size={24}/>,         title: 'نشر في دقيقتين', desc: 'أضف إعلانك بسهولة والقي المشترين يتواصلوا معك' },
]

// ── Body type SVG helper ──────────────────────────────────────────────────────
function BodySvg({ d, w = 80, h = 36 }: { d: string; w?: number; h?: number }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} fill="currentColor" style={{ width: w * 0.85, height: h * 0.85, display: 'block' }}>
      <path d={d}/>
    </svg>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Home() {
  const [activeTab,  setActiveTab]  = useState('الكل')
  const [listings,   setListings]   = useState<any[]>([])
  const [featured,   setFeatured]   = useState<any[]>([])
  const [brands,     setBrands]     = useState(BRAND_DATA)
  const [loading,    setLoading]    = useState(true)
  const [filters,    setFilters]    = useState({ city: '', make: '', yearFrom: '', yearTo: '', priceFrom: '', priceTo: '', sellerType: '' })
  const [workshops,  setWorkshops]  = useState<any[]>([])
  const [siteAds,    setSiteAds]    = useState<any[]>([])
  const [activeFilters, setActiveFilters] = useState<any>({})
  const [hasMore,    setHasMore]    = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const PAGE = 12

  // Infinite scroll observer
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore() },
      { rootMargin: '300px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [listings, hasMore, loadingMore, activeFilters])

  useEffect(() => {
    load()
    fetchDistinctMakes().then(makes => {
      if (makes.length) {
        const updated = makes.map(n => BRAND_DATA.find(b => b.name === n) ?? { name: n, logo: '', color: '#555' })
        setBrands(updated)
      }
    })
    // ورشات مميزة
    supabase.from('services')
      .select('id,name,city,phone,whatsapp,rating,inspection,service_types,subscription_tier,logo_url,verified,images')
      .in('subscription_tier', ['premium','basic'])
      .eq('status', 'active')
      .order('subscription_tier')
      .limit(4)
      .then(({ data }) => setWorkshops(data ?? []))
    // إعلانات الموقع
    supabase.from('site_ads')
      .select('*')
      .eq('active', true)
      .eq('position', 'home_middle')
      .then(({ data }) => setSiteAds(data ?? []))
  }, [])

  async function load(extra?: object) {
    setLoading(true)
    const f = extra ?? {}
    setActiveFilters(f)
    try {
      const data = await fetchListings({ ...f, offset: 0, limit: PAGE })
      setListings(data)
      setHasMore(data.length === PAGE)
      setFeatured(data.filter((l: any) => l.featured).slice(0, 4))
    } finally { setLoading(false) }
  }

  async function loadMore() {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const data = await fetchListings({ ...activeFilters, offset: listings.length, limit: PAGE })
      setListings(prev => [...prev, ...data])
      setHasMore(data.length === PAGE)
    } finally { setLoadingMore(false) }
  }

  function apply() {
    load({
      city:       filters.city       || undefined,
      make:       filters.make       || undefined,
      yearFrom:   filters.yearFrom   ? Number(filters.yearFrom)  : undefined,
      yearTo:     filters.yearTo     ? Number(filters.yearTo)    : undefined,
      priceFrom:  filters.priceFrom  ? Number(filters.priceFrom) : undefined,
      priceTo:    filters.priceTo    ? Number(filters.priceTo)   : undefined,
      sellerType: (filters.sellerType as 'individual' | 'dealer') || undefined,
    })
  }

  const f = (k: string, v: string) => setFilters(p => ({ ...p, [k]: v }))

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main style={{ flex: 1 }}>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section style={{ position: 'relative', minHeight: 580, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center 40%',
          zIndex: 0,
        }} />
        {/* Overlay gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(100deg, rgba(10,10,10,.92) 40%, rgba(10,10,10,.55) 100%)',
          zIndex: 1,
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1240, margin: '0 auto', padding: '80px 24px 60px', width: '100%' }}>

          {/* Headline */}
          <div style={{ marginBottom: 36, maxWidth: 600 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(253,183,0,.15)', border: '1px solid rgba(253,183,0,.3)',
              borderRadius: 'var(--r-full)', padding: '5px 14px',
              fontSize: 12, fontWeight: 700, color: 'var(--yellow)',
              letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 20,
            }}>
              منصة إعلانات السيارات السورية
            </div>
            <h1 style={{
              fontSize: 'clamp(32px, 5.5vw, 58px)',
              fontWeight: 900, color: '#fff',
              lineHeight: 1.1, marginBottom: 16,
            }}>
              سيارتك الجاية —
              <br/>
              <span style={{ color: 'var(--yellow)' }}>هون</span>
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,.65)', lineHeight: 1.7 }}>
              آلاف الإعلانات من كل سوريا. ابحث، قارن، واشتري بثقة.
            </p>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'inline-flex', gap: 4, marginBottom: 20,
            background: 'rgba(255,255,255,.08)',
            border: '1px solid rgba(255,255,255,.12)',
            borderRadius: 12, padding: 4,
          }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '7px 20px', borderRadius: 9, border: 'none',
                cursor: 'pointer', fontWeight: 700, fontSize: 14,
                fontFamily: 'var(--font)', transition: 'all 150ms ease',
                background: activeTab === tab ? '#fff' : 'transparent',
                color: activeTab === tab ? 'var(--dark)' : 'rgba(255,255,255,.75)',
              }}>{tab}</button>
            ))}
          </div>

          {/* Search card */}
          <div style={{
            background: '#fff', borderRadius: 16, padding: '18px 20px',
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10,
            boxShadow: '0 24px 64px rgba(0,0,0,.4)',
            maxWidth: 780,
          }} className="hero-form">
            <SelectF name="makeHero" options={['كل الماركات', ...brands.map(b => b.name)]} value={filters.make}
              onChange={v => f('make', v === 'كل الماركات' ? '' : v)} />
            <SelectF name="city" options={CITIES} value={filters.city}
              onChange={v => f('city', v === 'كل المدن' ? '' : v)} />
            <div style={{ position: 'relative' }}>
              <select name="priceRange" className="input" style={{ appearance: 'none', paddingLeft: 32 }}
                onChange={e => {
                  const [from, to] = e.target.value.split('-').map(Number)
                  setFilters(p => ({ ...p, priceFrom: from ? String(from) : '', priceTo: to ? String(to) : '' }))
                }}>
                <option value="">نطاق السعر</option>
                <option value="0-3000000">أقل من 3 مليون</option>
                <option value="3000000-7000000">3 – 7 مليون</option>
                <option value="7000000-15000000">7 – 15 مليون</option>
                <option value="15000000-999999999">أكثر من 15 مليون</option>
              </select>
              <ChevronDown size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }}/>
            </div>
            <button className="btn btn-yellow" onClick={apply} style={{ gap: 8, paddingLeft: 20, paddingRight: 20 }}>
              <Search size={16}/> ابحث
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════ */}
      <div style={{ background: 'var(--yellow)', borderBottom: '1px solid var(--yellow-dark)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '18px 24px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 12 }}>
          {[
            { n: listings.length || '٢٤٠+', l: 'إعلان متاح' },
            { n: '١٤',  l: 'محافظة' },
            { n: '٥٠+', l: 'ورشة معتمدة' },
            { n: '١٠٠٠+', l: 'مستخدم مسجّل' },
          ].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--dark)', lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,.55)', marginTop: 3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          BRANDS
      ══════════════════════════════════════════ */}
      <section style={{ padding: '56px 0 48px', background: 'var(--white)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
            <div>
              <div className="section-eyebrow">ابحث بالماركة</div>
              <h2 className="section-title">كل الماركات، مكان واحد</h2>
            </div>
            <button className="btn btn-ghost" onClick={() => { f('make',''); load() }} style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
              كل الماركات <ChevronLeft size={14}/>
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
            {brands.map(brand => {
              const active = filters.make === brand.name
              return (
                <button key={brand.name}
                  onClick={() => { f('make', brand.name); load({ make: brand.name }) }}
                  style={{
                    background: active ? brand.color : 'var(--white)',
                    border: `1.5px solid ${active ? brand.color : 'var(--gray-200)'}`,
                    borderRadius: 14, padding: '14px 8px 12px',
                    cursor: 'pointer', textAlign: 'center',
                    fontFamily: 'var(--font)', fontWeight: 700, fontSize: 12,
                    color: active ? '#fff' : 'var(--text)',
                    transition: 'all 200ms ease',
                    boxShadow: active ? `0 6px 18px ${brand.color}55` : 'var(--shadow-sm)',
                  }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, margin: '0 auto 8px',
                    background: active ? 'rgba(255,255,255,.18)' : brand.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 7,
                  }}>
                    {brand.logo
                      ? <img src={brand.logo} alt={brand.name} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}/>
                      : <span style={{ fontSize: 11, color: '#fff', fontWeight: 800 }}>{brand.name.slice(0,2)}</span>
                    }
                  </div>
                  {brand.name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BODY TYPES
      ══════════════════════════════════════════ */}
      <section style={{ padding: '48px 0', background: 'var(--off-white)', borderTop: '1px solid var(--gray-200)', borderBottom: '1px solid var(--gray-200)' }}>
        <div className="container">
          <div style={{ marginBottom: 24 }}>
            <div className="section-eyebrow">تصفح بنوع الهيكل</div>
            <h2 className="section-title">اختر نوع السيارة</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
            {BODY_TYPES.map(bt => (
              <button key={bt.name}
                onClick={() => load({})}
                style={{
                  background: 'var(--white)', border: '1.5px solid var(--gray-200)',
                  borderRadius: 14, padding: '20px 8px 14px',
                  cursor: 'pointer', textAlign: 'center', fontFamily: 'var(--font)',
                  color: 'var(--text)', transition: 'all 200ms ease',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10, color: 'var(--dark)' }}>
                  {bt.icon}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{bt.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURED LISTINGS
      ══════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section style={{ padding: '56px 0', background: 'var(--white)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
              <div>
                <div className="section-eyebrow">مميزة</div>
                <h2 className="section-title">
                  <span style={{ background: 'var(--yellow)', borderRadius: 8, padding: '2px 10px', marginLeft: 10, fontSize: 14 }}>⭐</span>
                  إعلانات مميزة
                </h2>
              </div>
              <Link to="/?featured=1" className="btn btn-outline" style={{ fontSize: 13, gap: 4 }}>
                عرض الكل <ChevronLeft size={14}/>
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 18 }}>
              {featured.map(l => <ListingCard key={l.id} listing={l}/>)}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          PREMIUM WORKSHOPS
      ══════════════════════════════════════════ */}
      {workshops.length > 0 && (
        <section style={{ padding: '52px 0', background: '#fff', borderTop: '1px solid var(--gray-200)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
              <div>
                <div className="section-eyebrow">ورشات وخدمات</div>
                <h2 className="section-title">🏆 ورشات موصى بها</h2>
              </div>
              <Link to="/services" className="btn btn-outline" style={{ fontSize: 13, gap: 4 }}>
                كل الورشات <ChevronLeft size={14}/>
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, alignItems: 'stretch' }}>
              {workshops.map(ws => {
                const isPremium = ws.subscription_tier === 'premium'
                const cover = ws.images?.[0] ?? ws.logo_url ?? null
                return (
                <Link key={ws.id} to={`/services/${ws.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                  <div style={{
                    height: '100%',
                    display: 'flex', flexDirection: 'column',
                    background: '#fff',
                    border: `2px solid ${isPremium ? 'var(--yellow)' : 'var(--gray-200)'}`,
                    borderRadius: 18, overflow: 'hidden',
                    transition: 'transform 150ms ease, box-shadow 150ms ease',
                    cursor: 'pointer',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}
                  >
                    {/* Header — image cover or gradient fallback */}
                    <div style={{
                      position: 'relative', height: 120, flexShrink: 0,
                      background: cover
                        ? `url(${cover}) center/cover no-repeat`
                        : isPremium
                          ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                          : 'linear-gradient(135deg, var(--gray-100) 0%, #E2E4E8 100%)',
                    }}>
                      {/* dark gradient overlay for text readability */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: cover
                          ? 'linear-gradient(to top, rgba(0,0,0,.78) 0%, rgba(0,0,0,.15) 60%, rgba(0,0,0,.05) 100%)'
                          : 'transparent',
                      }}/>

                      {/* Premium badge */}
                      {isPremium && (
                        <span style={{
                          position: 'absolute', top: 10, right: 10,
                          background: 'var(--yellow)', color: 'var(--dark)',
                          fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 'var(--r-full)',
                        }}>🏆 مميز</span>
                      )}

                      {/* No-image fallback: big initial */}
                      {!cover && (
                        <div style={{
                          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 40, fontWeight: 900,
                          color: isPremium ? 'rgba(253,183,0,.5)' : 'var(--gray-400)',
                        }}>{ws.name[0]}</div>
                      )}

                      {/* Name + city overlaid at bottom */}
                      <div style={{ position: 'absolute', bottom: 0, right: 0, left: 0, padding: '10px 14px' }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: cover ? '#fff' : (isPremium ? '#fff' : 'var(--text)'), marginBottom: 2, lineHeight: 1.3 }}>
                          {ws.name}
                        </div>
                        <div style={{ fontSize: 12, color: cover ? 'rgba(255,255,255,.75)' : (isPremium ? 'rgba(255,255,255,.6)' : 'var(--text-4)') }}>
                          📍 {ws.city}
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14, minHeight: 22 }}>
                        {ws.inspection && (
                          <span style={{ fontSize: 11, fontWeight: 700, background: '#ECFDF5', color: '#065F46', padding: '3px 8px', borderRadius: 6 }}>
                            🔍 فحص
                          </span>
                        )}
                        {ws.service_types?.slice(0, 2).map((s: string) => (
                          <span key={s} style={{ fontSize: 11, background: 'var(--gray-100)', color: 'var(--text-3)', padding: '3px 8px', borderRadius: 6 }}>
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* Bottom row pinned */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        {ws.rating > 0 ? (
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#D97706' }}>
                            <Star size={12} style={{ display: 'inline', marginLeft: 3 }} fill="currentColor"/>
                            {ws.rating}
                          </span>
                        ) : <span/>}
                        {(ws.phone || ws.whatsapp) && (
                          <a href={ws.whatsapp ? `https://wa.me/${ws.whatsapp}` : `tel:${ws.phone}`}
                            onClick={e => e.stopPropagation()}
                            target={ws.whatsapp ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            className="btn btn-yellow"
                            style={{ fontSize: 12, padding: '6px 12px', gap: 5 }}>
                            <Phone size={12}/> اتصل
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          SITE ADS BANNER
      ══════════════════════════════════════════ */}
      {siteAds.length > 0 && (
        <section style={{ padding: '32px 0', background: 'var(--off-white)' }}>
          <div className="container">
            {siteAds.map(ad => (
              <a key={ad.id} href={ad.link_url ?? '#'} target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', textDecoration: 'none', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-md)', marginBottom: 16 }}>
                {ad.image_url ? (
                  <div style={{ position: 'relative' }}>
                    <img src={ad.image_url} alt={ad.title} style={{ width: '100%', maxHeight: 160, objectFit: 'cover', display: 'block' }}/>
                    <div style={{ position: 'absolute', top: 10, right: 14, background: 'rgba(0,0,0,.5)', color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 6 }}>إعلان</div>
                  </div>
                ) : (
                  <div style={{
                    background: 'linear-gradient(135deg, var(--dark) 0%, #1a1a2e 100%)',
                    padding: '28px 32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
                  }}>
                    <div style={{ position: 'absolute', top: 10, right: 14, background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.5)', fontSize: 10, padding: '2px 8px', borderRadius: 6 }}>إعلان</div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 6 }}>{ad.title}</div>
                      {ad.body_text && <div style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', maxWidth: 500 }}>{ad.body_text}</div>}
                    </div>
                    {ad.link_url && (
                      <div className="btn btn-yellow" style={{ fontSize: 14, flexShrink: 0 }}>
                        {ad.cta_text} <ExternalLink size={13}/>
                      </div>
                    )}
                  </div>
                )}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          MAIN LISTINGS + SIDEBAR
      ══════════════════════════════════════════ */}
      <section style={{ padding: '56px 0 64px', background: 'var(--off-white)', borderTop: '1px solid var(--gray-200)' }}>
        <div className="container">
          <div className="main-grid">

            {/* Sidebar — RIGHT in RTL */}
            <aside>
              <div style={{
                background: 'var(--white)', border: '1px solid var(--gray-200)',
                borderRadius: 20, padding: '22px 20px',
                position: 'sticky', top: 80, boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                  <span style={{ fontWeight: 800, fontSize: 16 }}>الفلاتر</span>
                  <button onClick={() => { setFilters({ city: '', make: '', yearFrom: '', yearTo: '', priceFrom: '', priceTo: '', sellerType: '' }); load() }}
                    style={{ color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font)' }}>
                    مسح الكل
                  </button>
                </div>
                <FGroup label="المدينة">
                  <SelectF name="citySidebar" options={CITIES} value={filters.city} onChange={v => f('city', v === 'كل المدن' ? '' : v)}/>
                </FGroup>
                <FGroup label="الماركة">
                  <SelectF name="makeSidebar" options={['كل الماركات', ...brands.map(b => b.name)]} value={filters.make}
                    onChange={v => f('make', v === 'كل الماركات' ? '' : v)}/>
                </FGroup>
                <FGroup label="سنة الصنع">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <input name="yearFrom" className="input" placeholder="من" style={{ fontSize: 13 }} value={filters.yearFrom} onChange={e => f('yearFrom', e.target.value)}/>
                    <input name="yearTo" className="input" placeholder="إلى" style={{ fontSize: 13 }} value={filters.yearTo} onChange={e => f('yearTo', e.target.value)}/>
                  </div>
                </FGroup>
                <FGroup label="السعر (مليون ل.س)" last>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <input name="priceFrom" className="input" placeholder="من" style={{ fontSize: 13 }} value={filters.priceFrom} onChange={e => f('priceFrom', e.target.value)}/>
                    <input name="priceTo" className="input" placeholder="إلى" style={{ fontSize: 13 }} value={filters.priceTo} onChange={e => f('priceTo', e.target.value)}/>
                  </div>
                </FGroup>
                <button className="btn btn-yellow" onClick={apply} style={{ width: '100%', marginTop: 4 }}>
                  <Search size={15}/> تطبيق الفلاتر
                </button>
              </div>
            </aside>

            {/* Listings */}
            <div>
              <div style={{ marginBottom: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    <div className="section-eyebrow">أحدث الإعلانات</div>
                    <h2 className="section-title" style={{ marginBottom: 0 }}>
                      {listings.length > 0 ? `${listings.length} إعلان` : 'الإعلانات'}
                    </h2>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['دمشق','حلب','اللاذقية'].map(city => (
                      <button key={city} className="tag" onClick={() => { f('city', city); load({ city }) }} style={{ fontSize: 12 }}>
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seller type toggle */}
                <div style={{ display: 'flex', gap: 8, background: 'var(--gray-100)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
                  {[
                    { val: '',           label: 'الكل' },
                    { val: 'individual', label: '👤 من صاحبها' },
                    { val: 'dealer',     label: '🏪 من وكيل' },
                  ].map(opt => (
                    <button key={opt.val}
                      onClick={() => { f('sellerType', opt.val); load({ sellerType: (opt.val as 'individual' | 'dealer') || undefined, city: filters.city || undefined, make: filters.make || undefined }) }}
                      style={{
                        padding: '7px 16px', borderRadius: 9, border: 'none',
                        cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600,
                        transition: 'all 150ms ease',
                        background: filters.sellerType === opt.val ? '#fff' : 'transparent',
                        color: filters.sellerType === opt.val ? 'var(--text)' : 'var(--text-3)',
                        boxShadow: filters.sellerType === opt.val ? 'var(--shadow-sm)' : 'none',
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                  <Loader2 size={30} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-4)' }}/>
                </div>
              ) : listings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-4)' }}>
                  <div style={{ fontSize: 52, marginBottom: 14 }}>🔍</div>
                  <p style={{ fontSize: 16, marginBottom: 20 }}>ما لقينا شي — جرب بحثاً ثاني</p>
                  <button className="btn btn-yellow" onClick={() => { setFilters({ city: '', make: '', yearFrom: '', yearTo: '', priceFrom: '', priceTo: '', sellerType: '' }); load() }}>
                    عرض كل الإعلانات
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(265px, 1fr))', gap: 16 }}>
                    {listings.map(l => <ListingCard key={l.id} listing={l}/>)}
                  </div>
                  {/* Infinite scroll sentinel */}
                  <div ref={sentinelRef} style={{ height: 1 }}/>
                  {loadingMore && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '28px 0' }}>
                      <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-4)' }}/>
                    </div>
                  )}
                  {!hasMore && listings.length > PAGE && (
                    <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--text-4)', fontSize: 13 }}>
                      وصلت لنهاية القائمة — {listings.length} إعلان
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHY CARNA
      ══════════════════════════════════════════ */}
      <section style={{ padding: '72px 0', background: 'var(--dark)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: 'var(--yellow)', fontSize: 11, fontWeight: 700,
              letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 12,
            }}>
              <span style={{ display: 'block', width: 18, height: 2, background: 'var(--yellow)' }}/>
              لماذا كارنا
              <span style={{ display: 'block', width: 18, height: 2, background: 'var(--yellow)' }}/>
            </div>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
              المنصة اللي بتفهم السوق السوري
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {WHY_ITEMS.map((item, i) => (
              <div key={i} style={{
                background: 'var(--dark-3)',
                border: '1px solid rgba(255,255,255,.07)',
                borderRadius: 18, padding: '28px 24px',
                transition: 'all 250ms ease',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'var(--yellow-glow)',
                  border: '1px solid rgba(253,183,0,.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--yellow)', marginBottom: 18,
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WORKSHOPS CTA
      ══════════════════════════════════════════ */}
      <section style={{ padding: '64px 0', background: '#0A1628' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 28 }}>
          <div style={{ maxWidth: 520 }}>
            <div style={{
              display: 'inline-flex', gap: 8, alignItems: 'center',
              color: '#7CA3E8', fontSize: 11, fontWeight: 700,
              letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 14,
            }}>
              <Shield size={13}/> ورشات وخدمات
            </div>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: '#fff', marginBottom: 12, lineHeight: 1.25 }}>
              سجّل ورشتك على كارنا
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.5)', lineHeight: 1.7, marginBottom: 0 }}>
              وصول مباشر لآلاف المشترين والبائعين. اشترك بسعر رمزي وابدأ تستقبل طلبات الفحص والصيانة اليوم.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/services" className="btn btn-yellow" style={{ fontSize: 15, padding: '13px 28px' }}>
              استعرض الورشات
            </Link>
            <Link to="/post" className="btn" style={{
              background: 'rgba(255,255,255,.07)',
              border: '1px solid rgba(255,255,255,.12)',
              color: '#fff', fontSize: 15, padding: '13px 28px',
            }}>
              سجّل ورشتك
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          POST AD CTA
      ══════════════════════════════════════════ */}
      <section style={{ padding: '64px 0', background: 'var(--yellow)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, color: 'var(--dark)', marginBottom: 12, lineHeight: 1.2 }}>
            عندك سيارة للبيع؟
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(0,0,0,.6)', marginBottom: 32, maxWidth: 420, margin: '0 auto 32px' }}>
            أضف إعلانك مجاناً في أقل من دقيقتين — ومن بكرا المشترين بيتواصلوا معك
          </p>
          <Link to="/post" className="btn btn-dark" style={{ fontSize: 16, padding: '14px 36px', boxShadow: '0 8px 24px rgba(0,0,0,.2)' }}>
            + أضف إعلانك مجاناً
          </Link>
        </div>
      </section>

    </main>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function SelectF({ options, value, onChange, name }: { options: string[]; value: string; onChange: (v: string) => void; name?: string }) {
  return (
    <div style={{ position: 'relative' }}>
      <select name={name} className="input" style={{ appearance: 'none', paddingLeft: 28 }} value={value || options[0]} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }}/>
    </div>
  )
}

function FGroup({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ marginBottom: 18, paddingBottom: last ? 0 : 18, borderBottom: last ? 'none' : '1px solid var(--gray-100)' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)', marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  )
}
