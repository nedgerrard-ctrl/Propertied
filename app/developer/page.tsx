'use client'
import { useRef, useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const FloatingDust = dynamic(() => import('../components/FloatingDust'), {
  ssr: false,
  loading: () => null,
})

// ─── Network graph data ───────────────────────────────────────────────────────

const NODES: Array<{ pos: [number, number, number]; size: number; color: string }> = [
  { pos: [0,     0,    0   ], size: 0.24, color: '#c8a96e' }, // PPM — centre
  { pos: [2.2,   0.5,  0.3 ], size: 0.14, color: '#8a7b6d' }, // Developer A
  { pos: [1.8,  -1.1,  0.7 ], size: 0.14, color: '#8a7b6d' }, // Developer B
  { pos: [2.0,   1.3, -0.6 ], size: 0.11, color: '#8a7b6d' }, // Developer C
  { pos: [-2.0,  0.8,  0.5 ], size: 0.12, color: '#a08060' }, // Buyer A
  { pos: [-1.7, -0.7,  1.0 ], size: 0.12, color: '#a08060' }, // Buyer B
  { pos: [-1.9,  0.2, -0.9 ], size: 0.12, color: '#a08060' }, // Buyer C
  { pos: [0.0,   2.0,  0.6 ], size: 0.11, color: '#9e8d7a' }, // Management
  { pos: [0.2,  -1.9, -0.4 ], size: 0.11, color: '#9e8d7a' }, // Resale
]

const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], // PPM → Developers
  [0, 4], [0, 5], [0, 6], // PPM → Buyers
  [0, 7], [0, 8],          // PPM → Management / Resale
  [7, 8],                  // Management ↔ Resale (lifecycle loop)
  [1, 4], [2, 5], [3, 6], // Developer ↔ Buyer (matched pairs)
]

// ─── Three.js sub-components ──────────────────────────────────────────────────

function NetworkNode({
  position,
  size,
  color,
  index,
}: {
  position: [number, number, number]
  size: number
  color: string
  index: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.scale.setScalar(1 + 0.12 * Math.sin(t * 1.2 + index * 0.9))
  })
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

function NetworkEdge({
  from,
  to,
  phase,
}: {
  from: [number, number, number]
  to: [number, number, number]
  phase: number
}) {
  const line = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...from),
      new THREE.Vector3(...to),
    ])
    const mat = new THREE.LineBasicMaterial({
      color: '#c8a96e',
      transparent: true,
      opacity: 0.08,
    })
    return new THREE.Line(geo, mat)
  }, [from, to])

  useEffect(
    () => () => {
      line.geometry.dispose()
      ;(line.material as THREE.Material).dispose()
    },
    [line],
  )

  useFrame(({ clock }) => {
    const mat = line.material as THREE.LineBasicMaterial
    // eslint-disable-next-line react-hooks/immutability
    mat.opacity = 0.04 + 0.18 * Math.abs(Math.sin(clock.getElapsedTime() * 0.55 + phase))
  })

  return <primitive object={line} />
}

function NetworkScene() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.11
    groupRef.current.rotation.x = Math.sin(t * 0.07) * 0.14
  })
  return (
    <group ref={groupRef}>
      {NODES.map((n, i) => (
        <NetworkNode key={i} position={n.pos} size={n.size} color={n.color} index={i} />
      ))}
      {EDGES.map(([a, b], i) => (
        <NetworkEdge
          key={i}
          from={NODES[a].pos}
          to={NODES[b].pos}
          phase={(i / EDGES.length) * Math.PI * 2}
        />
      ))}
    </group>
  )
}

// ─── Page data ────────────────────────────────────────────────────────────────

const partnershipBenefits = [
  {
    title: 'Independent third-party representation',
    description:
      'PPM is not tied to any single project or developer. We act as an independent channel partner — aligning the right developments with the right buyers.',
  },
  {
    title: 'End-to-end investor journey',
    description:
      'Our model extends beyond the initial sale. We support buyers through acquisition, ongoing portfolio management, and eventual resale.',
  },
  {
    title: 'Experienced off-the-plan specialists',
    description:
      'Rooted in off-the-plan apartments and townhouses, PPM brings practical depth in project marketing, buyer qualification, and sales progression.',
  },
]

