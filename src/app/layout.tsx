import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { themeScript } from '@/lib/themeScript'
import { siteConfig } from '@/lib/seo-utils'
import { getOrganizationSchema, renderJsonLd } from '@/lib/structured-data'

const hkGrotesk = localFont({
  src: [
    {
      path: './fonts/HKGrotesk-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/HKGrotesk-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/HKGrotesk-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/HKGrotesk-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-hk-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: [
    'mosaic mirror',
    'disco ball',
    'reflective art',
    'mirror art',
    'decorative mirrors',
    'custom mirrorworks',
    'Pakistan mirrors',
    'Lahore mirror art',
    'Aliha Naeem'
  ],
  authors: [{ name: siteConfig.founder }],
  creator: siteConfig.founder,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/images/og-image.jpg'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID
  const organizationSchema = getOrganizationSchema()

  return (
    <html
      lang="en"
      className={`${hkGrotesk.variable} overflow-x-hidden`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
      </head>
      <body className="font-sans overflow-x-hidden">
        <ThemeProvider>
          {/* Organization Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={renderJsonLd(organizationSchema)}
          />

          {/* Google Analytics 4 */}
          {GA4_ID && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA4_ID}', {
                    page_path: window.location.pathname,
                  });
                `}
              </Script>
            </>
          )}

          <Header />
          <main className="overflow-x-hidden">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
