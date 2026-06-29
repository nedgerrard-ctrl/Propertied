export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'For Owner-Occupiers — Find the Right Home',
  description: 'PPM helps owner-occupiers find the right new Melbourne home at the right price — and when you\'re ready to sell, we apply developer-grade marketing to maximise your result.',
}

import { connectDB } from '@/lib/mongodb'
import BuyerContentModel from '@/models/BuyerContent'
import { mergeBuyerContent } from '@/lib/buyer-defaults'
import { projects as SEED_PROJECTS } from '@/lib/projects-data'
import BuyersPage, { type DynamicProject } from '../BuyersPage'

export default async function OwnerOccupiersPage() {
  let content = mergeBuyerContent(null)
  // Always use canonical seed data — no MongoDB round-trip for projects
  const projects: DynamicProject[] = SEED_PROJECTS.map((p) => ({
    _id:              p.id,
    name:             p.name,
    suburb:           p.suburb,
    state:            p.state,
    type:             p.type,
    propertyInterest: p.propertyInterest,
    status:           p.status,
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

    const doc = await BuyerContentModel.findOne({ section: 'owner-occupiers' }).lean()
    content = mergeBuyerContent(doc as Record<string, unknown> | null)
  } catch {
    // DB unavailable — render with defaults
  }

  return <BuyersPage content={content} projects={projects} variant="owner-occupiers" />
}