const processSteps = [
  {
    step: '01',
    title: 'Project alignment',
    description:
      'We assess the development, target buyer profile, and market positioning before committing to representation.',
  },
  {
    step: '02',
    title: 'Project representation',
    description:
      'PPM markets your development to qualified buyers and investors on a commission basis, maintaining a premium presentation throughout.',
  },
  {
    step: '03',
    title: 'Buyer matching & progression',
    description:
      'We guide interested buyers through project discussions, display suite visits, and through to sale progression.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DevelopersPage() {
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])

  return (
    <main className="min-h-screen w-full text-[#1f1a17]">
      <Navbar />

      {/* ── S1: Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] bg-[#1c1814] flex flex-col justify-center overflow-hidden">
        <FloatingDust />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-24">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">
              For Developers
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">
              Partnership
            </p>
          </div>

          <div className="mt-8 border-t border-[#3a302a] pt-12 lg:pt-16">
            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-light leading-[1.06] text-white max-w-4xl">
              Sell your development<br />
              through Melbourne&apos;s<br />
              <span className="text-[#c8a96e]">most trusted channel.</span>
            </h1>
          </div>

          <p className="mt-8 max-w-[48ch] text-[14px] leading-[1.9] text-[#8a7b6d]">
            PPM works with developers as an independent third-party partner — connecting quality
            off-the-plan projects with qualified buyers and investors across local and overseas
            markets.
          </p>

          <div className="mt-12 flex flex-wrap gap-5">
            <Link
              href="/contact/developers"
              className="inline-flex items-center border border-[#c8a96e] px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c8a96e] transition hover:bg-[#c8a96e] hover:text-[#1c1814]"
            >
              Partner With Us
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center border border-[#3a302a] px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a7b6d] transition hover:border-[#8a7b6d] hover:text-[#c8a96e]"
            >
              About PPM
            </Link>
          </div>

          <div className="mt-20 flex items-center gap-4 text-[10px] uppercase tracking-[0.26em] text-[#4a3f37]">
            <span className="block h-px w-10 bg-[#3a302a]" />
            <span>Our Approach</span>
          </div>
        </div>
      </section>

      {/* ── S2: Network Visualisation + Copy ─────────────────────────────── */}
      <section className="relative bg-[#1e1a15] overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="grid min-h-[540px] lg:grid-cols-2">

            {/* Copy column */}
            <div className="flex flex-col justify-center px-8 py-16 lg:px-14 xl:px-16">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#9e8d7a]">
                The PPM Difference
              </p>
              <h2 className="mt-4 text-[26px] font-light leading-[1.35] text-white sm:text-[30px]">
                More than a project marketer —{' '}
                <span className="text-[#c8a96e]">a full ecosystem partner.</span>
              </h2>
              <p className="mt-5 max-w-[42ch] text-[13px] leading-[1.9] text-[#8a7b6d]">
                PPM sits at the centre of a connected network: developers, qualified local and
                overseas buyers, portfolio management, and eventual resale. Every project we
                represent benefits from the full depth of that ecosystem.
              </p>
              <p className="mt-4 max-w-[42ch] text-[13px] leading-[1.9] text-[#8a7b6d]">
                Our model means deeper investor relationships, stronger market understanding, and a
                service connected to the full life cycle of property ownership.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-px border border-[#2d2218] bg-[#2d2218]">
                {[
                  'Independent channel partner, not tied to one developer',
                  'Commission-based representation for suitable developments',
                  'Local & overseas qualified buyer network',
                  'Experience across sourcing, selling, managing & resale',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 bg-[#1a1410] px-4 py-4">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8a96e]" />
                    <p className="text-[12px] leading-[1.75] text-[#8a7b6d]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Three.js canvas column */}
            <div className="relative min-h-[380px] bg-[#1e1a15] lg:min-h-0">
              {mounted && (
                <div className="absolute inset-0" aria-hidden="true">
                  <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true }}>
                    <color attach="background" args={['#1e1a15']} />
                    <NetworkScene />
                  </Canvas>
                </div>
              )}
              <p className="pointer-events-none absolute bottom-5 right-6 z-10 text-right text-[10px] uppercase tracking-[0.22em] text-[#2d2218]">
                Developer Ecosystem
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── S3: Why Partner ──────────────────────────────────────────────── */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-8">
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 mb-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b6d]">
              Why Partner With PPM
            </p>
            <h2 className="text-2xl lg:text-3xl font-light text-[#1f1a17]">
              Built on experience, trust, and long-term investor relationships
            </h2>
          </div>

          <div className="grid gap-px bg-[#f0ebe4] sm:grid-cols-3">
            {partnershipBenefits.map((benefit) => (
              <div key={benefit.title} className="bg-white p-10">
                <h3 className="text-[16px] font-semibold text-[#1f1a17] leading-snug">
                  {benefit.title}
                </h3>
                <div className="mt-4 w-6 border-t border-[#ddd3c6]" />
                <p className="mt-5 text-[13px] leading-[1.85] text-[#5b5147]">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── S4: Process ──────────────────────────────────────────────────── */}
      <section className="bg-[#f6f2eb] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-8">
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 mb-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b6d]">Process</p>
            <h2 className="text-2xl lg:text-3xl font-light text-[#1f1a17]">
              A straightforward partnership approach
            </h2>
          </div>

          <div className="border-l-2 border-[#ddd3c6] pl-8 lg:pl-14">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="grid grid-cols-[2.5rem_1fr] lg:grid-cols-[2.5rem_10rem_1fr] gap-x-6 lg:gap-x-10 gap-y-1 py-9 border-b border-[#e8e2da] last:border-b-0"
              >
                <p className="text-[2.6rem] font-thin text-[#e0d8d0] tabular-nums leading-none select-none row-span-2 lg:row-span-1 self-center">
                  {step.step}
                </p>
                <p className="text-[15px] font-semibold text-[#1f1a17] self-center">
                  {step.title}
                </p>
                <p className="col-start-2 lg:col-start-3 text-[13px] leading-[1.85] text-[#5b5147] max-w-[52ch]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── S5: End-to-End Model ─────────────────────────────────────────── */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid lg:grid-cols-[5fr_7fr] gap-16 lg:gap-24 lg:items-start">

            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b6d] mb-6">
                End-to-End Model
              </p>
              <h2 className="text-3xl lg:text-[2.75rem] font-light leading-[1.2] text-[#1f1a17]">
                Beyond a single transaction.
              </h2>
              <div className="mt-8 space-y-5 text-[13px] leading-[1.9] text-[#5b5147]">
                <p>
                  PPM&apos;s broader model extends beyond simply introducing a buyer to a project.
                  We are built around a wider investment journey that continues through portfolio
                  management and eventual resale.
                </p>
                <p>
                  That matters to developers because it reflects deeper investor relationships,
                  stronger market understanding, and a service connected to the full life cycle of
                  property ownership.
                </p>
              </div>
            </div>

            <div className="border border-[#e3d8ca] bg-[#fbf8f3] p-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a7b6d]">
                The Lifecycle
              </p>
              <div className="mt-8 space-y-6">
                {[
                  'Source the right opportunity',
                  'Support the buyer journey',
                  'Manage long-term investor relationships',
                  'Assist with future resale & reinvestment',
                ].map((label, i) => (
                  <div key={label} className="flex items-start gap-5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#ddd3c6] text-[11px] font-semibold text-[#2f2a24]">
                      {i + 1}
                    </div>
                    <p className="pt-1 text-[13px] leading-6 text-[#5b5147]">{label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── S6: Closing CTA ──────────────────────────────────────────────── */}
      <section className="bg-[#1c1814] py-32 lg:py-44">
        <div className="mx-auto max-w-7xl px-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#4a3f37]">
            Work With PPM
          </p>
          <h2 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-light text-white leading-[1.06]">
            Ready to discuss<br />your development?
          </h2>
          <p className="mt-6 text-[14px] text-[#8a7b6d] max-w-[40ch] mx-auto leading-[1.9]">
            Contact our team to explore how PPM can support your project through commission-based
            representation and premium market positioning.
          </p>
          <div className="mt-14">
            <Link
              href="/contact/developers"
              className="text-[12px] uppercase tracking-[0.22em] text-white border-b border-white/25 pb-0.5 transition hover:border-white"
            >
              Contact Us →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
