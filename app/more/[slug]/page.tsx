import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import FloatingDust from "@/app/components/FloatingDust";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Page from "@/models/Page";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function GuidePage({ params }: Props) {
  await connectDB();

  const { slug } = await params;

  const page = await Page.findOne({
    slug,
    status: "published",
  }).lean();

  if (!page) notFound();

  const bodyParagraphs = page.body
    ? page.body
        .split(/\n\n+/)
        .map((p: string) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <main className="min-h-screen w-full text-[#1f1a17]">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[78vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden">
        <FloatingDust />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">
              {page.heroEyebrow || "Guide"}
            </p>

            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">
              PPM Resource
            </p>
          </div>

          <div className="mt-8 border-t border-[#3a302a] pt-12 lg:pt-16">
            <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-[4.5rem] font-light leading-[1.06] text-white">
              {page.heroTitle || page.title}
            </h1>
          </div>

          {page.heroSummary && (
            <p className="mt-8 max-w-[52ch] text-[14px] leading-[1.9] text-[#8a7b6d]">
              {page.heroSummary}
            </p>
          )}

          <div className="mt-20 flex items-center gap-4 text-[10px] uppercase tracking-[0.26em] text-[#4a3f37]">
            <span className="block h-px w-10 bg-[#3a302a]" />
            <span>Read Guide</span>
          </div>
        </div>
      </section>

      {/* BODY */}
      {bodyParagraphs.length > 0 && (
        <section className="bg-[#f6f2eb] py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-8">
            <div className="grid gap-12 lg:grid-cols-[4fr_8fr]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b6d]">
                  Overview
                </p>
              </div>

              <div className="border-l-2 border-[#ddd3c6] pl-8 lg:pl-14 space-y-8">
                {bodyParagraphs.map((paragraph: string, index: number) => (
                  <p
                    key={index}
                    className="max-w-[58ch] text-[13px] leading-[1.9] text-[#5b5147]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {(page.ctaTitle || page.ctaText) && (
        <section className="bg-[#1c1814] py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-8">
            {page.ctaTitle && (
              <h2 className="text-[2rem] font-light text-white">
                {page.ctaTitle}
              </h2>
            )}
            {page.ctaText && (
              <p className="mt-4 max-w-[52ch] text-[14px] leading-[1.9] text-[#8a7b6d]">
                {page.ctaText}
              </p>
            )}
            {page.ctaLink && (
              <Link
                href={page.ctaLink}
                className="mt-8 inline-block border border-[#8a7b6d] px-8 py-3 text-[12px] uppercase tracking-[0.22em] text-[#c7bbb0] transition hover:border-white hover:text-white"
              >
                Get in touch
              </Link>
            )}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
