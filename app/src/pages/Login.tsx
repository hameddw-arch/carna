import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Phone, ArrowLeft, Loader2, MessageSquare } from 'lucide-react'
import { requestOTP, verifyOTP } from '../lib/auth'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { setUser } = useAuth()
  const from      = (location.state as any)?.from ?? '/'

  const [step,    setStep]    = useState<'phone' | 'otp'>('phone')
  const [phone,   setPhone]   = useState('')
  const [otp,     setOtp]     = useState('')
  const [devCode, setDevCode] = useState('')   // عرض الكود في بيئة التطوير
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [agreed,  setAgreed]  = useState(false)

  async function handleSendOTP() {
    if (!phone.trim()) return setError('اكتب رقم الموبايل')
    if (!agreed) return setError('لازم توافق على الشروط أولاً')
    setError('')
    setLoading(true)
    try {
      const code = await requestOTP(phone.trim())
      setDevCode(code)   // سيُحذف عند ربط SMS
      setStep('otp')
    } catch {
      setError('صار في مشكلة بسيطة — جرب مرة ثانية')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOTP() {
    if (otp.length !== 6) return setError('الرمز 6 أرقام')
    setError('')
    setLoading(true)
    try {
      const user = await verifyOTP(phone.trim(), otp.trim())
      setUser(user)
      navigate(from, { replace: true })
    } catch (e: any) {
      setError(e.message ?? 'الرمز ما بدو هيك — تأكد منه')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.svg" alt="CARNA" style={{ height: 48, marginBottom: 12 }} />
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>
            {step === 'phone' ? 'أهلاً من جديد' : 'أدخل الرمز'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
            {step === 'phone'
              ? 'سجّل دخولك بالرقم اللي عندك'
              : `بعثنالك رمز على الرقم المنتهي بـ **${phone.slice(-3)}`
            }
          </p>
        </div>

        <div className="card" style={{ padding: 28 }}>

          {step === 'phone' ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  رقم موبايلك
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    className="input"
                    style={{ paddingRight: 42, direction: 'ltr', textAlign: 'right' }}
                    placeholder="09xxxxxxxx"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                    autoFocus
                  />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 20, padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 10 }}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  style={{ accentColor: 'var(--color-yellow)', width: 17, height: 17, flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 13, lineHeight: 1.6 }}>
                  قرأت ووافقت على{' '}
                  <a href="#" style={{ color: 'var(--color-blue)' }}>شروط الاستخدام</a>
                  {' '}و<a href="#" style={{ color: 'var(--color-blue)' }}>إخلاء المسؤولية</a>
                </span>
              </label>

              {error && <p style={{ color: 'var(--color-error)', fontSize: 13, marginBottom: 12 }}>{error}</p>}

              <button className="btn-primary" onClick={handleSendOTP} disabled={loading}
                style={{ width: '100%', justifyContent: 'center', opacity: loading ? .7 : 1 }}>
                {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <MessageSquare size={16} />}
                ابعث لي رمز
              </button>
            </>
          ) : (
            <>
              {/* Dev mode — كود التطوير */}
              {devCode && (
                <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, textAlign: 'center' }}>
                  <div style={{ color: '#92400e', fontWeight: 600, marginBottom: 4 }}>كود التطوير (مؤقت)</div>
                  <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 6, color: '#1a1a1a', direction: 'ltr' }}>{devCode}</div>
                  <div style={{ color: '#92400e', fontSize: 11, marginTop: 4 }}>سيُرسل بـ SMS عند ربط البوابة</div>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  الرمز المؤلف من 6 أرقام
                </label>
                <input
                  className="input"
                  style={{ direction: 'ltr', textAlign: 'center', fontSize: 22, fontWeight: 700, letterSpacing: 8 }}
                  placeholder="000000"
                  type="tel"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && handleVerifyOTP()}
                  autoFocus
                />
              </div>

              {error && <p style={{ color: 'var(--color-error)', fontSize: 13, marginBottom: 12 }}>{error}</p>}

              <button className="btn-primary" onClick={handleVerifyOTP} disabled={loading || otp.length !== 6}
                style={{ width: '100%', justifyContent: 'center', opacity: (loading || otp.length !== 6) ? .7 : 1, marginBottom: 10 }}>
                {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                دخول
              </button>

              <button onClick={() => { setStep('phone'); setOtp(''); setDevCode(''); setError('') }}
                style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <ArrowLeft size={13} /> تغيير الرقم
              </button>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>
          رقمك ما بيظهر للزوار — التواصل من خلال كارنا فقط
        </p>
      </div>
    </main>
  )
}
