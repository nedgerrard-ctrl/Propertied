export const dynamic = 'force-dynamic'

import { connectDB } from '@/lib/mongodb'
import LandingContent from '@/models/LandingContent'
import ShowcaseProject from '@/models/ShowcaseProject'
import { mergeLandingContent } from '@/lib/landing-defaults'
import { mergeShowcaseProjects } from '@/lib/showcase-defaults'
import LandingPage, { ShowcaseProjectData } from './LandingPage'

export default async function Home() {
  await connectDB()
  const { assertCmsPagePublished } = await import("@/lib/cms-published")
  await assertCmsPagePublished("landing")
  const doc = await LandingContent.findOne().lean()
  const content = mergeLandingContent(doc as Record<string, unknown> | null)

  let dbProjects: ShowcaseProjectData[] = []
  try {
    const raw = await ShowcaseProject.find({ published: true })
      .sort({ order: 1, createdAt: 1 })
      .lean() as Array<{
        _id: unknown
        name: string
        address: string
        image?: string
        order?: number
        published?: boolean
      }>

    dbProjects = raw.map((p) => ({
      _id: String(p._id),
      name: p.name,
      address: p.address,
      image: p.image ?? "",
      order: p.order ?? 0,
      published: p.published ?? true,
    }))
  } catch {
    // fall through to defaults
  }

  const showcaseProjects = mergeShowcaseProjects(dbProjects)

  return <LandingPage content={content} showcaseProjects={showcaseProjects} />
}
