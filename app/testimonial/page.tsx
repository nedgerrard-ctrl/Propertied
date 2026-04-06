'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

// ─── Data ─────────────────────────────────────────────────────────────────────

const cinematic = [
  {
    id: 1,
    quote:
      'PPM made the process feel organised and transparent from the beginning. Their guidance gave me confidence when purchasing off-the-plan for the first time.',
    client: 'Daniel K. — Investor',
  },
  {
    id: 2,
    quote:
      'As an overseas buyer, I needed a team I could trust. Communication was prompt, professional, and easy to follow throughout the journey.',
    client: 'Sophia L. — Overseas Buyer',
  },
  {
    id: 3,
    quote:
      'What stood out most was the end-to-end approach. It felt like I had a team supporting the whole property journey rather than just a sale.',
    client: 'James W. — Client',
  },
]

const grid = [
  {
    id: 4,
    quote: 'The team understood my goals clearly and matched me with options that suited my budget and long-term investment strategy.',
    client: 'Michael T. — Property Investor',
    rating: 4,
  },
  {
    id: 5,
    quote: 'I appreciated how clearly everything was explained. The process felt premium but still very practical and straightforward.',
    client: 'Emma R. — Buyer',
    rating: 5,
  },
  {
    id: 6,
    quote: 'Professional presentation, timely follow-up, and a strong understanding of what investors actually need.',
    client: 'Olivia C. — Local Investor',
    rating: 4,
  },
  {
    id: 7,
    quote: 'Professional presentation, timely follow-up, and a strong understanding of what investors actually need.',
    client: 'Bryan C. — Local Investor',
    rating: 4,
  },
  {
    id: 8,
    quote: 'Professional presentation, timely follow-up, and a strong understanding of what investors actually need.',
    client: 'Wallace C. — Local Investor',
    rating: 4,
  },
]

// ─── Ambient background ────────────────────────────────────────────────────────
// House images are blurred beyond recognition — they become abstract light pools.

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
          className={`${cormorant.className} text-3xl md:text-5xl lg:text-[3.4rem] text-neutral-100 leading-[1.25] tracking-tight`}
        >
          {quote}
        </h2>

        <p className="mt-8 text-[11px] tracking-[0.28em] text-[#8a7b6d] uppercase">
          — {client}
        </p>
      </motion.div>
    </div>
  )
}

// ─── Compact grid card ────────────────────────────────────────────────────────

function GridCard({ quote, client, rating }: { quote: string; client: string; rating: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.85, ease: 'easeOut' }}
      className="border-t border-neutral-800 pt-8"
    >
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} viewBox="0 0 24 24" className={`h-3 w-3 ${i < rating ? 'fill-[#c8a96e]' : 'fill-neutral-700'}`}>
            <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.58 6.1 20.67l1.13-6.57L2.45 9.44l6.6-.96L12 2.5z" />
          </svg>
        ))}
      </div>

      <p className={`${cormorant.className} text-[1.25rem] italic text-neutral-300 leading-relaxed`}>
        &ldquo;{quote}&rdquo;
      </p>

      <p className="mt-5 text-[10px] tracking-[0.24em] text-[#8a7b6d] uppercase">
        {client}
      </p>
    </motion.article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TestimonialsPage() {
  return (
    <main className="relative w-full min-h-screen bg-[#0a0806] text-neutral-200">
      <AmbientBackground />
      <Navbar />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section className="pt-44 pb-10 px-8 md:px-14 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4 }}
        >
          <p className="text-[10px] tracking-[0.34em] text-[#8a7b6d] uppercase mb-3">
            Client Perspectives
          </p>
          <div className="h-px w-full bg-neutral-800" />
        </motion.div>
      </section>

      {/* ── Cinematic quotes ──────────────────────────────────────────────── */}
      <section className="pb-20">
        {cinematic.map((item, i) => (
          <CinematicQuote key={item.id} quote={item.quote} client={item.client} index={i} />
        ))}
      </section>

      {/* ── Compact grid ──────────────────────────────────────────────────── */}
      <section
        className="border-t border-neutral-800 py-28"
        style={{ backgroundColor: 'rgba(10,8,6,0.6)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-7xl mx-auto px-8 md:px-14">
          <p className="text-[10px] tracking-[0.3em] text-[#8a7b6d] uppercase mb-16">
            More Reviews
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14">
            {grid.map((item) => (
              <GridCard key={item.id} quote={item.quote} client={item.client} rating={item.rating} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="border-t border-neutral-800 py-28">
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
              Ready to work with the PPM team?
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
                className="border border-neutral-800 px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a7b6d] transition hover:border-neutral-600 hover:text-neutral-200"
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
