import { useState, useEffect } from 'react'
import { ChevronRight, Plus, ArrowDownLeft, ArrowUpRight, Loader2, Copy, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const TOPUP_METHODS = [
  { id: 'syriatel', name: 'Syriatel Cash',  icon: '📱', instructions: 'حوّل المبلغ على الرقم: 0991-000-000\nاكتب في الملاحظة: CARNA + رقمك المسجّل' },
  { id: 'mtn',      name: 'MTN Cash',        icon: '💚', instructions: 'حوّل المبلغ على الرقم: 0961-000-000\nاكتب في الملاحظة: CARNA + رقمك المسجّل' },
  { id: 'bank',     name: 'تحويل بنكي',      icon: '🏦', instructions: 'البنك التجاري السوري\nرقم الحساب: 000-000-000\nباسم: شركة كارنا' },
]

export default function Wallet() {
  const { user }      = useAuth()
  const [balance,     setBalance]     = useState(0)
  const [txs,         setTxs]         = useState<any[]>([])
  const [loading,     setLoading]     = useState(true)
  const [amount,      setAmount]      = useState('')
  const [method,      setMethod]      = useState('syriatel')
  const [sending,     setSending]     = useState(false)
  const [sent,        setSent]        = useState(false)
  const [copied,      setCopied]      = useState(false)

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('users').select('wallet_balance').eq('id', user.id).single(),
      supabase.from('wallet_transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
    ]).then(([bal, t]) => {
      setBalance(bal.data?.wallet_balance ?? 0)
      setTxs(t.data ?? [])
      setLoading(false)
    })
  }, [user])

  async function requestTopup() {
    if (!amount || Number(amount) < 1000) return alert('الحد الأدنى للشحن 1000 ل.س')
    setSending(true)
    await supabase.from('wallet_transactions').insert({
      user_id: user!.id,
      amount:  Number(amount),
      type:    'pending',
      method,
      ref:     `طلب شحن ${method} — بانتظار التأكيد`,
    })
    setSending(false)
    setSent(true)
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectedMethod = TOPUP_METHODS.find(m => m.id === method)!

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-4)' }}/>
    </div>
  )

  return (
    <main style={{ flex: 1, background: 'var(--off-white)' }}>

      <div style={{ background: 'var(--dark)', padding: '48px 24px 40px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 16 }}>
            <Link to="/dashboard" style={{ color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}>حسابي</Link>
            <ChevronRight size={12}/>
            <span style={{ color: '#fff' }}>محفظتي</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 6 }}>محفظتي</h1>
          <div style={{ fontSize: 42, fontWeight: 900, color: 'var(--yellow)', lineHeight: 1 }}>
            {balance.toLocaleString()}
            <span style={{ fontSize: 18, fontWeight: 600, marginRight: 6, color: 'rgba(255,255,255,.5)' }}>ل.س</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }} className="main-grid">

          {/* Transactions */}
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>سجل المعاملات</h2>
            {txs.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 16, padding: '40px', textAlign: 'center', color: 'var(--text-4)', border: '1px solid var(--gray-200)' }}>
                لا يوجد معاملات بعد
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {txs.map(tx => (
                  <div key={tx.id} style={{
                    background: '#fff', borderRadius: 16, padding: '14px 16px',
                    border: '1px solid var(--gray-200)',
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                      background: tx.type === 'credit' ? '#ECFDF5' : tx.type === 'pending' ? '#FEF3C7' : '#FEF2F2',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {tx.type === 'credit'
                        ? <ArrowDownLeft size={16} style={{ color: '#16A34A' }}/>
                        : tx.type === 'pending'
                        ? <Loader2 size={16} style={{ color: '#D97706' }}/>
                        : <ArrowUpRight size={16} style={{ color: '#DC2626' }}/>
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{tx.ref ?? tx.method}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 2 }}>
                        {new Date(tx.created_at).toLocaleDateString('ar-SY')}
                        {tx.type === 'pending' && <span style={{ marginRight: 8, color: '#D97706', fontWeight: 600 }}>بانتظار التأكيد</span>}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 15, fontWeight: 800,
                      color: tx.type === 'credit' ? '#16A34A' : tx.type === 'pending' ? '#D97706' : '#DC2626',
                    }}>
                      {tx.type === 'credit' ? '+' : tx.type === 'debit' ? '−' : ''}
                      {Math.abs(tx.amount).toLocaleString()} ل.س
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top-up card */}
          <aside style={{ position: 'sticky', top: 80 }}>
            {sent ? (
              <div style={{ background: '#fff', borderRadius: 20, padding: '28px', border: '2px solid #A7F3D0', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>تم استلام طلب الشحن</h3>
                <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.7, marginBottom: 20 }}>
                  سيتم تأكيد الشحن خلال 24 ساعة بعد التحقق من الحوالة
                </p>
                <button className="btn btn-outline" onClick={() => setSent(false)} style={{ fontSize: 14 }}>طلب شحن آخر</button>
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: 20, padding: '24px', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-md)' }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 20 }}>
                  <Plus size={16} style={{ display: 'inline', marginLeft: 6 }}/>
                  شحن المحفظة
                </h3>

                {/* Method */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)', marginBottom: 8 }}>طريقة الدفع</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {TOPUP_METHODS.map(m => (
                      <button key={m.id} onClick={() => setMethod(m.id)}
                        style={{
                          padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                          border: `1.5px solid ${method === m.id ? 'var(--yellow)' : 'var(--gray-200)'}`,
                          background: method === m.id ? 'var(--yellow-light)' : '#fff',
                          display: 'flex', alignItems: 'center', gap: 10,
                          fontFamily: 'var(--font)', fontWeight: 600, fontSize: 14, color: 'var(--text)',
                        }}>
                        <span style={{ fontSize: 20 }}>{m.icon}</span> {m.name}
                        {method === m.id && <Check size={14} style={{ color: 'var(--yellow-dark)', marginRight: 'auto' }}/>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div style={{ background: 'var(--gray-100)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)', marginBottom: 6 }}>تعليمات الحوالة:</div>
                  <pre style={{ fontSize: 12, color: 'var(--text-2)', whiteSpace: 'pre-wrap', fontFamily: 'var(--font)', lineHeight: 1.8 }}>
                    {selectedMethod.instructions}
                  </pre>
                  <button onClick={() => copy(selectedMethod.instructions)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4, fontFamily: 'var(--font)' }}>
                    {copied ? <Check size={11}/> : <Copy size={11}/>}
                    {copied ? 'تم النسخ' : 'نسخ التعليمات'}
                  </button>
                </div>

                {/* Amount */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)', marginBottom: 8 }}>المبلغ المحوّل (ل.س)</div>
                  <input className="input" type="number" placeholder="مثال: 10000"
                    value={amount} onChange={e => setAmount(e.target.value)}
                    style={{ fontSize: 16, fontWeight: 700, textAlign: 'center' }}/>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    {[5000, 10000, 25000, 50000].map(n => (
                      <button key={n} onClick={() => setAmount(String(n))}
                        className="tag" style={{ fontSize: 12, flexGrow: 1, justifyContent: 'center' }}>
                        {n.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="btn btn-yellow" style={{ width: '100%', fontSize: 15 }}
                  onClick={requestTopup} disabled={sending}>
                  {sending ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }}/> : <Plus size={15}/>}
                  أرسل طلب الشحن
                </button>

                <p style={{ fontSize: 11, color: 'var(--text-4)', textAlign: 'center', marginTop: 10, lineHeight: 1.6 }}>
                  سيتم تفعيل الرصيد بعد التحقق من الحوالة — عادةً خلال 24 ساعة
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  )
}
