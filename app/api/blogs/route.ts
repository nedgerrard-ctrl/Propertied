export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'

export async function GET() {
  try {
    await connectDB()
    const posts = await BlogPost.find({ status: 'published' })
      .sort({ publishDate: -1 })
      .select('slug title description image publishDate category')
      .lean()
    return NextResponse.json(posts)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
