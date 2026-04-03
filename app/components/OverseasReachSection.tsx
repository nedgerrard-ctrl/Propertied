'use client'
/**
 * OverseasReachSection
 *
 * A full-width dark section combining PPM's overseas investor copy with
 * a point-cloud globe showing Asia-Pacific → Melbourne investment flows.
 *
 * ─── Placement in app/about/page.tsx ───────────────────────────────────────
 * The section uses its own bg so it should sit OUTSIDE the max-w-7xl
 * container div. Example:
 *
 *   </div>                         ← end of max-w-7xl container
 *   <OverseasReachSection />
 *   <div className="mx-auto max-w-7xl px-6 py-10">   ← resume container
 *
 * Or insert it between the "Why PPM" and "Developer Services" sections.
 * ───────────────────────────────────────────────────────────────────────────
 */

import dynamic from 'next/dynamic'
import Link from 'next/link'

/** Lazy-load the WebGL canvas with SSR disabled */
const GlobeCanvas = dynamic(() => import('./globe/GlobeCanvas'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#13100d]" />,
})

const STATS = [
  { value: '$50M+',        label: 'Assets Under Management' },
  { value: '10+ Years',    label: 'Serving Overseas Clients' },
  { value: 'Asia-Pacific', label: 'Primary Client Base' },
]

export default function OverseasReachSection() {
  return (
    <section className="relative overflow-hidden bg-[#13100d]">
      <div className="mx-auto max-w-7xl">
        <div className="grid min-h-[540px] lg:grid-cols-2">

          {/* ── Copy column ─────────────────────────────────────────────── */}
          <div className="flex flex-col justify-center px-8 py-16 lg:px-14 xl:px-16">

            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#9e8d7a]">
              Overseas Investor Specialists
            </p>

            <h2 className="mt-4 text-[26px] font-light leading-[1.35] text-white sm:text-[30px]">
              Your gateway to Melbourne property,{' '}
              <span className="text-[#c8a96e]">from anywhere</span>
            </h2>

            <p className="mt-5 max-w-[420px] text-[13px] leading-[1.9] text-[#8a7b6d]">
              The majority of PPM&rsquo;s clients are based overseas — predominantly
              across the Asia-Pacific region. We understand the unique complexities
              of investing in Australian residential property from abroad: foreign
              investment approvals, remote due diligence, and ongoing asset
              management at a distance.
            </p>

            <p className="mt-4 max-w-[420px] text-[13px] leading-[1.9] text-[#8a7b6d]">
              From first enquiry through to settled contract and long-term
              portfolio management, you deal with one trusted team — no handoffs,
              no information gaps.
            </p>

            {/* Stats row */}
            <div className="mt-10 grid grid-cols-3 gap-px border border-[#2d2218] bg-[#2d2218]">
              {STATS.map((s) => (
                <div key={s.label} className="bg-[#1a1410] px-3 py-5 text-center">
                  <p className="text-[18px] font-semibold tracking-tight text-[#c8a96e] sm:text-[20px]">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#5e4e44] sm:text-[10px]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-block border border-[#c8a96e] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c8a96e] transition hover:bg-[#c8a96e] hover:text-[#13100d]"
              >
                Start Your Journey
              </Link>
            </div>
          </div>

          {/* ── Globe column ─────────────────────────────────────────────── */}
          <div className="relative min-h-[340px] bg-[#13100d] lg:min-h-0">
            <GlobeCanvas />

            {/* Subtle location label — doesn't compete with the globe */}
            <p className="pointer-events-none absolute bottom-5 right-6 text-right text-[10px] uppercase tracking-[0.22em] text-[#3d3028]">
              Melbourne, Australia
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
