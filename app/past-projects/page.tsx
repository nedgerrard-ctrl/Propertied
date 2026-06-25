export const dynamic = 'force-dynamic'

import { connectDB } from '@/lib/mongodb'
import PastProjectsContent from '@/models/PastProjectsContent'
import { mergePastProjectsContent } from '@/lib/past-projects-defaults'
import PastProjectsPage from './PastProjectsPage'

export default async function PastProjectsServerPage() {
  let content = mergePastProjectsContent(null)
  try {
      await connectDB()

      const { assertCmsPagePublished } = await import('@/lib/cms-published')
      await assertCmsPagePublished('past-projects')

      const doc = await PastProjectsContent.findOne().lean()
      content = mergePastProjectsContent(doc as Record<string, unknown> | null)
  } catch {
    // DB unavailable — render with defaults
  }

  return <PastProjectsPage content={content} />
}
