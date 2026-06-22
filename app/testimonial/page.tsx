export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Client Testimonials',
  description: 'What PPM clients say — real testimonials from investors and owners who have bought, managed and sold Melbourne property with PPM since 2013.',
}

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
  image?: string
}

// Real PPM client testimonials.
// NOTE: These seed automatically only when the Testimonials collection is empty.
// After setting up the admin account, clear the collection via the admin dashboard
// so these replace the student placeholder quotes.
// Ashwin Lemaye's testimonial appears in the cinematic section (testimonial-defaults.ts).
// Confirm written consent from Ashwin is on file before go-live.
const SEED_TESTIMONIALS = [
  {
    quote:  "We live overseas. Joan has managed our property investment for many years. Recently, she also managed the sale of our property and achieved a significantly better outcome than we anticipated. Joan always acted in our best interests.",
    client: "Li Chin and Joo Hymn Tan — Sales & Management",
    rating: 5,
  },
  {
    quote:  "Joan has personally managed my property for many years after I bought it through her agency. I recently instructed her to sell it for me, which she did in six weeks, helping me realise a significant profit.",
    client: "Audrey Kuan — Sales",
    rating: 5,
  },
  {
    quote:  "After our property was accidentally flooded, Joan handled the situation with exceptional professionalism and persistence. She managed the claims process thoroughly and advocated strongly on our behalf, ultimately securing a payout far higher than expected. What could have been a very stressful experience was made much easier thanks to her dedication and commitment to achieving the best possible outcome.",
    client: "Hope Cao — Property Management",
    rating: 5,
  },
  {
    quote:  "I had the pleasure of having Joan manage and represent myself and my property for many years — for both sales and rental. The service has been exceptional: with excellent clear communication and follow up to requests. Joan is highly knowledgeable and has a thorough understanding of the rental and sales market. I felt very supported throughout. I would highly recommend Joan and PPM to anyone requiring property representation.",
    client: "Samantha Ashford — Sales & Management",
    rating: 5,
  },
  {
    quote:  "I would like to express my gratitude to Joan and the team for managing our property in Brunswick for over eight years and for making the selling process simple and trouble free. She has always been very professional and helpful with any questions, and responds to emails and messages in a timely manner — nothing was ever too much trouble. I highly recommend Joan for all your property needs.",
    client: "Ivana Bosco — Sales & Management",
    rating: 5,
  },
  {
    quote:  "I am happy it's sold. Thank you so much for your tenacity and professionalism.",
    client: "Danny Sernio — Sales",
    rating: 5,
  },
  {
    quote:  "We will always be grateful for having an agent like you. You have been so supportive and communicative — and that is all a renter can hope for. We were blessed to have you as our first rental agent in Australia.",
    client: "Diksha Sharma — Property Management",
    rating: 5,
  },
  {
    quote:  "Thank you for your continued support and excellent management.",
    client: "Jonas D. — Property Owner",
    rating: 5,
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
    image:  (d.image as string | undefined) || undefined,
  }))

  return <TestimonialPage content={content} testimonials={testimonials} />
}
