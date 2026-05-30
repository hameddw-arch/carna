import { useState, useEffect } from 'react'
import { X, Download } from 'lucide-react'
import logoLight from '../assets/carna logo w.svg'

export default function InstallPrompt() {
  const [prompt, setPrompt] = useState<any>(null)
  const [shown,  setShown]  = useState(false)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    // Don't show if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (sessionStorage.getItem('pwa-dismissed')) return

    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e)
      setTimeout(() => setShown(true), 3000) // show after 3s
    }
    window.addEventListener('beforeinstallprompt', handler as any)
    return () => window.removeEventListener('beforeinstallprompt', handler as any)
  }, [])

  async function install() {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setClosed(true)
  }

  function dismiss() {
    sessionStorage.setItem('pwa-dismissed', '1')
    setClosed(true)
  }

  if (!shown || closed) return null

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, left: 20,
      maxWidth: 400, margin: '0 auto',
      background: 'var(--dark)', color: '#fff',
      borderRadius: 16, padding: '16px 18px',
      border: '1px solid rgba(253,183,0,.3)',
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      display: 'flex', alignItems: 'center', gap: 14,
      zIndex: 999,
      animation: 'fadeUp .3s ease both',
    }}>
      <img src={logoLight} alt="CARNA" style={{ width: 40, height: 40, flexShrink: 0 }}/>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>أضف كارنا للشاشة الرئيسية</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>تصفح أسرع بدون متصفح</div>
      </div>
      <button onClick={install} className="btn btn-yellow" style={{ fontSize: 13, padding: '8px 14px', gap: 6, flexShrink: 0 }}>
        <Download size={13}/> تثبيت
      </button>
      <button onClick={dismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.4)', padding: 4, flexShrink: 0 }}>
        <X size={16}/>
      </button>
    </div>
  )
}
