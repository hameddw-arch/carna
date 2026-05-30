import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Loader2, Check, ChevronRight, Trash2, Lock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const MAKES  = ['تويوتا', 'كيا', 'هيونداي', 'هوندا', 'نيسان', 'سوزوكي', 'BMW', 'مرسيدس', 'شيفروليه', 'فورد', 'أخرى']
const CITIES = ['دمشق', 'ريف دمشق', 'حلب', 'اللاذقية', 'طرطوس', 'حماة', 'حمص', 'دير الزور', 'الرقة', 'درعا', 'السويداء', 'إدلب', 'القنيطرة', 'الحسكة']
const YEARS  = Array.from({ length: 20 }, (_, i) => String(2024 - i))
const FUELS  = ['بنزين', 'ديزل', 'هجين', 'كهرباء', 'غاز']
const TRANS  = ['أوتوماتيك', 'يدوي']

export default function EditListing() {
  const { id }   = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [denied,  setDenied]  = useState(false)
  const [form, setForm] = useState({
    make: '', model: '', year: '', city: '', price: '', km: '',
    fuel: 'بنزين', transmission: 'أوتوماتيك', color: '', description: '', status: 'active',
    hide_phone: false,
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    if (!id || !user) return
    supabase.from('listings').select('*').eq('id', id).single().then(({ data }) => {
      if (!data) { setLoading(false); return }
      if (data.user_id !== user.id) { setDenied(true); setLoading(false); return }
      setForm({
        make: data.make ?? '', model: data.model ?? '', year: String(data.year ?? ''),
        city: data.city ?? '', price: String(data.price ?? ''), km: String(data.km ?? ''),
        fuel: data.fuel ?? 'بنزين', transmission: data.transmission ?? 'أوتوماتيك',
        color: data.color ?? '', description: data.description ?? '', status: data.status ?? 'active',
        hide_phone: data.hide_phone ?? false,
      })
      setLoading(false)
    })
  }, [id, user])

  async function save() {
    if (!user || !id) return
    setSaving(true)
    await supabase.from('listings').update({
      title: `${form.make} ${form.model} ${form.year}`,
      make: form.make, model: form.model, year: Number(form.year),
      city: form.city, price: Number(form.price), km: Number(form.km),
      fuel: form.fuel, transmission: form.transmission, color: form.color,
      description: form.description, status: form.status, hide_phone: form.hide_phone,
    }).eq('id', id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => navigate('/dashboard'), 900)
  }

  async function remove() {
    if (!id || !confirm('تأكيد حذف الإعلان نهائياً؟')) return
    await supabase.from('listings').delete().eq('id', id)
    navigate('/dashboard')
  }

  if (!user) return null
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Loader2 size={26} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-4)' }}/>
    </div>
  )
  if (denied) return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>🚫</div>
      <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>لا تملك صلاحية تعديل هذا الإعلان</p>
      <Link to="/dashboard" className="btn btn-yellow">لوحة التحكم</Link>
    </main>
  )

  return (
    <main style={{ flex: 1, background: 'var(--off-white)' }}>
      <div style={{ background: 'var(--dark)', padding: '32px 24px 24px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 12 }}>
            <Link to="/dashboard" style={{ color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}>حسابي</Link>
            <ChevronRight size={12}/>
            <span style={{ color: '#fff' }}>تعديل الإعلان</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>تعديل الإعلان</h1>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 24px 64px', maxWidth: 640 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '28px', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' }}>

          {/* Status toggle */}
          <Field label="حالة الإعلان">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { v: 'active', label: 'نشط', color: '#16A34A' },
                { v: 'paused', label: 'موقوف مؤقتاً', color: '#D97706' },
                { v: 'sold',   label: 'تم البيع', color: '#0053FA' },
              ].map(s => (
                <button key={s.v} onClick={() => set('status', s.v)} type="button" style={{
                  padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--font)',
                  border: `1.5px solid ${form.status === s.v ? s.color : 'var(--gray-200)'}`,
                  background: form.status === s.v ? s.color + '12' : '#fff',
                  color: form.status === s.v ? s.color : 'var(--text-3)',
                  fontWeight: form.status === s.v ? 700 : 500, fontSize: 13,
                }}>{s.label}</button>
              ))}
            </div>
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="الماركة">
              <select className="input" value={form.make} onChange={e => set('make', e.target.value)}>
                <option value="">اختر</option>
                {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="الموديل">
              <input className="input" value={form.model} onChange={e => set('model', e.target.value)} placeholder="كورولا..."/>
            </Field>
            <Field label="سنة الصنع">
              <select className="input" value={form.year} onChange={e => set('year', e.target.value)}>
                <option value="">اختر</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </Field>
            <Field label="المدينة">
              <select className="input" value={form.city} onChange={e => set('city', e.target.value)}>
                <option value="">اختر</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="السعر (ل.س)">
              <input className="input" type="number" value={form.price} onChange={e => set('price', e.target.value)} dir="ltr"/>
            </Field>
            <Field label="الكيلومتراج">
              <input className="input" type="number" value={form.km} onChange={e => set('km', e.target.value)} dir="ltr"/>
            </Field>
            <Field label="الوقود">
              <select className="input" value={form.fuel} onChange={e => set('fuel', e.target.value)}>
                {FUELS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </Field>
            <Field label="ناقل الحركة">
              <select className="input" value={form.transmission} onChange={e => set('transmission', e.target.value)}>
                {TRANS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>

          <Field label="اللون">
            <input className="input" value={form.color} onChange={e => set('color', e.target.value)} placeholder="أبيض، أسود..."/>
          </Field>
          <Field label="الوصف">
            <textarea className="input" rows={4} value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }}/>
          </Field>

          {/* Hide phone toggle */}
          <div onClick={() => setForm(f => ({ ...f, hide_phone: !f.hide_phone }))} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderRadius: 12, marginBottom: 16, cursor: 'pointer',
            background: form.hide_phone ? '#EFF6FF' : 'var(--gray-100)',
            border: `1.5px solid ${form.hide_phone ? '#3B82F6' : 'var(--gray-200)'}`,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}><Lock size={14}/> إخفاء رقم الهاتف</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>المشترون يتواصلون عبر الرسائل فقط</div>
            </div>
            <div style={{ width: 44, height: 24, borderRadius: 12, background: form.hide_phone ? '#3B82F6' : 'var(--gray-300)', position: 'relative', transition: 'all 200ms ease', flexShrink: 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, right: form.hide_phone ? 3 : undefined, left: form.hide_phone ? undefined : 3, transition: 'all 200ms ease' }}/>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-yellow" onClick={save} disabled={saving} style={{ flex: 1, justifyContent: 'center', fontSize: 15 }}>
              {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }}/> : saved ? <><Check size={15}/> تم الحفظ</> : 'حفظ التغييرات'}
            </button>
            <button onClick={remove} style={{ padding: '0 16px', borderRadius: 10, background: '#FEE2E2', border: '1px solid #FCA5A5', cursor: 'pointer', color: '#DC2626' }}>
              <Trash2 size={16}/>
            </button>
          </div>
        </div>
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
