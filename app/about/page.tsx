'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import OverseasReachSection from '../components/OverseasReachSection'

const FloatingDust = dynamic(() => import('../components/FloatingDust'), {
  ssr: false,
  loading: () => null,
})

// ─── Page data ──────────────────────────────────────────────────────────────

const cycleSteps = [
  {
    step: '01',
    title: 'Source',
    description:
      'We identify and curate the finest off-the-plan developments across Melbourne — from boutique townhouses to high-rise apartments.',
  },
  {
    step: '02',
    title: 'Buy',
    description:
      'We match you to the right property, organise display suite visits, and guide you through purchase. Our fee is paid by the developer — not by you.',
  },
  {
    step: '03',
    title: 'Manage',
    description:
      'Through our sister division Online Property Services, we steward your residential asset as a premium portfolio — maximising returns, not just collecting rent.',
  },
  {
    step: '04',
    title: 'Maximise',
    description:
      'We actively protect and grow the value of your investment, keeping you informed and consistently ahead of the market.',
  },
  {
    step: '05',
    title: 'Resell',
    description:
      'When the time is right, we leverage deep market knowledge to appraise and resell your property — achieving the best possible outcome.',
  },
  {
    step: '06',
    title: 'Reinvest',
    description:
      'We identify your next opportunity, keeping your capital working and your portfolio growing for the long term.',
  },
]

const developerServices = [
  'Project Marketing & Sales Management',
  'Independent Sales Agency & Qualified Buyer Network',
  'Feasibility & Pricing Strategy Advisory',
  'Campaign Reporting & Settlement Support',
]

const featuredProjects = [
  { location: 'Southbank, Melbourne', type: 'High-Rise Apartments',    status: 'Sold Out' },
  { location: 'Richmond, Melbourne',  type: 'Boutique Townhouses',      status: 'Sold Out' },
  { location: 'Docklands, Melbourne', type: 'Mixed-Use Residential',    status: 'Sold Out' },
]

