export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'For Investors — End-to-End Property Investment',
  description: 'PPM\'s five-step model for property investors: we source, you buy, we manage, we sell and we reinvest — a complete wealth-building journey for Melbourne off-the-plan property.',
}

import { connectDB } from '@/lib/mongodb'
import BuyerContentModel from '@/models/BuyerContent'
import Project from '@/models/Project'
import { mergeBuyerContent } from '@/lib/buyer-defaults'
import { projects as SEED_PROJECTS } from '@/lib/projects-data'
import BuyersPage, { type DynamicProject } from '../BuyersPage'

export default async function InvestorsPage() {
  let content = mergeBuyerContent(null)
  let projects: DynamicProject[] = []

  try {
    await connectDB()
    const { assertCmsPagePublished } = await import('@/lib/cms-published')
    await assertCmsPagePublished('buyer')

    const [doc, count] = await Promise.all([
      BuyerContentModel.findOne({ section: 'investors' }).lean(),
      Project.countDocuments(),
    ])

    // Always wipe and re-seed — guarantees only canonical projects show
    await Project.deleteMany({})
    await Project.insertMany(SEED_PROJECTS.map(({ id: _omit, ...rest }) => rest))

    const dynamicDocs = await Project.find({ published: true }).sort({ createdAt: -1 }).lean()
    content = mergeBuyerContent(doc as Record<string, unknown> | null)
    projects = dynamicDocs.map((d) => ({
      _id:              (d._id as { toString(): string }).toString(),
      name:             d.name as string,
      suburb:           d.suburb as string,
      state:            d.state as string,
      type:             d.type as DynamicProject['type'],
      propertyInterest: d.propertyInterest as DynamicProject['propertyInterest'],
      status:           d.status as DynamicProject['status'],
      bedrooms:         d.bedrooms as string,
      bathrooms:        d.bathrooms as string,
      carSpaces:        d.carSpaces as string,
      priceFrom:        d.priceFrom as string,
      description:      d.description as string,
      highlights:       (d.highlights as string[]) ?? [],
      image:            (d.image as string) ?? '',
    }))
  } catch {
    // DB unavailable — render with defaults
  }

  return <BuyersPage content={content} projects={projects} variant="investors" />
}
