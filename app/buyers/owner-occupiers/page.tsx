export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'For Owner-Occupiers — Find the Right Home',
  description: 'PPM helps owner-occupiers find the right new Melbourne home at the right price — and when you\'re ready to sell, we apply developer-grade marketing to maximise your result.',
}

import { connectDB } from '@/lib/mongodb'
import BuyerContentModel from '@/models/BuyerContent'
import Project from '@/models/Project'
import { mergeBuyerContent } from '@/lib/buyer-defaults'
import { projects as SEED_PROJECTS } from '@/lib/projects-data'
import BuyersPage, { type DynamicProject } from '../BuyersPage'

export default async function OwnerOccupiersPage() {
  let content = mergeBuyerContent(null)
  let projects: DynamicProject[] = []

  try {
    await connectDB()
    const { assertCmsPagePublished } = await import('@/lib/cms-published')
    await assertCmsPagePublished('buyer')

    const [doc, count] = await Promise.all([
      BuyerContentModel.findOne({ section: 'owner-occupiers' }).lean(),
      Project.countDocuments(),
    ])

    // Re-seed if empty OR if real seed projects are not present (clears mock/student data)
    const hasRealData = count > 0 && await Project.findOne({ name: SEED_PROJECTS[0].name })
    if (!hasRealData) {
      await Project.deleteMany({})
      await Project.insertMany(SEED_PROJECTS.map(({ id: _omit, ...rest }) => rest))
    }

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

  return <BuyersPage content={content} projects={projects} variant="owner-occupiers" />
}
