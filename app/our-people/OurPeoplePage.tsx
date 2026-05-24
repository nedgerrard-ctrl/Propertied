'use client'
import dynamic from 'next/dynamic'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { OurPeopleContentData } from '@/lib/our-people-defaults'

const FloatingDust = dynamic(() => import('../components/FloatingDust'), {
  ssr: false,
  loading: () => null,
})

type Person = {
  name: string
  title: string
  bios: string[]
}

export default function OurPeoplePage({ content }: { content: OurPeopleContentData }) {
  const c = content

  const people: Person[] = [
    {
      name: c.person1Name,
      title: c.person1Title,
      bios: [c.person1Bio1, c.person1Bio2].filter(Boolean),
    },
    {
      name: c.person2Name,
      title: c.person2Title,
      bios: [c.person2Bio1, c.person2Bio2, c.person2Bio3].filter(Boolean),
    },
    {
      name: c.person3Name,
      title: c.person3Title,
      bios: [c.person3Bio1, c.person3Bio2].filter(Boolean),
    },
    {
      name: c.person4Name,
      title: c.person4Title,
      bios: [c.person4Bio1, c.person4Bio2].filter(Boolean),
    },
  ]

  return (
    <main className="min-h-screen w-full text-[#1f1a17]">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden">
        <FloatingDust />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">
              Our People
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">
              The Team
            </p>
          </div>

          <div className="mt-8 border-t border-[#3a302a] pt-12 lg:pt-16">
            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-light leading-[1.06] text-white max-w-4xl">
              {c.heroHeadingMain}
              <br />
              <span className="text-[#c8a96e]">{c.heroHeadingAccent}</span>
            </h1>
          </div>

          <p className="mt-8 max-w-[48ch] text-[14px] leading-[1.9] text-[#8a7b6d]">
            {c.heroSubtext}
          </p>

          <div className="mt-20 flex items-center gap-4 text-[10px] uppercase tracking-[0.26em] text-[#4a3f37]">
            <span className="block h-px w-10 bg-[#3a302a]" />
            <span>Meet The Team</span>
          </div>
        </div>
      </section>

      {/* ── People ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-8">
          <div className="divide-y divide-[#ede8e1]">
            {people.map((person) => (
              <div key={person.name} className="py-14 first:pt-0 last:pb-0">
                <div className="mb-6">
                  <h2 className="text-[1.5rem] font-semibold text-[#1f1a17] leading-snug">
                    {person.name}
                    <span className="mx-3 text-[#ddd3c6] font-light">—</span>
                    <span className="text-[#4a3d35] font-normal">{person.title}</span>
                  </h2>
                  <div className="mt-3 w-10 h-px bg-[#c8a96e]" />
                </div>
                <div className="space-y-4">
                  {person.bios.map((bio, i) => (
                    <p key={i} className="text-[14px] leading-[1.85] text-[#3d3530]">
                      {bio}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
