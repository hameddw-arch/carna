import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { subscribeToNotifications, NOTIF_META } from '../lib/notifications'
import { showBrowserNotification } from '../lib/push'

// يستمع لإشعارات المستخدم عبر Realtime ويعرضها كإشعار متصفح عندما يكون التبويب في الخلفية
export default function PushNotifier() {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    return subscribeToNotifications(user.id, n => {
      const meta = NOTIF_META[n.type] ?? NOTIF_META.general
      const text = n.payload?.text ?? 'لديك إشعار جديد من كارنا'
      showBrowserNotification('كارنا', text, meta.link(n.payload ?? {}))
    })
  }, [user])

  return null
}
