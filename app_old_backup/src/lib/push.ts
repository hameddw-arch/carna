// إشعارات المتصفح (Notification API) — تعمل طالما تبويب للموقع مفتوح (ولو في الخلفية)
// ملاحظة: الإشعار عند إغلاق التطبيق كلياً يحتاج Web Push + VAPID + خادم (تحسين مستقبلي)

export function pushSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function pushPermission(): NotificationPermission {
  return pushSupported() ? Notification.permission : 'denied'
}

export async function requestPushPermission(): Promise<boolean> {
  if (!pushSupported()) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  try {
    const res = await Notification.requestPermission()
    return res === 'granted'
  } catch {
    return false
  }
}

export function showBrowserNotification(title: string, body: string, url?: string) {
  if (!pushSupported() || Notification.permission !== 'granted') return
  // لا تُظهر إشعاراً إن كان التبويب مرئياً ونشطاً
  if (document.visibilityState === 'visible' && document.hasFocus()) return
  try {
    const n = new Notification(title, { body, icon: '/logo.svg', badge: '/logo.svg', tag: url ?? title })
    n.onclick = () => {
      window.focus()
      if (url) window.location.href = url
      n.close()
    }
  } catch { /* ignore */ }
}
