import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Trash2, Edit2, LogOut, Wallet, Bell, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const TABS = ['إعلاناتي', 'الرسائل', 'المحفظة', 'إعداداتي']
const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:  { label: 'قيد المراجعة', color: '#D97706' },
  active:   { label: 'نشط',          color: '#16A34A' },
  rejected: { label: 'مرفوض',        color: '#DC2626' },
  expired:  { label: 'منتهي',        color: '#9CA3AF' },
  sold:     { label: 'مباع',         color: '#0053FA' },
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('إعلاناتي')
  const [listings,  setListings]  = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('listings')
      .select('*, listing_images(url)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setListings(data ?? [])
        setLoading(false)
      })
  }, [user])

  async function deleteListing(id: string) {
    if (!confirm('تأكد من حذف الإعلان؟')) return
    await supabase.from('listings').delete().eq('id', id)
    setListings(l => l.filter(x => x.id !== id))
  }

  if (!user) return null

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px 60px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--color-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20 }}>
            {(user.name ?? user.phone)[0]}
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800 }}>{user.name ?? 'حسابي'}</h1>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', direction: 'ltr', display: 'block' }}>{user.phone}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/post" className="btn-primary" style={{ fontSize: 14 }}>
            <Plus size={15} /> إعلان جديد
          </Link>
          <button onClick={logout} className="btn-ghost" style={{ fontSize: 14 }}>
            <LogOut size={15} /> خروج
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard icon={<Eye size={20}/>}    label="مشاهدات الإعلانات" value={listings.reduce((s, l) => s + (l.views ?? 0), 0)} />
        <StatCard icon={<Bell size={20}/>}   label="إعلانات نشطة"     value={listings.filter(l => l.status === 'active').length} />
        <StatCard icon={<Wallet size={20}/>} label="رصيد المحفظة"     value={`${(user.wallet_balance ?? 0).toLocaleString()} ل.س`} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--border-light)', marginBottom: 24 }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '10px 18px', background: 'none', border: 'none', cursor: 'pointer',
            fontWeight: activeTab === tab ? 700 : 400,
            color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
            borderBottom: `2px solid ${activeTab === tab ? 'var(--color-yellow)' : 'transparent'}`,
            marginBottom: -2, fontSize: 14, fontFamily: 'inherit',
          }}>{tab}</button>
        ))}
      </div>

      {/* Listings tab */}
      {activeTab === 'إعلاناتي' && (
        <div>
          {loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>جارٍ التحميل...</p>
          ) : listings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📢</div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>ما في إعلانات بعد</p>
              <Link to="/post" className="btn-primary">أضف إعلانك الأول</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {listings.map(listing => {
                const st = STATUS_LABEL[listing.status] ?? STATUS_LABEL.pending
                return (
                  <div key={listing.id} className="card" style={{ display: 'flex', gap: 16, padding: 16, alignItems: 'center' }}>
                    <img
                      src={listing.listing_images?.[0]?.url ?? 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=120&h=80&fit=crop'}
                      alt={listing.title}
                      style={{ width: 100, height: 68, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 15 }}>{listing.title}</div>
                      <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                        {listing.price?.toLocaleString()} ل.س · {listing.city}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: st.color, marginTop: 6, display: 'inline-block' }}>
                        ● {st.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <Link to={`/listing/${listing.id}`} className="btn-ghost" style={{ padding: '8px 12px', fontSize: 13 }}>
                        <Eye size={14} />
                      </Link>
                      <button onClick={() => deleteListing(listing.id)} style={{ background: 'none', border: '1.5px solid #fee2e2', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', color: 'var(--color-error)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Messages tab */}
      {activeTab === 'الرسائل' && (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
          <p>ما في رسائل بعد</p>
        </div>
      )}

      {/* Wallet tab */}
      {activeTab === 'المحفظة' && (
        <div style={{ maxWidth: 400 }}>
          <div className="card" style={{ padding: 24, marginBottom: 16, textAlign: 'center' }}>
            <Wallet size={32} style={{ color: 'var(--color-yellow)', marginBottom: 8 }} />
            <div style={{ fontSize: 28, fontWeight: 800 }}>{(user.wallet_balance ?? 0).toLocaleString()}</div>
            <div style={{ color: 'var(--text-muted)', marginBottom: 16 }}>ليرة سورية</div>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>شحّن رصيدك</button>
          </div>
        </div>
      )}

      {/* Settings tab */}
      {activeTab === 'إعداداتي' && (
        <div style={{ maxWidth: 400 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>معلوماتي</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>الاسم</label>
              <input className="input" defaultValue={user.name ?? ''} placeholder="اسمك" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>رقم الموبايل</label>
              <input className="input" value={user.phone} disabled style={{ opacity: .6 }} />
            </div>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>حفظ التغييرات</button>
          </div>
        </div>
      )}
    </main>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="card" style={{ padding: '18px 20px' }}>
      <div style={{ color: 'var(--color-yellow)', marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 800 }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</div>
    </div>
  )
}
