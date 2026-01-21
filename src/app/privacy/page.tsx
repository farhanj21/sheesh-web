import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo-utils'
import { PrivacyContent } from '@/components/privacy/PrivacyContent'

export const metadata: Metadata = genMeta({
  title: 'Privacy Policy',
  description: 'Privacy Policy for Sheesh Mirrorworks. Learn how we collect, use, and protect your personal information when you visit our website or purchase our handcrafted mirror art.',
  path: '/privacy',
  noIndex: false
})

export default function PrivacyPage() {
  return <PrivacyContent />
}
