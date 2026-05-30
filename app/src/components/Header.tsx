import { useState } from 'react'
import { Search, Menu, X, Plus, LogOut, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import NotificationBell from './NotificationBell'

export default function Header() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <header style={{
      background: 'rgba(255,255,255,.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--gray-200)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1240, margin: '0 auto', padding: '0 24px',
        height: 66, display: 'flex', alignItems: 'center', gap: 20,
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <img src="/logo.svg" alt="CARNA" style={{ height: 34 }}/>
        </Link>

        {/* Nav — desktop */}
        <nav style={{ display: 'flex', gap: 2, marginRight: 8 }}>
          {[['/', 'الرئيسية'], ['/services', 'الورشات']].map(([to, label]) => (
            <Link key={to} to={to} style={{
              padding: '6px 14px', borderRadius: 'var(--r-md)',
              textDecoration: 'none', fontSize: 14, fontWeight: 600,
              color: 'var(--text-3)', transition: 'all 150ms ease',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)', e.currentTarget.style.background = 'var(--gray-100)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)', e.currentTarget.style.background = 'transparent')}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div style={{ flex: 1, position: 'relative', maxWidth: 380 }}>
          <Search size={15} style={{
            position: 'absolute', right: 12, top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none',
          }}/>
          <input name="search" className="input" style={{ paddingRight: 36, fontSize: 14 }} placeholder="دوّر على سيارتك..."/>
        </div>

        {/* Auth area */}
        <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? (
            <>
              <Link to="/post" className="btn btn-yellow" style={{ fontSize: 13, padding: '9px 16px', gap: 6 }}>
                <Plus size={15}/> إعلان
              </Link>
              <NotificationBell />
              <div style={{ position: 'relative' }}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{
                  background: 'var(--yellow)', border: 'none', borderRadius: '50%',
                  width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 14, cursor: 'pointer',
                }}>
                  {(user.name ?? user.phone)[0].toUpperCase()}
                </button>
                {userMenuOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', left: 0,
                    background: '#fff', border: '1px solid var(--gray-200)',
                    borderRadius: 14, minWidth: 168, padding: 6,
                    boxShadow: 'var(--shadow-lg)', zIndex: 200,
                  }}>
                    <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 12px', borderRadius: 10,
                      textDecoration: 'none', color: 'var(--text)', fontSize: 14, fontWeight: 600,
                    }}>
                      <User size={15}/> حسابي
                    </Link>
                    {user.is_admin && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 12px', borderRadius: 10,
                        textDecoration: 'none', color: 'var(--text)', fontSize: 14, fontWeight: 600,
                      }}>
                        ⚙️ الإدارة
                      </Link>
                    )}
                    <div style={{ height: 1, background: 'var(--gray-100)', margin: '4px 0' }}/>
                    <button onClick={() => { logout(); setUserMenuOpen(false) }} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 12px', borderRadius: 10, background: 'none',
                      border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                      color: 'var(--error)', fontFamily: 'var(--font)', textAlign: 'right',
                    }}>
                      <LogOut size={15}/> خروج
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/post" className="btn btn-yellow" style={{ fontSize: 13, padding: '9px 16px', gap: 6 }}>
                <Plus size={15}/> أضف إعلانك
              </Link>
              <Link to="/login" className="btn btn-outline" style={{ fontSize: 13, padding: '9px 16px' }}>
                دخول
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu btn */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'none' }}
          className="show-mobile">
          {menuOpen ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid var(--gray-200)', padding: '12px 20px',
          background: '#fff', display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <Link to="/" style={{ padding: '10px 4px', color: 'var(--text)', textDecoration: 'none', fontSize: 15, fontWeight: 600 }}>الرئيسية</Link>
          <Link to="/services" style={{ padding: '10px 4px', color: 'var(--text-3)', textDecoration: 'none', fontSize: 15 }}>الورشات</Link>
          {user ? (
            <>
              <Link to="/dashboard" style={{ padding: '10px 4px', color: 'var(--text-3)', textDecoration: 'none', fontSize: 15 }}>حسابي</Link>
              <Link to="/post" className="btn btn-yellow" style={{ justifyContent: 'center', marginTop: 4 }}><Plus size={15}/> أضف إعلانك</Link>
              <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 4px', textAlign: 'right', color: 'var(--error)', fontFamily: 'var(--font)', fontSize: 15 }}>خروج</button>
            </>
          ) : (
            <>
              <Link to="/post" className="btn btn-yellow" style={{ justifyContent: 'center', marginTop: 4 }}><Plus size={15}/> أضف إعلانك</Link>
              <Link to="/login" className="btn btn-outline" style={{ justifyContent: 'center' }}>دخول</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
