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
  if (filters?.tag) {
    query = query.filter('listing_tags.tag', 'eq', filters.tag)
  }

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

export async function fetchAllServicesForAdmin(limit?: number) {
  let query = supabase
    .from('services')
    .select(`*, users(name, phone)`)
    .order('created_at', { ascending: false });
    
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function updateServiceStatus(id: string, status: 'active' | 'inactive') {
  const { data, error } = await supabase
    .from('services')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteService(id: string) {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function uploadListingImages(listingId: string, files: File[]) {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map(async (file, index) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${listingId}/${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Supabase Storage bucket 'workshop-images'
    const { error: uploadError } = await supabase.storage
      .from('workshop-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('workshop-images')
      .getPublicUrl(filePath);

    // Insert into listing_images
    const { error: dbError } = await supabase
      .from('listing_images')
      .insert({
        listing_id: listingId,
        url: publicUrl,
        order: index
      });

    if (dbError) throw dbError;

    return publicUrl;
  });

  return Promise.all(uploadPromises);
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

export async function updateService(id: string, updates: any) {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function uploadServiceImage(serviceId: string, file: File) {
  if (!file) return null;
  const fileExt = file.name.split('.').pop();
  const fileName = `services/${serviceId}/${Math.random()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('workshop-images')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('workshop-images')
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function fetchServiceReviews(serviceId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`*, users(name)`)
    .eq('service_id', serviceId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function insertReview(reviewData: any) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(reviewData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function replyToReview(reviewId: string, replyText: string) {
  const { error } = await supabase
    .from('reviews')
    .update({ reply: replyText })
    .eq('id', reviewId);

  if (error) throw error;
  return true;
}

export async function fetchPendingTransactions() {
  const { data, error } = await supabase
    .from('wallet_transactions')
    .select(`*, users(name, phone)`)
    .eq('type', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function approveTransaction(transactionId: string, userId: string, amount: number) {
  // Update transaction status to credit
  const { error: txError } = await supabase
    .from('wallet_transactions')
    .update({ type: 'credit', ref: 'تم تأكيد الدفع - شحن رصيد' })
    .eq('id', transactionId);

  if (txError) throw txError;

  // Fetch current user balance
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('wallet_balance')
    .eq('id', userId)
    .single();

  if (userError) throw userError;

  // Increment balance
  const newBalance = (user.wallet_balance || 0) + amount;
  const { error: updateError } = await supabase
    .from('users')
    .update({ wallet_balance: newBalance })
    .eq('id', userId);

  if (updateError) throw updateError;
  return true;
}

export async function fetchFavoritesDb(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('listing_id')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
  return data.map(d => d.listing_id);
}

export async function addFavoriteDb(userId: string, listingId: string) {
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, listing_id: listingId });
  if (error) console.error('Error adding favorite:', error);
}

export async function removeFavoriteDb(userId: string, listingId: string) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('listing_id', listingId);
  if (error) console.error('Error removing favorite:', error);
}

export async function purchaseSubscription(userId: string, serviceId: string, tier: string, cost: number) {
  // 1. Fetch user balance
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('wallet_balance')
    .eq('id', userId)
    .single();

  if (userError) throw userError;

  if ((user.wallet_balance || 0) < cost) {
    throw new Error('INSUFFICIENT_FUNDS');
  }

  // 2. Deduct balance
  const newBalance = (user.wallet_balance || 0) - cost;
  const { error: updateError } = await supabase
    .from('users')
    .update({ wallet_balance: newBalance })
    .eq('id', userId);

  if (updateError) throw updateError;

  // 3. Insert transaction
  const { error: txError } = await supabase
    .from('wallet_transactions')
    .insert({
      user_id: userId,
      amount: cost,
      type: 'debit',
      method: 'wallet',
      ref: `اشتراك بالباقة: ${tier}`
    });

  if (txError) throw txError;

  // 4. Update service tier
  const { error: serviceError } = await supabase
    .from('services')
    .update({ subscription_tier: tier })
    .eq('id', serviceId);

  if (serviceError) throw serviceError;

  return newBalance;
}
