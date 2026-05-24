export const dynamic = 'force-dynamic'

import { connectDB } from '@/lib/mongodb'
import ResourcesContent from '@/models/ResourcesContent'
import { mergeResourcesContent } from '@/lib/resources-defaults'
import ResourcesPage from './ResourcesPage'

export default async function ResourcesServerPage() {
  await connectDB()

  const { assertCmsPagePublished } = await import('@/lib/cms-published')
  await assertCmsPagePublished('resources')

  const doc = await ResourcesContent.findOne().lean()
  const content = mergeResourcesContent(doc as Record<string, unknown> | null)

  return <ResourcesPage content={content} />
}
