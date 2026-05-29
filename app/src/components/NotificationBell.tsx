import { useState, useEffect, useRef } from 'react'
import { Bell, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  fetchNotifications, countUnread, markAllRead, markRead,
  subscribeToNotifications, NOTIF_META, type Notification,
} from '../lib/notifications'

export default function NotificationBell() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const [open,    setOpen]    = useState(false)
  const [items,   setItems]   = useState<Notification[]>([])
  const [unread,  setUnread]  = useState(0)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    countUnread(user.id).then(setUnread)
    return subscribeToNotifications(user.id, () => {
      setUnread(u => u + 1)
      if (open) load()
    })
  }, [user, open])

  // close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  async function load() {
    if (!user) return
    setLoading(true)
    const n = await fetchNotifications(user.id)
    setItems(n)
    setLoading(false)
  }

  async function toggle() {
    const next = !open
    setOpen(next)
    if (next) {
      await load()
      if (user && unread > 0) { await markAllRead(user.id); setUnread(0) }
    }
  }

  function openItem(n: Notification) {
    const meta = NOTIF_META[n.type] ?? NOTIF_META.general
    if (!n.read_at) markRead(n.id)
    setOpen(false)
    navigate(meta.link(n.payload ?? {}))
  }

  if (!user) return null

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button onClick={toggle} aria-label="الإشعارات" style={{
        background: 'var(--gray-100)', border: '1px solid var(--gray-200)', borderRadius: '50%',
        width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', position: 'relative',
      }}>
        <Bell size={17} color="var(--text-2)"/>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -4, left: -4,
            background: 'var(--error)', color: '#fff',
            fontSize: 10, fontWeight: 800, minWidth: 18, height: 18,
            borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 4px', border: '2px solid #fff',
          }}>{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0,
          background: '#fff', border: '1px solid var(--gray-200)',
          borderRadius: 14, width: 320, maxHeight: 420, overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)', zIndex: 300,
        }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--gray-100)', fontWeight: 800, fontSize: 14 }}>
            الإشعارات
          </div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 30 }}>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-4)' }}/>
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-4)', fontSize: 13 }}>
              🔔 لا يوجد إشعارات
            </div>
          ) : items.map(n => {
            const meta = NOTIF_META[n.type] ?? NOTIF_META.general
            return (
              <button key={n.id} onClick={() => openItem(n)} style={{
                width: '100%', display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '12px 16px', border: 'none', cursor: 'pointer', textAlign: 'right',
                background: n.read_at ? 'transparent' : 'var(--yellow-light)',
                borderBottom: '1px solid var(--gray-100)', fontFamily: 'var(--font)',
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{meta.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{n.payload?.text ?? 'إشعار'}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 2 }}>
                    {new Date(n.created_at).toLocaleDateString('ar-SY')}
                  </div>
                </div>
                {!n.read_at && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--yellow-dark)', flexShrink: 0, marginTop: 5 }}/>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
