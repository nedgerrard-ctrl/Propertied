export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Our People',
  description: 'Meet the PPM team — experienced professionals working daily at the Melbourne property market coalface across sales, investment strategy, client operations and asset management.',
}

import { connectDB } from '@/lib/mongodb'
import OurPeopleContent from '@/models/OurPeopleContent'
import { mergeOurPeopleContent } from '@/lib/our-people-defaults'
import OurPeoplePage from './OurPeoplePage'

export default async function OurPeopleServerPage() {
  await connectDB()

  const { assertCmsPagePublished } = await import('@/lib/cms-published')
  await assertCmsPagePublished('our-people')

  const doc = await OurPeopleContent.findOne().lean()
  const content = mergeOurPeopleContent(doc as Record<string, unknown> | null)

  return <OurPeoplePage content={content} />
}
