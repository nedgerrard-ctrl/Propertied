'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import Link from 'next/link'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { LandingContentData } from '@/lib/landing-defaults'

export type ShowcaseProjectData = {
  _id: string
  name: string
  address: string
  image: string
  order: number
  published: boolean
}

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const OFF_PLAN_ADVANTAGES = [
  'Stamp duty savings',
  'Low deposit entry',
  'Configuration choices',
  'Your own finishes',
  'Appliance upgrades',
  'Tax advantages for new builds',
]

const WHY_ICONS = ['01', '02', '03', '04', '05', '06']

// ─── Sections ─────────────────────────────────────────────────────────────────

function VideoHero({ content }: { content: LandingContentData }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.55, 0.85])
  const textY          = useTransform(scrollYProgress, [0, 1],   [0, 80])
  const textOpacity    = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/real%20estate%20cinematic%20video.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-[#0a0806]"
      />

      <div className="absolute left-8 top-1/2 -translate-y-1/2 h-[120px] w-px bg-gradient-to-b from-transparent via-[#c8a96e] to-transparent" />

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="absolute inset-0 flex flex-col justify-center px-12 md:px-20 max-w-7xl mx-auto"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-[10px] uppercase tracking-[0.38em] text-[#8a7b6d] mb-6"
        >
          {content.heroTagline}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`${cormorant.className} text-4xl md:text-5xl lg:text-[3.6rem] xl:text-[4rem] font-light leading-[1.12] text-white max-w-4xl`}
        >
          {content.heroLine1}
          <br />
          <em className="italic text-[#c8a96e]">{content.heroAccent}</em>
          <br />
          {content.heroLine3}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-8 max-w-[48ch] text-[13.5px] leading-[1.9] text-[#9e8d7a]"
        >
          {content.heroSubtext}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link
            href="/buyers"
            className="border border-[#c8a96e] px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c8a96e] transition hover:bg-[#c8a96e] hover:text-[#0a0806]"
          >
            View Properties
          </Link>
          <Link
            href="/contact"
            className="border border-white/20 px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9e8d7a] transition hover:border-white/40 hover:text-white"
          >
            Get in Touch
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] uppercase tracking-[0.32em] text-[#4a3f37]">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="block h-4 w-px bg-[#c8a96e]/60"
        />
      </motion.div>
    </section>
  )
}

