'use client'
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { projects, type Project } from '@/lib/projects-data'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

// ─── Detail slide-over ────────────────────────────────────────────────────────
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { projects, type Project } from '@/lib/projects-data'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

// ─── Detail slide-over ────────────────────────────────────────────────────────

function ProjectDetailPanel({ project, onClose }: { project: Project; onClose: () => void }) {
function ProjectDetailPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <aside className="fixed inset-y-0 right-0 z-40 flex w-full max-w-lg flex-col overflow-y-auto bg-[#0f0c0a] border-l border-white/[0.08] shadow-2xl">

      {/* Backdrop */}
      <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <aside className="fixed inset-y-0 right-0 z-40 flex w-full max-w-lg flex-col overflow-y-auto bg-[#0f0c0a] border-l border-white/[0.08] shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] px-8 py-7">
        <div className="flex items-start justify-between border-b border-white/[0.08] px-8 py-7">
          <div>
            <p className="text-[9px] uppercase tracking-[0.28em] text-[#6b5e54]">
              {project.suburb}, {project.state}&nbsp;·&nbsp;{project.type}
            <p className="text-[9px] uppercase tracking-[0.28em] text-[#6b5e54]">
              {project.suburb}, {project.state}&nbsp;·&nbsp;{project.type}
            </p>
            <h2 className={`${cormorant.className} mt-2 text-[1.85rem] font-light text-white leading-tight`}>
            <h2 className={`${cormorant.className} mt-2 text-[1.85rem] font-light text-white leading-tight`}>
              {project.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="mt-1 p-1.5 text-[#4a3f37] hover:text-white transition"
            className="mt-1 p-1.5 text-[#4a3f37] hover:text-white transition"
            aria-label="Close"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-8 px-8 py-8">

        <div className="flex flex-1 flex-col gap-8 px-8 py-8">

          {/* Image */}
          <div className="overflow-hidden">
            <img src={project.image} alt={project.name} className="h-56 w-full object-cover" />
          <div className="overflow-hidden">
            <img src={project.image} alt={project.name} className="h-56 w-full object-cover" />
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Bedrooms',  value: project.bedrooms  },
              { label: 'Price',     value: project.priceFrom },
              { label: 'Status',    value: project.status    },
              { label: 'Bedrooms',  value: project.bedrooms  },
              { label: 'Price',     value: project.priceFrom },
              { label: 'Status',    value: project.status    },
            ].map((s) => (
              <div key={s.label} className="border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-center">
                <p className="text-[9px] uppercase tracking-[0.22em] text-[#6b5e54]">{s.label}</p>
                <p className="mt-2 text-[13px] font-medium text-neutral-200">{s.value}</p>
              <div key={s.label} className="border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-center">
                <p className="text-[9px] uppercase tracking-[0.22em] text-[#6b5e54]">{s.label}</p>
                <p className="mt-2 text-[13px] font-medium text-neutral-200">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Amber rule */}
          <div className="h-px bg-gradient-to-r from-[#c8a96e]/50 via-[#c8a96e]/20 to-transparent" />

          {/* Amber rule */}
          <div className="h-px bg-gradient-to-r from-[#c8a96e]/50 via-[#c8a96e]/20 to-transparent" />

          {/* Description */}
          <section>
            <p className="mb-4 text-[9px] uppercase tracking-[0.26em] text-[#6b5e54]">About This Project</p>
            <p className="text-[13px] leading-[2] text-[#8a7b6d]">{project.description}</p>
            <p className="mb-4 text-[9px] uppercase tracking-[0.26em] text-[#6b5e54]">About This Project</p>
            <p className="text-[13px] leading-[2] text-[#8a7b6d]">{project.description}</p>
          </section>

          <div className="h-px bg-white/[0.06]" />
          <div className="h-px bg-white/[0.06]" />

          {/* Highlights */}
          <section>
            <p className="mb-4 text-[9px] uppercase tracking-[0.26em] text-[#6b5e54]">Key Highlights</p>
            <ul className="space-y-3">
            <p className="mb-4 text-[9px] uppercase tracking-[0.26em] text-[#6b5e54]">Key Highlights</p>
            <ul className="space-y-3">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-[13px] text-[#9e8d7a]">
                  <span className="mt-[7px] h-1 w-1 shrink-0 bg-[#c8a96e]" />
                <li key={h} className="flex items-start gap-3 text-[13px] text-[#9e8d7a]">
                  <span className="mt-[7px] h-1 w-1 shrink-0 bg-[#c8a96e]" />
                  {h}
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <Link
            href="/contact"
            className="mt-2 flex w-full items-center justify-center border border-[#c8a96e] px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c8a96e] transition hover:bg-[#c8a96e] hover:text-[#0a0806]"
            className="mt-2 flex w-full items-center justify-center border border-[#c8a96e] px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c8a96e] transition hover:bg-[#c8a96e] hover:text-[#0a0806]"
          >
            Enquire About This Project
          </Link>
        </div>
      </aside>
    </>
  )
  )
}

