import type { Metadata } from 'next'
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700', '900'],
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '600', '700'],
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
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
      <body className="font-sans bg-dark-950 text-silver-100">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
