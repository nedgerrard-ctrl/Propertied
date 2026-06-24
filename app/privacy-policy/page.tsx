export const dynamic = 'force-dynamic'

import { connectDB } from '@/lib/mongodb'
import PrivacyPolicyContent from '@/models/PrivacyPolicyContent'
import { mergePrivacyPolicyContent } from '@/lib/privacy-policy-defaults'
import PrivacyPolicyPage from './PrivacyPolicyPage'

export default async function PrivacyPolicyServerPage() {
  await connectDB()

  const { assertCmsPagePublished } = await import('@/lib/cms-published')
  await assertCmsPagePublished('privacy-policy')

  const doc = await PrivacyPolicyContent.findOne().lean()
  const content = mergePrivacyPolicyContent(doc as Record<string, unknown> | null)

  return <PrivacyPolicyPage content={content} />
}
