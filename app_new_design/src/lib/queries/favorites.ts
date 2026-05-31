import { supabase } from '../supabase'

export async function fetchFavoritesDb(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('listing_id')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching favorites:', error)
    return []
  }
  return data.map(d => d.listing_id)
}

export async function addFavoriteDb(userId: string, listingId: string) {
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, listing_id: listingId })
  if (error) console.error('Error adding favorite:', error)
}

export async function removeFavoriteDb(userId: string, listingId: string) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('listing_id', listingId)
  if (error) console.error('Error removing favorite:', error)
}
