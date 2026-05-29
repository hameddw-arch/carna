import { useState, useEffect } from 'react'
import { Check, Zap, Star, Crown, Loader2, ChevronRight, Package } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const TIER_ICONS = [<Zap size={22}/>, <Star size={22}/>, <Crown size={22}/>]
const TIER_COLORS = ['#0053FA', '#7C3AED', '#D97706']

export default function Packages() {
  const { user }          = useAuth()
  const navigate          = useNavigate()
  const [params]          = useSearchParams()
  const listingId         = params.get('listing')

  const [packages,  setPackages]  = useState<any[]>([])
  const [listing,   setListing]   = useState<any>(null)
  const [wallet,    setWallet]    = useState(0)
  const [loading,   setLoading]   = useState(true)
  const [buying,    setBuying]    = useState<string | null>(null)
  const [success,   setSuccess]   = useState('')

  useEffect(() => {
    const loads: Promise<any>[] = [
      supabase.from('ad_packages').select('*').eq('active', true).order('price') as unknown as Promise<any>,
      (user ? supabase.from('users').select('wallet_balance').eq('id', user.id).single() : Promise.resolve({ data: null })) as Promise<any>,
    ]
    if (listingId) loads.push(supabase.from('listings').select('id,title,city').eq('id', listingId).single() as unknown as Promise<any>)

    Promise.all(loads).then(([pkgs, wal, lst]) => {
      setPackages(pkgs.data ?? [])
      setWallet(wal.data?.wallet_balance ?? 0)
      if (lst?.data) setListing(lst.data)
      setLoading(false)
    })
  }, [user, listingId])

  async function activate(pkg: any) {
    if (!user)      return navigate('/login')
    if (!listingId) return navigate('/dashboard')
    if (wallet < pkg.price) {
      if (confirm(`رصيدك غير كافٍ (${wallet.toLocaleString()} ل.س). هل تريد شحن المحفظة؟`))
        navigate('/wallet')
      return
    }
    setBuying(pkg.id)
    try {
      const endsAt = new Date(Date.now() + pkg.duration_days * 86400000).toISOString()
      await supabase.from('featured_listings').insert({
        listing_id: listingId,
        package_id: pkg.id,
        starts_at:  new Date().toISOString(),
        ends_at:    endsAt,
      })
      await supabase.from('users').update({ wallet_balance: wallet - pkg.price }).eq('id', user.id)
      await supabase.from('wallet_transactions').insert({
        user_id: user.id, amount: -pkg.price, type: 'debit', method: 'package', ref: pkg.name,
      })
      setWallet(w => w - pkg.price)
      setSuccess(`✅ تم تفعيل باقة "${pkg.name}" — إعلانك الآن مميز لمدة ${pkg.duration_days} يوم`)
    } finally {
      setBuying(null)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-4)' }}/>
    </div>
  )

  return (
    <main style={{ flex: 1, background: 'var(--off-white)' }}>

      {/* Header */}
      <div style={{ background: 'var(--dark)', padding: '48px 24px 40px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 16 }}>
            <Link to="/dashboard" style={{ color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}>حسابي</Link>
            <ChevronRight size={12}/>
            <span style={{ color: '#fff' }}>باقات الإعلان المميز</span>
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: '#fff', marginBottom: 10 }}>
            ميّز إعلانك — وصل أكثر
          </h1>
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 15 }}>
            الإعلانات المميزة تظهر في صدارة القائمة وتحصل على أكثر من 5 أضعاف المشاهدات
          </p>

          <div style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
            {user && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12, padding: '10px 18px' }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>رصيدك:</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--yellow)' }}>{wallet.toLocaleString()} ل.س</span>
                <Link to="/wallet" style={{ fontSize: 12, color: 'var(--yellow)', textDecoration: 'none' }}>+ شحن</Link>
              </div>
            )}
            {/* Target listing badge */}
            {listing && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(253,183,0,.15)', border: '1px solid rgba(253,183,0,.3)', borderRadius: 12, padding: '10px 18px' }}>
                <Package size={14} style={{ color: 'var(--yellow)' }}/>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.8)', fontWeight: 600 }}>
                  تمييز: {listing.title}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px 64px' }}>

        {success && (
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 14, padding: '16px 20px', marginBottom: 28, color: '#065F46', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{success}</span>
            <Link to="/dashboard" className="btn btn-yellow" style={{ fontSize: 13 }}>عرض الإعلان</Link>
          </div>
        )}

        {/* No listing selected warning */}
        {!listingId && user && !success && (
          <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 14, padding: '14px 18px', marginBottom: 24, fontSize: 14, color: '#92400E' }}>
            💡 لتفعيل باقة، اذهب لـ <Link to="/dashboard" style={{ fontWeight: 700, color: '#92400E' }}>لوحة التحكم</Link> واضغط زر <strong>"مميّز"</strong> على الإعلان الذي تريد ترقيته.
          </div>
        )}

        {/* Packages grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 48 }}>
          {packages.map((pkg, i) => {
            const color     = TIER_COLORS[i % 3]
            const isPopular = i === 1
            const features: string[] = pkg.features?.perks ?? [
              'يظهر في صدارة القائمة',
              `${pkg.duration_days} يوم مميز`,
              'شارة ⭐ مميز على الإعلان',
              'أولوية في نتائج البحث',
            ]
            return (
              <div key={pkg.id} style={{
                background:   isPopular ? 'var(--dark)' : '#fff',
                border:       `2px solid ${isPopular ? 'var(--yellow)' : 'var(--gray-200)'}`,
                borderRadius: 20, padding: '28px 24px',
                position:     'relative',
                boxShadow:    isPopular ? '0 8px 32px rgba(253,183,0,.2)' : 'var(--shadow-sm)',
              }}>
                {isPopular && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--yellow)', color: 'var(--dark)',
                    fontSize: 11, fontWeight: 800, padding: '4px 14px', borderRadius: 'var(--r-full)', whiteSpace: 'nowrap',
                  }}>الأكثر طلباً</div>
                )}

                <div style={{ color: isPopular ? 'var(--yellow)' : color, marginBottom: 12 }}>{TIER_ICONS[i % 3]}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: isPopular ? '#fff' : 'var(--text)', marginBottom: 6 }}>{pkg.name}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: isPopular ? 'var(--yellow)' : 'var(--text)', marginBottom: 4 }}>
                  {pkg.price.toLocaleString()}
                  <span style={{ fontSize: 14, fontWeight: 600, marginRight: 4, color: isPopular ? 'rgba(255,255,255,.4)' : 'var(--text-4)' }}>ل.س</span>
                </div>
                <div style={{ fontSize: 13, color: isPopular ? 'rgba(255,255,255,.4)' : 'var(--text-4)', marginBottom: 20 }}>لمدة {pkg.duration_days} يوم</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {features.map((f: string) => (
                    <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <Check size={14} style={{ color: isPopular ? 'var(--yellow)' : color, flexShrink: 0, marginTop: 2 }}/>
                      <span style={{ fontSize: 13, color: isPopular ? 'rgba(255,255,255,.7)' : 'var(--text-2)' }}>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`btn ${isPopular ? 'btn-yellow' : 'btn-outline'}`}
                  style={{ width: '100%', fontSize: 14, justifyContent: 'center', gap: 7 }}
                  disabled={!!buying || !!success}
                  onClick={() => activate(pkg)}
                >
                  {buying === pkg.id
                    ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }}/>
                    : listingId ? 'فعّل هذه الباقة' : 'اختر هذه الباقة'
                  }
                </button>
              </div>
            )
          })}
        </div>

        {/* How it works */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '32px', border: '1px solid var(--gray-200)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, textAlign: 'center' }}>كيف يعمل الإعلان المميز؟</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
            {[
              { n: '1', title: 'اشحن محفظتك',  desc: 'أضف رصيد بالطريقة المناسبة لك' },
              { n: '2', title: 'اختر إعلانك',  desc: 'من لوحة التحكم اضغط زر "مميّز" على إعلانك' },
              { n: '3', title: 'اختر الباقة',  desc: '7 أو 15 أو 30 يوم حسب حاجتك' },
              { n: '4', title: 'تصدّر القائمة', desc: 'إعلانك يظهر أول مع شارة ⭐ مميز فوراً' },
            ].map(s => (
              <div key={s.n} style={{ textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--yellow)', color: 'var(--dark)', fontSize: 18, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>{s.n}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
