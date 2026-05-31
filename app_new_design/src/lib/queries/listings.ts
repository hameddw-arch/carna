import { supabase } from '../supabase'
import { PLACEHOLDER } from './utils'

export async function fetchListings(filters?: {
  city?: string
  make?: string
  yearFrom?: number
  yearTo?: number
  priceFrom?: number
  priceTo?: number
  tag?: string
  sellerType?: 'individual' | 'dealer'
  offset?: number
  limit?: number
}) {
  const offset = filters?.offset ?? 0
  const limit = filters?.limit ?? 12
  let query = supabase
    .from('listings')
    .select(`*, listing_images(url, "order"), listing_tags(tag), users(name, phone, rating, rating_count)`)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (filters?.city) query = query.eq('city', filters.city)
  if (filters?.make) query = query.eq('make', filters.make)
  if (filters?.yearFrom) query = query.gte('year', filters.yearFrom)
  if (filters?.yearTo) query = query.lte('year', filters.yearTo)
  if (filters?.priceFrom) query = query.gte('price', filters.priceFrom)
  if (filters?.priceTo) query = query.lte('price', filters.priceTo)
  if (filters?.sellerType) query = query.eq('seller_type', filters.sellerType)
  if (filters?.tag) {
    query = query.filter('listing_tags.tag', 'eq', filters.tag)
  }

  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query
  if (error) throw error

  return (data ?? []).map(l => ({
    ...l,
    image: l.listing_images?.[0]?.url ?? PLACEHOLDER,
    imageCount: l.listing_images?.length ?? 0,
    tags: l.listing_tags?.map((t: { tag: string }) => t.tag) ?? [],
    hours: Math.floor((Date.now() - new Date(l.created_at).getTime()) / 3600000),
    sellerRating: l.users?.rating ?? null,
    sellerRatingCount: l.users?.rating_count ?? 0,
  }))
}

export async function fetchListing(id: string) {
  const { data, error } = await supabase
    .from('listings')
    .select(`*, listing_images(url, "order"), listing_tags(tag), users(name, phone, rating, rating_count)`)
    .eq('id', id)
    .single()

  if (error) throw error

  return {
    ...data,
    images: data.listing_images?.length
      ? data.listing_images.map((i: { url: string }) => i.url)
      : [PLACEHOLDER],
    tags: data.listing_tags?.map((t: { tag: string }) => t.tag) ?? [],
    hours: Math.floor((Date.now() - new Date(data.created_at).getTime()) / 3600000),
  }
}

export async function fetchAvailableTags() {
  const { data, error } = await supabase
    .from('listing_tags')
    .select('tag')

  if (error) {
    console.warn('Failed to fetch tags:', error)
    return []
  }

  const uniqueTags = [...new Set((data ?? []).map((t: { tag: string }) => t.tag))]
  return uniqueTags.filter(Boolean).sort()
}

export async function fetchTagStats() {
  const { data, error } = await supabase
    .from('listing_tags')
    .select('tag, listing_id')

  if (error) {
    console.warn('Failed to fetch tag stats:', error)
    return []
  }

  const listingsByTag = new Map<string, Set<string>>()

  ;(data ?? []).forEach((item: { tag: string; listing_id: string }) => {
    if (!listingsByTag.has(item.tag)) {
      listingsByTag.set(item.tag, new Set())
    }
    listingsByTag.get(item.tag)!.add(item.listing_id)
  })

  const stats = Array.from(listingsByTag.entries())
    .map(([tag, listings]) => ({
      tag,
      count: listings.size
    }))
    .sort((a, b) => b.count - a.count)

  return stats
}

export async function incrementListingViews(listingId: string) {
  const { data: current } = await supabase
    .from('listings')
    .select('view_count')
    .eq('id', listingId)
    .single()

  const newCount = (current?.view_count ?? 0) + 1

  const { data, error } = await supabase
    .from('listings')
    .update({ view_count: newCount })
    .eq('id', listingId)
    .select('view_count')
    .single()

  if (error) {
    console.warn('Failed to increment view count:', error)
    return null
  }
  return data?.view_count ?? 0
}

export async function fetchUserListings(userId: string, offset = 0, limit = 10, statusFilter = 'all') {
  let query = supabase
    .from('listings')
    .select(`*, listing_images(url, "order"), listing_tags(tag), users(name, phone, rating, rating_count)`, { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (statusFilter !== 'all') {
    query = query.eq('status', statusFilter === 'active' ? 'active' : 'sold')
  }

  query = query.range(offset, offset + limit - 1)

  const { data, count, error } = await query

  if (error) throw error

  const listings = (data ?? []).map(l => ({
    ...l,
    image: l.listing_images?.[0]?.url ?? PLACEHOLDER,
    imageCount: l.listing_images?.length ?? 0,
    tags: l.listing_tags?.map((t: { tag: string }) => t.tag) ?? [],
    hours: Math.floor((Date.now() - new Date(l.created_at).getTime()) / 3600000),
    sellerRating: l.users?.rating ?? null,
    sellerRatingCount: l.users?.rating_count ?? 0,
  }))

  return { listings, count: count ?? 0 }
}

export async function fetchDistinctMakes() {
  const { data } = await supabase
    .from('listings')
    .select('make')
    .eq('status', 'active')
    .not('make', 'is', null)

  const unique = [...new Set((data ?? []).map(r => r.make as string))].filter(Boolean)
  return unique.slice(0, 8)
}

export async function insertListing(listingData: any) {
  const { data, error } = await supabase
    .from('listings')
    .insert(listingData)
    .select('id')
    .single()

  if (error) throw error
  return data
}

export async function updateListing(id: string, listingData: any) {
  const { data, error } = await supabase
    .from('listings')
    .update(listingData)
    .eq('id', id)
    .select('id')
    .single()

  if (error) throw error
  return data
}

export async function updateListingStatus(id: string, status: 'active' | 'inactive' | 'sold') {
  const { data, error } = await supabase
    .from('listings')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteListing(id: string) {
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

export async function uploadListingImages(listingId: string, files: File[]) {
  if (!files || files.length === 0) return []

  const uploadPromises = files.map(async (file, index) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${listingId}/${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('workshop-images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('workshop-images')
      .getPublicUrl(filePath)

    const { error: dbError } = await supabase
      .from('listing_images')
      .insert({
        listing_id: listingId,
        url: publicUrl,
        order: index
      })

    if (dbError) throw dbError

    return publicUrl
  })

  return Promise.all(uploadPromises)
}
