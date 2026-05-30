// @ts-nocheck — Deno runtime, not Node.js
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Normalize Syrian phone → international format
// 09xxxxxxxx → +9639xxxxxxxx
// 9639xxxxxxxx → +9639xxxxxxxx
function normalizePhone(phone: string): string {
  const clean = phone.replace(/\s+/g, '').replace(/-/g, '')
  if (clean.startsWith('+')) return clean
  if (clean.startsWith('009')) return '+' + clean.slice(2)
  if (clean.startsWith('09')) return '+963' + clean.slice(1)
  if (clean.startsWith('963')) return '+' + clean
  return '+' + clean
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { phone, message } = await req.json()
    if (!phone || !message) throw new Error('phone and message required')

    const provider  = Deno.env.get('SMS_PROVIDER') ?? 'dev'
    const intlPhone = normalizePhone(phone)

    if (provider === 'whatsapp') {
      await sendWhatsApp(intlPhone, message)
    } else if (provider === 'twilio') {
      await sendTwilioSMS(intlPhone, message)
    } else if (provider === 'unifonic') {
      await sendUnifonic(intlPhone, message)
    } else {
      // dev mode — log only
      console.log(`[DEV] To: ${intlPhone} | ${message}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

// ── WhatsApp via Twilio ───────────────────────────────────────────────────────
async function sendWhatsApp(to: string, body: string) {
  const sid   = Deno.env.get('TWILIO_ACCOUNT_SID')!
  const token = Deno.env.get('TWILIO_AUTH_TOKEN')!
  const from  = Deno.env.get('TWILIO_WHATSAPP_FROM')! // whatsapp:+14155238886

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${sid}:${token}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To:   `whatsapp:${to}`,
        From: from,
        Body: body,
      }),
    }
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message ?? 'Twilio WhatsApp error')
  }
}

// ── Twilio SMS ────────────────────────────────────────────────────────────────
async function sendTwilioSMS(to: string, body: string) {
  const sid   = Deno.env.get('TWILIO_ACCOUNT_SID')!
  const token = Deno.env.get('TWILIO_AUTH_TOKEN')!
  const from  = Deno.env.get('TWILIO_FROM_NUMBER')!

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${sid}:${token}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }),
    }
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message ?? 'Twilio SMS error')
  }
}

// ── Unifonic ──────────────────────────────────────────────────────────────────
async function sendUnifonic(to: string, body: string) {
  const appSid = Deno.env.get('UNIFONIC_APP_SID')!
  const sender = Deno.env.get('UNIFONIC_SENDER_ID') ?? 'CARNA'

  const res = await fetch('https://el.cloud.unifonic.com/rest/SMS/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      AppSid: appSid, SenderID: sender, Body: body,
      Recipient: to, responseType: 'JSON',
    }),
  })
  if (!res.ok) throw new Error('Unifonic error')
}
