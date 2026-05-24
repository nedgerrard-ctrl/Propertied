export const dynamic = 'force-dynamic'

import { connectDB } from '@/lib/mongodb'
import InsightsContent from '@/models/InsightsContent'
import { mergeInsightsContent } from '@/lib/insights-defaults'
import InsightsPage from './InsightsPage'

export default async function InsightsServerPage() {
  await connectDB()

  const { assertCmsPagePublished } = await import('@/lib/cms-published')
  await assertCmsPagePublished('insights')

  const doc = await InsightsContent.findOne().lean()
  const content = mergeInsightsContent(doc as Record<string, unknown> | null)

  return <InsightsPage content={content} />
}
