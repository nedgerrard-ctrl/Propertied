'use client'
import dynamic from 'next/dynamic'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { PrivacyPolicyContentData } from '@/lib/privacy-policy-defaults'

const FloatingDust = dynamic(() => import('../components/FloatingDust'), {
  ssr: false,
  loading: () => null,
})

export default function PrivacyPolicyPage({
  content,
}: {
  content: PrivacyPolicyContentData
}) {
  const c = content

  const sections = [
    { heading: c.section1Heading, body: c.section1Body },
    { heading: c.section2Heading, body: c.section2Body },
    { heading: c.section3Heading, body: c.section3Body },
    { heading: c.section4Heading, body: c.section4Body },
    { heading: c.section5Heading, body: c.section5Body },
    { heading: c.section6Heading, body: c.section6Body },
    { heading: c.section7Heading, body: c.section7Body },
  ].filter((s) => s.heading || s.body)

  return (
    <main className="min-h-screen w-full text-[#1f1a17]">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden">
        <FloatingDust />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">Legal</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">Privacy</p>
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
        </div>
      </section>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-8">
          <div className="divide-y divide-[#ede8e1]">
            {sections.map((section, i) => (
              <div key={i} className="py-10 first:pt-0">
                {section.heading && (
                  <h2 className="text-[15px] font-semibold text-[#1f1a17] mb-4">
                    {section.heading}
                  </h2>
                )}
                {section.body && (
                  <p className="text-[14px] leading-[1.9] text-[#3d3530] whitespace-pre-line">
                    {section.body}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-[#ede8e1] pt-6 text-center">
            <p className="text-[11px] tracking-[0.18em] text-[#b0a090]">
              © 2026 Property Project Marketing Pty Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
