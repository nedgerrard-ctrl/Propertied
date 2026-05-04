export const dynamic = 'force-dynamic'

import { connectDB } from '@/lib/mongodb'
import BuyerContentModel from '@/models/BuyerContent'
import Project from '@/models/Project'
import { mergeBuyerContent } from '@/lib/buyer-defaults'
import { projects as SEED_PROJECTS } from '@/lib/projects-data'
import BuyersPage, { type DynamicProject } from './BuyersPage'

export default async function BuyerServerPage() {
  await connectDB()
  const { assertCmsPagePublished } = await import("@/lib/cms-published")
  await assertCmsPagePublished("buyer")

  const [doc, count] = await Promise.all([
    BuyerContentModel.findOne().lean(),
    Project.countDocuments(),
  ])

  if (count === 0) {
    await Project.insertMany(
      SEED_PROJECTS.map(({ id: _omit, ...rest }) => rest)
    )
  }

  const [dynamicDocs] = await Promise.all([
    Project.find({ published: true }).sort({ createdAt: -1 }).lean(),
  ])

  const content = mergeBuyerContent(doc as Record<string, unknown> | null)
  const projects: DynamicProject[] = dynamicDocs.map((d) => ({
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

  return <BuyersPage content={content} projects={projects} />
}
