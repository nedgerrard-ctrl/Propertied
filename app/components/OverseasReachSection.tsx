'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

const GlobeCanvas = dynamic(() => import('./globe/GlobeCanvas'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#13100d]" />,
})

type OverseasContent = {
  headingMain?: string
  headingAccent?: string
  p1?: string
  p2?: string
  stat1Value?: string
  stat1Label?: string
  stat2Value?: string
  stat2Label?: string
  stat3Value?: string
  stat3Label?: string
}

const DEFAULTS: Required<OverseasContent> = {
  headingMain: "Your gateway to Melbourne property,",
  headingAccent: "from anywhere",
  p1: "The majority of PPM’s clients are based overseas — predominantly across the Asia-Pacific region. We understand the unique complexities of investing in Australian residential property from abroad: foreign investment approvals, remote due diligence, and ongoing asset management at a distance.",
  p2: "From first enquiry through to settled contract and long-term portfolio management, you deal with one trusted team — no handoffs, no information gaps.",
  stat1Value: "$50M+",
  stat1Label: "Assets Under Management",
  stat2Value: "10+ Years",
  stat2Label: "Serving Overseas Clients",
  stat3Value: "Asia-Pacific",
  stat3Label: "Primary Client Base",
}

export default function OverseasReachSection({ content = {} }: { content?: OverseasContent }) {
  const c = { ...DEFAULTS, ...content }

  const stats = [
    { value: c.stat1Value, label: c.stat1Label },
    { value: c.stat2Value, label: c.stat2Label },
    { value: c.stat3Value, label: c.stat3Label },
  ]

  return (
    <section className="relative overflow-hidden bg-[#13100d]">
      <div className="mx-auto max-w-7xl">
        <div className="grid min-h-[540px] lg:grid-cols-2">

          {/* Copy column */}
          <div className="flex flex-col justify-center px-8 py-16 lg:px-14 xl:px-16">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#9e8d7a]">
              Overseas Investor Specialists
            </p>

            <h2 className="mt-4 text-[26px] font-light leading-[1.35] text-white sm:text-[30px]">
              {c.headingMain}{' '}
              <span className="text-[#c8a96e]">{c.headingAccent}</span>
            </h2>

            <p className="mt-5 max-w-[420px] text-[13px] leading-[1.9] text-[#8a7b6d]">
              {c.p1}
            </p>

            <p className="mt-4 max-w-[420px] text-[13px] leading-[1.9] text-[#8a7b6d]">
              {c.p2}
            </p>

            <div className="mt-10 grid grid-cols-3 gap-px border border-[#2d2218] bg-[#2d2218]">
              {stats.map((s) => (
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
                href="/contact/buyers-investors"
                className="inline-block border border-[#c8a96e] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c8a96e] transition hover:bg-[#c8a96e] hover:text-[#13100d]"
              >
                Start Your Journey
              </Link>
            </div>
          </div>

          {/* Globe column */}
          <div className="relative min-h-[340px] bg-[#13100d] lg:min-h-0">
            <GlobeCanvas />
            <p className="pointer-events-none absolute bottom-5 right-6 text-right text-[10px] uppercase tracking-[0.22em] text-[#3d3028]">
              Melbourne, Australia
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
