export const dynamic = 'force-dynamic'

import { connectDB } from '@/lib/mongodb'
import DeveloperContent from '@/models/DeveloperContent'
import { mergeDeveloperContent } from '@/lib/developer-defaults'
import DeveloperPage from './DeveloperPage'

export default async function DeveloperServerPage() {
  let content = mergeDeveloperContent(null)
  try {
      await connectDB()
      const { assertCmsPagePublished } = await import("@/lib/cms-published")
      await assertCmsPagePublished("developer")
      const doc = await DeveloperContent.findOne().lean()
      content = mergeDeveloperContent(doc as Record<string, unknown> | null)
  } catch {
    // DB unavailable — render with defaults
  }

  return <DeveloperPage content={content} />
}
