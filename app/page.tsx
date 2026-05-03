export const dynamic = 'force-dynamic'

import { connectDB } from '@/lib/mongodb'
import LandingContent from '@/models/LandingContent'
import { mergeLandingContent } from '@/lib/landing-defaults'
import LandingPage from './LandingPage'

export default async function Home() {
  await connectDB()
  const doc = await LandingContent.findOne().lean()
  const content = mergeLandingContent(doc as Record<string, unknown> | null)

  return <LandingPage content={content} />
}
