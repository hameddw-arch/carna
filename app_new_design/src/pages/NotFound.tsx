import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🚗</div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>الصفحة طارت!</h1>
      <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 32 }}>
        اللي بتدور عليه ما لقيناه — ارجع للرئيسية
      </p>
      <Link to="/" className="btn-primary" style={{ fontSize: 15 }}>
        ارجع لكارنا
      </Link>
    </main>
  )
}
