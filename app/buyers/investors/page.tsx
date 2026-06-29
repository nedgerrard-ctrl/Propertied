export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'For Investors — End-to-End Property Investment',
  description: "PPM's five-step model for property investors: we source, you buy, we manage, we sell and we reinvest — a complete wealth-building journey for Melbourne off-the-plan property.",
}

import { connectDB } from '@/lib/mongodb'
import BuyerContentModel from '@/models/BuyerContent'
import { mergeBuyerContent } from '@/lib/buyer-defaults'
import { projects as SEED_PROJECTS } from '@/lib/projects-data'
import BuyersPage, { type DynamicProject } from '../BuyersPage'

export default async function InvestorsPage() {
  let content = mergeBuyerContent(null)

  // Always use canonical seed data — independent of MongoDB
  const projects: DynamicProject[] = SEED_PROJECTS.map((p) => ({
    _id:              p.id,
    name:             p.name,
    suburb:           p.suburb,
    state:            p.state,
    type:             p.type as DynamicProject['type'],
    propertyInterest: p.propertyInterest as DynamicProject['propertyInterest'],
    status:           p.status as DynamicProject['status'],
    bedrooms:         p.bedrooms,
    bathrooms:        p.bathrooms,
    carSpaces:        p.carSpaces,
    priceFrom:        p.priceFrom,
    description:      p.description,
    highlights:       p.highlights ?? [],
    image:            p.image ?? '',
  }))

  try {
    await connectDB()
    const { assertCmsPagePublished } = await import('@/lib/cms-published')
    await assertCmsPagePublished('buyer')
    const doc = await BuyerContentModel.findOne({ section: 'investors' }).lean()
    content = mergeBuyerContent(doc as Record<string, unknown> | null)
  } catch {
    // DB unavailable — render with defaults
  }

  return <BuyersPage content={content} projects={projects} variant="investors" />
}
