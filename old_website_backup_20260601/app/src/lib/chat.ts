import { supabase } from './supabase'

// نبني على جدول public.messages الموجود (مراسلة مباشرة)
// "المحادثة" = مجموعة رسائل بين مستخدمين حول إعلان واحد، مفتاحها: `${listing_id}__${otherId}`

export interface ChatMessage {
  id: string
  sender_id: string
  receiver_id: string
  listing_id: string
  body: string
  read_at: string | null
  created_at: string
}

export interface Thread {
  key: string
  listing_id: string
  otherId: string
  otherName: string | null
  listingTitle: string | null
  listingImage: string | null
  lastMessage: string
  lastAt: string
}

export function threadKey(listingId: string, otherId: string) {
  return `${listingId}__${otherId}`
}
export function parseThreadKey(key: string): { listingId: string; otherId: string } {
  const [listingId, otherId] = key.split('__')
  return { listingId, otherId }
}

// كل المحادثات للمستخدم — مجمّعة من جدول الرسائل
export async function fetchThreads(userId: string): Promise<Thread[]> {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      listings(title, listing_images(url)),
      sender:users!sender_id(name, phone),
      receiver:users!receiver_id(name, phone)
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false })

  if (error) throw error

  const map = new Map<string, Thread>()
  for (const m of (data ?? []) as any[]) {
    const otherId   = m.sender_id === userId ? m.receiver_id : m.sender_id
    const otherUser = m.sender_id === userId ? m.receiver : m.sender
    const key = threadKey(m.listing_id, otherId)
    if (map.has(key)) continue // first one is latest (sorted desc)
    map.set(key, {
      key,
      listing_id:   m.listing_id,
      otherId,
      otherName:    otherUser?.name ?? null,
      listingTitle: m.listings?.title ?? null,
      listingImage: m.listings?.listing_images?.[0]?.url ?? null,
      lastMessage:  m.body,
      lastAt:       m.created_at,
    })
  }
  return [...map.values()]
}

// رسائل محادثة واحدة (بين المستخدم والطرف الآخر حول إعلان)
export async function fetchThreadMessages(listingId: string, userId: string, otherId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('listing_id', listingId)
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${userId})`)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as ChatMessage[]
}

// معلومات الطرف الآخر + الإعلان (لرأس المحادثة)
export async function fetchThreadMeta(listingId: string, otherId: string) {
  const [{ data: listing }, { data: other }] = await Promise.all([
    supabase.from('listings').select('id, title').eq('id', listingId).maybeSingle(),
    supabase.from('users').select('id, name, phone').eq('id', otherId).maybeSingle(),
  ])
  return { listing, other }
}

export async function sendMessage(listingId: string, senderId: string, receiverId: string, body: string): Promise<void> {
  const text = body.trim()
  if (!text) return
  await supabase.from('messages').insert({
    listing_id:  listingId,
    sender_id:   senderId,
    receiver_id: receiverId,
    body:        text,
  })
  // إشعار للمستقبِل — مفتاح المحادثة من منظوره (otherId = المرسِل)
  await supabase.from('notifications').insert({
    user_id: receiverId,
    type:    'message',
    payload: { text: `رسالة جديدة: ${text.slice(0, 40)}`, threadKey: threadKey(listingId, senderId) },
  })
}

// اشتراك Realtime — أي رسالة جديدة موجّهة للمستخدم
// اسم القناة فريد حتى لا تتعارض اشتراكات متعددة (القائمة + المحادثة المفتوحة)
export function subscribeToInbox(userId: string, onInsert: (m: ChatMessage) => void) {
  const uniq = Math.random().toString(36).slice(2)
  const channel = supabase
    .channel(`inbox:${userId}:${uniq}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${userId}` },
      payload => onInsert(payload.new as ChatMessage)
    )
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}
