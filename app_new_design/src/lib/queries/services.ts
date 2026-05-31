import { supabase } from '../supabase'

export async function fetchServices(filters?: {
  category?: string
  city?: string
  tier?: string
  sortBy?: 'rating' | 'inspections' | 'newest'
}) {
  let query = supabase.from('services').select(`*, service_categories(name)`)

  const sortBy = filters?.sortBy ?? 'rating'
  if (sortBy === 'rating') query = query.order('rating', { ascending: false })
  else if (sortBy === 'inspections') query = query.order('inspections_count', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  if (filters?.category && filters.category !== 'الكل') {
    const { data: cats } = await supabase
      .from('service_categories').select('id').eq('name', filters.category).single()
    if (cats) query = query.eq('category_id', cats.id)
  }
  if (filters?.city && filters.city !== 'كل المدن') query = query.eq('city', filters.city)
  if (filters?.tier && filters.tier !== 'الكل') query = query.eq('subscription_tier', filters.tier)

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
    .select(`*, service_categories(name), service_images(id, url, "order")`)
    .eq('id', id)
    .single()
  if (error) throw error
  return {
    ...data,
    category: data.service_categories?.name ?? '',
    images: data.service_images?.sort((a: any, b: any) => a.order - b.order) ?? []
  }
}

export async function fetchUserService(ownerId: string) {
  const { data, error } = await supabase
    .from('services')
    .select(`*, service_categories(name), service_images(id, url, "order")`)
    .eq('user_id', ownerId)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return {
    ...data,
    category: data.service_categories?.name ?? '',
    images: data.service_images?.sort((a: any, b: any) => a.order - b.order) ?? []
  }
}

export async function checkWorkshopStatus() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('services')
    .select('id, name')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) return null
  return data
}

export async function incrementServiceAnalytics(serviceId: string, colName: 'views_count' | 'whatsapp_clicks' | 'shares_count') {
  const { error } = await supabase.rpc('increment_service_stat', {
    row_id: serviceId,
    col_name: colName
  })
  if (error) console.error('Error incrementing analytics:', error)
}

export async function updateServiceStatus(id: string, status: 'active' | 'inactive') {
  const { data, error } = await supabase
    .from('services')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteService(id: string) {
  const { error } = await supabase
    .from('services')
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

export async function uploadServiceImage(serviceId: string, file: File, order: number = 0) {
  if (!file) return null
  const fileExt = file.name.split('.').pop()
  const fileName = `services/${serviceId}/${Math.random()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('workshop-images')
    .upload(fileName, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('workshop-images')
    .getPublicUrl(fileName)

  const { error: dbError, data } = await supabase
    .from('service_images')
    .insert({
      service_id: serviceId,
      url: publicUrl,
      order: order
    })
    .select()
    .single()

  if (dbError) throw dbError

  return data
}

export async function deleteServiceImage(imageId: string) {
  const { error } = await supabase
    .from('service_images')
    .delete()
    .eq('id', imageId)

  if (error) throw error
  return true
}
