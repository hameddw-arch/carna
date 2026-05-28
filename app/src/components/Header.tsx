import { useState } from 'react'
import { Search, Menu, X, Plus, LogOut, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

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

        {/* CTA + Auth */}
        <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              <a href="/post" className="btn-primary" style={{ fontSize: 14 }}>
                <Plus size={16} />
                إعلان
              </a>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{
                  background: 'var(--color-yellow)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: 14,
                }}>
                  {(user.name ?? user.phone)[0].toUpperCase()}
                </button>
                {userMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    background: '#fff',
                    border: '1px solid var(--border-light)',
                    borderRadius: 10,
                    minWidth: 160,
                    marginTop: 6,
                    boxShadow: '0 4px 12px rgba(0,0,0,.1)',
                    zIndex: 100,
                  }}>
                    <Link to="/dashboard" style={{ display: 'block', padding: '10px 16px', color: 'var(--text-primary)', textDecoration: 'none', fontSize: 14, borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <User size={14} /> حسابي
                    </Link>
                    <button onClick={() => { logout(); setUserMenuOpen(false) }} style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'right', cursor: 'pointer', fontSize: 14, color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <LogOut size={14} /> خروج
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="btn-primary" style={{ fontSize: 14 }}>
              دخول
            </Link>
          )}
        </div>

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
          {user ? (
            <>
              <Link to="/dashboard" style={{ ...navStyle, padding: '10px 0' }}>حسابي</Link>
              <a href="/post" className="btn-primary" style={{ justifyContent: 'center', fontSize: 14 }}>
                <Plus size={16} />
                إعلان جديد
              </a>
              <button onClick={logout} style={{ ...navStyle, padding: '10px 0', textAlign: 'right', color: 'var(--color-error)', border: 'none', background: 'none', cursor: 'pointer' }}>
                خروج
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary" style={{ justifyContent: 'center', fontSize: 14 }}>
              دخول
            </Link>
          )}
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
