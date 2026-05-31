import { supabase } from '../supabase'

export async function fetchServiceReviews(serviceId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`*, users(name)`)
    .eq('service_id', serviceId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function insertReview(reviewData: any) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(reviewData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function replyToReview(reviewId: string, replyText: string) {
  const { error } = await supabase
    .from('reviews')
    .update({ reply: replyText })
    .eq('id', reviewId)

  if (error) throw error
  return true
}

export async function fetchAllReviewsForAdmin(limit = 50) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`*, users(name), services(name)`)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function deleteReview(id: string) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}
