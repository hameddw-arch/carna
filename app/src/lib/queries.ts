import { supabase } from './supabase'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=338&fit=crop'

export async function fetchListings(filters?: {
  city?: string
  make?: string
  yearFrom?: number
  yearTo?: number
  priceFrom?: number
  priceTo?: number
  tag?: string
  sellerType?: 'individual' | 'dealer'
}) {
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
    .select(`*, listing_images(url, "order"), listing_tags(tag)`)
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

export async function fetchDistinctMakes() {
  const { data } = await supabase
    .from('listings')
    .select('make')
    .eq('status', 'active')
    .not('make', 'is', null)

  const unique = [...new Set((data ?? []).map(r => r.make as string))].filter(Boolean)
  return unique.slice(0, 8)
}

export async function fetchServices(category?: string) {
  let query = supabase
    .from('services')
    .select(`*, service_categories(name)`)
    .order('rating', { ascending: false })

  if (category && category !== 'الكل') {
    const { data: cats } = await supabase
      .from('service_categories')
      .select('id')
      .eq('name', category)
      .single()
    if (cats) query = query.eq('category_id', cats.id)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map(s => ({
    ...s,
    category: s.service_categories?.name ?? '',
  }))
}
