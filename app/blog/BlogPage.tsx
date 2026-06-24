'use client'
import { useRef, useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { BlogPageContentData } from '@/lib/blog-page-defaults'

// ─── Three.js: rippling particle-wave grid ────────────────────────────────────
type BlogCard = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  category: string;
};

function ParticleWave({ cols, rows }: { cols: number; rows: number }) {
  const ref    = useRef<THREE.Points>(null)
  const SPACE  = 0.4
  const count  = cols * rows

  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i       = r * cols + c
        pos[i * 3]     = (c - cols / 2) * SPACE
        pos[i * 3 + 1] = (r - rows / 2) * SPACE
        pos[i * 3 + 2] = 0
        col[i * 3] = 0.17; col[i * 3 + 1] = 0.13; col[i * 3 + 2] = 0.09
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color',    new THREE.BufferAttribute(col, 3))
    return g
  }, [cols, rows, count])

  const cPeak = useMemo(() => new THREE.Color('#c8a96e'), [])
  const cBase = useMemo(() => new THREE.Color('#2d2218'), [])
  const cTmp  = useMemo(() => new THREE.Color(), [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t   = clock.getElapsedTime()
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    const col = ref.current.geometry.attributes.color.array  as Float32Array

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i  = r * cols + c
        const x  = pos[i * 3]
        const y  = pos[i * 3 + 1]
        const z  = Math.sin(x * 0.85 + t * 0.7) * Math.cos(y * 0.55 + t * 0.38) * 0.65
        pos[i * 3 + 2] = z

        const t01 = Math.max(0, Math.min(1, (z + 0.65) / 1.3))
        cTmp.copy(cBase).lerp(cPeak, t01)
        col[i * 3]     = cTmp.r
        col[i * 3 + 1] = cTmp.g
        col[i * 3 + 2] = cTmp.b
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.geometry.attributes.color.needsUpdate    = true
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.052}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPage({ content }: { content: BlogPageContentData }) {
  const [blogPosts, setBlogPosts] = useState<BlogCard[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        setBlogPosts(data);
        setLoadingPosts(false);
      });
  }, []);

  const [mounted,  setMounted]  = useState(false)
  const [gridSize, setGridSize] = useState({ cols: 32, rows: 22 })

  useEffect(() => {
    const mobile = window.innerWidth < 768
    setGridSize(mobile ? { cols: 18, rows: 14 } : { cols: 32, rows: 22 })
    setMounted(true)
  }, [])

  if (loadingPosts) {
    return (
      <main className="min-h-screen bg-white text-[#1f1a17]">
        <Navbar />
        <section className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-[#8a7b6d]">Loading insights…</p>
        </section>
        <Footer />
      </main>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <main className="min-h-screen bg-white text-[#1f1a17]">
        <Navbar />
        <section className="flex min-h-[60vh] flex-col items-center justify-center px-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">
            PPM Insights
          </p>
          <h1 className="mt-4 text-4xl font-light">No articles published yet.</h1>
        </section>
        <Footer />
      </main>
    );
  }

  const featured  = blogPosts[0]
  const secondary = blogPosts.slice(1, 3)
  const tertiary  = blogPosts.slice(3)

  return (
    <main className="min-h-screen w-full bg-white text-[#1f1a17]">
      <Navbar />

      {/* ── Hero — particle wave ──────────────────────────────────────────── */}
      <section className="relative min-h-[72vh] bg-[#0a0806] flex flex-col justify-end overflow-hidden">
        {mounted && (
          <div className="absolute inset-0" aria-hidden="true">
            <Canvas
              camera={{ position: [0, 0, 8], fov: 55 }}
              gl={{ antialias: false }}
              dpr={[1, 1.5]}
            >
              <color attach="background" args={['#0a0806']} />
              <ParticleWave cols={gridSize.cols} rows={gridSize.rows} />
            </Canvas>
          </div>
        )}

        {/* Content sits at the bottom of the hero */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-8 pb-16 pt-32">
          <div className="border-b border-[#2d2218] pb-7 flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#8a7b6d]">PPM Insights</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4a3f37]">
              {blogPosts.length}&nbsp;Articles
            </p>
          </div>

          <div className="mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-light leading-[1.0] text-white">
              {content.heroHeadingMain}&nbsp;
              <em className="not-italic text-[#c8a96e]">{content.heroHeadingAccent}</em>
            </h1>
            <p className="md:max-w-[28ch] text-[13px] leading-[1.9] text-[#8a7b6d] md:pb-2">
              {content.heroSubtext}
            </p>
          </div>
        </div>
      </section>

      {/* ── Featured post ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-8 pt-16">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a7b6d] mb-8">Latest</p>

        <Link
          href={`/blog/${featured.slug}`}
          className="group grid lg:grid-cols-[3fr_2fr] border border-[#e8e2d9] overflow-hidden"
        >
          <div className="overflow-hidden bg-[#e3dbd0]">
            {featured.image ? (
              <img
                src={featured.image}
                alt={featured.title}
                className="h-[320px] lg:h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="h-[320px] lg:h-full w-full bg-[#e3dbd0]" />
            )}
          </div>
          <div className="flex flex-col justify-between p-10 lg:p-14 bg-[#faf8f5]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#8a7b6d]">
                {featured.category}&nbsp;·&nbsp;{featured.date}
              </p>
              <h2 className="mt-5 text-2xl lg:text-[1.85rem] font-light leading-snug text-[#1f1a17] transition group-hover:text-[#5b5147]">
                {featured.title}
              </h2>
              <div className="mt-5 w-8 border-t border-[#ddd3c6]" />
              <p className="mt-5 text-[13px] leading-[1.85] text-[#5b5147]">
                {featured.description}
              </p>
            </div>
            <div className="mt-10 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1f1a17] transition-all group-hover:gap-4">
              <span>Read Article</span>
              <span className="text-[#c8a96e]">→</span>
            </div>
          </div>
        </Link>
      </section>

      {/* ── Secondary posts (2-col) ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-8 mt-6">
        <div className="grid md:grid-cols-2 gap-6">
          {secondary.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col border border-[#e8e2d9] overflow-hidden"
            >
              <div className="overflow-hidden bg-[#e3dbd0]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-[220px] w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-8 bg-white">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#8a7b6d]">
                  {post.category}&nbsp;·&nbsp;{post.date}
                </p>
                <h2 className="mt-3 flex-1 text-[17px] font-semibold leading-snug text-[#1f1a17] transition group-hover:text-[#5b5147]">
                  {post.title}
                </h2>
                <div className="mt-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a7b6d] transition-all group-hover:text-[#1f1a17] group-hover:gap-4">
                  <span>Read</span>
                  <span className="text-[#c8a96e]">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Tertiary posts (border-list style) ───────────────────────────── */}
      {tertiary.length > 0 && (
        <section className="mx-auto max-w-7xl px-8 mt-6 mb-20">
          <div className="border-t border-[#e8e2d9]">
            {tertiary.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group grid sm:grid-cols-[1fr_auto] items-center gap-6 border-b border-[#e8e2d9] py-7 transition hover:bg-[#faf8f5] px-4 -mx-4"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#8a7b6d] mb-2">
                    {post.category}&nbsp;·&nbsp;{post.date}
                  </p>
                  <h2 className="text-[16px] font-semibold text-[#1f1a17] transition group-hover:text-[#5b5147]">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-[13px] leading-[1.7] text-[#8a7b6d] max-w-[60ch] hidden sm:block">
                    {post.description}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c8a96e]">
                  Read →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
