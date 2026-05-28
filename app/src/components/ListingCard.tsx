import { MapPin, Calendar, Gauge, Fuel, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function ListingCard({ listing }: { listing: any }) {
  const [saved, setSaved] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <Link to={`/listing/${listing.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div className="card">
          {/* Image */}
          <div style={{ position: 'relative', borderBottom: '1px solid var(--border-subtle)' }}>
            <img 
              src={listing.image} 
              alt={listing.title} 
              style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} 
            />
            {listing.featured && (
              <span style={{ 
                position: 'absolute', top: 12, right: 12, 
                background: 'var(--color-yellow)', color: 'var(--color-black)', 
                fontSize: 12, fontWeight: 700, padding: '4px 10px', 
                borderRadius: 'var(--radius-sm)'
              }}>
                مميز
              </span>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: 16 }}>
            <div style={{ 
              fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 
            }}>
              {listing.price} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)' }}>ل.س</span>
            </div>
            
            <h3 style={{ 
              fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', 
              marginBottom: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
            }}>
              {listing.title}
            </h3>

            {/* Specs */}
            <div style={{ 
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, 
              fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} /> {listing.year}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Gauge size={14} /> {listing.km} كم
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Fuel size={14} /> {listing.fuel}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={14} /> {listing.city}
              </div>
            </div>

            {/* Footer */}
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              fontSize: 12, color: 'var(--text-secondary)', 
              borderTop: '1px solid var(--border-subtle)', paddingTop: 12 
            }}>
              <span>منذ {listing.hours} ساعات</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Save Button */}
      <button 
        onClick={(e) => {
          e.preventDefault()
          setSaved(!saved)
        }}
        style={{
          position: 'absolute', bottom: 16, left: 16, zIndex: 10,
          background: saved ? 'var(--color-yellow)' : 'var(--bg-subtle)',
          color: saved ? 'var(--color-black)' : 'var(--text-secondary)',
          border: '1px solid var(--border-subtle)',
          width: 32, height: 32, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all var(--transition-fast)'
        }}
      >
        <Star size={16} fill={saved ? 'currentColor' : 'none'} />
      </button>
    </div>
  )
}
