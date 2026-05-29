import { MapPin, Gauge, Fuel, Heart, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

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
  const [saved, setSaved] = useState(false)

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
          {/* Price badge */}
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'var(--yellow)', color: 'var(--dark)',
            padding: '5px 11px', borderRadius: 8,
            fontSize: 14, fontWeight: 800,
            boxShadow: '0 2px 10px rgba(0,0,0,.2)',
            lineHeight: 1.3,
          }}>
            {price}
            <span style={{ fontSize: 10, fontWeight: 600, marginRight: 3 }}>ل.س</span>
          </div>
          {/* Seller type badge — top left */}
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {listing.featured && (
              <div style={{
                background: 'var(--dark)', color: 'var(--yellow)',
                padding: '4px 9px', borderRadius: 6,
                fontSize: 11, fontWeight: 700,
              }}>⭐ مميز</div>
            )}
            {listing.seller_type === 'dealer' && (
              <div style={{
                background: '#0053FA', color: '#fff',
                padding: '3px 8px', borderRadius: 6,
                fontSize: 11, fontWeight: 700,
              }}>🏪 وكيل</div>
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
            }}>
              📷 {listing.imageCount}
            </div>
          )}

          <button
            onClick={e => { e.preventDefault(); setSaved(s => !s) }}
            style={{
              position: 'absolute', bottom: 10, left: 10,
              background: 'rgba(255,255,255,.92)', border: 'none',
              borderRadius: '50%', width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,.12)',
            }}
          >
            <Heart size={14} fill={saved ? 'var(--yellow)' : 'none'} color={saved ? 'var(--yellow-dark)' : '#666'} strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '14px 16px 16px' }}>
          <div style={{
            fontSize: 15, fontWeight: 700, color: 'var(--text)',
            marginBottom: 10, lineHeight: 1.4,
          }}>
            {listing.title}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            <Chip icon={<MapPin size={11}/>} text={listing.city} />
            <Chip icon={<Gauge size={11}/>}  text={`${typeof listing.km === 'number' ? listing.km.toLocaleString() : listing.km} كم`} />
            <Chip icon={<Fuel size={11}/>}   text={listing.fuel} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderTop: '1px solid var(--gray-100)', paddingTop: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-4)' }}>
              <Clock size={11}/> {timeLabel}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {listing.sellerRating != null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Stars rating={listing.sellerRating}/>
                  {(listing.sellerRatingCount ?? 0) > 0 && (
                    <span style={{ fontSize: 11, color: 'var(--text-4)' }}>({listing.sellerRatingCount})</span>
                  )}
                </div>
              )}
              <div style={{
                fontSize: 12, fontWeight: 600, color: 'var(--text-3)',
                background: 'var(--gray-100)', padding: '2px 8px', borderRadius: 6,
              }}>
                {listing.year}
              </div>
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
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#FDB700' : '#E5E6EA'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

function Chip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 12, color: 'var(--text-2)',
      background: 'var(--gray-100)', padding: '3px 9px',
      borderRadius: 'var(--r-full)', fontWeight: 500,
    }}>
      {icon} {text}
    </span>
  )
}
