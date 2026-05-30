import { useState, useRef } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { ChevronRight, Check, Loader2, Plus, X, Image, Store, MapPin, Phone, Wrench, Camera, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import SEO from '../components/SEO'

const CITIES = ['دمشق','حلب','حمص','حماة','اللاذقية','طرطوس','دير الزور','الرقة','الحسكة','درعا','السويداء','القنيطرة','إدلب','الزبداني','دوما','جرمانا','عدرا','قطنا','يبرود','تدمر']
const SERVICE_TYPES = ['تشخيص إلكتروني','صيانة عامة','فحص ما قبل الشراء','كهرباء سيارات','تكييف','ترميم هيكل','دهان','إطارات وجنوط','ناقل حركة','محرك','فرامل','تعليق وتوجيه','زجاج','ملحقات وإكسسوار']
const TIERS = [
  { id: 'free',    label: 'مجاني',   price: 'مجاناً',     color: '#6B7280', desc: 'ظهور أساسي في القائمة العامة' },
  { id: 'basic',   label: 'أساسي',   price: 'تواصل معنا', color: '#0053FA', desc: 'شعار + قائمة خدمات + أولوية في البحث' },
  { id: 'premium', label: 'مميز', price: 'تواصل معنا', color: '#FDB700', desc: 'كل مميزات الأساسي + شارة ذهبية + ظهور دائم أعلى' },
]
const STEPS = ['المعلومات الأساسية', 'صور الورشة', 'الخدمات', 'الباقة']
const MAX_IMAGES = 5

export default function RegisterWorkshop() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [params]   = useSearchParams()
  const fileRef    = useRef<HTMLInputElement>(null)

  const [step,    setStep]    = useState(1)
  const [saving,  setSaving]  = useState(false)
  const [done,    setDone]    = useState(false)
  const [images,  setImages]  = useState<string[]>([])   // base64 previews
  const [imgFiles,setImgFiles]= useState<File[]>([])     // actual files

  const [form, setForm] = useState({
    name: '', city: '', phone: '', whatsapp: '',
    address: '', description: '', opening_hours: '',
    maps_url: '',
    inspection: false, service_types: [] as string[],
    tier: (['basic','premium'].includes(params.get('tier') ?? '') ? params.get('tier')! : 'free'),
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

  function handleFiles(files: FileList | null) {
    if (!files) return
    const remaining = MAX_IMAGES - images.length
    const toAdd = Array.from(files).slice(0, remaining)
    toAdd.forEach(file => {
      const reader = new FileReader()
      reader.onload = e => {
        setImages(prev => [...prev, e.target?.result as string])
        setImgFiles(prev => [...prev, file])
      }
      reader.readAsDataURL(file)
    })
  }

  function removeImage(i: number) {
    setImages(prev => prev.filter((_, idx) => idx !== i))
    setImgFiles(prev => prev.filter((_, idx) => idx !== i))
  }

  async function uploadImages(serviceId: string): Promise<string[]> {
    const urls: string[] = []
    for (let i = 0; i < imgFiles.length; i++) {
      const file = imgFiles[i]
      const ext  = file.name.split('.').pop() ?? 'jpg'
      const path = `${serviceId}/${i}.${ext}`
      const { error } = await supabase.storage.from('workshop-images').upload(path, file, { upsert: true })
      if (!error) {
        const { data } = supabase.storage.from('workshop-images').getPublicUrl(path)
        urls.push(data.publicUrl)
      }
    }
    return urls
  }

  async function submit() {
    if (!user) return navigate('/login')
    setSaving(true)
    const { data, error } = await supabase.from('services').insert({
      name:              form.name.trim(),
      city:              form.city,
      phone:             form.phone.trim(),
      whatsapp:          form.whatsapp.trim() || null,
      address:           form.address.trim()  || null,
      description:       form.description.trim() || null,
      opening_hours:     form.opening_hours.trim() || null,
      maps_url:          form.maps_url.trim() || null,
      inspection:        form.inspection,
      service_types:     form.service_types,
      subscription_tier: form.tier,
      status:            'pending',
      user_id:           user.id,
      verified:          false,
      rating:            0,
      images:            [],
    }).select('id').single()

    if (!error && data?.id && imgFiles.length > 0) {
      const urls = await uploadImages(data.id)
      if (urls.length > 0) {
        await supabase.from('services').update({ images: urls }).eq('id', data.id)
      }
    }

    setSaving(false)
    if (!error) setDone(true)
    else alert('حصل خطأ، حاول مرة أخرى')
  }

  function valid1() { return form.name.trim() && form.city && form.phone.trim() }
  function valid3() { return form.service_types.length > 0 }

  if (done) return (
    <main style={{ flex: 1, background: 'var(--off-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 480, textAlign: 'center', background: '#fff', borderRadius: 20, padding: '48px 32px', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>تم إرسال طلبك!</h2>
        <p style={{ fontSize: 15, color: 'var(--text-3)', lineHeight: 1.8, marginBottom: 28 }}>
          سيراجع فريق كارنا طلب تسجيل ورشتك خلال 24 ساعة<br/>
          وسيتم التواصل معك على الرقم المُدخل
        </p>
        <Link to="/services" className="btn btn-yellow" style={{ fontSize: 15 }}>تصفح الورشات</Link>
      </div>
    </main>
  )

  return (
    <main style={{ flex: 1, background: 'var(--off-white)' }}>
      <SEO title="سجّل ورشتك" url="/register-workshop"/>

      <div style={{ background: 'var(--dark)', padding: '36px 24px 28px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 14 }}>
            <Link to="/services" style={{ color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}>الورشات</Link>
            <ChevronRight size={12}/>
            <span style={{ color: '#fff' }}>سجّل ورشتك</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 20 }}>سجّل ورشتك على كارنا</h1>

          <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
            {STEPS.map((label, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800,
                  background: step > i+1 ? '#22C55E' : step === i+1 ? 'var(--yellow)' : 'rgba(255,255,255,.1)',
                  color: step >= i+1 ? '#000' : 'rgba(255,255,255,.4)',
                }}>
                  {step > i+1 ? <Check size={12}/> : i+1}
                </div>
                <span style={{ fontSize: 12, color: step === i+1 ? '#fff' : 'rgba(255,255,255,.4)', fontWeight: step === i+1 ? 700 : 400 }}>{label}</span>
                {i < STEPS.length-1 && <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,.15)', margin: '0 6px' }}/>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px 64px', maxWidth: 640 }}>

        {/* ── Step 1: Basic info ── */}
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
                placeholder="اكتب نبذة عن ورشتك وخبرتك وما يميزك..." style={{ resize: 'vertical' }}/>
            </Field>

            <Field label="رابط موقعك على Google Maps (اختياري)">
              <input className="input" value={(form as any).maps_url ?? ''} onChange={e => set('maps_url', e.target.value)}
                placeholder="https://maps.google.com/..." dir="ltr"/>
              <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 5 }}>
                افتح Google Maps ← ابحث عن ورشتك ← اضغط Share ← انسخ الرابط
              </div>
            </Field>

            <button className="btn btn-yellow" onClick={() => setStep(2)} disabled={!valid1()}
              style={{ width: '100%', justifyContent: 'center', fontSize: 15, marginTop: 8 }}>
              التالي ←
            </button>
          </div>
        )}

        {/* ── Step 2: Images ── */}
        {step === 2 && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>صور الورشة</h2>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>
              أضف حتى {MAX_IMAGES} صور توضّح ورشتك — اختياري لكن يزيد الثقة
            </p>

            {/* Upload zone */}
            {images.length < MAX_IMAGES && (
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
                style={{
                  border: '2px dashed var(--gray-300)', borderRadius: 16,
                  padding: '36px 20px', textAlign: 'center',
                  cursor: 'pointer', marginBottom: 16,
                  background: 'var(--gray-50, #F9FAFB)',
                  transition: 'all 150ms ease',
                }}>
                <Image size={32} style={{ color: 'var(--text-4)', marginBottom: 10 }}/>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>اسحب الصور هنا أو اضغط للاختيار</div>
                <div style={{ fontSize: 12, color: 'var(--text-4)' }}>
                  JPG، PNG · حتى {MAX_IMAGES} صور · {images.length}/{MAX_IMAGES} محملة
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple hidden
                  onChange={e => handleFiles(e.target.files)}/>
              </div>
            )}

            {/* Previews */}
            {images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10, marginBottom: 20 }}>
                {images.map((src, i) => (
                  <div key={i} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3' }}>
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    {i === 0 && (
                      <div style={{ position: 'absolute', top: 6, right: 6, background: 'var(--yellow)', color: '#000', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>
                        رئيسية
                      </div>
                    )}
                    <button onClick={() => removeImage(i)} style={{
                      position: 'absolute', top: 6, left: 6,
                      background: 'rgba(0,0,0,.6)', border: 'none', borderRadius: '50%',
                      width: 24, height: 24, cursor: 'pointer', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <X size={12}/>
                    </button>
                  </div>
                ))}
                {images.length < MAX_IMAGES && (
                  <button onClick={() => fileRef.current?.click()}
                    style={{ border: '2px dashed var(--gray-300)', borderRadius: 12, aspectRatio: '4/3', background: 'var(--gray-50, #F9FAFB)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--text-4)' }}>
                    <Plus size={20}/>
                    <span style={{ fontSize: 11 }}>إضافة</span>
                  </button>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center', background: 'var(--gray-100)', border: 'none', color: 'var(--text-2)' }}>
                → رجوع
              </button>
              <button className="btn btn-yellow" onClick={() => setStep(3)} style={{ flex: 2, justifyContent: 'center', fontSize: 15 }}>
                {images.length === 0 ? 'تخطّى ←' : 'التالي ←'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Services ── */}
        {step === 3 && (
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

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 18px', borderRadius: 12,
              background: form.inspection ? '#EFF6FF' : 'var(--gray-100)',
              border: `1.5px solid ${form.inspection ? '#3B82F6' : 'var(--gray-200)'}`,
              cursor: 'pointer', marginBottom: 24,
            }} onClick={() => set('inspection', !form.inspection)}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}><Search size={14}/> خدمة فحص ما قبل الشراء</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>ورشتك تقدم فحص السيارات للمشترين</div>
              </div>
              <div style={{ width: 44, height: 24, borderRadius: 12, background: form.inspection ? '#3B82F6' : 'var(--gray-300)', position: 'relative', transition: 'all 200ms ease', flexShrink: 0 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, right: form.inspection ? 3 : undefined, left: form.inspection ? undefined : 3, transition: 'all 200ms ease' }}/>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn" onClick={() => setStep(2)} style={{ flex: 1, justifyContent: 'center', background: 'var(--gray-100)', border: 'none', color: 'var(--text-2)' }}>
                → رجوع
              </button>
              <button className="btn btn-yellow" onClick={() => setStep(4)} disabled={!valid3()} style={{ flex: 2, justifyContent: 'center', fontSize: 15 }}>
                التالي ←
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Tier ── */}
        {step === 4 && (
          <div>
            <div style={{ background: '#fff', borderRadius: 20, padding: '28px', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)', marginBottom: 16 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 20 }}>اختر الباقة</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {TIERS.map(t => (
                  <button key={t.id} onClick={() => set('tier', t.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 18px', borderRadius: 16, cursor: 'pointer', textAlign: 'right',
                    border: `2px solid ${form.tier === t.id ? t.color : 'var(--gray-200)'}`,
                    background: form.tier === t.id ? t.color + '10' : '#fff',
                    fontFamily: 'var(--font)', width: '100%', transition: 'all 150ms ease',
                  }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, border: `2px solid ${form.tier === t.id ? t.color : 'var(--gray-300)'}`, background: form.tier === t.id ? t.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: 13, color: 'var(--text-2)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Store size={13} style={{ color: 'var(--text-4)' }}/> {form.name}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><MapPin size={13} style={{ color: 'var(--text-4)' }}/> {form.city} <span style={{ color: 'var(--gray-300)' }}>·</span> <Phone size={13} style={{ color: 'var(--text-4)' }}/> {form.phone}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Wrench size={13} style={{ color: 'var(--text-4)' }}/> {form.service_types.slice(0,3).join('، ')}{form.service_types.length > 3 ? ` +${form.service_types.length-3}` : ''}</span>
                  {images.length > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Camera size={13} style={{ color: 'var(--text-4)' }}/> {images.length} صورة</span>}
                  {form.inspection && <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Search size={13} style={{ color: 'var(--text-4)' }}/> يقدم خدمة الفحص</span>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn" onClick={() => setStep(3)} style={{ flex: 1, justifyContent: 'center', background: 'var(--gray-100)', border: 'none', color: 'var(--text-2)' }}>
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
