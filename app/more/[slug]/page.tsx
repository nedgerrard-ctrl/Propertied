import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import FloatingDust from "@/app/components/FloatingDust";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Page from "@/models/Page";

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

  const paragraphs = [
    {
      title: page.paragraph1Title,
      text: page.paragraph1,
    },
    {
      title: page.paragraph2Title,
      text: page.paragraph2,
    },
    {
      title: page.paragraph3Title,
      text: page.paragraph3,
    },
    {
      title: page.paragraph4Title,
      text: page.paragraph4,
    },
  ].filter((item) => item.title || item.text);

  return (
    <main className="min-h-screen w-full text-[#1f1a17]">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[78vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden">
        <FloatingDust />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">
              Guide
            </p>

            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">
              PPM Resource
            </p>
          </div>

          <div className="mt-8 border-t border-[#3a302a] pt-12 lg:pt-16">
            <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-[4.5rem] font-light leading-[1.06] text-white">
              {page.title}
            </h1>
          </div>

          {page.subtitle && (
            <p className="mt-8 max-w-[52ch] text-[14px] leading-[1.9] text-[#8a7b6d]">
              {page.subtitle}
            </p>
          )}

          <div className="mt-20 flex items-center gap-4 text-[10px] uppercase tracking-[0.26em] text-[#4a3f37]">
            <span className="block h-px w-10 bg-[#3a302a]" />
            <span>Read Guide</span>
          </div>
        </div>
      </section>

      {/* TEXT CONTENT */}
      <section className="bg-[#f6f2eb] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid gap-12 lg:grid-cols-[4fr_8fr]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b6d]">
                Overview
              </p>
            </div>

            <div className="border-l-2 border-[#ddd3c6] pl-8 lg:pl-14">
              {paragraphs.map((item, index) => (
                <div
                  key={index}
                  className="grid gap-4 border-b border-[#e8e2da] py-10 last:border-b-0 lg:grid-cols-[4rem_12rem_1fr] lg:gap-x-10"
                >
                  <p className="text-[2.6rem] font-thin text-[#e0d8d0] tabular-nums leading-none select-none">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <h2 className="text-[15px] font-semibold leading-7 text-[#1f1a17]">
                    {item.title}
                  </h2>

                  <p className="max-w-[58ch] text-[13px] leading-[1.9] text-[#5b5147]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}