import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { phone, message } = await req.json()
    if (!phone || !message) throw new Error('phone and message required')

    const provider = Deno.env.get('SMS_PROVIDER') ?? 'twilio'

    if (provider === 'twilio') {
      await sendTwilio(phone, message)
    } else if (provider === 'unifonic') {
      await sendUnifonic(phone, message)
    } else {
      // dev mode — just log
      console.log(`[DEV SMS] To: ${phone} | Msg: ${message}`)
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

// ── Twilio (يغطي +963 سوريا) ─────────────────────────────────────────────────
async function sendTwilio(to: string, body: string) {
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
    throw new Error(err.message ?? 'Twilio error')
  }
}

// ── Unifonic (مزود عربي يدعم سوريا) ─────────────────────────────────────────
async function sendUnifonic(to: string, body: string) {
  const appSid = Deno.env.get('UNIFONIC_APP_SID')!
  const sender = Deno.env.get('UNIFONIC_SENDER_ID') ?? 'CARNA'

  const res = await fetch('https://el.cloud.unifonic.com/rest/SMS/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      AppSid:     appSid,
      SenderID:   sender,
      Body:       body,
      Recipient:  to,
      responseType: 'JSON',
    }),
  })
  if (!res.ok) throw new Error('Unifonic error')
}
