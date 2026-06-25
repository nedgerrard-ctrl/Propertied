export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'About PPM',
  description: 'PPM\'s track record was built inside Melbourne\'s development industry — not as intermediaries, but as embedded management consultants driving major projects to success since 2013.',
}

import Link from 'next/link'
import Navbar from '../components/Navbar'
import ThreadsBackground from './ThreadsBackground'
import { connectDB } from '@/lib/mongodb'
import AboutContent from '@/models/AboutContent'
import { mergeAboutContent } from '@/lib/about-defaults'

export default async function AboutPage() {
  let c = mergeAboutContent(null)
  try {
    await connectDB()
    const { assertCmsPagePublished } = await import("@/lib/cms-published")
    await assertCmsPagePublished("about")
    const doc = await AboutContent.findOne().lean()
    c = mergeAboutContent(doc as Record<string, unknown> | null)
  } catch {
    // DB unavailable — render with defaults
  }

  const eras = [
    { year: c.era1Year, heading: c.era1Heading, paragraphs: [c.era1Body] },
    { year: c.era2Year, heading: c.era2Heading, paragraphs: [c.era2Body] },
    { year: c.era3Year, heading: c.era3Heading, paragraphs: [c.era3Body1, c.era3Body2] },
  ]

  return (
    <main className="min-h-screen w-full text-[#1f1a17]">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ThreadsBackground />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">
              Who We Are
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">
              Est. 2013
            </p>
          </div>

          <div className="mt-8 border-t border-[#3a302a] pt-12 lg:pt-16">
            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-light leading-[1.06] text-white max-w-4xl">
              {c.heroHeadingMain}{' '}
              <span className="text-[#c8a96e]">{c.heroHeadingAccent}</span>
            </h1>
          </div>

          <div className="mt-16 flex items-center gap-4 text-[10px] uppercase tracking-[0.26em] text-[#4a3f37]">
            <span className="block h-px w-10 bg-[#3a302a]" />
            <span>Our Story</span>
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-2xl px-8">
          {c.introText && (
            <p className="text-[14px] leading-[1.85] text-[#3d3530] mb-14">
              {c.introText}
            </p>
          )}
          {eras.map((era) => (
            <div key={era.year} className="mb-14 last:mb-0">
              <p className="text-2xl font-semibold text-[#c8a96e] mb-3">
                {era.year}
              </p>
              <h2 className="text-[1.35rem] font-bold text-[#1f1a17] leading-snug mb-3">
                {era.heading}
              </h2>
              <div className="space-y-3">
                {era.paragraphs.filter(Boolean).map((p, i) => (
                  <p key={i} className="text-[14px] leading-[1.85] text-[#3d3530]">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {/* Links */}
          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3">
            <Link
              href="/our-people"
              className="text-[13px] text-[#1f1a17] hover:text-[#c8a96e] transition-colors"
            >
              → Meet our people
            </Link>
            <Link
              href="/buyers"
              className="text-[13px] text-[#1f1a17] hover:text-[#c8a96e] transition-colors"
            >
              → How we work for buyers
            </Link>
          </div>
        </div>
      </section>

      {/* ── Owner-Occupier Steps ─────────────────────────────────────────── */}
      <section className="bg-[#f6f2eb] py-20 lg:py-28">
        <div className="mx-auto max-w-2xl px-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c8a96e] mb-6">
            {c.aboutOwnerStepsLabel}
          </p>
          <ol className="space-y-5 mb-10">
            {[c.aboutOwnerStep1, c.aboutOwnerStep2, c.aboutOwnerStep3].map((item, i) => {
              const sep = item.indexOf(' — ')
              const bold = sep !== -1 ? item.slice(0, sep) : item
              const rest = sep !== -1 ? item.slice(sep) : ''
              return (
                <li key={i} className="flex gap-4 text-[14px] leading-[1.85] text-[#1f1a17]">
                  <span className="shrink-0 font-semibold text-[#c8a96e]">{i + 1}.</span>
                  <span><strong>{bold}</strong>{rest}</span>
                </li>
              )
            })}
          </ol>
          <Link
            href="/buyers/owner-occupiers"
            className="text-[13px] text-[#c8a96e] border-b border-[#c8a96e]/40 pb-0.5 transition hover:border-[#c8a96e]"
          >
            We also sell established property
          </Link>
        </div>
      </section>

      {/* ── Established Property ──────────────────────────────────────────── */}
      <section className="bg-[#2f2a24] py-20 lg:py-28">
        <div className="mx-auto max-w-2xl px-8">
          <p className="text-[14px] leading-[1.95] text-[#9e8d7a] mb-10">
            {c.establishedBody}
          </p>
          <div className="flex flex-wrap gap-8 text-[11px] uppercase tracking-[0.2em]">
            <Link
              href="/contact"
              className="text-[#c8a96e] border-b border-[#c8a96e]/40 pb-0.5 transition hover:border-[#c8a96e]"
            >
              → Request a strategic asset review
            </Link>
            <Link
              href="/off-the-plan-explainer"
              className="text-[#c8a96e] border-b border-[#c8a96e]/40 pb-0.5 transition hover:border-[#c8a96e]"
            >
              → What is off-the-plan?
            </Link>
          </div>
        </div>
      </section>

      {/* ── Start with your brief ─────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-2xl px-8">
          <h2 className="text-[1.35rem] font-bold text-[#c8a96e] leading-snug mb-5">
            {c.briefHeading}
          </h2>
          <p className="text-[14px] leading-[1.95] text-[#3d3530]">
            {c.briefBody}
          </p>
        </div>
      </section>

      {/* ── Minimal footer line ───────────────────────────────────────────── */}
      <div className="border-t border-[#ede8e1] py-5">
        <p className="text-center text-[11px] text-[#8a7b6d]">
          PPM · Property Project Marketing · www.onlineprojects.com.au
        </p>
      </div>
    </main>
  )
}
