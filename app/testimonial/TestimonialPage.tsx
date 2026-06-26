'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { TestimonialContentData } from '@/lib/testimonial-defaults'
import { DynamicTestimonial } from './page'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

// ─── Ambient background ────────────────────────────────────────────────────────

function AmbientBackground() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 2500], [0, 220])
  const y2 = useTransform(scrollY, [0, 2500], [0, -180])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0806] pointer-events-none">
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] opacity-25 mix-blend-screen"
      >
        <img
          src="/images/house1.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          style={{ filter: 'blur(120px) grayscale(1) brightness(1.8)' }}
        />
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        className="absolute top-[35%] -right-[10%] w-[55vw] h-[55vw] opacity-20 mix-blend-screen"
      >
        <img
          src="/images/house3.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          style={{ filter: 'blur(140px) grayscale(1) brightness(1.6)' }}
        />
      </motion.div>
    </div>
  )
}

// ─── Cinematic full-viewport quote ────────────────────────────────────────────

const alignments = [
  'items-start text-left  md:pr-[25%]',
  'items-end   text-right md:pl-[25%]',
  'items-center text-center px-[5%]',
]

function CinematicQuote({
  quote,
  client,
  index,
}: {
  quote: string
  client: string
  index: number
}) {
  return (
    <div className={`min-h-[85vh] flex flex-col justify-center w-full max-w-7xl mx-auto px-8 md:px-14 ${alignments[index]}`}>
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl"
      >
        {/* Opening mark */}
        <p
          className={`${cormorant.className} text-[5rem] leading-none text-[#c8a96e] select-none -mb-3`}
          aria-hidden="true"
        >
          &ldquo;
        </p>

        <h2
          className={`${cormorant.className} text-xl md:text-2xl lg:text-[1.85rem] text-neutral-100 leading-[1.45] tracking-tight`}
        >
          {quote}
        </h2>

        <p className="mt-8 text-[11px] tracking-[0.28em] text-[#8a7b6d] uppercase">
          {client}
        </p>
      </motion.div>
    </div>
  )
}

// ─── Compact grid card ────────────────────────────────────────────────────────

function GridCard({ quote, client, image }: { quote: string; client: string; image?: string }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.85, ease: 'easeOut' }}
      className="border-t border-[#d9cec0] pt-8"
    >
      {/* Photo row */}
      <div className="flex items-center gap-3 mb-4">
        {image ? (
          <img
            src={image}
            alt={client}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-[#d9cec0] shrink-0"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-[#ede8e1] ring-1 ring-[#d9cec0] shrink-0 flex items-center justify-center">
            <svg className="h-5 w-5 text-[#c8bfb4]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4Z" />
            </svg>
          </div>
        )}
      </div>

      <p className={`${cormorant.className} text-[1.25rem] italic text-[#2a1f1a] leading-relaxed`}>
        &ldquo;{quote}&rdquo;
      </p>

      <p className="mt-5 text-[10px] tracking-[0.24em] text-[#8a7b6d] uppercase">
        {client}
      </p>
    </motion.article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TestimonialPage({
  content,
  testimonials,
}: {
  content: TestimonialContentData
  testimonials: DynamicTestimonial[]
}) {
  const cinematic = [
    { id: 1, quote: content.cine1Quote, client: content.cine1Client },
    { id: 2, quote: content.cine2Quote, client: content.cine2Client },
    { id: 3, quote: content.cine3Quote, client: content.cine3Client },
  ]

  const grid = testimonials

  return (
    <main className="relative w-full min-h-screen bg-[#0a0806] text-neutral-200">
      <AmbientBackground />
      <Navbar />

      {/* ── Cinematic quotes ──────────────────────────────────────────────── */}
      <section className="bg-[#1e1a15] pb-20">
        {cinematic.map((item, i) => (
          <CinematicQuote key={item.id} quote={item.quote} client={item.client} index={i} />
        ))}
      </section>

      {/* ── Compact grid ──────────────────────────────────────────────────── */}
      <section className="bg-[#f6f2eb] border-t border-[#e3d8ca] py-28">
        <div className="max-w-7xl mx-auto px-8 md:px-14">
          <p className="text-[10px] tracking-[0.3em] text-[#8a7b6d] uppercase mb-16">
            More Reviews
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14">
            {grid.length === 0 && (
              <p className="col-span-full text-[13px] text-[#8a7b6d] italic">No reviews yet.</p>
            )}
            {grid.map((item) => (
              <GridCard key={item._id} quote={item.quote} client={item.client} image={item.image} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#2f2a24] border-t border-white/[0.06] py-28">
        <div className="max-w-7xl mx-auto px-8 md:px-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <p className="text-[10px] tracking-[0.32em] text-[#8a7b6d] uppercase mb-6">
              Begin Your Journey
            </p>
            <h2 className={`${cormorant.className} text-4xl md:text-5xl text-neutral-100 font-light leading-snug mb-10`}>
              {content.ctaHeading}
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                href="/contact"
                className="border border-[#c8a96e] px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c8a96e] transition hover:bg-[#c8a96e] hover:text-[#0a0806]"
              >
                Get in Touch
              </Link>
              <Link
                href="/buyers"
                className="border border-white/20 px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9e8d7a] transition hover:border-white/40 hover:text-white"
              >
                View Properties
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
