export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'كارنا — CARNA',
    alternateName: 'CARNA',
    url: 'https://carna.online',
    logo: 'https://carna.online/carna-logo.svg',
    description: 'سيارتك الجاية — هون. آلاف الإعلانات من كل سوريا. ابحث، قارن، واشتري بثقة.',
    sameAs: [
      'https://facebook.com/carna.online',
      'https://instagram.com/carna.online',
      'https://twitter.com/carnaonline'
    ],
    contact: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: '+963-xxx-xxx-xxx',
      email: 'support@carna.online',
      areaServed: 'SY',
      availableLanguage: 'ar'
    },
    foundingDate: '2024',
    areaServed: {
      '@type': 'Country',
      name: 'Syria'
    }
  }
}

export function localBusinessSchema(city?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'كارنا — CARNA',
    description: 'منصة شراء وبيع السيارات عبر الإنترنت في سوريا',
    url: 'https://carna.online',
    telephone: '+963-xxx-xxx-xxx',
    email: 'support@carna.online',
    image: 'https://carna.online/carna-logo.svg',
    ...(city && {
      areaServed: {
        '@type': 'City',
        name: city
      }
    }),
    priceRange: '₪₪₪',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      ratingCount: '1000+'
    }
  }
}

export function productSchema(car: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${car.make} ${car.model} ${car.year}`,
    description: car.description,
    image: car.image,
    brand: {
      '@type': 'Brand',
      name: car.make
    },
    offers: {
      '@type': 'Offer',
      price: car.price,
      priceCurrency: 'SYP',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Person',
        name: car.users?.name || 'بائع'
      }
    },
    ...(car.users?.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: car.users.rating,
        reviewCount: car.users.rating_count || 0
      }
    })
  }
}

export function searchActionSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'كارنا — CARNA',
    url: 'https://carna.online',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://carna.online/browse?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }
}
