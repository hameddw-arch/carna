import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronRight, Check, Loader2, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import SEO from '../components/SEO'

const CITIES = ['دمشق','حلب','حمص','حماة','اللاذقية','طرطوس','دير الزور','الرقة','الحسكة','درعا','السويداء','القنيطرة','إدلب','الزبداني','دوما','جرمانا','عدرا','قطنا','يبرود','تدمر']

const SERVICE_TYPES = ['تشخيص إلكتروني','صيانة عامة','فحص ما قبل الشراء','كهرباء سيارات','تكييف','ترميم هيكل','دهان','إطارات وجنوط','ناقل حركة','محرك','فرامل','تعليق وتوجيه','زجاج','ملحقات وإكسسوار']

const TIERS = [
  { id: 'free',    label: 'مجاني',   price: 'مجاناً',     color: '#6B7280', desc: 'ظهور أساسي في القائمة العامة' },
  { id: 'basic',   label: 'أساسي',   price: 'تواصل معنا', color: '#0053FA', desc: 'شعار + قائمة خدمات + أولوية في البحث' },
  { id: 'premium', label: 'مميز ⭐', price: 'تواصل معنا', color: '#FDB700', desc: 'كل مميزات الأساسي + شارة ذهبية + ظهور دائم أعلى' },
]

