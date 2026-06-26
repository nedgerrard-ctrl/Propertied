export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Testimonial from '@/models/Testimonial'
import Project from '@/models/Project'

const SECRET = 'ppm-reset-2026-xK9mQ'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('secret') !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const testimonialResult = await Testimonial.deleteMany({})
  const projectResult = await Project.deleteMany({})

  return NextResponse.json({
    success: true,
    testimonials: { deleted: testimonialResult.deletedCount },
    projects: { deleted: projectResult.deletedCount },
  })
}
