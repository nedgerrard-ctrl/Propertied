'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { projects, type Project } from '@/lib/projects-data'

const Prism = dynamic(() => import('../components/Prism'), { ssr: false })

function getPropertyInterestLabel(propertyInterest: Project['propertyInterest']) {
  return propertyInterest === 'off-plan' ? 'Off the Plan' : 'Established'
}

function getPropertyInterestBadgeClass(propertyInterest: Project['propertyInterest']) {
  return propertyInterest === 'off-plan'
    ? 'bg-[#0a0806]/70 text-white border border-white/15 backdrop-blur-sm'
    : 'bg-white/10 text-[#c8a96e] border border-[#c8a96e]/35 backdrop-blur-sm'
}

// ─── Detail slide-over ────────────────────────────────────────────────────────

function ProjectDetailPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-30 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
        className="fixed inset-y-0 right-0 z-40 flex w-full max-w-[520px] flex-col bg-[#0a0806] shadow-[−24px_0_80px_rgba(0,0,0,0.6)]"
      >
        <div className="relative h-72 shrink-0 overflow-hidden">
          <img
            src={project.image}
            alt={project.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/50 to-transparent" />

          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-sm transition hover:bg-black/70 hover:text-white"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>

          <div className="absolute left-5 top-5 flex gap-2">
            <span className={[
              'px-3 py-1 text-[9px] font-medium uppercase tracking-[0.2em]',
              project.status === 'Current'
                ? 'bg-[#c8a96e] text-[#0a0806]'
                : 'bg-black/50 text-[#c8a96e] border border-[#c8a96e]/40 backdrop-blur-sm',
            ].join(' ')}>
              {project.status}
            </span>

            <span className={[
              'px-3 py-1 text-[9px] font-medium uppercase tracking-[0.2em]',
              getPropertyInterestBadgeClass(project.propertyInterest),
            ].join(' ')}>
              {getPropertyInterestLabel(project.propertyInterest)}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-8 pb-7">
            <p className="mb-2 text-[9px] uppercase tracking-[0.28em] text-[#c8a96e]/70">
              {project.suburb}, {project.state}&nbsp;·&nbsp;{project.type}
            </p>
            <h2 className="font-[family-name:var(--font-cormorant)] text-[2.2rem] font-light leading-tight text-white">
              {project.name}
            </h2>
          </div>
        </div>

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
              <p className="mb-1.5 text-[8px] uppercase tracking-[0.24em] text-[#6b5e54]">{s.label}</p>
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

        <div className="flex-1 overflow-y-auto space-y-8 px-8 py-8">
          <section>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-5 shrink-0 bg-[#c8a96e]/50" />
              <p className="text-[9px] uppercase tracking-[0.26em] text-[#6b5e54]">About This Project</p>
            </div>
            <p className="text-[13px] leading-[2] text-[#8a7b6d]">{project.description}</p>
          </section>

          <div className="h-px bg-white/[0.06]" />

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
    <main className="min-h-screen bg-[#0f0c0a] text-neutral-200 selection:bg-neutral-800 selection:text-white">
      <Navbar />

      <section className="relative overflow-hidden">
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
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-neutral-950/70 via-neutral-950/50 to-neutral-950" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-44 md:px-12">
          <div className="mb-24 grid grid-cols-1 items-end gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
              <p className="mb-8 text-[10px] uppercase tracking-[0.36em] text-[#6b5e54]">For Buyers</p>
              <h1 className="font-[family-name:var(--font-cormorant)] text-5xl font-light leading-[1.1] text-white md:text-7xl">
                Find your next<br />
                <em className="italic text-[#c8a96e]">Melbourne</em> property.
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}
              className="max-w-md pb-4 text-[14px] font-light leading-[2] text-[#8a7b6d]"
            >
              Whether you are building an investment portfolio or searching for your
              first home, we source, guide, and support you through every step of the
              buying process.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-3 gap-8 border-t border-white/[0.08] pt-12"
          >
            {[
              { value: `${projects.length}`, label: 'Active Projects' },
              { value: '$1.5B+', label: 'In Project Sales' },
              { value: '2013', label: 'Established' },
            ].map((s) => (
              <div key={s.label}>
                <p className="mb-2 font-[family-name:var(--font-cormorant)] text-4xl font-light text-[#c8a96e]">{s.value}</p>
                <p className="text-[10px] uppercase tracking-[0.26em] text-[#6b5e54]">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="border-y border-[#e3d8ca] bg-[#f6f2eb] py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <motion.h2
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mb-20 font-[family-name:var(--font-cormorant)] text-4xl font-light text-[#1f1a17] md:text-5xl"
          >
            Tailored for every buyer
          </motion.h2>

          <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.85 }}
            >
              <div className="mb-8 flex items-start justify-between border-t border-[#c8a96e]/40 pt-8">
                <h3 className="font-[family-name:var(--font-cormorant)] text-3xl font-light text-[#1f1a17]">For Investors</h3>
                <span className="tabular-nums text-sm text-[#8a7b6d]">01</span>
              </div>
              <p className="mb-8 text-[13px] font-light leading-[2] text-[#5a4a3f]">
                PPM provides access to off-the-plan and established investment opportunities
                across Melbourne, selected for yield potential, capital growth fundamentals,
                and developer quality. Our end-to-end model means we source your property,
                manage it, and advise on the right time to resell.
              </p>
              <ul className="mb-12 space-y-4 text-[13px] text-[#2a1f1a]">
                {[
                  'Access to exclusive off-the-plan developments',
                  'Independent advice — not tied to any single developer',
                  'FIRB guidance for overseas buyers',
                  'Portfolio management via Online Property Services',
                  'Resale timing and reinvestment strategy advice',
                ].map((item) => (
                  <li key={item} className="flex gap-4">
                    <span className="shrink-0 text-[#c8a96e]">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact/buyers-investors"
                className="border-b border-[#c8a96e]/60 pb-1 text-[11px] uppercase tracking-[0.22em] text-[#c8a96e] transition-colors hover:border-[#c8a96e]"
              >
                Enquire as Investor
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.85, delay: 0.1 }}
            >
              <div className="mb-8 flex items-start justify-between border-t border-[#c8a96e]/40 pt-8">
                <h3 className="font-[family-name:var(--font-cormorant)] text-3xl font-light text-[#1f1a17]">For Owner-Occupiers</h3>
                <span className="tabular-nums text-sm text-[#8a7b6d]">02</span>
              </div>
              <p className="mb-8 text-[13px] font-light leading-[2] text-[#5a4a3f]">
                Buying your own home is one of the most significant decisions you will make.
                PPM gives you access to quality developments before they reach the broader
                market, with independent guidance throughout — from shortlisting and contract
                review through to settlement. We work for you, not the developer.
              </p>
              <ul className="mb-12 space-y-4 text-[13px] text-[#2a1f1a]">
                {[
                  'New builds and off-the-plan apartments and townhouses',
                  "Lock in today's price — settle on completion",
                  'New build warranty on all fixtures and fittings',
                  'Modern energy ratings and high-spec inclusions',
                  'Guided support from enquiry through to settlement',
                ].map((item) => (
                  <li key={item} className="flex gap-4">
                    <span className="shrink-0 text-[#c8a96e]">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact/buyers-investors"
                className="border-b border-[#c8a96e]/60 pb-1 text-[11px] uppercase tracking-[0.22em] text-[#c8a96e] transition-colors hover:border-[#c8a96e]"
              >
                Enquire as Owner-Occupier
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[#1e1a15] py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mb-16 flex items-end justify-between">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.32em] text-neutral-500">Featured &amp; Current</p>
              <h2 className="font-[family-name:var(--font-cormorant)] text-4xl font-light text-white md:text-5xl">
                Available Projects
              </h2>
            </div>
            <Link
              href="/contact/buyers-investors"
              className="hidden border-b border-neutral-700 pb-1 text-[10px] uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:border-white hover:text-white sm:inline-block"
            >
              Register Interest
            </Link>
          </div>

          <div className="grid gap-x-12 gap-y-20 sm:grid-cols-2">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                  />

                  <div className="absolute left-4 top-4">
                    <span className={[
                      'px-3 py-1 text-[9px] font-medium uppercase tracking-[0.2em]',
                      getPropertyInterestBadgeClass(project.propertyInterest),
                    ].join(' ')}>
                      {getPropertyInterestLabel(project.propertyInterest)}
                    </span>
                  </div>

                  <div className="absolute right-4 top-4">
                    <div className={[
                      'px-3 py-1 text-[9px] font-medium uppercase tracking-[0.2em]',
                      project.status === 'Current'
                        ? 'bg-[#c8a96e] text-[#0a0806]'
                        : 'bg-black/60 text-[#c8a96e] border border-[#c8a96e]/40 backdrop-blur-sm',
                    ].join(' ')}>
                      {project.status}
                    </div>
                  </div>
                </div>

                <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-neutral-500">
                  {project.suburb}, {project.state}&nbsp;·&nbsp;{project.type}
                </p>
                <h3 className="mb-4 font-[family-name:var(--font-cormorant)] text-3xl font-light text-white">
                  {project.name}
                </h3>
                <div className="mb-5 flex gap-6 text-[11px] uppercase tracking-wider text-neutral-400">
                  <span>{project.bedrooms} bed</span>
                  <span>{project.priceFrom}</span>
                </div>
                <p className="mb-8 line-clamp-2 text-[13px] leading-[1.9] text-neutral-500">
                  {project.description}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex-1 border border-neutral-700 py-3 text-[10px] uppercase tracking-[0.18em] text-neutral-400 transition-colors hover:border-neutral-400 hover:text-white"
                  >
                    View Details
                  </button>
                  <Link
                    href="/contact/buyers-investors"
                    className="flex-1 border border-[#c8a96e] py-3 text-center text-[10px] uppercase tracking-[0.18em] text-[#c8a96e] transition-colors hover:bg-[#c8a96e] hover:text-[#0a0806]"
                  >
                    Enquire
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-[#2f2a24] px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9 }}
        >
          <p className="mb-6 text-[10px] uppercase tracking-[0.34em] text-neutral-500">Ready to Begin?</p>
          <h2 className="mb-8 font-[family-name:var(--font-cormorant)] text-4xl font-light text-white md:text-5xl">
            Start your property search with PPM.
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-[14px] font-light leading-[2] text-neutral-400">
            Register your interest and one of our advisers will be in touch to discuss
            your goals, budget, and the opportunities currently available.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/contact/buyers-investors"
              className="border border-[#c8a96e] px-8 py-4 text-[11px] uppercase tracking-[0.18em] text-[#c8a96e] transition-colors hover:bg-[#c8a96e] hover:text-[#0a0806]"
            >
              Register Interest
            </Link>
            <Link
              href="/about"
              className="border border-neutral-700 px-8 py-4 text-[11px] uppercase tracking-[0.18em] text-[#8a7b6d] transition-colors hover:border-neutral-500 hover:text-neutral-200"
            >
              About PPM
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />

      {selectedProject && (
        <ProjectDetailPanel
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </main>
  )
}