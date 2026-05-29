import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, GitCompare } from 'lucide-react'
import { getCompare, removeFromCompare, clearCompare } from '../lib/compare'
import { supabase } from '../lib/supabase'

export default function CompareBar() {
  const navigate = useNavigate()
  const [ids,  setIds]  = useState<string[]>([])
  const [cars, setCars] = useState<Record<string, any>>({})

  useEffect(() => {
    const update = () => {
      const list = getCompare()
      setIds(list)
      // fetch titles/images for new IDs
      const missing = list.filter(id => !cars[id])
      if (missing.length) {
        supabase.from('listings')
          .select('id, title, make, model, year, listing_images(url)')
          .in('id', missing)
          .then(({ data }) => {
            if (!data) return
            setCars(prev => {
              const next = { ...prev }
              data.forEach(c => { next[c.id] = c })
              return next
            })
          })
      }
    }
    update()
    window.addEventListener('compare-change', update)
    return () => window.removeEventListener('compare-change', update)
  }, [cars])

  if (ids.length === 0) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 500,
      background: 'var(--dark)', borderTop: '2px solid var(--yellow)',
      padding: '12px 24px',
      display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
      boxShadow: '0 -4px 24px rgba(0,0,0,.4)',
      animation: 'slideUp .25s ease both',
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--yellow)', flexShrink: 0 }}>
        <GitCompare size={15} style={{ display: 'inline', marginLeft: 6 }}/>
        مقارنة ({ids.length}/3)
      </div>

      {/* Car chips */}
      <div style={{ display: 'flex', gap: 10, flex: 1, flexWrap: 'wrap' }}>
        {ids.map(id => {
          const car = cars[id]
          const img = car?.listing_images?.[0]?.url
          return (
            <div key={id} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,.08)', borderRadius: 10,
              padding: '6px 10px 6px 6px', border: '1px solid rgba(255,255,255,.12)',
            }}>
              {img && <img src={img} alt="" style={{ width: 36, height: 28, objectFit: 'cover', borderRadius: 6 }}/>}
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>
                {car ? `${car.make} ${car.model} ${car.year}` : '...'}
              </span>
              <button onClick={() => removeFromCompare(id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,.4)', padding: 2, lineHeight: 0,
              }}>
                <X size={13}/>
              </button>
            </div>
          )
        })}

        {/* Empty slots */}
        {Array.from({ length: 3 - ids.length }).map((_, i) => (
          <div key={i} style={{
            width: 120, height: 40, borderRadius: 10,
            border: '1.5px dashed rgba(255,255,255,.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, color: 'rgba(255,255,255,.25)',
          }}>+ أضف سيارة</div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <button onClick={clearCompare} style={{
          background: 'none', border: '1px solid rgba(255,255,255,.15)',
          borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
          color: 'rgba(255,255,255,.5)', fontSize: 13, fontFamily: 'var(--font)',
        }}>مسح</button>
        <button onClick={() => navigate(`/compare?ids=${ids.join(',')}`)}
          className="btn btn-yellow" style={{ fontSize: 14, gap: 7 }}
          disabled={ids.length < 2}>
          <GitCompare size={15}/>
          قارن الآن
        </button>
      </div>
    </div>
  )
}
