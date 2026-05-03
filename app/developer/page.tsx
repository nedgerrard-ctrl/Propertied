export const dynamic = 'force-dynamic'

import { connectDB } from '@/lib/mongodb'
import DeveloperContent from '@/models/DeveloperContent'
import { mergeDeveloperContent } from '@/lib/developer-defaults'
import DeveloperPage from './DeveloperPage'

export default async function DeveloperServerPage() {
  await connectDB()
  const doc = await DeveloperContent.findOne().lean()
  const content = mergeDeveloperContent(doc as Record<string, unknown> | null)

  return <DeveloperPage content={content} />
}
