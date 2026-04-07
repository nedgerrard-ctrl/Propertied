import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { blogPosts, getBlogPost } from '@/lib/blog-data'

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  return {
    title: `${post.title} | PPM`,
    description: post.description,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const postIndex = blogPosts.findIndex((p) => p.slug === slug) + 1

  return (
    <main className="min-h-screen w-full bg-white text-[#1f1a17]">
      <Navbar />

      {/* ── Editorial header ──────────────────────────────────────────────── */}
      <header className="bg-[#0a0806]">
        <div className="mx-auto max-w-7xl px-8 pt-28 pb-16">

          {/* Back link — top of the header so it's the first thing seen */}
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-[#4a3f37] transition hover:text-[#8a7b6d] mb-10"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
            <span>All Articles</span>
          </Link>

          {/* Metadata row */}
          <div className="flex items-baseline justify-between border-b border-[#2d2218] pb-6">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">
              {post.category}
            </p>
            <div className="flex items-center gap-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">{post.date}</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">
                No.&nbsp;{String(postIndex).padStart(2, '0')}
              </p>
            </div>
          </div>

          {/* Title */}
          <h1 className="mt-10 text-4xl md:text-5xl lg:text-[3.8rem] font-light leading-[1.1] text-white max-w-4xl">
            {post.title}
          </h1>

          {/* Deck / description */}
          <p className="mt-7 max-w-[54ch] text-[14px] leading-[1.9] text-[#8a7b6d]">
            {post.description}
          </p>

          {/* Amber rule */}
          <div className="mt-10 h-px w-full bg-gradient-to-r from-[#c8a96e] via-[#c8a96e]/30 to-transparent" />
        </div>
      </header>

      {/* ── Featured image ────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-8 mt-10">
        <div className="overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="h-[300px] md:h-[420px] w-full object-cover"
          />
        </div>
      </div>

      {/* ── Article body ──────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-2xl px-8 py-14">
        <article>
          {post.content.map((section, i) => (
            <div key={i} className="mb-9">
              {section.heading && (
                <h2 className="text-[17px] font-semibold text-[#1f1a17] mb-3 tracking-[-0.01em]">
                  {section.heading}
                </h2>
              )}
              <p className={`leading-[1.95] text-[#3d3530] ${
                i === 0 && !section.heading
                  ? 'text-[16px] text-[#2a2420]'  // lead paragraph — slightly larger + darker
                  : 'text-[14.5px]'
              }`}>
                {section.body}
              </p>
            </div>
          ))}
        </article>

        {/* Amber divider */}
        <div className="mt-6 h-px bg-gradient-to-r from-[#c8a96e]/50 via-[#e8e2d9] to-transparent" />
      </div>

      {/* ── End CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-[#0a0806] py-24">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid md:grid-cols-[3fr_2fr] gap-10 md:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">
                Speak to the Team
              </p>
              <h2 className="mt-4 text-3xl md:text-4xl font-light text-white leading-snug">
                Ready to take the next step?
              </h2>
              <p className="mt-5 max-w-[44ch] text-[13px] leading-[1.9] text-[#8a7b6d]">
                Whether you have a question about a specific development or want to understand
                your options, we are happy to help.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-4 md:items-start">
              <Link
                href="/contact"
                className="inline-flex items-center border border-[#c8a96e] px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c8a96e] transition hover:bg-[#c8a96e] hover:text-[#0a0806]"
              >
                Get in Touch
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center border border-[#2d2218] px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a7b6d] transition hover:border-[#8a7b6d] hover:text-white"
              >
                More Articles
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
