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
    archived: { $ne: true },
  }).lean() as any;

  if (!page) notFound();

  const templateKey: string = page.templateKey || "text-only";

  const bodyParagraphs =
    templateKey === "text-only" && !page.sections?.length && page.body
      ? page.body
          .split(/\n\n+/)
          .map((p: string) => p.trim())
          .filter(Boolean)
      : [];

  const sections: Array<{ heading: string; body: string; image: string }> =
    Array.isArray(page.sections)
      ? page.sections.filter((s: any) => s.body?.trim())
      : [];

  return (
    <main className="min-h-screen w-full text-[#1f1a17]">
      <Navbar />

      {/* HERO — shared by both templates */}
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

      {/* BODY — text-only template (sections) */}
      {templateKey === "text-only" && sections.length > 0 && sections.map((section, i) => (
        <section
          key={i}
          className={`py-20 lg:py-28 ${i % 2 === 0 ? "bg-[#f6f2eb]" : "bg-white"}`}
        >
          <div className="mx-auto max-w-7xl px-8">
            <div className="grid gap-12 lg:grid-cols-[4fr_8fr]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9e8d7a]">
                  {String(i + 1).padStart(2, "0")}
                </p>
              </div>
              <div>
                {section.heading && (
                  <h2 className="mb-5 text-[26px] font-light leading-[1.35] text-[#1f1a17] sm:text-[30px]">
                    {section.heading}
                  </h2>
                )}
                <div className="border-l-2 border-[#ddd3c6] pl-8 lg:pl-14 space-y-6">
                  {section.body.split(/\n\n+/).map((p: string, j: number) => (
                    <p key={j} className="max-w-[58ch] text-[13px] leading-[1.9] text-[#5b5147]">
                      {p.trim()}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* BODY — text-only template (legacy single body field) */}
      {templateKey === "text-only" && sections.length === 0 && bodyParagraphs.length > 0 && (
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
                  <p key={index} className="max-w-[58ch] text-[13px] leading-[1.9] text-[#5b5147]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* BODY — text+image template */}
      {templateKey === "text-image" && sections.length > 0 && (
        <div>
          {sections.map(
            (
              section: { heading: string; body: string; image: string },
              i: number
            ) => {
              const isEven = i % 2 === 0;
              return (
                <section
                  key={i}
                  className={`py-20 lg:py-28 ${
                    isEven ? "bg-white" : "bg-[#f6f2eb]"
                  }`}
                >
                  <div className="mx-auto max-w-7xl px-8">
                    <div
                      className={`grid gap-12 lg:grid-cols-2 lg:items-center ${
                        !isEven ? "lg:grid-flow-dense" : ""
                      }`}
                    >
                      {/* Text column */}
                      <div className={!isEven ? "lg:col-start-2" : ""}>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9e8d7a]">
                          {String(i + 1).padStart(2, "0")}
                        </p>

                        {section.heading && (
                          <h2 className="mt-4 text-[26px] font-light leading-[1.35] text-[#1f1a17] sm:text-[30px]">
                            {section.heading}
                          </h2>
                        )}

                        <div
                          className={`${section.heading ? "mt-5" : "mt-4"} border-l-2 border-[#ddd3c6] pl-6`}
                        >
                          <p className="max-w-[46ch] text-[13px] leading-[1.9] text-[#5b5147]">
                            {section.body}
                          </p>
                        </div>
                      </div>

                      {/* Image column */}
                      {section.image ? (
                        <div
                          className={`overflow-hidden ${
                            !isEven ? "lg:col-start-1 lg:row-start-1" : ""
                          }`}
                        >
                          <img
                            src={section.image}
                            alt={section.heading || ""}
                            className="h-72 w-full object-cover lg:h-[420px]"
                          />
                        </div>
                      ) : (
                        <div
                          className={`flex h-72 items-center justify-center bg-[#e8e2da] lg:h-[420px] ${
                            !isEven ? "lg:col-start-1 lg:row-start-1" : ""
                          }`}
                        >
                          <p className="text-[10px] uppercase tracking-[0.2em] text-[#b8a898]">
                            No image
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              );
            }
          )}
        </div>
      )}

      {/* CTA — shared by both templates */}
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
