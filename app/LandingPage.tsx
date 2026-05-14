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

// ─── Sections ─────────────────────────────────────────────────────────────────

function VideoHero({ content }: { content: LandingContentData }) {
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
          {content.heroTagline}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`${cormorant.className} text-5xl md:text-7xl lg:text-[5.5rem] font-light leading-[1.08] text-white max-w-3xl`}
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
          className="mt-8 max-w-[42ch] text-[13.5px] leading-[1.9] text-[#9e8d7a]"
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

function EthosSection({ content }: { content: LandingContentData }) {
  return (
    <section className="bg-[#f6f2eb] py-36 px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid md:grid-cols-[1fr_2fr] gap-16 md:items-start">
          {/* Label column */}
          <div className="md:pt-3">
            <div className="h-px w-12 bg-[#c8a96e] mb-6" />
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">
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
            <h2 className={`${cormorant.className} text-4xl md:text-5xl lg:text-[3.4rem] font-light leading-[1.2] text-[#1f1a17]`}>
              {content.ethosHeading}
            </h2>
            <p className="mt-8 max-w-[55ch] text-[13.5px] leading-[2] text-[#5a4a3f]">
              {content.ethosBody}
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

function ServicesGrid({ content }: { content: LandingContentData }) {
  const services = [
    { href: '/buyers',     label: content.svc1Label, sub: content.svc1Sub, index: '01', image: '/images/For buyers.jpg',    desc: content.svc1Desc, accent: false },
    { href: '/about',      label: content.svc2Label, sub: content.svc2Sub, index: '02', image: '/images/aboutus.png',       desc: content.svc2Desc, accent: false },
    { href: '/developer',  label: content.svc3Label, sub: content.svc3Sub, index: '03', image: '/images/For developers.jpg',desc: content.svc3Desc, accent: false },
    { href: '/testimonial',label: content.svc4Label, sub: content.svc4Sub, index: '04', image: null,                        desc: content.svc4Desc, accent: false },
    { href: '/blog',       label: content.svc5Label, sub: content.svc5Sub, index: '05', image: '/images/For blog.jpg',      desc: content.svc5Desc, accent: false },
    { href: '/contact',    label: content.svc6Label, sub: content.svc6Sub, index: '06', image: null,                        desc: null,             accent: true  },
  ]

  return (
    <section className="bg-[#2f2a24] py-28 px-8 border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex items-center gap-8">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#6b5e54] shrink-0">
            Explore
          </p>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        {/* Masonry — CSS columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {services.map((svc, i) => (
            <motion.div
              key={svc.index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-6%' }}
              transition={{ duration: 0.75, delay: i * 0.08 }}
              className="break-inside-avoid mb-4"
            >
              <Link
                href={svc.href}
                className={`group relative flex flex-col overflow-hidden transition-all duration-500 ${
                  svc.accent
                    ? 'border border-[#c8a96e]/40 bg-[#c8a96e]/[0.06] hover:bg-[#c8a96e]/[0.12] hover:border-[#c8a96e]/70'
                    : 'border border-white/[0.07] bg-[#1c1814] hover:border-white/[0.14] hover:bg-[#211d18]'
                }`}
              >
                {svc.image && (
                  <div className="relative overflow-hidden">
                    <img
                      src={svc.image}
                      alt={svc.label}
                      className="h-48 w-full object-cover transition-all duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-transparent to-transparent" />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-7">
                  <span className={`text-[9px] uppercase tracking-[0.28em] mb-5 ${svc.accent ? 'text-[#c8a96e]/50' : 'text-[#3d3530]'}`}>
                    {svc.index}
                  </span>

                  <h3 className={`${cormorant.className} text-[1.9rem] font-light leading-none mb-2 transition group-hover:text-white ${svc.accent ? 'text-[#c8a96e]' : 'text-neutral-200'}`}>
                    {svc.label}
                  </h3>

                  <p className={`text-[10px] uppercase tracking-[0.18em] mb-4 transition ${svc.accent ? 'text-[#c8a96e]/60 group-hover:text-[#c8a96e]/90' : 'text-[#6b5e54] group-hover:text-[#8a7b6d]'}`}>
                    {svc.sub}
                  </p>

                  {svc.desc && (
                    <p className="text-[12.5px] leading-[1.85] text-[#5a4f47] group-hover:text-[#6b5e54] transition mt-1 mb-5">
                      {svc.desc}
                    </p>
                  )}

                  <span className={`mt-auto text-[11px] tracking-widest -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 ${svc.accent ? 'text-[#c8a96e]' : 'text-[#c8a96e]'}`}>
                    →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ShowcaseSection({ projects }: { projects: ShowcaseProjectData[] }) {
  return (
    <section className="bg-[#0d0b08] py-28 px-8 border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl">

        {/* Section header */}
        <div className="mb-16 flex items-start gap-16">
          <div className="shrink-0 md:pt-1">
            <div className="h-px w-12 bg-[#c8a96e] mb-6" />
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#6b5e54]">
              Our Portfolio
            </p>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={`${cormorant.className} text-4xl md:text-5xl lg:text-[3.4rem] font-light leading-[1.15] text-white max-w-xl`}
          >
            Completed <em className="italic text-[#c8a96e]">Projects</em>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05]">
          {projects.map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.75, delay: i * 0.07 }}
              className="group relative flex flex-col overflow-hidden bg-[#0d0b08]"
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[4/3]">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="h-full w-full bg-[#1c1814] flex items-center justify-center">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-[#3d3530]">
                      Image Coming Soon
                    </span>
                  </div>
                )}
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b08] via-[#0d0b08]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              </div>

              {/* Info */}
              <div className="flex flex-col p-7 border-t border-white/[0.06]">
                <p className="text-[9px] uppercase tracking-[0.28em] text-[#c8a96e]/50 mb-3">
                  Completed
                </p>
                <h3 className={`${cormorant.className} text-[1.85rem] font-light leading-none text-white mb-3 transition group-hover:text-[#e8d4b0]`}>
                  {project.name}
                </h3>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#5a4f47] leading-[1.6]">
                  {project.address}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaBanner({ content }: { content: LandingContentData }) {
  return (
    <section className="bg-[#1c1814] border-t border-white/[0.06] py-28 px-8">
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
  showcaseProjects = [],
}: {
  content: LandingContentData
  showcaseProjects?: ShowcaseProjectData[]
}) {
  return (
    <main className="w-full bg-[#0a0806]">
      <Navbar />
      <VideoHero content={content} />
      <StatsStrip content={content} />
      <EthosSection content={content} />
      <ShowcaseSection projects={showcaseProjects} />
      <ServicesGrid content={content} />
      <CtaBanner content={content} />
      <Footer />
    </main>
  )
}
