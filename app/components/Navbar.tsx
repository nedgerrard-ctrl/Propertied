'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'

// ─── Link data ────────────────────────────────────────────────────────────────

const BUYERS_DROPDOWN = [
  { href: '/buyers/investors',       label: 'Investors' },
  { href: '/buyers/owner-occupiers', label: 'Owner-Occupiers' },
]

const ALL_PRIMARY_LINKS = [
  { href: '/',            label: 'Home',         slug: 'landing' },
  { href: '/about',       label: 'About',        slug: 'about' },
  { href: '/our-people',  label: 'Our People',   slug: 'our-people' },
  { href: '/developer',   label: 'Developers',   slug: 'developer' },
  { href: '/blog',        label: 'Blog',         slug: null },
  { href: '/testimonial', label: 'Testimonials', slug: 'testimonial' },
]


function getInitials(name?: string | null) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function ProfileDropdown({ name, dashboardHref }: { name?: string | null; dashboardHref: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c8a96e] text-[10px] font-bold uppercase tracking-wide text-[#0f0c0a] transition hover:opacity-80"
      >
        {getInitials(name)}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-40 overflow-hidden rounded-lg border border-white/10 bg-[#1a1512] shadow-xl">
          <Link
            href={dashboardHref}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#c8a96e] transition hover:bg-white/5"
          >
            <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            My Portal
          </Link>
          <div className="mx-4 h-px bg-white/10" />
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex w-full items-center gap-2.5 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-red-400 transition hover:bg-white/5"
          >
            <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar({ blackBg }: { blackBg?: boolean } = {}) {
  const pathname = usePathname()
  const { data: session } = useSession()

  // hasLoaded gates the entrance animation — flips true after ~1.6 s
  const [hasLoaded,    setHasLoaded]    = useState(false)
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [visibleSlugs, setVisibleSlugs] = useState<string[] | null>(null)
  const [buyersOpen,   setBuyersOpen]   = useState(false)
  const [mobileBuyersOpen, setMobileBuyersOpen] = useState(false)

  const mobileOpenRef = useRef(false)
  const buyersRef     = useRef<HTMLDivElement>(null)

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

  // ── Buyers dropdown close-on-outside-click ───────────────────────────────

  useEffect(() => {
    if (!buyersOpen) return
    function onClickOutside(e: MouseEvent) {
      if (buyersRef.current && !buyersRef.current.contains(e.target as Node)) {
        setBuyersOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [buyersOpen])

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

  const showBuyers = visibleSlugs === null || visibleSlugs.includes('buyer')
  const buyersActive = pathname.startsWith('/buyers')

  // ─── Palette tokens ───────────────────────────────────────────────────────

  const isLoginPage  = pathname === '/login'
  const isSignupPage = pathname === '/signup'
  const bg           = scrolled
    ? 'bg-white border-b border-gray-200 shadow-sm'
    : blackBg
    ? 'bg-[#0f0c0a]'
    : isLoginPage || isSignupPage
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
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
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

          {/* Home, About */}
          {PRIMARY_LINKS.slice(0, 2).map((link) => {
            const active = isActive(link.href)
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
          })}

          {/* Buyers dropdown */}
          {showBuyers && (
            <div ref={buyersRef} className="relative">
              <button
                onClick={() => setBuyersOpen((v) => !v)}
                className={[
                  'relative flex items-center gap-1 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors duration-500',
                  buyersActive ? linkActive : linkBase,
                ].join(' ')}
              >
                Buyers
                <svg
                  className={`h-2.5 w-2.5 transition-transform duration-200 ${buyersOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 10 6" fill="currentColor"
                >
                  <path d="M0 0l5 6 5-6H0z" />
                </svg>
                {buyersActive && <span className="absolute bottom-0 left-3 right-3 h-px bg-[#c8a96e]" />}
              </button>

              {buyersOpen && (
                <div className={`absolute left-0 top-full z-50 mt-1 min-w-[180px] overflow-hidden border shadow-xl ${scrolled ? 'border-gray-200 bg-white' : 'border-white/10 bg-[#1a1512]'}`}>
                  {BUYERS_DROPDOWN.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setBuyersOpen(false)}
                      className={[
                        'flex items-center px-4 py-3 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors',
                        scrolled
                          ? 'text-[#4a3d35] hover:bg-neutral-50 hover:text-[#0f0c0a]'
                          : 'text-white/70 hover:bg-white/5 hover:text-white',
                        pathname === item.href ? (scrolled ? 'text-[#0f0c0a] font-semibold' : 'text-white font-semibold') : '',
                      ].join(' ')}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Developers, Blog, Testimonials */}
          {PRIMARY_LINKS.slice(2).map((link) => {
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
                {active && <span className="absolute bottom-0 left-3 right-3 h-px bg-[#c8a96e]" />}
              </Link>
            )
          })}

          <span className={`mx-3 h-4 w-px transition-colors duration-500 ${sepColor}`} />

          {isLoggedIn ? (
            <>
              <ProfileDropdown name={session.user?.name} dashboardHref={dashboardHref} />
              <Link
                href="/contact"
                className="ml-3 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] border transition border-[#c8a96e] text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#0f0c0a]"
              >
                Contact
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={[
                  'relative px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors duration-500',
                  isActive('/login') ? linkActive : linkBase,
                ].join(' ')}
              >
                Login
                {isActive('/login') && <span className="absolute bottom-0 left-3 right-3 h-px bg-[#c8a96e]" />}
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] bg-[#c8a96e] text-[#0f0c0a] transition hover:bg-[#b89464]"
              >
                Sign Up
              </Link>
              <Link
                href="/contact"
                className="ml-1 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] border transition border-[#c8a96e] text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#0f0c0a]"
              >
                Contact
              </Link>
            </>
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
          {/* Home, About */}
          {PRIMARY_LINKS.slice(0, 2).map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.label}
                href={link.href}
                className={[
                  'flex items-center justify-between py-4 text-[11px] font-medium uppercase tracking-[0.16em]',
                  'border-b border-white/[0.06] transition',
                  active ? 'text-white' : 'text-[#9e8d7a]',
                ].join(' ')}
                onClick={closeMobile}
              >
                <span>{link.label}</span>
                {active && <span className="h-1 w-1 rounded-full bg-[#c8a96e]" />}
              </Link>
            )
          })}

          {/* Buyers expandable */}
          {showBuyers && (
            <div className="border-b border-white/[0.06]">
              <button
                onClick={() => setMobileBuyersOpen((v) => !v)}
                className={[
                  'flex w-full items-center justify-between py-4 text-[11px] font-medium uppercase tracking-[0.16em] transition',
                  buyersActive ? 'text-white' : 'text-[#9e8d7a]',
                ].join(' ')}
              >
                <span>Buyers</span>
                <svg
                  className={`h-3 w-3 transition-transform duration-200 ${mobileBuyersOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 10 6" fill="currentColor"
                >
                  <path d="M0 0l5 6 5-6H0z" />
                </svg>
              </button>
              {mobileBuyersOpen && (
                <div className="mb-2 ml-3 flex flex-col gap-0.5">
                  {BUYERS_DROPDOWN.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => { setMobileBuyersOpen(false); closeMobile() }}
                      className={[
                        'flex items-center justify-between py-3 pl-3 text-[11px] font-medium uppercase tracking-[0.16em] transition',
                        'border-l border-[#c8a96e]/30',
                        pathname === item.href ? 'text-[#c8a96e]' : 'text-[#6b5e54] hover:text-white',
                      ].join(' ')}
                    >
                      <span>{item.label}</span>
                      {pathname === item.href && <span className="h-1 w-1 rounded-full bg-[#c8a96e]" />}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Developers, Blog, Testimonials */}
          {PRIMARY_LINKS.slice(2).map((link) => {
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
            <>
              <Link
                href={dashboardHref}
                className="flex items-center justify-between py-4 text-[11px] font-medium uppercase tracking-[0.16em] border-b border-white/[0.06] text-[#9e8d7a] transition hover:text-white"
                onClick={closeMobile}
              >
                <span>My Portal</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c8a96e] text-[9px] font-bold text-[#0f0c0a]">
                  {getInitials(session.user?.name)}
                </span>
              </Link>
              <button
                onClick={() => { closeMobile(); signOut({ callbackUrl: '/login' }) }}
                className="flex w-full items-center justify-between py-4 text-[11px] font-medium uppercase tracking-[0.16em] text-red-400 transition hover:text-red-300"
              >
                <span>Logout</span>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </>
          ) : (
            <>
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
              <Link
                href="/signup"
                className={[
                  'flex items-center justify-between py-4 text-[11px] font-medium uppercase tracking-[0.16em]',
                  'border-b border-white/[0.06] transition',
                  isActive('/signup') ? 'text-[#c8a96e]' : 'text-[#c8a96e]/70 hover:text-[#c8a96e]',
                ].join(' ')}
                onClick={closeMobile}
              >
                <span>Sign Up</span>
                {isActive('/signup') && <span className="h-1 w-1 rounded-full bg-[#c8a96e]" />}
              </Link>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  )
}
