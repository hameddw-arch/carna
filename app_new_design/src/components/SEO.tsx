import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  jsonLd?: object | object[]
}

const SITE = 'كارنا — CARNA'
const BASE_URL = 'https://carna.online'
const DEFAULT_IMG = `${BASE_URL}/og-default.jpg`
const DEFAULT_DESC = 'سيارتك الجاية — هون. آلاف الإعلانات من كل سوريا. ابحث، قارن، واشتري بثقة.'

export default function SEO({ title, description, image, url, type = 'website', jsonLd }: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE}` : SITE
  const desc      = description ?? DEFAULT_DESC
  const img       = image ?? DEFAULT_IMG
  const canonical = url ? `${BASE_URL}${url}` : BASE_URL

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc}/>
      <link rel="canonical" href={canonical}/>

      {/* Open Graph */}
      <meta property="og:type"        content={type}/>
      <meta property="og:title"       content={fullTitle}/>
      <meta property="og:description" content={desc}/>
      <meta property="og:image"       content={img}/>
      <meta property="og:url"         content={canonical}/>
      <meta property="og:site_name"   content={SITE}/>
      <meta property="og:locale"      content="ar_SY"/>

      {/* Twitter */}
      <meta name="twitter:card"        content="summary_large_image"/>
      <meta name="twitter:title"       content={fullTitle}/>
      <meta name="twitter:description" content={desc}/>
      <meta name="twitter:image"       content={img}/>

      {/* Schema.org structured data */}
      {jsonLd && Array.isArray(jsonLd) ? (
        jsonLd.map((schema, idx) => (
          <script key={idx} type="application/ld+json">{JSON.stringify(schema)}</script>
        ))
      ) : jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
    </Helmet>
  )
}
