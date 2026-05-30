// يولّد sitemap.xml + robots.txt بعد البناء — يجلب الإعلانات والورشات النشطة من Supabase
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const BASE = 'https://carna.online'
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://hofuxamyrdbtqzethagl.supabase.co'
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_7BI1G8jITg4SflzRVLzRqQ_fyKGQJ_J'

const STATIC = ['/', '/services', '/packages', '/terms', '/privacy', '/contact']

async function fetchRows(table, query) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

function urlTag(loc, lastmod, priority) {
  return `  <url>\n    <loc>${BASE}${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod.split('T')[0]}</lastmod>` : ''}\n    <priority>${priority}</priority>\n  </url>`
}

async function main() {
  const [listings, services] = await Promise.all([
    fetchRows('listings', 'select=id,created_at&status=eq.active&order=created_at.desc&limit=5000'),
    fetchRows('services', 'select=id&status=eq.active&limit=2000'),
  ])

  const urls = [
    ...STATIC.map(p => urlTag(p, null, p === '/' ? '1.0' : '0.7')),
    ...listings.map(l => urlTag(`/listing/${l.id}`, l.created_at, '0.8')),
    ...services.map(s => urlTag(`/services/${s.id}`, null, '0.6')),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`

  const dist = resolve(process.cwd(), 'dist')
  writeFileSync(resolve(dist, 'sitemap.xml'), xml)
  writeFileSync(resolve(dist, 'robots.txt'), robots)
  console.log(`✓ sitemap.xml — ${urls.length} urls (${listings.length} listings, ${services.length} services)`)
}

main()
