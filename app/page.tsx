'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import Link from 'next/link'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { value: '10+',        unit: 'Years',      label: 'Industry Experience' },
  { value: '$1.5B+',     unit: '',           label: 'Projects Delivered' },
  { value: 'End-to-end', unit: '',           label: 'Source · Buy · Manage · Resell' },
]

const services = [
  {
    href:     '/about',
    label:    'About Us',
    sub:      'Our story & team',
    index:    '01',
  },
  {
    href:     '/buyers',
    label:    'For Buyers',
    sub:      'Off-plan & established',
    index:    '02',
  },
  {
    href:     '/developer',
    label:    'For Developers',
    sub:      'Partnership enquiries',
    index:    '03',
  },
  {
    href:     '/blog',
    label:    'Blog & Insights',
    sub:      'Market perspectives',
    index:    '04',
  },
  {
    href:     '/testimonial',
    label:    'Testimonials',
    sub:      'Client perspectives',
    index:    '05',
  },
  {
    href:     '/contact',
    label:    'Contact',
    sub:      'Start a conversation',
    index:    '06',
  },
]

// ─── Sections ─────────────────────────────────────────────────────────────────

function VideoHero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.55, 0.85])
  const textY          = useTransform(scrollYProgress, [0, 1],   [0, 80])
  const textOpacity    = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      {/* Video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/real%20estate%20cinematic%20video.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Overlay */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-[#0a0806]"
      />

      {/* Amber left rule */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 h-[120px] w-px bg-gradient-to-b from-transparent via-[#c8a96e] to-transparent" />

      {/* Hero copy */}
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
          Property Project Marketing
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`${cormorant.className} text-5xl md:text-7xl lg:text-[5.5rem] font-light leading-[1.08] text-white max-w-3xl`}
        >
          Melbourne&rsquo;s
          <br />
          <em className="italic text-[#c8a96e]">end-to-end</em>
          <br />
          property partner.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-8 max-w-[42ch] text-[13.5px] leading-[1.9] text-[#9e8d7a]"
        >
          We source, market, and manage residential property — connecting
          developers with qualified local and overseas buyers at every stage
          of the property lifecycle.
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

      {/* Scroll cue */}
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

function StatsStrip() {
  return (
    <section className="bg-[#0f0c0a] border-b border-white/[0.06]">
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

function EthosSection() {
  return (
    <section className="bg-[#0a0806] py-36 px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid md:grid-cols-[1fr_2fr] gap-16 md:items-start">
          {/* Label column */}
          <div className="md:pt-3">
            <div className="h-px w-12 bg-[#c8a96e] mb-6" />
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#6b5e54]">
              Our Ethos
            </p>
          </div>

          {/* Copy column */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className={`${cormorant.className} text-4xl md:text-5xl lg:text-[3.4rem] font-light leading-[1.2] text-neutral-100`}>
              We believe property investment should be simple, transparent, and built for the long term.
            </h2>
            <p className="mt-8 max-w-[55ch] text-[13.5px] leading-[2] text-[#8a7b6d]">
              PPM manages the full property lifecycle on behalf of investors — from sourcing
              new developments and matching them with qualified buyers, to ongoing portfolio
              management and resale through our sister company, Online Property Services.
            </p>
            <Link
              href="/about"
              className="mt-10 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#c8a96e] transition hover:gap-4"
            >
              <span>Our Story</span>
              <span>→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ServicesGrid() {
  return (
    <section className="bg-[#0f0c0a] py-28 px-8 border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex items-end justify-between">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#6b5e54]">
            Explore
          </p>
          <div className="h-px flex-1 mx-10 bg-white/[0.06]" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3">
          {services.map((svc, i) => (
            <motion.div
              key={svc.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.75, delay: i * 0.07 }}
            >
              <Link
                href={svc.href}
                className="group flex flex-col border-b border-white/[0.06] px-2 py-10 transition hover:bg-white/[0.02]"
              >
                <span className="text-[9px] uppercase tracking-[0.28em] text-[#3d3530] mb-6">
                  {svc.index}
                </span>
                <h3 className={`${cormorant.className} text-[1.9rem] font-light text-neutral-200 leading-none mb-3 transition group-hover:text-white`}>
                  {svc.label}
                </h3>
                <p className="text-[10.5px] uppercase tracking-[0.18em] text-[#6b5e54] transition group-hover:text-[#8a7b6d]">
                  {svc.sub}
                </p>
                <span className="mt-6 text-[#c8a96e] text-[11px] tracking-widest opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                  →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaBanner() {
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
            Start your property journey with PPM.
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

export default function Home() {
  return (
    <main className="w-full bg-[#0a0806]">
      <Navbar />
      <VideoHero />
      <StatsStrip />
      <EthosSection />
      <ServicesGrid />
      <CtaBanner />
      <Footer />
    </main>
  )
}
