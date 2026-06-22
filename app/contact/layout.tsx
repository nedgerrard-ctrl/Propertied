import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact PPM',
  description: 'Get in touch with PPM — Property Project Marketing. General enquiries, buyer briefs, developer partnerships and document requests.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
