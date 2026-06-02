import { MapPin, Gauge, Fuel, Heart, Clock, GitCompare, Star, Store, Camera } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { addToCompare, removeFromCompare, isInCompare } from '../lib/compare'

interface Listing {
  id: string
  title: string
  price: number | string
  city: string
  km: number | string
  fuel: string
  year: number
  image: string
  images?: string[]
  imageCount?: number
  hours: number
  seller?: string
  featured?: boolean
  make?: string
  seller_type?: 'individual' | 'dealer'
  sellerRating?: number | null
  sellerRatingCount?: number
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const [saved,      setSaved]      = useState(false)
  const [comparing,  setComparing]  = useState(() => isInCompare(listing.id))

  useEffect(() => {
    const update = () => setComparing(isInCompare(listing.id))
    window.addEventListener('compare-change', update)
    return () => window.removeEventListener('compare-change', update)
  }, [listing.id])

  function toggleCompare(e: React.MouseEvent) {
    e.preventDefault()
    if (comparing) { removeFromCompare(listing.id); setComparing(false) }
    else {
      const ok = addToCompare(listing.id)
      if (ok) setComparing(true)
      else alert('يمكنك مقارنة 3 سيارات كحد أقصى')
    }
  }

  const timeLabel = listing.hours < 1
    ? 'الآن'
    : listing.hours < 24
    ? `منذ ${listing.hours} ${listing.hours === 1 ? 'ساعة' : 'ساعات'}`
    : `منذ ${Math.floor(listing.hours / 24)} يوم`

  const price = typeof listing.price === 'number'
    ? listing.price.toLocaleString('ar-SY')
    : listing.price

  return (
    <Link to={`/listing/${listing.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article className="card" style={{ cursor: 'pointer' }}>

        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3' }}>
          <img
            src={listing.image}
            alt={listing.title}
            className="listing-card__image"
            loading="lazy"
          />
          {/* Badges — top right (Stitch) */}
          <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end' }}>
            {listing.featured && (
              <div style={{
                background: 'var(--yellow)', color: '#1A1C1C',
                padding: '4px 9px', borderRadius: 'var(--r-sm)',
                fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4,
              }}><Star size={11} fill="currentColor"/> مميز</div>
            )}
            {listing.seller_type === 'dealer' && (
              <div style={{
                background: 'var(--blue)', color: '#fff',
                padding: '4px 9px', borderRadius: 'var(--r-sm)',
                fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4,
              }}><Store size={11}/> وكيل</div>
            )}
          </div>

          {/* Photo count — bottom left */}
          {(listing.imageCount ?? 0) > 0 && (
            <div style={{
              position: 'absolute', bottom: 10, right: 10,
              background: 'rgba(0,0,0,.55)', color: '#fff',
              padding: '3px 8px', borderRadius: 6,
              fontSize: 11, fontWeight: 600,
              backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <Camera size={11}/> {listing.imageCount}
            </div>
          )}

          {/* Save */}
          <button
            onClick={e => { e.preventDefault(); setSaved(s => !s) }}
            style={{
              position: 'absolute', bottom: 10, left: 46,
              background: 'rgba(255,255,255,.92)', border: 'none',
              borderRadius: '50%', width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,.12)',
            }}
          >
            <Heart size={14} fill={saved ? 'var(--yellow)' : 'none'} color={saved ? 'var(--yellow-dark)' : '#666'} strokeWidth={2}/>
          </button>
          {/* Compare */}
          <button
            onClick={toggleCompare}
            title={comparing ? 'إزالة من المقارنة' : 'أضف للمقارنة'}
            style={{
              position: 'absolute', bottom: 10, left: 10,
              background: comparing ? 'var(--yellow)' : 'rgba(255,255,255,.92)',
              border: 'none', borderRadius: '50%', width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,.12)',
              transition: 'all 150ms ease',
            }}
          >
            <GitCompare size={14} color={comparing ? 'var(--dark)' : '#666'}/>
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '16px' }}>
          {/* Title + year */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.4, flex: 1 }}>
              {listing.title}
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--yellow-dark)', background: 'var(--yellow-light)', padding: '2px 8px', borderRadius: 'var(--r-sm)', flexShrink: 0 }}>
              {listing.year}
            </span>
          </div>
          {/* Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-3)', marginBottom: 12 }}>
            <MapPin size={14}/> {listing.city}
          </div>
          {/* Specs grid */}
          <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-2)', marginBottom: 14 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Gauge size={15}/> {typeof listing.km === 'number' ? listing.km.toLocaleString() : listing.km} كم</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Fuel size={15}/> {listing.fuel}</span>
          </div>
          {/* Price footer */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderTop: '1px solid var(--gray-200)', paddingTop: 12,
          }}>
            <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>
              {price} <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)' }}>ل.س</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {listing.sellerRating != null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Stars rating={listing.sellerRating}/>
                </div>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--text-4)' }}>
                <Clock size={11}/> {timeLabel}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#FFC107' : '#E5E6EA'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

