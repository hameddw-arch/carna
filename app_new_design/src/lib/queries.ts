import { supabase } from './supabase'

const PLACEHOLDER = '/placeholder-car.svg'

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
  const limit  = filters?.limit  ?? 12
  let query = supabase
    .from('listings')
    .select(`*, listing_images(url, "order"), listing_tags(tag), users(name, phone, rating, rating_count)`)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (filters?.city)       query = query.eq('city', filters.city)
  if (filters?.make)       query = query.eq('make', filters.make)
  if (filters?.yearFrom)   query = query.gte('year', filters.yearFrom)
  if (filters?.yearTo)     query = query.lte('year', filters.yearTo)
  if (filters?.priceFrom)  query = query.gte('price', filters.priceFrom)
  if (filters?.priceTo)    query = query.lte('price', filters.priceTo)
  if (filters?.sellerType) query = query.eq('seller_type', filters.sellerType)

  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query
  if (error) throw error

  return (data ?? []).map(l => ({
    ...l,
    image:      l.listing_images?.[0]?.url ?? PLACEHOLDER,
    imageCount: l.listing_images?.length ?? 0,
    tags:       l.listing_tags?.map((t: { tag: string }) => t.tag) ?? [],
    hours:      Math.floor((Date.now() - new Date(l.created_at).getTime()) / 3600000),
    sellerRating:      l.users?.rating ?? null,
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

export async function fetchUserListings(userId: string) {
  const { data, error } = await supabase
    .from('listings')
    .select(`*, listing_images(url, "order"), listing_tags(tag), users(name, phone, rating, rating_count)`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data ?? []).map(l => ({
    ...l,
    image:      l.listing_images?.[0]?.url ?? PLACEHOLDER,
    imageCount: l.listing_images?.length ?? 0,
    tags:       l.listing_tags?.map((t: { tag: string }) => t.tag) ?? [],
    hours:      Math.floor((Date.now() - new Date(l.created_at).getTime()) / 3600000),
    sellerRating:      l.users?.rating ?? null,
    sellerRatingCount: l.users?.rating_count ?? 0,
  }))
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

export async function fetchServices(filters?: {
  category?: string
  city?: string
  tier?: string
  sortBy?: 'rating' | 'inspections' | 'newest'
}) {
  let query = supabase
    .from('services')
    .select(`*, service_categories(name)`)

  const sortBy = filters?.sortBy ?? 'rating'
  if (sortBy === 'rating')     query = query.order('rating', { ascending: false })
  else if (sortBy === 'inspections') query = query.order('inspections_count', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  if (filters?.category && filters.category !== 'الكل') {
    const { data: cats } = await supabase
      .from('service_categories').select('id').eq('name', filters.category).single()
    if (cats) query = query.eq('category_id', cats.id)
  }
  if (filters?.city && filters.city !== 'كل المدن') query = query.eq('city', filters.city)
  if (filters?.tier && filters.tier !== 'الكل')     query = query.eq('subscription_tier', filters.tier)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map(s => ({
    ...s,
    category: s.service_categories?.name ?? '',
  }))
}

export async function fetchService(id: string) {
  const { data, error } = await supabase
    .from('services')
    .select(`*, service_categories(name)`)
    .eq('id', id)
    .single()
  if (error) throw error
  return { ...data, category: data.service_categories?.name ?? '' }
}

export async function fetchUserService(ownerId: string) {
  const { data, error } = await supabase
    .from('services')
    .select(`*, service_categories(name)`)
    .eq('owner_id', ownerId)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return { ...data, category: data.service_categories?.name ?? '' }
}

export async function fetchAdminStats() {
  const { count: listingsCount } = await supabase.from('listings').select('*', { count: 'exact', head: true });
  const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
  const { count: servicesCount } = await supabase.from('services').select('*', { count: 'exact', head: true });
  
  return {
    listingsCount: listingsCount || 0,
    usersCount: usersCount || 0,
    servicesCount: servicesCount || 0,
    revenue: 2500000 // Mock revenue
  };
}

export async function fetchAllListingsForAdmin(limit = 10) {
  const { data, error } = await supabase
    .from('listings')
    .select(`*`)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
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

export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateListingStatus(id: string, status: 'active' | 'inactive') {
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

export async function insertService(serviceData: any) {
  const { data, error } = await supabase
    .from('services')
    .insert(serviceData)
    .select('id')
    .single()

  if (error) throw error
  return data
}
