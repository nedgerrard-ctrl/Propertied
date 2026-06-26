import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'

export async function DELETE() {
  const session = await auth()
  if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
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
