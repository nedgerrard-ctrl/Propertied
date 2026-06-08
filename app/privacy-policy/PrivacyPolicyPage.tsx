'use client'
import dynamic from 'next/dynamic'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { PrivacyPolicyContentData } from '@/lib/privacy-policy-defaults'
import { privacySections, PrivacySection, resolveText } from '@/lib/privacy-policy-sections'

const FloatingDust = dynamic(() => import('../components/FloatingDust'), {
  ssr: false,
  loading: () => null,
})

function SectionBlock({
  section,
  overrides,
}: {
  section: PrivacySection
  overrides: Record<string, string>
}) {
  const n = section.number
  const t = (key: string, def: string) => resolveText(key, overrides, def)

  return (
    <div className="py-8 border-t border-[#ede8e1] first:border-t-0 first:pt-0">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#c8a96e] mb-4">
        {n}. {section.heading}
      </h2>
      <div className="space-y-4">
        {section.blocks.map((block, bi) => {
          if (block.kind === 'paragraph') {
            return (
              <p key={bi} className="text-[14px] leading-[1.9] text-[#3d3530]">
                {t(`s${n}k${bi}`, block.text)}
              </p>
            )
          }
          if (block.kind === 'subheading') {
            return (
              <p key={bi} className="text-[13px] font-semibold text-[#1f1a17] pt-2">
                {t(`s${n}k${bi}`, block.text)}
              </p>
            )
          }
          if (block.kind === 'bullets') {
            return (
              <div key={bi} className="space-y-2">
                {block.intro && (
                  <p className="text-[14px] leading-[1.9] text-[#3d3530]">
                    {t(`s${n}k${bi}i`, block.intro)}
                  </p>
                )}
                <ul className="space-y-2 pl-4">
                  {block.bullets.map((b, bui) => (
                    <li key={bui} className="flex gap-3 text-[14px] leading-[1.9] text-[#3d3530]">
                      <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8a96e]" />
                      {t(`s${n}k${bi}b${bui}`, b)}
                    </li>
                  ))}
                </ul>
              </div>
            )
          }
          return null
        })}
        {section.details && (
          <div className="border-l-2 border-[#c8a96e] pl-5 space-y-1">
            {section.details.map((d, i) => (
              <p key={i} className="text-[13px] leading-[1.8] text-[#1f1a17]">
                {t(`s${n}d${i}`, d)}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PrivacyPolicyPage({
  content,
}: {
  content: PrivacyPolicyContentData
}) {
  const c = content
  const overrides = c.sectionOverrides ?? {}

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

      {/* ── Document header ─────────────────────────────────────────────── */}
      <section className="bg-[#f6f2eb] border-b border-[#e3d8ca] py-10">
        <div className="mx-auto max-w-3xl px-8">
          <p className="text-[13px] font-semibold text-[#1f1a17]">PPM Privacy Policy</p>
          <p className="mt-1 text-[12px] text-[#8a7b6d]">
            Effective date: 1 July 2026  ·  Last reviewed: May 2026
          </p>
          <p className="mt-0.5 text-[12px] text-[#8a7b6d]">
            Publication: www.ppmproperty.com.au/privacy-policy
          </p>
          <p className="mt-3 text-[13px] leading-[1.8] text-[#3d3530]">
            This privacy policy is published by Property Project Marketing Pty Ltd (ABN 99 162 429 558), trading as Online Property Services, the licensed estate agent operating under the brand &ldquo;PPM&rdquo; (Estate Agents Licence No. 074846L).
          </p>
        </div>
      </section>

      {/* ── Sections ────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-8">
          <div>
            {privacySections.map((section) => (
              <SectionBlock key={section.number} section={section} overrides={overrides} />
            ))}
          </div>
          <div className="mt-12 border-t border-[#ede8e1] pt-8">
            <p className="text-[12px] text-[#8a7b6d]">
              © 2026 Property Project Marketing Pty Ltd. All rights reserved.
            </p>
          </div>
          <div className="mt-8 border-t border-[#ede8e1] pt-6 text-center">
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
