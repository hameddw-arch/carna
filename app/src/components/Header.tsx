import { useState } from 'react'
import { Search, Menu, X, Plus } from 'lucide-react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={{
      background: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 20px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <img src="/logo.svg" alt="CARNA" style={{ height: 36 }} />
        </a>

        {/* Nav — desktop */}
        <nav style={{ display: 'flex', gap: 4, marginRight: 8 }} className="hide-mobile">
          <a href="/services" style={navStyle}>الورشات</a>
        </nav>

        {/* Search bar */}
        <div style={{ flex: 1, position: 'relative', maxWidth: 420 }}>
          <Search size={16} style={{
            position: 'absolute',
            right: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }} />
          <input
            className="input"
            style={{ paddingRight: 40, fontSize: 14 }}
            placeholder="دوّر على سيارتك..."
          />
        </div>

        {/* CTA */}
        <a href="/post" className="btn-primary" style={{ marginRight: 'auto', fontSize: 14 }}>
          <Plus size={16} />
          أضف إعلانك
        </a>

        {/* Mobile menu btn */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
          className="show-mobile"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid var(--border-light)',
          padding: '12px 20px',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          <a href="/services" style={{ ...navStyle, padding: '10px 0' }}>الورشات</a>
          <a href="/post" className="btn-primary" style={{ justifyContent: 'center', fontSize: 14 }}>
            <Plus size={16} />
            أضف إعلانك
          </a>
        </div>
      )}
    </header>
  )
}

const navStyle: React.CSSProperties = {
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  padding: '6px 12px',
  borderRadius: 8,
  fontSize: 15,
  fontWeight: 500,
  transition: 'background var(--transition-fast), color var(--transition-fast)',
}
