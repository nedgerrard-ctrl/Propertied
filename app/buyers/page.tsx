'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { projects, type Project } from '@/lib/projects-data'

const Prism = dynamic(() => import('../components/Prism'), { ssr: false })

// ─── Detail slide-over ────────────────────────────────────────────────────────

function ProjectDetailPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-30 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel — slides in from right */}
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
        className="fixed inset-y-0 right-0 z-40 flex w-full max-w-[520px] flex-col bg-[#0a0806] shadow-[−24px_0_80px_rgba(0,0,0,0.6)]"
      >
        {/* ── Hero image with name overlaid ── */}
        <div className="relative h-72 shrink-0 overflow-hidden">
          <img
            src={project.image}
            alt={project.name}
            className="h-full w-full object-cover"
          />
          {/* gradient: dark at bottom so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/50 to-transparent" />

          {/* Close button — floats top-right over image */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-sm transition hover:bg-black/70 hover:text-white"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>

          {/* Status badge */}
          <span className={[
            'absolute left-5 top-5 px-3 py-1 text-[9px] font-medium uppercase tracking-[0.2em]',
            project.status === 'Current'
              ? 'bg-[#c8a96e] text-[#0a0806]'
              : 'bg-black/50 text-[#c8a96e] border border-[#c8a96e]/40 backdrop-blur-sm',
          ].join(' ')}>
            {project.status}
          </span>

          {/* Project name over image */}
          <div className="absolute bottom-0 left-0 right-0 px-8 pb-7">
            <p className="mb-2 text-[9px] uppercase tracking-[0.28em] text-[#c8a96e]/70">
              {project.suburb}, {project.state}&nbsp;·&nbsp;{project.type}
            </p>
            <h2 className="font-[family-name:var(--font-cormorant)] text-[2.2rem] font-light leading-tight text-white">
              {project.name}
            </h2>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="flex shrink-0 border-b border-white/[0.06]">
          {[
            { label: 'Bedrooms', value: project.bedrooms },
            { label: 'Guide Price', value: project.priceFrom },
            { label: 'Status', value: project.status },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`flex-1 px-5 py-5 ${i > 0 ? 'border-l border-white/[0.06]' : ''}`}
            >
              <p className="text-[8px] uppercase tracking-[0.24em] text-[#6b5e54] mb-1.5">{s.label}</p>
              <p className={`text-[13px] font-medium leading-tight ${
                s.label === 'Status' && project.status === 'Current'
                  ? 'text-[#c8a96e]'
                  : 'text-neutral-200'
              }`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">

          {/* About */}
          <section>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-5 shrink-0 bg-[#c8a96e]/50" />
              <p className="text-[9px] uppercase tracking-[0.26em] text-[#6b5e54]">About This Project</p>
            </div>
            <p className="text-[13px] leading-[2] text-[#8a7b6d]">{project.description}</p>
          </section>

          <div className="h-px bg-white/[0.06]" />

          {/* Highlights */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-5 shrink-0 bg-[#c8a96e]/50" />
              <p className="text-[9px] uppercase tracking-[0.26em] text-[#6b5e54]">Key Highlights</p>
            </div>
            <ul className="space-y-3.5">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-[13px] text-[#8a7b6d]">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8a96e]/50" />
                  {h}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ── Sticky CTA ── */}
        <div className="shrink-0 border-t border-white/[0.06] bg-[#0a0806] px-8 py-5">
          <Link
            href="/contact/buyers-investors"
            className="flex w-full items-center justify-center gap-2 border border-[#c8a96e] px-6 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#c8a96e] transition hover:bg-[#c8a96e] hover:text-[#0a0806]"
          >
            Enquire About This Project
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
              <path d="M3.75 8a.75.75 0 0 1 .75-.75h5.19L8.22 5.78a.75.75 0 1 1 1.06-1.06l2.5 2.5a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 1 1-1.06-1.06l1.47-1.47H4.5A.75.75 0 0 1 3.75 8Z" />
            </svg>
          </Link>
          <p className="mt-3 text-center text-[10px] text-[#6b5e54]">
            Press <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[9px] text-neutral-400">Esc</kbd> to close
          </p>
        </div>
      </motion.aside>
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuyersPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 selection:bg-neutral-800 selection:text-white">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Prism background */}
        <div className="absolute inset-0 z-0 h-full w-full opacity-60">
          <Prism
            animationType="rotate"
            scale={4.5}
            glow={0.8}
            bloom={0.9}
            noise={0.3}
            colorFrequency={1.2}
            hueShift={0.45}
            timeScale={0.3}
            transparent
          />
        </div>
        {/* Gradient fade so text stays readable */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-neutral-950/70 via-neutral-950/50 to-neutral-950 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-44 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
              <p className="text-[10px] uppercase tracking-[0.36em] text-[#6b5e54] mb-8">For Buyers</p>
              <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-7xl font-light leading-[1.1] text-white">
                Find your next<br />
                <em className="italic text-[#c8a96e]">Melbourne</em> property.
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}
              className="text-[14px] leading-[2] text-[#8a7b6d] font-light max-w-md pb-4"
            >
              Whether you are building an investment portfolio or searching for your
              first home, we source, guide, and support you through every step of the
              buying process.
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-3 gap-8 border-t border-white/[0.08] pt-12"
          >
            {[
              { value: `${projects.length}`, label: 'Active Projects' },
              { value: '$1.5B+',             label: 'In Project Sales' },
              { value: '2013',               label: 'Established' },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-[family-name:var(--font-cormorant)] text-4xl font-light text-[#c8a96e] mb-2">{s.value}</p>
                <p className="text-[10px] uppercase tracking-[0.26em] text-[#6b5e54]">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Who We Work With ──────────────────────────────────────────────────── */}
      <section className="bg-[#0d0b09]/60 py-32 border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.h2
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl font-light text-white mb-20"
          >
            Tailored for every buyer
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            {/* Investors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.85 }}
            >
              <div className="border-t border-[#c8a96e]/30 pt-8 mb-8 flex justify-between items-start">
                <h3 className="font-[family-name:var(--font-cormorant)] text-3xl font-light text-white">For Investors</h3>
                <span className="text-sm text-neutral-500 tabular-nums">01</span>
              </div>
              <p className="text-[13px] leading-[2] text-neutral-400 font-light mb-8">
                PPM provides access to off-the-plan and established investment opportunities
                across Melbourne, selected for yield potential, capital growth fundamentals,
                and developer quality. Our end-to-end model means we source your property,
                manage it, and advise on the right time to resell.
              </p>
              <ul className="space-y-4 mb-12 text-[13px] text-neutral-300">
                {[
                  'Access to exclusive off-the-plan developments',
                  'Independent advice — not tied to any single developer',
                  'FIRB guidance for overseas buyers',
                  'Portfolio management via Online Property Services',
                  'Resale timing and reinvestment strategy advice',
                ].map((item) => (
                  <li key={item} className="flex gap-4">
                    <span className="text-[#c8a96e]/60 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact/buyers-investors"
                className="text-[11px] uppercase tracking-[0.22em] border-b border-[#c8a96e]/40 pb-1 text-[#c8a96e] hover:border-[#c8a96e] transition-colors"
              >
                Enquire as Investor
              </Link>
            </motion.div>

            {/* Owner-Occupiers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.85, delay: 0.1 }}
            >
              <div className="border-t border-[#c8a96e]/30 pt-8 mb-8 flex justify-between items-start">
                <h3 className="font-[family-name:var(--font-cormorant)] text-3xl font-light text-white">For Owner-Occupiers</h3>
                <span className="text-sm text-neutral-500 tabular-nums">02</span>
              </div>
              <p className="text-[13px] leading-[2] text-neutral-400 font-light mb-8">
                Buying your own home is one of the most significant decisions you will make.
                PPM gives you access to quality developments before they reach the broader
                market, with independent guidance throughout — from shortlisting and contract
                review through to settlement. We work for you, not the developer.
              </p>
              <ul className="space-y-4 mb-12 text-[13px] text-neutral-300">
                {[
                  'New builds and off-the-plan apartments and townhouses',
                  "Lock in today's price — settle on completion",
                  'New build warranty on all fixtures and fittings',
                  'Modern energy ratings and high-spec inclusions',
                  'Guided support from enquiry through to settlement',
                ].map((item) => (
                  <li key={item} className="flex gap-4">
                    <span className="text-[#c8a96e]/60 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact/buyers-investors"
                className="text-[11px] uppercase tracking-[0.22em] border-b border-[#c8a96e]/40 pb-1 text-[#c8a96e] hover:border-[#c8a96e] transition-colors"
              >
                Enquire as Owner-Occupier
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Available Projects ────────────────────────────────────────────────── */}
      <section className="py-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-16">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-neutral-500 mb-3">Featured &amp; Current</p>
            <h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl font-light text-white">
              Available Projects
            </h2>
          </div>
          <Link
            href="/contact/buyers-investors"
            className="hidden sm:inline-block text-[10px] uppercase tracking-[0.2em] border-b border-neutral-700 pb-1 text-neutral-400 hover:text-white hover:border-white transition-colors"
          >
            Register Interest
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-20">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[4/3] w-full mb-6 bg-neutral-900">
                <img
                  src={project.image}
                  alt={project.name}
                  className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className={[
                  'absolute top-4 right-4 px-3 py-1 text-[9px] font-medium uppercase tracking-[0.2em]',
                  project.status === 'Current'
                    ? 'bg-[#c8a96e] text-[#0a0806]'
                    : 'bg-black/60 text-[#c8a96e] border border-[#c8a96e]/40 backdrop-blur-sm',
                ].join(' ')}>
                  {project.status}
                </div>
              </div>

              {/* Meta */}
              <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-500 mb-3">
                {project.suburb}, {project.state}&nbsp;·&nbsp;{project.type}
              </p>
              <h3 className="font-[family-name:var(--font-cormorant)] text-3xl font-light text-white mb-4">
                {project.name}
              </h3>
              <div className="flex gap-6 text-[11px] uppercase tracking-wider text-neutral-400 mb-5">
                <span>{project.bedrooms} bed</span>
                <span>{project.priceFrom}</span>
              </div>
              <p className="text-[13px] text-neutral-500 line-clamp-2 leading-[1.9] mb-8">
                {project.description}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="flex-1 border border-neutral-700 py-3 text-[10px] uppercase tracking-[0.18em] text-neutral-400 hover:border-neutral-400 hover:text-white transition-colors"
                >
                  View Details
                </button>
                <Link
                  href="/contact/buyers-investors"
                  className="flex-1 border border-[#c8a96e] py-3 text-center text-[10px] uppercase tracking-[0.18em] text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#0a0806] transition-colors"
                >
                  Enquire
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 text-center border-t border-neutral-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9 }}
        >
          <p className="text-[10px] uppercase tracking-[0.34em] text-neutral-500 mb-6">Ready to Begin?</p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl font-light text-white mb-8">
            Start your property search with PPM.
          </h2>
          <p className="text-[14px] leading-[2] text-neutral-400 font-light mb-12 max-w-lg mx-auto">
            Register your interest and one of our advisers will be in touch to discuss
            your goals, budget, and the opportunities currently available.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact/buyers-investors"
              className="px-8 py-4 border border-[#c8a96e] text-[11px] uppercase tracking-[0.18em] text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#0a0806] transition-colors"
            >
              Register Interest
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 border border-neutral-700 text-[11px] uppercase tracking-[0.18em] text-[#8a7b6d] hover:border-neutral-500 hover:text-neutral-200 transition-colors"
            >
              About PPM
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />

      {/* Detail slide-over */}
      {selectedProject && (
        <ProjectDetailPanel
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </main>
  )
}
