import { Link } from 'react-router-dom'
import { PlusCircle, Search, Menu, User, Car } from 'lucide-react'

export default function Header() {
  return (
    <header style={{ 
      background: 'var(--color-white)', 
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky', top: 0, zIndex: 100 
    }}>
      <div style={{ 
        maxWidth: 1200, margin: '0 auto', padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        
        {/* Logo */}
        <Link to="/" style={{ 
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px'
        }}>
          <div style={{ 
            width: 36, height: 36, background: 'var(--color-yellow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 'var(--radius-sm)'
          }}>
            <Car size={20} strokeWidth={2.5} color="var(--color-black)" />
          </div>
          CARNA
        </Link>

        {/* Desktop Nav */}
        <div className="hide-mobile" style={{ alignItems: 'center', gap: 24 }}>
          <nav style={{ display: 'flex', gap: 24, fontWeight: 500, fontSize: 15 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>الرئيسية</Link>
            <Link to="/#brands" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>الماركات</Link>
            <Link to="/#about" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>عن المنصة</Link>
          </nav>
          
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', borderRight: '1px solid var(--border-subtle)', paddingRight: 24 }}>
            <Link to="/admin" className="btn-ghost" style={{ padding: '8px 16px', fontSize: 14 }}>
              <User size={18} />
              حسابي
            </Link>
            <Link to="/post" className="btn-primary" style={{ padding: '8px 16px', fontSize: 14 }}>
              <PlusCircle size={18} />
              أضف إعلانك
            </Link>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="show-mobile" style={{ display: 'none', gap: 12, alignItems: 'center' }}>
          <button style={{ background: 'transparent', border: 'none', padding: 8, cursor: 'pointer' }}>
            <Search size={24} color="var(--text-primary)" />
          </button>
          <button style={{ background: 'transparent', border: 'none', padding: 8, cursor: 'pointer' }}>
            <Menu size={24} color="var(--text-primary)" />
          </button>
        </div>

      </div>
    </header>
  )
}
