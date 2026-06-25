export const dynamic = 'force-dynamic'

import { connectDB } from '@/lib/mongodb'
import FullDisclaimerContent from '@/models/FullDisclaimerContent'
import { mergeFullDisclaimerContent } from '@/lib/full-disclaimer-defaults'
import FullDisclaimerPage from './FullDisclaimerPage'

export default async function FullDisclaimerServerPage() {
  let content = mergeFullDisclaimerContent(null)
  try {
      await connectDB()

      const { assertCmsPagePublished } = await import('@/lib/cms-published')
      await assertCmsPagePublished('full-disclaimer')

      const doc = await FullDisclaimerContent.findOne().lean()
      content = mergeFullDisclaimerContent(doc as Record<string, unknown> | null)
  } catch {
    // DB unavailable — render with defaults
  }

  return <FullDisclaimerPage content={content} />
}
