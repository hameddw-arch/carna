import { supabase } from './supabase'

export interface AuthUser {
  id: string
  phone: string
  name: string | null
  email?: string | null
  avatar_url: string | null
  verified: boolean
  wallet_balance: number
  is_admin: boolean
  role?: string
  email_notifications?: boolean
  sms_notifications?: boolean
  user_metadata?: Record<string, unknown>
}

export async function getSession(): Promise<AuthUser | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return null

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profile) {
      return { ...profile, phone: profile.phone || session.user.phone } as AuthUser
    }
    
    // Fallback if profile is not created by trigger yet
    return {
      id: session.user.id,
      phone: session.user.phone || '',
      name: null,
      avatar_url: null,
      verified: true,
      wallet_balance: 0,
      is_admin: false
    }
  } catch {
    return null
  }
}

export async function clearSession() {
  await supabase.auth.signOut()
}

// Generate OTP via Supabase Auth
export async function requestOTP(phone: string): Promise<void> {
  const formattedPhone = phone.startsWith('0') ? '+963' + phone.slice(1) : phone;
  
  const { error } = await supabase.auth.signInWithOtp({
    phone: formattedPhone,
  })

  if (error) {
    throw new Error(error.message || 'حدث خطأ أثناء إرسال الرمز')
  }
}

// Verify OTP via Supabase Auth
export async function verifyOTP(phone: string, code: string): Promise<AuthUser> {
  const formattedPhone = phone.startsWith('0') ? '+963' + phone.slice(1) : phone;
  
  const { data, error } = await supabase.auth.verifyOtp({
    phone: formattedPhone,
    token: code,
    type: 'sms',
  })

  if (error) {
    console.error('OTP Verification Error:', error)
    throw new Error(error.message || 'الرمز غير صحيح أو انتهت صلاحيته')
  }
  if (!data.user || !data.session) {
    throw new Error('لم يتم إنشاء جلسة صالحة')
  }

  // Wait a small bit to allow the database trigger to create the profile row
  await new Promise(resolve => setTimeout(resolve, 500));

  const { data: profile, error: profileErr } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single()
    
  if (profile) {
    return { ...profile, phone: formattedPhone } as AuthUser
  }
  
  // Fallback
  return {
    id: data.user.id,
    phone: formattedPhone,
    name: null,
    avatar_url: null,
    verified: true,
    wallet_balance: 0,
    is_admin: false
  }
}

export async function updateProfile(userId: string, name: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ name })
    .eq('id', userId)

  if (error) throw error
}
