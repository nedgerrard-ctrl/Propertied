export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: '2026 Federal Budget & Property Market Insights',
  description: 'The May 2026 Federal Budget created a two-track property tax system that explicitly favours new builds over established housing. Off-the-plan property is now one of the most tax-advantaged assets in Australia.',
}

import { connectDB } from '@/lib/mongodb'
import InsightsContent from '@/models/InsightsContent'
import { mergeInsightsContent } from '@/lib/insights-defaults'
import InsightsPage from './InsightsPage'

export default async function InsightsServerPage() {
  let content = mergeInsightsContent(null)
  try {
      await connectDB()

      const { assertCmsPagePublished } = await import('@/lib/cms-published')
      await assertCmsPagePublished('insights')

      const doc = await InsightsContent.findOne().lean()
      content = mergeInsightsContent(doc as Record<string, unknown> | null)
  } catch {
    // DB unavailable — render with defaults
  }

  return <InsightsPage content={content} />
}
