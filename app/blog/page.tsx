import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { blogPosts } from "@/lib/blog-data";

export const metadata = {
  title: "Blog & Insights | PPM",
  description:
    "Property investment insights, buyer guides, and market commentary from Property Project Marketing.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen w-full bg-[#f6f2eb] text-[#1f1a17]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Page header */}
        <section className="border border-[#e3d8ca] bg-[#fbf8f3] px-6 py-14 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#8a7b6d]">
            PPM Insights
          </p>
          <h1 className="mt-3 text-3xl font-light text-[#1f1a17] md:text-5xl">
            Blog &amp; Articles
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[13px] leading-6 text-[#5b5147]">
            Property investment insights, buyer guides, and market commentary
            from the PPM team.
          </p>
        </section>

        {/* Blog grid */}
        <section className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col overflow-hidden rounded-sm border border-[#dfd4c7] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
            >
              {/* Image */}
              <div className="overflow-hidden bg-[#e3dbd0]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-[200px] w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col px-6 pb-7 pt-6">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8a7b6d]">
                  {post.category} &nbsp;·&nbsp; {post.date}
                </p>

                <h2 className="mt-3 text-[18px] font-semibold leading-snug text-[#1f1a17] transition group-hover:text-[#5f5245]">
                  {post.title}
                </h2>

                <p className="mt-3 flex-1 text-[13px] leading-6 text-[#6c6258]">
                  {post.description}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-6 inline-block self-start border border-[#2f2a24] px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2f2a24] transition hover:bg-[#2f2a24] hover:text-white"
                >
                  Learn More
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>

      <Footer />
    </main>
  );
}
