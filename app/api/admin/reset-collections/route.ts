import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'

const SECRET = 'ppm-reset-2026-xK9mQ'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('secret') !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const mongoose = (await import('mongoose')).default

  const testimonialResult = await mongoose.connection.collection('testimonials').deleteMany({})
  const projectResult = await mongoose.connection.collection('projects').deleteMany({})

  return NextResponse.json({
    success: true,
    testimonials: { deleted: testimonialResult.deletedCount },
    projects: { deleted: projectResult.deletedCount },
  })
}
