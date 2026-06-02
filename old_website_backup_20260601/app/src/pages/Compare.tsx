import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Loader2, Check, X, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { clearCompare } from '../lib/compare'
import SEO from '../components/SEO'

const SPECS = [
  { key: 'price',        label: 'السعر',          format: (v: any) => v ? `${Number(v).toLocaleString()} ل.س` : '—' },
  { key: 'year',         label: 'سنة الصنع',      format: (v: any) => v ?? '—' },
  { key: 'km',           label: 'الكيلومتراج',    format: (v: any) => v ? `${Number(v).toLocaleString()} كم` : '—' },
  { key: 'fuel',         label: 'نوع الوقود',     format: (v: any) => v ?? '—' },
  { key: 'transmission', label: 'ناقل الحركة',    format: (v: any) => v ?? '—' },
  { key: 'color',        label: 'اللون',           format: (v: any) => v ?? '—' },
  { key: 'city',         label: 'المدينة',         format: (v: any) => v ?? '—' },
  { key: 'seller_type',  label: 'نوع البائع',      format: (v: any) => v === 'dealer' ? 'وكيل / معرض' : 'مالك مباشر' },
]

export default function Compare() {
  const [params]  = useSearchParams()
  const ids       = (params.get('ids') ?? '').split(',').filter(Boolean).slice(0, 3)
  const [cars,    setCars]    = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ids.length) { setLoading(false); return }
    supabase.from('listings')
      .select('*, listing_images(url)')
      .in('id', ids)
      .then(({ data }) => {
        // preserve original order
        const ordered = ids.map(id => data?.find(c => c.id === id)).filter(Boolean)
        setCars(ordered)
        setLoading(false)
      })
  }, [params.get('ids')])

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-4)' }}/>
    </div>
  )

  if (!cars.length) return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, background: 'var(--off-white)' }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>لا يوجد سيارات للمقارنة</h2>
      <p style={{ color: 'var(--text-3)', marginBottom: 24 }}>اختر سيارتين على الأقل من القائمة لبدء المقارنة</p>
      <Link to="/" className="btn btn-yellow">تصفح الإعلانات</Link>
    </main>
  )

  return (
    <main style={{ flex: 1, background: 'var(--off-white)' }}>
      <SEO title="مقارنة السيارات" url="/compare"/>

      {/* Header */}
      <div style={{ background: 'var(--dark)', padding: '32px 24px 28px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 14 }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}>الرئيسية</Link>
            <ChevronRight size={12}/>
            <span style={{ color: '#fff' }}>مقارنة السيارات</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>مقارنة السيارات</h1>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px 100px' }}>

        {/* Car headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `200px repeat(${cars.length}, 1fr)`,
          gap: 12, marginBottom: 24,
        }}>
          <div/>
          {cars.map(car => {
            const img = car.listing_images?.[0]?.url
            return (
              <div key={car.id} style={{
                background: '#fff', borderRadius: 20, overflow: 'hidden',
                border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)',
                position: 'relative',
              }}>
                <div style={{ aspectRatio: '16/9', background: 'var(--gray-100)', position: 'relative' }}>
                  {img
                    ? <img src={img} alt={car.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🚗</div>
                  }
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4, lineHeight: 1.4 }}>{car.title}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--yellow-dark)' }}>
                    {Number(car.price).toLocaleString()} ل.س
                  </div>
                  <Link to={`/listing/${car.id}`} className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'center', fontSize: 13, marginTop: 12 }}>
                    عرض الإعلان
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Specs comparison table */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid var(--gray-200)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          {SPECS.map((spec, idx) => {
            const values = cars.map(c => c[spec.key])
            const best = getBest(spec.key, values)
            return (
              <div key={spec.key} style={{
                display: 'grid',
                gridTemplateColumns: `200px repeat(${cars.length}, 1fr)`,
                background: idx % 2 === 0 ? '#fff' : 'var(--gray-50, #F9FAFB)',
                borderBottom: '1px solid var(--gray-100)',
              }}>
                {/* Label */}
                <div style={{ padding: '16px 20px', fontSize: 14, fontWeight: 700, color: 'var(--text-2)', display: 'flex', alignItems: 'center' }}>
                  {spec.label}
                </div>
                {/* Values */}
                {cars.map((car, i) => {
                  const val   = car[spec.key]
                  const isBest = best !== null && String(val) === String(best)
                  return (
                    <div key={car.id} style={{
                      padding: '16px 20px', fontSize: 15, fontWeight: isBest ? 800 : 500,
                      color: isBest ? '#16A34A' : 'var(--text)',
                      display: 'flex', alignItems: 'center', gap: 8,
                      borderRight: i > 0 ? '1px solid var(--gray-100)' : 'none',
                    }}>
                      {isBest && <Check size={14} style={{ color: '#16A34A', flexShrink: 0 }}/>}
                      {spec.format(val)}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center' }}>
          <button onClick={() => { clearCompare(); window.history.back() }}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, background: 'var(--gray-100)', border: '1px solid var(--gray-200)', cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font)', color: 'var(--text-2)' }}>
            <X size={14}/> مسح المقارنة
          </button>
          <Link to="/" className="btn btn-yellow" style={{ fontSize: 14 }}>
            + أضف سيارة أخرى
          </Link>
        </div>
      </div>
    </main>
  )
}

// Determines the "best" value for highlighting (lowest price/km, highest year)
function getBest(key: string, values: any[]): any {
  const nums = values.map(Number).filter(n => !isNaN(n) && n > 0)
  if (!nums.length) return null
  if (key === 'price' || key === 'km') return Math.min(...nums)
  if (key === 'year') return Math.max(...nums)
  return null
}
