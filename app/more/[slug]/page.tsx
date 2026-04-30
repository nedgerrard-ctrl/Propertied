import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Page from "@/models/Page";

type Props = {
  params: Promise<{ slug: string }>;
};

function formatParagraphs(body: string) {
  return body
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default async function GuidePage({ params }: Props) {
  await connectDB();
  const { slug } = await params;

  const page = await Page.findOne({
    slug,
    status: "published",
    pageGroup: "guides",
  }).lean();

  if (!page) notFound();

  const paragraphs = formatParagraphs(String(page.body || ""));

  return (
    <main className="min-h-screen bg-[#efefef] text-[#1f1a17]">
      <Navbar />

      <section className="bg-[#0f0d0b]">
        <div className="mx-auto max-w-6xl px-6 pb-18 pt-32 md:px-8">
          {page.heroEyebrow ? (
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8b7e70]">
              {page.heroEyebrow}
            </p>
          ) : null}

          <h1 className="mt-4 max-w-4xl text-[40px] font-light leading-[1.08] tracking-[-0.03em] text-white md:text-[58px]">
            {page.heroTitle || page.title}
          </h1>

          {page.heroSummary ? (
            <p className="mt-8 max-w-3xl text-[15px] leading-8 text-[#c7bbb0]">
              {page.heroSummary}
            </p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 md:px-8 md:py-20">
        <div className="rounded-[24px] border border-[#ddd3c7] bg-white px-6 py-8 md:px-10 md:py-12">
          <div className="space-y-6">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-[15px] leading-8 text-[#3f3832]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {(page.ctaTitle || page.ctaText || page.ctaLink) && (
        <section className="mx-auto max-w-6xl px-6 pb-20 md:px-8">
          <div className="rounded-[24px] border border-[#5f5245] bg-[#2f2a24] px-6 py-10 md:px-10 md:py-12">
            {page.ctaTitle ? (
              <h2 className="text-[30px] font-light tracking-[-0.02em] text-white">
                {page.ctaTitle}
              </h2>
            ) : null}

            {page.ctaText ? (
              <p className="mt-5 max-w-2xl text-[14px] leading-8 text-[#d7cfc5]">
                {page.ctaText}
              </p>
            ) : null}

            {page.ctaLink ? (
              <a
                href={page.ctaLink}
                className="mt-8 inline-flex border border-[#cfc2b2] bg-[#f6f2eb] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#5b5147] transition hover:border-white hover:text-[#1f1a17]"
              >
                Learn More
              </a>
            ) : null}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}