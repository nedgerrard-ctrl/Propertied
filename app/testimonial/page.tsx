export const dynamic = 'force-dynamic'

import { connectDB } from '@/lib/mongodb'
import TestimonialContent from '@/models/TestimonialContent'
import Testimonial from '@/models/Testimonial'
import { mergeTestimonialContent } from '@/lib/testimonial-defaults'
import TestimonialPage from './TestimonialPage'

export type DynamicTestimonial = {
  _id: string
  quote: string
  client: string
  rating: number
}

const SEED_TESTIMONIALS = [
  {
    quote:  "The team understood my goals clearly and matched me with options that suited my budget and long-term investment strategy.",
    client: "Michael T. — Property Investor",
    rating: 4,
  },
  {
    quote:  "I appreciated how clearly everything was explained. The process felt premium but still very practical and straightforward.",
    client: "Emma R. — Buyer",
    rating: 5,
  },
  {
    quote:  "Professional presentation, timely follow-up, and a strong understanding of what investors actually need.",
    client: "Olivia C. — Local Investor",
    rating: 4,
  },
  {
    quote:  "Professional presentation, timely follow-up, and a strong understanding of what investors actually need.",
    client: "Bryan C. — Local Investor",
    rating: 4,
  },
  {
    quote:  "Professional presentation, timely follow-up, and a strong understanding of what investors actually need.",
    client: "Wallace C. — Local Investor",
    rating: 4,
  },
]

export default async function TestimonialServerPage() {
  await connectDB()
  const { assertCmsPagePublished } = await import("@/lib/cms-published")
  await assertCmsPagePublished("testimonial")

  const [doc, count] = await Promise.all([
    TestimonialContent.findOne().lean(),
    Testimonial.countDocuments(),
  ])

  if (count === 0) {
    await Testimonial.insertMany(SEED_TESTIMONIALS)
  }

  const [dynamicDocs] = await Promise.all([
    Testimonial.find().sort({ createdAt: -1 }).lean(),
  ])

  const content = mergeTestimonialContent(doc as Record<string, unknown> | null)
  const testimonials: DynamicTestimonial[] = dynamicDocs.map((d) => ({
    _id:    (d._id as { toString(): string }).toString(),
    quote:  d.quote  as string,
    client: d.client as string,
    rating: d.rating as number,
  }))

  return <TestimonialPage content={content} testimonials={testimonials} />
}
