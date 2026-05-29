import { useState, useEffect } from 'react'
import { Check, Zap, Star, Crown, Loader2, ChevronRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const TIER_ICONS = { basic: <Zap size={22}/>, pro: <Star size={22}/>, premium: <Crown size={22}/> }
const TIER_COLORS: Record<string, string> = { basic: '#0053FA', pro: '#7C3AED', premium: '#D97706' }

export default function Packages() {
  const { user }     = useAuth()
  const navigate     = useNavigate()
  const [packages,   setPackages]   = useState<any[]>([])
  const [wallet,     setWallet]     = useState<number>(0)
  const [loading,    setLoading]    = useState(true)
  const [buying,     setBuying]     = useState<string | null>(null)
  const [success,    setSuccess]    = useState('')

  useEffect(() => {
    Promise.all([
      supabase.from('ad_packages').select('*').eq('active', true).order('price'),
      user ? supabase.from('users').select('wallet_balance').eq('id', user.id).single() : Promise.resolve({ data: null }),
    ]).then(([pkgs, wal]) => {
      setPackages(pkgs.data ?? [])
      setWallet(wal.data?.wallet_balance ?? 0)
      setLoading(false)
    })
  }, [user])

  async function buyPackage(pkg: any, listingId?: string) {
    if (!user) return navigate('/login')
    if (wallet < pkg.price) return alert('رصيدك غير كافٍ — اشحن محفظتك أولاً')
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
        user_id: user.id,
        amount:  -pkg.price,
        type:    'debit',
        method:  'package',
        ref:     pkg.name,
      })
      setWallet(w => w - pkg.price)
      setSuccess(`تم تفعيل باقة "${pkg.name}" بنجاح ✅`)
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
          {user && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              marginTop: 20, background: 'rgba(255,255,255,.08)',
              border: '1px solid rgba(255,255,255,.12)',
              borderRadius: 12, padding: '10px 18px',
            }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>رصيد محفظتك:</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--yellow)' }}>
                {wallet.toLocaleString()} ل.س
              </span>
              <Link to="/wallet" style={{ fontSize: 12, color: 'var(--yellow)', textDecoration: 'none', marginRight: 4 }}>+ شحن</Link>
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px 64px' }}>

        {success && (
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '14px 18px', marginBottom: 24, color: '#065F46', fontWeight: 600 }}>
            {success}
          </div>
        )}

        {/* Packages grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 48 }}>
          {packages.map((pkg, i) => {
            const color = Object.values(TIER_COLORS)[i % 3]
            const isPopular = i === 1
            const features: string[] = pkg.features?.perks ?? [
              'يظهر في صدارة القائمة',
              `${pkg.duration_days} يوم مميز`,
              'شارة ⭐ مميز على الإعلان',
              'أولوية في نتائج البحث',
            ]
            return (
              <div key={pkg.id} style={{
                background: isPopular ? 'var(--dark)' : '#fff',
                border: `2px solid ${isPopular ? 'var(--yellow)' : 'var(--gray-200)'}`,
                borderRadius: 20, padding: '28px 24px',
                position: 'relative',
                boxShadow: isPopular ? 'var(--shadow-yellow)' : 'var(--shadow-sm)',
              }}>
                {isPopular && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--yellow)', color: 'var(--dark)',
                    fontSize: 11, fontWeight: 800, padding: '4px 14px', borderRadius: 'var(--r-full)',
                    whiteSpace: 'nowrap',
                  }}>الأكثر طلباً</div>
                )}

                <div style={{ color: isPopular ? 'var(--yellow)' : color, marginBottom: 12 }}>
                  {Object.values(TIER_ICONS)[i % 3]}
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: isPopular ? '#fff' : 'var(--text)', marginBottom: 6 }}>{pkg.name}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: isPopular ? 'var(--yellow)' : 'var(--text)', marginBottom: 4 }}>
                  {pkg.price.toLocaleString()}
                  <span style={{ fontSize: 14, fontWeight: 600, marginRight: 4 }}>ل.س</span>
                </div>
                <div style={{ fontSize: 13, color: isPopular ? 'rgba(255,255,255,.4)' : 'var(--text-4)', marginBottom: 20 }}>
                  لمدة {pkg.duration_days} يوم
                </div>

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
                  style={{ width: '100%', fontSize: 14 }}
                  disabled={buying === pkg.id}
                  onClick={() => user ? navigate(`/dashboard?upgrade=${pkg.id}`) : navigate('/login')}
                >
                  {buying === pkg.id
                    ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }}/>
                    : 'اختر هذه الباقة'
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
              { n: '1', title: 'اشحن محفظتك', desc: 'أضف رصيد بالطريقة المناسبة لك' },
              { n: '2', title: 'اختر إعلانك', desc: 'من لوحة التحكم اختر الإعلان المراد تمييزه' },
              { n: '3', title: 'اختر الباقة', desc: '7 أو 15 أو 30 يوم حسب حاجتك' },
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
