import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

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
  title: 'Sheesh - Mosaic Mirroworks',
  description: 'Premium mosaic mirrorworks, disco balls, and reflective artistic products to transform your space.',
  openGraph: {
    title: 'Sheesh - Reflective Art & Disco Balls',
    description: 'Premium mosaic mirrorworks and reflective art.',
    images: ['/images/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID

  return (
    <html lang="en" className={`${hkGrotesk.variable} overflow-x-hidden`}>
      <body className="font-sans bg-dark-950 text-silver-100 overflow-x-hidden">
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
      </body>
    </html>
  )
}
