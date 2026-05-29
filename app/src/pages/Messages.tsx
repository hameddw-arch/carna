import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Send, Loader2, MessageCircle, ChevronRight, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import {
  fetchThreads, fetchThreadMessages, fetchThreadMeta,
  sendMessage, subscribeToInbox, parseThreadKey,
  type Thread, type ChatMessage,
} from '../lib/chat'
import SEO from '../components/SEO'

export default function Messages() {
  const { key }  = useParams()           // threadKey = listingId__otherId
  const { user } = useAuth()
  const navigate = useNavigate()

  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchThreads(user.id).then(t => { setThreads(t); setLoading(false) })
  }, [user, key])

  // refresh thread list when a new message arrives anywhere
  useEffect(() => {
    if (!user) return
    return subscribeToInbox(user.id, () => {
      fetchThreads(user.id).then(setThreads)
    })
  }, [user])

  if (!user) return null

  return (
    <main style={{ flex: 1, background: 'var(--off-white)' }}>
      <SEO title="الرسائل" url="/messages"/>

      <div style={{ background: 'var(--dark)', padding: '28px 24px 24px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 12 }}>
            <Link to="/dashboard" style={{ color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}>حسابي</Link>
            <ChevronRight size={12}/>
            <span style={{ color: '#fff' }}>الرسائل</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>الرسائل</h1>
        </div>
      </div>

      <div className="container" style={{ padding: '24px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16,
          height: 'calc(100vh - 220px)', minHeight: 480,
        }} className="chat-grid">

          {/* Threads list */}
          <aside style={{
            background: '#fff', borderRadius: 16, border: '1px solid var(--gray-200)',
            overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }} className={key ? 'chat-list-hidden' : ''}>
            <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--gray-100)', fontWeight: 800, fontSize: 15 }}>
              المحادثات {threads.length > 0 && <span style={{ color: 'var(--text-4)', fontWeight: 400 }}>({threads.length})</span>}
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                  <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-4)' }}/>
                </div>
              ) : threads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-4)' }}>
                  <MessageCircle size={36} style={{ marginBottom: 12, opacity: .4 }}/>
                  <p style={{ fontSize: 14 }}>لا يوجد محادثات بعد</p>
                  <p style={{ fontSize: 12, marginTop: 4 }}>راسل بائعاً من صفحة أي إعلان</p>
                </div>
              ) : threads.map(t => {
                const active = t.key === key
                return (
                  <button key={t.key} onClick={() => navigate(`/messages/${t.key}`)} style={{
                    width: '100%', display: 'flex', gap: 12, alignItems: 'center',
                    padding: '14px 16px', border: 'none', cursor: 'pointer', textAlign: 'right',
                    background: active ? 'var(--yellow-light)' : 'transparent',
                    borderRight: active ? '3px solid var(--yellow)' : '3px solid transparent',
                    borderBottom: '1px solid var(--gray-100)', fontFamily: 'var(--font)',
                  }}>
                    <div style={{ width: 46, height: 46, borderRadius: 10, flexShrink: 0, overflow: 'hidden', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {t.listingImage ? <img src={t.listingImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : '🚗'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.listingTitle ?? 'إعلان'}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.otherName ?? 'مستخدم'} · {t.lastMessage}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </aside>

          {/* Thread */}
          <section style={{
            background: '#fff', borderRadius: 16, border: '1px solid var(--gray-200)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }} className={key ? '' : 'chat-thread-hidden'}>
            {key
              ? <Thread threadK={key} userId={user.id} onBack={() => navigate('/messages')}/>
              : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-4)' }}>
                  <MessageCircle size={48} style={{ opacity: .3, marginBottom: 12 }}/>
                  <p style={{ fontSize: 15 }}>اختر محادثة لعرضها</p>
                </div>
              )
            }
          </section>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .chat-grid { grid-template-columns: 1fr !important; }
          .chat-list-hidden { display: none !important; }
          .chat-thread-hidden { display: none !important; }
        }
      `}</style>
    </main>
  )
}

// ── Single thread ─────────────────────────────────────────────
function Thread({ threadK, userId, onBack }: { threadK: string; userId: string; onBack: () => void }) {
  const { listingId, otherId } = parseThreadKey(threadK)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [meta,     setMeta]     = useState<{ listing: any; other: any }>({ listing: null, other: null })
  const [loading,  setLoading]  = useState(true)
  const [text,     setText]     = useState('')
  const [sending,  setSending]  = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchThreadMessages(listingId, userId, otherId),
      fetchThreadMeta(listingId, otherId),
    ]).then(([msgs, m]) => { setMessages(msgs); setMeta(m); setLoading(false) })

    // realtime: new incoming messages for this thread
    const unsub = subscribeToInbox(userId, msg => {
      if (msg.listing_id === listingId && msg.sender_id === otherId) {
        setMessages(prev => prev.some(p => p.id === msg.id) ? prev : [...prev, msg])
      }
    })
    return unsub
  }, [threadK])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function handleSend() {
    const body = text.trim()
    if (!body || sending) return
    setSending(true)
    setText('')
    const optimistic: ChatMessage = {
      id: `tmp-${Date.now()}`, sender_id: userId, receiver_id: otherId,
      listing_id: listingId, body, read_at: null, created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimistic])
    try { await sendMessage(listingId, userId, otherId, body) }
    finally { setSending(false) }
  }

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-4)' }}/>
    </div>
  )

  return (
    <>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} className="chat-back" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'none' }}>
          <ArrowRight size={18}/>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {meta.other?.name ?? 'مستخدم كارنا'}
          </div>
          {meta.listing?.title && (
            <Link to={`/listing/${listingId}`} style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }}>
              {meta.listing.title}
            </Link>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--off-white)' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-4)', fontSize: 13, marginTop: 20 }}>
            ابدأ المحادثة — اكتب رسالتك أدناه
          </div>
        )}
        {messages.map(m => {
          const mine = m.sender_id === userId
          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: mine ? 'flex-start' : 'flex-end' }}>
              <div style={{
                maxWidth: '70%', padding: '9px 14px', borderRadius: 14,
                background: mine ? 'var(--yellow)' : '#fff',
                color: mine ? 'var(--dark)' : 'var(--text)',
                border: mine ? 'none' : '1px solid var(--gray-200)',
                fontSize: 14, lineHeight: 1.5,
                borderBottomLeftRadius:  mine ? 14 : 4,
                borderBottomRightRadius: mine ? 4 : 14,
              }}>
                {m.body}
                <div style={{ fontSize: 10, opacity: .5, marginTop: 3, textAlign: 'left' }}>
                  {new Date(m.created_at).toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={endRef}/>
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--gray-100)', display: 'flex', gap: 10 }}>
        <input className="input" placeholder="اكتب رسالتك..." value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
          style={{ flex: 1 }}/>
        <button className="btn btn-yellow" onClick={handleSend} disabled={!text.trim() || sending} style={{ flexShrink: 0, padding: '0 18px' }}>
          {sending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }}/> : <Send size={16}/>}
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) { .chat-back { display: flex !important; } }
      `}</style>
    </>
  )
}