function StatsStrip({ content }: { content: LandingContentData }) {
  const stats = [
    { value: content.stat1Value, unit: content.stat1Unit, label: content.stat1Label },
    { value: content.stat2Value, unit: content.stat2Unit, label: content.stat2Label },
    { value: content.stat3Value, unit: content.stat3Unit, label: content.stat3Label },
  ]

  return (
    <section className="bg-[#1c1814] border-b border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-8">
        <div className="grid grid-cols-1 divide-y divide-white/[0.06] md:grid-cols-3 md:divide-x md:divide-y-0">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="flex flex-col justify-center px-10 py-12"
            >
              <p className={`${cormorant.className} text-[2.6rem] font-light leading-none text-white`}>
                {s.value}
                {s.unit && (
                  <span className="ml-1 text-[1.4rem] text-[#c8a96e]">{s.unit}</span>
                )}
              </p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.26em] text-[#6b5e54]">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhatWeDoSection({ content }: { content: LandingContentData }) {
  return (
    <section className="bg-[#f6f2eb] py-24 lg:py-32 px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8%' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d] mb-5">
            What We Do
          </p>

          <h2 className={`${cormorant.className} text-4xl md:text-5xl lg:text-[3.2rem] font-light leading-[1.15] text-[#1f1a17] mb-10`}>
            {content.ethosHeading}
          </h2>

          <div className="space-y-5 text-[14px] leading-[1.95] text-[#3d3530] max-w-[68ch] mb-12">
            <p>{content.ethosBody}</p>
            <p>{content.whatWeDoBody2}</p>
          </div>

          <div className="border-t border-[#ddd3c6] pt-10 mb-10">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#c8a96e] mb-6">
              The Six Advantages of Buying Off-the-Plan
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-12 gap-y-4">
              {OFF_PLAN_ADVANTAGES.map((adv) => (
                <li key={adv} className="flex items-start gap-3 text-[13.5px] text-[#3d3530]">
                  <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8a96e]" />
                  {adv}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[14px] leading-[1.9] text-[#3d3530] max-w-[68ch] mb-8">
            {content.whatWeDoBody3}
          </p>

          <Link
            href="/off-the-plan-explainer"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#c8a96e] border-b border-[#c8a96e]/40 pb-0.5 transition hover:border-[#c8a96e]"
          >
            → What is off-the-plan?
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function OurTransitionSection({ content }: { content: LandingContentData }) {
  return (
    <section className="bg-[#2f2a24] py-24 lg:py-32 px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8%' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d] mb-5">
            Our Transition
          </p>

          <h2 className={`${cormorant.className} text-3xl md:text-4xl lg:text-[2.8rem] font-light leading-[1.2] text-white mb-10`}>
            {content.transitionHeading}
          </h2>

          <div className="space-y-5 text-[14px] leading-[1.95] text-[#9e8d7a] max-w-[64ch] mb-12">
            <p>{content.transitionP1}</p>
            <p>{content.transitionP2}</p>
            <p>{content.transitionP3}</p>
            <p>{content.transitionP4}</p>
          </div>

          <div className="flex flex-wrap gap-8 text-[11px] uppercase tracking-[0.2em]">
            <Link href="/buyers/investors" className="text-[#c8a96e] border-b border-[#c8a96e]/40 pb-0.5 transition hover:border-[#c8a96e]">
              → Investors
            </Link>
            <Link href="/buyers/owner-occupiers" className="text-[#c8a96e] border-b border-[#c8a96e]/40 pb-0.5 transition hover:border-[#c8a96e]">
              → Owner-occupiers
            </Link>
            <Link href="/developer" className="text-[#c8a96e] border-b border-[#c8a96e]/40 pb-0.5 transition hover:border-[#c8a96e]">
              → Developers
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FederalBudgetSection({ content }: { content: LandingContentData }) {
  return (
    <section className="bg-white py-24 lg:py-32 px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8%' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d] mb-5">
            The 2026 Federal Budget
          </p>

          <h2 className={`${cormorant.className} text-3xl md:text-4xl lg:text-[2.8rem] font-light leading-[1.2] text-[#1f1a17] mb-10`}>
            {content.budgetHeading}
          </h2>

          <ul className="space-y-4 mb-8">
            {[content.budgetBullet1, content.budgetBullet2].map((bullet) => (
              <li key={bullet} className="flex items-start gap-4 text-[13.5px] leading-[1.85] text-[#1f1a17]">
                <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8a96e]" />
                <span className="font-medium">{bullet}</span>
              </li>
            ))}
          </ul>

          <p className="text-[14px] leading-[1.95] text-[#3d3530] max-w-[68ch] mb-10">
            {content.budgetBody}
          </p>

          <div className="flex flex-wrap gap-8 mb-10 text-[11px] uppercase tracking-[0.2em]">
            <Link href="/blog" className="text-[#c8a96e] border-b border-[#c8a96e]/40 pb-0.5 transition hover:border-[#c8a96e]">
              → Read the full Insights briefing
            </Link>
            <Link href="/buyers" className="text-[#c8a96e] border-b border-[#c8a96e]/40 pb-0.5 transition hover:border-[#c8a96e]">
              → See the 2026 advantages in detail
            </Link>
          </div>

          <p className="text-[12px] italic text-[#8a7b6d] max-w-[64ch]">
            {content.budgetDisclaimer}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function WhyChoosePPMSection({ content }: { content: LandingContentData }) {
  const items = [
    content.why1,
    content.why2,
    content.why3,
    content.why4,
    content.why5,
    content.why6,
  ]

  return (
    <section className="bg-[#1c1814] py-24 lg:py-32 px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8%' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d] mb-5">
            Why Choose PPM
          </p>

          <h2 className={`${cormorant.className} text-3xl md:text-4xl lg:text-[2.8rem] font-light leading-[1.2] text-white mb-14`}>
            {content.whyHeading}
          </h2>

          <div className="grid sm:grid-cols-2 gap-px bg-white/[0.04]">
            {items.map((item, i) => {
              const dashIdx = item.indexOf(' — ')
              const bold = dashIdx !== -1 ? item.slice(0, dashIdx) : item
              const rest = dashIdx !== -1 ? item.slice(dashIdx) : ''
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.07 }}
                  className="bg-[#1c1814] px-8 py-8 border-t border-white/[0.06]"
                >
                  <span className="block text-[9px] uppercase tracking-[0.28em] text-[#4a3f37] mb-3">
                    {WHY_ICONS[i]}
                  </span>
                  <p className="text-[13.5px] leading-[1.85] text-[#9e8d7a]">
                    <span className="font-semibold text-white">{bold}</span>
                    {rest}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function CtaBanner({ content }: { content: LandingContentData }) {
  return (
    <section className="bg-[#0a0806] border-t border-white/[0.06] py-28 px-8">
      <div className="mx-auto max-w-7xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <p className="text-[10px] uppercase tracking-[0.34em] text-[#6b5e54] mb-6">
            Ready to begin?
          </p>
          <h2 className={`${cormorant.className} text-4xl md:text-5xl font-light text-neutral-100 leading-snug mb-10`}>
            {content.ctaHeading}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/contact"
              className="border border-[#c8a96e] px-10 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c8a96e] transition hover:bg-[#c8a96e] hover:text-[#0a0806]"
            >
              Get in Touch
            </Link>
            <Link
              href="/buyers"
              className="border border-neutral-800 px-10 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a7b6d] transition hover:border-neutral-600 hover:text-neutral-200"
            >
              View Properties
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage({
  content,
  showcaseProjects: _showcaseProjects = [],
}: {
  content: LandingContentData
  showcaseProjects?: ShowcaseProjectData[]
}) {
  return (
    <main className="w-full bg-[#0a0806]">
      <Navbar />
      <VideoHero content={content} />
      <StatsStrip content={content} />
      <WhatWeDoSection content={content} />
      <OurTransitionSection content={content} />
      <FederalBudgetSection content={content} />
      <WhyChoosePPMSection content={content} />
      <CtaBanner content={content} />
      <Footer />
    </main>
  )
}
