import { supabase } from './supabase'

export interface Notification {
  id: string
  user_id: string
  type: string
  payload: any
  read_at: string | null
  created_at: string
}

// أنواع الإشعارات وكيف تُعرض
export const NOTIF_META: Record<string, { icon: string; link: (p: any) => string }> = {
  message:           { icon: '💬', link: p => p.threadKey ? `/messages/${p.threadKey}` : '/messages' },
  listing_approved:  { icon: '✅', link: p => p.listingId ? `/listing/${p.listingId}` : '/dashboard' },
  listing_rejected:  { icon: '❌', link: () => '/dashboard' },
  package_activated: { icon: '⭐', link: p => p.listingId ? `/listing/${p.listingId}` : '/dashboard' },
  workshop_approved: { icon: '🏆', link: p => p.serviceId ? `/services/${p.serviceId}` : '/services' },
  general:           { icon: '🔔', link: () => '/dashboard' },
}

export async function createNotification(userId: string, type: string, payload: any, text: string) {
  await supabase.from('notifications').insert({ user_id: userId, type, payload: { ...payload, text } })
}

export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(40)
  return (data ?? []) as Notification[]
}

export async function countUnread(userId: string): Promise<number> {
  const { count } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .is('read_at', null)
  return count ?? 0
}

export async function markAllRead(userId: string) {
  await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('user_id', userId).is('read_at', null)
}

export async function markRead(id: string) {
  await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id)
}

// اشتراك Realtime على إشعارات المستخدم
export function subscribeToNotifications(userId: string, onInsert: (n: Notification) => void) {
  const uniq = Math.random().toString(36).slice(2)
  const channel = supabase
    .channel(`notif:${userId}:${uniq}`)
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
      payload => onInsert(payload.new as Notification))
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}
