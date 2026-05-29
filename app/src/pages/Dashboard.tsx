import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Trash2, LogOut, Wallet, Star, Loader2, Settings, Package, MessageCircle, Pencil } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { updateProfile } from '../lib/auth'

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  pending:  { label: 'قيد المراجعة', color: '#D97706', bg: '#FEF3C7' },
  active:   { label: 'نشط',          color: '#16A34A', bg: '#DCFCE7' },
  rejected: { label: 'مرفوض',        color: '#DC2626', bg: '#FEE2E2' },
  expired:  { label: 'منتهي',        color: '#6B7280', bg: '#F3F4F6' },
  sold:     { label: 'مباع',         color: '#0053FA', bg: '#EFF6FF' },
}

const TABS = [
  { id: 'listings',  label: 'إعلاناتي',   icon: <Star size={15}/> },
  { id: 'wallet',    label: 'المحفظة',    icon: <Wallet size={15}/> },
  { id: 'settings',  label: 'الإعدادات',  icon: <Settings size={15}/> },
]

export default function Dashboard() {
  const { user, logout, setUser } = useAuth()
  const [tab,      setTab]      = useState('listings')
  const [listings, setListings] = useState<any[]>([])
  const [balance,  setBalance]  = useState(0)
  const [loading,  setLoading]  = useState(true)
  const [name,     setName]     = useState(user?.name ?? '')
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  useEffect(() => {
    if (!user) return
    setName(user.name ?? '')
    Promise.all([
      supabase.from('listings').select('*, listing_images(url)').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('users').select('wallet_balance').eq('id', user.id).single(),
    ]).then(([l, w]) => {
      setListings(l.data ?? [])
      setBalance(w.data?.wallet_balance ?? 0)
      setLoading(false)
    })
  }, [user])

  async function deleteListing(id: string) {
    if (!confirm('تأكيد حذف الإعلان؟')) return
    await supabase.from('listings').delete().eq('id', id)
    setListings(l => l.filter(x => x.id !== id))
  }

  async function saveProfile() {
    if (!user) return
    setSaving(true)
    await updateProfile(user.id, name)
    setUser({ ...user, name })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!user) return null

  const active   = listings.filter(l => l.status === 'active').length
  const pending  = listings.filter(l => l.status === 'pending').length
  const views    = listings.reduce((s, l) => s + (l.views ?? 0), 0)

  return (
    <main style={{ flex: 1, background: 'var(--off-white)' }}>

      {/* Header */}
      <div style={{ background: 'var(--dark)', padding: '40px 24px 32px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'var(--yellow)', color: 'var(--dark)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 900, flexShrink: 0,
              }}>
                {(user.name ?? user.phone)[0].toUpperCase()}
              </div>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{user.name ?? 'حسابي'}</h1>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', direction: 'ltr', display: 'block' }}>{user.phone}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/post" className="btn btn-yellow" style={{ fontSize: 13, gap: 6 }}>
                <Plus size={14}/> إعلان جديد
              </Link>
              <Link to="/messages" className="btn" style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', color: '#fff', fontSize: 13, gap: 6 }}>
                <MessageCircle size={14}/> الرسائل
              </Link>
              <button onClick={logout} className="btn" style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', color: '#fff', fontSize: 13, gap: 6 }}>
                <LogOut size={14}/> خروج
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginTop: 28 }}>
            {[
              { label: 'إعلانات نشطة',   value: active,  color: '#22C55E' },
              { label: 'قيد المراجعة',   value: pending, color: '#FDB700' },
              { label: 'مشاهدات',        value: views,   color: '#60A5FA' },
              { label: 'رصيد المحفظة',   value: `${balance.toLocaleString()} ل.س`, color: '#FDB700' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,.06)', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 24px 64px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--gray-100)', borderRadius: 12, padding: 4, marginBottom: 24, width: 'fit-content' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 18px', borderRadius: 9, border: 'none',
              cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600,
              background: tab === t.id ? '#fff' : 'transparent',
              color: tab === t.id ? 'var(--text)' : 'var(--text-3)',
              boxShadow: tab === t.id ? 'var(--shadow-sm)' : 'none',
              transition: 'all 150ms ease',
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── LISTINGS ────────────────────────────── */}
        {tab === 'listings' && (
          <div>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
                <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-4)' }}/>
              </div>
            ) : listings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 20, border: '1px solid var(--gray-200)' }}>
                <div style={{ fontSize: 52, marginBottom: 14 }}>📢</div>
                <p style={{ color: 'var(--text-3)', marginBottom: 20, fontSize: 15 }}>ما نشرت أي إعلان بعد</p>
                <Link to="/post" className="btn btn-yellow" style={{ fontSize: 14 }}>
                  <Plus size={15}/> أضف إعلانك الأول
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {listings.map(listing => {
                  const st = STATUS[listing.status] ?? STATUS.pending
                  return (
                    <div key={listing.id} style={{
                      background: '#fff', borderRadius: 16, padding: '14px 16px',
                      border: '1px solid var(--gray-200)',
                      display: 'flex', gap: 16, alignItems: 'center',
                      boxShadow: 'var(--shadow-sm)',
                    }}>
                      <img
                        src={listing.listing_images?.[0]?.url ?? 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=120&h=80&fit=crop'}
                        alt={listing.title}
                        style={{ width: 100, height: 68, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {listing.title}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 6 }}>
                          {listing.price?.toLocaleString()} ل.س · {listing.city}
                        </div>
                        <span style={{
                          fontSize: 11, fontWeight: 700, color: st.color,
                          background: st.bg, padding: '3px 10px', borderRadius: 'var(--r-full)',
                        }}>
                          {st.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        {listing.status === 'active' && (
                          <Link to={`/packages?listing=${listing.id}`}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 5,
                              padding: '7px 12px', borderRadius: 9,
                              background: 'var(--yellow-light)', border: '1px solid var(--yellow)',
                              color: 'var(--yellow-dark)', fontSize: 12, fontWeight: 700,
                              textDecoration: 'none',
                            }}>
                            <Package size={12}/> مميّز
                          </Link>
                        )}
                        <Link to={`/listing/${listing.id}`}
                          style={{ display: 'flex', alignItems: 'center', padding: '7px 10px', borderRadius: 9, border: '1px solid var(--gray-200)', color: 'var(--text-3)', textDecoration: 'none' }}>
                          <Eye size={14}/>
                        </Link>
                        <Link to={`/edit/${listing.id}`}
                          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 9, border: '1px solid var(--gray-200)', color: 'var(--text-2)', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
                          <Pencil size={13}/> تعديل
                        </Link>
                        <button onClick={() => deleteListing(listing.id)}
                          style={{ display: 'flex', alignItems: 'center', padding: '7px 10px', borderRadius: 9, background: 'none', border: '1px solid #FCA5A5', cursor: 'pointer', color: '#DC2626' }}>
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── WALLET ──────────────────────────────── */}
        {tab === 'wallet' && (
          <div style={{ maxWidth: 480 }}>
            <div style={{
              background: 'var(--dark)', borderRadius: 20, padding: '28px',
              marginBottom: 16, textAlign: 'center',
            }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 6 }}>رصيدك الحالي</div>
              <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--yellow)', lineHeight: 1, marginBottom: 20 }}>
                {balance.toLocaleString()}
                <span style={{ fontSize: 16, fontWeight: 600, marginRight: 6, color: 'rgba(255,255,255,.4)' }}>ل.س</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Link to="/wallet" className="btn btn-yellow" style={{ fontSize: 14, justifyContent: 'center' }}>
                  شحن الرصيد
                </Link>
                <Link to="/packages" className="btn" style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', color: '#fff', fontSize: 14, justifyContent: 'center' }}>
                  <Package size={14}/> الباقات
                </Link>
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', border: '1px solid var(--gray-200)', fontSize: 13, color: 'var(--text-3)', lineHeight: 1.7 }}>
              💡 الرصيد يُستخدم لتمييز إعلاناتك — الإعلان المميز يظهر في صدارة القائمة ويحصل على أكثر من 5× مشاهدات.
            </div>
          </div>
        )}

        {/* ── SETTINGS ────────────────────────────── */}
        {tab === 'settings' && (
          <div style={{ maxWidth: 440 }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: '28px', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 22 }}>معلوماتي</h3>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-2)', marginBottom: 7 }}>الاسم</label>
                <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="اكتب اسمك"/>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-2)', marginBottom: 7 }}>رقم الموبايل</label>
                <input className="input" value={user.phone} disabled style={{ opacity: .5, cursor: 'not-allowed' }} dir="ltr"/>
              </div>

              <button className="btn btn-yellow" onClick={saveProfile} disabled={saving}
                style={{ width: '100%', fontSize: 15, justifyContent: 'center' }}>
                {saving
                  ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }}/>
                  : saved ? '✅ تم الحفظ' : 'حفظ التغييرات'
                }
              </button>
            </div>

            <div style={{ marginTop: 16, background: '#fff', borderRadius: 16, padding: '18px 20px', border: '1px solid var(--gray-200)' }}>
              <button onClick={logout} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--error)', fontSize: 14, fontWeight: 700,
                fontFamily: 'var(--font)', width: '100%',
              }}>
                <LogOut size={15}/> تسجيل الخروج
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
