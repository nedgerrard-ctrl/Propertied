export const dynamic = 'force-dynamic'

import { connectDB } from '@/lib/mongodb'
import OffThePlanExplainerContent from '@/models/OffThePlanExplainerContent'
import { mergeOffThePlanExplainerContent } from '@/lib/off-the-plan-explainer-defaults'
import OffThePlanExplainerPage from './OffThePlanExplainerPage'

export default async function OffThePlanExplainerServerPage() {
  let content = mergeOffThePlanExplainerContent(null)
  try {
      await connectDB()

      const { assertCmsPagePublished } = await import('@/lib/cms-published')
      await assertCmsPagePublished('off-the-plan-explainer')

      const doc = await OffThePlanExplainerContent.findOne().lean()
      content = mergeOffThePlanExplainerContent(doc as Record<string, unknown> | null)
  } catch {
    // DB unavailable — render with defaults
  }

  return <OffThePlanExplainerPage content={content} />
}
