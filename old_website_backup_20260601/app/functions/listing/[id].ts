// Cloudflare Pages Function — حقن meta tags + JSON-LD من الخادم لصفحات الإعلانات
// يراها الزواحف (Google, WhatsApp, Facebook) بدون تشغيل JS، والمستخدم يحصل على الـ SPA كاملاً

interface Env {
  ASSETS: { fetch: (req: Request | string) => Promise<Response> }
}

const SUPABASE_URL = 'https://hofuxamyrdbtqzethagl.supabase.co'
const SUPABASE_KEY = 'sb_publishable_7BI1G8jITg4SflzRVLzRqQ_fyKGQJ_J'
const BASE = 'https://carna.online'
const SITE = 'كارنا — CARNA'

function esc(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export const onRequest = async (context: { params: { id: string }; env: Env; request: Request }) => {
  const { params, env, request } = context
  const id = params.id

  // الـ SPA shell
  const shell = await env.ASSETS.fetch(new URL('/index.html', request.url).toString())

  // بيانات الإعلان
  let listing: any = null
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/listings?id=eq.${id}&status=eq.active&select=title,make,model,year,city,price,km,fuel,color,description,listing_images(url)`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )
    const rows = await r.json()
    listing = Array.isArray(rows) ? rows[0] : null
  } catch { /* ignore — fall back to SPA shell */ }

  if (!listing) return shell

  const title = `${listing.title} | ${SITE}`
  const desc  = `${listing.make} ${listing.model} ${listing.year} — ${listing.city} — ${Number(listing.price).toLocaleString()} ل.س`
  const img   = listing.listing_images?.[0]?.url ?? `${BASE}/og-default.jpg`
  const url   = `${BASE}/listing/${id}`

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: listing.title,
    brand: { '@type': 'Brand', name: listing.make },
    model: listing.model,
    vehicleModelDate: String(listing.year),
    mileageFromOdometer: { '@type': 'QuantitativeValue', value: listing.km, unitCode: 'KMT' },
    fuelType: listing.fuel,
    color: listing.color,
    image: img,
    description: listing.description,
    offers: { '@type': 'Offer', price: listing.price, priceCurrency: 'SYP', availability: 'https://schema.org/InStock', areaServed: listing.city },
  })

  const head = `
    <meta property="og:type" content="article">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(desc)}">
    <meta property="og:image" content="${esc(img)}">
    <meta property="og:url" content="${esc(url)}">
    <meta property="og:site_name" content="${esc(SITE)}">
    <meta property="og:locale" content="ar_SY">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(desc)}">
    <meta name="twitter:image" content="${esc(img)}">
    <meta name="description" content="${esc(desc)}">
    <link rel="canonical" href="${esc(url)}">
    <script type="application/ld+json">${jsonLd}</script>
  `

  // @ts-ignore — HTMLRewriter متاح في بيئة Cloudflare Workers
  return new HTMLRewriter()
    .on('title', { element(el: any) { el.setInnerContent(title) } })
    .on('head', { element(el: any) { el.append(head, { html: true }) } })
    .transform(shell)
}