export default function RegisterWorkshop() {
  const { user }    = useAuth()
  const navigate    = useNavigate()

  const [step,     setStep]     = useState(1)
  const [saving,   setSaving]   = useState(false)
  const [done,     setDone]     = useState(false)

  const [form, setForm] = useState({
    name:          '',
    city:          '',
    phone:         '',
    whatsapp:      '',
    address:       '',
    description:   '',
    opening_hours: '',
    inspection:    false,
    service_types: [] as string[],
    tier:          'free',
  })

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })) }

  function toggleService(s: string) {
    setForm(f => ({
      ...f,
      service_types: f.service_types.includes(s)
        ? f.service_types.filter(x => x !== s)
        : [...f.service_types, s],
    }))
  }

  function valid1() { return form.name.trim() && form.city && form.phone.trim() }
  function valid2() { return form.service_types.length > 0 }

  async function submit() {
    if (!user) return navigate('/login')
    setSaving(true)
    const { error } = await supabase.from('services').insert({
      name:             form.name.trim(),
      city:             form.city,
      phone:            form.phone.trim(),
      whatsapp:         form.whatsapp.trim() || null,
      address:          form.address.trim()  || null,
      description:      form.description.trim() || null,
      opening_hours:    form.opening_hours.trim() || null,
      inspection:       form.inspection,
      service_types:    form.service_types,
      subscription_tier: form.tier,
      status:           'pending',
      user_id:          user.id,
      verified:         false,
      rating:           0,
    })
    setSaving(false)
    if (!error) setDone(true)
    else alert('حصل خطأ، حاول مرة أخرى')
  }

  if (done) return (
    <main style={{ flex: 1, background: 'var(--off-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 480, textAlign: 'center', background: '#fff', borderRadius: 24, padding: '48px 32px', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>تم إرسال طلبك!</h2>
        <p style={{ fontSize: 15, color: 'var(--text-3)', lineHeight: 1.8, marginBottom: 28 }}>
          سيراجع فريق كارنا طلب تسجيل ورشتك خلال 24 ساعة<br/>
          وسيتم التواصل معك على الرقم المُدخل
        </p>
        <Link to="/services" className="btn btn-yellow" style={{ fontSize: 15 }}>
          تصفح الورشات
        </Link>
      </div>
    </main>
  )

  return (
    <main style={{ flex: 1, background: 'var(--off-white)' }}>
      <SEO title="سجّل ورشتك" url="/register-workshop"/>

      {/* Header */}
      <div style={{ background: 'var(--dark)', padding: '36px 24px 28px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 14 }}>
            <Link to="/services" style={{ color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}>الورشات</Link>
            <ChevronRight size={12}/>
            <span style={{ color: '#fff' }}>سجّل ورشتك</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 20 }}>سجّل ورشتك على كارنا</h1>

          {/* Steps */}
          <div style={{ display: 'flex', gap: 0 }}>
            {['المعلومات الأساسية','الخدمات','الباقة'].map((label, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800,
                  background: step > i + 1 ? '#22C55E' : step === i + 1 ? 'var(--yellow)' : 'rgba(255,255,255,.1)',
                  color: step >= i + 1 ? '#000' : 'rgba(255,255,255,.4)',
                }}>
                  {step > i + 1 ? <Check size={13}/> : i + 1}
                </div>
                <span style={{ fontSize: 13, color: step === i + 1 ? '#fff' : 'rgba(255,255,255,.4)', fontWeight: step === i + 1 ? 700 : 400 }}>{label}</span>
                {i < 2 && <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,.15)', margin: '0 8px' }}/>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px 64px', maxWidth: 640 }}>

        {/* ── Step 1 ── */}
        {step === 1 && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 24 }}>المعلومات الأساسية</h2>

            <Field label="اسم الورشة *">
              <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="مثال: ورشة الإخوة الخضري"/>
            </Field>

            <Field label="المدينة *">
              <select className="input" value={form.city} onChange={e => set('city', e.target.value)}>
                <option value="">اختر المدينة</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="رقم الهاتف *">
                <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="09XXXXXXXX" dir="ltr"/>
              </Field>
              <Field label="رقم الواتساب">
                <input className="input" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="09XXXXXXXX" dir="ltr"/>
              </Field>
            </div>

            <Field label="العنوان التفصيلي">
              <input className="input" value={form.address} onChange={e => set('address', e.target.value)} placeholder="الحي، الشارع، بجانب..."/>
            </Field>

            <Field label="أوقات العمل">
              <input className="input" value={form.opening_hours} onChange={e => set('opening_hours', e.target.value)} placeholder="مثال: ٨ص — ٦م · إجازة الجمعة"/>
            </Field>

            <Field label="وصف الورشة">
              <textarea className="input" rows={3} value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="اكتب نبذة عن ورشتك وخبرتك وما يميزك..."
                style={{ resize: 'vertical' }}/>
            </Field>

            <button className="btn btn-yellow" onClick={() => setStep(2)} disabled={!valid1()}
              style={{ width: '100%', justifyContent: 'center', fontSize: 15, marginTop: 8 }}>
              التالي ←
            </button>
          </div>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>الخدمات المقدَّمة</h2>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>اختر كل الخدمات التي تقدمها ورشتك</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {SERVICE_TYPES.map(s => {
                const selected = form.service_types.includes(s)
                return (
                  <button key={s} onClick={() => toggleService(s)} style={{
                    padding: '8px 16px', borderRadius: 'var(--r-full)', cursor: 'pointer',
                    border: `1.5px solid ${selected ? 'var(--yellow)' : 'var(--gray-200)'}`,
                    background: selected ? 'var(--yellow-light)' : '#fff',
                    color: selected ? 'var(--yellow-dark)' : 'var(--text-2)',
                    fontSize: 13, fontWeight: selected ? 700 : 400,
                    fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'all 150ms ease',
                  }}>
                    {selected && <Check size={12}/>} {s}
                  </button>
                )
              })}
            </div>

            {/* Inspection toggle */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 18px', borderRadius: 12,
              background: form.inspection ? '#EFF6FF' : 'var(--gray-100)',
              border: `1.5px solid ${form.inspection ? '#3B82F6' : 'var(--gray-200)'}`,
              cursor: 'pointer', marginBottom: 24,
            }} onClick={() => set('inspection', !form.inspection)}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>🔍 خدمة فحص ما قبل الشراء</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>ورشتك تقدم فحص السيارات للمشترين</div>
              </div>
              <div style={{
                width: 44, height: 24, borderRadius: 12,
                background: form.inspection ? '#3B82F6' : 'var(--gray-300)',
                position: 'relative', transition: 'all 200ms ease', flexShrink: 0,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 3,
                  right: form.inspection ? 3 : undefined,
                  left: form.inspection ? undefined : 3,
                  transition: 'all 200ms ease',
                }}/>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center', background: 'var(--gray-100)', border: 'none', color: 'var(--text-2)' }}>
                → رجوع
              </button>
              <button className="btn btn-yellow" onClick={() => setStep(3)} disabled={!valid2()} style={{ flex: 2, justifyContent: 'center', fontSize: 15 }}>
                التالي ←
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3 ── */}
        {step === 3 && (
          <div>
            <div style={{ background: '#fff', borderRadius: 20, padding: '28px', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)', marginBottom: 16 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 20 }}>اختر الباقة</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {TIERS.map(t => (
                  <button key={t.id} onClick={() => set('tier', t.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 18px', borderRadius: 14, cursor: 'pointer', textAlign: 'right',
                    border: `2px solid ${form.tier === t.id ? t.color : 'var(--gray-200)'}`,
                    background: form.tier === t.id ? t.color + '10' : '#fff',
                    fontFamily: 'var(--font)', width: '100%',
                    transition: 'all 150ms ease',
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${form.tier === t.id ? t.color : 'var(--gray-300)'}`,
                      background: form.tier === t.id ? t.color : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {form.tier === t.id && <Check size={10} color="#fff"/>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: form.tier === t.id ? t.color : 'var(--text)' }}>{t.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{t.price}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>{t.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div style={{ background: 'var(--gray-100)', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>ملخص الطلب:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13, color: 'var(--text-2)' }}>
                  <span>🏪 {form.name}</span>
                  <span>📍 {form.city}</span>
                  <span>📞 {form.phone}</span>
                  <span>🔧 {form.service_types.slice(0, 3).join('، ')}{form.service_types.length > 3 ? ` +${form.service_types.length - 3}` : ''}</span>
                  {form.inspection && <span>🔍 يقدم خدمة الفحص</span>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn" onClick={() => setStep(2)} style={{ flex: 1, justifyContent: 'center', background: 'var(--gray-100)', border: 'none', color: 'var(--text-2)' }}>
                  → رجوع
                </button>
                <button className="btn btn-yellow" onClick={submit} disabled={saving} style={{ flex: 2, justifyContent: 'center', fontSize: 15 }}>
                  {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }}/> : <Plus size={15}/>}
                  أرسل طلب التسجيل
                </button>
              </div>
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-4)', textAlign: 'center', lineHeight: 1.7 }}>
              سيراجع فريق كارنا طلبك خلال 24 ساعة وسيتواصل معك على رقمك المُدخل
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-2)', marginBottom: 7 }}>{label}</label>
      {children}
    </div>
  )
}
