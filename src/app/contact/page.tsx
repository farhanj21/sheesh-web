import { Metadata } from 'next'
import { generateMetadata as genMeta, pageKeywords } from '@/lib/seo-utils'
import { getLocalBusinessSchema, renderJsonLd } from '@/lib/structured-data'
import { ContactForm } from '@/components/contact/ContactForm'

export const metadata: Metadata = genMeta({
  title: 'Contact Us',
  description: 'Get in touch with Sheesh Mirrorworks. Contact us via WhatsApp, Instagram, or email for custom mirror art inquiries, orders, and collaborations. Located in Lahore, Pakistan.',
  path: '/contact',
  keywords: pageKeywords.contact
})

export default function ContactPage() {
  const localBusinessSchema = getLocalBusinessSchema()

  return (
    <>
      {/* LocalBusiness Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderJsonLd(localBusinessSchema)}
      />
      <ContactForm />
    </>
  )
}
