import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import ListingCard from '../components/ListingCard'
import { BRANDS, TAGS, LISTINGS } from '../data/mock'

const CITIES = ['كل المدن', 'دمشق', 'حلب', 'حمص', 'اللاذقية', 'طرطوس', 'حماة', 'دير الزور']
const BRAND_NAMES = ['كل الماركات', ...BRANDS.map(b => b.name)]
const TABS = ['الكل', 'مستعملة', 'جديدة', 'قطع غيار']

export default function Home() {
  const [activeTab, setActiveTab] = useState('الكل')
  const [activeTags, setActiveTags] = useState<string[]>([])

  const toggleTag = (tag: string) =>
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])

  return (
    <main style={{ flex: 1 }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: '64px 20px 48px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <h1 style={{
            color: '#fff',
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 800,
            marginBottom: 8,
            lineHeight: 1.2,
          }}>
            سيارتك الجاية — هون
          </h1>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 16, marginBottom: 32 }}>
            آلاف الإعلانات من كل سوريا
          </p>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 4,
            marginBottom: 20,
            background: 'rgba(255,255,255,.1)',
            borderRadius: 12,
            padding: 4,
            width: 'fit-content',
            margin: '0 auto 20px',
          }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '8px 20px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14,
                transition: 'all 150ms ease',
                background: activeTab === tab ? '#fff' : 'transparent',
                color: activeTab === tab ? '#1a1a1a' : 'rgba(255,255,255,.8)',
              }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Search form */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 16,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr auto',
            gap: 10,
            boxShadow: '0 20px 60px rgba(0,0,0,.3)',
          }} className="hero-form">
            <Select options={BRAND_NAMES} placeholder="الماركة" />
            <Select options={CITIES} placeholder="المدينة" />
            <div style={{ position: 'relative' }}>
              <select className="input" style={{ appearance: 'none', paddingLeft: 36 }}>
                <option value="">نطاق السعر</option>
                <option>أقل من 3 مليون</option>
                <option>3 - 7 مليون</option>
                <option>7 - 15 مليون</option>
                <option>أكثر من 15 مليون</option>
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>
            <button className="btn-primary" style={{ borderRadius: 10, gap: 8 }}>
              <Search size={16} />
              دوّر
            </button>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        {/* Brands */}
        <section style={{ padding: '40px 0 32px' }}>
          <h2 className="section-title">ابحث بالماركة</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
            gap: 10,
          }}>
            {BRANDS.map(brand => (
              <button key={brand.slug} style={{
                background: 'var(--bg-base)',
                border: '1.5px solid var(--border-light)',
                borderRadius: 12,
                padding: '14px 10px',
                cursor: 'pointer',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: 14,
                color: 'var(--text-primary)',
                transition: 'all 150ms ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.borderColor = 'var(--color-yellow)'
                el.style.background = 'var(--yellow-50)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.borderColor = 'var(--border-light)'
                el.style.background = 'var(--bg-base)'
              }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🚗</div>
                {brand.name}
              </button>
            ))}
          </div>
        </section>

        {/* Tags */}
        <section style={{ paddingBottom: 28 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TAGS.map(tag => (
              <button
                key={tag}
                className={`tag ${activeTags.includes(tag) ? 'active' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Main content */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28, paddingBottom: 60 }} className="main-grid">
          {/* Sidebar */}
          <aside>
            <div style={{
              background: 'var(--bg-base)',
              border: '1.5px solid var(--border-light)',
              borderRadius: 14,
              padding: 20,
              position: 'sticky',
              top: 80,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>الفلاتر</span>
                <button style={{ color: 'var(--color-blue)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>مسح الكل</button>
              </div>

              <FilterGroup label="المدينة">
                <Select options={CITIES} placeholder="اختر المدينة" />
              </FilterGroup>

              <FilterGroup label="الماركة">
                <Select options={BRAND_NAMES} placeholder="اختر الماركة" />
              </FilterGroup>

              <FilterGroup label="سنة الصنع">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <input className="input" placeholder="من" style={{ fontSize: 14 }} />
                  <input className="input" placeholder="إلى" style={{ fontSize: 14 }} />
                </div>
              </FilterGroup>

              <FilterGroup label="السعر (مليون ل.س)">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <input className="input" placeholder="من" style={{ fontSize: 14 }} />
                  <input className="input" placeholder="إلى" style={{ fontSize: 14 }} />
                </div>
              </FilterGroup>

              <FilterGroup label="نوع الوقود" last>
                {['بنزين', 'ديزل', 'كهربائي', 'هجين'].map(fuel => (
                  <label key={fuel} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 8 }}>
                    <input type="checkbox" style={{ accentColor: 'var(--color-yellow)', width: 16, height: 16 }} />
                    <span style={{ fontSize: 14 }}>{fuel}</span>
                  </label>
                ))}
              </FilterGroup>

              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
                <Search size={15} />
                تطبيق الفلاتر
              </button>
            </div>
          </aside>

          {/* Listings */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                طازجة من الساعة
                <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)', marginRight: 8 }}>({LISTINGS.length} إعلان)</span>
              </h2>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20,
            }}>
              {LISTINGS.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function Select({ options, placeholder }: { options: string[]; placeholder: string }) {
  return (
    <div style={{ position: 'relative' }}>
      <select className="input" style={{ appearance: 'none', paddingLeft: 32 }}>
        <option value="">{placeholder}</option>
        {options.slice(1).map(opt => <option key={opt}>{opt}</option>)}
      </select>
      <ChevronDown size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
    </div>
  )
}

function FilterGroup({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ marginBottom: last ? 20 : 20, paddingBottom: last ? 0 : 20, borderBottom: last ? 'none' : '1px solid var(--border-light)' }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: 'var(--text-primary)' }}>{label}</div>
      {children}
    </div>
  )
}
