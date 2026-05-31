import { supabase } from '../supabase'

export async function fetchPendingTransactions() {
  const { data, error } = await supabase
    .from('wallet_transactions')
    .select(`*, users(name, phone)`)
    .eq('type', 'pending')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function approveTransaction(transactionId: string, userId: string, amount: number) {
  const { error: txError } = await supabase
    .from('wallet_transactions')
    .update({ type: 'credit', ref: 'تم تأكيد الدفع - شحن رصيد' })
    .eq('id', transactionId)

  if (txError) throw txError

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('wallet_balance')
    .eq('id', userId)
    .single()

  if (userError) throw userError

  const newBalance = (user.wallet_balance || 0) + amount
  const { error: updateError } = await supabase
    .from('users')
    .update({ wallet_balance: newBalance })
    .eq('id', userId)

  if (updateError) throw updateError
  return true
}

export async function purchaseSubscription(userId: string, serviceId: string, tier: string, cost: number) {
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('wallet_balance')
    .eq('id', userId)
    .single()

  if (userError) throw userError

  if ((user.wallet_balance || 0) < cost) {
    throw new Error('INSUFFICIENT_FUNDS')
  }

  const newBalance = (user.wallet_balance || 0) - cost
  const { error: updateError } = await supabase
    .from('users')
    .update({ wallet_balance: newBalance })
    .eq('id', userId)

  if (updateError) throw updateError

  const { error: txError } = await supabase
    .from('wallet_transactions')
    .insert({
      user_id: userId,
      amount: cost,
      type: 'debit',
      method: 'wallet',
      ref: `اشتراك بالباقة: ${tier}`
    })

  if (txError) throw txError

  const { error: serviceError } = await supabase
    .from('services')
    .update({ subscription_tier: tier })
    .eq('id', serviceId)

  if (serviceError) throw serviceError

  return newBalance
}
