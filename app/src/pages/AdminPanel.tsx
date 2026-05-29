import { useState, useEffect } from 'react'
import { Check, X, Eye, Users, Clock, RefreshCw } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import { emailSellerListingApproved, emailSellerListingRejected } from '../lib/emails'

const TABS = ['الإعلانات المعلقة', 'نشطة', 'مرفوضة', 'المستخدمون', 'الإحصاءات']


export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('الإعلانات المعلقة')
  const [listings,  setListings]  = useState<any[]>([])
  const [users,     setUsers]     = useState<any[]>([])
  const [stats,     setStats]     = useState({ pending: 0, active: 0, rejected: 0, total_users: 0 })
  const [loading,   setLoading]   = useState(true)
  const [rejectId,  setRejectId]  = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => { loadData() }, [activeTab])

  async function loadData() {
    setLoading(true)
    try {
      if (activeTab === 'الإحصاءات') {
        await loadStats()
      } else if (activeTab === 'المستخدمون') {
        await loadUsers()
      } else {
        const statusMap: Record<string, string> = {
          'الإعلانات المعلقة': 'pending',
          'نشطة': 'active',
          'مرفوضة': 'rejected',
        }
        await loadListings(statusMap[activeTab])
      }
    } finally {
      setLoading(false)
    }
  }

  async function loadListings(status: string) {
    const { data } = await supabase
      .from('listings')
      .select('*, listing_images(url), users(phone, name)')
      .eq('status', status)
      .order('created_at', { ascending: false })
    setListings(data ?? [])
  }

  async function loadUsers() {
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    setUsers(data ?? [])
  }

  async function loadStats() {
    const [pending, active, rejected, usersCount] = await Promise.all([
      supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'rejected'),
      supabase.from('users').select('id', { count: 'exact', head: true }),
    ])
    setStats({
      pending:     pending.count  ?? 0,
      active:      active.count   ?? 0,
      rejected:    rejected.count ?? 0,
      total_users: usersCount.count ?? 0,
    })
  }

  async function approveListing(id: string) {
    await supabase.from('listings').update({ status: 'active' }).eq('id', id)
    const listing = listings.find(l => l.id === id)
    if (listing?.users?.name || listing?.users?.phone) {
      // notify seller by email if they have one stored
      emailSellerListingApproved(
        listing.users.name ?? listing.users.phone,
        listing.title,
        id
      ).catch(() => {})
    }
    setListings(l => l.filter(x => x.id !== id))
  }

  async function rejectListing(id: string) {
    const reason = rejectReason || 'مخالف للشروط'
    await supabase.from('listings').update({ status: 'rejected', reject_reason: reason }).eq('id', id)
    const listing = listings.find(l => l.id === id)
    if (listing?.users?.name || listing?.users?.phone) {
      emailSellerListingRejected(
        listing.users.name ?? listing.users.phone,
        listing.title,
        reason
      ).catch(() => {})
    }
    setListings(l => l.filter(x => x.id !== id))
    setRejectId(null)
    setRejectReason('')
  }

  async function banUser(id: string) {
    if (!confirm('تأكيد حظر هذا المستخدم؟')) return
    await supabase.from('users').update({ verified: false }).eq('id', id)
    setUsers(u => u.map(x => x.id === id ? { ...x, verified: false } : x))
  }

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px 60px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>لوحة الإدارة</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>CARNA Admin Panel</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={loadData} className="btn-ghost" style={{ fontSize: 13 }}>
            <RefreshCw size={14} /> تحديث
          </button>
          {stats.pending > 0 && (
            <span style={{ background: '#DC2626', color: '#fff', fontSize: 12, fontWeight: 700, borderRadius: 9999, padding: '3px 10px' }}>
              {stats.pending} معلق
            </span>
          )}
        </div>
      </div>

      {/* Quick stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
        <MiniStat label="معلقة"      value={stats.pending}     color="#D97706" icon={<Clock size={16}/>} />
        <MiniStat label="نشطة"       value={stats.active}      color="#16A34A" icon={<Check size={16}/>} />
        <MiniStat label="مرفوضة"     value={stats.rejected}    color="#DC2626" icon={<X size={16}/>} />
        <MiniStat label="مستخدمون"   value={stats.total_users} color="#0053FA" icon={<Users size={16}/>} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--border-light)', marginBottom: 24 }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
            fontWeight: activeTab === tab ? 700 : 400,
            color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
            borderBottom: `2px solid ${activeTab === tab ? 'var(--color-yellow)' : 'transparent'}`,
            marginBottom: -2, fontSize: 14, fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}>{tab}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>جارٍ التحميل...</div>
      ) : (

        <>
          {/* Listings tabs */}
          {(activeTab === 'الإعلانات المعلقة' || activeTab === 'نشطة' || activeTab === 'مرفوضة') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {listings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>لا يوجد إعلانات</div>
              ) : listings.map(listing => (
                <div key={listing.id} className="card" style={{ display: 'flex', gap: 16, padding: 16, alignItems: 'flex-start' }}>

                  {/* Thumbnail */}
                  <img
                    src={listing.listing_images?.[0]?.url ?? 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=120&h=80&fit=crop'}
                    alt=""
                    style={{ width: 110, height: 74, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                  />

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{listing.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      {listing.price?.toLocaleString()} ل.س · {listing.city} · {listing.km?.toLocaleString()} كم
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      البائع: <strong>{listing.users?.name ?? listing.users?.phone ?? '—'}</strong>
                      <span style={{ margin: '0 8px' }}>·</span>
                      {new Date(listing.created_at).toLocaleDateString('ar-SY')}
                    </div>
                    {listing.reject_reason && (
                      <div style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>سبب الرفض: {listing.reject_reason}</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                    <Link to={`/listing/${listing.id}`} target="_blank" className="btn-ghost" style={{ padding: '8px 12px', fontSize: 13 }}>
                      <Eye size={14} />
                    </Link>
                    {activeTab === 'الإعلانات المعلقة' && (
                      <>
                        <button onClick={() => approveListing(listing.id)}
                          style={{ background: '#dcfce7', border: '1.5px solid #86efac', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', color: '#16A34A', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Check size={14} /> قبول
                        </button>
                        <button onClick={() => setRejectId(listing.id)}
                          style={{ background: '#fee2e2', border: '1.5px solid #fca5a5', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', color: '#DC2626', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <X size={14} /> رفض
                        </button>
                      </>
                    )}
                    {activeTab === 'نشطة' && (
                      <button onClick={() => setRejectId(listing.id)}
                        style={{ background: '#fee2e2', border: '1.5px solid #fca5a5', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', color: '#DC2626', fontWeight: 700, fontSize: 13 }}>
                        إلغاء
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Users tab */}
          {activeTab === 'المستخدمون' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {users.map(u => (
                <div key={u.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: u.is_admin ? '#1a1a1a' : 'var(--color-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                    {(u.name ?? u.phone ?? '?')[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name ?? '—'}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', direction: 'ltr', textAlign: 'right' }}>{u.phone}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {u.is_admin && (
                      <span style={{ fontSize: 11, fontWeight: 700, background: '#1a1a1a', color: '#fff', padding: '3px 10px', borderRadius: 9999 }}>Admin</span>
                    )}
                    {u.verified
                      ? <span style={{ fontSize: 12, color: '#16A34A', fontWeight: 600 }}>● نشط</span>
                      : <span style={{ fontSize: 12, color: '#DC2626', fontWeight: 600 }}>● محظور</span>
                    }
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(u.created_at).toLocaleDateString('ar-SY')}</span>
                    {!u.is_admin && u.verified && (
                      <button onClick={() => banUser(u.id)}
                        style={{ background: 'none', border: '1.5px solid #fca5a5', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', color: '#DC2626', fontSize: 12 }}>
                        حظر
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats tab */}
          {activeTab === 'الإحصاءات' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              <StatCard icon={<Clock size={24}/>}    label="إعلانات معلقة بانتظار المراجعة" value={stats.pending}     color="#D97706" />
              <StatCard icon={<Check size={24}/>}    label="إعلانات نشطة على الموقع"        value={stats.active}      color="#16A34A" />
              <StatCard icon={<X size={24}/>}        label="إعلانات مرفوضة"                 value={stats.rejected}    color="#DC2626" />
              <StatCard icon={<Users size={24}/>}    label="إجمالي المستخدمين المسجلين"     value={stats.total_users} color="#0053FA" />
            </div>
          )}
        </>
      )}

      {/* Reject modal */}
      {rejectId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 400 }}>
            <h3 style={{ fontWeight: 800, fontSize: 17, marginBottom: 16 }}>سبب الرفض</h3>
            <textarea
              className="input"
              rows={3}
              placeholder="اكتب السبب للبائع (اختياري)"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              style={{ resize: 'none', marginBottom: 16 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => rejectListing(rejectId)}
                style={{ flex: 1, background: '#DC2626', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                تأكيد الرفض
              </button>
              <button onClick={() => { setRejectId(null); setRejectReason('') }} className="btn-ghost" style={{ flex: 1 }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}

function MiniStat({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ color, opacity: 0.9 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="card" style={{ padding: '24px 28px', display: 'flex', gap: 18, alignItems: 'center' }}>
      <div style={{ color, background: color + '15', borderRadius: 12, padding: 14 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 32, fontWeight: 800 }}>{value}</div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
      </div>
    </div>
  )
}
