export const dynamic = 'force-dynamic'

import { connectDB } from '@/lib/mongodb'
import BlogPageContent from '@/models/BlogPageContent'
import { mergeBlogPageContent } from '@/lib/blog-page-defaults'
import BlogPage from './BlogPage'

export default async function BlogServerPage() {
  let content = mergeBlogPageContent(null)
  try {
      await connectDB()

      const { assertCmsPagePublished } = await import('@/lib/cms-published')
      await assertCmsPagePublished('blog')

      const doc = await BlogPageContent.findOne().lean()
      content = mergeBlogPageContent(doc as Record<string, unknown> | null)
  } catch {
    // DB unavailable — render with defaults
  }

  return <BlogPage content={content} />
}
