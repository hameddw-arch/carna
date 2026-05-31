import { useState, useEffect } from 'react'
import { X, Download } from 'lucide-react'
import logoLight from '../assets/carna logo W.svg'

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
      background: '#1A1C1C', color: '#fff',
      borderRadius: 16, padding: '16px 18px',
      border: '2px solid #FDB700',
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      display: 'flex', alignItems: 'center', gap: 14,
      zIndex: 999,
      animation: 'fadeUp .3s ease both',
    }}>
      <img src={logoLight} alt="CARNA" style={{ width: 40, height: 40, flexShrink: 0 }}/>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>أضف كارنا للشاشة</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)' }}>وصول سريع من الشاشة الرئيسية</div>
      </div>
      <button onClick={install} className="hover:opacity-90" style={{
        background: '#FDB700',
        color: '#000',
        border: 'none',
        borderRadius: 8,
        padding: '8px 12px',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexShrink: 0,
        transition: 'all 0.2s'
      }}>
        <Download size={13}/> تثبيت
      </button>
      <button onClick={dismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.6)', padding: 4, flexShrink: 0, transition: 'color 0.2s' }}>
        <X size={16}/>
      </button>
    </div>
  )
}
