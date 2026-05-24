'use client'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ResourcesContentData, ResourceItem } from '@/lib/resources-defaults'

// ── Download icon ──────────────────────────────────────────────────────────────
function DownloadIcon() {
  return (
    <svg
      className="ml-2 inline-block h-3.5 w-3.5 shrink-0 align-middle"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v8M5 7l3 3 3-3" />
      <path d="M2 13h12" />
    </svg>
  )
}

// ── Resource item renderer ─────────────────────────────────────────────────────
function ResourceItemRow({ item }: { item: ResourceItem }) {
  if (item.fileUrl) {
    return (
      <li>
        <a
          href={item.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          download={item.fileName || undefined}
          className="group inline-flex items-baseline gap-0 text-[13px] leading-relaxed text-[#2f2a24] underline underline-offset-2 decoration-[#c8a96e]/40 transition hover:text-[#c8a96e] hover:decoration-[#c8a96e]"
        >
          {item.label}
          <DownloadIcon />
        </a>
      </li>
    )
  }
  // No file uploaded yet — shown as plain muted text
  return (
    <li className="text-[13px] leading-relaxed text-[#9e8d7a]">
      {item.label}
      <span className="ml-2 text-[10px] uppercase tracking-[0.12em] text-[#c8c0b8]">
        Coming soon
      </span>
    </li>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ResourcesPage({ content }: { content: ResourcesContentData }) {
  const { heroHeadingMain, heroHeadingAccent, heroSubtext, sections, footerNote, footerEmail } =
    content

  // Only show sections that have at least a heading
  const visibleSections = sections.filter((s) => s.heading.trim())

  return (
    <main className="min-h-screen w-full bg-white text-[#1f1a17]">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">PPM</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">
              Forms &amp; Documents
            </p>
          </div>
          <div className="mt-8 border-t border-[#3a302a] pt-12 lg:pt-16">
            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-light leading-[1.06] text-white max-w-4xl">
              {heroHeadingMain}{" "}
              <span className="text-[#c8a96e]">{heroHeadingAccent}</span>
            </h1>
          </div>
          <p className="mt-8 max-w-[52ch] text-[14px] leading-[1.9] text-[#8a7b6d]">
            {heroSubtext}
          </p>
        </div>
      </section>

      {/* ── Resource sections ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-8 py-20">
        {visibleSections.length === 0 ? (
          <p className="text-sm text-[#9e8d7a]">No resources available yet.</p>
        ) : (
          <div className="space-y-14">
            {visibleSections.map((section, si) => (
              <div key={section.id}>
                {/* Section heading */}
                <div className="flex items-center gap-4 mb-7">
                  <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#c8a96e]">
                    {section.heading}
                  </span>
                  <span className="flex-1 h-px bg-[#e8e2d9]" />
                </div>

                {/* Resource list */}
                <ul className="space-y-3.5 ml-1">
                  {section.items.map((item) => (
                    <ResourceItemRow key={item.id} item={item} />
                  ))}
                  {section.items.length === 0 && (
                    <li className="text-[13px] text-[#9e8d7a] italic">
                      No items in this section yet.
                    </li>
                  )}
                </ul>

                {/* Divider between sections (not after last) */}
                {si < visibleSections.length - 1 && (
                  <div className="mt-14 h-px bg-[#f0ebe4]" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer note */}
        {(footerNote || footerEmail) && (
          <p className="mt-16 border-t border-[#e8e2d9] pt-8 text-[13px] leading-relaxed text-[#5b5147]">
            {footerNote}{" "}
            {footerEmail && (
              <a
                href={`mailto:${footerEmail}`}
                className="text-[#c8a96e] underline underline-offset-2 transition hover:text-[#b89464]"
              >
                {footerEmail}
              </a>
            )}
            {footerNote && "."}
          </p>
        )}
      </section>

      <Footer />
    </main>
  )
}