// ─── Project card ─────────────────────────────────────────────────────────────
// ─── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, onViewDetails }: { project: Project; onViewDetails: (p: Project) => void }) {
function ProjectCard({ project, onViewDetails }: { project: Project; onViewDetails: (p: Project) => void }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="group flex flex-col border-t border-white/[0.08] bg-transparent"
    >
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="group flex flex-col border-t border-white/[0.08] bg-transparent"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={project.image}
          alt={project.name}
          className="h-56 w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          className="h-56 w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        {/* Status badge */}
        <span className={[
          'absolute right-4 top-4 px-3 py-1 text-[9px] font-medium uppercase tracking-[0.2em]',
          project.status === 'Current'
            ? 'bg-[#c8a96e] text-[#0a0806]'
            : 'bg-white/10 text-[#c8a96e] border border-[#c8a96e]/40 backdrop-blur-sm',
        ].join(' ')}>
        {/* Status badge */}
        <span className={[
          'absolute right-4 top-4 px-3 py-1 text-[9px] font-medium uppercase tracking-[0.2em]',
          project.status === 'Current'
            ? 'bg-[#c8a96e] text-[#0a0806]'
            : 'bg-white/10 text-[#c8a96e] border border-[#c8a96e]/40 backdrop-blur-sm',
        ].join(' ')}>
          {project.status}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col pt-6 pb-8">
        <p className="text-[9px] uppercase tracking-[0.24em] text-[#6b5e54]">
          {project.suburb}, {project.state}&nbsp;·&nbsp;{project.type}
      <div className="flex flex-1 flex-col pt-6 pb-8">
        <p className="text-[9px] uppercase tracking-[0.24em] text-[#6b5e54]">
          {project.suburb}, {project.state}&nbsp;·&nbsp;{project.type}
        </p>
        <h3 className={`${cormorant.className} mt-2.5 text-[1.7rem] font-light leading-tight text-neutral-100 transition group-hover:text-white`}>
        <h3 className={`${cormorant.className} mt-2.5 text-[1.7rem] font-light leading-tight text-neutral-100 transition group-hover:text-white`}>
          {project.name}
        </h3>

        <div className="mt-3 flex gap-5 text-[11px] text-[#6b5e54]">
          <span><span className="text-neutral-400">{project.bedrooms}</span> bed</span>
          <span className="text-neutral-400">{project.priceFrom}</span>
        <div className="mt-3 flex gap-5 text-[11px] text-[#6b5e54]">
          <span><span className="text-neutral-400">{project.bedrooms}</span> bed</span>
          <span className="text-neutral-400">{project.priceFrom}</span>
        </div>

        <p className="mt-4 flex-1 text-[12.5px] leading-[1.9] text-[#6b5e54] line-clamp-2">
        <p className="mt-4 flex-1 text-[12.5px] leading-[1.9] text-[#6b5e54] line-clamp-2">
          {project.description}
        </p>

        <div className="mt-7 flex gap-3">
        <div className="mt-7 flex gap-3">
          <button
            onClick={() => onViewDetails(project)}
            className="flex-1 border border-white/[0.12] px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#8a7b6d] transition hover:border-white/30 hover:text-neutral-200"
            className="flex-1 border border-white/[0.12] px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#8a7b6d] transition hover:border-white/30 hover:text-neutral-200"
          >
            View Details
          </button>
          <Link
            href="/contact"
            className="flex-1 border border-[#c8a96e] px-4 py-2.5 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-[#c8a96e] transition hover:bg-[#c8a96e] hover:text-[#0a0806]"
            className="flex-1 border border-[#c8a96e] px-4 py-2.5 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-[#c8a96e] transition hover:bg-[#c8a96e] hover:text-[#0a0806]"
          >
            Enquire
          </Link>
        </div>
      </div>
    </motion.article>
  )
    </motion.article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuyersPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <main className="w-full min-h-screen bg-[#0a0806] text-neutral-200">
    <main className="w-full min-h-screen bg-[#0a0806] text-neutral-200">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="pt-44 pb-16 px-8 md:px-14 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <p className="text-[10px] uppercase tracking-[0.36em] text-[#6b5e54] mb-4">For Buyers</p>
          <div className="grid md:grid-cols-[3fr_2fr] gap-12 md:items-end">
            <h1 className={`${cormorant.className} text-5xl md:text-6xl lg:text-[4.2rem] font-light leading-[1.1] text-white`}>
              Find your next<br />
              <em className="italic text-[#c8a96e]">Melbourne</em> property.
            </h1>
            <p className="text-[13.5px] leading-[2] text-[#8a7b6d] md:pb-2">
              Whether you are building an investment portfolio or searching
              for your first home, we source, guide, and support you through
              every step of the buying process.
            </p>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="pt-44 pb-16 px-8 md:px-14 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <p className="text-[10px] uppercase tracking-[0.36em] text-[#6b5e54] mb-4">For Buyers</p>
          <div className="grid md:grid-cols-[3fr_2fr] gap-12 md:items-end">
            <h1 className={`${cormorant.className} text-5xl md:text-6xl lg:text-[4.2rem] font-light leading-[1.1] text-white`}>
              Find your next<br />
              <em className="italic text-[#c8a96e]">Melbourne</em> property.
            </h1>
            <p className="text-[13.5px] leading-[2] text-[#8a7b6d] md:pb-2">
              Whether you are building an investment portfolio or searching
              for your first home, we source, guide, and support you through
              every step of the buying process.
            </p>
          </div>
          <div className="mt-10 h-px w-full bg-neutral-800" />
        </motion.div>
          <div className="mt-10 h-px w-full bg-neutral-800" />
        </motion.div>
      </section>

      {/* ── Who we work with ─────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-20 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#6b5e54] mb-16">Who We Work With</p>

          <div className="grid md:grid-cols-2 gap-px bg-white/[0.06]">
      {/* ── Who we work with ─────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-20 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#6b5e54] mb-16">Who We Work With</p>

          <div className="grid md:grid-cols-2 gap-px bg-white/[0.06]">
            {/* Investors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85 }}
              className="bg-[#0a0806] p-10 md:p-12"
            >
              <span className="text-[9px] uppercase tracking-[0.28em] text-[#c8a96e] mb-6 block">01</span>
              <h2 className={`${cormorant.className} text-[2rem] font-light text-white mb-5`}>For Investors</h2>
              <p className="text-[13px] leading-[2] text-[#8a7b6d] mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85 }}
              className="bg-[#0a0806] p-10 md:p-12"
            >
              <span className="text-[9px] uppercase tracking-[0.28em] text-[#c8a96e] mb-6 block">01</span>
              <h2 className={`${cormorant.className} text-[2rem] font-light text-white mb-5`}>For Investors</h2>
              <p className="text-[13px] leading-[2] text-[#8a7b6d] mb-8">
                PPM provides access to off-the-plan and established investment
                opportunities across Melbourne, selected for yield potential,
                capital growth fundamentals, and developer quality. Our
                end-to-end model means we source your property, manage it,
                and advise on the right time to resell — all under one roof.
                end-to-end model means we source your property, manage it,
                and advise on the right time to resell — all under one roof.
              </p>
              <ul className="space-y-3">
              <ul className="space-y-3">
                {[
                  'Access to exclusive off-the-plan developments',
                  'Independent advice — not tied to any single developer',
                  'FIRB guidance for overseas buyers',
                  'Portfolio management via Online Property Services',
                  'Resale timing and reinvestment strategy advice',
                  'Access to exclusive off-the-plan developments',
                  'Independent advice — not tied to any single developer',
                  'FIRB guidance for overseas buyers',
                  'Portfolio management via Online Property Services',
                  'Resale timing and reinvestment strategy advice',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[12.5px] text-[#8a7b6d]">
                    <span className="mt-[8px] h-px w-3 shrink-0 bg-[#c8a96e]" />
                  <li key={item} className="flex items-start gap-3 text-[12.5px] text-[#8a7b6d]">
                    <span className="mt-[8px] h-px w-3 shrink-0 bg-[#c8a96e]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            </motion.div>

            {/* Owner-Occupiers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.1 }}
              className="bg-[#0a0806] p-10 md:p-12"
            >
              <span className="text-[9px] uppercase tracking-[0.28em] text-[#c8a96e] mb-6 block">02</span>
              <h2 className={`${cormorant.className} text-[2rem] font-light text-white mb-5`}>For Owner-Occupiers</h2>
              <p className="text-[13px] leading-[2] text-[#8a7b6d] mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.1 }}
              className="bg-[#0a0806] p-10 md:p-12"
            >
              <span className="text-[9px] uppercase tracking-[0.28em] text-[#c8a96e] mb-6 block">02</span>
              <h2 className={`${cormorant.className} text-[2rem] font-light text-white mb-5`}>For Owner-Occupiers</h2>
              <p className="text-[13px] leading-[2] text-[#8a7b6d] mb-8">
                Buying your own home is one of the most significant decisions
                you will make. PPM gives you access to quality developments
                before they reach the broader market, with independent guidance
                throughout — from shortlisting and contract review through to
                settlement. We work for you, not the developer.
                throughout — from shortlisting and contract review through to
                settlement. We work for you, not the developer.
              </p>
              <ul className="space-y-3">
              <ul className="space-y-3">
                {[
                  'New builds and off-the-plan apartments and townhouses',
                  'Lock in today\'s price — settle on completion',
                  'New build warranty on all fixtures and fittings',
                  'Modern energy ratings and high-spec inclusions',
                  'Guided support from enquiry through to settlement',
                  'New builds and off-the-plan apartments and townhouses',
                  'Lock in today\'s price — settle on completion',
                  'New build warranty on all fixtures and fittings',
                  'Modern energy ratings and high-spec inclusions',
                  'Guided support from enquiry through to settlement',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[12.5px] text-[#8a7b6d]">
                    <span className="mt-[8px] h-px w-3 shrink-0 bg-[#c8a96e]" />
                  <li key={item} className="flex items-start gap-3 text-[12.5px] text-[#8a7b6d]">
                    <span className="mt-[8px] h-px w-3 shrink-0 bg-[#c8a96e]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Projects ─────────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-24 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
      {/* ── Projects ─────────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-24 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#6b5e54] mb-3">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#6b5e54] mb-3">
                Featured &amp; Current
              </p>
              <h2 className={`${cormorant.className} text-[2.2rem] font-light text-white`}>
                Available Projects
              <h2 className={`${cormorant.className} text-[2.2rem] font-light text-white`}>
                Available Projects
              </h2>
            </div>
            <Link
              href="/contact"
              className="hidden sm:inline-block border border-white/[0.12] px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-[#8a7b6d] transition hover:border-[#c8a96e] hover:text-[#c8a96e]"
              className="hidden sm:inline-block border border-white/[0.12] px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-[#8a7b6d] transition hover:border-[#c8a96e] hover:text-[#c8a96e]"
            >
              Register Interest
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewDetails={setSelectedProject}
              />
            ))}
          </div>
        </div>
      </section>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] py-28 px-8 md:px-14">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="grid md:grid-cols-[3fr_2fr] gap-12 md:items-center"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.34em] text-[#6b5e54] mb-5">
                Ready to Begin?
              </p>
              <h2 className={`${cormorant.className} text-4xl md:text-5xl font-light text-white leading-snug mb-6`}>
                Start your property search with PPM.
              </h2>
              <p className="text-[13.5px] leading-[2] text-[#8a7b6d] max-w-[48ch]">
                Register your interest and one of our advisers will be in touch
                to discuss your goals, budget, and the opportunities currently
                available.
              </p>
            </div>
            <div className="flex flex-col gap-4 md:items-start">
              <Link
                href="/contact"
                className="border border-[#c8a96e] px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c8a96e] transition hover:bg-[#c8a96e] hover:text-[#0a0806]"
              >
                Register Interest
              </Link>
              <Link
                href="/about"
                className="border border-neutral-800 px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a7b6d] transition hover:border-neutral-600 hover:text-neutral-200"
              >
                About PPM
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] py-28 px-8 md:px-14">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="grid md:grid-cols-[3fr_2fr] gap-12 md:items-center"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.34em] text-[#6b5e54] mb-5">
                Ready to Begin?
              </p>
              <h2 className={`${cormorant.className} text-4xl md:text-5xl font-light text-white leading-snug mb-6`}>
                Start your property search with PPM.
              </h2>
              <p className="text-[13.5px] leading-[2] text-[#8a7b6d] max-w-[48ch]">
                Register your interest and one of our advisers will be in touch
                to discuss your goals, budget, and the opportunities currently
                available.
              </p>
            </div>
            <div className="flex flex-col gap-4 md:items-start">
              <Link
                href="/contact"
                className="border border-[#c8a96e] px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c8a96e] transition hover:bg-[#c8a96e] hover:text-[#0a0806]"
              >
                Register Interest
              </Link>
              <Link
                href="/about"
                className="border border-neutral-800 px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a7b6d] transition hover:border-neutral-600 hover:text-neutral-200"
              >
                About PPM
              </Link>
            </div>
          </motion.div>
        </div>
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
  )
}