'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { DeveloperContentData } from '@/lib/developer-defaults'

const FloatingDust = dynamic(() => import('../components/FloatingDust'), {
  ssr: false,
  loading: () => null,
})

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DeveloperPage({ content }: { content: DeveloperContentData }) {
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])

  return (
    <main className="min-h-screen w-full text-[#1f1a17]">
      <Navbar />

      {/* ── S1: Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden">
        <FloatingDust />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">
              For Developers
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">
              Partnership
            </p>
          </div>

          <div className="mt-8 border-t border-[#3a302a] pt-12 lg:pt-16">
            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-light leading-[1.06] text-white max-w-4xl">
              {content.heroHeadingMain}<br />
              <span className="text-[#c8a96e]">{content.heroHeadingAccent}</span>
            </h1>
          </div>

          <p className="mt-8 max-w-[48ch] text-[14px] leading-[1.9] text-[#8a7b6d]">
            {content.heroSubtext}
          </p>

          <div className="mt-12 flex flex-wrap gap-5">
            <Link
              href="/contact/developers"
              className="inline-flex items-center border border-[#c8a96e] px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c8a96e] transition hover:bg-[#c8a96e] hover:text-[#1c1814]"
            >
              Partner With Us
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center border border-[#3a302a] px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a7b6d] transition hover:border-[#8a7b6d] hover:text-[#c8a96e]"
            >
              About PPM
            </Link>
          </div>

          <div className="mt-20 flex items-center gap-4 text-[10px] uppercase tracking-[0.26em] text-[#4a3f37]">
            <span className="block h-px w-10 bg-[#3a302a]" />
            <span>Our Approach</span>
          </div>
        </div>
      </section>

      {/* ── S2: Content ──────────────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-8">

          {/* Body paragraphs */}
          <div className="space-y-5 text-[14px] leading-[1.85] text-[#3d3530]">
            <p>{content.networkP1}</p>
            <p>{content.networkP2}</p>
            {'networkP3' in content && <p>{(content as typeof content & { networkP3: string }).networkP3}</p>}
          </div>

          {/* CTA line */}
          <p className="mt-8 text-[14px] leading-[1.85] text-[#3d3530]">
            To discuss your project in confidence, contact us at{' '}
            <a
              href="mailto:admin@onlinepropertyservices.com.au"
              className="text-[#c8a96e] underline hover:no-underline"
            >
              admin@onlinepropertyservices.com.au
            </a>
            {' '}or{' '}
            <Link href="/contact/developers" className="text-[#c8a96e] underline hover:no-underline">
              register your interest below
            </Link>
            .
          </p>

          <div className="mt-10 border-b border-[#ddd3c6]" />
        </div>
      </section>

      <Footer />
    </main>
  )
}
