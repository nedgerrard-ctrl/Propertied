'use client'
import dynamic from 'next/dynamic'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FullDisclaimerContentData } from '@/lib/full-disclaimer-defaults'

const FloatingDust = dynamic(() => import('../components/FloatingDust'), {
  ssr: false,
  loading: () => null,
})

export default function FullDisclaimerPage({
  content,
}: {
  content: FullDisclaimerContentData
}) {
  const c = content

  return (
    <main className="min-h-screen w-full text-[#1f1a17]">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden">
        <FloatingDust />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">
              Legal
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">
              Disclosures
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
        </div>
      </section>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-8">

          <div className="divide-y divide-[#ede8e1]">
            {[c.para1, c.para2, c.para3, c.para4].filter(Boolean).map((para, i) => (
              <p
                key={i}
                className="py-8 first:pt-0 text-[14px] leading-[1.9] text-[#3d3530]"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Licence line */}
          {c.licenceLine && (
            <p className="mt-10 border-t border-[#ede8e1] pt-8 text-[12px] tracking-[0.1em] text-[#8a7b6d]">
              {c.licenceLine}
            </p>
          )}

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
