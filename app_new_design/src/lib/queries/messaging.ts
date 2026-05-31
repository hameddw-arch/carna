import { supabase } from '../supabase'
import { PLACEHOLDER } from './utils'

export async function fetchUserChats(userId: string) {
  const { data, error } = await supabase
    .from('chats')
    .select(`
      *,
      listing:listings!inner (id, title, listing_images(url)),
      buyer:users!chats_buyer_id_fkey (id, name, phone),
      seller:users!chats_seller_id_fkey (id, name, phone),
      messages (content, is_read, created_at, sender_id)
    `)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('updated_at', { ascending: false })

  if (error) throw error

  return (data || []).map((chat: any) => {
    const sortedMessages = chat.messages ? chat.messages.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) : []
    const latestMessage = sortedMessages[0] || null
    const isBuyer = chat.buyer_id === userId
    const otherUser = isBuyer ? chat.seller : chat.buyer
    const listingImage = chat.listing?.listing_images?.[0]?.url || PLACEHOLDER

    return {
      id: chat.id,
      listing_id: chat.listing_id,
      listing_title: chat.listing?.title || 'إعلان غير متاح',
      listing_image: listingImage,
      other_user: otherUser,
      latest_message: latestMessage,
      unread_count: sortedMessages.filter((m: any) => !m.is_read && m.sender_id !== userId).length,
      updated_at: chat.updated_at
    }
  })
}

export async function fetchChatMessages(chatId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function sendMessage(chatId: string, senderId: string, content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ chat_id: chatId, sender_id: senderId, content })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function markChatAsRead(chatId: string, userId: string) {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('chat_id', chatId)
    .neq('sender_id', userId)
    .eq('is_read', false)

  if (error) throw error
  return true
}

export async function getOrCreateChat(buyerId: string, sellerId: string, listingId: string) {
  const { data: existing, error: searchError } = await supabase
    .from('chats')
    .select('id')
    .eq('buyer_id', buyerId)
    .eq('listing_id', listingId)
    .maybeSingle()

  if (searchError) throw searchError
  if (existing) return existing.id

  const { data: newChat, error: insertError } = await supabase
    .from('chats')
    .insert({ buyer_id: buyerId, seller_id: sellerId, listing_id: listingId })
    .select('id')
    .single()

  if (insertError) throw insertError
  return newChat.id
}
