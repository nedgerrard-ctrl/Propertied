'use client'
import dynamic from 'next/dynamic'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { PastProjectsContentData, PastProject } from '@/lib/past-projects-defaults'

const FloatingDust = dynamic(() => import('../components/FloatingDust'), {
  ssr: false,
  loading: () => null,
})

function ProjectCard({ project }: { project: PastProject }) {
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-none border border-[#ede8e1] bg-white transition-all duration-300 hover:border-[#c8a96e] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a96e]"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[#1c1814]">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#4a3f37]">
              No image
            </span>
          </div>
        )}
        {/* Gold overlay on hover */}
        <div className="absolute inset-0 bg-[#c8a96e]/0 transition-all duration-300 group-hover:bg-[#c8a96e]/10" />
        {/* External link badge */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#0f0c0a]/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#c8a96e] opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          Visit ↗
        </div>
      </div>

      {/* Info */}
      <div className="px-5 py-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold text-[#1f1a17] transition-colors group-hover:text-[#c8a96e]">
            {project.name}
          </h3>
          <svg
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#c8a96e] opacity-0 transition-opacity group-hover:opacity-100"
            viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M3 13L13 3M13 3H7M13 3v6" />
          </svg>
        </div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#8a7b6d]">
          {project.address}
        </p>
        <div className="mt-3 h-px w-6 bg-[#c8a96e] transition-all duration-300 group-hover:w-full" />
      </div>
    </a>
  )
}

export default function PastProjectsPage({
  content,
}: {
  content: PastProjectsContentData
}) {
  const c = content

  return (
    <main className="min-h-screen w-full text-[#1f1a17]">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden">
        <FloatingDust />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">
              Past Projects
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">
              A Selection of Our Work
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

          <div className="mt-20 flex items-center gap-4 text-[10px] uppercase tracking-[0.26em] text-[#4a3f37]">
            <span className="block h-px w-10 bg-[#3a302a]" />
            <span>{c.projects.length} Development{c.projects.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </section>

      {/* ── Card Grid ───────────────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-8">
          {c.projects.length === 0 ? (
            <p className="text-center text-[13px] text-[#8a7b6d]">No projects to display.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {c.projects.map((project) => (
                <ProjectCard key={project.id || project.name} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Closing text ────────────────────────────────────────────────── */}
      {c.closingText && (
        <section className="bg-[#f6f2eb] py-20 lg:py-28">
          <div className="mx-auto max-w-2xl px-8">
            <p className="text-[14px] leading-[1.95] text-[#3d3530]">
              {c.closingText}
            </p>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
