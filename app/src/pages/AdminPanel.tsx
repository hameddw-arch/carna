import { useState, useEffect } from 'react'
import { Check, X, Eye, Users, Clock, RefreshCw, Wrench, MapPin, Phone, MessageCircle, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import { emailSellerListingApproved, emailSellerListingRejected } from '../lib/emails'

const TABS = ['الإعلانات المعلقة', 'نشطة', 'مرفوضة', 'الورشات', 'الإعلانات', 'المستخدمون', 'الإحصاءات']

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('الإعلانات المعلقة')
  const [listings,  setListings]  = useState<any[]>([])
  const [workshops, setWorkshops] = useState<any[]>([])
  const [users,     setUsers]     = useState<any[]>([])
  const [ads,       setAds]       = useState<any[]>([])
  const [adForm,    setAdForm]    = useState({ title: '', body_text: '', link_url: '', cta_text: 'تعرف أكثر', image_url: '', position: 'home_middle' })
  const [savingAd,  setSavingAd]  = useState(false)
  const [stats,     setStats]     = useState({ pending: 0, active: 0, rejected: 0, total_users: 0, pending_workshops: 0 })
  const [loading,   setLoading]   = useState(true)
  const [rejectId,  setRejectId]  = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => { loadData() }, [activeTab])

  async function loadData() {
    setLoading(true)
    try {
      if      (activeTab === 'الإحصاءات')       await loadStats()
      else if (activeTab === 'المستخدمون')      await loadUsers()
      else if (activeTab === 'الورشات')         await loadWorkshops()
      else if (activeTab === 'الإعلانات')       await loadAds()
      else {
        const statusMap: Record<string, string> = {
          'الإعلانات المعلقة': 'pending',
          'نشطة':              'active',
          'مرفوضة':            'rejected',
        }
        await loadListings(statusMap[activeTab])
      }
    } finally { setLoading(false) }
  }

  async function loadListings(status: string) {
    const { data } = await supabase
      .from('listings').select('*, listing_images(url), users(phone, name)')
      .eq('status', status).order('created_at', { ascending: false })
    setListings(data ?? [])
  }

  async function loadWorkshops() {
    const { data } = await supabase
      .from('services').select('*')
      .eq('status', 'pending').order('created_at', { ascending: false })
    setWorkshops(data ?? [])
  }

  async function loadAds() {
    const { data } = await supabase.from('site_ads').select('*').order('created_at', { ascending: false })
    setAds(data ?? [])
  }

  async function saveAd() {
    if (!adForm.title.trim()) return
    setSavingAd(true)
    await supabase.from('site_ads').insert({ ...adForm, active: true })
    setAdForm({ title: '', body_text: '', link_url: '', cta_text: 'تعرف أكثر', image_url: '', position: 'home_middle' })
    await loadAds()
    setSavingAd(false)
  }

  async function toggleAd(id: string, active: boolean) {
    await supabase.from('site_ads').update({ active: !active }).eq('id', id)
    setAds(a => a.map(x => x.id === id ? { ...x, active: !active } : x))
  }

  async function deleteAd(id: string) {
    if (!confirm('حذف هذا الإعلان؟')) return
    await supabase.from('site_ads').delete().eq('id', id)
    setAds(a => a.filter(x => x.id !== id))
  }

  async function loadUsers() {
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false }).limit(100)
    setUsers(data ?? [])
  }

  async function loadStats() {
    const [pending, active, rejected, usersCount, pendingWS] = await Promise.all([
      supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'rejected'),
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('services').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ])
    setStats({
      pending:           pending.count     ?? 0,
      active:            active.count      ?? 0,
      rejected:          rejected.count    ?? 0,
      total_users:       usersCount.count  ?? 0,
      pending_workshops: pendingWS.count   ?? 0,
    })
  }

  async function approveListing(id: string) {
    await supabase.from('listings').update({ status: 'active' }).eq('id', id)
    const listing = listings.find(l => l.id === id)
    if (listing?.users?.name || listing?.users?.phone) {
      emailSellerListingApproved(listing.users.name ?? listing.users.phone, listing.title, id).catch(() => {})
    }
    if (listing?.user_id) {
      supabase.from('notifications').insert({
        user_id: listing.user_id, type: 'listing_approved',
        payload: { text: `تم قبول إعلانك: ${listing.title}`, listingId: id },
      }).then(() => {})
    }
    setListings(l => l.filter(x => x.id !== id))
  }

  async function rejectListing(id: string) {
    const reason = rejectReason || 'مخالف للشروط'
    await supabase.from('listings').update({ status: 'rejected', reject_reason: reason }).eq('id', id)
    const listing = listings.find(l => l.id === id)
    if (listing?.users?.name || listing?.users?.phone) {
      emailSellerListingRejected(listing.users.name ?? listing.users.phone, listing.title, reason).catch(() => {})
    }
    if (listing?.user_id) {
      supabase.from('notifications').insert({
        user_id: listing.user_id, type: 'listing_rejected',
        payload: { text: `تم رفض إعلانك: ${listing.title} — ${reason}` },
      }).then(() => {})
    }
    setListings(l => l.filter(x => x.id !== id))
    setRejectId(null); setRejectReason('')
  }

  async function approveWorkshop(id: string) {
    await supabase.from('services').update({ status: 'active', verified: true }).eq('id', id)
    setWorkshops(w => w.filter(x => x.id !== id))
  }

  async function rejectWorkshop(id: string) {
    await supabase.from('services').update({ status: 'rejected' }).eq('id', id)
    setWorkshops(w => w.filter(x => x.id !== id))
  }

  async function banUser(id: string) {
    if (!confirm('تأكيد حظر هذا المستخدم؟')) return
    await supabase.from('users').update({ verified: false }).eq('id', id)
    setUsers(u => u.map(x => x.id === id ? { ...x, verified: false } : x))
  }

  const pendingCount = stats.pending + stats.pending_workshops

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px 60px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>لوحة الإدارة</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 2 }}>CARNA Admin Panel</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={loadData} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--gray-100)', border: '1px solid var(--gray-200)', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font)' }}>
            <RefreshCw size={14}/> تحديث
          </button>
          {pendingCount > 0 && (
            <span style={{ background: '#DC2626', color: '#fff', fontSize: 12, fontWeight: 700, borderRadius: 9999, padding: '3px 10px' }}>
              {pendingCount} معلق
            </span>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 28 }}>
        <MiniStat label="إعلانات معلقة"  value={stats.pending}           color="#D97706" icon={<Clock size={16}/>}/>
        <MiniStat label="نشطة"           value={stats.active}            color="#16A34A" icon={<Check size={16}/>}/>
        <MiniStat label="مرفوضة"         value={stats.rejected}          color="#DC2626" icon={<X size={16}/>}/>
        <MiniStat label="ورشات معلقة"    value={stats.pending_workshops} color="#7C3AED" icon={<Wrench size={16}/>}/>
        <MiniStat label="مستخدمون"       value={stats.total_users}       color="#0053FA" icon={<Users size={16}/>}/>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--gray-200)', marginBottom: 24, overflowX: 'auto' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
            fontWeight: activeTab === tab ? 700 : 400,
            color: activeTab === tab ? 'var(--text)' : 'var(--text-3)',
            borderBottom: `2px solid ${activeTab === tab ? 'var(--yellow)' : 'transparent'}`,
            marginBottom: -2, fontSize: 14, fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}>{tab}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>جارٍ التحميل...</div>
      ) : (
        <>
          {/* Listings */}
          {['الإعلانات المعلقة','نشطة','مرفوضة'].includes(activeTab) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {listings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-3)' }}>لا يوجد إعلانات</div>
              ) : listings.map(listing => (
                <div key={listing.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--gray-200)', display: 'flex', gap: 16, padding: 16, alignItems: 'flex-start' }}>
                  <img src={listing.listing_images?.[0]?.url ?? 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=120&h=80&fit=crop'}
                    alt="" style={{ width: 110, height: 74, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{listing.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 6 }}>
                      {listing.price?.toLocaleString()} ل.س · {listing.city} · {listing.km?.toLocaleString()} كم
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-4)' }}>
                      {listing.users?.name ?? listing.users?.phone ?? '—'} · {new Date(listing.created_at).toLocaleDateString('ar-SY')}
                    </div>
                    {listing.reject_reason && <div style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>سبب الرفض: {listing.reject_reason}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <Link to={`/listing/${listing.id}`} target="_blank"
                      style={{ display: 'flex', alignItems: 'center', padding: '8px 10px', borderRadius: 10, border: '1px solid var(--gray-200)', color: 'var(--text-3)', textDecoration: 'none' }}>
                      <Eye size={14}/>
                    </Link>
                    {activeTab === 'الإعلانات المعلقة' && <>
                      <button onClick={() => approveListing(listing.id)}
                        style={{ background: '#dcfce7', border: '1.5px solid #86efac', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', color: '#16A34A', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Check size={14}/> قبول
                      </button>
                      <button onClick={() => setRejectId(listing.id)}
                        style={{ background: '#fee2e2', border: '1.5px solid #fca5a5', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', color: '#DC2626', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <X size={14}/> رفض
                      </button>
                    </>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Workshops */}
          {activeTab === 'الورشات' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {workshops.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-3)' }}>لا يوجد طلبات ورشات معلقة</div>
              ) : workshops.map(ws => (
                <div key={ws.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--gray-200)', padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <div style={{ fontWeight: 800, fontSize: 16 }}>{ws.name}</div>
                        <span style={{ fontSize: 11, fontWeight: 700, background: '#EDE9FE', color: '#7C3AED', padding: '2px 10px', borderRadius: 9999 }}>{ws.subscription_tier}</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 13, color: 'var(--text-3)', marginBottom: 8 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={12}/> {ws.city}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Phone size={12}/> {ws.phone}</span>
                        {ws.whatsapp && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MessageCircle size={12}/> {ws.whatsapp}</span>}
                        {ws.inspection && <span style={{ color: '#3B82F6', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Search size={12}/> يقدم فحص</span>}
                      </div>
                      {ws.service_types?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {ws.service_types.map((s: string) => (
                            <span key={s} style={{ fontSize: 11, background: 'var(--gray-100)', color: 'var(--text-2)', padding: '3px 10px', borderRadius: 9999 }}>{s}</span>
                          ))}
                        </div>
                      )}
                      {ws.description && <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 8, lineHeight: 1.6 }}>{ws.description}</p>}
                      <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 8 }}>
                        {new Date(ws.created_at).toLocaleDateString('ar-SY')}
                        {ws.address && ` · ${ws.address}`}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => approveWorkshop(ws.id)}
                        style={{ background: '#dcfce7', border: '1.5px solid #86efac', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', color: '#16A34A', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Check size={14}/> قبول
                      </button>
                      <button onClick={() => rejectWorkshop(ws.id)}
                        style={{ background: '#fee2e2', border: '1.5px solid #fca5a5', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', color: '#DC2626', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <X size={14}/> رفض
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ads */}
          {activeTab === 'الإعلانات' && (
            <div>
              {/* Add form */}
              <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid var(--gray-200)', marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 18 }}>إضافة إعلان جديد</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>عنوان الإعلان *</label>
                    <input className="input" value={adForm.title} onChange={e => setAdForm(f => ({ ...f, title: e.target.value }))} placeholder="مثال: تأمين السيارات - الوطنية"/>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>نص زر الدعوة</label>
                    <input className="input" value={adForm.cta_text} onChange={e => setAdForm(f => ({ ...f, cta_text: e.target.value }))} placeholder="تعرف أكثر"/>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>رابط الإعلان</label>
                    <input className="input" value={adForm.link_url} onChange={e => setAdForm(f => ({ ...f, link_url: e.target.value }))} placeholder="https://" dir="ltr"/>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>رابط الصورة (اختياري)</label>
                    <input className="input" value={adForm.image_url} onChange={e => setAdForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." dir="ltr"/>
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>النص التوضيحي</label>
                  <input className="input" value={adForm.body_text} onChange={e => setAdForm(f => ({ ...f, body_text: e.target.value }))} placeholder="وصف قصير للإعلان"/>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <select className="input" style={{ width: 200 }} value={adForm.position} onChange={e => setAdForm(f => ({ ...f, position: e.target.value }))}>
                    <option value="home_middle">الصفحة الرئيسية — وسط</option>
                    <option value="home_bottom">الصفحة الرئيسية — أسفل</option>
                  </select>
                  <button className="btn btn-yellow" onClick={saveAd} disabled={savingAd || !adForm.title.trim()} style={{ fontSize: 14 }}>
                    {savingAd ? 'جارٍ الحفظ...' : '+ نشر الإعلان'}
                  </button>
                </div>
              </div>

              {/* Ads list */}
              {ads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-4)', background: '#fff', borderRadius: 16, border: '1px solid var(--gray-200)' }}>
                  لا يوجد إعلانات بعد — أضف أول إعلان أعلاه
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {ads.map(ad => (
                    <div key={ad.id} style={{
                      background: '#fff', borderRadius: 16, border: `1px solid ${ad.active ? 'var(--gray-200)' : 'var(--gray-100)'}`,
                      padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16,
                      opacity: ad.active ? 1 : 0.5,
                    }}>
                      {ad.image_url && (
                        <img src={ad.image_url} alt="" style={{ width: 80, height: 52, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}/>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{ad.title}</div>
                        {ad.body_text && <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 3 }}>{ad.body_text}</div>}
                        <div style={{ fontSize: 11, color: 'var(--text-4)' }}>
                          {ad.position === 'home_middle' ? 'الرئيسية - وسط' : 'الرئيسية - أسفل'}
                          {ad.link_url && <span style={{ marginRight: 8, direction: 'ltr', display: 'inline-block' }}>{ad.link_url.slice(0, 40)}...</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <button onClick={() => toggleAd(ad.id, ad.active)} style={{
                          padding: '7px 14px', borderRadius: 10, border: '1px solid var(--gray-200)',
                          background: ad.active ? '#DCFCE7' : 'var(--gray-100)',
                          color: ad.active ? '#16A34A' : 'var(--text-4)',
                          fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font)',
                        }}>
                          {ad.active ? '● نشط' : '○ موقوف'}
                        </button>
                        <button onClick={() => deleteAd(ad.id)} style={{
                          padding: '7px 10px', borderRadius: 10, background: '#FEE2E2',
                          border: '1px solid #FCA5A5', cursor: 'pointer', color: '#DC2626',
                        }}>
                          <X size={14}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Users */}
          {activeTab === 'المستخدمون' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {users.map(u => (
                <div key={u.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--gray-200)', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: u.is_admin ? '#1a1a1a' : 'var(--yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, flexShrink: 0, color: u.is_admin ? '#fff' : '#000' }}>
                    {(u.name ?? u.phone ?? '?')[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name ?? '—'}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', direction: 'ltr', textAlign: 'right' }}>{u.phone}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {u.is_admin && <span style={{ fontSize: 11, fontWeight: 700, background: '#1a1a1a', color: '#fff', padding: '3px 10px', borderRadius: 9999 }}>Admin</span>}
                    {u.verified
                      ? <span style={{ fontSize: 12, color: '#16A34A', fontWeight: 600 }}>● نشط</span>
                      : <span style={{ fontSize: 12, color: '#DC2626', fontWeight: 600 }}>● محظور</span>}
                    <span style={{ fontSize: 12, color: 'var(--text-4)' }}>{new Date(u.created_at).toLocaleDateString('ar-SY')}</span>
                    {!u.is_admin && u.verified && (
                      <button onClick={() => banUser(u.id)}
                        style={{ background: 'none', border: '1.5px solid #fca5a5', borderRadius: 10, padding: '5px 10px', cursor: 'pointer', color: '#DC2626', fontSize: 12 }}>
                        حظر
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          {activeTab === 'الإحصاءات' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
              <StatCard icon={<Clock size={24}/>}   label="إعلانات معلقة"      value={stats.pending}           color="#D97706"/>
              <StatCard icon={<Check size={24}/>}   label="إعلانات نشطة"       value={stats.active}            color="#16A34A"/>
              <StatCard icon={<X size={24}/>}       label="إعلانات مرفوضة"     value={stats.rejected}          color="#DC2626"/>
              <StatCard icon={<Wrench size={24}/>}  label="ورشات معلقة"        value={stats.pending_workshops} color="#7C3AED"/>
              <StatCard icon={<Users size={24}/>}   label="إجمالي المستخدمين"  value={stats.total_users}       color="#0053FA"/>
            </div>
          )}
        </>
      )}

      {/* Reject modal */}
      {rejectId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 400 }}>
            <h3 style={{ fontWeight: 800, fontSize: 17, marginBottom: 16 }}>سبب الرفض</h3>
            <textarea className="input" rows={3} placeholder="اكتب السبب للبائع (اختياري)" value={rejectReason}
              onChange={e => setRejectReason(e.target.value)} style={{ resize: 'none', marginBottom: 16 }}/>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => rejectListing(rejectId)}
                style={{ flex: 1, background: '#DC2626', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                تأكيد الرفض
              </button>
              <button onClick={() => { setRejectId(null); setRejectReason('') }}
                style={{ flex: 1, background: 'var(--gray-100)', border: '1px solid var(--gray-200)', borderRadius: 10, padding: '12px', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font)' }}>
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
    <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ color }}>{icon}</div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
        <div style={{ fontSize: 11, color: 'var(--text-4)' }}>{label}</div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 16, padding: '24px 28px', display: 'flex', gap: 18, alignItems: 'center' }}>
      <div style={{ color, background: color + '15', borderRadius: 12, padding: 14 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 32, fontWeight: 800 }}>{value}</div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>{label}</div>
      </div>
    </div>
  )
}