const team = [
  {
    name: 'Ned Gerrard',
    role: 'Co-Founder & Director',
    bio: 'With a background in management consulting, accounting, and marketing, Ned brings strategic discipline to every engagement — from developer feasibility to long-term client strategy. He built PPM into Melbourne\'s silent engine for over a decade before bringing the brand to market.',
  },
  {
    name: 'Joan Alcock',
    role: 'Director & Officer in Effective Control',
    bio: 'Ranked nationally in the Top 2% of sales professionals, Joan holds the agency licence and leads all client relationships. Multi-award winning, her approach is direct, experienced, and entirely client-first.',
  },
]

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full text-[#1f1a17]">
      <Navbar />

      {/* ── S1: Opening Statement ─────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden">
        <FloatingDust />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">
              Who We Are
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">
              Est. 2013
            </p>
          </div>

          <div className="mt-8 border-t border-[#3a302a] pt-12 lg:pt-16">
            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-light leading-[1.06] text-white max-w-4xl">
              The trusted name behind<br />
              Melbourne&apos;s most significant<br />
              <span className="text-[#c8a96e]">residential developments.</span>
            </h1>
          </div>

          <div className="mt-16 flex items-center gap-4 text-[10px] uppercase tracking-[0.26em] text-[#4a3f37]">
            <span className="block h-px w-10 bg-[#3a302a]" />
            <span>Our Story</span>
          </div>
        </div>
      </section>

      {/* ── S2: Brand Story ───────────────────────────────────────────────── */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid lg:grid-cols-[5fr_7fr] gap-16 lg:gap-24 lg:items-start">

            {/* Pull quote */}
            <div className="border-l-2 border-[#ddd3c6] pl-8 lg:pl-10 pt-1">
              <p className="text-2xl lg:text-[1.85rem] font-light italic text-[#1f1a17] leading-snug">
                &ldquo;For over a decade,<br />we were<br />the silent engine.&rdquo;
              </p>
            </div>

            {/* Body */}
            <div className="space-y-5 text-[14px] leading-[1.95] text-[#3d3530]">
              <p>
                Property Project Marketing Pty Ltd (PPM) was founded in April 2013 and for
                over a decade operated invisibly behind Melbourne&apos;s major residential
                developers — delivering more than{' '}
                <strong className="text-[#1f1a17] font-medium">$1.5 billion</strong> in
                off-the-plan property sales with zero public presence.
              </p>
              <p className="font-medium text-[#1f1a17]">We are now changing that.</p>
              <p>
                After years of working exclusively under developers&apos; names, we are
                bringing that same expertise directly to buyers, investors, and developers
                who want a trusted, end-to-end partner for the full investment lifecycle.
              </p>
              <p>
                Our approach goes far beyond a transaction. We source, sell, manage, and
                resell — a closed-loop service that keeps working for you long after
                settlement.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── S3: The Numbers ───────────────────────────────────────────────── */}
      <section className="bg-[#f6f2eb] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-8">
          <div className="flex flex-col sm:flex-row sm:divide-x divide-[#ddd3c6]">
            {[
              { value: '$1.5B+', label: 'In Delivered Sales' },
              { value: '$50M+',  label: 'Assets Under Management' },
              { value: '10+',    label: 'Years of Industry Experience' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex-1 py-10 sm:py-0 sm:px-12 first:sm:pl-0 last:sm:pr-0 border-b sm:border-b-0 border-[#ddd3c6] last:border-b-0"
              >
                <p className="text-6xl md:text-7xl lg:text-8xl font-light tracking-[-0.03em] text-[#1f1a17] tabular-nums">
                  {stat.value}
                </p>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#8a7b6d] mt-4">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-[#ddd3c6] mt-14" />
        </div>
      </section>

      {/* ── S4: The Approach ──────────────────────────────────────────────── */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-8">

          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 mb-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b6d]">
              Our Approach
            </p>
            <h2 className="text-2xl lg:text-3xl font-light text-[#1f1a17]">
              The End-to-End Model
            </h2>
          </div>

          <div className="border-l-2 border-[#ddd3c6] pl-8 lg:pl-14">
            {cycleSteps.map((step) => (
              <div
                key={step.step}
                className="grid grid-cols-[2.5rem_1fr] lg:grid-cols-[2.5rem_11rem_1fr] gap-x-6 lg:gap-x-10 gap-y-1 py-9 border-b border-[#f0ebe4] last:border-b-0"
              >
                <p className="text-[2.6rem] font-thin text-[#e0d8d0] tabular-nums leading-none select-none row-span-2 lg:row-span-1 self-center">
                  {step.step}
                </p>
                <p className="text-[15px] font-semibold text-[#1f1a17] self-center">
                  {step.title}
                </p>
                <p className="col-start-2 lg:col-start-3 text-[13px] leading-[1.85] text-[#5b5147] max-w-[54ch]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── S5: Globe (overseas investors) ────────────────────────────────── */}
      <OverseasReachSection />

      {/* ── S6: The People ────────────────────────────────────────────────── */}
      <section className="bg-[#f6f2eb]">
        <div className="mx-auto max-w-7xl px-8 pt-24 pb-0">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b6d]">
            The People
          </p>
          <h2 className="mt-3 text-3xl lg:text-4xl font-light text-[#1f1a17]">
            Our Leadership
          </h2>
        </div>

        {team.map((member, i) => (
          <div
            key={member.name}
            className="grid lg:grid-cols-2 mt-14 border-t border-[#ddd3c6] first:mt-10"
          >
            {/* Portrait placeholder — image bleeds edge-to-edge, no border-radius */}
            <div
              className={`relative min-h-[360px] lg:min-h-[480px] bg-[#e4dbd1] overflow-hidden ${
                i % 2 === 1 ? 'lg:order-2' : ''
              }`}
            >
              {/* Replace this div contents with <img> when client supplies photos */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ddd3c6]/40 to-[#c8b8a8]/20" />
              <div className="absolute bottom-6 left-6">
                <span className="text-[10px] uppercase tracking-widest text-[#b5a899]">
                  Portrait — {member.name}
                </span>
              </div>
            </div>

            {/* Text */}
            <div
              className={`flex flex-col justify-center px-8 py-14 lg:px-14 xl:px-20 ${
                i % 2 === 1 ? 'lg:order-1' : ''
              }`}
            >
              <h3 className="text-[22px] font-light text-[#1f1a17]">{member.name}</h3>
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.26em] text-[#8a7b6d]">
                {member.role}
              </p>
              <div className="mt-5 w-8 border-t border-[#ddd3c6]" />
              <p className="mt-6 text-[13px] leading-[1.95] text-[#3d3530] max-w-[44ch]">
                {member.bio}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ── S7: For Developers (dark) ─────────────────────────────────────── */}
      <section className="bg-[#2f2a24] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid lg:grid-cols-[5fr_7fr] gap-16 lg:gap-24 lg:items-start">

            {/* Heading */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b6d] mb-6">
                Developer Services
              </p>
              <h2 className="text-3xl lg:text-[2.75rem] font-light leading-[1.2] text-white">
                The team behind Melbourne&apos;s most successful launches.
              </h2>
            </div>

            {/* Body + service list */}
            <div>
              <div className="space-y-5 text-[14px] leading-[1.9] text-[#9e8d7a]">
                <p>
                  For over a decade, PPM was the silent force behind some of
                  Melbourne&apos;s most significant residential projects — managing
                  campaigns from launch strategy to final settlement, with no public
                  credit taken.
                </p>
                <p>
                  We now offer that same capability directly. An independent agency
                  with a qualified buyer network spanning local owner-occupiers, local
                  investors, and overseas investors across Asia-Pacific — with
                  transparent reporting from day one.
                </p>
              </div>

              <div className="mt-12">
                {developerServices.map((service) => (
                  <div key={service} className="py-5 border-t border-[#3d3530]">
                    <p className="text-[13px] tracking-[0.05em] text-[#9e8d7a]">
                      {service}
                    </p>
                  </div>
                ))}
                <div className="border-t border-[#3d3530]" />
              </div>

              <div className="mt-10">
                <Link
                  href="/contact"
                  className="inline-block border border-white px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-[#2f2a24]"
                >
                  Partner With Us
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── S8: Track Record ──────────────────────────────────────────────── */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b6d]">
            Our Track Record
          </p>
          <h2 className="mt-6 text-4xl lg:text-6xl font-light leading-[1.1] text-[#1f1a17] max-w-3xl">
            $1.5 billion delivered across Southbank&nbsp;&middot; Docklands&nbsp;&middot; Richmond and beyond.
          </h2>

          <div className="mt-16">
            {featuredProjects.map((project) => (
              <div
                key={project.location}
                className="grid grid-cols-2 sm:grid-cols-3 py-5 border-t border-[#f0ebe4] text-[13px] text-[#5b5147]"
              >
                <span>{project.location}</span>
                <span className="hidden sm:block">{project.type}</span>
                <span className="text-right sm:text-right">{project.status}</span>
              </div>
            ))}
            <div className="border-t border-[#f0ebe4]" />
          </div>

          <p className="mt-8 text-[12px] italic text-[#8a7b6d]">
            Further project detail will be published as our brand launches publicly.
          </p>
        </div>
      </section>

      {/* ── S9: Closing CTA ───────────────────────────────────────────────── */}
      <section className="bg-[#1c1814] py-32 lg:py-44">
        <div className="mx-auto max-w-7xl px-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#4a3f37]">
            Next Steps
          </p>
          <h2 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-light text-white leading-[1.06]">
            Ready to begin?
          </h2>
          <p className="mt-6 text-[14px] text-[#8a7b6d] max-w-[40ch] mx-auto leading-[1.9]">
            Whether you are a buyer, investor, or developer — the conversation starts here.
          </p>
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-10">
            <Link
              href="/contact"
              className="text-[12px] uppercase tracking-[0.22em] text-white border-b border-white/25 pb-0.5 transition hover:border-white"
            >
              I am a Buyer or Investor →
            </Link>
            <Link
              href="/contact"
              className="text-[12px] uppercase tracking-[0.22em] text-white border-b border-white/25 pb-0.5 transition hover:border-white"
            >
              I am a Developer →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
