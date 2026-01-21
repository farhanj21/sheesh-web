import { Metadata } from 'next'

// Site configuration
export const siteConfig = {
  name: 'Sheesh Mirrorworks',
  url: 'https://www.sheeshpk.store/',
  description: 'Premium mosaic mirrorworks, disco balls, and reflective artistic products to transform your space.',
  founder: 'Aliha Naeem',
  email: 'sheeshupyourlife@gmail.com',
  phone: '+92 324 7131809', 
  address: {
    streetAddress: 'Lahore',
    addressLocality: 'Lahore',
    addressRegion: 'Punjab',
    postalCode: '54000',
    addressCountry: 'PK'
  },
  social: {
    instagram: 'https://www.instagram.com/sheeshupyourlife/',
  }
}

interface GenerateMetadataParams {
  title?: string
  description?: string
  path?: string
  images?: string[]
  noIndex?: boolean
  keywords?: string[]
}

export function generateMetadata({
  title,
  description = siteConfig.description,
  path = '',
  images = ['/images/og-image.jpg'],
  noIndex = false,
  keywords = []
}: GenerateMetadataParams = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name
  const url = `${siteConfig.url}${path}`

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: [{ name: siteConfig.founder }],
    creator: siteConfig.founder,
    publisher: siteConfig.name,
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      images: images.map(image => ({
        url: image.startsWith('http') ? image : `${siteConfig.url}${image}`,
        width: 1200,
        height: 630,
        alt: fullTitle
      }))
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: images.map(image =>
        image.startsWith('http') ? image : `${siteConfig.url}${image}`
      )
    },
    alternates: {
      canonical: url
    }
  }
}

// Keywords for different pages
export const pageKeywords = {
  home: [
    'mosaic mirror',
    'disco ball',
    'reflective art',
    'mirror art',
    'decorative mirrors',
    'custom mirrorworks',
    'Pakistan mirrors',
    'Lahore mirror art'
  ],
  products: [
    'mosaic mirror products',
    'disco balls for sale',
    'mirror wall art',
    'reflective decor',
    'custom mirror designs',
    'mirror mosaic tiles'
  ],
  about: [
    'Aliha Naeem',
    'Sheesh Mirrorworks founder',
    'mirror artist Pakistan',
    'Lahore craftsman',
    'mirror art studio'
  ],
  events: [
    'mirror art exhibitions',
    'Sheesh events',
    'art gallery Lahore',
    'mirror art showcase',
    'Pakistan art events'
  ],
  contact: [
    'contact Sheesh Mirrorworks',
    'mirror art inquiry',
    'custom mirror order',
    'Lahore mirror shop',
    'get in touch'
  ]
}
