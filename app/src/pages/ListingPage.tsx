import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Gauge, Fuel, Settings, Palette, User, ChevronRight, ChevronLeft, Share2, Star, Shield, Phone, MessageCircle, Loader2 } from 'lucide-react'
import { fetchListing, fetchListings } from '../lib/queries'
import { threadKey } from '../lib/chat'
import { useAuth } from '../contexts/AuthContext'
import SEO from '../components/SEO'

export default function ListingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [listing,   setListing]   = useState<any>(null)
  const [related,   setRelated]   = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [saved,     setSaved]     = useState(false)

  function startChat() {
    if (!user) return navigate('/login')
    if (!listing?.user_id) return
    if (user.id === listing.user_id) return alert('لا يمكنك مراسلة نفسك — هذا إعلانك')
    navigate(`/messages/${threadKey(listing.id, listing.user_id)}`)
  }

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
    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0', background: 'var(--color-yellow)', minHeight: 'calc(100vh - 68px)' }}>
      <Loader2 size={36} strokeWidth={3} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-black)' }} />
    </div>
  )
  if (!listing) return null

  const images = listing.images?.length ? listing.images : [listing.image]

  return (
    <div style={{ background: 'var(--off-white)', minHeight: 'calc(100vh - 68px)' }}>
      <SEO
        title={listing.title}
        description={`${listing.make} ${listing.model} ${listing.year} — ${listing.city} — ${Number(listing.price).toLocaleString()} ل.س`}
        image={listing.images?.[0]}
        url={`/listing/${listing.id}`}
        type="article"
      />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px 60px' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 24 }}>
          <Link to="/" style={{ color: 'var(--text-primary)', textDecoration: 'none', background: 'var(--color-white)', border: '1px solid var(--border-subtle)', padding: '6px 14px', borderRadius: 'var(--radius-sm)' }}>الرئيسية</Link>
          <ChevronLeft size={16} color="var(--text-secondary)" />
          <span style={{ background: 'var(--color-white)', border: '1px solid var(--border-subtle)', padding: '6px 14px', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}>{listing.title}</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }} className="listing-layout">

          {/* LEFT — images + details */}
          <div>
            {/* Image Gallery */}
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--color-white)', position: 'relative', aspectRatio: '16/9', marginBottom: 12, border: '1px solid var(--border-subtle)' }}>
              <img src={images[activeImg]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

              {/* Nav arrows */}
              {activeImg > 0 && (
                <button onClick={() => setActiveImg(i => i - 1)} style={arrowBtn('right')} className="hover-blue">
                  <ChevronRight size={24} />
                </button>
              )}
              {activeImg < images.length - 1 && (
                <button onClick={() => setActiveImg(i => i + 1)} style={arrowBtn('left')} className="hover-blue">
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Counter */}
              <span style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(255,255,255,0.9)', color: 'var(--color-black)', fontSize: 13, fontWeight: 700, padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
                📷 {activeImg + 1} / {images.length}
              </span>
            </div>

            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 32, overflowX: 'auto', paddingBottom: 8 }}>
              {images.map((img: string, i: number) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{
                  width: 90, height: 64, borderRadius: 'var(--radius-sm)', overflow: 'hidden', 
                  border: `2px solid ${activeImg === i ? 'var(--color-blue)' : 'transparent'}`,
                  padding: 0, cursor: 'pointer', flexShrink: 0,
                  transition: 'all var(--transition-fast)',
                  opacity: activeImg === i ? 1 : 0.7
                }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>

            {/* Specs */}
            <div className="card" style={{ padding: 28, marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>المواصفات</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
                <Spec icon={<Calendar size={18} color="var(--text-secondary)" />} label="سنة الصنع" value={String(listing.year)} />
                <Spec icon={<Gauge size={18} color="var(--text-secondary)" />}    label="الكيلومترات" value={`${listing.km} كم`} />
                <Spec icon={<Fuel size={18} color="var(--text-secondary)" />}     label="نوع الوقود" value={listing.fuel} />
                <Spec icon={<Settings size={18} color="var(--text-secondary)" />} label="ناقل الحركة" value="أوتوماتيك" />
                <Spec icon={<Palette size={18} color="var(--text-secondary)" />}  label="اللون" value="أبيض" />
                <Spec icon={<User size={18} color="var(--text-secondary)" />}     label="نوع البائع" value="شخصي" />
              </div>
            </div>

            {/* Description */}
            <div className="card" style={{ padding: 28, marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>وصف الإعلان</h2>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                سيارة بحالة ممتازة، صيانة دورية منتظمة عند الوكيل، لا حوادث ولا دهان.<br/>
                السيارة فحصت فنياً مؤخراً وكل شيء سليم. جاهزة للتسجيل والنقل مباشرة.<br/>
                السعر قابل للنقاش بشكل معقول للجادين فقط.
              </p>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              {[`#${listing.city}`, `#${listing.year}`, '#بنزين', '#أوتوماتيك'].map(tag => (
                <Link key={tag} to={`/?tag=${tag}`} className="tag">{tag}</Link>
              ))}
            </div>

            {/* Related */}
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>إعلانات مشابهة</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
                {related.map(r => (
                  <Link key={r.id} to={`/listing/${r.id}`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ cursor: 'pointer' }}>
                      <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <img src={r.image} alt={r.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
                      </div>
                      <div style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', marginBottom: 4 }}>{r.price} ل.س</div>
                        <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{r.title}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — sticky panel */}
          <aside style={{ position: 'sticky', top: 88 }}>
            <div className="card" style={{ padding: 28, marginBottom: 20 }}>
              {/* Price */}
              <div style={{ 
                fontSize: 32, 
                fontWeight: 700, 
                color: 'var(--text-primary)', 
                marginBottom: 8,
              }}>
                {listing.price} <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--text-secondary)' }}>ل.س</span>
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, lineHeight: 1.4 }}>{listing.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={16} /> {listing.city}</div>
                <span>·</span>
                <span>منذ {listing.hours} ساعات</span>
              </div>

              {/* CTA buttons */}
              <button onClick={startChat} className="btn btn-yellow" style={{ width: '100%', justifyContent: 'center', marginBottom: 10, fontSize: 15, padding: '13px 20px' }}>
                <MessageCircle size={18} />
                راسل البائع
              </button>
              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginBottom: 10, fontSize: 15, padding: '13px 20px' }}>
                <Phone size={16} />
                اطلب رقم الهاتف
              </button>

              {/* Inspection CTA */}
              <a href={`/services?city=${encodeURIComponent(listing.city ?? '')}&category=فحص فني`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 16px', borderRadius: 12, marginTop: 6,
                  background: '#ECFDF5', border: '1px solid #A7F3D0',
                  textDecoration: 'none', color: '#065F46', fontSize: 13, fontWeight: 600,
                }}>
                <span style={{ fontSize: 18 }}>🔍</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>احجز فحصاً قبل الشراء</div>
                  <div style={{ fontSize: 12, fontWeight: 400, opacity: .75 }}>مراكز فحص معتمدة في {listing.city}</div>
                </div>
              </a>
            </div>

            {/* Seller */}
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 24, color: 'var(--text)' }}>
                  {(listing.users?.name ?? listing.users?.phone ?? 'م')[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{listing.users?.name ?? 'مستخدم كارنا'}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>
                    {listing.seller_type === 'dealer' ? '🏢 وكيل / معرض' : '👤 مالك مباشر'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 14, color: 'var(--text-primary)' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s<=4 ? 'var(--color-yellow)' : 'none'} color={s<=4 ? 'var(--color-yellow)' : 'var(--border-subtle)'} />)}
                <span style={{ marginRight: 8, fontSize: 13, color: 'var(--text-secondary)' }}>4.8 (12 تقييم)</span>
              </div>
            </div>

            {/* Safety */}
            <div className="card" style={{ background: '#FFFDF0', padding: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Shield size={24} style={{ color: 'var(--color-yellow)', flexShrink: 0 }} />
              <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                <strong style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>نصيحة الأمان</strong>
                تحقق من السيارة قبل الدفع. استخدم مراكز الفحص الفني المعتمدة في قسم الورشات.
              </div>
            </div>

            {/* Save + Share */}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button onClick={() => setSaved(s => !s)} className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 14, background: 'var(--color-white)' }}>
                <Star size={18} fill={saved ? 'var(--color-yellow)' : 'none'} color={saved ? 'var(--color-yellow)' : 'currentColor'} />
                {saved ? 'محفوظ' : 'احفظ'}
              </button>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 14, background: 'var(--color-white)' }}>
                <Share2 size={18} />
                شارك
              </button>
            </div>
          </aside>
        </div>
      </main>
      <style>{`
        .hover-blue:hover {
          background: var(--color-blue) !important;
          color: white !important;
          border-color: var(--color-blue) !important;
        }
      `}</style>
    </div>
  )
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', padding: '16px', display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13 }}>
        {icon} {label}
      </div>
      <div style={{ fontWeight: 700, fontSize: 16 }}>{value}</div>
    </div>
  )
}

function arrowBtn(side: 'right' | 'left'): React.CSSProperties {
  return {
    position: 'absolute', top: '50%', [side]: 16,
    transform: 'translateY(-50%)',
    background: 'var(--color-white)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-full)',
    width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    transition: 'all var(--transition-fast)'
  }
}
