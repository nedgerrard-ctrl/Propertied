'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'

// ─── Link data ────────────────────────────────────────────────────────────────

const ALL_PRIMARY_LINKS = [
  { href: '/',            label: 'Home',         slug: 'landing' },
  { href: '/about',       label: 'About',        slug: 'about' },
  { href: '/buyers',      label: 'Buyers',       slug: 'buyer' },
  { href: '/developer',   label: 'Developers',   slug: 'developer' },
  { href: '/blog',        label: 'Blog',         slug: null },
  { href: '/testimonial', label: 'Testimonials', slug: 'testimonial' },
]

const UTIL_LINKS = [
  { href: '/login',   label: 'Login',   cta: false },
  { href: '/contact', label: 'Contact', cta: true  },
]

function getInitials(name?: string | null) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function ProfileIcon({ name, dashboardHref }: { name?: string | null; dashboardHref: string }) {
  return (
    <Link
      href={dashboardHref}
      title="My Portal"
      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c8a96e] text-[10px] font-bold uppercase tracking-wide text-[#0f0c0a] transition hover:opacity-80"
    >
      {getInitials(name)}
    </Link>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  // hasLoaded gates the entrance animation — flips true after ~1.6 s
  const [hasLoaded,    setHasLoaded]    = useState(false)
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [visibleSlugs, setVisibleSlugs] = useState<string[] | null>(null)

  const mobileOpenRef = useRef(false)

  const isLoggedIn = !!session?.user
  const dashboardHref =
    session?.user?.role === 'admin'
      ? '/admin/dashboard'
      : session?.user?.userType === 'developer'
      ? '/developer/dashboard'
      : '/client/dashboard'

  const isActive = (href: string) =>
    href !== '#' &&
    (href === '/' ? pathname === '/' : pathname.startsWith(href))

  // ── Entrance delay — only on the home page ────────────────────────────────

  useEffect(() => {
    if (pathname !== '/') {
      setHasLoaded(true)
      return
    }
    const t = setTimeout(() => setHasLoaded(true), 500)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Scroll detection ──────────────────────────────────────────────────────

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── CMS page visibility ───────────────────────────────────────────────────

  useEffect(() => {
    fetch('/api/public/cms-pages')
      .then((r) => r.json())
      .then((slugs: string[]) => setVisibleSlugs(slugs))
      .catch(() => setVisibleSlugs(null))
  }, [])

  // ── Mobile menu ───────────────────────────────────────────────────────────

  const toggleMobile = useCallback(() => {
    const next = !mobileOpenRef.current
    mobileOpenRef.current = next
    setMobileOpen(next)
  }, [])

  const closeMobile = useCallback(() => {
    mobileOpenRef.current = false
    setMobileOpen(false)
  }, [])

  const PRIMARY_LINKS = visibleSlugs === null
    ? ALL_PRIMARY_LINKS
    : ALL_PRIMARY_LINKS.filter((l) => l.slug === null || visibleSlugs.includes(l.slug))

  // ─── Palette tokens ───────────────────────────────────────────────────────

  const isLoginPage = pathname === '/login'
  const bg          = scrolled
    ? 'bg-white border-b border-gray-200 shadow-sm'
    : isLoginPage
    ? 'bg-[#0f0c0a]/50 backdrop-blur-md'
    : 'bg-transparent'
  const logoColor  = scrolled ? 'text-[#0f0c0a]'                      : 'text-white'
  const subColor   = scrolled ? 'text-[#6b5e54]'                      : 'text-[#c8a96e]/70'
  const linkBase   = scrolled ? 'text-[#4a3d35] hover:text-[#0f0c0a]' : 'text-white/70 hover:text-white'
  const linkActive = scrolled ? 'text-[#0f0c0a]'                      : 'text-white'
  const sepColor   = scrolled ? 'bg-[#0f0c0a]/15'                     : 'bg-white/10'
  const barColor   = scrolled ? 'bg-[#0f0c0a]'                        : 'bg-[#e8d8c4]'

  // ─── Framer Motion variants ───────────────────────────────────────────────

  const navVariants = {
    hidden:  { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <motion.header
      variants={navVariants}
      initial="hidden"
      animate={hasLoaded ? 'visible' : 'hidden'}
      className={[
        'fixed top-0 left-0 right-0 z-50',
        'transition-[background-color,border-color,box-shadow] duration-500 ease-in-out',
        bg,
      ].join(' ')}
    >
      {/* ── Main row ──────────────────────────────────────────────────────── */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-3.5">

        {/* Logo — fades and collapses on desktop when scrolled */}
        <Link
          href="/"
          tabIndex={scrolled ? -1 : undefined}
          className={[
            'group flex items-center gap-3 shrink-0 overflow-hidden',
            'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
            scrolled
              ? 'opacity-0 pointer-events-none lg:max-w-0'
              : 'opacity-100 max-w-[200px]',
          ].join(' ')}
        >
          <span className="block h-7 w-0.5 bg-[#c8a96e]" />
          <span>
            <span className={`block text-[13px] font-bold uppercase tracking-[0.22em] leading-none transition-colors duration-500 ${logoColor} group-hover:opacity-70`}>
              PPM
            </span>
            <span className={`block text-[8.5px] uppercase tracking-[0.14em] mt-1 leading-none transition-colors duration-500 ${subColor} group-hover:opacity-70`}>
              Property Project Marketing
            </span>
          </span>
        </Link>

        {/* ── Desktop nav — centers when scrolled ───────────────────────── */}
        <nav className={[
          'hidden lg:flex items-center gap-1',
          'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          scrolled ? 'flex-1 justify-center' : '',
        ].join(' ')}>

          {PRIMARY_LINKS.map((link) => {
            const active      = isActive(link.href)
            const placeholder = link.href === '#'
            return (
              <Link
                key={link.label}
                href={link.href}
                className={[
                  'relative px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors duration-500',
                  placeholder ? 'text-[#3d3530] cursor-default pointer-events-none' :
                    active ? linkActive : linkBase,
                ].join(' ')}
                tabIndex={placeholder ? -1 : undefined}
                aria-disabled={placeholder}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-px bg-[#c8a96e]" />
                )}
              </Link>
            )
          })}

          <span className={`mx-3 h-4 w-px transition-colors duration-500 ${sepColor}`} />

          {isLoggedIn ? (
            <>
              <ProfileIcon name={session.user?.name} dashboardHref={dashboardHref} />
              <Link
                href="/contact"
                className="ml-3 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] border transition border-[#c8a96e] text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#0f0c0a]"
              >
                Contact
              </Link>
            </>
          ) : (
            UTIL_LINKS.map((link) => {
              const active = isActive(link.href)
              if (link.cta) {
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="ml-1 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] border transition border-[#c8a96e] text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#0f0c0a]"
                  >
                    {link.label}
                  </Link>
                )
              }
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={[
                    'relative px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors duration-500',
                    active ? linkActive : linkBase,
                  ].join(' ')}
                >
                  {link.label}
                  {active && <span className="absolute bottom-0 left-3 right-3 h-px bg-[#c8a96e]" />}
                </Link>
              )
            })
          )}
        </nav>

        {/* ── Mobile hamburger ──────────────────────────────────────────── */}
        <button
          className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] lg:hidden"
          onClick={toggleMobile}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {(['top', 'mid', 'bot'] as const).map((id) => (
            <span
              key={id}
              className={[
                'block h-px w-6 origin-center transition-all duration-200',
                barColor,
                id === 'top' && mobileOpen ? 'translate-y-[5.5px] rotate-45'   : '',
                id === 'mid' && mobileOpen ? 'scale-x-0 opacity-0'              : '',
                id === 'bot' && mobileOpen ? '-translate-y-[5.5px] -rotate-45' : '',
              ].join(' ')}
            />
          ))}
        </button>
      </div>

      {/* ── Mobile dropdown ───────────────────────────────────────────────── */}
      <div
        aria-hidden={!mobileOpen}
        className={[
          'overflow-hidden lg:hidden',
          'transition-[max-height,opacity] duration-300 ease-in-out',
          mobileOpen ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="h-px bg-gradient-to-r from-[#c8a96e] via-[#c8a96e]/40 to-transparent" />

        <nav className="flex flex-col px-8 pb-4 pt-2 bg-[#0f0c0a]">
          {PRIMARY_LINKS.map((link) => {
            const active      = isActive(link.href)
            const placeholder = link.href === '#'
            return (
              <Link
                key={link.label}
                href={link.href}
                tabIndex={placeholder ? -1 : undefined}
                aria-disabled={placeholder}
                className={[
                  'flex items-center justify-between py-4 text-[11px] font-medium uppercase tracking-[0.16em]',
                  'border-b border-white/[0.06] transition',
                  placeholder
                    ? 'text-[#2d2218] pointer-events-none cursor-default'
                    : active
                    ? 'text-white'
                    : 'text-[#9e8d7a]',
                ].join(' ')}
                onClick={placeholder ? undefined : closeMobile}
              >
                <span>{link.label}</span>
                {active && !placeholder && (
                  <span className="h-1 w-1 rounded-full bg-[#c8a96e]" />
                )}
              </Link>
            )
          })}

          <Link
            href="/contact"
            className="flex items-center justify-between py-4 text-[11px] font-medium uppercase tracking-[0.16em] border-b border-white/[0.06] text-[#c8a96e] transition"
            onClick={closeMobile}
          >
            <span>Contact</span>
            <span className="text-[#c8a96e]">→</span>
          </Link>

          {isLoggedIn ? (
            <Link
              href={dashboardHref}
              className="flex items-center justify-between py-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[#9e8d7a] transition hover:text-white"
              onClick={closeMobile}
            >
              <span>My Portal</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c8a96e] text-[9px] font-bold text-[#0f0c0a]">
                {getInitials(session.user?.name)}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className={[
                'flex items-center justify-between py-4 text-[11px] font-medium uppercase tracking-[0.16em]',
                'border-b border-white/[0.06] transition',
                isActive('/login') ? 'text-white' : 'text-[#9e8d7a]',
              ].join(' ')}
              onClick={closeMobile}
            >
              <span>Login</span>
              {isActive('/login') && <span className="h-1 w-1 rounded-full bg-[#c8a96e]" />}
            </Link>
          )}
        </nav>
      </div>
    </motion.header>
  )
}
