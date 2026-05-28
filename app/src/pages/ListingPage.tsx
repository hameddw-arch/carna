import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Calendar, Gauge, Fuel, Settings, Palette, User, ChevronRight, ChevronLeft, Share2, Star, Shield, Phone, MessageCircle, Loader2 } from 'lucide-react'
import { fetchListing, fetchListings } from '../lib/queries'

export default function ListingPage() {
  const { id } = useParams()
  const [listing,   setListing]   = useState<any>(null)
  const [related,   setRelated]   = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [saved,     setSaved]     = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setActiveImg(0)
    fetchListing(id)
      .then(data => {
        setListing(data)
        return fetchListings()
      })
      .then(all => setRelated(all.filter(l => l.id !== id).slice(0, 3)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
      <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-muted)' }} />
    </div>
  )
  if (!listing) return null

  const images = listing.images?.length ? listing.images : [listing.image]

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px 60px' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
        <Link to="/" style={{ color: 'var(--color-blue)', textDecoration: 'none' }}>الرئيسية</Link>
        <ChevronLeft size={12} />
        <span>{listing.title}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }} className="listing-layout">

        {/* LEFT — images + details */}
        <div>
          {/* Image Gallery */}
          <div style={{ borderRadius: 16, overflow: 'hidden', background: '#000', position: 'relative', aspectRatio: '16/9', marginBottom: 10 }}>
            <img src={images[activeImg]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.95 }} />

            {/* Nav arrows */}
            {activeImg > 0 && (
              <button onClick={() => setActiveImg(i => i - 1)} style={arrowBtn('right')}>
                <ChevronRight size={20} />
              </button>
            )}
            {activeImg < images.length - 1 && (
              <button onClick={() => setActiveImg(i => i + 1)} style={arrowBtn('left')}>
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Counter */}
            <span style={{ position: 'absolute', bottom: 14, left: 14, background: 'rgba(0,0,0,.6)', color: '#fff', fontSize: 12, padding: '4px 10px', borderRadius: 9999 }}>
              📷 {images.length}
            </span>
          </div>

          {/* Thumbnails */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
            {images.map((img: string, i: number) => (
              <button key={i} onClick={() => setActiveImg(i)} style={{
                width: 80, height: 54, borderRadius: 8, overflow: 'hidden', border: `2px solid ${activeImg === i ? 'var(--color-yellow)' : 'transparent'}`,
                padding: 0, cursor: 'pointer', flexShrink: 0,
              }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>

          {/* Specs */}
          <div style={{ background: 'var(--bg-subtle)', borderRadius: 14, padding: 20, marginBottom: 24 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>المواصفات</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <Spec icon={<Calendar size={16}/>} label="سنة الصنع" value={String(listing.year)} />
              <Spec icon={<Gauge size={16}/>}    label="الكيلومترات" value={`${listing.km} كم`} />
              <Spec icon={<Fuel size={16}/>}     label="نوع الوقود" value={listing.fuel} />
              <Spec icon={<Settings size={16}/>} label="ناقل الحركة" value="أوتوماتيك" />
              <Spec icon={<Palette size={16}/>}  label="اللون" value="أبيض" />
              <Spec icon={<User size={16}/>}     label="نوع البائع" value="شخصي" />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>وصف الإعلان</h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              سيارة بحالة ممتازة، صيانة دورية منتظمة عند الوكيل، لا حوادث ولا دهان.
              السيارة فحصت فنياً مؤخراً وكل شيء سليم. جاهزة للتسجيل والنقل مباشرة.
              السعر قابل للنقاش بشكل معقول للجادين فقط.
            </p>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
            {[`#${listing.city}`, `#${listing.year}`, '#بنزين', '#أوتوماتيك'].map(tag => (
              <Link key={tag} to={`/?tag=${tag}`} className="tag">{tag}</Link>
            ))}
          </div>

          {/* Related */}
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>إعلانات مشابهة</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {related.map(r => (
                <Link key={r.id} to={`/listing/${r.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ cursor: 'pointer' }}>
                    <img src={r.image} alt={r.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{r.price} ل.س</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.title}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — sticky panel */}
        <aside style={{ position: 'sticky', top: 80 }}>
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            {/* Price */}
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
              {listing.price}
              <span style={{ fontSize: 15, fontWeight: 400, color: 'var(--text-muted)', marginRight: 6 }}>ل.س</span>
            </div>
            <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{listing.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>
              <MapPin size={13}/> {listing.city}
              <span>·</span>
              <span>منذ {listing.hours} ساعات</span>
            </div>

            {/* CTA buttons */}
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 10, fontSize: 15 }}>
              <MessageCircle size={17}/>
              راسل البائع
            </button>
            <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: 15 }}>
              <Phone size={16}/>
              اطلب رقم الهاتف
            </button>
          </div>

          {/* Seller */}
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>
                {listing.seller[0]}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{listing.seller}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>بائع منذ 2023</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s<=4 ? 'var(--color-yellow)' : 'none'} color={s<=4 ? 'var(--color-yellow)' : 'var(--color-gray)'} />)}
              <span style={{ marginRight: 4 }}>4.8 (12 تقييم)</span>
            </div>
          </div>

          {/* Safety */}
          <div style={{ background: 'var(--yellow-50)', border: '1px solid var(--yellow-100)', borderRadius: 12, padding: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Shield size={18} style={{ color: 'var(--yellow-600)', flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 13, color: '#92400e', lineHeight: 1.6 }}>
              <strong>نصيحة الأمان:</strong> تحقق من السيارة قبل الدفع. استخدم مراكز الفحص الفني المعتمدة في قسم الورشات.
            </div>
          </div>

          {/* Save + Share */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={() => setSaved(s => !s)} className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>
              <Star size={14} fill={saved ? 'var(--color-yellow)' : 'none'} color={saved ? 'var(--color-yellow)' : 'currentColor'} />
              {saved ? 'محفوظ' : 'احفظ'}
            </button>
            <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>
              <Share2 size={14} />
              شارك
            </button>
          </div>
        </aside>
      </div>
    </main>
  )
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 12 }}>
        {icon} {label}
      </div>
      <div style={{ fontWeight: 700, fontSize: 15 }}>{value}</div>
    </div>
  )
}

function arrowBtn(side: 'right' | 'left'): React.CSSProperties {
  return {
    position: 'absolute', top: '50%', [side]: 12,
    transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,.9)', border: 'none', borderRadius: '50%',
    width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,.2)',
  }
}
