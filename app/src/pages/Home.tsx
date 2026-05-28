import { useState, useEffect } from 'react'
import { Search, ChevronDown, Loader2 } from 'lucide-react'
import ListingCard from '../components/ListingCard'
import { fetchListings, fetchDistinctMakes } from '../lib/queries'
import { TAGS } from '../data/mock'

const CITIES     = ['كل المدن', 'دمشق', 'ريف دمشق', 'حلب', 'اللاذقية', 'طرطوس', 'حماة', 'حمص', 'دير الزور', 'الرقة', 'درعا', 'السويداء', 'إدلب', 'القنيطرة', 'الحسكة']
const ALL_BRANDS = ['تويوتا','كيا','هيونداي','هوندا','نيسان','سوزوكي','BMW','مرسيدس']
const TABS       = ['الكل', 'مستعملة', 'جديدة', 'قطع غيار']

export default function Home() {
  const [activeTab,   setActiveTab]   = useState('الكل')
  const [activeTags,  setActiveTags]  = useState<string[]>([])
  const [listings,    setListings]    = useState<any[]>([])
  const [brands,      setBrands]      = useState<string[]>(ALL_BRANDS)
  const [loading,     setLoading]     = useState(true)
  const [filters,     setFilters]     = useState({ city: '', make: '', yearFrom: '', yearTo: '', priceFrom: '', priceTo: '' })

  useEffect(() => {
    loadListings()
    fetchDistinctMakes().then(m => { if (m.length) setBrands(m) })
  }, [])

  async function loadListings(extra?: object) {
    setLoading(true)
    try {
      const data = await fetchListings(extra)
      setListings(data)
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

  const toggleTag = (tag: string) =>
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])

  return (
    <main style={{ flex: 1 }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: '64px 20px 48px',
        textAlign: 'center',
      }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <h1 style={{ color: '#fff', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
            سيارتك الجاية — هون
          </h1>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 16, marginBottom: 32 }}>
            آلاف الإعلانات من كل سوريا
          </p>

          {/* Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,.1)', borderRadius: 12, padding: 4, width: 'fit-content', margin: '0 auto 20px' }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
                background: activeTab === tab ? '#fff' : 'transparent',
                color: activeTab === tab ? '#1a1a1a' : 'rgba(255,255,255,.8)',
                transition: 'all 150ms ease', fontFamily: 'inherit',
              }}>{tab}</button>
            ))}
          </div>

          {/* Search form */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, boxShadow: '0 20px 60px rgba(0,0,0,.3)' }} className="hero-form">
            <SelectField options={['كل الماركات', ...brands]} value={filters.make} onChange={v => setFilters(f => ({...f, make: v === 'كل الماركات' ? '' : v}))} />
            <SelectField options={CITIES} value={filters.city} onChange={v => setFilters(f => ({...f, city: v === 'كل المدن' ? '' : v}))} />
            <div style={{ position: 'relative' }}>
              <select className="input" style={{ appearance: 'none', paddingLeft: 36 }} onChange={e => {
                const [from, to] = e.target.value.split('-').map(Number)
                setFilters(f => ({...f, priceFrom: from ? String(from) : '', priceTo: to ? String(to) : ''}))
              }}>
                <option value="">نطاق السعر</option>
                <option value="0-3000000">أقل من 3 مليون</option>
                <option value="3000000-7000000">3 - 7 مليون</option>
                <option value="7000000-15000000">7 - 15 مليون</option>
                <option value="15000000-999999999">أكثر من 15 مليون</option>
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>
            <button className="btn-primary" onClick={applyFilters} style={{ borderRadius: 10, gap: 8 }}>
              <Search size={16} /> دوّر
            </button>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>

        {/* Brands */}
        <section style={{ padding: '40px 0 32px' }}>
          <h2 className="section-title">ابحث بالماركة</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
            {brands.map(brand => (
              <button key={brand} onClick={() => { setFilters(f => ({...f, make: brand})); loadListings({ make: brand }) }}
                style={{ background: filters.make === brand ? 'var(--yellow-50)' : 'var(--bg-base)', border: `1.5px solid ${filters.make === brand ? 'var(--color-yellow)' : 'var(--border-light)'}`, borderRadius: 12, padding: '14px 10px', cursor: 'pointer', textAlign: 'center', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', transition: 'all 150ms ease', fontFamily: 'inherit' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🚗</div>
                {brand}
              </button>
            ))}
          </div>
        </section>

        {/* Tags */}
        <section style={{ paddingBottom: 28 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TAGS.map(tag => (
              <button key={tag} className={`tag ${activeTags.includes(tag) ? 'active' : ''}`} onClick={() => toggleTag(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Main content */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28, paddingBottom: 60 }} className="main-grid">

          {/* Sidebar */}
          <aside>
            <div style={{ background: 'var(--bg-base)', border: '1.5px solid var(--border-light)', borderRadius: 14, padding: 20, position: 'sticky', top: 80 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>الفلاتر</span>
                <button onClick={() => { setFilters({ city: '', make: '', yearFrom: '', yearTo: '', priceFrom: '', priceTo: '' }); loadListings() }} style={{ color: 'var(--color-blue)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>مسح الكل</button>
              </div>
              <FilterGroup label="المدينة">
                <SelectField options={CITIES} value={filters.city} onChange={v => setFilters(f => ({...f, city: v === 'كل المدن' ? '' : v}))} />
              </FilterGroup>
              <FilterGroup label="الماركة">
                <SelectField options={['كل الماركات', ...brands]} value={filters.make} onChange={v => setFilters(f => ({...f, make: v === 'كل الماركات' ? '' : v}))} />
              </FilterGroup>
              <FilterGroup label="سنة الصنع">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <input className="input" placeholder="من" style={{ fontSize: 14 }} value={filters.yearFrom} onChange={e => setFilters(f => ({...f, yearFrom: e.target.value}))} />
                  <input className="input" placeholder="إلى" style={{ fontSize: 14 }} value={filters.yearTo} onChange={e => setFilters(f => ({...f, yearTo: e.target.value}))} />
                </div>
              </FilterGroup>
              <FilterGroup label="السعر (مليون ل.س)" last>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <input className="input" placeholder="من" style={{ fontSize: 14 }} value={filters.priceFrom} onChange={e => setFilters(f => ({...f, priceFrom: e.target.value}))} />
                  <input className="input" placeholder="إلى" style={{ fontSize: 14 }} value={filters.priceTo} onChange={e => setFilters(f => ({...f, priceTo: e.target.value}))} />
                </div>
              </FilterGroup>
              <button className="btn-primary" onClick={applyFilters} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
                <Search size={15} /> تطبيق الفلاتر
              </button>
            </div>
          </aside>

          {/* Listings */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                طازجة من الساعة
                <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)', marginRight: 8 }}>({listings.length} إعلان)</span>
              </h2>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            ) : listings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                <p style={{ fontSize: 16 }}>ما لقينا شي هلق — جرب بحثاً ثاني</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
              </div>
            )}
          </div>
        </div>
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
