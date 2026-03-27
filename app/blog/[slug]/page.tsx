import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { blogPosts, getBlogPost } from "@/lib/blog-data";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | PPM`,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  return (
    <main className="min-h-screen w-full bg-[#f6f2eb] text-[#1f1a17]">
      <Navbar />

      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a7b6d] transition hover:text-[#1f1a17]"
        >
          <span>←</span> All Articles
        </Link>

        {/* Hero image */}
        <div className="mt-8 overflow-hidden rounded-sm border border-[#ddd3c6]">
          <img
            src={post.image}
            alt={post.title}
            className="h-[360px] w-full object-cover"
          />
        </div>

        {/* Article header */}
        <header className="mt-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#8a7b6d]">
            {post.category} &nbsp;·&nbsp; {post.date}
          </p>
          <h1 className="mt-3 text-3xl font-light leading-snug text-[#1f1a17] md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-[14px] leading-7 text-[#5b5147]">
            {post.description}
          </p>
          <div className="mt-6 border-t border-[#ddd3c6]" />
        </header>

        {/* Article body */}
        <article className="mt-8 space-y-7">
          {post.content.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <h2 className="mb-3 text-[17px] font-semibold text-[#1f1a17]">
                  {section.heading}
                </h2>
              )}
              <p className="text-[14px] leading-7 text-[#3d3530]">
                {section.body}
              </p>
            </div>
          ))}
        </article>

        {/* CTA */}
        <div className="mt-14 rounded-sm border border-[#ddd3c6] bg-[#fbf8f3] px-8 py-10 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
            Speak to the Team
          </p>
          <h2 className="mt-3 text-xl font-light text-[#1f1a17]">
            Ready to take the next step?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[13px] leading-6 text-[#5b5147]">
            Whether you have a question about a specific development or want to
            understand your options, we are happy to help.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-block border border-[#2f2a24] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2f2a24] transition hover:bg-[#2f2a24] hover:text-white"
            >
              Get in Touch
            </Link>
            <Link
              href="/blog"
              className="inline-block border border-[#c4b8ab] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#5b5147] transition hover:border-[#2f2a24] hover:text-[#1f1a17]"
            >
              More Articles
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
