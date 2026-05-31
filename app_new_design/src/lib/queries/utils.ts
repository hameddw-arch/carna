import { supabase } from '../supabase'

export const PLACEHOLDER = '/placeholder-car.svg'

export async function uploadAvatar(userId: string, file: File) {
  if (!file) return null
  const fileExt = file.name.split('.').pop()
  const fileName = `avatars/${userId}-${Math.random()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true })

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)

  const { error: updateError } = await supabase
    .from('users')
    .update({ avatar_url: publicUrl })
    .eq('id', userId)

  if (updateError) throw updateError
  return publicUrl
}
