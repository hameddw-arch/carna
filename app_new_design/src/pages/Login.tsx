import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Phone, ArrowLeft, Loader2, MessageSquare, ShieldCheck } from 'lucide-react'
import { requestOTP, verifyOTP } from '../lib/auth'
import { useAuth } from '../contexts/AuthContext'
import logoDark from '../assets/carna logo.svg'
import SEO from '../components/SEO'

export default function Login() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { setUser } = useAuth()
  const from      = (location.state as any)?.from ?? '/'

  const [step,    setStep]    = useState<'phone' | 'otp'>('phone')
  const [phone,   setPhone]   = useState('')
  const [otp,     setOtp]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [agreed,  setAgreed]  = useState(false)

  async function handleSendOTP() {
    const phoneRegex = /^09\d{8}$/
    if (!phoneRegex.test(phone.trim())) return setError('الرقم يجب أن يبدأ بـ 09 ويتكون من 10 أرقام')
    if (!agreed) return setError('يجب الموافقة على الشروط أولاً')
    setError('')
    setLoading(true)
    try {
      await requestOTP(phone.trim())
      setStep('otp')
    } catch (e: any) {
      setError(e?.message ?? JSON.stringify(e) ?? 'حدث خطأ غير معروف')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOTP() {
    if (otp.length !== 6) return setError('الرمز يجب أن يتكون من 6 أرقام')
    setError('')
    setLoading(true)
    try {
      const user = await verifyOTP(phone.trim(), otp.trim())
      setUser(user)
      navigate(from, { replace: true })
    } catch (e: any) {
      setError(e.message ?? 'الرمز غير صحيح')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center p-md bg-surface-white">
      <SEO
        title="تسجيل الدخول"
        description="سجّل دخولك إلى كارنا برقم موبايلك بخطوة واحدة. إنشئ حسابك أو سجّل دخولك لتصفح آلاف إعلان سيارات في سوريا."
        url="/login"
      />
      <div className="w-full max-w-[450px]">
        
        {/* Header Section */}
        <div className="text-center mb-lg">
          <img src={logoDark} alt="CARNA" className="h-[48px] mx-auto mb-md" />
          <h1 className="font-headline-lg text-[32px] font-bold text-on-surface mb-xs">
            {step === 'phone' ? 'أهلاً بك في كارنا' : 'تأكيد الرمز'}
          </h1>
          <p className="font-body-md text-[16px] text-text-muted">
            {step === 'phone'
              ? 'سجّل دخولك أو أنشئ حساباً جديداً بخطوة واحدة'
              : `أرسلنا رمز التحقق إلى الرقم المنتهي بـ ${phone.slice(-3)}`
            }
          </p>
        </div>

        {/* Card Section */}
        <div className="bg-surface-white border border-border-light shadow-sm rounded-[16px] p-md md:p-lg">
          {step === 'phone' ? (
            <div className="flex flex-col gap-md">
              <div>
                <label className="block font-label-lg text-[14px] font-bold text-on-surface mb-xs">
                  رقم الموبايل
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-[16px] flex items-center pointer-events-none text-text-muted">
                    <Phone size={20} />
                  </div>
                  <input
                    type="tel"
                    dir="ltr"
                    className="w-full h-[56px] pl-[16px] pr-[48px] bg-surface-container-lowest border border-border-light rounded-[12px] text-[18px] text-right text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="09xxxxxxxx"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                    autoFocus
                  />
                </div>
              </div>

              <label className="flex items-start gap-sm cursor-pointer p-sm bg-surface-container-low rounded-[12px] border border-transparent hover:border-border-light transition-all">
                <input 
                  type="checkbox" 
                  className="mt-[4px] w-[20px] h-[20px] rounded border-border-light text-primary focus:ring-primary"
                  checked={agreed} 
                  onChange={e => setAgreed(e.target.checked)} 
                />
                <span className="font-body-sm text-[14px] text-on-surface-variant leading-relaxed">
                  قرأت وأوافق على <a href="#" className="text-verification-blue hover:underline">شروط الاستخدام</a> و <a href="#" className="text-verification-blue hover:underline">سياسة الخصوصية</a>
                </span>
              </label>

              {error && (
                <div className="p-sm bg-error-container text-on-error-container rounded-[8px] font-body-sm text-[14px] flex items-center gap-xs">
                  <ShieldCheck size={18} />
                  <span>{error}</span>
                </div>
              )}

              <button 
                onClick={handleSendOTP} 
                disabled={loading}
                className="w-full h-[56px] bg-primary-container text-on-primary-container font-bold text-[18px] rounded-[12px] flex items-center justify-center gap-xs hover:brightness-95 transition-all disabled:opacity-70 active:scale-[0.98]"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <MessageSquare size={20} />}
                {loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-md">
              <div>
                <label className="block font-label-lg text-[14px] font-bold text-on-surface mb-xs text-center">
                  أدخل الرمز المكون من 6 أرقام
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  maxLength={6}
                  className="w-full h-[64px] bg-surface-container-lowest border border-border-light rounded-[12px] text-[32px] font-bold tracking-[0.5em] text-center text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="000000"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && handleVerifyOTP()}
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-sm bg-error-container text-on-error-container rounded-[8px] font-body-sm text-[14px] flex items-center gap-xs">
                  <ShieldCheck size={18} />
                  <span>{error}</span>
                </div>
              )}

              <button 
                onClick={handleVerifyOTP} 
                disabled={loading || otp.length !== 6}
                className="w-full h-[56px] bg-primary-container text-on-primary-container font-bold text-[18px] rounded-[12px] flex items-center justify-center gap-xs hover:brightness-95 transition-all disabled:opacity-70 active:scale-[0.98]"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                {loading ? 'جاري التحقق...' : 'دخول إلى حسابي'}
              </button>

              <button 
                onClick={() => { setStep('phone'); setOtp(''); setError('') }}
                className="w-full h-[48px] flex items-center justify-center gap-xs text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-[12px] transition-all"
              >
                <ArrowLeft size={18} />
                تعديل رقم الموبايل
              </button>
            </div>
          )}
        </div>

        {/* Footer Text */}
        <p className="text-center font-label-sm text-[12px] text-text-muted mt-lg flex items-center justify-center gap-[4px]">
          <ShieldCheck size={14} />
          رقمك محمي ولن يظهر للزوار — التواصل يتم عبر كارنا فقط
        </p>
      </div>
    </main>
  )
}
