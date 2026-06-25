export const dynamic = 'force-dynamic'

import { connectDB } from '@/lib/mongodb'
import PrivacyPolicyContent from '@/models/PrivacyPolicyContent'
import { mergePrivacyPolicyContent } from '@/lib/privacy-policy-defaults'
import PrivacyPolicyPage from './PrivacyPolicyPage'

export default async function PrivacyPolicyServerPage() {
  let content = mergePrivacyPolicyContent(null)
  try {
      await connectDB()

      const { assertCmsPagePublished } = await import('@/lib/cms-published')
      await assertCmsPagePublished('privacy-policy')

      const doc = await PrivacyPolicyContent.findOne().lean()
      content = mergePrivacyPolicyContent(doc as Record<string, unknown> | null)
  } catch {
    // DB unavailable — render with defaults
  }

  return <PrivacyPolicyPage content={content} />
}
