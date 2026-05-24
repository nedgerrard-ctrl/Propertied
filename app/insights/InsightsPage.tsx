'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { InsightsContentData } from '@/lib/insights-defaults'

const FloatingDust = dynamic(() => import('../components/FloatingDust'), {
  ssr: false,
  loading: () => null,
})

const SECTIONS = [
  { headingKey: 'section1Heading', bodyKey: 'section1Body' },
  { headingKey: 'section2Heading', bodyKey: 'section2Body' },
  { headingKey: 'section3Heading', bodyKey: 'section3Body' },
] as const

export default function InsightsPage({ content }: { content: InsightsContentData }) {
  const c = content

  return (
    <main className="min-h-screen w-full text-[#1f1a17]">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden">
        <FloatingDust />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">
              Insights
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">
              Market Intelligence
            </p>
          </div>

          <div className="mt-8 border-t border-[#3a302a] pt-12 lg:pt-16">
            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-light leading-[1.06] text-white max-w-4xl">
              {c.heroHeadingMain}
              <br />
              <span className="text-[#c8a96e]">{c.heroHeadingAccent}</span>
            </h1>
          </div>

          <p className="mt-8 max-w-[52ch] text-[14px] leading-[1.9] text-[#8a7b6d]">
            {c.heroSubtext}
          </p>

          <div className="mt-20 flex items-center gap-4 text-[10px] uppercase tracking-[0.26em] text-[#4a3f37]">
            <span className="block h-px w-10 bg-[#3a302a]" />
            <span>Key Changes</span>
          </div>
        </div>
      </section>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-8">

          {/* Sections 1–3 */}
          <div className="divide-y divide-[#ede8e1]">
            {SECTIONS.map(({ headingKey, bodyKey }) => (
              <div key={headingKey} className="py-12 first:pt-0">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c8a96e] mb-4">
                  {c[headingKey]}
                </h2>
                <p className="text-[14px] leading-[1.85] text-[#3d3530]">
                  {c[bodyKey]}
                </p>
              </div>
            ))}

            {/* Section 4 */}
            <div className="py-12">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c8a96e] mb-4">
                {c.section4Heading}
              </h2>
              <div className="space-y-4">
                <p className="text-[14px] leading-[1.85] text-[#3d3530]">{c.section4Body1}</p>
                <p className="text-[14px] leading-[1.85] text-[#3d3530]">{c.section4Body2}</p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-10 border-t border-[#ede8e1] pt-8">
            <p className="text-[12px] leading-[1.85] italic text-[#8a7b6d]">
              {c.disclaimer}
            </p>
          </div>

          {/* Links */}
          <div className="mt-8 flex flex-wrap items-center gap-6">
            {c.link1Url && c.link1Url !== '#' ? (
              <Link
                href={c.link1Url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#4a3d35] transition hover:text-[#c8a96e]"
              >
                <span className="text-[#c8a96e]">→</span>
                {c.link1Label}
              </Link>
            ) : (
              <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#4a3d35]">
                <span className="text-[#c8a96e]">→</span>
                {c.link1Label}
              </span>
            )}
            {c.link2Url && c.link2Url !== '#' ? (
              <Link
                href={c.link2Url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#4a3d35] transition hover:text-[#c8a96e]"
              >
                <span className="text-[#c8a96e]">→</span>
                {c.link2Label}
              </Link>
            ) : (
              <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#4a3d35]">
                <span className="text-[#c8a96e]">→</span>
                {c.link2Label}
              </span>
            )}
          </div>

          {/* Footer credit */}
          <div className="mt-12 border-t border-[#ede8e1] pt-6 text-center">
            <p className="text-[11px] tracking-[0.18em] text-[#b0a090]">
              PPM · Property Project Marketing · www.onlineprojects.com.au
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}
