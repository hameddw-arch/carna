import { useState } from 'react'
import { Upload, X, ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

function dataURLtoBlob(url: string): Blob {
  const arr = url.split(',')
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) u8arr[n] = bstr.charCodeAt(n)
  return new Blob([u8arr], { type: 'image/jpeg' })
}

const STEPS = ['الماركة والموديل', 'الصور', 'التفاصيل والسعر', 'مراجعة ونشر']

const MAKES = ['تويوتا', 'كيا', 'هيونداي', 'هوندا', 'نيسان', 'سوزوكي', 'BMW', 'مرسيدس', 'شيفروليه', 'فورد', 'أخرى']
const CITIES = ['دمشق', 'ريف دمشق', 'حلب', 'اللاذقية', 'طرطوس', 'حماة', 'حمص', 'دير الزور', 'الرقة', 'درعا', 'السويداء', 'إدلب', 'القنيطرة', 'الحسكة']
const YEARS = Array.from({ length: 20 }, (_, i) => String(2024 - i))

export default function PostAd() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ make: '', model: '', year: '', city: '', price: '', km: '', fuel: 'بنزين', transmission: 'أوتوماتيك', color: '', description: '', seller_type: 'individual' })
  const [images,   setImages]   = useState<string[]>([])
  const [agreed,   setAgreed]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [saveError, setSaveError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handlePublish() {
    if (!user) return navigate('/login')
    setSaving(true)
    setSaveError('')
    try {
      const { data: listing, error: listErr } = await supabase
        .from('listings')
        .insert({
          user_id: user.id,
          title: `${form.make} ${form.model} ${form.year}`,
          description: form.description,
          price: Number(form.price),
          city: form.city,
          make: form.make,
          model: form.model,
          year: Number(form.year),
          km: Number(form.km),
          fuel: form.fuel,
          transmission: form.transmission,
          color: form.color,
          seller_type: form.seller_type,
          status: 'pending',
        })
        .select()
        .single()

      if (listErr || !listing) throw new Error('صار في مشكلة')

      // Upload images
      for (let i = 0; i < images.length; i++) {
        const file = dataURLtoBlob(images[i])
        const path = `${listing.id}/${i}.jpg`
        await supabase.storage.from('listing_images').upload(path, file)
        const { data } = supabase.storage.from('listing_images').getPublicUrl(path)
        await supabase.from('listing_images').insert({ listing_id: listing.id, url: data.publicUrl, order: i })
      }

      // Add tags
      const tags = [`#${form.make}`, `#${form.city}`, `#${form.year}`]
      await Promise.all(tags.map(tag => supabase.from('listing_tags').insert({ listing_id: listing.id, tag })))

      // Save legal agreement
      await supabase.from('legal_agreements').insert({ user_id: user.id, version: '1.0' })

      setSubmitted(true)
    } catch (e: any) {
      setSaveError(e.message ?? 'صار في مشكلة')
    } finally {
      setSaving(false)
    }
  }

  if (submitted) {
    return (
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, fontSize: 32 }}>✓</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>تمام!</h1>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 8 }}>إعلانك عندنا</p>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32 }}>منراجعه وبنطلع بأقرب وقت</p>
        <a href="/" className="btn-primary">ارجع للرئيسية</a>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '32px 20px 60px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>أضف إعلانك</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>ما بياخذ وقت</p>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 36 }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, transition: 'all 250ms ease',
              background: i < step ? 'var(--color-yellow)' : i === step ? '#1a1a1a' : 'var(--bg-muted)',
              color: i <= step ? (i < step ? '#000' : '#fff') : 'var(--text-muted)',
              position: 'relative', zIndex: 1,
            }}>
              {i < step ? <Check size={14}/> : i + 1}
            </div>
            <span style={{ fontSize: 11, color: i === step ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: i === step ? 700 : 400, textAlign: 'center' }}>
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <div style={{ position: 'absolute', top: 16, width: `calc(${100 / STEPS.length}% - 16px)`, height: 2, background: i < step ? 'var(--color-yellow)' : 'var(--bg-muted)', marginRight: '-50%' }} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0 */}
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* نوع البائع */}
          <Field label="أنت *">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { value: 'individual', label: '👤 صاحب السيارة', sub: 'بيع مباشر من المالك' },
                { value: 'dealer',     label: '🏪 وكيل / معرض',  sub: 'معرض سيارات أو وكيل' },
              ].map(opt => (
                <button key={opt.value} type="button"
                  onClick={() => set('seller_type', opt.value)}
                  style={{
                    padding: '14px 12px', borderRadius: 12, cursor: 'pointer',
                    fontFamily: 'var(--font)', textAlign: 'center', transition: 'all 150ms ease',
                    border: `2px solid ${form.seller_type === opt.value ? 'var(--yellow)' : 'var(--gray-200)'}`,
                    background: form.seller_type === opt.value ? 'var(--yellow-light)' : 'var(--white)',
                    boxShadow: form.seller_type === opt.value ? '0 0 0 3px var(--yellow-glow)' : 'none',
                  }}>
                  <div style={{ fontSize: 16, marginBottom: 4 }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </Field>

          <Field label="الماركة *">
            <select className="input" value={form.make} onChange={e => set('make', e.target.value)}>
              <option value="">اختر الماركة</option>
              {MAKES.map(m => <option key={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="الموديل *">
            <input className="input" placeholder="مثال: سبورتاج، كورولا، كامري..." value={form.model} onChange={e => set('model', e.target.value)} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="سنة الصنع *">
              <select className="input" value={form.year} onChange={e => set('year', e.target.value)}>
                <option value="">السنة</option>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </Field>
            <Field label="المدينة *">
              <select className="input" value={form.city} onChange={e => set('city', e.target.value)}>
                <option value="">المدينة</option>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
            حط صور واضحة — بتساعد على البيع أكتر
            <span style={{ color: 'var(--text-muted)', marginRight: 6 }}>(حتى 8 صور)</span>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {images.map((img, i) => (
              <div key={i} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 10, overflow: 'hidden' }}>
                <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                <button onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))} style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,.6)', border: 'none', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                  <X size={12}/>
                </button>
              </div>
            ))}
            {images.length < 8 && (
              <label style={{ aspectRatio: '4/3', border: '2px dashed var(--border-base)', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', background: 'var(--bg-subtle)' }}>
                <Upload size={20} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>إضافة صورة</span>
                <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                  onChange={e => {
                    const files = Array.from(e.target.files || [])
                    files.forEach(f => {
                      const r = new FileReader()
                      r.onload = ev => setImages(imgs => [...imgs, ev.target?.result as string].slice(0, 8))
                      r.readAsDataURL(f)
                    })
                  }}
                />
              </label>
            )}
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="السعر (ل.س) *">
            <input className="input" placeholder="مثال: 7500000" type="number" value={form.price} onChange={e => set('price', e.target.value)} />
          </Field>
          <Field label="الكيلومترات *">
            <input className="input" placeholder="مثال: 45000" type="number" value={form.km} onChange={e => set('km', e.target.value)} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="نوع الوقود">
              <select className="input" value={form.fuel} onChange={e => set('fuel', e.target.value)}>
                {['بنزين', 'ديزل', 'كهربائي', 'هجين'].map(f => <option key={f}>{f}</option>)}
              </select>
            </Field>
            <Field label="ناقل الحركة">
              <select className="input" value={form.transmission} onChange={e => set('transmission', e.target.value)}>
                {['أوتوماتيك', 'يدوي'].map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <Field label="اللون">
            <input className="input" placeholder="مثال: أبيض" value={form.color} onChange={e => set('color', e.target.value)} />
          </Field>
          <Field label="وصف السيارة">
            <textarea className="input" rows={4} placeholder="وصف السيارة — اذكر أي شي بيهم المشتري" value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }} />
          </Field>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div>
          <div className="card" style={{ padding: 20, marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>مراجعة الإعلان</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['الماركة والموديل', `${form.make} ${form.model} ${form.year}`], ['المدينة', form.city], ['السعر', `${Number(form.price).toLocaleString()} ل.س`], ['الكيلومترات', `${Number(form.km).toLocaleString()} كم`], ['الوقود', form.fuel]].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 8 }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{label}</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', padding: '14px 16px', background: 'var(--bg-subtle)', borderRadius: 10, marginBottom: 8 }}>
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ accentColor: 'var(--color-yellow)', width: 18, height: 18, flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 14, lineHeight: 1.6 }}>
              قرأت ووافقت على <a href="#" style={{ color: 'var(--color-blue)' }}>شروط الاستخدام</a> و<a href="#" style={{ color: 'var(--color-blue)' }}>إخلاء المسؤولية</a>
            </span>
          </label>

          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
            رقمك ما بيظهر للزوار — التواصل من خلال كارنا فقط
          </p>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
        {step > 0
          ? <button className="btn-ghost" onClick={() => setStep(s => s - 1)}>
              <ChevronRight size={16}/> رجوع
            </button>
          : <div />
        }
        {step < STEPS.length - 1
          ? <button className="btn-primary" onClick={() => setStep(s => s + 1)}>
              التالي <ChevronLeft size={16}/>
            </button>
          : <>
              {saveError && <p style={{ color: 'var(--color-error)', fontSize: 13 }}>{saveError}</p>}
              <button className="btn-primary" disabled={!agreed || saving} onClick={handlePublish} style={{ opacity: (agreed && !saving) ? 1 : 0.5, justifyContent: 'center' }}>
                {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : '✓ انشر'}
              </button>
            </>
        }
      </div>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}
