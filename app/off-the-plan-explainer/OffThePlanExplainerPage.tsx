'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { OffThePlanExplainerContentData } from '@/lib/off-the-plan-explainer-defaults'

const FloatingDust = dynamic(() => import('../components/FloatingDust'), {
  ssr: false,
  loading: () => null,
})

function LinkItem({ label, url }: { label: string; url: string }) {
  const isInternal = url.startsWith('/')
  if (!url || url === '#') {
    return (
      <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#4a3d35]">
        <span className="text-[#c8a96e]">→</span>
        {label}
      </span>
    )
  }
  return (
    <Link
      href={url}
      target={isInternal ? undefined : '_blank'}
      rel={isInternal ? undefined : 'noopener noreferrer'}
      className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#4a3d35] transition hover:text-[#c8a96e]"
    >
      <span className="text-[#c8a96e]">→</span>
      {label}
    </Link>
  )
}

export default function OffThePlanExplainerPage({
  content,
}: {
  content: OffThePlanExplainerContentData
}) {
  const c = content

  const advantages = [
    { num: '1', heading: c.adv1Heading, body: c.adv1Body },
    { num: '2', heading: c.adv2Heading, body: c.adv2Body },
    { num: '3', heading: c.adv3Heading, body: c.adv3Body },
    { num: '4', heading: c.adv4Heading, body: c.adv4Body },
    { num: '5', heading: c.adv5Heading, body: c.adv5Body },
  ]

  const practicalEffects = [
    c.practicalEffect1,
    c.practicalEffect2,
    c.practicalEffect3,
    c.practicalEffect4,
    c.practicalEffect5,
  ].filter(Boolean)

  return (
    <main className="min-h-screen w-full text-[#1f1a17]">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden">
        <FloatingDust />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">
              Off-the-Plan
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">
              Buyer Guide
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
            <span>Six Advantages</span>
          </div>
        </div>
      </section>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-8">

          {/* Intro paragraphs */}
          <div className="space-y-5 text-[14px] leading-[1.9] text-[#3d3530] mb-14 pb-14 border-b border-[#ede8e1]">
            <p>{c.introPara1}</p>
            <p>{c.introPara2}</p>
            <p>{c.introPara3}</p>
          </div>

          {/* Advantages heading */}
          <h2 className="text-[1.75rem] font-light text-[#1f1a17] leading-snug mb-10">
            {c.advantagesHeading}
          </h2>

          {/* Advantages 1–5 */}
          <div className="divide-y divide-[#ede8e1]">
            {advantages.map((adv) => (
              <div key={adv.num} className="py-8 first:pt-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#c8a96e] mb-2">
                  {adv.num}.&nbsp;{adv.heading}
                </p>
                <p className="text-[14px] leading-[1.85] text-[#3d3530]">{adv.body}</p>
              </div>
            ))}

            {/* Advantage 6 — Tax (multi-part) */}
            <div className="py-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#c8a96e] mb-2">
                6.&nbsp;{c.adv6Heading}
              </p>
              <p className="text-[14px] leading-[1.85] text-[#3d3530] mb-4">{c.adv6Body}</p>
              <ul className="space-y-2 mb-5 pl-4">
                {[c.adv6Bullet1, c.adv6Bullet2].filter(Boolean).map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] leading-[1.8] text-[#3d3530]">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8a96e]" />
                    {b}
                  </li>
                ))}
              </ul>
              <p className="text-[14px] leading-[1.85] text-[#3d3530]">{c.adv6QualifyingAssets}</p>
            </div>
          </div>

          {/* Practical Effect */}
          <div className="mt-12 border-t border-[#ede8e1] pt-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#c8a96e] mb-5">
              {c.practicalEffectHeading}
            </p>
            <ul className="space-y-3 mb-7">
              {practicalEffects.map((effect, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] leading-[1.8] text-[#3d3530]">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8a96e]" />
                  {effect}
                </li>
              ))}
            </ul>
            <p className="text-[14px] leading-[1.85] text-[#3d3530]">{c.ownerOccupiersNote}</p>
          </div>

          {/* Disclaimer */}
          <div className="mt-10 border-t border-[#ede8e1] pt-8">
            <p className="text-[12px] leading-[1.85] italic text-[#8a7b6d]">
              {c.disclaimer}
            </p>
          </div>

          {/* Links */}
          {(c.link1Label || c.link2Label) && (
            <div className="mt-8 flex flex-wrap items-center gap-6">
              {c.link1Label && <LinkItem label={c.link1Label} url={c.link1Url} />}
              {c.link2Label && <LinkItem label={c.link2Label} url={c.link2Url} />}
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  )
}
