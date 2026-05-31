import { supabase } from '../supabase'

export async function fetchAdminStats() {
  const { count: listingsCount } = await supabase.from('listings').select('*', { count: 'exact', head: true })
  const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true })
  const { count: servicesCount } = await supabase.from('services').select('*', { count: 'exact', head: true })

  return {
    listingsCount: listingsCount || 0,
    usersCount: usersCount || 0,
    servicesCount: servicesCount || 0,
    revenue: 2500000
  }
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

export async function fetchAllServicesForAdmin(limit?: number) {
  let query = supabase
    .from('services')
    .select(`*, users(name, phone)`)
    .order('created_at', { ascending: false })

  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function fetchAdminLogs(limit = 50) {
  const { data, error } = await supabase
    .from('admin_logs')
    .select(`*, users(name)`)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.warn('Failed to fetch admin logs:', error)
    return []
  }
  return data
}

export async function insertAdminLog(logData: { action: string, type: string, color: string, icon: string }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from('admin_logs')
    .insert({
      ...logData,
      user_id: user.id
    })

  if (error) console.error('Failed to insert admin log:', error)
}

export async function fetchAllUsers(limit = 100) {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, phone, email, is_admin, is_banned, created_at, wallet_balance, rating, rating_count')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

export async function toggleUserAdmin(userId: string, isAdmin: boolean) {
  const { data, error } = await supabase
    .from('users')
    .update({ is_admin: isAdmin })
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function toggleUserBan(userId: string, isBanned: boolean) {
  const { data, error } = await supabase
    .from('users')
    .update({ is_banned: isBanned })
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function fetchGovernorates(activeOnly = false) {
  let query = supabase.from('governorates').select('*').order('name')
  if (activeOnly) {
    query = query.eq('is_active', true)
  }
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function addGovernorate(name: string) {
  const { data, error } = await supabase
    .from('governorates')
    .insert({ name, is_active: true })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function toggleGovernorate(id: string, is_active: boolean) {
  const { data, error } = await supabase
    .from('governorates')
    .update({ is_active })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteGovernorate(id: string) {
  const { error } = await supabase
    .from('governorates')
    .delete()
    .eq('id', id)
  if (error) throw error
  return true
}

export async function fetchSystemSettings() {
  const { data, error } = await supabase
    .from('system_settings')
    .select('*')
    .order('key')
  if (error) throw error
  return data || []
}

export async function updateSystemSetting(key: string, value: any) {
  const { data, error } = await supabase
    .from('system_settings')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('key', key)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function fetchPendingWorkshops(limit = 50) {
  const { data, error } = await supabase
    .from('services')
    .select('*, users(name, phone)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

export async function approveWorkshop(id: string) {
  const { data, error } = await supabase
    .from('services')
    .update({ status: 'active' })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function rejectWorkshop(id: string) {
  const { data, error } = await supabase
    .from('services')
    .update({ status: 'rejected' })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
