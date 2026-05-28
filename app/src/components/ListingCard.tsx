import { MapPin, Clock, Fuel, Gauge, Star } from 'lucide-react'

interface Listing {
  id: string
  title: string
  price: string
  city: string
  km: string
  fuel: string
  year: number
  image: string
  hours: number
  seller: string
  featured?: boolean
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const timeLabel = listing.hours < 24
    ? `منذ ${listing.hours} ${listing.hours === 1 ? 'ساعة' : 'ساعات'}`
    : 'من أمس'

  return (
    <a href={`/listing/${listing.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article className="card" style={{ cursor: 'pointer' }}>
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
          <img
            src={listing.image}
            alt={listing.title}
            className="listing-card__image"
            loading="lazy"
          />
          {listing.featured && (
            <span style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'var(--color-yellow)',
              color: '#000',
              fontSize: 11,
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 9999,
            }}>
              مميز ⭐
            </span>
          )}
          <button
            onClick={e => e.preventDefault()}
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              background: 'rgba(255,255,255,.9)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Star size={14} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '14px 16px 16px' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {listing.price} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)' }}>ل.س</span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
            {listing.title}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Chip icon={<MapPin size={12} />} text={listing.city} />
            <Chip icon={<Gauge size={12} />} text={`${listing.km} كم`} />
            <Chip icon={<Fuel size={12} />} text={listing.fuel} />
          </div>
          <div style={{
            marginTop: 10,
            fontSize: 12,
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <Clock size={11} />
            {timeLabel}
          </div>
        </div>
      </article>
    </a>
  )
}

function Chip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 12,
      color: 'var(--text-secondary)',
      background: 'var(--bg-subtle)',
      padding: '3px 10px',
      borderRadius: 9999,
    }}>
      {icon}
      {text}
    </span>
  )
}
