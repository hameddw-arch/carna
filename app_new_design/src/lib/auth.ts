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

const SESSION_KEY = 'carna_user'

export function getSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveSession(user: AuthUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

// Generate 6-digit OTP and store in DB
export async function requestOTP(phone: string): Promise<string> {
  const code = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 min

  // Invalidate old codes
  await supabase
    .from('otp_codes')
    .update({ used: true })
    .eq('phone', phone)
    .eq('used', false)

  const { error } = await supabase.from('otp_codes').insert({
    phone,
    code,
    expires_at: expiresAt,
  })

  if (error) throw error

  // Send SMS — falls back to dev mode if env vars not set
  try {
    await supabase.functions.invoke('send-sms', {
      body: {
        phone,
        message: `كارنا: رمز التحقق الخاص بك هو ${code} — صالح لمدة 10 دقائق`,
      },
    })
    return '' // SMS sent — no need to expose code
  } catch {
    // dev fallback: return code to display on screen
    return code
  }
}

// Verify OTP and login/register user
export async function verifyOTP(phone: string, code: string): Promise<AuthUser> {
  const { data: otpRow, error: otpErr } = await supabase
    .from('otp_codes')
    .select('*')
    .eq('phone', phone)
    .eq('code', code)
    .eq('used', false)
    .gte('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (otpErr || !otpRow) throw new Error('الرمز غير صحيح أو انتهى وقته')

  // Mark OTP as used
  await supabase.from('otp_codes').update({ used: true }).eq('id', otpRow.id)

  // Find or create user
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('phone', phone)
    .single()

  let user: AuthUser

  if (existing) {
    user = existing as AuthUser
  } else {
    const { data: created, error: createErr } = await supabase
      .from('users')
      .insert({ phone, verified: true })
      .select()
      .single()

    if (createErr || !created) throw new Error('صار في مشكلة بسيطة — جرب مرة ثانية')
    user = created as AuthUser
  }

  saveSession(user)
  return user
}

export async function updateProfile(userId: string, name: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ name })
    .eq('id', userId)

  if (error) throw error

  const session = getSession()
  if (session) saveSession({ ...session, name })
}
