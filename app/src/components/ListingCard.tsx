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
  hours: number
  seller?: string
  featured?: boolean
  make?: string
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
          {listing.featured && (
            <div style={{
              position: 'absolute', top: 10, left: 10,
              background: 'var(--dark)', color: 'var(--yellow)',
              padding: '4px 9px', borderRadius: 6,
              fontSize: 11, fontWeight: 700,
            }}>
              ⭐ مميز
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
            <div style={{
              fontSize: 12, fontWeight: 600, color: 'var(--text-3)',
              background: 'var(--gray-100)', padding: '2px 8px', borderRadius: 6,
            }}>
              {listing.year}
            </div>
          </div>
        </div>
      </article>
    </Link>
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
